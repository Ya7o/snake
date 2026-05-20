export interface Cell {
  col: number;
  row: number;
}

export function cellEq(a: Cell, b: Cell): boolean {
  return a.col === b.col && a.row === b.row;
}

export function cellKey(c: Cell): string {
  return `${c.col},${c.row}`;
}

export class Grid {
  readonly cols: number;
  readonly rows: number;

  constructor(cols: number, rows: number) {
    this.cols = cols;
    this.rows = rows;
  }

  inBounds(c: Cell): boolean {
    return c.col >= 0 && c.col < this.cols && c.row >= 0 && c.row < this.rows;
  }

  allCells(): Cell[] {
    const out: Cell[] = [];
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        out.push({ col: c, row: r });
      }
    }
    return out;
  }

  freeCells(occupied: Set<string>): Cell[] {
    return this.allCells().filter(c => !occupied.has(cellKey(c)));
  }

  randomFreeCell(occupied: Set<string>): Cell | null {
    const free = this.freeCells(occupied);
    if (free.length === 0) return null;
    return free[Math.floor(Math.random() * free.length)];
  }
}
