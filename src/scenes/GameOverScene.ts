import Phaser from 'phaser';
import { UNIVERSE_RESULT_SCREEN_ASSETS, SCENES } from '../config/constants';
import { getLevelById, resolveLevelId } from '../config/levels';
import { UNIVERSES } from '../config/universes';
import { RESULT_SCREEN_LAYOUT, CASTLE_RESULT_THEME, getUniverseButtons } from '../ui/RuntimeUILayout';
import { ARCADE_FONT, UI_FONT, addMobileButton, drawConsoleFrame, flashScreen } from '../render/VfxUtils';
import { SaveSystem } from '../systems/SaveSystem';

export interface GameOverData {
  levelId: string;
  score?: number;
  bestScore?: number;
  pickupCount?: number;
  bossHitCount?: number;
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
    const isShortPortrait = H < 700 && H > W;
    const titleY = H * L.titleY;
    const causeY = H * (isShortPortrait ? 0.35 : 0.36);
    const scoreY = H * (isShortPortrait ? 0.47 : 0.48);
    const levelY = H * (isShortPortrait ? 0.57 : 0.58);
    const retryButtonY = H * (isShortPortrait ? 0.68 : 0.67);
    const separatorY = H * (isShortPortrait ? 0.77 : 0.76);
    const mapButtonY = H * (isShortPortrait ? 0.86 : 0.85);
    const primaryButtonH = Math.min(50, Math.max(42, Math.floor(H * 0.06)));
    const secondaryButtonH = Math.min(42, Math.max(36, Math.floor(H * 0.05)));
    const addFittedText = (
      x: number,
      y: number,
      text: string,
      fontSize: number,
      maxWidth: number,
      style: Phaser.Types.GameObjects.Text.TextStyle,
    ): Phaser.GameObjects.Text => {
      const label = this.add.text(x, y, text, {
        ...style,
        fontSize: `${fontSize}px`,
      }).setOrigin(0.5).setDepth(6);
      let fittedFont = fontSize;
      while (label.width > maxWidth && fittedFont > 10) {
        fittedFont -= 1;
        label.setFontSize(fittedFont);
      }
      return label;
    };

    // Defeat title with shadow
    this.add.text(W / 2 + 3, titleY + 3, 'PERDU', {
      fontFamily: ARCADE_FONT,
      fontSize: `${Math.min(26, Math.floor(W * 0.074))}px`,
      color: '#660000',
    }).setOrigin(0.5).setDepth(5);
    this.add.text(W / 2, titleY, 'PERDU', {
      fontFamily: ARCADE_FONT,
      fontSize: `${Math.min(26, Math.floor(W * 0.074))}px`,
      color: isCastle ? CT.titleLoss : '#e74c3c',
    }).setOrigin(0.5).setDepth(6);

    const causeText = isCastle ? 'Pris dans l\'illusion' : 'ENCORE UNE FOIS';
    const causeBacking = this.add.graphics().setDepth(5);
    causeBacking.fillStyle(0x000000, 0.38);
    causeBacking.fillRoundedRect(W * 0.12, causeY - 20, W * 0.76, 40, 6);
    addFittedText(W / 2, causeY, causeText, Math.min(20, Math.floor(W * 0.052)), W * 0.68, {
      fontFamily: UI_FONT,
      fontStyle: '800',
      color: isCastle ? '#f7e9c8' : '#e74c3c',
      align: 'center',
      wordWrap: { width: W * 0.76, useAdvancedWrap: true },
    });

    const score = Math.max(0, Math.floor(data?.score ?? 0));
    const bestScore = Math.max(0, Math.floor(data?.bestScore ?? SaveSystem.getBestScore(levelId)));
    const scoreFont = Math.min(16, Math.floor(W * 0.039));
    const scorePanelW = Math.min(340, W * 0.78);
    const lineH = Math.max(21, Math.floor(H * 0.026));
    const scorePanelH = lineH * 2 + 18;
    const scoreMaxTextW = scorePanelW - 24;
    const scorePanel = this.add.graphics().setDepth(5);
    scorePanel.fillStyle(0x000000, 0.48);
    scorePanel.fillRoundedRect(W / 2 - scorePanelW / 2, scoreY - scorePanelH / 2, scorePanelW, scorePanelH, 6);
    scorePanel.lineStyle(1, isCastle ? 0xf6c45c : 0xe74c3c, 0.42);
    scorePanel.strokeRoundedRect(W / 2 - scorePanelW / 2, scoreY - scorePanelH / 2, scorePanelW, scorePanelH, 6);
    addFittedText(W / 2, scoreY - lineH / 2, `TOTAL : ${score}`, scoreFont, scoreMaxTextW, {
      fontFamily: UI_FONT,
      fontStyle: '800',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 2,
    });
    addFittedText(W / 2, scoreY + lineH / 2, `BEST : ${bestScore}`, scoreFont, scoreMaxTextW, {
      fontFamily: UI_FONT,
      fontStyle: '800',
      color: isCastle ? '#f6c45c' : '#e74c3c',
      stroke: '#000000',
      strokeThickness: 2,
    });

    // Level name
    if (level) {
      addFittedText(W / 2, levelY, level.name.toUpperCase(), Math.min(17, Math.floor(W * 0.044)), W * 0.82, {
        fontFamily: UI_FONT,
        fontStyle: '700',
        color: isCastle ? '#d7c6ff' : '#666688',
        stroke: '#000000',
        strokeThickness: 2,
      });
    }

    // RETRY button
    addMobileButton(this, {
      x: W / 2,
      y: retryButtonY,
      width: Math.min(260, W * L.primaryButtonW),
      height: primaryButtonH,
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
    sep.lineBetween(W * 0.2, separatorY, W * 0.8, separatorY);

    // World Map button
    addMobileButton(this, {
      x: W / 2,
      y: mapButtonY,
      width: Math.min(210, W * L.secondaryButtonW),
      height: secondaryButtonH,
      label: 'CARTE',
      fillColor: buttons.secondaryFill,
      pressedFillColor: buttons.secondaryPressed,
      strokeColor: buttons.secondaryStroke,
      textColor: buttons.secondaryText,
      onClick: () => {
        this.cameras.main.fadeOut(200, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
          this.scene.start(SCENES.WORLD_MAP, { levelId: this.levelId });
        });
      },
    });

    this.cameras.main.fadeIn(180, 0, 0, 0);
  }
}
