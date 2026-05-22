import Phaser from 'phaser';
import { MOBILE_UI } from '../config/constants';
import { GAMEPLAY_HUD, GAMEPLAY_LAYERS } from '../ui/RuntimeUILayout';
import { ARCADE_FONT, UI_FONT } from './VfxUtils';

export class HUDRenderer {
  private bg: Phaser.GameObjects.Rectangle;
  private hudPanelImg: Phaser.GameObjects.Image | null = null;
  private accentBar: Phaser.GameObjects.Rectangle | null = null;
  private universeTxt: Phaser.GameObjects.Text;
  private ruleTxt: Phaser.GameObjects.Text;
  private scoreTxt: Phaser.GameObjects.Text;
  private capsuleGfx: Phaser.GameObjects.Graphics | null = null;
  private capsuleMode = false;
  private capW = 0;

  private lastUniverse = '';
  private lastCenter = '';
  private lastScore = '';

  /**
   * @param hudPanelKey  Phaser texture key for hud_panel.png — used if available.
   * @param capsuleMode  When true, draws three pill capsules instead of a full opaque strip (Castle).
   */
  constructor(scene: Phaser.Scene, accentColor: string, hudPanelKey?: string, capsuleMode = false) {
    const w = scene.scale.width;
    const accentHex = parseInt(accentColor.replace('#', ''), 16);
    const hudH = GAMEPLAY_HUD.HEIGHT;
    this.capsuleMode = capsuleMode;

    if (capsuleMode) {
      // Transparent placeholder — keeps API surface identical
      this.bg = scene.add.rectangle(w / 2, hudH / 2, w, hudH, 0x000000, 0).setDepth(GAMEPLAY_LAYERS.HUD_STRIP);

      // Three capsule pills
      const gap = 6;
      this.capW = Math.floor((w - gap * 4) / 3);
      const capH = 34;
      const capY = Math.floor((hudH - capH) / 2);
      const radius = 8;

      this.capsuleGfx = scene.add.graphics().setDepth(GAMEPLAY_LAYERS.HUD_STRIP);
      this.capsuleGfx.fillStyle(0x0d0518, 0.88);
      this.capsuleGfx.lineStyle(1.5, 0xf6c45c, 0.9);
      for (let i = 0; i < 3; i++) {
        const cx = gap + i * (this.capW + gap);
        this.capsuleGfx.fillRoundedRect(cx, capY, this.capW, capH, radius);
        this.capsuleGfx.strokeRoundedRect(cx, capY, this.capW, capH, radius);
      }

      this.universeTxt = scene.add.text(Math.floor(w / 6), hudH / 2, '', {
        fontFamily: ARCADE_FONT, fontSize: `${MOBILE_UI.CAPTION_MIN}px`, color: accentColor,
      }).setOrigin(0.5).setDepth(GAMEPLAY_LAYERS.HUD_TEXT);

      this.ruleTxt = scene.add.text(w / 2, hudH / 2, '', {
        fontFamily: UI_FONT, fontStyle: '700', fontSize: `${MOBILE_UI.LABEL_MIN}px`, color: '#c8c8dc',
      }).setOrigin(0.5).setDepth(GAMEPLAY_LAYERS.HUD_TEXT);

      this.scoreTxt = scene.add.text(Math.floor(w * 5 / 6), hudH / 2, '', {
        fontFamily: UI_FONT, fontStyle: '700', fontSize: `${MOBILE_UI.LABEL_MIN}px`, color: '#f6c45c',
      }).setOrigin(0.5).setDepth(GAMEPLAY_LAYERS.HUD_TEXT);

    } else {
      // Standard opaque strip
      this.bg = scene.add.rectangle(w / 2, hudH / 2, w, hudH, 0x07030f, 1.0).setDepth(GAMEPLAY_LAYERS.HUD_STRIP);

      // 906: universe hud_panel.png overlay — drawn on top of bg, below text
      if (hudPanelKey && scene.textures.exists(hudPanelKey)) {
        this.hudPanelImg = scene.add.image(w / 2, hudH / 2, hudPanelKey)
          .setDisplaySize(w, hudH)
          .setAlpha(0.55)
          .setDepth(GAMEPLAY_LAYERS.HUD_STRIP + 1);
      }

      // Accent top line
      this.accentBar = scene.add.rectangle(w / 2, 1, w, 2, accentHex, 1).setDepth(GAMEPLAY_LAYERS.HUD_STRIP + 1);

      // Bottom separator
      const sepGfx = scene.add.graphics().setDepth(GAMEPLAY_LAYERS.HUD_STRIP + 1);
      sepGfx.lineStyle(1, accentHex, 0.35);
      sepGfx.lineBetween(0, hudH, w, hudH);

      const labelStyle = { fontFamily: UI_FONT, fontStyle: '700', color: '#ffffff' };
      const infoStyle  = { fontFamily: UI_FONT, fontStyle: '700', color: '#ffffff' };

      this.universeTxt = scene.add.text(8, 10, '', {
        fontFamily: ARCADE_FONT, fontSize: `${MOBILE_UI.CAPTION_MIN}px`, color: accentColor,
      }).setDepth(GAMEPLAY_LAYERS.HUD_TEXT).setOrigin(0, 0.5).setY(hudH / 2);

      this.ruleTxt = scene.add.text(w / 2, hudH / 2, '', {
        ...labelStyle, fontSize: `${MOBILE_UI.LABEL_MIN}px`, color: '#c8c8dc',
      }).setOrigin(0.5).setDepth(GAMEPLAY_LAYERS.HUD_TEXT);

      this.scoreTxt = scene.add.text(w - 8, hudH / 2, '', {
        ...infoStyle, fontSize: `${MOBILE_UI.LABEL_MIN}px`, color: '#ffffff',
      }).setOrigin(1, 0.5).setDepth(GAMEPLAY_LAYERS.HUD_TEXT);
    }
  }

