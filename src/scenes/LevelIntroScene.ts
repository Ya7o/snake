import Phaser from 'phaser';
import { MOBILE_UI, SCENES } from '../config/constants';
import { getLevelById } from '../config/levels';
import { UNIVERSES } from '../config/universes';
import { ARCADE_FONT, UI_FONT, addMobileButton, drawConsoleFrame, addScanlines, flashScreen } from '../render/VfxUtils';

export interface LevelIntroData {
  levelId: string;
}

export class LevelIntroScene extends Phaser.Scene {
  private introLevelId = '';

  constructor() {
    super(SCENES.LEVEL_INTRO);
  }

  init(data: LevelIntroData): void {
    this.introLevelId = data?.levelId ?? 'castle_normal';
  }

  preload(): void {
    // 906 — preload universe pickup/boss asset for the intro badge
    const level = getLevelById(this.introLevelId);
    if (!level) return;
    const uid = level.universeId;
    const assetPairs: Array<[string, string]> = [
      [`db_${uid}_pickup01`, `assets/universes/${uid}/pickup_01.png`],
      [`db_${uid}_boss`,     `assets/universes/${uid}/boss.png`],
    ];
    for (const [key, path] of assetPairs) {
      if (!this.textures.exists(key)) this.load.image(key, path);
    }
  }

  create(data: LevelIntroData): void {
    const { width, height } = this.scale;
    const W = width, H = height;
    const levelId = data?.levelId ?? this.introLevelId ?? 'castle_normal';
    const level = getLevelById(levelId);
    if (!level) { this.scene.start(SCENES.WORLD_MAP); return; }

    const universe = UNIVERSES[level.universeId];
    const bgColor   = parseInt(universe.palette.bg.replace('#', ''), 16);
    const primary   = parseInt(universe.palette.primary.replace('#', ''), 16);
    const accent    = parseInt(universe.palette.accent.replace('#', ''), 16);
    const isBoss = level.type === 'boss';

    // Background
    this.add.rectangle(W / 2, H / 2, W, H, bgColor).setDepth(0);

    // Subtle grid pattern
    const grid = this.add.graphics().setDepth(1);
    grid.lineStyle(1, primary, 0.08);
    for (let x = 0; x < W; x += 28) grid.lineBetween(x, 0, x, H);
    for (let y = 0; y < H; y += 28) grid.lineBetween(0, y, W, y);

    // Console frame
    const frameX = W * 0.06, frameY = H * 0.07;
    const frameW = W * 0.88, frameH = H * 0.86;
    drawConsoleFrame(this, frameX, frameY, frameW, frameH, primary, accent, 4);

    // Universe name banner
    const bannerGfx = this.add.graphics().setDepth(5);
    bannerGfx.fillStyle(primary, 0.25);
    bannerGfx.fillRect(W * 0.1, H * 0.14, W * 0.8, H * 0.1);
    bannerGfx.lineStyle(2, primary, 0.8);
    bannerGfx.strokeRect(W * 0.1, H * 0.14, W * 0.8, H * 0.1);

    this.add.text(W / 2, H * 0.19, universe.name.toUpperCase(), {
      fontFamily: ARCADE_FONT,
      fontSize: `${Math.max(MOBILE_UI.CAPTION_MIN, Math.min(12, Math.floor(W * 0.03)))}px`,
      color: universe.palette.primary,
    }).setOrigin(0.5).setDepth(6);

    // Boss badge
    if (isBoss) {
      const badgeGfx = this.add.graphics().setDepth(5);
      badgeGfx.fillStyle(0xe74c3c, 1);
      badgeGfx.fillRoundedRect(W / 2 - 44, H * 0.295, 88, 20, 4);

      this.add.text(W / 2, H * 0.305, '⚡ BOSS ⚡', {
        fontFamily: UI_FONT,
        fontSize: `${MOBILE_UI.LABEL_MIN}px`,
        fontStyle: '700',
        color: '#ffffff',
      }).setOrigin(0.5).setDepth(6);
    }

    // Level name (main)
    this.add.text(W / 2, H * 0.39, level.name.toUpperCase(), {
      fontFamily: ARCADE_FONT,
      fontSize: `${Math.min(13, Math.floor(W * 0.036))}px`,
      color: universe.palette.accent,
    }).setOrigin(0.5).setDepth(6);

    // Separator
    const sep = this.add.graphics().setDepth(5);
    sep.lineStyle(1, accent, 0.5);
    sep.lineBetween(W * 0.2, H * 0.47, W * 0.8, H * 0.47);

    // Rule text
    const ruleGfx = this.add.graphics().setDepth(5);
    ruleGfx.fillStyle(accent, 0.12);
    ruleGfx.fillRoundedRect(W * 0.12, H * 0.5, W * 0.76, H * 0.09, 6);

    this.add.text(W / 2, H * 0.545, level.ruleText, {
      fontFamily: UI_FONT,
      fontSize: `${Math.max(MOBILE_UI.LABEL_MIN, Math.min(16, Math.floor(W * 0.04)))}px`,
      fontStyle: '700',
      color: '#f39c12',
    }).setOrigin(0.5).setDepth(6);

    // Info (quota or boss HP)
    const infoText = isBoss
      ? `BOSS HP : ${level.bossHp ?? 3}`
      : `COLLECT  ${level.quota ?? 10}  PICKUPS`;

    this.add.text(W / 2, H * 0.66, infoText, {
      fontFamily: UI_FONT,
      fontSize: `${Math.max(MOBILE_UI.LABEL_MIN, Math.min(15, Math.floor(W * 0.038)))}px`,
      fontStyle: '700',
      color: '#aaaacc',
    }).setOrigin(0.5).setDepth(6);

    // 906 — universe asset badge (pickup or boss icon, right side of frame)
    const uid = level.universeId;
    const badgeKey = isBoss ? `db_${uid}_boss` : `db_${uid}_pickup01`;
    if (this.textures.exists(badgeKey)) {
      const badgeSize = Math.min(48, W * 0.12);
      this.add.image(W * 0.86, H * 0.55, badgeKey)
        .setDisplaySize(badgeSize, badgeSize)
        .setAlpha(0.8)
        .setDepth(7);
    }

    const startLevel = (): void => {
      if (started) return;
      started = true;
      flashScreen(this, primary, 0.35, 200);
      this.time.delayedCall(150, () => {
        this.cameras.main.fadeOut(150, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
          this.scene.start(SCENES.GAME, { levelId });
        });
      });
    };

