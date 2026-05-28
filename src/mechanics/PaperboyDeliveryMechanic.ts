import { BaseMechanic, DangerCell, ExtraEntity, MechanicUpdate } from './BaseMechanic';
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
    // Respawn targets when all delivered and not carrying paper
    if (!this.hasPaper && this.targets.every(t => !t.active)) {
      this.spawnTargets();
      this.spawnObstacles();
    }

    return {};
  }

  onPickupCollected(cell: Cell): MechanicUpdate {
    if (this.hasPaper) {
      const target = this.targets.find(t => t.active && t.cell.col === cell.col && t.cell.row === cell.row);
      if (target) {
        target.active = false;
        this.hasPaper = false;
        return { score: 1 };
      }
    }
    this.hasPaper = true;
    return {};
  }

  getDeliveryPickups(): Cell[] {
    return this.hasPaper ? this.targets.filter(t => t.active).map(t => t.cell) : [];
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

  getDangerCells(): DangerCell[] {
    return this.obstacles.map(cell => ({ ...cell, source: 'deliveryTargets', lethal: true }));
  }

  getHudExtra(): string {
    return this.hasPaper ? 'LIVRE !' : 'PRENDS LE JOURNAL';
  }

  getDeliveredCount(): number {
    return this.targets.filter(t => !t.active).length;
  }
}
