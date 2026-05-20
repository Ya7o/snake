import Phaser from 'phaser';
import { SCENES } from '../config/constants';
import { AudioSystem } from '../systems/AudioSystem';
import { runQAChecks } from '../qa/QAChecks';
import { ARCADE_FONT, drawConsoleFrame, addScanlines, drawDiagLines, drawGradientBg } from '../render/VfxUtils';

export class TitleScene extends Phaser.Scene {
  constructor() {
    super(SCENES.TITLE);
  }

  create(): void {
    AudioSystem.init();
    const qaResult = runQAChecks();

    // 908 — show QA summary overlay only in ?debugQA=1 mode
    if (new URLSearchParams(window.location.search).get('debugQA') === '1') {
      const lines = [
        `[debugQA=1] ${qaResult.pass ? '✅ ALL PASS' : '❌ FAILURES'}`,
        ...qaResult.checks.map(c => `${c.pass ? '✓' : '✗'} ${c.name}`),
      ];
      this.add.text(4, 4, lines.join('\n'), {
        fontFamily: 'monospace', fontSize: '7px',
        color: qaResult.pass ? '#00ff88' : '#ff4444',
        backgroundColor: '#000000dd', padding: { x: 4, y: 2 },
      }).setDepth(30).setScrollFactor(0);
    }

    const { width, height } = this.scale;
    const W = width, H = height;

    // Layer 0 — gradient background (deep purple → near-black)
    drawGradientBg(this, 0x0d0428, 0x050510, 0);

    // Layer 1 — diagonal lines (V3 title background)
    drawDiagLines(this, 0x25134d, 0x0e2040, 1);

    // Layer 2 — darkening vignette overlay
    const vignette = this.add.graphics().setDepth(2);
    vignette.fillStyle(0x000000, 0.35);
    vignette.fillRect(0, 0, W, H);

    // Layer 3 — stars
    const stars = this.add.graphics().setDepth(3);
    for (let i = 0; i < 55; i++) {
      const sx = Math.random() * W;
      const sy = Math.random() * H;
      const sr = Math.random() * 1.2 + 0.3;
      stars.fillStyle(0xffffff, Math.random() * 0.5 + 0.15);
      stars.fillCircle(sx, sy, sr);
    }

    // Layer 4 — console frame
    const frameX = W * 0.05, frameY = H * 0.06;
    const frameW = W * 0.9, frameH = H * 0.88;
    drawConsoleFrame(this, frameX, frameY, frameW, frameH, 0x9a61ff, 0x00d7c0, 4);

    // Layer 5 — SNAKE title with glow
    const titleY = H * 0.27;
    // Glow shadow (slightly offset, low alpha)
    this.add.text(W / 2 + 3, titleY + 3, 'SNAKE', {
      fontFamily: ARCADE_FONT,
      fontSize: `${Math.min(40, Math.floor(W * 0.115))}px`,
      color: '#4a00aa',
    }).setOrigin(0.5).setDepth(5);

    const snakeText = this.add.text(W / 2, titleY, 'SNAKE', {
      fontFamily: ARCADE_FONT,
      fontSize: `${Math.min(40, Math.floor(W * 0.115))}px`,
      color: '#83ff63',
    }).setOrigin(0.5).setDepth(6);

    // Oscillating scale animation like V3
    this.tweens.add({
      targets: snakeText,
      scaleX: 1.05,
      scaleY: 1.02,
      duration: 900,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    // DRIVE V4 subtitle
    this.add.text(W / 2, H * 0.38, 'DRIVE V4', {
      fontFamily: ARCADE_FONT,
      fontSize: `${Math.min(18, Math.floor(W * 0.05))}px`,
      color: '#ff6ccc',
    }).setOrigin(0.5).setDepth(6);

    // Separator line
    const sepGfx = this.add.graphics().setDepth(6);
    sepGfx.lineStyle(2, 0x9a61ff, 0.8);
    sepGfx.lineBetween(W * 0.2, H * 0.455, W * 0.8, H * 0.455);

    // Stats line
    this.add.text(W / 2, H * 0.495, '8 WORLDS  ·  16 STAGES  ·  8 BOSSES', {
      fontFamily: ARCADE_FONT,
      fontSize: `${Math.min(7, Math.floor(W * 0.019))}px`,
      color: '#d9d9e8',
    }).setOrigin(0.5).setDepth(6);

    // TAP TO START — pulsing
    const tapText = this.add.text(W / 2, H * 0.68, 'TAP TO START', {
      fontFamily: ARCADE_FONT,
      fontSize: `${Math.min(13, Math.floor(W * 0.035))}px`,
      color: '#ffe66a',
    }).setOrigin(0.5).setDepth(6);

    this.tweens.add({
      targets: tapText,
      alpha: 0.15,
      duration: 650,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    // Version
    this.add.text(W / 2, H * 0.93, 'FIRST BUILD — SNAKE DRIVE V4', {
      fontFamily: ARCADE_FONT,
      fontSize: `${Math.min(6, Math.floor(W * 0.016))}px`,
      color: '#333355',
    }).setOrigin(0.5).setDepth(6);

    // Scanlines on top
    addScanlines(this, 0.05, 20);

    // Input
    const startGame = () => {
      AudioSystem.resume();
      this.cameras.main.fadeOut(200, 0, 0, 0);
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.start(SCENES.WORLD_MAP);
      });
    };

    this.input.once('pointerdown', startGame);
    if (this.input.keyboard) {
      this.input.keyboard.once('keydown', startGame);
    }

    // Fade in
    this.cameras.main.fadeIn(400, 0, 0, 0);
  }
}
