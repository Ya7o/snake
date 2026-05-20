import Phaser from 'phaser';
import { SCENES } from '../config/constants';
import { getLevelById } from '../config/levels';
import { UNIVERSES } from '../config/universes';

export interface GameOverData {
  levelId: string;
}

export class GameOverScene extends Phaser.Scene {
  constructor() {
    super(SCENES.GAME_OVER);
  }

  create(data: GameOverData): void {
    const { width, height } = this.scale;
    const levelId = data?.levelId ?? 'castle_normal';
    const level = getLevelById(levelId);
    const universe = level ? UNIVERSES[level.universeId] : null;
    const bgColor = universe ? parseInt(universe.palette.bg.replace('#', ''), 16) : 0x050010;

    this.add.rectangle(width / 2, height / 2, width, height, bgColor);

    this.add.text(width / 2, height * 0.25, 'GAME OVER', {
      fontFamily: 'monospace', fontSize: '34px', color: '#e74c3c'
    }).setOrigin(0.5);

    if (level) {
      this.add.text(width / 2, height * 0.40, level.name, {
        fontFamily: 'monospace', fontSize: '15px', color: '#888888'
      }).setOrigin(0.5);
    }

    // Retry
    const retryBtn = this.add.text(width / 2, height * 0.58, '> RETRY', {
      fontFamily: 'monospace', fontSize: '22px', color: '#ffffff'
    }).setOrigin(0.5).setInteractive();
    retryBtn.on('pointerdown', () => {
      this.scene.start(SCENES.GAME, { levelId });
    });

    // World map
    this.add.text(width / 2, height * 0.72, '< WORLD MAP', {
      fontFamily: 'monospace', fontSize: '16px', color: '#888888'
    }).setOrigin(0.5).setInteractive().on('pointerdown', () => {
      this.scene.start(SCENES.WORLD_MAP);
    });
  }
}
