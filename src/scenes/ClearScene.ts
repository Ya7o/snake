import Phaser from 'phaser';
import { SCENES } from '../config/constants';
import { getLevelById } from '../config/levels';
import { UNIVERSES } from '../config/universes';
import { MAP_NODES } from '../config/mapNodes';
import { ARCADE_FONT, UI_FONT, addMobileButton, drawConsoleFrame, addScanlines, flashScreen } from '../render/VfxUtils';

export interface ClearData {
  levelId: string;
}

export class ClearScene extends Phaser.Scene {
  constructor() {
    super(SCENES.CLEAR);
  }

  create(data: ClearData): void {
    const { width, height } = this.scale;
    const W = width, H = height;
    const levelId = data?.levelId ?? 'castle_normal';
    const level = getLevelById(levelId);
    const universe = level ? UNIVERSES[level.universeId] : null;
    const bgColor   = universe ? parseInt(universe.palette.bg.replace('#', ''), 16) : 0x000000;
    const accentStr = universe?.palette.accent ?? '#ffd86b';
    const accentHex = parseInt(accentStr.replace('#', ''), 16);
    const primaryHex = universe ? parseInt(universe.palette.primary.replace('#', ''), 16) : 0x888888;

    // Background
    this.add.rectangle(W / 2, H / 2, W, H, bgColor).setDepth(0);

    // Gold flash on enter
    flashScreen(this, accentHex, 0.6, 500);

    // Sparkle particles (procedural stars)
    const sparks = this.add.graphics().setDepth(3);
    const sparkData: Array<{ x: number; y: number; r: number; a: number; va: number }> = [];
    for (let i = 0; i < 28; i++) {
      sparkData.push({
        x: Math.random() * W,
        y: Math.random() * H * 0.7,
        r: Math.random() * 3 + 1,
        a: Math.random(),
        va: (Math.random() * 0.03 + 0.01) * (Math.random() < 0.5 ? 1 : -1),
      });
    }
    this.time.addEvent({
      delay: 40,
      repeat: 50,
      callback: () => {
        sparks.clear();
        for (const s of sparkData) {
          s.a += s.va;
          if (s.a > 1) { s.a = 1; s.va *= -1; }
          if (s.a < 0) { s.a = 0; s.va *= -1; }
          sparks.fillStyle(accentHex, s.a);
          sparks.fillCircle(s.x, s.y, s.r);
        }
      },
    });

    // Console frame
    drawConsoleFrame(this, W * 0.06, H * 0.07, W * 0.88, H * 0.86, accentHex, primaryHex, 4);

    // CLEAR! title
    this.add.text(W / 2 + 3, H * 0.22 + 3, 'CLEAR!', {
      fontFamily: ARCADE_FONT,
      fontSize: `${Math.min(28, Math.floor(W * 0.08))}px`,
      color: '#886600',
    }).setOrigin(0.5).setDepth(5);

    const clearTxt = this.add.text(W / 2, H * 0.22, 'CLEAR!', {
      fontFamily: ARCADE_FONT,
      fontSize: `${Math.min(28, Math.floor(W * 0.08))}px`,
      color: accentStr,
    }).setOrigin(0.5).setDepth(6);

    this.tweens.add({
      targets: clearTxt,
      scaleX: 1.06, scaleY: 1.06,
      duration: 700,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    // Universe name
    if (universe) {
      this.add.text(W / 2, H * 0.36, universe.name.toUpperCase(), {
        fontFamily: ARCADE_FONT,
        fontSize: `${Math.min(8, Math.floor(W * 0.022))}px`,
        color: universe.palette.primary,
      }).setOrigin(0.5).setDepth(6);
    }

    // Boss defeated badge
    if (level?.type === 'boss') {
      const badgeGfx = this.add.graphics().setDepth(5);
      badgeGfx.fillStyle(0xe74c3c, 0.9);
      badgeGfx.fillRoundedRect(W / 2 - 70, H * 0.43, 140, 22, 4);

      this.add.text(W / 2, H * 0.441, 'BOSS DEFEATED!', {
        fontFamily: ARCADE_FONT,
        fontSize: '7px',
        color: '#ffffff',
      }).setOrigin(0.5).setDepth(6);
    }

    // Next level
    const currentNode = MAP_NODES.find(n => n.levelId === levelId);
    const nodeIndex = currentNode ? MAP_NODES.findIndex(n => n.id === currentNode.id) : -1;
    const nextNode  = nodeIndex >= 0 && nodeIndex < MAP_NODES.length - 1 ? MAP_NODES[nodeIndex + 1] : null;
    const nextLevel = nextNode ? getLevelById(nextNode.levelId) : null;

    if (nextLevel) {
      this.add.text(W / 2, H * 0.58, nextLevel.name.toUpperCase(), {
        fontFamily: UI_FONT,
        fontSize: `${Math.min(17, Math.floor(W * 0.044))}px`,
        fontStyle: '700',
        color: '#d8d8e8',
      }).setOrigin(0.5).setDepth(6);

      addMobileButton(this, {
        x: W / 2,
        y: H * 0.72,
        width: Math.min(260, W * 0.72),
        height: Math.max(52, Math.min(60, H * 0.08)),
        label: 'NEXT LEVEL',
        primary: true,
        fillColor: 0x173018,
        pressedFillColor: 0x24502a,
        strokeColor: accentHex,
        textColor: '#ffffff',
        onClick: () => {
          this.cameras.main.fadeOut(200, 0, 0, 0);
          this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start(SCENES.LEVEL_INTRO, { levelId: nextNode!.levelId });
          });
        },
      });
    } else {
      this.add.text(W / 2, H * 0.66, 'ALL LEVELS', {
        fontFamily: ARCADE_FONT, fontSize: `${Math.min(9, Math.floor(W * 0.025))}px`, color: accentStr
      }).setOrigin(0.5).setDepth(6);
      this.add.text(W / 2, H * 0.73, 'COMPLETE!', {
        fontFamily: ARCADE_FONT, fontSize: `${Math.min(9, Math.floor(W * 0.025))}px`, color: accentStr
      }).setOrigin(0.5).setDepth(6);
    }

    // Map button
    addMobileButton(this, {
      x: W / 2,
      y: H * 0.86,
      width: Math.min(210, W * 0.58),
      height: 46,
      label: 'WORLD MAP',
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
    this.cameras.main.fadeIn(300, 0, 0, 0);
  }
}
