import { BaseMechanic, ExtraEntity, MechanicUpdate } from './BaseMechanic';
import { Cell, cellKey } from '../core/Grid';
import { Grid } from '../core/Grid';

// Crowd blockers: temporary blockers that appear and disappear; some move slowly
interface Blocker { cell: Cell; ttl: number; moving: boolean; dir: { col: number; row: number } }

export class StreetsCrowdMechanic extends BaseMechanic {
  private blockers: Blocker[] = [];
  private grid!: Grid;
  private spawnTimer = 0;

  protected onInit(): void {
    this.grid = new Grid(this.ctx.grid.cols, this.ctx.grid.rows);
  }

  tick(_tickCount: number): MechanicUpdate {
    this.spawnTimer++;
    let hitDanger = false;
    const head = this.ctx.snake.body[0];

    // Move blockers every 3 ticks
    if (this.spawnTimer % 3 === 0) {
      for (const b of this.blockers) {
        if (!b.moving) continue;
        const nx = b.cell.col + b.dir.col;
        const ny = b.cell.row + b.dir.row;
        if (nx >= 0 && nx < this.ctx.grid.cols && ny >= 0 && ny < this.ctx.grid.rows) {
          b.cell = { col: nx, row: ny };
        } else {
          b.dir = { col: -b.dir.col, row: -b.dir.row };
        }
      }
    }

    // Decrement TTL
    for (const b of this.blockers) b.ttl--;
    this.blockers = this.blockers.filter(b => b.ttl > 0);

    // Check collision
    for (const b of this.blockers) {
      if (b.cell.col === head.col && b.cell.row === head.row) {
        hitDanger = true;
      }
    }

    // Spawn blockers every 15 ticks, max 4
    if (this.spawnTimer % 15 === 0 && this.blockers.length < 4) {
      const occupied = new Set<string>(this.ctx.snake.body.map(c => cellKey(c)));
      for (const b of this.blockers) occupied.add(cellKey(b.cell));
      for (const p of this.ctx.pickups) occupied.add(cellKey(p));
      const cell = this.grid.randomFreeCell(occupied);
      if (cell) {
        const moving = Math.random() < 0.4;
        const dirs = [{ col: 1, row: 0 }, { col: -1, row: 0 }, { col: 0, row: 1 }, { col: 0, row: -1 }];
        this.blockers.push({ cell, ttl: 20 + Math.floor(Math.random() * 15), moving, dir: dirs[Math.floor(Math.random() * 4)] });
      }
    }

    return { hitDanger };
  }

  getExtraEntities(): ExtraEntity[] {
    return this.blockers.map(b => ({
      type: 'crowdBlocker',
      cell: b.cell,
      state: b.moving ? 'moving' : 'static',
    }));
  }

  getHudExtra(): string { return 'FOULE MOBILE'; }
}
