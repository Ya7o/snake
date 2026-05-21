import { BaseMechanic, ExtraEntity, MechanicUpdate } from './BaseMechanic';
import { Cell, cellKey } from '../core/Grid';
import { spawnPickup } from '../core/Spawn';
import { Grid } from '../core/Grid';

// Blink walls: ghost → warning → active → gone
type WallState = 'ghost' | 'warning' | 'active';
interface BlinkWall { cell: Cell; state: WallState; ticksLeft: number }

export class CastleIllusionMechanic extends BaseMechanic {
  private blinkWalls: BlinkWall[] = [];
  private grid!: Grid;
  private spawnTimer = 0;

  protected onInit(): void {
    this.grid = new Grid(this.ctx.grid.cols, this.ctx.grid.rows);
  }

  tick(tickCount: number): MechanicUpdate {
    this.spawnTimer++;

    // Progress each blink wall
    for (const w of this.blinkWalls) {
      w.ticksLeft--;
      if (w.ticksLeft <= 0) {
        if (w.state === 'ghost')   { w.state = 'warning'; w.ticksLeft = 4; }
        else if (w.state === 'warning') { w.state = 'active'; w.ticksLeft = 5; }
        else { w.ticksLeft = -1; } // mark for removal
      }
    }
    // Check collision with active walls
    const head = this.ctx.snake.body[0];
    let hitDanger = false;
    const toRemove: Cell[] = [];
    for (const w of this.blinkWalls) {
      if (w.ticksLeft < 0) { toRemove.push(w.cell); continue; }
      if (w.state === 'active' && w.cell.col === head.col && w.cell.row === head.row) {
        hitDanger = true;
      }
    }
    this.blinkWalls = this.blinkWalls.filter(w => w.ticksLeft >= 0);

    // Spawn a new blink wall every ~12 ticks
    if (this.spawnTimer % 12 === 0 && this.blinkWalls.length < 5) {
      const occupied = new Set<string>(this.ctx.snake.body.map(c => cellKey(c)));
      for (const w of this.blinkWalls) occupied.add(cellKey(w.cell));
      for (const p of this.ctx.pickups) occupied.add(cellKey(p));
      const cell = this.grid.randomFreeCell(occupied);
      if (cell) this.blinkWalls.push({ cell, state: 'ghost', ticksLeft: 5 });
    }

    return { hitDanger };
  }

  onPickupCollected(_cell: Cell): MechanicUpdate {
    // spawn new pickup
    return {};
  }

  getExtraEntities(): ExtraEntity[] {
    return this.blinkWalls.map(w => ({
      type: 'blinkWall',
      cell: w.cell,
      state: w.state,
    }));
  }

  getHudExtra(): string {
    return 'CLIGNO=DANGER';
  }
}