  update(
    universeName: string,
    rule: string,
    score: number,
    quota: number | undefined,
    extra: string,
    progressPrefix = '',
  ): void {
    const scoreStr = quota !== undefined ? `${progressPrefix}${score}/${quota}` : `${progressPrefix}${score}`;
    const center = this.compactCenter(rule, extra);
    if (universeName !== this.lastUniverse) { this.universeTxt.setText(universeName); this.lastUniverse = universeName; }
    if (center !== this.lastCenter)         { this.ruleTxt.setText(center);           this.lastCenter = center; }
    if (scoreStr !== this.lastScore)        { this.scoreTxt.setText(scoreStr);        this.lastScore = scoreStr; }
    this.fitOneLine();
  }

  destroy(): void {
    this.bg.destroy();
    this.hudPanelImg?.destroy();
    this.accentBar?.destroy();
    this.capsuleGfx?.destroy();
    this.universeTxt.destroy();
    this.ruleTxt.destroy();
    this.scoreTxt.destroy();
  }

  private compactCenter(rule: string, extra: string): string {
    const cleanRule = rule.trim();
    const cleanExtra = extra.trim();
    if (!cleanExtra) return cleanRule;

    const normRule = this.normalize(cleanRule);
    const normExtra = this.normalize(cleanExtra);
    if (normRule.includes(normExtra) || normExtra.includes(normRule)) return cleanRule;
    if (cleanRule === 'MURS FANTÔMES' && normExtra.includes('MUR')) return cleanRule;
    if (cleanExtra.length <= cleanRule.length + 4) return cleanExtra;
    return cleanRule;
  }

  private normalize(value: string): string {
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^A-Z0-9]/gi, '')
      .toUpperCase();
  }

  private fitOneLine(): void {
    const centerMaxW = this.capsuleMode
      ? Math.max(40, Math.floor(this.capW * 0.82))
      : Math.max(72, this.scoreTxt.x - this.scoreTxt.width - 10 - (this.universeTxt.x + this.universeTxt.width + 10));
    // Start at max size and compute fitted size in one step via ratio
    this.ruleTxt.setFontSize(MOBILE_UI.LABEL_MIN);
    if (this.ruleTxt.width > 0 && this.ruleTxt.width > centerMaxW) {
      const ratio = centerMaxW / this.ruleTxt.width;
      const fitted = Math.max(MOBILE_UI.CAPTION_MIN, Math.floor(MOBILE_UI.LABEL_MIN * ratio));
      this.ruleTxt.setFontSize(fitted);
    }
  }
}
