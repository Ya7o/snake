import { BaseMechanic, DangerCell, ExtraEntity, MechanicUpdate } from './BaseMechanic';
import { Cell, cellKey } from '../core/Grid';
import { Grid } from '../core/Grid';

// Blink walls: ghost → warning → active → gone
type WallState = 'ghost' | 'warning' | 'active';
interface BlinkWall { cell: Cell; state: WallState; ticksLeft: number }

export const CASTLE_ILLUSION_TUNING = {
  maxWalls: 2,
  spawnIntervalTicks: 20,
  safeTicks: 8,
  warningTicks: 8,
  activeTicks: 4,
} as const;

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
        if (w.state === 'ghost')   { w.state = 'warning'; w.ticksLeft = CASTLE_ILLUSION_TUNING.warningTicks; }
        else if (w.state === 'warning') { w.state = 'active'; w.ticksLeft = CASTLE_ILLUSION_TUNING.activeTicks; }
        else { w.ticksLeft = -1; } // mark for removal
      }
    }
    this.blinkWalls = this.blinkWalls.filter(w => w.ticksLeft >= 0);

    if (this.spawnTimer % CASTLE_ILLUSION_TUNING.spawnIntervalTicks === 0 && this.blinkWalls.length < CASTLE_ILLUSION_TUNING.maxWalls) {
      const occupied = this.getSpawnBlockedCells();
      for (const w of this.blinkWalls) occupied.add(cellKey(w.cell));
      for (const p of this.ctx.pickups) occupied.add(cellKey(p));
      const cell = this.grid.randomFreeCell(occupied);
      if (cell) this.blinkWalls.push({ cell, state: 'ghost', ticksLeft: CASTLE_ILLUSION_TUNING.safeTicks });
    }

    return {};
  }

  private getSpawnBlockedCells(): Set<string> {
    const blocked = new Set<string>();
    for (const cell of this.ctx.snake.body) {
      blocked.add(cellKey(cell));
      const neighbors = [
        { col: cell.col + 1, row: cell.row },
        { col: cell.col - 1, row: cell.row },
        { col: cell.col, row: cell.row + 1 },
        { col: cell.col, row: cell.row - 1 },
      ];
      for (const neighbor of neighbors) {
        if (this.grid.inBounds(neighbor)) blocked.add(cellKey(neighbor));
      }
    }
    return blocked;
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

  getDangerCells(): DangerCell[] {
    return this.blinkWalls
      .filter(w => w.state === 'active')
      .map(w => ({ ...w.cell, source: 'castleIllusion', lethal: true }));
  }

  getHudExtra(): string {
    if (this.blinkWalls.some(w => w.state === 'active')) return 'DANGER';
    if (this.blinkWalls.some(w => w.state === 'warning')) return 'ATTENTION';
    return 'MURS CACHÉS';
  }
}
