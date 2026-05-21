import Phaser from 'phaser';
import { SCENES } from '../config/constants';
import { getLevelById } from '../config/levels';
import { UNIVERSES } from '../config/universes';
import { ARCADE_FONT, UI_FONT, addMobileButton, drawConsoleFrame, addScanlines, flashScreen } from '../render/VfxUtils';

export interface GameOverData {
  levelId: string;
}

export class GameOverScene extends Phaser.Scene {
  constructor() {
    super(SCENES.GAME_OVER);
  }

  create(data: GameOverData): void {
    const { width, height } = this.scale;
    const W = width, H = height;
    const levelId = data?.levelId ?? 'castle_normal';
    const level = getLevelById(levelId);
    const universe = level ? UNIVERSES[level.universeId] : null;
    const bgColor   = universe ? parseInt(universe.palette.bg.replace('#', ''), 16) : 0x050010;
    const primaryHex = universe ? parseInt(universe.palette.primary.replace('#', ''), 16) : 0x880000;

    // Background
    this.add.rectangle(W / 2, H / 2, W, H, bgColor).setDepth(0);

    // Red flash on death
    flashScreen(this, 0xe74c3c, 0.65, 400);

    // Subtle grid
    const grid = this.add.graphics().setDepth(1);
    grid.lineStyle(1, primaryHex, 0.07);
    for (let x = 0; x < W; x += 28) grid.lineBetween(x, 0, x, H);
    for (let y = 0; y < H; y += 28) grid.lineBetween(0, y, W, y);

    // Console frame
    drawConsoleFrame(this, W * 0.06, H * 0.07, W * 0.88, H * 0.86, 0xe74c3c, primaryHex, 4);

    // Defeat title with shadow
    this.add.text(W / 2 + 3, H * 0.24 + 3, 'PERDU', {
      fontFamily: ARCADE_FONT,
      fontSize: `${Math.min(26, Math.floor(W * 0.074))}px`,
      color: '#660000',
    }).setOrigin(0.5).setDepth(5);
    this.add.text(W / 2, H * 0.24, 'PERDU', {
      fontFamily: ARCADE_FONT,
      fontSize: `${Math.min(26, Math.floor(W * 0.074))}px`,
      color: '#e74c3c',
    }).setOrigin(0.5).setDepth(6);

    this.add.text(W / 2 + 3, H * 0.35 + 3, 'REJOUE', {
      fontFamily: ARCADE_FONT,
      fontSize: `${Math.min(26, Math.floor(W * 0.074))}px`,
      color: '#660000',
    }).setOrigin(0.5).setDepth(5);
    this.add.text(W / 2, H * 0.35, 'REJOUE', {
      fontFamily: ARCADE_FONT,
      fontSize: `${Math.min(26, Math.floor(W * 0.074))}px`,
      color: '#e74c3c',
    }).setOrigin(0.5).setDepth(6);

    // Level name
    if (level) {
      this.add.text(W / 2, H * 0.5, level.name.toUpperCase(), {
        fontFamily: UI_FONT,
        fontSize: `${Math.min(17, Math.floor(W * 0.044))}px`,
        fontStyle: '700',
        color: '#666688',
      }).setOrigin(0.5).setDepth(6);
    }

    // RETRY button
    addMobileButton(this, {
      x: W / 2,
      y: H * 0.64,
      width: Math.min(260, W * 0.72),
      height: Math.max(52, Math.min(60, H * 0.08)),
      label: 'REJOUER',
      primary: true,
      fillColor: 0x341111,
      pressedFillColor: 0x541818,
      strokeColor: 0xe74c3c,
      textColor: '#ffffff',
      onClick: () => {
        this.cameras.main.fadeOut(200, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
          this.scene.start(SCENES.GAME, { levelId });
        });
      },
    });

    // Separator
    const sep = this.add.graphics().setDepth(5);
    sep.lineStyle(1, 0xe74c3c, 0.3);
    sep.lineBetween(W * 0.2, H * 0.72, W * 0.8, H * 0.72);

    // World Map button
    addMobileButton(this, {
      x: W / 2,
      y: H * 0.81,
      width: Math.min(210, W * 0.58),
      height: 46,
      label: 'CARTE',
      fillColor: 0x0d1020,
      pressedFillColor: 0x171b34,
      strokeColor: 0x555577,
      textColor: '#b8b8cc',
      onClick: () => {
        this.cameras.main.fadeOut(200, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
          this.scene.start(SCENES.WORLD_MAP);
        });
      },
    });

    addScanlines(this, 0.04, 20);
    this.cameras.main.fadeIn(180, 0, 0, 0);
  }
}
