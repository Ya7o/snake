import { BaseMechanic, ExtraEntity, MechanicUpdate } from './BaseMechanic';
import { Cell, cellKey } from '../core/Grid';
import { Grid } from '../core/Grid';

// Lane drift: vertical lanes; traffic blocks in lanes; checkpoints on lane columns
interface TrafficBlock { cell: Cell; ttl: number }

export class OutRunLaneMechanic extends BaseMechanic {
  private traffic: TrafficBlock[] = [];
  private grid!: Grid;
  private spawnTimer = 0;
  private laneCount = 3;
  private checkpoint: Cell | null = null;
  private lastLane = -1;

  protected onInit(): void {
    this.grid = new Grid(this.ctx.grid.cols, this.ctx.grid.rows);
    this.spawnCheckpoint();
  }

  private spawnCheckpoint(): void {
    let lane: number;
    let attempts = 0;
    do {
      lane = Math.floor(Math.random() * this.laneCount);
      attempts++;
    } while (lane === this.lastLane && this.laneCount > 1 && attempts < 10);
    this.lastLane = lane;
    const col = this.getLaneX(lane);
    const occupied = new Set<string>(this.ctx.snake.body.map(c => cellKey(c)));
    for (const t of this.traffic) occupied.add(cellKey(t.cell));
    for (let attempt = 0; attempt < 20; attempt++) {
      const row = 2 + Math.floor(Math.random() * (this.ctx.grid.rows - 4));
      if (!occupied.has(cellKey({ col, row }))) {
        this.checkpoint = { col, row };
        return;
      }
    }
    this.checkpoint = this.grid.randomFreeCell(occupied) ?? null;
  }

  getCheckpointPickup(): Cell[] {
    return this.checkpoint ? [this.checkpoint] : [];
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

  onPickupCollected(_cell: Cell): MechanicUpdate {
    this.spawnCheckpoint();
    return {};
  }

  getExtraEntities(): ExtraEntity[] {
    return this.traffic.map(t => ({
      type: 'trafficBlock', cell: t.cell, state: 'moving'
    }));
  }

  getHudExtra(): string { return 'PASSE LES BALISES'; }
}
