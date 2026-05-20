import Phaser from 'phaser';
import { SCENES } from '../config/constants';
import { getLevelById, LEVELS } from '../config/levels';
import { UNIVERSES } from '../config/universes';
import { MAP_NODES } from '../config/mapNodes';
import { SaveSystem } from '../systems/SaveSystem';

export interface ClearData {
  levelId: string;
}

export class ClearScene extends Phaser.Scene {
  constructor() {
    super(SCENES.CLEAR);
  }

  create(data: ClearData): void {
    const { width, height } = this.scale;
    const levelId = data?.levelId ?? 'castle_normal';
    const level = getLevelById(levelId);
    const universe = level ? UNIVERSES[level.universeId] : null;
    const bgColor = universe ? parseInt(universe.palette.bg.replace('#', ''), 16) : 0x000000;
    const accentColor = universe?.palette.accent ?? '#ffd86b';

    this.add.rectangle(width / 2, height / 2, width, height, bgColor);

    this.add.text(width / 2, height * 0.22, 'CLEAR!', {
      fontFamily: 'monospace', fontSize: '38px', color: accentColor
    }).setOrigin(0.5);

    if (universe) {
      this.add.text(width / 2, height * 0.38, universe.shortName, {
        fontFamily: 'monospace', fontSize: '16px', color: universe.palette.primary
      }).setOrigin(0.5);
    }

    if (level?.type === 'boss') {
      this.add.text(width / 2, height * 0.48, 'BOSS DEFEATED!', {
        fontFamily: 'monospace', fontSize: '18px', color: '#e74c3c'
      }).setOrigin(0.5);
    }

    // Find next level
    const currentNode = MAP_NODES.find(n => n.levelId === levelId);
    const nodeIndex = currentNode ? MAP_NODES.findIndex(n => n.id === currentNode.id) : -1;
    const nextNode = nodeIndex >= 0 && nodeIndex < MAP_NODES.length - 1 ? MAP_NODES[nodeIndex + 1] : null;
    const nextLevel = nextNode ? getLevelById(nextNode.levelId) : null;

    if (nextLevel) {
      this.add.text(width / 2, height * 0.62, `NEXT: ${nextLevel.name}`, {
        fontFamily: 'monospace', fontSize: '13px', color: '#aaaaaa'
      }).setOrigin(0.5);

      const nextBtn = this.add.text(width / 2, height * 0.75, '> NEXT LEVEL', {
        fontFamily: 'monospace', fontSize: '17px', color: '#ffffff'
      }).setOrigin(0.5).setInteractive();
      nextBtn.on('pointerdown', () => {
        this.scene.start(SCENES.LEVEL_INTRO, { levelId: nextNode!.levelId });
      });
    } else {
      this.add.text(width / 2, height * 0.68, 'ALL LEVELS COMPLETE!', {
        fontFamily: 'monospace', fontSize: '16px', color: accentColor
      }).setOrigin(0.5);
    }

    this.add.text(width / 2, height * 0.86, '< WORLD MAP', {
      fontFamily: 'monospace', fontSize: '15px', color: '#888888'
    }).setOrigin(0.5).setInteractive().on('pointerdown', () => {
      this.scene.start(SCENES.WORLD_MAP);
    });
  }
}
