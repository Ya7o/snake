import Phaser from 'phaser';
import { SnakeState, Direction } from '../core/Snake';
import { GridLayout, cellToPixel, getCellHeight, getCellMin, getCellWidth } from './GridRenderer';
import { SnakeSkinData } from '../config/types';

interface SpriteTransform { angle: number; flipX: boolean; }

// LEFT uses horizontal mirror instead of 180° rotation so the head/tail art
// stays right-side-up (rotation would flip the sprite upside-down too).
const DIR_TRANSFORM: Record<Direction, SpriteTransform> = {
  RIGHT: { angle: 0,            flipX: false },
  DOWN:  { angle: Math.PI / 2,  flipX: false },
  LEFT:  { angle: 0,            flipX: true  },
  UP:    { angle: -Math.PI / 2, flipX: false },
};

/** Direction from cell A toward cell B (A is behind, B is in front). */
function directionToward(
  fromCol: number, fromRow: number,
  toCol: number,   toRow: number,
): Direction {
  if (toCol > fromCol) return 'RIGHT';
  if (toCol < fromCol) return 'LEFT';
  if (toRow > fromRow) return 'DOWN';
  return 'UP';
}

export class SnakeRenderer {
  private scene: Phaser.Scene;
  private gfx: Phaser.GameObjects.Graphics;
  private depth = 0;

