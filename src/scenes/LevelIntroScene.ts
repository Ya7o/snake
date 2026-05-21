import Phaser from 'phaser';
import { MOBILE_UI, SCENES } from '../config/constants';
import { getLevelById } from '../config/levels';
import { UNIVERSES } from '../config/universes';
import { ARCADE_FONT, UI_FONT, addMobileButton, drawConsoleFrame, addScanlines, flashScreen } from '../render/VfxUtils';

const clamp = (value: number, min: number, max: number): number => Math.max(min, Math.min(max, value));

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
    const safeX = Math.max(16, Math.floor(W * 0.06));
    const panelW = W - safeX * 2;
    const frameY = Math.max(28, H * 0.055);
    const frameH = Math.min(H - frameY - MOBILE_UI.SAFE_BOTTOM, H * 0.88);
    const innerBottom = frameY + frameH - 28;
    const titleY = frameY + clamp(H * 0.12, 58, 74);
    const nameY = frameY + clamp(H * 0.31, 148, 182);
    const ruleY = frameY + clamp(H * 0.43, 222, 252);
    const backBtnY = Math.min(H - MOBILE_UI.SAFE_BOTTOM - 28, innerBottom - MOBILE_UI.MIN_TOUCH_H / 2);
    const playBtnY = backBtnY - MOBILE_UI.MIN_TOUCH_H / 2 - MOBILE_UI.PRIMARY_TOUCH_H / 2 - 12;
    const infoY = ruleY + 22;
    const hintY = Math.min(ruleY + 70, playBtnY - MOBILE_UI.PRIMARY_TOUCH_H / 2 - 26);

    // Background
    this.add.rectangle(W / 2, H / 2, W, H, bgColor).setDepth(0);

    // Subtle grid pattern
    const grid = this.add.graphics().setDepth(1);
    grid.lineStyle(1, primary, 0.08);
    for (let x = 0; x < W; x += 28) grid.lineBetween(x, 0, x, H);
    for (let y = 0; y < H; y += 28) grid.lineBetween(0, y, W, y);

    // Console frame
    drawConsoleFrame(this, safeX, frameY, panelW, frameH, primary, accent, 4);

    // Universe name banner
    const bannerGfx = this.add.graphics().setDepth(5);
    bannerGfx.fillStyle(primary, 0.24);
    bannerGfx.fillRect(safeX + 14, titleY - 28, panelW - 28, 56);
    bannerGfx.lineStyle(2, primary, 0.8);
    bannerGfx.strokeRect(safeX + 14, titleY - 28, panelW - 28, 56);

    this.add.text(W / 2, titleY, universe.name.toUpperCase(), {
      fontFamily: ARCADE_FONT,
      fontSize: `${Math.max(MOBILE_UI.CAPTION_MIN, Math.min(12, Math.floor(W * 0.03)))}px`,
      color: universe.palette.primary,
      align: 'center',
      wordWrap: { width: panelW - 48, useAdvancedWrap: true },
    }).setOrigin(0.5).setDepth(6);

    // Boss badge
    if (isBoss) {
      const badgeGfx = this.add.graphics().setDepth(5);
      badgeGfx.fillStyle(0xe74c3c, 1);
      badgeGfx.fillRoundedRect(W / 2 - 44, nameY - 58, 88, 20, 4);

      this.add.text(W / 2, nameY - 48, 'BOSS', {
        fontFamily: UI_FONT,
        fontSize: `${MOBILE_UI.LABEL_MIN}px`,
        fontStyle: '700',
        color: '#ffffff',
      }).setOrigin(0.5).setDepth(6);
    }

    // Level name (main)
    this.add.text(W / 2, nameY, level.name.toUpperCase(), {
      fontFamily: ARCADE_FONT,
      fontSize: `${Math.min(13, Math.floor(W * 0.036))}px`,
      color: universe.palette.accent,
      align: 'center',
      wordWrap: { width: panelW - 44, useAdvancedWrap: true },
    }).setOrigin(0.5).setDepth(6);

    // Separator
    const sep = this.add.graphics().setDepth(5);
    sep.lineStyle(1, accent, 0.5);
    sep.lineBetween(safeX + 40, ruleY - 44, W - safeX - 40, ruleY - 44);

    // Rule text
    const ruleGfx = this.add.graphics().setDepth(5);
    ruleGfx.fillStyle(accent, 0.12);
    ruleGfx.fillRoundedRect(safeX + 16, ruleY - 34, panelW - 32, 68, 6);

    this.add.text(W / 2, ruleY - 8, level.ruleText, {
      fontFamily: UI_FONT,
      fontSize: `${Math.max(MOBILE_UI.LABEL_MIN, Math.min(16, Math.floor(W * 0.04)))}px`,
      fontStyle: '700',
      color: '#f39c12',
      align: 'center',
      wordWrap: { width: panelW - 56, useAdvancedWrap: true },
    }).setOrigin(0.5).setDepth(6);

    // Info (quota or boss HP)
    const infoText = isBoss
      ? `PV BOSS : ${level.bossHp ?? 3}`
      : `OBJECTIF : ${level.quota ?? 10}`;

    this.add.text(W / 2, infoY, infoText, {
      fontFamily: UI_FONT,
      fontSize: `${MOBILE_UI.LABEL_MIN}px`,
      fontStyle: '700',
      color: '#aaaacc',
    }).setOrigin(0.5).setDepth(6);

    const hintFontSize = Math.max(MOBILE_UI.LABEL_MIN, Math.min(15, Math.floor(W * 0.038)));
    const hint = this.add.text(W / 2, hintY, level.introHint, {
      fontFamily: UI_FONT,
      fontSize: `${hintFontSize}px`,
      fontStyle: '700',
      color: '#d8d8ee',
      align: 'center',
      lineSpacing: 3,
      wordWrap: { width: panelW - 48, useAdvancedWrap: true },
    }).setOrigin(0.5).setDepth(6);
    hint.setMaxLines(playBtnY - hintY < 76 ? 2 : 3);

    // 906 — universe asset badge (pickup or boss icon, right side of frame)
    const uid = level.universeId;
    const badgeKey = isBoss ? `db_${uid}_boss` : `db_${uid}_pickup01`;
    if (this.textures.exists(badgeKey)) {
      const badgeSize = Math.min(42, W * 0.11);
      this.add.image(W - safeX - 30, ruleY, badgeKey)
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

    // Primary and back buttons
    addMobileButton(this, {
      x: W / 2,
      y: playBtnY,
      width: Math.min(260, panelW - 40),
      height: MOBILE_UI.PRIMARY_TOUCH_H,
      label: 'JOUER',
      primary: true,
      fillColor: 0x10172a,
      pressedFillColor: 0x1b2746,
      strokeColor: 0xffffff,
      textColor: '#ffffff',
      onClick: startLevel,
    });

    addMobileButton(this, {
      x: W / 2,
      y: backBtnY,
      width: Math.min(220, panelW - 40),
      height: MOBILE_UI.MIN_TOUCH_H,
      label: 'CARTE',
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
      startLevel();
    });
  }
}
