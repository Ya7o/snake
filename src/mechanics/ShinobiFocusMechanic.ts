import { BaseMechanic, DangerCell, ExtraEntity, MechanicUpdate } from './BaseMechanic';
import { Cell, cellKey } from '../core/Grid';
import { Grid } from '../core/Grid';

// Focus mode: one real target + 2 decoys; decoys orbit shuriken-style
interface Target {
  cell: Cell;
  real: boolean;
  orbitCenter: Cell;
  orbitRadius: number;
  orbitAngle: number;
}

const ORBIT_SPEED = Math.PI / 12; // 15°/tick — full circle in ~24 ticks

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
    let realSet = false;
    for (let i = 0; i < 3; i++) {
      const cell = this.grid.randomFreeCell(occupied);
      if (!cell) break;
      occupied.add(cellKey(cell));
      const real = !realSet;
      if (!realSet) realSet = true;
      this.targets.push({
        cell,
        real,
        orbitCenter: { ...cell },
        orbitRadius: real ? 0 : 2 + Math.floor(Math.random() * 2), // 2–3 cells
        orbitAngle: real ? 0 : (i / 2) * Math.PI + Math.random() * 0.5, // spread start angles
      });
    }
  }

  tick(_tickCount: number): MechanicUpdate {
    // Move decoys in circular orbits (shuriken effect)
    for (const t of this.targets) {
      if (t.real) continue;
      t.orbitAngle += ORBIT_SPEED;
      const col = Math.round(t.orbitCenter.col + t.orbitRadius * Math.cos(t.orbitAngle));
      const row = Math.round(t.orbitCenter.row + t.orbitRadius * Math.sin(t.orbitAngle));
      t.cell = {
        col: Math.max(0, Math.min(this.ctx.grid.cols - 1, col)),
        row: Math.max(0, Math.min(this.ctx.grid.rows - 1, row)),
      };
    }
    return {};
  }

  onPickupCollected(cell: Cell): MechanicUpdate {
    const t = this.targets.find(t => t.cell.col === cell.col && t.cell.row === cell.row);
    this.spawnTargets();
    if (t && !t.real) return {};
    return {};
  }

  getExtraEntities(): ExtraEntity[] {
    return this.targets.map(t => ({
      type: 'focusTarget',
      cell: t.cell,
      state: t.real ? 'real' : 'decoy',
    }));
  }

  getRealTargetPickups(): Cell[] {
    return this.targets.filter(t => t.real).map(t => t.cell);
  }

  getDangerCells(): DangerCell[] {
    return this.targets
      .filter(t => !t.real)
      .map(t => ({ ...t.cell, source: 'focusMode', lethal: true }));
  }

  getHudExtra(): string { return 'VRAIE CIBLE'; }
}
