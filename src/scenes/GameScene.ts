import Phaser from 'phaser';
import { SCENES } from '../config/constants';
import { LevelConfig } from '../config/types';
import { getLevelById } from '../config/levels';
import { UNIVERSES } from '../config/universes';
import { Grid } from '../core/Grid';
import { createSnake, stepSnake, SnakeState } from '../core/Snake';
import { spawnPickup } from '../core/Spawn';
import { Cell, cellKey } from '../core/Grid';
import { BaseMechanic } from '../mechanics/BaseMechanic';
import { createMechanic } from '../mechanics/MechanicFactory';
import { SonicRingsMechanic } from '../mechanics/SonicRingsMechanic';
import { ShinobiFocusMechanic } from '../mechanics/ShinobiFocusMechanic';
import { BaseBoss } from '../mechanics/bosses/BaseBoss';
import { GridRenderer, computeGridLayout, GridLayout } from '../render/GridRenderer';
import { SnakeRenderer } from '../render/SnakeRenderer';
import { PickupRenderer } from '../render/PickupRenderer';
import { ObstacleRenderer } from '../render/ObstacleRenderer';
import { HUDRenderer } from '../render/HUDRenderer';
import { InputSystem } from '../systems/InputSystem';
import { AudioSystem } from '../systems/AudioSystem';
import { SaveSystem } from '../systems/SaveSystem';
import { DesignBoardManager } from '../systems/DesignBoardManager';
import { MAP_NODES } from '../config/mapNodes';

const GRID_COLS = 16;
const GRID_ROWS = 20;

export interface GameSceneData {
  levelId: string;
}

export class GameScene extends Phaser.Scene {
  private levelConfig!: LevelConfig;
  private grid!: Grid;
  private snake!: SnakeState;
  private mechanic!: BaseMechanic;
  private pickups: Cell[] = [];
  private walls: Cell[] = [];
  private score = 0;
  private tickCount = 0;
  private tickAccumulator = 0;
  private gameOver = false;
  private cleared = false;
  private layout!: GridLayout;

  // Pre-parsed palette colors — computed once in create(), never in render()
  private colorBg = 0x000000;
  private colorPrimary = 0x888888;
  private colorAccent = 0xffffff;

  private gridRenderer!: GridRenderer;
  private snakeRenderer!: SnakeRenderer;
  private pickupRenderer!: PickupRenderer;
  private obstacleRenderer!: ObstacleRenderer;
  private hudRenderer!: HUDRenderer;
  private inputSys!: InputSystem;
  private debugAssetsOverlay: Phaser.GameObjects.Text | null = null;

  constructor() {
    super(SCENES.GAME);
  }

  init(data: GameSceneData): void {
    const levelId = data?.levelId ?? 'castle_normal';
    this.levelConfig = getLevelById(levelId) ?? getLevelById('castle_normal')!;
  }

  preload(): void {
    const uid = this.levelConfig.universeId;
    const base = `assets/universes/${uid}`;
    const assetKeys: Array<[string, string]> = [
      [`db_${uid}_pickup01`,   `${base}/pickup_01.png`],
      [`db_${uid}_pickup02`,   `${base}/pickup_02.png`],
      [`db_${uid}_obstacle01`, `${base}/obstacle_01.png`],
      [`db_${uid}_obstacle02`, `${base}/obstacle_02.png`],
      [`db_${uid}_boss`,       `${base}/boss.png`],
      [`db_${uid}_frame`,      `${base}/frame_tile.png`],
      [`db_${uid}_hudPanel`,   `${base}/hud_panel.png`],
    ];
    for (const [key, path] of assetKeys) {
      if (!this.textures.exists(key)) this.load.image(key, path);
    }
    if (!this.cache.json.exists('design_board_manifest')) {
      this.load.json('design_board_manifest', 'assets/design-board-manifest.json');
    }
  }

