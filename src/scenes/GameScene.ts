import Phaser from 'phaser';
import { SCENES, UNIVERSE_FRAME_ASSETS } from '../config/constants';
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
import { OutRunLaneMechanic } from '../mechanics/OutRunLaneMechanic';
import { BaseBoss } from '../mechanics/bosses/BaseBoss';
import { GridRenderer, computeGridLayout, GridLayout } from '../render/GridRenderer';
import { SnakeRenderer } from '../render/SnakeRenderer';
import { PickupRenderer } from '../render/PickupRenderer';
import { ObstacleRenderer } from '../render/ObstacleRenderer';
import { HUDRenderer } from '../render/HUDRenderer';
import { UniverseFrameRenderer } from '../render/UniverseFrameRenderer';
import { InputSystem } from '../systems/InputSystem';
import { AudioSystem } from '../systems/AudioSystem';
import { SaveSystem } from '../systems/SaveSystem';
import { DesignBoardManager } from '../systems/DesignBoardManager';
import { MAP_NODES } from '../config/mapNodes';
import { flashScreen, addScanlines } from '../render/VfxUtils';
import { preloadRuntimeAssets, getRuntimeTextureKey } from '../systems/RuntimeAssetResolver';
import { preloadCodexAssets, getCodexTextureKey } from '../systems/CodexAssetResolver';

