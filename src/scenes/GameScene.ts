import Phaser from 'phaser';
import { SCENES, SCORE_VALUES, UNIVERSE_RESULT_SCREEN_ASSETS } from '../config/constants';
import { LevelConfig } from '../config/types';
import { getLevelById, resolveLevelId } from '../config/levels';
import { UNIVERSES } from '../config/universes';
import { Grid } from '../core/Grid';
import { createSnake, stepSnake, SnakeState } from '../core/Snake';
import { spawnPickup } from '../core/Spawn';
import { Cell, cellKey } from '../core/Grid';
import { BaseMechanic, ExtraEntity, MechanicUpdate } from '../mechanics/BaseMechanic';
import { createMechanic } from '../mechanics/MechanicFactory';
import { SonicRingsMechanic } from '../mechanics/SonicRingsMechanic';
import { ShinobiFocusMechanic } from '../mechanics/ShinobiFocusMechanic';
import { OutRunLaneMechanic } from '../mechanics/OutRunLaneMechanic';
import { PaperboyDeliveryMechanic } from '../mechanics/PaperboyDeliveryMechanic';
import { BaseBoss } from '../mechanics/bosses/BaseBoss';
import { GridRenderer, computeGridLayout, GridLayout, cellToPixel, getCellHeight, getCellMin, getCellWidth } from '../render/GridRenderer';
import { SnakeRenderer } from '../render/SnakeRenderer';
import { PickupRenderer } from '../render/PickupRenderer';
import { ObstacleRenderer } from '../render/ObstacleRenderer';
import { HUDRenderer } from '../render/HUDRenderer';
import { InputSystem } from '../systems/InputSystem';
import { AudioSystem } from '../systems/AudioSystem';
import { SaveSystem } from '../systems/SaveSystem';
import { MAP_NODES } from '../config/mapNodes';
import { UI_FONT, flashScreen } from '../render/VfxUtils';
import { preloadRuntimeAssets, getRuntimeTextureKey } from '../systems/RuntimeAssetResolver';
import { resolveSnakeSkinForUniverse, snakeSkinSpriteUrl } from '../config/snakeSkins';
import { drawCastleRuntimeBoardPanel, logCastleRuntimeLayers } from '../ui/CastleRuntimeLayering';
import { GAMEPLAY_HUD, GAMEPLAY_LAYERS } from '../ui/RuntimeUILayout';
import { CASTLE_OPENMOJI_ICON_ASSETS, CASTLE_OPENMOJI_ICONS } from '../ui/OpenMojiIconRegistry';

