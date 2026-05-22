import Phaser from 'phaser';
import { SCENES, UNIVERSE_FRAME_ASSETS, CASTLE_RESULT_SCREEN_ASSETS } from '../config/constants';
import { LevelConfig } from '../config/types';
import { getLevelById, resolveLevelId } from '../config/levels';
import { UNIVERSES } from '../config/universes';
import { Grid } from '../core/Grid';
import { createSnake, stepSnake, SnakeState } from '../core/Snake';
import { spawnPickup } from '../core/Spawn';
import { Cell, cellKey } from '../core/Grid';
import { BaseMechanic, MechanicUpdate } from '../mechanics/BaseMechanic';
import { createMechanic } from '../mechanics/MechanicFactory';
import { SonicRingsMechanic } from '../mechanics/SonicRingsMechanic';
import { ShinobiFocusMechanic } from '../mechanics/ShinobiFocusMechanic';
import { OutRunLaneMechanic } from '../mechanics/OutRunLaneMechanic';
import { PaperboyDeliveryMechanic } from '../mechanics/PaperboyDeliveryMechanic';
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
import { MAP_NODES } from '../config/mapNodes';
import { flashScreen, addScanlines } from '../render/VfxUtils';
import { preloadRuntimeAssets, getRuntimeTextureKey } from '../systems/RuntimeAssetResolver';
import { drawCastleRuntimeBoardPanel, logCastleRuntimeLayers } from '../ui/CastleRuntimeLayering';
import { GAMEPLAY_HUD, GAMEPLAY_LAYERS } from '../ui/RuntimeUILayout';