const GRID_COLS = 16;
const GRID_ROWS = 20;
const FRAME_GRID_WIDTH: Record<string, number> = {
  castle: 0.68,
  sonic: 0.68,
  streets: 0.68,
  fighter: 0.68,
  outrun: 0.68,
  shinobi: 0.68,
  kombat: 0.68,
  paperboy: 0.68,
};

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
  private universeFrameRenderer!: UniverseFrameRenderer;
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
    // 944 — 3 assets runtime de l'univers courant (pickup / obstacle / boss)
    preloadRuntimeAssets(this, uid);
    // codex — assets complémentaires de la banque 8x10
    preloadCodexAssets(this, uid);
    for (const asset of Object.values(UNIVERSE_FRAME_ASSETS)) {
      if (!this.textures.exists(asset.key)) this.load.image(asset.key, asset.url);
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

    this.add.rectangle(width / 2, height / 2, width, height, this.colorBg).setDepth(-2);

    this.grid = new Grid(GRID_COLS, GRID_ROWS);
    const frameAwareWidth = FRAME_GRID_WIDTH[this.levelConfig.universeId] ?? 0.96;
    this.layout = computeGridLayout(width, height, GRID_COLS, GRID_ROWS, 56, 44, frameAwareWidth, 10);

    // 906 — compute asset keys before renderer creation
    const uid        = this.levelConfig.universeId;
    const pickupKey  = `db_${uid}_pickup01`;
    const pickup2Key = `db_${uid}_pickup02`;
    const bossKey    = `db_${uid}_boss`;
    const frameKey   = `db_${uid}_frame`;
    const hudKey     = `db_${uid}_hudPanel`;

    // Renderers
    this.gridRenderer    = new GridRenderer(this, this.layout);
    this.snakeRenderer   = new SnakeRenderer(this);
    this.pickupRenderer  = new PickupRenderer(this);
    this.obstacleRenderer = new ObstacleRenderer(this);
    this.hudRenderer     = new HUDRenderer(this, palette.accent, this.textures.exists(hudKey) ? hudKey : undefined);
    this.universeFrameRenderer = new UniverseFrameRenderer(this);
    this.snakeRenderer.setDepth(3);

    // Wire asset textures to renderers
    if (this.textures.exists(pickupKey))  this.pickupRenderer.setTextureKey(pickupKey);
    if (this.textures.exists(pickup2Key)) this.pickupRenderer.setSecondaryTextureKey(pickup2Key);
    this.pickupRenderer.setUniverseId(uid);
    if (this.textures.exists(bossKey))    this.obstacleRenderer.setBossTextureKey(bossKey);

    // 944 — runtime assets prioritaires sur les db_ si chargés
    const rtPickup = getRuntimeTextureKey(this, uid, 'pickup');
    if (rtPickup) this.pickupRenderer.setTextureKey(rtPickup);
    const rtObstacle = getRuntimeTextureKey(this, uid, 'obstacle');
    if (rtObstacle) this.obstacleRenderer.setObstacleTextureKey(rtObstacle);
    const rtBoss = getRuntimeTextureKey(this, uid, 'boss');
    if (rtBoss) this.obstacleRenderer.setBossTextureKey(rtBoss);

    // codex — fallback si runtime absent, secondary pickup si runtime présent
    // Assets codex = RGB sans alpha → blend ADD pour effacer le fond sur background sombre
    const cdxPickup = getCodexTextureKey(this, uid, 'pickup');
    if (cdxPickup) {
      if (!rtPickup) {
        this.pickupRenderer.setTextureKey(cdxPickup);
        this.pickupRenderer.setImageBlendMode(Phaser.BlendModes.ADD);
      } else {
        this.pickupRenderer.setSecondaryTextureKey(cdxPickup);
      }
    }
    const cdxObstacle = getCodexTextureKey(this, uid, 'obstacle');
    if (cdxObstacle && !rtObstacle) {
      this.obstacleRenderer.setObstacleTextureKey(cdxObstacle);
      this.obstacleRenderer.setObstacleBlendMode(Phaser.BlendModes.ADD);
    }
    const cdxBoss = getCodexTextureKey(this, uid, 'boss');
    if (cdxBoss && !rtBoss) {
      this.obstacleRenderer.setBossTextureKey(cdxBoss);
      this.obstacleRenderer.setBossBlendMode(Phaser.BlendModes.ADD);
    }

    // Grid is STATIC — draw once here, never again in the game loop
    this.gridRenderer.draw(this.colorBg, this.colorPrimary);
    const gridBounds = new Phaser.Geom.Rectangle(
      this.layout.x,
      this.layout.y,
      this.layout.cellSize * this.layout.cols,
      this.layout.cellSize * this.layout.rows,
    );
    this.universeFrameRenderer.render({
      universeId: uid,
      gridBounds,
      depth: -1,
    });
    // 906 fallback if a legacy frame tile exists but the 910 frame asset failed to load.
    if (!this.textures.exists(UNIVERSE_FRAME_ASSETS[uid].key) && this.textures.exists(frameKey)) {
      this.gridRenderer.setFrameTileKey(this, frameKey);
    }

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

    addScanlines(this, 0.035, 8);
    this.cameras.main.fadeIn(250, 0, 0, 0);

    // Cleanup on scene shutdown to avoid listener accumulation on retry
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.inputSys?.destroy();
      this.universeFrameRenderer?.destroy();
    });
  }

  private createDebugAssetsOverlay(uid: string): void {
    const manifestData = this.cache.json.get('design_board_manifest') as Record<string, unknown> | null;
    const universeEntry = (manifestData?.universes as Record<string, unknown> | undefined)?.[uid] as Record<string, unknown> | undefined;
    const boardSource = universeEntry?.boardSource as string ?? '(manifest non chargé)';
    const isFallback  = universeEntry?.fallback as boolean ?? true;
    const allKeys = [
      `db_${uid}_pickup01`, `db_${uid}_pickup02`,
      `db_${uid}_obstacle01`, `db_${uid}_obstacle02`,
      `db_${uid}_boss`, `db_${uid}_frame`, `db_${uid}_hudPanel`,
    ];
    const loaded   = allKeys.filter(k => this.textures.exists(k));
    const missing  = allKeys.filter(k => !this.textures.exists(k));
    // Which are actually wired to renderers
    const wired = [
      this.textures.exists(`db_${uid}_pickup01`)  ? 'pickup01→PickupRenderer' : null,
      this.textures.exists(`db_${uid}_pickup02`)  ? 'pickup02→PickupRenderer(alt)' : null,
      this.textures.exists(`db_${uid}_boss`)      ? 'boss→ObstacleRenderer' : null,
      this.textures.exists(`db_${uid}_frame`)     ? 'frame→GridRenderer' : null,
      this.textures.exists(`db_${uid}_hudPanel`)  ? 'hudPanel→HUDRenderer' : null,
    ].filter(Boolean);

    const lines = [
      `[debugAssets=1] univers: ${uid}`,
      `board: ${boardSource}`,
      `fallback manifest: ${isFallback}`,
      `textures: ${loaded.length}/${allKeys.length} chargées`,
      ...missing.map(k => `  ✗ ${k.replace(`db_${uid}_`, '')}`),
      `wired:`,
      ...wired.map(w => `  ✓ ${w}`),
    ];

    this.debugAssetsOverlay = this.add.text(4, 58, lines.join('\n'), {
      fontFamily: 'monospace',
      fontSize: '8px',
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
    if (this.mechanic instanceof OutRunLaneMechanic) {
      this.pickups = (this.mechanic as OutRunLaneMechanic).getCheckpointPickup();
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
    if (this.mechanic instanceof OutRunLaneMechanic)   return (this.mechanic as OutRunLaneMechanic).getCheckpointPickup();
    return this.pickups;
  }

  private spawnNextPickup(): void {
    if (this.mechanic instanceof SonicRingsMechanic ||
        this.mechanic instanceof ShinobiFocusMechanic ||
        this.mechanic instanceof OutRunLaneMechanic) return;
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
    flashScreen(this, 0xe74c3c, 0.55, 400);
    this.time.delayedCall(600, () => {
      this.cameras.main.fadeOut(200, 0, 0, 0);
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.start(SCENES.GAME_OVER, { levelId: this.levelConfig.id });
      });
    });
  }

  private triggerClear(): void {
    this.cleared = true;
    AudioSystem.clear();
    flashScreen(this, this.colorAccent, 0.45, 350);
    const currentNode = MAP_NODES.find(n => n.levelId === this.levelConfig.id);
    const nodeIndex   = currentNode ? MAP_NODES.indexOf(currentNode) : -1;
    const nextNode    = nodeIndex >= 0 && nodeIndex < MAP_NODES.length - 1 ? MAP_NODES[nodeIndex + 1] : undefined;
    SaveSystem.markCleared(this.levelConfig.id, nextNode?.id);
    this.time.delayedCall(400, () => {
      this.cameras.main.fadeOut(200, 0, 0, 0);
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.start(SCENES.CLEAR, { levelId: this.levelConfig.id });
      });
    });
  }
}