    let started = false;
    const startBtn = addMobileButton(this, {
      x: W / 2,
      y: H * 0.79,
      width: Math.min(250, W * 0.68),
      height: MOBILE_UI.PRIMARY_TOUCH_H,
      label: 'START',
      primary: true,
      fillColor: 0x162236,
      pressedFillColor: 0x223a58,
      strokeColor: accent,
      textColor: '#ffffff',
      onClick: startLevel,
    });

    // Back button
    addMobileButton(this, {
      x: W / 2,
      y: H * 0.9,
      width: Math.min(210, W * 0.58),
      height: MOBILE_UI.MIN_TOUCH_H,
      label: 'WORLD MAP',
      fillColor: 0x0d1020,
      pressedFillColor: 0x171b34,
      strokeColor: 0x555577,
      textColor: '#b8b8cc',
      onClick: () => this.scene.start(SCENES.WORLD_MAP),
    });

    addScanlines(this, 0.04, 20);

    // Fade in
    this.cameras.main.fadeIn(250, 0, 0, 0);

    // Input — global tap starts only outside explicit buttons.
    this.input.on('pointerdown', (_p: unknown, go: Phaser.GameObjects.GameObject[]) => {
      if (started) return;
      if (go && go.length > 0) return; // hit an interactive object
      if (startBtn.getBounds().contains(this.input.activePointer.x, this.input.activePointer.y)) return;
      startLevel();
    });
  }
}
