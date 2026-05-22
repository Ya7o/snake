import { BaseMechanic, DangerCell, ExtraEntity, MechanicUpdate } from './BaseMechanic';
import { Cell, cellKey } from '../core/Grid';
import { Grid } from '../core/Grid';

// Fatal zones: warning→active; active = danger
type ZoneState = 'warning' | 'active';
interface FatalZone { cell: Cell; state: ZoneState; ticksLeft: number }

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
          z.ticksLeft = -1; // remove
        }
      }
    }
    this.zones = this.zones.filter(z => z.ticksLeft >= 0);

    // Spawn zone every 10 ticks
    if (this.spawnTimer % 10 === 0 && this.zones.length < 4) {
      const occupied = new Set<string>(this.ctx.snake.body.map(c => cellKey(c)));
      for (const z of this.zones) occupied.add(cellKey(z.cell));
      for (const p of this.ctx.pickups) occupied.add(cellKey(p));
      const cell = this.grid.randomFreeCell(occupied);
      if (cell) this.zones.push({ cell, state: 'warning', ticksLeft: 5 });
    }

    return {};
  }

  getExtraEntities(): ExtraEntity[] {
    return this.zones.map(z => ({
      type: 'fatalZone', cell: z.cell, state: z.state
    }));
  }

  getDangerCells(): DangerCell[] {
    return this.zones
      .filter(z => z.state === 'active')
      .map(z => ({ ...z.cell, source: 'fatalZones', lethal: true }));
  }

  getHudExtra(): string { return 'ZONES FATALES'; }
}
