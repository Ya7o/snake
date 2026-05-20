import Phaser from 'phaser';
import { MOBILE_UI } from '../config/constants';
import { ARCADE_FONT, UI_FONT } from './VfxUtils';

export class HUDRenderer {
  private bg: Phaser.GameObjects.Rectangle;
  private hudPanelImg: Phaser.GameObjects.Image | null = null;
  private accentBar: Phaser.GameObjects.Rectangle;
  private universeTxt: Phaser.GameObjects.Text;
  private ruleTxt: Phaser.GameObjects.Text;
  private scoreTxt: Phaser.GameObjects.Text;
  private extraTxt: Phaser.GameObjects.Text;

  private lastUniverse = '';
  private lastRule = '';
  private lastScore = '';
  private lastExtra = '';

  /**
   * @param hudPanelKey Phaser texture key for hud_panel.png — used if available.
   */
  constructor(scene: Phaser.Scene, accentColor: string, hudPanelKey?: string) {
    const w = scene.scale.width;
    const accentHex = parseInt(accentColor.replace('#', ''), 16);
    const hudH = 52;

    // Dark panel base (always drawn for text readability)
    this.bg = scene.add.rectangle(w / 2, hudH / 2, w, hudH, 0x000000, 0.88).setDepth(10);

    // 906: universe hud_panel.png overlay — drawn on top of bg, below text
    if (hudPanelKey && scene.textures.exists(hudPanelKey)) {
      this.hudPanelImg = scene.add.image(w / 2, hudH / 2, hudPanelKey)
        .setDisplaySize(w, hudH)
        .setAlpha(0.55)
        .setDepth(10);
    }

    // Accent top line
    this.accentBar = scene.add.rectangle(w / 2, 1, w, 2, accentHex, 1).setDepth(11);

    // Bottom separator
    const sepGfx = scene.add.graphics().setDepth(11);
    sepGfx.lineStyle(1, accentHex, 0.35);
    sepGfx.lineBetween(0, hudH, w, hudH);

    const labelStyle = { fontFamily: UI_FONT, fontStyle: '700', color: '#ffffff' };
    const infoStyle = { fontFamily: UI_FONT, fontStyle: '700', color: '#ffffff' };

    this.universeTxt = scene.add.text(8, 10, '', {
      fontFamily: ARCADE_FONT, fontSize: `${MOBILE_UI.CAPTION_MIN}px`, color: accentColor
    }).setDepth(12);

    this.ruleTxt = scene.add.text(w / 2, 10, '', {
      ...labelStyle, fontSize: `${MOBILE_UI.LABEL_MIN}px`, color: '#c8c8dc'
    }).setOrigin(0.5, 0).setDepth(12);

    this.scoreTxt = scene.add.text(w - 8, 10, '', {
      ...infoStyle, fontSize: `${MOBILE_UI.LABEL_MIN}px`, color: '#ffffff'
    }).setOrigin(1, 0).setDepth(12);

    this.extraTxt = scene.add.text(w / 2, 30, '', {
      ...infoStyle, fontSize: `${MOBILE_UI.CAPTION_MIN}px`, color: '#f7b731'
    }).setOrigin(0.5, 0).setDepth(12);
  }

  update(universeName: string, rule: string, score: number, quota: number | undefined, extra: string): void {
    const scoreStr = quota !== undefined ? `${score}/${quota}` : `HP:${score}`;
    if (universeName !== this.lastUniverse) { this.universeTxt.setText(universeName); this.lastUniverse = universeName; }
    if (rule !== this.lastRule)             { this.ruleTxt.setText(rule);             this.lastRule = rule; }
    if (scoreStr !== this.lastScore)        { this.scoreTxt.setText(scoreStr);        this.lastScore = scoreStr; }
    if (extra !== this.lastExtra)           { this.extraTxt.setText(extra);           this.lastExtra = extra; }
  }

  destroy(): void {
    this.bg.destroy();
    this.hudPanelImg?.destroy();
    this.accentBar.destroy();
    this.universeTxt.destroy();
    this.ruleTxt.destroy();
    this.scoreTxt.destroy();
    this.extraTxt.destroy();
  }
}
