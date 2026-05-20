import Phaser from 'phaser';
import { SnakeState } from '../core/Snake';
import { GridLayout, cellToPixel } from './GridRenderer';

export class SnakeRenderer {
  private gfx: Phaser.GameObjects.Graphics;

  constructor(scene: Phaser.Scene) {
    this.gfx = scene.add.graphics();
  }

  draw(snake: SnakeState, layout: GridLayout, headColor: number, bodyColor: number): void {
    this.gfx.clear();
    const cs = layout.cellSize;
    const pad = Math.max(1, Math.floor(cs * 0.1));
    const bodySize = cs - pad * 2;

    for (let i = 0; i < snake.body.length; i++) {
      const cell = snake.body[i];
      const { px, py } = cellToPixel(layout, cell.col, cell.row);
      if (i === 0) {
        // Head — slightly larger, distinct color
        this.gfx.fillStyle(headColor);
        this.gfx.fillRoundedRect(px - cs / 2 + pad - 1, py - cs / 2 + pad - 1, bodySize + 2, bodySize + 2, 3);
        // Eyes
        this.gfx.fillStyle(0x000000);
        const eyeR = Math.max(1, Math.floor(cs * 0.1));
        this.gfx.fillCircle(px - 2, py - 2, eyeR);
        this.gfx.fillCircle(px + 2, py - 2, eyeR);
      } else {
        const alpha = 0.5 + 0.5 * (1 - i / snake.body.length);
        this.gfx.fillStyle(bodyColor, alpha);
        this.gfx.fillRoundedRect(px - cs / 2 + pad, py - cs / 2 + pad, bodySize, bodySize, 2);
      }
    }
  }

  setDepth(d: number): void { this.gfx.setDepth(d); }
  destroy(): void { this.gfx.destroy(); }
}
