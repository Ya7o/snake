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

    // Draw body first (back to front, so head renders on top)
    for (let i = snake.body.length - 1; i >= 1; i--) {
      const cell = snake.body[i];
      const { px, py } = cellToPixel(layout, cell.col, cell.row);
      // Gradient: tail is more transparent
      const t = 1 - i / snake.body.length;
      const alpha = 0.35 + 0.55 * t;
      this.gfx.fillStyle(bodyColor, alpha);
      this.gfx.fillRoundedRect(px - cs / 2 + pad, py - cs / 2 + pad, bodySize, bodySize, 3);

      // Segment connector between consecutive body parts
      if (i < snake.body.length - 1) {
        const prev = snake.body[i + 1];
        const { px: ppx, py: ppy } = cellToPixel(layout, prev.col, prev.row);
        const midX = (px + ppx) / 2;
        const midY = (py + ppy) / 2;
        const connW = Math.abs(px - ppx) > 0 ? Math.abs(px - ppx) + bodySize : bodySize;
        const connH = Math.abs(py - ppy) > 0 ? Math.abs(py - ppy) + bodySize : bodySize;
        this.gfx.fillStyle(bodyColor, alpha * 0.6);
        this.gfx.fillRect(
          midX - connW / 2 + pad,
          midY - connH / 2 + pad,
          connW - pad * 2,
          connH - pad * 2
        );
      }
    }

    // Head — larger, accent color, with eyes
    if (snake.body.length > 0) {
      const head = snake.body[0];
      const { px, py } = cellToPixel(layout, head.col, head.row);
      const headPad = Math.max(1, Math.floor(cs * 0.06));
      const headSize = cs - headPad * 2;

      // Head glow
      this.gfx.fillStyle(headColor, 0.22);
      this.gfx.fillRoundedRect(px - cs / 2 - 2, py - cs / 2 - 2, cs + 4, cs + 4, 5);

      // Head body
      this.gfx.fillStyle(headColor, 1);
      this.gfx.fillRoundedRect(px - cs / 2 + headPad, py - cs / 2 + headPad, headSize, headSize, 4);

      // Eyes — position based on direction
      const dir = snake.direction;
      const eyeR = Math.max(1.5, Math.floor(cs * 0.1));
      const eyeOff = cs * 0.2;

      let ex1: number, ey1: number, ex2: number, ey2: number;
      if (dir === 'LEFT' || dir === 'RIGHT') {
        const fwd = dir === 'RIGHT' ? eyeOff : -eyeOff;
        ex1 = px + fwd; ey1 = py - eyeOff;
        ex2 = px + fwd; ey2 = py + eyeOff;
      } else {
        const fwd = dir === 'DOWN' ? eyeOff : -eyeOff;
        ex1 = px - eyeOff; ey1 = py + fwd;
        ex2 = px + eyeOff; ey2 = py + fwd;
      }

      this.gfx.fillStyle(0x000000, 0.9);
      this.gfx.fillCircle(ex1, ey1, eyeR);
      this.gfx.fillCircle(ex2, ey2, eyeR);

      // Eye shine
      this.gfx.fillStyle(0xffffff, 0.7);
      this.gfx.fillCircle(ex1 + eyeR * 0.3, ey1 - eyeR * 0.3, eyeR * 0.45);
      this.gfx.fillCircle(ex2 + eyeR * 0.3, ey2 - eyeR * 0.3, eyeR * 0.45);
    }
  }

  setDepth(d: number): void { this.gfx.setDepth(d); }
  destroy(): void { this.gfx.destroy(); }
}
