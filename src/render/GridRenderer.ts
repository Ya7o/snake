import Phaser from 'phaser';
import { GAMEPLAY_LAYERS } from '../ui/RuntimeUILayout';

export interface GridLayout {
  x: number;
  y: number;
  cellSize: number;
  cellWidth?: number;
  cellHeight?: number;
  cols: number;
  rows: number;
}

export function computeGridLayout(
  screenW: number,
  screenH: number,
  cols: number,
  rows: number,
  hudH = 60,
  bottomH = 40,
  widthFactor = 0.96,
  minCellSize = 14,
  verticalBias = 0.5,
): GridLayout {
  const sideMargin = Math.max(8, Math.floor(screenW * (1 - widthFactor) / 2));
  const availW = screenW - sideMargin * 2;
  const availH = screenH - hudH - bottomH;
  const cellW = Math.floor(availW / cols);
  const cellH = Math.floor(availH / rows);
  const cellSize = Math.max(minCellSize, Math.min(cellW, cellH));
  const gridW = cellSize * cols;
  const gridH = cellSize * rows;
  const remainingH = Math.max(0, availH - gridH);
  const topGap = Math.max(6, Math.floor(remainingH * Phaser.Math.Clamp(verticalBias, 0, 1)));
  return {
    x: Math.floor((screenW - gridW) / 2),
    y: hudH + topGap,
    cellSize,
    cols,
    rows
  };
}

export function cellToPixel(layout: GridLayout, col: number, row: number): { px: number; py: number } {
  const cellW = getCellWidth(layout);
  const cellH = getCellHeight(layout);
  return {
    px: layout.x + col * cellW + cellW / 2,
    py: layout.y + row * cellH + cellH / 2,
  };
}

export function getCellWidth(layout: GridLayout): number {
  return layout.cellWidth ?? layout.cellSize;
}

export function getCellHeight(layout: GridLayout): number {
  return layout.cellHeight ?? layout.cellSize;
}

export function getCellMin(layout: GridLayout): number {
  return Math.min(getCellWidth(layout), getCellHeight(layout));
}

export class GridRenderer {
  private gfx: Phaser.GameObjects.Graphics;
  private layout: GridLayout;
  private dirty = true;
  private lastBg = -1;
  private lastLine = -1;

  // 906 — frame tile sprites in corners (created once, optional)
  private frameTiles: Phaser.GameObjects.Image[] = [];

  constructor(scene: Phaser.Scene, layout: GridLayout) {
    this.gfx = scene.add.graphics().setDepth(GAMEPLAY_LAYERS.GRID);
    this.layout = layout;
  }

  /**
   * 906 — Add frame_tile.png as decorative corners around the grid.
   * Call once in GameScene.create() after checking texture availability.
   */
  setFrameTileKey(scene: Phaser.Scene, key: string): void {
    if (!scene.textures.exists(key)) return;
    // Destroy previous frame tiles if any
    for (const t of this.frameTiles) t.destroy();
    this.frameTiles = [];

    const { x, y, cols, rows } = this.layout;
    const cellW = getCellWidth(this.layout);
    const cellH = getCellHeight(this.layout);
    const cellMin = getCellMin(this.layout);
    const w = cellW * cols;
    const h = cellH * rows;
    const tSize = Math.max(16, Math.min(cellMin * 1.2, 28));

    // 4 corners + midpoints on each side for a full border feel
    const positions: Array<[number, number]> = [
      [x,         y        ],  // top-left
      [x + w,     y        ],  // top-right
      [x,         y + h    ],  // bottom-left
      [x + w,     y + h    ],  // bottom-right
      [x + w / 2, y        ],  // top-mid
      [x + w / 2, y + h    ],  // bottom-mid
      [x,         y + h / 2],  // left-mid
      [x + w,     y + h / 2],  // right-mid
    ];

    for (const [px, py] of positions) {
      const img = scene.add.image(px, py, key)
        .setDisplaySize(tSize, tSize)
        .setAlpha(0.65)
        .setDepth(GAMEPLAY_LAYERS.BOARD_PANEL);
      this.frameTiles.push(img);
    }
  }

  draw(bgColor: number, lineColor: number): void {
    if (!this.dirty && bgColor === this.lastBg && lineColor === this.lastLine) return;
    this.dirty = false;
    this.lastBg = bgColor;
    this.lastLine = lineColor;

    const { x, y, cols, rows } = this.layout;
    const cellW = getCellWidth(this.layout);
    const cellH = getCellHeight(this.layout);
    const cellMin = getCellMin(this.layout);
    const w = cellW * cols;
    const h = cellH * rows;

    this.gfx.clear();

    // Grid background
    this.gfx.fillStyle(bgColor);
    this.gfx.fillRect(x, y, w, h);

    // Inner grid lines (subtle)
    this.gfx.lineStyle(1, lineColor, 0.2);
    for (let c = 1; c < cols; c++) {
      this.gfx.lineBetween(x + c * cellW, y, x + c * cellW, y + h);
    }
    for (let r = 1; r < rows; r++) {
      this.gfx.lineBetween(x, y + r * cellH, x + w, y + r * cellH);
    }

    // Outer border — thick, full opacity
    this.gfx.lineStyle(3, lineColor, 1);
    this.gfx.strokeRect(x, y, w, h);

    // Corner accents — small filled squares at the 4 corners
    const cs = Math.max(3, Math.floor(cellMin * 0.18));
    this.gfx.fillStyle(lineColor, 0.9);
    this.gfx.fillRect(x, y, cs, cs);
    this.gfx.fillRect(x + w - cs, y, cs, cs);
    this.gfx.fillRect(x, y + h - cs, cs, cs);
    this.gfx.fillRect(x + w - cs, y + h - cs, cs, cs);

    // Glow/double-border — slightly larger, low alpha
    this.gfx.lineStyle(1, lineColor, 0.3);
    this.gfx.strokeRect(x - 3, y - 3, w + 6, h + 6);
  }

  markDirty(): void { this.dirty = true; }

  setDepth(depth: number): void { this.gfx.setDepth(depth); }

  getLayout(): GridLayout { return this.layout; }

  destroy(): void {
    for (const t of this.frameTiles) t.destroy();
    this.gfx.destroy();
  }
}
