import Phaser from 'phaser';
import { MOBILE_UI } from '../config/constants';
import { GAMEPLAY_HUD, GAMEPLAY_LAYERS } from '../ui/RuntimeUILayout';
import { ARCADE_FONT, UI_FONT } from './VfxUtils';

export class HUDRenderer {
  private bg: Phaser.GameObjects.Rectangle;
  private gfx: Phaser.GameObjects.Graphics;
  private universeTxt: Phaser.GameObjects.Text;
  private ruleTxt: Phaser.GameObjects.Text;
  private scoreTxt: Phaser.GameObjects.Text;

  private readonly ruleCenterX: number;
  private readonly ruleCenterW: number;
  private lastUniverse = '';
  private lastCenter = '';
  private lastScore = '';

  constructor(scene: Phaser.Scene, accentColor: string, _hudPanelKey?: string) {
    const w = scene.scale.width;
    const hudH = GAMEPLAY_HUD.HEIGHT;
    const accentHex = parseInt(accentColor.replace('#', ''), 16);

    // Opaque dark strip
    this.bg = scene.add
      .rectangle(w / 2, hudH / 2, w, hudH, 0x06020e, 1.0)
      .setDepth(GAMEPLAY_LAYERS.HUD_STRIP);

    // Capsule geometry (3 zones: left · center · right)
    const margin = 5;
    const gap = 4;
    const capH = 40;
    const capY = Math.floor((hudH - capH) / 2); // ~8 px vertical centering
    const radius = 10;
    const leftW = Math.round(w * 0.246);  // ~96 px at 390
    const rightW = Math.round(w * 0.256); // ~100 px at 390
    const cW = w - 2 * margin - leftW - rightW - 2 * gap;
    const leftX = margin;
    const cX = leftX + leftW + gap;
    const rightX = cX + cW + gap;

    this.ruleCenterX = cX + cW / 2;
    this.ruleCenterW = cW;

    this.gfx = scene.add.graphics().setDepth(GAMEPLAY_LAYERS.HUD_STRIP + 1);

    // ── Left capsule (universe) — accent border + subtle accent tint ──────
    this.gfx.fillStyle(0x060212, 0.90);
    this.gfx.fillRoundedRect(leftX, capY, leftW, capH, radius);
    this.gfx.fillStyle(accentHex, 0.09);
    this.gfx.fillRoundedRect(leftX, capY, leftW, capH, radius);
    this.gfx.lineStyle(2, accentHex, 0.88);
    this.gfx.strokeRoundedRect(leftX, capY, leftW, capH, radius);

    // ── Center capsule (rule / hint) — neutral dark ────────────────────────
    this.gfx.fillStyle(0x0e0828, 0.84);
    this.gfx.fillRoundedRect(cX, capY, cW, capH, radius);
    this.gfx.lineStyle(1, 0x2c2848, 0.72);
    this.gfx.strokeRoundedRect(cX, capY, cW, capH, radius);

    // ── Right capsule (score / HP) — accent border + subtle accent tint ───
    this.gfx.fillStyle(0x060212, 0.90);
    this.gfx.fillRoundedRect(rightX, capY, rightW, capH, radius);
    this.gfx.fillStyle(accentHex, 0.09);
    this.gfx.fillRoundedRect(rightX, capY, rightW, capH, radius);
    this.gfx.lineStyle(2, accentHex, 0.88);
    this.gfx.strokeRoundedRect(rightX, capY, rightW, capH, radius);

    // Thin accent rule under the full strip
    this.gfx.lineStyle(1, accentHex, 0.28);
    this.gfx.lineBetween(0, hudH, w, hudH);

    const textY = hudH / 2;

    this.universeTxt = scene.add
      .text(leftX + leftW / 2, textY, '', {
        fontFamily: ARCADE_FONT,
        fontSize: '10px',
        color: accentColor,
      })
      .setDepth(GAMEPLAY_LAYERS.HUD_TEXT)
      .setOrigin(0.5);

    this.ruleTxt = scene.add
      .text(this.ruleCenterX, textY, '', {
        fontFamily: UI_FONT,
        fontStyle: '700',
        fontSize: `${MOBILE_UI.LABEL_MIN}px`,
        color: '#c8c8dc',
      })
      .setDepth(GAMEPLAY_LAYERS.HUD_TEXT)
      .setOrigin(0.5);

    this.scoreTxt = scene.add
      .text(rightX + rightW / 2, textY, '', {
        fontFamily: UI_FONT,
        fontStyle: '700',
        fontSize: `${MOBILE_UI.LABEL_MIN}px`,
        color: '#ffffff',
      })
      .setDepth(GAMEPLAY_LAYERS.HUD_TEXT)
      .setOrigin(0.5);
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
    this.fitCenter();
  }

  destroy(): void {
    this.bg.destroy();
    this.gfx.destroy();
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
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^A-Z0-9]/gi, '')
      .toUpperCase();
  }

  private fitCenter(): void {
    const maxW = this.ruleCenterW - 16;
    this.ruleTxt.setFontSize(MOBILE_UI.LABEL_MIN);
    if (this.ruleTxt.width > 0 && this.ruleTxt.width > maxW) {
      const ratio = maxW / this.ruleTxt.width;
      const fitted = Math.max(MOBILE_UI.CAPTION_MIN, Math.floor(MOBILE_UI.LABEL_MIN * ratio));
      this.ruleTxt.setFontSize(fitted);
    }
  }
}
