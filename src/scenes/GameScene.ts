import Phaser from 'phaser';
import { SCENES, SCORE_VALUES, UNIVERSE_RESULT_SCREEN_ASSETS } from '../config/constants';
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
import { GridRenderer, computeGridLayout, GridLayout, cellToPixel } from '../render/GridRenderer';
import { SnakeRenderer } from '../render/SnakeRenderer';
import { PickupRenderer } from '../render/PickupRenderer';
import { ObstacleRenderer } from '../render/ObstacleRenderer';
import { HUDRenderer } from '../render/HUDRenderer';
import { InputSystem } from '../systems/InputSystem';
import { AudioSystem } from '../systems/AudioSystem';
import { SaveSystem } from '../systems/SaveSystem';
import { MAP_NODES } from '../config/mapNodes';
import { flashScreen } from '../render/VfxUtils';
import { preloadRuntimeAssets, getRuntimeTextureKey } from '../systems/RuntimeAssetResolver';
import { drawCastleRuntimeBoardPanel, logCastleRuntimeLayers } from '../ui/CastleRuntimeLayering';
import { GAMEPLAY_HUD, GAMEPLAY_LAYERS } from '../ui/RuntimeUILayout';
import { CASTLE_OPENMOJI_ICON_ASSETS, CASTLE_OPENMOJI_ICONS, PAPERBOY_OPENMOJI_ICON_ASSETS, PAPERBOY_OPENMOJI_ICONS } from '../ui/OpenMojiIconRegistry';

