import Phaser from 'phaser';
import { SCENES } from '../config/constants';
import { getLevelById } from '../config/levels';
import { UNIVERSES } from '../config/universes';

export interface LevelIntroData {
  levelId: string;
}

export class LevelIntroScene extends Phaser.Scene {
  constructor() {
    super(SCENES.LEVEL_INTRO);
  }

  init(_data: LevelIntroData): void {}

  create(data: LevelIntroData): void {
    const { width, height } = this.scale;
    const levelId = data?.levelId ?? 'castle_normal';
    const level = getLevelById(levelId);
    if (!level) { this.scene.start(SCENES.WORLD_MAP); return; }
    const universe = UNIVERSES[level.universeId];
    const bgColor = parseInt(universe.palette.bg.replace('#', ''), 16);
    const primaryColor = universe.palette.primary;
    const accentColor = universe.palette.accent;

    this.add.rectangle(width / 2, height / 2, width, height, bgColor);

    // Universe badge
    this.add.text(width / 2, height * 0.22, universe.name.toUpperCase(), {
      fontFamily: 'monospace', fontSize: '17px', color: primaryColor
    }).setOrigin(0.5);

    // Level name
    this.add.text(width / 2, height * 0.38, level.name, {
      fontFamily: 'monospace', fontSize: '22px', color: accentColor
    }).setOrigin(0.5);

    // Type badge
    const typeLabel = level.type === 'boss' ? '⚡ BOSS ⚡' : 'LEVEL';
    this.add.text(width / 2, height * 0.50, typeLabel, {
      fontFamily: 'monospace', fontSize: '14px', color: level.type === 'boss' ? '#e74c3c' : '#ffffff'
    }).setOrigin(0.5);

    // Rule
    this.add.text(width / 2, height * 0.62, level.ruleText, {
      fontFamily: 'monospace', fontSize: '16px', color: '#f39c12'
    }).setOrigin(0.5);

    // Info
    const infoText = level.type === 'boss'
      ? `Boss HP: ${level.bossHp ?? 3}`
      : `Collect: ${level.quota ?? 10}`;
    this.add.text(width / 2, height * 0.72, infoText, {
      fontFamily: 'monospace', fontSize: '13px', color: '#aaaaaa'
    }).setOrigin(0.5);

    // Start prompt
    this.add.text(width / 2, height * 0.85, 'TAP TO START', {
      fontFamily: 'monospace', fontSize: '15px', color: '#ffffff'
    }).setOrigin(0.5);

    // Back button
    this.add.text(width / 2, height * 0.93, '< BACK TO MAP', {
      fontFamily: 'monospace', fontSize: '12px', color: '#888888'
    }).setOrigin(0.5).setInteractive().on('pointerdown', () => {
      this.scene.start(SCENES.WORLD_MAP);
    });

    this.input.once('pointerdown', (_ptr: unknown, _go: unknown, _event: Phaser.Types.Input.EventData) => {
      this.scene.start(SCENES.GAME, { levelId });
    });
  }
}
