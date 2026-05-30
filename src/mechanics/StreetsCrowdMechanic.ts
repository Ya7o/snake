import { BaseMechanic, DangerCell, ExtraEntity, MechanicUpdate } from './BaseMechanic';
import { Cell, cellKey } from '../core/Grid';
import { Grid } from '../core/Grid';

// Crowd blockers: temporary blockers; some charge in a straight line for 2-5 cells
type BlockerState = 'static' | 'moving' | 'warning' | 'charging';
interface Blocker {
  cell: Cell;
  ttl: number;
  dir: { col: number; row: number };
  state: BlockerState;
  chargeStepsLeft: number;
  warningTicks: number;
}

const DIRS = [{ col: 1, row: 0 }, { col: -1, row: 0 }, { col: 0, row: 1 }, { col: 0, row: -1 }];

export class StreetsCrowdMechanic extends BaseMechanic {
  private blockers: Blocker[] = [];
  private grid!: Grid;
  private spawnTimer = 0;

  protected onInit(): void {
    this.grid = new Grid(this.ctx.grid.cols, this.ctx.grid.rows);
  }

  tick(_tickCount: number): MechanicUpdate {
    this.spawnTimer++;

    // Progress each blocker
    for (const b of this.blockers) {
      if (b.state === 'warning') {
        b.warningTicks--;
        if (b.warningTicks <= 0) b.state = 'charging';
      } else if (b.state === 'charging') {
        // Move 1 step per tick along its direction
        const nx = b.cell.col + b.dir.col;
        const ny = b.cell.row + b.dir.row;
        if (nx >= 0 && nx < this.ctx.grid.cols && ny >= 0 && ny < this.ctx.grid.rows) {
          b.cell = { col: nx, row: ny };
        }
        b.chargeStepsLeft--;
        if (b.chargeStepsLeft <= 0) b.ttl = 0; // remove after charge
      } else if (b.state === 'moving' && this.spawnTimer % 3 === 0) {
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

    // Trigger a charge on a random idle blocker every ~25 ticks
    if (this.spawnTimer % 25 === 0) {
      const idleBlockers = this.blockers.filter(b => b.state === 'static' || b.state === 'moving');
      if (idleBlockers.length > 0) {
        const target = idleBlockers[Math.floor(Math.random() * idleBlockers.length)];
        target.dir = DIRS[Math.floor(Math.random() * DIRS.length)];
        target.state = 'warning';
        target.warningTicks = 2;
        target.chargeStepsLeft = 2 + Math.floor(Math.random() * 4); // 2–5 steps
        target.ttl = Math.max(target.ttl, target.chargeStepsLeft + 4);
      }
    }

    // Spawn new blockers every 15 ticks, max 5
    if (this.spawnTimer % 15 === 0 && this.blockers.length < 5) {
      const occupied = new Set<string>(this.ctx.snake.body.map(c => cellKey(c)));
      for (const b of this.blockers) occupied.add(cellKey(b.cell));
      for (const p of this.ctx.pickups) occupied.add(cellKey(p));
      const cell = this.grid.randomFreeCell(occupied);
      if (cell) {
        const moving = Math.random() < 0.4;
        this.blockers.push({
          cell,
          ttl: 24 + Math.floor(Math.random() * 14),
          dir: DIRS[Math.floor(Math.random() * DIRS.length)],
          state: moving ? 'moving' : 'static',
          chargeStepsLeft: 0,
          warningTicks: 0,
        });
      }
    }

    return {};
  }

  getExtraEntities(): ExtraEntity[] {
    const entities: ExtraEntity[] = this.blockers.map(b => ({
      type: 'crowdBlocker',
      cell: b.cell,
      state: b.state,
    }));

    // During warning, also mark the charge trajectory cells as danger
    for (const b of this.blockers) {
      if (b.state !== 'warning') continue;
      for (let step = 1; step <= Math.min(b.warningTicks + b.chargeStepsLeft, 5); step++) {
        const col = b.cell.col + b.dir.col * step;
        const row = b.cell.row + b.dir.row * step;
        if (col < 0 || col >= this.ctx.grid.cols || row < 0 || row >= this.ctx.grid.rows) break;
        entities.push({ type: 'crowdBlocker', cell: { col, row }, state: 'danger' });
      }
    }

    return entities;
  }

  getDangerCells(): DangerCell[] {
    return this.blockers.map(b => ({ ...b.cell, source: 'crowdBlockers', lethal: true }));
  }

  getHudExtra(): string { return 'FOULE MOBILE'; }
}
