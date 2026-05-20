import { BaseMechanic, ExtraEntity, MechanicUpdate } from './BaseMechanic';
import { Cell, cellKey } from '../core/Grid';
import { Grid } from '../core/Grid';

// Lane drift: vertical lanes; traffic blocks in lanes
interface TrafficBlock { cell: Cell; ttl: number }

export class OutRunLaneMechanic extends BaseMechanic {
  private traffic: TrafficBlock[] = [];
  private grid!: Grid;
  private spawnTimer = 0;
  private laneCount = 3;

  protected onInit(): void {
    this.grid = new Grid(this.ctx.grid.cols, this.ctx.grid.rows);
  }

  getLaneX(lane: number): number {
    // spread 3 lanes across cols
    const step = Math.floor(this.ctx.grid.cols / (this.laneCount + 1));
    return step * (lane + 1);
  }

  tick(_tickCount: number): MechanicUpdate {
    this.spawnTimer++;
    let hitDanger = false;
    const head = this.ctx.snake.body[0];

    // Scroll traffic down
    if (this.spawnTimer % 2 === 0) {
      for (const t of this.traffic) {
        t.cell = { col: t.cell.col, row: t.cell.row + 1 };
        t.ttl--;
      }
      this.traffic = this.traffic.filter(t => t.ttl > 0 && t.cell.row < this.ctx.grid.rows);
    }

    // Collision
    for (const t of this.traffic) {
      if (t.cell.col === head.col && t.cell.row === head.row) hitDanger = true;
    }

    // Spawn traffic at top every 10 ticks
    if (this.spawnTimer % 10 === 0 && this.traffic.length < 5) {
      const lane = Math.floor(Math.random() * this.laneCount);
      const col = this.getLaneX(lane);
      const occupied = new Set<string>(this.ctx.snake.body.map(c => cellKey(c)));
      for (const p of this.ctx.pickups) occupied.add(cellKey(p));
      if (!occupied.has(cellKey({ col, row: 0 }))) {
        this.traffic.push({ cell: { col, row: 0 }, ttl: this.ctx.grid.rows + 2 });
      }
    }

    return { hitDanger };
  }

  getExtraEntities(): ExtraEntity[] {
    return this.traffic.map(t => ({
      type: 'trafficBlock', cell: t.cell, state: 'moving'
    }));
  }

  getHudExtra(): string { return 'HIT CHECKPOINTS'; }
}
