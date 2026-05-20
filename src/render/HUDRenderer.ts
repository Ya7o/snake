import Phaser from 'phaser';

export class HUDRenderer {
  private bg: Phaser.GameObjects.Rectangle;
  private universeTxt: Phaser.GameObjects.Text;
  private ruleTxt: Phaser.GameObjects.Text;
  private scoreTxt: Phaser.GameObjects.Text;
  private extraTxt: Phaser.GameObjects.Text;

  // Dirty tracking — avoid setText when value hasn't changed (saves GPU text redraw)
  private lastUniverse = '';
  private lastRule = '';
  private lastScore = '';
  private lastExtra = '';

  constructor(scene: Phaser.Scene, accentColor: string) {
    const w = scene.scale.width;
    const style = { fontFamily: 'monospace', color: '#ffffff' };

    this.bg = scene.add.rectangle(w / 2, 24, w, 48, 0x000000, 0.75).setDepth(10);
    this.universeTxt = scene.add.text(10, 8, '', { ...style, fontSize: '13px', color: accentColor }).setDepth(11);
    this.ruleTxt = scene.add.text(w / 2, 8, '', { ...style, fontSize: '11px' }).setOrigin(0.5, 0).setDepth(11);
    this.scoreTxt = scene.add.text(w - 10, 8, '', { ...style, fontSize: '13px' }).setOrigin(1, 0).setDepth(11);
    this.extraTxt = scene.add.text(w / 2, 28, '', { ...style, fontSize: '11px', color: '#f39c12' }).setOrigin(0.5, 0).setDepth(11);
  }

  update(universeName: string, rule: string, score: number, quota: number | undefined, extra: string): void {
    const scoreStr = quota !== undefined ? `${score}/${quota}` : `HP: ${score}`;
    if (universeName !== this.lastUniverse) { this.universeTxt.setText(universeName); this.lastUniverse = universeName; }
    if (rule !== this.lastRule)             { this.ruleTxt.setText(rule);             this.lastRule = rule; }
    if (scoreStr !== this.lastScore)        { this.scoreTxt.setText(scoreStr);        this.lastScore = scoreStr; }
    if (extra !== this.lastExtra)           { this.extraTxt.setText(extra);           this.lastExtra = extra; }
  }

  destroy(): void {
    this.bg.destroy();
    this.universeTxt.destroy();
    this.ruleTxt.destroy();
    this.scoreTxt.destroy();
    this.extraTxt.destroy();
  }
}