const GRID_COLS = 16;
const GRID_ROWS = 20;
const CASTLE_GRID_COLS = GRID_COLS;
const CASTLE_GRID_ROWS = GRID_ROWS + 6;
const FRAME_GRID_WIDTH: Record<string, number> = {
  castle: 0.75,
  sonic: 0.94,
  streets: 0.94,
  fighter: 0.94,
  outrun: 0.78,
  shinobi: 0.94,
  kombat: 0.94,
  paperboy: 0.94,
};
const FRAME_GRID_Y_BIAS: Record<string, number> = {
  castle: 0.38,
  sonic: 0.18,
  streets: 0.22,
  fighter: 0.22,
  outrun: 0.42,
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
  private runtimeScore = 0;
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
  private inputSys!: InputSystem;
  private castlePickupGlow?: Phaser.GameObjects.Graphics;
  private deliveryTargetGlow?: Phaser.GameObjects.Graphics;

  constructor() {
    super(SCENES.GAME);
  }

  init(data: GameSceneData): void {
    const levelId = resolveLevelId(data);
    this.levelConfig = getLevelById(levelId) ?? getLevelById('castle_normal')!;
  }

  preload(): void {
    const uid = this.levelConfig.universeId;

    // Generic background for all universes
    const univBg = UNIVERSE_RESULT_SCREEN_ASSETS[uid];
    if (univBg && !this.textures.exists(univBg.gameplay.key)) {
      this.load.image(univBg.gameplay.key, univBg.gameplay.url);
    }

    if (uid === 'castle') {
      for (const icon of CASTLE_OPENMOJI_ICON_ASSETS) {
        if (!this.textures.exists(icon.key)) this.load.svg(icon.key, icon.url, { width: 64, height: 64 });
      }
    } else {
      const base = `assets/universes/${uid}`;
      const isBoss = this.levelConfig.type === 'boss';
      const assetKeys: Array<[string, string]> = [
        [`db_${uid}_pickup01`,   `${base}/pickup_01.png`],
        [`db_${uid}_pickup02`,   `${base}/pickup_02.png`],
        [`db_${uid}_obstacle01`, `${base}/obstacle_01.png`],
        [`db_${uid}_hudPanel`,   `${base}/hud_panel.png`],
      ];
      if (isBoss) {
        assetKeys.push([`db_${uid}_boss`, `${base}/boss.png`]);
      }
      for (const [key, path] of assetKeys) {
        if (!this.textures.exists(key)) this.load.image(key, path);
      }
      preloadRuntimeAssets(this, uid, isBoss);
      if (uid === 'paperboy') {
        for (const icon of PAPERBOY_OPENMOJI_ICON_ASSETS) {
          if (!this.textures.exists(icon.key)) this.load.svg(icon.key, icon.url, { width: 64, height: 64 });
        }
      }
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
    const univBg = UNIVERSE_RESULT_SCREEN_ASSETS[this.levelConfig.universeId];
    if (univBg && this.textures.exists(univBg.gameplay.key)) {
      const bg = this.add.image(width / 2, height / 2, univBg.gameplay.key)
        .setDepth(GAMEPLAY_LAYERS.BACKGROUND_IMAGE);
      bg.setScale(Math.max(width / bg.width, height / bg.height));
      this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.14)
        .setDepth(GAMEPLAY_LAYERS.BACKGROUND_IMAGE + 1);
    }

    this.gridCols = this.levelConfig.universeId === 'castle' ? CASTLE_GRID_COLS : GRID_COLS;
    this.gridRows = this.levelConfig.universeId === 'castle' ? CASTLE_GRID_ROWS : GRID_ROWS;
    this.grid = new Grid(this.gridCols, this.gridRows);
    const frameAwareWidth = FRAME_GRID_WIDTH[this.levelConfig.universeId] ?? 0.96;
    const frameAwareYBias = FRAME_GRID_Y_BIAS[this.levelConfig.universeId] ?? 0.22;
    this.layout = computeGridLayout(width, height, this.gridCols, this.gridRows, GAMEPLAY_HUD.HEIGHT, 24, frameAwareWidth, 12, frameAwareYBias);
    if (this.levelConfig.universeId === 'castle') {
      const breathing = 8;
      const gridHeight = this.layout.cellSize * this.layout.rows;
      if (this.layout.y + gridHeight + breathing <= height - 10) {
        this.layout = { ...this.layout, y: this.layout.y + breathing };
      }
    }

    // 906 — compute asset keys before renderer creation
    const uid        = this.levelConfig.universeId;
    const pickupKey  = `db_${uid}_pickup01`;
    const pickup2Key = `db_${uid}_pickup02`;
    const bossKey    = `db_${uid}_boss`;
    const obstacleKey = `db_${uid}_obstacle01`;
    const hudKey     = `db_${uid}_hudPanel`;

    // Renderers
    this.gridRenderer    = new GridRenderer(this, this.layout);
    this.snakeRenderer   = new SnakeRenderer(this);
    this.pickupRenderer  = new PickupRenderer(this);
    this.obstacleRenderer = new ObstacleRenderer(this);
    const readableHudPanelKey = uid === 'castle' ? undefined : this.textures.exists(hudKey) ? hudKey : undefined;
    this.hudRenderer     = new HUDRenderer(this, palette.accent, readableHudPanelKey, uid === 'castle');
    if (uid === 'castle') {
      this.styleCastleRuntimeHud();
      this.castlePickupGlow = this.add.graphics().setDepth(GAMEPLAY_LAYERS.GAMEPLAY_OBJECTS + 1);
    }
    if (uid === 'paperboy') {
      this.deliveryTargetGlow = this.add.graphics().setDepth(GAMEPLAY_LAYERS.GAMEPLAY_OBJECTS - 1);
    }
    this.gridRenderer.setDepth(GAMEPLAY_LAYERS.GRID);
    this.obstacleRenderer.setDepth(GAMEPLAY_LAYERS.GAMEPLAY_OBJECTS);
    this.pickupRenderer.setDepth(GAMEPLAY_LAYERS.GAMEPLAY_OBJECTS + 2);
    this.snakeRenderer.setDepth(GAMEPLAY_LAYERS.GAMEPLAY_OBJECTS + 4);

    // Wire asset textures to renderers
    if (uid === 'castle' && this.textures.exists(CASTLE_OPENMOJI_ICONS.pickupPrimary.key)) {
      this.pickupRenderer.setTextureKey(CASTLE_OPENMOJI_ICONS.pickupPrimary.key);
      if (this.textures.exists(CASTLE_OPENMOJI_ICONS.pickupSecondary.key)) {
        this.pickupRenderer.setSecondaryTextureKey(CASTLE_OPENMOJI_ICONS.pickupSecondary.key);
      }
    } else {
      if (this.textures.exists(pickupKey))  this.pickupRenderer.setTextureKey(pickupKey);
      if (this.textures.exists(pickup2Key)) this.pickupRenderer.setSecondaryTextureKey(pickup2Key);
    }
    this.pickupRenderer.setUniverseId(uid);
    if (uid === 'castle') {
      this.obstacleRenderer.setEntityTextureResolver(entity => {
        if (entity.type === 'blinkWall') {
          if (entity.state === 'ghost') return CASTLE_OPENMOJI_ICONS.obstacleAlt.key;
          if (entity.state === 'warning') return CASTLE_OPENMOJI_ICONS.warningImpact.key;
          return CASTLE_OPENMOJI_ICONS.dangerPrimary.key;
        }
        if (entity.type === 'witchMirror') {
          if (entity.state === 'warning') return CASTLE_OPENMOJI_ICONS.warningImpact.key;
          if (entity.state === 'attacking') return CASTLE_OPENMOJI_ICONS.bossDanger.key;
          if (entity.state === 'vulnerable' || entity.state === 'hit' || entity.state === 'defeated') {
            return CASTLE_OPENMOJI_ICONS.bossReward.key;
          }
          return CASTLE_OPENMOJI_ICONS.boss.key;
        }
        return null;
      });
    } else {
      if (this.textures.exists(bossKey))    this.obstacleRenderer.setBossTextureKey(bossKey);
      if (this.textures.exists(obstacleKey)) this.obstacleRenderer.setObstacleTextureKey(obstacleKey);
      if (uid === 'paperboy') {
        this.obstacleRenderer.setEntityTextureResolver(entity => {
          if (entity.type === 'deliveryTarget' || entity.type === 'bossTarget') {
            return this.textures.exists(PAPERBOY_OPENMOJI_ICONS.deliveryTarget.key)
              ? PAPERBOY_OPENMOJI_ICONS.deliveryTarget.key : null;
          }
          if (entity.type === 'routeObstacle') {
            return this.textures.exists(PAPERBOY_OPENMOJI_ICONS.routeObstacle.key)
              ? PAPERBOY_OPENMOJI_ICONS.routeObstacle.key : null;
          }
          return null;
        });
      }
    }

    // rt_ priority over transparent db_ placeholders — applied unconditionally for all non-Castle universes.
    if (uid !== 'castle') {
      const rtPickup = getRuntimeTextureKey(this, uid, 'pickup');
      if (rtPickup) this.pickupRenderer.setTextureKey(rtPickup);
      const rtObstacle = getRuntimeTextureKey(this, uid, 'obstacle');
      if (rtObstacle) this.obstacleRenderer.setObstacleTextureKey(rtObstacle);
      const rtBoss = getRuntimeTextureKey(this, uid, 'boss');
      if (rtBoss) this.obstacleRenderer.setBossTextureKey(rtBoss);
    }

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
    this.runtimeScore = 0;
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
    if (uid === 'castle') this.renderGameState();

    this.inputSys = new InputSystem(this);
    this.inputSys.bind(this.snake);

    this.cameras.main.fadeIn(250, 0, 0, 0);

    // Cleanup on scene shutdown to avoid listener accumulation on retry
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.inputSys?.destroy();
      this.castlePickupGlow?.destroy();
      this.castlePickupGlow = undefined;
      this.deliveryTargetGlow?.destroy();
      this.deliveryTargetGlow = undefined;
    });
  }

  private styleCastleRuntimeHud(): void {
    const hud = this.hudRenderer as unknown as {
      capsuleGfx?: Phaser.GameObjects.Graphics | null;
      universeTxt?: Phaser.GameObjects.Text;
      ruleTxt?: Phaser.GameObjects.Text;
      scoreTxt?: Phaser.GameObjects.Text;
    };
    const capsuleGfx = hud.capsuleGfx;
    if (!capsuleGfx) return;

    const w = this.scale.width;
    const hudH = GAMEPLAY_HUD.HEIGHT;
    const gap = 7;
    const capW = Math.floor((w - gap * 4) / 3);
    const capH = 32;
    const capY = Math.floor((hudH - capH) / 2);
    const radius = 7;

    capsuleGfx.clear();
    capsuleGfx.fillStyle(0x05020a, 0.32);
    capsuleGfx.fillRoundedRect(3, capY - 3, w - 6, capH + 6, radius + 3);
    capsuleGfx.lineStyle(1, 0xa94cff, 0.18);
    capsuleGfx.lineBetween(10, capY + capH + 4, w - 10, capY + capH + 4);
    for (let i = 0; i < 3; i++) {
      const x = gap + i * (capW + gap);
      capsuleGfx.fillStyle(0x12071d, 0.66);
      capsuleGfx.fillRoundedRect(x, capY, capW, capH, radius);
      capsuleGfx.fillStyle(0xf6c45c, 0.055);
      capsuleGfx.fillRoundedRect(x + 2, capY + 2, capW - 4, Math.max(5, Math.floor(capH * 0.34)), radius - 2);
      capsuleGfx.lineStyle(1, 0xf6c45c, 0.48);
      capsuleGfx.strokeRoundedRect(x, capY, capW, capH, radius);
      capsuleGfx.lineStyle(1, 0xa94cff, 0.26);
      capsuleGfx.strokeRoundedRect(x + 2, capY + 2, capW - 4, capH - 4, Math.max(4, radius - 2));
    }

    const textShadow = [1, 1, '#05020a', 2, true, true] as const;
    for (const txt of [hud.universeTxt, hud.ruleTxt, hud.scoreTxt]) {
      txt?.setY(Math.floor(hudH / 2));
      txt?.setPadding(4, 2, 4, 2);
      txt?.setShadow(...textShadow);
    }
    hud.universeTxt?.setColor('#f6c45c').setFontSize(10);
    hud.ruleTxt?.setColor('#eee7ff').setFontSize(12);
    hud.scoreTxt?.setColor('#fff2a8').setFontSize(11);
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
    // Non-Paperboy boss levels manage their own pickup logic — no generic orphan pickup
    if (this.levelConfig.type === 'boss' && this.levelConfig.universeId !== 'paperboy') return;
    const p = spawnPickup(this.grid, this.snake, this.walls);
    if (p) this.pickups = [p];
  }

  update(time: number, delta: number): void {
    if (this.gameOver || this.cleared) return;

    this.inputSys.pollKeyboard();

    // Pickup animation runs EVERY FRAME (60fps) — independent of game logic tick
    const activePickups = this.getActivePickups();
    if (this.levelConfig.universeId === 'castle') this.drawCastlePickupGlow(activePickups, time);
    if (this.levelConfig.universeId === 'paperboy') this.drawPaperboyTargetGlow(time);
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
      this.runtimeScore += SCORE_VALUES.PICKUP;
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

  private drawCastlePickupGlow(pickups: Cell[], time: number): void {
    const glow = this.castlePickupGlow;
    if (!glow) return;

    glow.clear();
    const pulse = Math.sin(time / 360) * 0.5 + 0.5;
    const cs = this.layout.cellSize;
    for (const pickup of pickups) {
      const { px, py } = cellToPixel(this.layout, pickup.col, pickup.row);
      glow.fillStyle(0xf6c45c, 0.20 + 0.08 * pulse);
      glow.fillCircle(px, py, cs * (0.88 + 0.10 * pulse));
      glow.fillStyle(0xa94cff, 0.14 + 0.05 * pulse);
      glow.fillCircle(px, py, cs * (0.62 + 0.06 * pulse));
      glow.lineStyle(Math.max(1, Math.floor(cs * 0.06)), 0xfff0a8, 0.32 + 0.08 * pulse);
      glow.strokeCircle(px, py, cs * 0.52);
    }
  }

  private drawPaperboyTargetGlow(time: number): void {
    const glow = this.deliveryTargetGlow;
    if (!glow) return;
    glow.clear();
    const entities = this.mechanic.getExtraEntities();
    const targets = entities.filter(e => e.type === 'deliveryTarget' || e.type === 'bossTarget');
    if (targets.length === 0) return;
    const cs = this.layout.cellSize;
    const pulse = Math.sin(time / 350) * 0.5 + 0.5;
    for (const t of targets) {
      const { px, py } = cellToPixel(this.layout, t.cell.col, t.cell.row);
      if (t.state === 'highlighted') {
        // Strong pulsing yellow halo — "deliver here now!"
        glow.fillStyle(0xf1c40f, 0.16 + 0.08 * pulse);
        glow.fillCircle(px, py, cs * (0.96 + 0.06 * pulse));
        glow.fillStyle(0xf1c40f, 0.28 + 0.14 * pulse);
        glow.fillCircle(px, py, cs * (0.78 + 0.10 * pulse));
        glow.lineStyle(Math.max(2, Math.floor(cs * 0.10)), 0xffffff, 0.72 + 0.18 * pulse);
        glow.strokeCircle(px, py, cs * (0.60 + 0.06 * pulse));
      } else {
        // Subtle idle green marker — "target location, grab paper first"
        glow.fillStyle(0x27ae60, 0.18 + 0.06 * pulse);
        glow.fillCircle(px, py, cs * 0.64);
        glow.lineStyle(Math.max(1, Math.floor(cs * 0.08)), 0x27ae60, 0.52 + 0.18 * pulse);
        glow.strokeCircle(px, py, cs * 0.52);
      }
    }
  }

  private spawnNextPickup(): void {
    if (this.mechanic instanceof SonicRingsMechanic ||
        this.mechanic instanceof ShinobiFocusMechanic ||
        this.mechanic instanceof OutRunLaneMechanic) return;
    if (this.levelConfig.type === 'boss' && this.levelConfig.universeId !== 'paperboy') return;
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
    this.runtimeScore += SCORE_VALUES.BOSS_HIT;
    flashScreen(this, 0xffffff, 0.32, 160, GAMEPLAY_LAYERS.SCREEN_FX);
    this.cameras.main.shake(110, 0.006);
    AudioSystem.bossHit();
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
      isCastle ? (isBoss ? 'CASTLE BOSS' : 'CASTLE') : UNIVERSES[this.levelConfig.universeId].shortName,
      this.levelConfig.ruleText,
      isBoss ? boss!.getHp() : this.score,
      isBoss ? boss!.getMaxHp() : this.levelConfig.quota,
      this.mechanic.getHudExtra(),
      isBoss ? 'BOSS HP ' : isCastle ? 'MAGIC ' : '',
    );
  }

  private triggerGameOver(): void {
    this.gameOver = true;
    const bestResult = SaveSystem.recordBestScore(this.levelConfig.id, this.runtimeScore);
    AudioSystem.gameover();
    this.cameras.main.shake(150, 0.01);
    flashScreen(this, 0xe74c3c, 0.55, 400, GAMEPLAY_LAYERS.SCREEN_FX);
    this.time.delayedCall(600, () => {
      this.cameras.main.fadeOut(200, 0, 0, 0);
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.start(SCENES.GAME_OVER, {
          levelId: this.levelConfig.id,
          score: this.runtimeScore,
          bestScore: bestResult.bestScore,
          previousBest: bestResult.previousBest,
          isNewRecord: bestResult.isNewRecord,
        });
      });
    });
  }

  private triggerClear(): void {
    this.cleared = true;
    this.runtimeScore += this.mechanic instanceof BaseBoss ? SCORE_VALUES.BOSS_CLEAR : SCORE_VALUES.STAGE_CLEAR;
    if (this.mechanic instanceof BaseBoss) {
      AudioSystem.bossClear();
    } else {
      AudioSystem.clear();
    }
    this.cameras.main.shake(90, 0.004);
    flashScreen(this, this.colorAccent, 0.45, 350, GAMEPLAY_LAYERS.SCREEN_FX);
    const currentNode = MAP_NODES.find(n => n.levelId === this.levelConfig.id);
    const nodeIndex   = currentNode ? MAP_NODES.indexOf(currentNode) : -1;
    const nextNode    = nodeIndex >= 0 && nodeIndex < MAP_NODES.length - 1 ? MAP_NODES[nodeIndex + 1] : undefined;
    const bestResult = SaveSystem.recordBestScore(this.levelConfig.id, this.runtimeScore);
    SaveSystem.markCleared(this.levelConfig.id, nextNode?.id);
    this.time.delayedCall(400, () => {
      this.cameras.main.fadeOut(200, 0, 0, 0);
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.start(SCENES.CLEAR, {
          levelId: this.levelConfig.id,
          score: this.runtimeScore,
          bestScore: bestResult.bestScore,
          previousBest: bestResult.previousBest,
          isNewRecord: bestResult.isNewRecord,
        });
      });
    });
  }
}