const GRID_COLS = 16;
const GRID_ROWS = 20;
const CASTLE_GRID_COLS = GRID_COLS;
const CASTLE_GRID_ROWS = GRID_ROWS + 6;
const FRAME_GRID_WIDTH: Record<string, number> = {
  castle: 0.75,
  sonic: 0.94,
  streets: 0.94,
  fighter: 0.94,
  outrun: 0.72,
  shinobi: 0.94,
  kombat: 0.94,
  paperboy: 0.94,
};
const FRAME_GRID_Y_BIAS: Record<string, number> = {
  castle: 0.38,
  sonic: 0.18,
  streets: 0.22,
  fighter: 0.22,
  outrun: 0.08,
  shinobi: 0.22,
  kombat: 0.22,
  paperboy: 0.22,
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
  private gridCols = GRID_COLS;
  private gridRows = GRID_ROWS;

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

  constructor() {
    super(SCENES.GAME);
  }

  init(data: GameSceneData): void {
    const levelId = resolveLevelId(data);
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
    // rt_ only for non-castle universes (castle uses db_ assets exclusively)
    // Codex_ skipped: all universes have db_ or rt_ assets — codex is unreachable dead weight
    if (uid !== 'castle') {
      preloadRuntimeAssets(this, uid);
    }
    // Load only the active universe frame — not all 8
    const frameAsset = UNIVERSE_FRAME_ASSETS[uid as keyof typeof UNIVERSE_FRAME_ASSETS];
    if (frameAsset && !this.textures.exists(frameAsset.key)) {
      this.load.image(frameAsset.key, frameAsset.url);
    }
    if (uid === 'castle') {
      const gpAsset = CASTLE_RESULT_SCREEN_ASSETS.gameplay;
      if (!this.textures.exists(gpAsset.key)) this.load.image(gpAsset.key, gpAsset.url);
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

    this.add.rectangle(width / 2, height / 2, width, height, this.colorBg).setDepth(GAMEPLAY_LAYERS.BACKGROUND_FILL);

    if (this.levelConfig.universeId === 'castle' && this.textures.exists(CASTLE_RESULT_SCREEN_ASSETS.gameplay.key)) {
      const gpBg = this.add.image(width / 2, height / 2, CASTLE_RESULT_SCREEN_ASSETS.gameplay.key).setDepth(GAMEPLAY_LAYERS.BACKGROUND_IMAGE);
      gpBg.setScale(Math.min(width / gpBg.width, height / gpBg.height));
    }

    this.gridCols = this.levelConfig.universeId === 'castle' ? CASTLE_GRID_COLS : GRID_COLS;
    this.gridRows = this.levelConfig.universeId === 'castle' ? CASTLE_GRID_ROWS : GRID_ROWS;
    this.grid = new Grid(this.gridCols, this.gridRows);
    const frameAwareWidth = FRAME_GRID_WIDTH[this.levelConfig.universeId] ?? 0.96;
    const frameAwareYBias = FRAME_GRID_Y_BIAS[this.levelConfig.universeId] ?? 0.22;
    this.layout = computeGridLayout(width, height, this.gridCols, this.gridRows, GAMEPLAY_HUD.HEIGHT, 24, frameAwareWidth, 12, frameAwareYBias);

    // 906 — compute asset keys before renderer creation
    const uid        = this.levelConfig.universeId;
    const pickupKey  = `db_${uid}_pickup01`;
    const pickup2Key = `db_${uid}_pickup02`;
    const bossKey    = `db_${uid}_boss`;
    const obstacleKey = `db_${uid}_obstacle01`;
    const frameKey   = `db_${uid}_frame`;
    const hudKey     = `db_${uid}_hudPanel`;

    // Renderers
    this.gridRenderer    = new GridRenderer(this, this.layout);
    this.snakeRenderer   = new SnakeRenderer(this);
    this.pickupRenderer  = new PickupRenderer(this);
    this.obstacleRenderer = new ObstacleRenderer(this);
    const readableHudPanelKey = uid === 'castle' ? undefined : this.textures.exists(hudKey) ? hudKey : undefined;
    this.hudRenderer     = new HUDRenderer(this, palette.accent, readableHudPanelKey, uid === 'castle');
    this.universeFrameRenderer = new UniverseFrameRenderer(this);
    this.gridRenderer.setDepth(GAMEPLAY_LAYERS.GRID);
    this.obstacleRenderer.setDepth(GAMEPLAY_LAYERS.GAMEPLAY_OBJECTS);
    this.pickupRenderer.setDepth(GAMEPLAY_LAYERS.GAMEPLAY_OBJECTS + 2);
    this.snakeRenderer.setDepth(GAMEPLAY_LAYERS.GAMEPLAY_OBJECTS + 4);

    // Wire asset textures to renderers
    if (this.textures.exists(pickupKey))  this.pickupRenderer.setTextureKey(pickupKey);
    if (this.textures.exists(pickup2Key)) this.pickupRenderer.setSecondaryTextureKey(pickup2Key);
    this.pickupRenderer.setUniverseId(uid);
    if (this.textures.exists(bossKey))    this.obstacleRenderer.setBossTextureKey(bossKey);
    if (this.textures.exists(obstacleKey)) this.obstacleRenderer.setObstacleTextureKey(obstacleKey);

    // rt_ fallback only — never override a db_ asset that is already wired
    const rtPickup = getRuntimeTextureKey(this, uid, 'pickup');
    if (rtPickup && !this.textures.exists(pickupKey)) this.pickupRenderer.setTextureKey(rtPickup);
    const rtObstacle = getRuntimeTextureKey(this, uid, 'obstacle');
    if (rtObstacle && !this.textures.exists(obstacleKey)) this.obstacleRenderer.setObstacleTextureKey(rtObstacle);
    const rtBoss = getRuntimeTextureKey(this, uid, 'boss');
    if (rtBoss && !this.textures.exists(bossKey)) this.obstacleRenderer.setBossTextureKey(rtBoss);

    const gridBounds = new Phaser.Geom.Rectangle(
      this.layout.x,
      this.layout.y,
      this.layout.cellSize * this.layout.cols,
      this.layout.cellSize * this.layout.rows,
    );
    if (uid === 'castle') {
      drawCastleRuntimeBoardPanel(this, gridBounds);
    }

    // Grid is STATIC — draw once here, never again in the game loop
    this.gridRenderer.draw(uid === 'castle' ? 0x090613 : this.colorBg, this.colorPrimary);
    // Castle uses castle_gameplay_bg for atmosphere — skip legacy full-frame asset
    // which contains baked HUD/header that conflicts with runtime ownership.
    if (uid !== 'castle') {
      this.universeFrameRenderer.render({
        universeId: uid,
        gridBounds,
        depth: GAMEPLAY_LAYERS.BOARD_PANEL,
      });
    }

    // Debug overlay ?debugAssets=1
    if (new URLSearchParams(window.location.search).get('debugAssets') === '1') {
      this.createDebugAssetsOverlay(uid);
    }
    if (uid === 'castle' && new URLSearchParams(window.location.search).get('debugLayers') === '1') {
      logCastleRuntimeLayers();
    }

    this.snake = createSnake(Math.min(5, this.gridCols - 3), Math.floor(this.gridRows / 2));
    this.pickups = [];
    this.walls = [];
    this.score = 0;
    this.tickCount = 0;
    this.tickAccumulator = 0;
    this.gameOver = false;
    this.cleared = false;

    this.mechanic = createMechanic(this.levelConfig.mechanic);
    this.mechanic.init({
      snake: this.snake,
      grid: { cols: this.gridCols, rows: this.gridRows },
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

    addScanlines(this, 0.018, GAMEPLAY_LAYERS.SCREEN_FX);
    this.cameras.main.fadeIn(250, 0, 0, 0);

    // Cleanup on scene shutdown to avoid listener accumulation on retry
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.inputSys?.destroy();
      this.universeFrameRenderer?.destroy();
    });
  }

  private createDebugAssetsOverlay(uid: string): void {
    const slots = ['pickup01', 'pickup02', 'obstacle01', 'obstacle02', 'boss', 'frame', 'hudPanel'];
    const lines = [`[debugAssets=1] univers: ${uid}`];
    for (const slot of slots) {
      const key = `db_${uid}_${slot}`;
      lines.push(`  ${this.textures.exists(key) ? '✓' : '✗'} ${slot}`);
    }
    this.add.text(4, 58, lines.join('\n'), {
      fontFamily: 'monospace', fontSize: '8px', color: '#00ff88',
      backgroundColor: '#000000cc', padding: { x: 4, y: 2 },
    }).setDepth(GAMEPLAY_LAYERS.DEBUG).setScrollFactor(0);
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
    if (this.applyMechanicUpdate(mu)) { this.triggerGameOver(); return; }

    const currentPickups = this.getActivePickups();
    const pickupSet = new Set<string>(currentPickups.map(p => cellKey(p)));
    const wallSet   = new Set<string>(this.walls.map(w => cellKey(w)));
    const result    = stepSnake(this.snake, this.gridCols, this.gridRows, pickupSet, wallSet);

    if (result.hitWall || result.hitSelf) {
      AudioSystem.gameover();
      this.triggerGameOver();
      return;
    }

    this.syncMechanicCtx();
    if (this.isDangerCell(result.head)) {
      AudioSystem.danger();
      this.triggerGameOver();
      return;
    }

    if (this.resolveBossWeakPoint(result.head)) {
      if (this.mechanic instanceof BaseBoss && (this.mechanic as BaseBoss).isDefeated()) {
        this.triggerClear();
        return;
      }
    }

    if (result.ate) {
      AudioSystem.pickup();
      const eaten = result.head;
      const mr = this.mechanic.onPickupCollected(eaten);
      if (this.applyMechanicUpdate(mr, 1)) { AudioSystem.danger(); this.triggerGameOver(); return; }
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
    if (this.mechanic instanceof PaperboyDeliveryMechanic) {
      return [...this.pickups, ...(this.mechanic as PaperboyDeliveryMechanic).getDeliveryPickups()];
    }
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

  private applyMechanicUpdate(update: MechanicUpdate, defaultScore = 0): boolean {
    if (update.score !== undefined) {
      this.score += update.score;
    } else if (defaultScore !== 0) {
      this.score += defaultScore;
    }

    if (update.addPickup) this.addUniqueCell(this.pickups, update.addPickup);
    if (update.removePickup) this.removeCell(this.pickups, update.removePickup);
    if (update.addWall) this.addUniqueCell(this.walls, update.addWall);
    if (update.removeWall) this.removeCell(this.walls, update.removeWall);

    this.syncMechanicCtx();
    return update.hitDanger === true;
  }

  private addUniqueCell(cells: Cell[], cell: Cell): void {
    if (!cells.some(existing => existing.col === cell.col && existing.row === cell.row)) {
      cells.push({ col: cell.col, row: cell.row });
    }
  }

  private removeCell(cells: Cell[], cell: Cell): void {
    const index = cells.findIndex(existing => existing.col === cell.col && existing.row === cell.row);
    if (index >= 0) cells.splice(index, 1);
  }

  private isDangerCell(head: Cell): boolean {
    return this.mechanic.getDangerCells().some(cell => {
      return cell.lethal !== false && cell.col === head.col && cell.row === head.row;
    });
  }

  private resolveBossWeakPoint(head: Cell): boolean {
    if (!(this.mechanic instanceof BaseBoss)) return false;
    const boss = this.mechanic as BaseBoss;
    const weakPoint = boss.getWeakPoints().find(cell => cell.col === head.col && cell.row === head.row);
    if (!weakPoint) return false;
    const hitResult = boss.onWeakPointHit(weakPoint);
    if (!hitResult.hit) return false;
    flashScreen(this, 0xffffff, 0.32, 160, GAMEPLAY_LAYERS.SCREEN_FX);
    this.cameras.main.shake(110, 0.006);
    // TODO audio: play boss-hit cue when a dedicated audio cue exists.
    this.syncMechanicCtx();
    return true;
  }

  private syncMechanicCtx(): void {
    this.mechanic.syncContext({
      snake: this.snake,
      pickups: this.pickups,
      walls: this.walls,
      score: this.score,
      elapsed: this.tickCount,
    });
  }

  // Called only on game tick — not every frame
  private renderGameState(): void {
    // Grid: dirty flag prevents unnecessary redraws (only redraws on first call per create)
    this.gridRenderer.draw(this.colorBg, this.colorPrimary);

    this.obstacleRenderer.draw(this.mechanic.getExtraEntities(), this.layout);
    this.snakeRenderer.draw(this.snake, this.layout, this.colorAccent, this.colorPrimary);

    const isBoss = this.mechanic instanceof BaseBoss;
    const boss = isBoss ? (this.mechanic as BaseBoss) : null;
    const isCastle = this.levelConfig.universeId === 'castle';
    this.hudRenderer.update(
      isCastle && isBoss ? 'CASTLE BOSS' : UNIVERSES[this.levelConfig.universeId].shortName,
      this.levelConfig.ruleText,
      isBoss ? boss!.getHp() : this.score,
      isBoss ? boss!.getMaxHp() : this.levelConfig.quota,
      this.mechanic.getHudExtra(),
      isBoss ? 'BOSS HP ' : isCastle ? 'MAGIC ' : '',
    );
  }

  private triggerGameOver(): void {
    this.gameOver = true;
    AudioSystem.gameover();
    this.cameras.main.shake(150, 0.01);
    flashScreen(this, 0xe74c3c, 0.55, 400, GAMEPLAY_LAYERS.SCREEN_FX);
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
    this.cameras.main.shake(90, 0.004);
    flashScreen(this, this.colorAccent, 0.45, 350, GAMEPLAY_LAYERS.SCREEN_FX);
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
