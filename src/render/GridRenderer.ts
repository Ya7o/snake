import Phaser from 'phaser';

export interface GridLayout {
  x: number;
  y: number;
  cellSize: number;
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
): GridLayout {
  const availW = screenW * widthFactor;
  const availH = screenH - hudH - bottomH;
  const cellW = Math.floor(availW / cols);
  const cellH = Math.floor(availH / rows);
  const cellSize = Math.max(minCellSize, Math.min(cellW, cellH));
  const gridW = cellSize * cols;
  const gridH = cellSize * rows;
  return {
    x: Math.floor((screenW - gridW) / 2),
    y: hudH + Math.floor((availH - gridH) / 2),
    cellSize,
    cols,
    rows
  };
}

export function cellToPixel(layout: GridLayout, col: number, row: number): { px: number; py: number } {
  return {
    px: layout.x + col * layout.cellSize + layout.cellSize / 2,
    py: layout.y + row * layout.cellSize + layout.cellSize / 2,
  };
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
    this.gfx = scene.add.graphics();
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

    const { x, y, cellSize, cols, rows } = this.layout;
    const w = cellSize * cols;
    const h = cellSize * rows;
    const tSize = Math.max(16, Math.min(cellSize * 1.2, 28));

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
        .setDepth(1);
      this.frameTiles.push(img);
    }
  }

  draw(bgColor: number, lineColor: number): void {
    if (!this.dirty && bgColor === this.lastBg && lineColor === this.lastLine) return;
    this.dirty = false;
    this.lastBg = bgColor;
    this.lastLine = lineColor;

    const { x, y, cellSize, cols, rows } = this.layout;
    const w = cellSize * cols;
    const h = cellSize * rows;

    this.gfx.clear();

    // Grid background
    this.gfx.fillStyle(bgColor);
    this.gfx.fillRect(x, y, w, h);

    // Inner grid lines (subtle)
    this.gfx.lineStyle(1, lineColor, 0.2);
    for (let c = 1; c < cols; c++) {
      this.gfx.lineBetween(x + c * cellSize, y, x + c * cellSize, y + h);
    }
    for (let r = 1; r < rows; r++) {
      this.gfx.lineBetween(x, y + r * cellSize, x + w, y + r * cellSize);
    }

    // Outer border — thick, full opacity
    this.gfx.lineStyle(3, lineColor, 1);
    this.gfx.strokeRect(x, y, w, h);

    // Corner accents — small filled squares at the 4 corners
    const cs = Math.max(3, Math.floor(cellSize * 0.18));
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

  getLayout(): GridLayout { return this.layout; }

  destroy(): void {
    for (const t of this.frameTiles) t.destroy();
    this.gfx.destroy();
  }
}
