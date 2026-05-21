import { BaseMechanic, ExtraEntity, MechanicUpdate } from './BaseMechanic';
import { Cell, cellKey } from '../core/Grid';
import { Grid } from '../core/Grid';

// Charge move: maintain same direction for 4 cells to charge; special pickup validates charge
export class FighterChargeMechanic extends BaseMechanic {
  private chargeCount = 0;
  private lastDir = '';
  private chargeReady = false;
  private sparZones: Cell[] = [];
  private grid!: Grid;
  private spawnTimer = 0;

  protected onInit(): void {
    this.grid = new Grid(this.ctx.grid.cols, this.ctx.grid.rows);
    this.spawnSparZones();
  }

  private spawnSparZones(): void {
    this.sparZones = [];
    const occupied = new Set<string>(this.ctx.snake.body.map(c => cellKey(c)));
    for (let i = 0; i < 3; i++) {
      const c = this.grid.randomFreeCell(occupied);
      if (c) { this.sparZones.push(c); occupied.add(cellKey(c)); }
    }
  }

  tick(_tickCount: number): MechanicUpdate {
    this.spawnTimer++;
    const dir = this.ctx.snake.direction;
    if (dir === this.lastDir) {
      this.chargeCount++;
    } else {
      this.chargeCount = 0;
      this.lastDir = dir;
      this.chargeReady = false;
    }
    if (this.chargeCount >= 4) this.chargeReady = true;

    // Check spar zone collision
    const head = this.ctx.snake.body[0];
    let hitDanger = false;
    for (const s of this.sparZones) {
      if (s.col === head.col && s.row === head.row) hitDanger = true;
    }

    return { hitDanger };
  }

  onPickupCollected(_cell: Cell): MechanicUpdate {
    if (this.chargeReady) {
      this.chargeCount = 0;
      this.chargeReady = false;
      return { score: 2 }; // bonus
    }
    return {};
  }

  getExtraEntities(): ExtraEntity[] {
    const entities: ExtraEntity[] = this.sparZones.map(s => ({
      type: 'sparZone', cell: s, state: 'static'
    }));
    if (this.chargeReady) {
      entities.push({ type: 'chargeGlow', cell: this.ctx.snake.body[0], state: 'ready' });
    }
    return entities;
  }

  getHudExtra(): string {
    if (this.chargeReady) return 'CHARGE PRÊTE !';
    return `CHARGE ${this.chargeCount}/4`;
  }
}
