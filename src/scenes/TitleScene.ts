import Phaser from 'phaser';
import { SCENES } from '../config/constants';
import { AudioSystem } from '../systems/AudioSystem';
import { runQAChecks } from '../qa/QAChecks';
import { ARCADE_FONT, UI_FONT, drawGradientBg } from '../render/VfxUtils';

const TITLE_HUB_ASSETS = {
  bg: { key: 'title_hub_bg', url: 'assets/ui/title/title_hub_bg.png' },
};

export class TitleScene extends Phaser.Scene {
  constructor() {
    super(SCENES.TITLE);
  }

  preload(): void {
    this.load.on('loaderror', (file: Phaser.Loader.File) => {
      console.error('[TitleScene] LOAD ERROR:', file.key, file.url);
    });

    if (!this.textures.exists(TITLE_HUB_ASSETS.bg.key)) {
      this.load.image(TITLE_HUB_ASSETS.bg.key, TITLE_HUB_ASSETS.bg.url);
    }
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

    // Layer 0 — background image or procedural fallback
    if (this.textures.exists(TITLE_HUB_ASSETS.bg.key)) {
      this.add.image(W / 2, H / 2, TITLE_HUB_ASSETS.bg.key)
        .setDisplaySize(W, H)
        .setDepth(0);
      const overlay = this.add.graphics().setDepth(1);
      overlay.fillStyle(0x000000, 0.38);
      overlay.fillRect(0, 0, W, H);
    } else {
      drawGradientBg(this, 0x0d0428, 0x050510, 0);
      const fallbackOverlay = this.add.graphics().setDepth(1);
      fallbackOverlay.fillStyle(0x000000, 0.35);
      fallbackOverlay.fillRect(0, 0, W, H);
    }

    // SNAKE title — dominant
    const snakeFontSize = Math.min(46, Math.floor(W * 0.118));
    const snakeY = H * 0.22;
    this.add.text(W / 2 + 3, snakeY + 3, 'SNAKE', {
      fontFamily: ARCADE_FONT,
      fontSize: `${snakeFontSize}px`,
      color: '#3a0099',
    }).setOrigin(0.5).setDepth(5);

    const snakeText = this.add.text(W / 2, snakeY, 'SNAKE', {
      fontFamily: ARCADE_FONT,
      fontSize: `${snakeFontSize}px`,
      color: '#83ff63',
    }).setOrigin(0.5).setDepth(6);

    this.tweens.add({
      targets: snakeText,
      alpha: 0.78,
      duration: 900,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    // DRIVE subtitle — no V4
    const driveFontSize = Math.min(20, Math.floor(W * 0.052));
    this.add.text(W / 2, H * 0.31, 'DRIVE', {
      fontFamily: ARCADE_FONT,
      fontSize: `${driveFontSize}px`,
      color: '#ff6ccc',
    }).setOrigin(0.5).setDepth(6);

    // Separator
    const sepGfx = this.add.graphics().setDepth(6);
    sepGfx.lineStyle(1, 0x9a61ff, 0.6);
    sepGfx.lineBetween(W * 0.25, H * 0.365, W * 0.75, H * 0.365);

    // Stats — UI_FONT pour lisibilité, pas pixel
    this.add.text(W / 2, H * 0.40, '8 MONDES · 16 NIVEAUX\n8 BOSS À DÉBLOQUER', {
      fontFamily: UI_FONT,
      fontSize: `${Math.min(14, Math.floor(W * 0.036))}px`,
      fontStyle: '700',
      color: '#d9d9e8',
      align: 'center',
      lineSpacing: 6,
    }).setOrigin(0.5).setDepth(6);

    // CTA capsule
    const ctaY = H * 0.74;
    const ctaW = Math.min(W * 0.72, 270);
    const ctaH = 40;
    const ctaGfx = this.add.graphics().setDepth(6);
    ctaGfx.fillStyle(0x08041a, 0.82);
    ctaGfx.fillRoundedRect(W / 2 - ctaW / 2, ctaY - ctaH / 2, ctaW, ctaH, 10);
    ctaGfx.lineStyle(2, 0x00d7c0, 1);
    ctaGfx.strokeRoundedRect(W / 2 - ctaW / 2, ctaY - ctaH / 2, ctaW, ctaH, 10);

    const tapText = this.add.text(W / 2, ctaY, 'APPUYER POUR JOUER', {
      fontFamily: UI_FONT,
      fontSize: `${Math.min(16, Math.floor(W * 0.042))}px`,
      fontStyle: '700',
      color: '#ffe66a',
    }).setOrigin(0.5).setDepth(7);

    this.tweens.add({
      targets: tapText,
      alpha: 0.2,
      duration: 800,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    // Footer — tiny build marker
    this.add.text(W / 2, H * 0.965, 'PROTOTYPE BUILD', {
      fontFamily: UI_FONT,
      fontSize: `${Math.min(10, Math.floor(W * 0.025))}px`,
      color: '#2a2244',
    }).setOrigin(0.5).setDepth(6);

    // Input
    let titleStarted = false;
    const startGame = () => {
      if (titleStarted) return;
      titleStarted = true;
      AudioSystem.resume();
      AudioSystem.uiButton();
      this.cameras.main.fadeOut(200, 0, 0, 0);
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.start(SCENES.WORLD_MAP);
      });
    };

    this.input.on('pointerdown', startGame);
    if (this.input.keyboard) {
      this.input.keyboard.once('keydown', startGame);
    }

    this.cameras.main.fadeIn(400, 0, 0, 0);
  }

}
