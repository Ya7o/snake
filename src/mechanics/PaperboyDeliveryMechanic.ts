import { BaseMechanic, ExtraEntity, MechanicUpdate } from './BaseMechanic';
import { Cell, cellKey } from '../core/Grid';
import { Grid } from '../core/Grid';

// Delivery: collect paper pickup → deliver to target house
interface DeliveryTarget { cell: Cell; active: boolean }

export class PaperboyDeliveryMechanic extends BaseMechanic {
  private hasPaper = false;
  private targets: DeliveryTarget[] = [];
  private obstacles: Cell[] = [];
  private grid!: Grid;

  protected onInit(): void {
    this.grid = new Grid(this.ctx.grid.cols, this.ctx.grid.rows);
    this.spawnTargets();
    this.spawnObstacles();
  }

  private spawnTargets(): void {
    this.targets = [];
    const occupied = new Set<string>(this.ctx.snake.body.map(c => cellKey(c)));
    for (let i = 0; i < 2; i++) {
      const cell = this.grid.randomFreeCell(occupied);
      if (!cell) break;
      occupied.add(cellKey(cell));
      this.targets.push({ cell, active: true });
    }
  }

  private spawnObstacles(): void {
    this.obstacles = [];
    const occupied = new Set<string>(this.ctx.snake.body.map(c => cellKey(c)));
    for (const t of this.targets) occupied.add(cellKey(t.cell));
    for (let i = 0; i < 3; i++) {
      const cell = this.grid.randomFreeCell(occupied);
      if (!cell) break;
      occupied.add(cellKey(cell));
      this.obstacles.push(cell);
    }
  }

  tick(_tickCount: number): MechanicUpdate {
    const head = this.ctx.snake.body[0];
    let hitDanger = false;

    // Respawn targets when all delivered and not carrying paper
    if (!this.hasPaper && this.targets.every(t => !t.active)) {
      this.spawnTargets();
      this.spawnObstacles();
    }

    // Check obstacle collision
    for (const o of this.obstacles) {
      if (o.col === head.col && o.row === head.row) hitDanger = true;
    }

    // If has paper, check if on target
    if (this.hasPaper) {
      for (const t of this.targets) {
        if (t.active && t.cell.col === head.col && t.cell.row === head.row) {
          t.active = false;
          this.hasPaper = false;
          return { hitDanger, score: 1 };
        }
      }
    }

    return { hitDanger };
  }

  onPickupCollected(_cell: Cell): MechanicUpdate {
    this.hasPaper = true;
    return {};
  }

  getExtraEntities(): ExtraEntity[] {
    const entities: ExtraEntity[] = [];
    for (const t of this.targets) {
      if (t.active) entities.push({ type: 'deliveryTarget', cell: t.cell, state: this.hasPaper ? 'highlighted' : 'idle' });
    }
    for (const o of this.obstacles) {
      entities.push({ type: 'routeObstacle', cell: o, state: 'static' });
    }
    return entities;
  }

  getHudExtra(): string {
    return this.hasPaper ? 'LIVRER !' : 'PRENDS LE JOURNAL';
  }

  getDeliveredCount(): number {
    return this.targets.filter(t => !t.active).length;
  }
}
