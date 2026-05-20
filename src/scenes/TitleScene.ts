import Phaser from 'phaser';
import { SCENES } from '../config/constants';
import { AudioSystem } from '../systems/AudioSystem';
import { runQAChecks } from '../qa/QAChecks';

export class TitleScene extends Phaser.Scene {
  constructor() {
    super(SCENES.TITLE);
  }

  create(): void {
    AudioSystem.init();
    runQAChecks();

    const { width, height } = this.scale;
    this.add.rectangle(width / 2, height / 2, width, height, 0x05050a);

    // Stars background
    const gfx = this.add.graphics();
    for (let i = 0; i < 60; i++) {
      const sx = Math.random() * width;
      const sy = Math.random() * height;
      const sr = Math.random() * 1.5 + 0.3;
      gfx.fillStyle(0xffffff, Math.random() * 0.6 + 0.1);
      gfx.fillCircle(sx, sy, sr);
    }

    // Title
    this.add.text(width / 2, height * 0.26, 'SNAKE', {
      fontFamily: 'monospace', fontSize: '42px', color: '#ffd86b'
    }).setOrigin(0.5);
    this.add.text(width / 2, height * 0.38, 'DRIVE', {
      fontFamily: 'monospace', fontSize: '42px', color: '#ffd86b'
    }).setOrigin(0.5);
    this.add.text(width / 2, height * 0.49, 'V4', {
      fontFamily: 'monospace', fontSize: '26px', color: '#ffffff'
    }).setOrigin(0.5);

    // Universes preview
    const universeNames = ['CASTLE', 'SONIC', 'STREETS', 'FIGHTER', 'OUTRUN', 'SHINOBI', 'KOMBAT', 'PAPER'];
    const colors = ['#9b59b6', '#3498db', '#e67e22', '#e74c3c', '#ff6b9d', '#00b4d8', '#922b21', '#27ae60'];
    const previewY = height * 0.62;
    const step = width / 8;
    for (let i = 0; i < universeNames.length; i++) {
      this.add.text(step * i + step / 2, previewY, universeNames[i].substring(0, 3), {
        fontFamily: 'monospace', fontSize: '9px', color: colors[i]
      }).setOrigin(0.5);
    }

    // Tap prompt (pulsing)
    const tapText = this.add.text(width / 2, height * 0.78, 'TAP TO START', {
      fontFamily: 'monospace', fontSize: '18px', color: '#ffffff'
    }).setOrigin(0.5);
    this.tweens.add({
      targets: tapText,
      alpha: 0.2,
      duration: 700,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // Version / credit
    this.add.text(width / 2, height * 0.92, 'SNAKE DRIVE V4 — FIRST BUILD', {
      fontFamily: 'monospace', fontSize: '10px', color: '#333344'
    }).setOrigin(0.5);

    this.input.once('pointerdown', () => {
      AudioSystem.resume();
      this.scene.start(SCENES.WORLD_MAP);
    });

    // Keyboard start
    if (this.input.keyboard) {
      this.input.keyboard.once('keydown', () => {
        AudioSystem.resume();
        this.scene.start(SCENES.WORLD_MAP);
      });
    }
  }
}
