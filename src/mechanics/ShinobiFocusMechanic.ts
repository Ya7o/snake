import { BaseMechanic, ExtraEntity, MechanicUpdate } from './BaseMechanic';
import { Cell, cellKey } from '../core/Grid';
import { Grid } from '../core/Grid';

// Focus mode: one real target + 2 decoys; decoy = penalty
interface Target { cell: Cell; real: boolean }

export class ShinobiFocusMechanic extends BaseMechanic {
  private targets: Target[] = [];
  private grid!: Grid;

  protected onInit(): void {
    this.grid = new Grid(this.ctx.grid.cols, this.ctx.grid.rows);
    this.spawnTargets();
  }

  private spawnTargets(): void {
    this.targets = [];
    const occupied = new Set<string>(this.ctx.snake.body.map(c => cellKey(c)));
    // 1 real + 2 decoys
    let realSet = false;
    for (let i = 0; i < 3; i++) {
      const cell = this.grid.randomFreeCell(occupied);
      if (!cell) break;
      occupied.add(cellKey(cell));
      const real = !realSet;
      if (!realSet) realSet = true;
      this.targets.push({ cell, real });
    }
  }

  tick(_tickCount: number): MechanicUpdate {
    return {};
  }

  onPickupCollected(cell: Cell): MechanicUpdate {
    const t = this.targets.find(t => t.cell.col === cell.col && t.cell.row === cell.row);
    this.spawnTargets();
    if (t && !t.real) {
      // decoy collected = danger (fake "death" — we signal hitDanger)
      return { hitDanger: true };
    }
    return {};
  }

  getExtraEntities(): ExtraEntity[] {
    return this.targets.map(t => ({
      type: 'focusTarget',
      cell: t.cell,
      state: t.real ? 'real' : 'decoy',
    }));
  }

  // Return real target as pickup cell
  getRealTargetPickups(): Cell[] {
    return this.targets.filter(t => t.real).map(t => t.cell);
  }

  getHudExtra(): string { return 'FOCUS TARGET'; }
}
