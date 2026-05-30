import { BaseMechanic, DangerCell, ExtraEntity, MechanicUpdate } from './BaseMechanic';
import { Cell, cellKey } from '../core/Grid';
import { Grid } from '../core/Grid';

// Fatal zones: lava clusters — warning→active; each zone is 10–20 cells
type ZoneState = 'warning' | 'active';
interface FatalZone { cells: Cell[]; state: ZoneState; ticksLeft: number }

function spawnCluster(center: Cell, radius: number, cols: number, rows: number): Cell[] {
  const cells: Cell[] = [];
  const r2 = radius * radius;
  const ri = Math.ceil(radius);
  for (let dc = -ri; dc <= ri; dc++) {
    for (let dr = -ri; dr <= ri; dr++) {
      if (dc * dc + dr * dr <= r2 + 0.5) {
        const col = center.col + dc;
        const row = center.row + dr;
        if (col >= 0 && col < cols && row >= 0 && row < rows) {
          cells.push({ col, row });
        }
      }
    }
  }
  return cells;
}

export class KombatFatalMechanic extends BaseMechanic {
  private zones: FatalZone[] = [];
  private grid!: Grid;
  private spawnTimer = 0;

  protected onInit(): void {
    this.grid = new Grid(this.ctx.grid.cols, this.ctx.grid.rows);
  }

  tick(_tickCount: number): MechanicUpdate {
    this.spawnTimer++;

    for (const z of this.zones) {
      z.ticksLeft--;
      if (z.ticksLeft <= 0) {
        if (z.state === 'warning') {
          z.state = 'active';
          z.ticksLeft = 4;
        } else {
          z.ticksLeft = -1;
        }
      }
    }
    this.zones = this.zones.filter(z => z.ticksLeft >= 0);

    // Spawn one lava cluster every 12 ticks, max 2 simultaneous zones
    if (this.spawnTimer % 12 === 0 && this.zones.length < 2) {
      const occupied = new Set<string>(this.ctx.snake.body.map(c => cellKey(c)));
      for (const z of this.zones) for (const c of z.cells) occupied.add(cellKey(c));
      for (const p of this.ctx.pickups) occupied.add(cellKey(p));

      const center = this.grid.randomFreeCell(occupied);
      if (center) {
        // Radius 2.0–2.5 → circle of ~12–20 cells
        const radius = 2.0 + Math.random() * 0.5;
        const cells = spawnCluster(center, radius, this.ctx.grid.cols, this.ctx.grid.rows);
        if (cells.length >= 8) {
          this.zones.push({ cells, state: 'warning', ticksLeft: 8 });
        }
      }
    }

    return {};
  }

  getExtraEntities(): ExtraEntity[] {
    const entities: ExtraEntity[] = [];
    for (const z of this.zones) {
      for (const cell of z.cells) {
        entities.push({ type: 'fatalZone', cell, state: z.state });
      }
    }
    return entities;
  }

  getDangerCells(): DangerCell[] {
    const danger: DangerCell[] = [];
    for (const z of this.zones) {
      if (z.state === 'active') {
        for (const cell of z.cells) {
          danger.push({ ...cell, source: 'fatalZones', lethal: true });
        }
      }
    }
    return danger;
  }

  getHudExtra(): string { return 'ZONES FATALES'; }
}