  // Sprite pool — only allocated when a skin is active
  private skin: SnakeSkinData | null = null;
  private headImg: Phaser.GameObjects.Image | null = null;
  private tailImg: Phaser.GameObjects.Image | null = null;
  private bodyPool: Phaser.GameObjects.Image[] = [];
  private filteredKeys = new Set<string>();

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.gfx = scene.add.graphics();
  }

  /**
   * Set the snake skin. Pass null to revert to procedural rendering.
   * Only takes effect if all three texture keys exist in the scene.
   */
  setSkin(skin: SnakeSkinData | null): void {
    this.skin = skin;
    // Pool is rebuilt lazily on first draw; clear any stale images now.
    this.clearSpritePool();
  }

  draw(snake: SnakeState, layout: GridLayout, headColor: number, bodyColor: number): void {
    if (this.skin && this.allTexturesReady()) {
      this.drawSprites(snake, layout);
    } else {
      this.hideAllSprites();
      this.drawProcedural(snake, layout, headColor, bodyColor);
    }
  }

  setDepth(d: number): void {
    this.depth = d;
    this.gfx.setDepth(d);
    if (this.headImg) this.headImg.setDepth(d);
    if (this.tailImg) this.tailImg.setDepth(d);
    for (const img of this.bodyPool) img.setDepth(d);
  }

  destroy(): void {
    this.clearSpritePool();
    this.gfx.destroy();
  }

  // ── Sprite rendering ────────────────────────────────────────────────────────

  private allTexturesReady(): boolean {
    const s = this.skin!;
    return (
      this.scene.textures.exists(s.headSprite) &&
      this.scene.textures.exists(s.bodySprite) &&
      this.scene.textures.exists(s.tailSprite)
    );
  }

  private drawSprites(snake: SnakeState, layout: GridLayout): void {
    this.gfx.clear();
    const s = this.skin!;
    const body = snake.body;
    if (body.length === 0) { this.hideAllSprites(); return; }

    const cs = getCellMin(layout);

    // Head (body[0])
    const head = body[0];
    const headImg = this.getOrCreateImage('head', s.headSprite);
    this.placeSprite(headImg, s.headSprite, layout, head.col, head.row, cs, DIR_TRANSFORM[snake.direction]);

    // Tail (body[last]) — only when snake has 2+ segments
    if (body.length >= 2) {
      const tailIdx = body.length - 1;
      const tail = body[tailIdx];
      const prev = body[tailIdx - 1];
      const tailDir = directionToward(tail.col, tail.row, prev.col, prev.row);
      const tailImg = this.getOrCreateImage('tail', s.tailSprite);
      this.placeSprite(tailImg, s.tailSprite, layout, tail.col, tail.row, cs, DIR_TRANSFORM[tailDir]);
    } else if (this.tailImg) {
      this.tailImg.setVisible(false);
    }

    // Body segments (body[1..length-2])
    const bodySegCount = Math.max(0, body.length - 2);
    this.syncBodyPool(bodySegCount, s.bodySprite);
    for (let i = 0; i < bodySegCount; i++) {
      const seg = body[i + 1];
      const segNext = body[i]; // toward head
      const dir = directionToward(seg.col, seg.row, segNext.col, segNext.row);
      this.placeSprite(this.bodyPool[i], s.bodySprite, layout, seg.col, seg.row, cs, DIR_TRANSFORM[dir]);
    }
    for (let i = bodySegCount; i < this.bodyPool.length; i++) {
      this.bodyPool[i].setVisible(false);
    }
  }

  private placeSprite(
    img: Phaser.GameObjects.Image,
    textureKey: string,
    layout: GridLayout,
    col: number,
    row: number,
    cs: number,
    transform: SpriteTransform,
  ): void {
    this.applyTextureFilter(textureKey);
    const { px, py } = cellToPixel(layout, col, row);
    const frame = this.scene.textures.getFrame(textureKey);
    const fw = frame?.realWidth  ?? img.width  ?? cs;
    const fh = frame?.realHeight ?? img.height ?? cs;
    const scale = fw > 0 && fh > 0 ? (cs * 0.92) / Math.max(fw, fh) : 1;
    img
      .setTexture(textureKey)
      .setPosition(px, py)
      .setScale(scale)
      .setFlipX(transform.flipX)
      .setRotation(transform.angle)
      .setVisible(true);
  }

  private getOrCreateImage(role: 'head' | 'tail', textureKey: string): Phaser.GameObjects.Image {
    if (role === 'head') {
      if (!this.headImg) {
        this.headImg = this.scene.add.image(0, 0, textureKey).setDepth(this.depth).setVisible(false);
      }
      return this.headImg;
    }
    if (!this.tailImg) {
      this.tailImg = this.scene.add.image(0, 0, textureKey).setDepth(this.depth).setVisible(false);
    }
    return this.tailImg;
  }

  private syncBodyPool(count: number, textureKey: string): void {
    while (this.bodyPool.length < count) {
      this.bodyPool.push(
        this.scene.add.image(0, 0, textureKey).setDepth(this.depth).setVisible(false),
      );
    }
  }

  private applyTextureFilter(key: string): void {
    if (this.filteredKeys.has(key) || !this.scene.textures.exists(key)) return;
    this.scene.textures.get(key).setFilter(Phaser.Textures.FilterMode.LINEAR);
    this.filteredKeys.add(key);
  }

  private hideAllSprites(): void {
    this.headImg?.setVisible(false);
    this.tailImg?.setVisible(false);
    for (const img of this.bodyPool) img.setVisible(false);
  }

  private clearSpritePool(): void {
    this.headImg?.destroy();
    this.headImg = null;
    this.tailImg?.destroy();
    this.tailImg = null;
    for (const img of this.bodyPool) img.destroy();
    this.bodyPool = [];
  }

  // ── Procedural rendering (unchanged fallback) ────────────────────────────────

  private drawProcedural(snake: SnakeState, layout: GridLayout, headColor: number, bodyColor: number): void {
    this.gfx.clear();
    const cs = getCellMin(layout);
    const cellW = getCellWidth(layout);
    const cellH = getCellHeight(layout);
    const pad = Math.max(1, Math.floor(cs * 0.1));
    const bodyW = cellW - pad * 2;
    const bodyH = cellH - pad * 2;

    for (let i = snake.body.length - 1; i >= 1; i--) {
      const cell = snake.body[i];
      const { px, py } = cellToPixel(layout, cell.col, cell.row);
      const t = 1 - i / snake.body.length;
      const alpha = 0.35 + 0.55 * t;
      this.gfx.fillStyle(bodyColor, alpha);
      this.gfx.fillRoundedRect(px - cellW / 2 + pad, py - cellH / 2 + pad, bodyW, bodyH, 3);

      if (i < snake.body.length - 1) {
        const prev = snake.body[i + 1];
        const { px: ppx, py: ppy } = cellToPixel(layout, prev.col, prev.row);
        const midX = (px + ppx) / 2;
        const midY = (py + ppy) / 2;
        const connW = Math.abs(px - ppx) > 0 ? Math.abs(px - ppx) + bodyW : bodyW;
        const connH = Math.abs(py - ppy) > 0 ? Math.abs(py - ppy) + bodyH : bodyH;
        this.gfx.fillStyle(bodyColor, alpha * 0.6);
        this.gfx.fillRect(
          midX - connW / 2 + pad,
          midY - connH / 2 + pad,
          connW - pad * 2,
          connH - pad * 2,
        );
      }
    }

    if (snake.body.length > 0) {
      const head = snake.body[0];
      const { px, py } = cellToPixel(layout, head.col, head.row);
      const headPad = Math.max(1, Math.floor(cs * 0.06));
      const headW = cellW - headPad * 2;
      const headH = cellH - headPad * 2;

      this.gfx.fillStyle(headColor, 0.22);
      this.gfx.fillRoundedRect(px - cellW / 2 - 2, py - cellH / 2 - 2, cellW + 4, cellH + 4, 5);
      this.gfx.fillStyle(headColor, 1);
      this.gfx.fillRoundedRect(px - cellW / 2 + headPad, py - cellH / 2 + headPad, headW, headH, 4);

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
      this.gfx.fillStyle(0xffffff, 0.7);
      this.gfx.fillCircle(ex1 + eyeR * 0.3, ey1 - eyeR * 0.3, eyeR * 0.45);
      this.gfx.fillCircle(ex2 + eyeR * 0.3, ey2 - eyeR * 0.3, eyeR * 0.45);
    }
  }
}
