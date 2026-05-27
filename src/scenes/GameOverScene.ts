import Phaser from 'phaser';
import { UNIVERSE_RESULT_SCREEN_ASSETS, SCENES } from '../config/constants';
import { getLevelById, resolveLevelId } from '../config/levels';
import { UNIVERSES } from '../config/universes';
import { RESULT_SCREEN_LAYOUT, CASTLE_RESULT_THEME, getUniverseButtons } from '../ui/RuntimeUILayout';
import { ARCADE_FONT, UI_FONT, addMobileButton, drawConsoleFrame, flashScreen } from '../render/VfxUtils';

export interface GameOverData {
  levelId: string;
}

export class GameOverScene extends Phaser.Scene {
  private levelId = 'castle_normal';

  constructor() {
    super(SCENES.GAME_OVER);
  }

  init(data: GameOverData): void {
    this.levelId = resolveLevelId(data);
  }

  preload(): void {
    const level = getLevelById(this.levelId);
    if (!level) return;
    const univBg = UNIVERSE_RESULT_SCREEN_ASSETS[level.universeId];
    if (univBg && !this.textures.exists(univBg.gameOver.key)) {
      this.load.image(univBg.gameOver.key, univBg.gameOver.url);
    }
  }

  create(data: GameOverData): void {
    const { width, height } = this.scale;
    const W = width, H = height;
    const levelId = resolveLevelId(data) || this.levelId;
    const level = getLevelById(levelId);
    const universe = level ? UNIVERSES[level.universeId] : null;
    const isCastle = level?.universeId === 'castle';
    const bgColor   = universe ? parseInt(universe.palette.bg.replace('#', ''), 16) : 0x050010;
    const primaryHex = universe ? parseInt(universe.palette.primary.replace('#', ''), 16) : 0x880000;

    // Background
    this.add.rectangle(W / 2, H / 2, W, H, bgColor).setDepth(0);
    const univBg = UNIVERSE_RESULT_SCREEN_ASSETS[level?.universeId ?? ''];
    if (univBg && this.textures.exists(univBg.gameOver.key)) {
      const bg = this.add.image(W / 2, H / 2, univBg.gameOver.key).setDepth(1);
      bg.setScale(Math.max(W / bg.width, H / bg.height));
      this.add.rectangle(W / 2, H / 2, W, H, 0x000000, 0.16).setDepth(2);
    }

    // Red flash on death
    flashScreen(this, 0xe74c3c, 0.65, 400);

    if (!isCastle) {
      // Subtle grid
      const grid = this.add.graphics().setDepth(1);
      grid.lineStyle(1, primaryHex, 0.07);
      for (let x = 0; x < W; x += 28) grid.lineBetween(x, 0, x, H);
      for (let y = 0; y < H; y += 28) grid.lineBetween(0, y, W, y);

      // Console frame
      drawConsoleFrame(this, W * 0.06, H * 0.07, W * 0.88, H * 0.86, 0xe74c3c, primaryHex, 4);
    }

    const L = RESULT_SCREEN_LAYOUT;
    const CT = CASTLE_RESULT_THEME;
    const buttons = getUniverseButtons(level?.universeId ?? 'castle');

    // Defeat title with shadow
    this.add.text(W / 2 + 3, H * L.titleY + 3, 'PERDU', {
      fontFamily: ARCADE_FONT,
      fontSize: `${Math.min(26, Math.floor(W * 0.074))}px`,
      color: '#660000',
    }).setOrigin(0.5).setDepth(5);
    this.add.text(W / 2, H * L.titleY, 'PERDU', {
      fontFamily: ARCADE_FONT,
      fontSize: `${Math.min(26, Math.floor(W * 0.074))}px`,
      color: isCastle ? CT.titleLoss : '#e74c3c',
    }).setOrigin(0.5).setDepth(6);

    this.add.text(W / 2, H * L.subtitleY, isCastle ? "L'illusion t'a piégé" : 'REJOUE', {
      fontFamily: UI_FONT,
      fontSize: `${Math.min(20, Math.floor(W * 0.052))}px`,
      fontStyle: '800',
      color: isCastle ? '#f7e9c8' : '#e74c3c',
      align: 'center',
      wordWrap: { width: W * 0.76, useAdvancedWrap: true },
    }).setOrigin(0.5).setDepth(6);

    // Level name
    if (level) {
      this.add.text(W / 2, H * L.contextY, level.name.toUpperCase(), {
        fontFamily: UI_FONT,
        fontSize: `${Math.min(17, Math.floor(W * 0.044))}px`,
        fontStyle: '700',
        color: isCastle ? '#d7c6ff' : '#666688',
      }).setOrigin(0.5).setDepth(6);
    }

    // RETRY button
    addMobileButton(this, {
      x: W / 2,
      y: H * L.primaryButtonY,
      width: Math.min(260, W * L.primaryButtonW),
      height: L.primaryButtonH,
      label: 'REJOUER',
      primary: true,
      fillColor: buttons.primaryFill,
      pressedFillColor: buttons.primaryPressed,
      strokeColor: buttons.primaryStroke,
      textColor: buttons.primaryText,
      onClick: () => {
        this.cameras.main.fadeOut(200, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
          this.scene.start(SCENES.GAME, { levelId });
        });
      },
    });

    // Separator
    const sep = this.add.graphics().setDepth(5);
    sep.lineStyle(1, buttons.primaryFill, 0.35);
    sep.lineBetween(W * 0.2, H * L.separatorY, W * 0.8, H * L.separatorY);

    // World Map button
    addMobileButton(this, {
      x: W / 2,
      y: H * L.secondaryButtonY,
      width: Math.min(210, W * L.secondaryButtonW),
      height: L.secondaryButtonH,
      label: 'CARTE',
      fillColor: buttons.secondaryFill,
      pressedFillColor: buttons.secondaryPressed,
      strokeColor: buttons.secondaryStroke,
      textColor: buttons.secondaryText,
      onClick: () => {
        this.cameras.main.fadeOut(200, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
          this.scene.start(SCENES.WORLD_MAP);
        });
      },
    });

    this.cameras.main.fadeIn(180, 0, 0, 0);
  }
}