const GRID_COLS = 16;
const GRID_ROWS = 26;
const CASTLE_GRID_COLS = GRID_COLS;
const CASTLE_GRID_ROWS = GRID_ROWS;
const CASTLE_REFERENCE_GRID_WIDTH = 0.75;
const CASTLE_REFERENCE_GRID_Y_BIAS = 0.38;
const CASTLE_REFERENCE_BOTTOM_BREATHING = 8;
const FIGHTER_OBSTACLE_NORMAL_KEY = 'rt_fighter_obstacle_normal';
const FIGHTER_BOSS_IDLE_KEY = 'rt_fighter_boss_idle';
const FIGHTER_BOSS_ATTACK_KEY = 'rt_fighter_boss_attack';
const KOMBAT_BOSS_IDLE_KEY = 'rt_kombat_boss_idle';
const KOMBAT_BOSS_ATTACK_KEY = 'rt_kombat_boss_attack';
const OUTRUN_BOSS_IDLE_KEY = 'rt_outrun_boss_idle';
const OUTRUN_BOSS_ATTACK_KEY = 'rt_outrun_boss_attack';
const STREETS_BOSS_IDLE_KEY = 'rt_streets_boss_idle';
const STREETS_BOSS_ATTACK_KEY = 'rt_streets_boss_attack';

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
  private pickupCount = 0;
  private bossHitCount = 0;
  private tickCount = 0;
  private tickAccumulator = 0;
  private gameOver = false;
  private cleared = false;
  private layout!: GridLayout;
  private visualBoardLayout!: GridLayout;
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

    const svgSize = Math.round(64 * Math.min(window.devicePixelRatio || 1, 2));
    if (uid === 'castle') {
      for (const icon of CASTLE_OPENMOJI_ICON_ASSETS) {
        if (!this.textures.exists(icon.key)) this.load.svg(icon.key, icon.url, { width: svgSize, height: svgSize });
      }
    } else {
      const isBoss = this.levelConfig.type === 'boss';
      preloadRuntimeAssets(this, uid, isBoss);
      if (uid === 'fighter') {
        if (!this.textures.exists(FIGHTER_OBSTACLE_NORMAL_KEY)) {
          this.load.image(FIGHTER_OBSTACLE_NORMAL_KEY, 'assets/runtime/universes/fighter/05_obstacle.png');
        }
      }
      if (uid === 'fighter' && isBoss) {
        if (!this.textures.exists(FIGHTER_BOSS_IDLE_KEY)) {
          this.load.image(FIGHTER_BOSS_IDLE_KEY, 'assets/runtime/universes/fighter/01_boss_idle.png');
        }
        if (!this.textures.exists(FIGHTER_BOSS_ATTACK_KEY)) {
          this.load.image(FIGHTER_BOSS_ATTACK_KEY, 'assets/runtime/universes/fighter/06_boss_attack.png');
        }
      }
      if (uid === 'kombat' && isBoss) {
        if (!this.textures.exists(KOMBAT_BOSS_IDLE_KEY)) {
          this.load.image(KOMBAT_BOSS_IDLE_KEY, 'assets/runtime/universes/kombat/01_boss_idle.png');
        }
        if (!this.textures.exists(KOMBAT_BOSS_ATTACK_KEY)) {
          this.load.image(KOMBAT_BOSS_ATTACK_KEY, 'assets/runtime/universes/kombat/06_boss_attack.png');
        }
      }
      if (uid === 'outrun' && isBoss) {
        if (!this.textures.exists(OUTRUN_BOSS_IDLE_KEY)) {
          this.load.image(OUTRUN_BOSS_IDLE_KEY, 'assets/runtime/universes/outrun/05_boss_idle.png');
        }
        if (!this.textures.exists(OUTRUN_BOSS_ATTACK_KEY)) {
          this.load.image(OUTRUN_BOSS_ATTACK_KEY, 'assets/runtime/universes/outrun/06_boss_attack.png');
        }
      }
      if (uid === 'streets' && isBoss) {
        if (!this.textures.exists(STREETS_BOSS_IDLE_KEY)) {
          this.load.image(STREETS_BOSS_IDLE_KEY, 'assets/runtime/universes/streets/01_boss_idle.png');
        }
        if (!this.textures.exists(STREETS_BOSS_ATTACK_KEY)) {
          this.load.image(STREETS_BOSS_ATTACK_KEY, 'assets/runtime/universes/streets/06_boss_attack.png');
        }
      }
    }

    // Snake skin assets — loaded only for universes that declare a skin
    const snakeSkin = resolveSnakeSkinForUniverse(uid);
    if (snakeSkin) {
      for (const key of [snakeSkin.headSprite, snakeSkin.bodySprite, snakeSkin.tailSprite]) {
        if (!this.textures.exists(key)) this.load.image(key, snakeSkinSpriteUrl(key));
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
    this.applyCriticalVisibilityPalette();

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
    this.visualBoardLayout = this.computeCastleReferenceLayout(width, height);
    this.layout = this.computeActiveGridLayout(this.visualBoardLayout, this.gridCols, this.gridRows);

    const uid        = this.levelConfig.universeId;

    // Renderers
    this.gridRenderer    = new GridRenderer(this, this.layout);
    this.snakeRenderer   = new SnakeRenderer(this);
    this.snakeRenderer.setSkin(resolveSnakeSkinForUniverse(uid));
    this.pickupRenderer  = new PickupRenderer(this);
    this.obstacleRenderer = new ObstacleRenderer(this);
    this.hudRenderer     = new HUDRenderer(this, palette.accent);
    if (uid === 'castle') {
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
    } else {
      const rtPickup = getRuntimeTextureKey(this, uid, 'pickup');
      if (rtPickup) this.pickupRenderer.setTextureKey(rtPickup);
    }
    this.pickupRenderer.setUniverseId(uid);
    this.obstacleRenderer.setUniverseId(uid);
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
      const rtObstacle = getRuntimeTextureKey(this, uid, 'obstacle');
      const rtObstacleDanger = getRuntimeTextureKey(this, uid, 'obstacleDanger');
      const rtBoss = getRuntimeTextureKey(this, uid, 'boss');
      const rtBossAttack = getRuntimeTextureKey(this, uid, 'bossAttack');
      const rtPickupSecondary = getRuntimeTextureKey(this, uid, 'pickupSecondary');
      const resolveRuntimeObstacleVariant = (entity: ExtraEntity): string | null => {
        if (!rtObstacleDanger) return null;
        if (
          entity.state === 'danger' ||
          entity.state === 'active' ||
          entity.state === 'charging' ||
          entity.type === 'counterZone' ||
          entity.type === 'dangerZone' ||
          entity.type === 'pressureZone' ||
          entity.type === 'turboZone'
        ) {
          return rtObstacleDanger;
        }
        return null;
      };
      if (rtObstacle) this.obstacleRenderer.setObstacleTextureKey(rtObstacle);
      if (rtBoss) this.obstacleRenderer.setBossTextureKey(rtBoss);
      if (rtObstacleDanger) {
        this.obstacleRenderer.setEntityTextureResolver(resolveRuntimeObstacleVariant);
      }
      if (uid === 'paperboy') {
        this.obstacleRenderer.setEntityTextureResolver(entity => {
          const runtimeVariant = resolveRuntimeObstacleVariant(entity);
          if (runtimeVariant) return runtimeVariant;
          if (entity.type === 'deliveryTarget' || entity.type === 'bossTarget') {
            return rtPickupSecondary;
          }
          return null;
        });
      }
      if (uid === 'fighter') {
        this.obstacleRenderer.setEntityTextureResolver(entity => {
          const runtimeVariant = resolveRuntimeObstacleVariant(entity);
          if (runtimeVariant) return runtimeVariant;
          if (entity.type === 'sparZone') {
            return this.textures.exists(FIGHTER_OBSTACLE_NORMAL_KEY)
              ? FIGHTER_OBSTACLE_NORMAL_KEY : null;
          }
          return null;
        });
        this.obstacleRenderer.setBossTextureResolver(entity => {
          if (entity.type !== 'finalChallenger') return null;
          if (entity.state === 'idle') {
            return this.textures.exists(FIGHTER_BOSS_IDLE_KEY) ? FIGHTER_BOSS_IDLE_KEY : null;
          }
          return this.textures.exists(FIGHTER_BOSS_ATTACK_KEY) ? FIGHTER_BOSS_ATTACK_KEY : null;
        });
      }
      if (uid === 'kombat') {
        this.obstacleRenderer.setBossTextureResolver(entity => {
          if (entity.type !== 'dragonGate') return null;
          if (entity.state === 'danger') {
            return this.textures.exists(KOMBAT_BOSS_ATTACK_KEY) ? KOMBAT_BOSS_ATTACK_KEY : rtBossAttack;
          }
          return this.textures.exists(KOMBAT_BOSS_IDLE_KEY) ? KOMBAT_BOSS_IDLE_KEY : rtBoss;
        });
      }
      if (uid === 'outrun') {
        this.obstacleRenderer.setBossTextureResolver(entity => {
          if (entity.type !== 'turboRival') return null;
          if (entity.state === 'active') {
            return this.textures.exists(OUTRUN_BOSS_ATTACK_KEY) ? OUTRUN_BOSS_ATTACK_KEY : rtBossAttack;
          }
          return this.textures.exists(OUTRUN_BOSS_IDLE_KEY) ? OUTRUN_BOSS_IDLE_KEY : rtBoss;
        });
      }
      if (uid === 'streets') {
        this.obstacleRenderer.setBossTextureResolver(entity => {
          if (entity.type !== 'crimeLord') return null;
          if (entity.state === 'pressure') {
            return this.textures.exists(STREETS_BOSS_ATTACK_KEY) ? STREETS_BOSS_ATTACK_KEY : rtBossAttack;
          }
          return this.textures.exists(STREETS_BOSS_IDLE_KEY) ? STREETS_BOSS_IDLE_KEY : rtBoss;
        });
      }
    }

    const gridBounds = new Phaser.Geom.Rectangle(
      this.visualBoardLayout.x,
      this.visualBoardLayout.y,
      getCellWidth(this.visualBoardLayout) * this.visualBoardLayout.cols,
      getCellHeight(this.visualBoardLayout) * this.visualBoardLayout.rows,
    );
    drawCastleRuntimeBoardPanel(this, gridBounds, {
      bg: this.colorBg,
      primary: this.colorPrimary,
      accent: this.colorAccent,
    });

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
    this.pickupCount = 0;
    this.bossHitCount = 0;
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

  private createDebugAssetsOverlay(uid: string): void {
    const roles = ['pickup', 'obstacle', 'boss'] as const;
    const lines = [`[debugAssets=1] univers: ${uid}`];
    for (const role of roles) {
      const key = `rt_${uid}_${role}`;
      lines.push(`  ${this.textures.exists(key) ? '✓' : '✗'} ${role}`);
    }
    this.add.text(4, 58, lines.join('\n'), {
      fontFamily: 'monospace', fontSize: '8px', color: '#00ff88',
      backgroundColor: '#000000cc', padding: { x: 4, y: 2 },
    }).setDepth(GAMEPLAY_LAYERS.DEBUG).setScrollFactor(0);
  }

  private applyCriticalVisibilityPalette(): void {
    const uid = this.levelConfig.universeId;
    if (uid === 'kombat') {
      this.colorBg = this.levelConfig.type === 'boss' ? 0x120303 : 0x160505;
      this.colorPrimary = 0xff6a2a;
      this.colorAccent = 0xffe066;
    } else if (uid === 'shinobi' && this.levelConfig.type === 'boss') {
      this.colorBg = 0x07111d;
      this.colorPrimary = 0x7cecff;
      this.colorAccent = 0xe6f7ff;
    }
  }

  private computeCastleReferenceLayout(width: number, height: number): GridLayout {
    let layout = computeGridLayout(
      width,
      height,
      CASTLE_GRID_COLS,
      CASTLE_GRID_ROWS,
      GAMEPLAY_HUD.HEIGHT,
      24,
      CASTLE_REFERENCE_GRID_WIDTH,
      12,
      CASTLE_REFERENCE_GRID_Y_BIAS,
    );
    const gridHeight = layout.cellSize * layout.rows;
    if (layout.y + gridHeight + CASTLE_REFERENCE_BOTTOM_BREATHING <= height - 10) {
      layout = { ...layout, y: layout.y + CASTLE_REFERENCE_BOTTOM_BREATHING };
    }
    return layout;
  }

  private computeActiveGridLayout(reference: GridLayout, cols: number, rows: number): GridLayout {
    const referenceWidth = getCellWidth(reference) * reference.cols;
    const referenceHeight = getCellHeight(reference) * reference.rows;
    const cellSize = Math.min(referenceWidth / cols, referenceHeight / rows);
    const gridWidth = cellSize * cols;
    const gridHeight = cellSize * rows;
    return {
      x: reference.x + (referenceWidth - gridWidth) / 2,
      y: reference.y + (referenceHeight - gridHeight) / 2,
      cellSize,
      cellWidth: cellSize,
      cellHeight: cellSize,
      cols,
      rows,
    };
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

    // Fixed-step accumulator — mechanic can override speed (e.g. Sonic turbo boost)
    const effectiveSpeedMs = this.levelConfig.speedMs * this.mechanic.getSpeedMultiplier();
    this.tickAccumulator += delta;
    if (this.tickAccumulator < effectiveSpeedMs) return;
    this.tickAccumulator -= effectiveSpeedMs;
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
      this.pickupCount += 1;
      this.spawnScorePopup(`+${SCORE_VALUES.PICKUP}`, result.head.col, result.head.row);
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
    const cs = getCellMin(this.layout);
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
    const cs = getCellMin(this.layout);
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
    this.bossHitCount += 1;
    this.spawnScorePopup(`+${SCORE_VALUES.BOSS_HIT}`, head.col, head.row);
    flashScreen(this, 0xffffff, 0.32, 160, GAMEPLAY_LAYERS.SCREEN_FX);
    this.cameras.main.shake(110, 0.006);
    AudioSystem.bossHit();
    this.syncMechanicCtx();
    return true;
  }

  private spawnScorePopup(text: string, col: number, row: number): void {
    const { px, py } = cellToPixel(this.layout, col, row);
    const cellH = getCellHeight(this.layout);
    const popup = this.add.text(px, py - cellH * 0.5, text, {
      fontFamily: UI_FONT,
      fontStyle: '800',
      fontSize: '13px',
      color: '#ffe066',
      stroke: '#000000',
      strokeThickness: 3,
    }).setOrigin(0.5).setDepth(GAMEPLAY_LAYERS.GAMEPLAY_FX);
    this.tweens.add({
      targets: popup,
      y: py - cellH * 2.0,
      alpha: 0,
      duration: 650,
      ease: 'Power1',
      onComplete: () => popup.destroy(),
    });
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
      UNIVERSES[this.levelConfig.universeId].shortName,
      this.levelConfig.ruleText,
      isBoss ? boss!.getHp() : this.score,
      isBoss ? boss!.getMaxHp() : this.levelConfig.quota,
      this.mechanic.getHudExtra(),
      isBoss ? 'HP ' : isCastle ? 'MAGIC ' : '',
      this.runtimeScore,
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
          pickupCount: this.pickupCount,
          bossHitCount: this.bossHitCount,
        });
      });
    });
  }

  private triggerClear(): void {
    this.cleared = true;
    const isBoss = this.mechanic instanceof BaseBoss;
    this.runtimeScore += isBoss ? SCORE_VALUES.BOSS_CLEAR : SCORE_VALUES.STAGE_CLEAR;
    const remainingMs = Math.max(0, 120_000 - this.tickCount * this.levelConfig.speedMs);
    const timeBonus = isBoss ? 0 : Math.floor(remainingMs / 1000) * SCORE_VALUES.TIME_SECOND;
    this.runtimeScore += timeBonus;
    if (isBoss) {
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
          timeBonus,
          pickupCount: this.pickupCount,
          bossHitCount: this.bossHitCount,
        });
      });
    });
  }
}