  create(): void {
    AudioSystem.resume();
    const { width, height } = this.scale;
    const universe = UNIVERSES[this.levelConfig.universeId];
    const palette = universe.palette;

    // Parse palette once — never touch hex strings again during gameplay
    this.colorBg      = parseInt(palette.bg.replace('#', ''), 16);
    this.colorPrimary = parseInt(palette.primary.replace('#', ''), 16);
    this.colorAccent  = parseInt(palette.accent.replace('#', ''), 16);

    this.add.rectangle(width / 2, height / 2, width, height, this.colorBg);

    this.grid = new Grid(GRID_COLS, GRID_ROWS);
    this.layout = computeGridLayout(width, height, GRID_COLS, GRID_ROWS, 56, 44);

    // Renderers
    this.gridRenderer = new GridRenderer(this, this.layout);
    this.snakeRenderer = new SnakeRenderer(this);
    this.pickupRenderer = new PickupRenderer(this);
    this.obstacleRenderer = new ObstacleRenderer(this);
    this.hudRenderer = new HUDRenderer(this, palette.accent);
    this.snakeRenderer.setDepth(3);

    // Passer les asset keys aux renderers si les textures sont chargées
    const uid = this.levelConfig.universeId;
    const pickupKey = `db_${uid}_pickup01`;
    if (this.textures.exists(pickupKey)) this.pickupRenderer.setTextureKey(pickupKey);
    const bossKey = `db_${uid}_boss`;
    if (this.textures.exists(bossKey)) this.obstacleRenderer.setBossTextureKey(bossKey);

    // Grid is STATIC — draw once here, never again in the game loop
    this.gridRenderer.draw(this.colorBg, this.colorPrimary);

    // Debug overlay ?debugAssets=1
    if (new URLSearchParams(window.location.search).get('debugAssets') === '1') {
      this.createDebugAssetsOverlay(uid);
    }

    this.snake = createSnake(5, Math.floor(GRID_ROWS / 2));
    this.score = 0;
    this.tickCount = 0;
    this.tickAccumulator = 0;
    this.gameOver = false;
    this.cleared = false;

    this.mechanic = createMechanic(this.levelConfig.mechanic);
    this.mechanic.init({
      snake: this.snake,
      grid: { cols: GRID_COLS, rows: GRID_ROWS },
      levelConfig: this.levelConfig,
      pickups: this.pickups,
      walls: this.walls,
      score: this.score,
      quota: this.levelConfig.quota ?? 10,
      elapsed: 0
    });

    this.spawnInitialPickup();

    this.inputSys = new InputSystem(this);
    this.inputSys.bind(this.snake);

    // Back button — created once
    this.add.text(width / 2, height - 22, '< MAP', {
      fontFamily: 'monospace', fontSize: '13px', color: '#ffffff'
    }).setOrigin(0.5).setDepth(10).setInteractive().on('pointerdown', () => {
      this.scene.start(SCENES.WORLD_MAP);
    });

    // Cleanup on scene shutdown to avoid listener accumulation on retry
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.inputSys?.destroy();
    });
  }

  private createDebugAssetsOverlay(uid: string): void {
    const manifestData = this.cache.json.get('design_board_manifest') as Record<string, unknown> | null;
    const universeEntry = (manifestData?.universes as Record<string, unknown> | undefined)?.[uid] as Record<string, unknown> | undefined;
    const boardSource = universeEntry?.boardSource as string ?? '(manifest non chargé)';
    const isFallback  = universeEntry?.fallback as boolean ?? true;
    const assetKeys = [
      `db_${uid}_pickup01`, `db_${uid}_pickup02`,
      `db_${uid}_obstacle01`, `db_${uid}_boss`
    ];
    const loaded = assetKeys.filter(k => this.textures.exists(k));

    const lines = [
      `[DEBUG ASSETS] univers: ${uid}`,
      `board: ${boardSource}`,
      `fallback: ${isFallback}`,
      `textures chargées: ${loaded.length}/${assetKeys.length}`,
      ...loaded.map(k => `  ✓ ${k}`),
    ];

    this.debugAssetsOverlay = this.add.text(4, 58, lines.join('\n'), {
      fontFamily: 'monospace',
      fontSize: '9px',
      color: '#00ff88',
      backgroundColor: '#000000cc',
      padding: { x: 4, y: 2 }
    }).setDepth(20).setScrollFactor(0);
  }

  private spawnInitialPickup(): void {
    if (this.mechanic instanceof SonicRingsMechanic) {
      this.pickups = (this.mechanic as SonicRingsMechanic).getChainPickups();
      return;
    }
    if (this.mechanic instanceof ShinobiFocusMechanic) {
      this.pickups = (this.mechanic as ShinobiFocusMechanic).getRealTargetPickups();
      return;
    }
    const p = spawnPickup(this.grid, this.snake, this.walls);
    if (p) this.pickups = [p];
  }

  update(time: number, delta: number): void {
    if (this.gameOver || this.cleared) return;

    this.inputSys.pollKeyboard();

    // Pickup animation runs EVERY FRAME (60fps) — independent of game logic tick
    const activePickups = this.getActivePickups();
    this.pickupRenderer.draw(activePickups, this.layout, this.colorAccent, time);

    // Fixed-step accumulator — game logic runs at speedMs interval regardless of FPS
    this.tickAccumulator += delta;
    if (this.tickAccumulator < this.levelConfig.speedMs) return;
    // Consume one tick (cap at 1 to avoid spiral-of-death on slow frames)
    this.tickAccumulator -= this.levelConfig.speedMs;
    this.tickCount++;

    this.syncMechanicCtx();
    const mu = this.mechanic.tick(this.tickCount);

    if (mu.hitDanger) { this.triggerGameOver(); return; }
    if (mu.score !== undefined) this.score += mu.score;

    const pickupSet = new Set<string>(activePickups.map(p => cellKey(p)));
    const wallSet   = new Set<string>(this.walls.map(w => cellKey(w)));
    const result    = stepSnake(this.snake, GRID_COLS, GRID_ROWS, pickupSet, wallSet);

    if (result.hitWall || result.hitSelf) {
      AudioSystem.gameover();
      this.triggerGameOver();
      return;
    }

    if (result.ate) {
      AudioSystem.pickup();
      const eaten = result.head;
      const mr = this.mechanic.onPickupCollected(eaten);
      if (mr.hitDanger) { AudioSystem.danger(); this.triggerGameOver(); return; }
      this.score += mr.score !== undefined ? mr.score : 1;
      this.snake.growing += 1;
      this.pickups = this.pickups.filter(p => !(p.col === eaten.col && p.row === eaten.row));
      this.spawnNextPickup();
      if (this.checkClear()) { this.triggerClear(); return; }
    }

    if (this.mechanic instanceof BaseBoss && (this.mechanic as BaseBoss).isDefeated()) {
      this.triggerClear();
      return;
    }

    this.renderGameState();
  }

  private getActivePickups(): Cell[] {
    if (this.mechanic instanceof SonicRingsMechanic)  return (this.mechanic as SonicRingsMechanic).getChainPickups();
    if (this.mechanic instanceof ShinobiFocusMechanic) return (this.mechanic as ShinobiFocusMechanic).getRealTargetPickups();
    return this.pickups;
  }

  private spawnNextPickup(): void {
    if (this.mechanic instanceof SonicRingsMechanic || this.mechanic instanceof ShinobiFocusMechanic) return;
    if (this.pickups.length < 1) {
      const p = spawnPickup(this.grid, this.snake, this.walls);
      if (p) this.pickups.push(p);
    }
  }

  private checkClear(): boolean {
    if (this.mechanic instanceof BaseBoss) return false;
    return this.score >= (this.levelConfig.quota ?? 10);
  }

  private syncMechanicCtx(): void {
    const ctx = (this.mechanic as unknown as { ctx: unknown })['ctx'] as Record<string, unknown>;
    if (ctx) {
      ctx['snake']   = this.snake;
      ctx['pickups'] = this.pickups;
      ctx['score']   = this.score;
      ctx['elapsed'] = this.tickCount;
    }
  }

  // Called only on game tick — not every frame
  private renderGameState(): void {
    // Grid: dirty flag prevents unnecessary redraws (only redraws on first call per create)
    this.gridRenderer.draw(this.colorBg, this.colorPrimary);

    this.obstacleRenderer.draw(this.mechanic.getExtraEntities(), this.layout);
    this.snakeRenderer.draw(this.snake, this.layout, this.colorAccent, this.colorPrimary);

    const isBoss = this.mechanic instanceof BaseBoss;
    const boss = isBoss ? (this.mechanic as BaseBoss) : null;
    this.hudRenderer.update(
      UNIVERSES[this.levelConfig.universeId].shortName,
      this.levelConfig.ruleText,
      isBoss ? (boss!.getMaxHp() - boss!.getHp()) : this.score,
      isBoss ? undefined : this.levelConfig.quota,
      this.mechanic.getHudExtra()
    );
  }

  private triggerGameOver(): void {
    this.gameOver = true;
    AudioSystem.gameover();
    this.time.delayedCall(600, () => {
      this.scene.start(SCENES.GAME_OVER, { levelId: this.levelConfig.id });
    });
  }

  private triggerClear(): void {
    this.cleared = true;
    AudioSystem.clear();
    const currentNode = MAP_NODES.find(n => n.levelId === this.levelConfig.id);
    const nodeIndex   = currentNode ? MAP_NODES.indexOf(currentNode) : -1;
    const nextNode    = nodeIndex >= 0 && nodeIndex < MAP_NODES.length - 1 ? MAP_NODES[nodeIndex + 1] : undefined;
    SaveSystem.markCleared(this.levelConfig.id, nextNode?.id);
    this.time.delayedCall(400, () => {
      this.scene.start(SCENES.CLEAR, { levelId: this.levelConfig.id });
    });
  }
}
