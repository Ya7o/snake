import Phaser from 'phaser';
import { Cell } from '../core/Grid';
import { GridLayout, cellToPixel } from './GridRenderer';

export class PickupRenderer {
  private gfx: Phaser.GameObjects.Graphics;
  private scene: Phaser.Scene;

  // Image pool for texture-based rendering
  private imagePool: Phaser.GameObjects.Image[] = [];
  private textureKey: string | null = null;
  private lastCellKeys = '';

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.gfx = scene.add.graphics();
    this.gfx.setDepth(2);
  }

  /** Appelé par GameScene après preload() si le texture est disponible */
  setTextureKey(key: string): void {
    if (this.textureKey === key) return;
    this.textureKey = key;
    this.clearImagePool();
    this.lastCellKeys = '';
  }

  // time: Phaser time.now en ms — anime le pulse 60fps indépendamment du tick
  draw(pickups: Cell[], layout: GridLayout, color: number, time: number): void {
    const pulse = Math.sin(time * 0.004);
    const scale = 0.85 + 0.15 * pulse;
    const cs = layout.cellSize;

    const key = this.textureKey;
    const useImages = !!(key && this.scene.textures.exists(key));

    if (useImages) {
      this.gfx.clear();
      // Glow ring procédural même avec images (lisibilité)
      this.gfx.fillStyle(color, 0.18);
      for (const p of pickups) {
        const { px, py } = cellToPixel(layout, p.col, p.row);
        this.gfx.fillCircle(px, py, cs * 0.5);
      }

      const cellKeysNow = pickups.map(p => `${p.col},${p.row}`).join('|');
      if (cellKeysNow !== this.lastCellKeys) {
        this.syncImagePool(pickups.length);
        this.lastCellKeys = cellKeysNow;
      }

      const imgScale = scale * cs / 32;
      for (let i = 0; i < pickups.length; i++) {
        const { px, py } = cellToPixel(layout, pickups[i].col, pickups[i].row);
        const img = this.imagePool[i];
        img.setPosition(px, py).setScale(imgScale).setVisible(true);
      }
      for (let i = pickups.length; i < this.imagePool.length; i++) {
        this.imagePool[i].setVisible(false);
      }
    } else {
      this.hideAllImages();
      this.drawProcedural(pickups, layout, color, scale, cs);
    }
  }

  private drawProcedural(pickups: Cell[], layout: GridLayout, color: number, scale: number, cs: number): void {
    this.gfx.clear();
    if (pickups.length === 0) return;
    const r = cs * 0.35 * scale;
    for (const p of pickups) {
      const { px, py } = cellToPixel(layout, p.col, p.row);
      this.gfx.fillStyle(color, 0.25);
      this.gfx.fillCircle(px, py, r * 1.5);
      this.gfx.fillStyle(color, 1);
      this.gfx.fillCircle(px, py, r);
      this.gfx.fillStyle(0xffffff, 0.5);
      this.gfx.fillCircle(px - r * 0.3, py - r * 0.3, r * 0.3);
    }
  }

  private syncImagePool(count: number): void {
    while (this.imagePool.length < count) {
      const img = this.scene.add.image(0, 0, this.textureKey!)
        .setDepth(2)
        .setVisible(false);
      this.imagePool.push(img);
    }
  }

  private hideAllImages(): void {
    for (const img of this.imagePool) img.setVisible(false);
  }

  private clearImagePool(): void {
    for (const img of this.imagePool) img.destroy();
    this.imagePool = [];
  }

  destroy(): void {
    this.clearImagePool();
    this.gfx.destroy();
  }
}
