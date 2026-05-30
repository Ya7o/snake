import { BaseMechanic, DangerCell, ExtraEntity, MechanicUpdate } from './BaseMechanic';
import { Cell, cellKey } from '../core/Grid';
import { Grid } from '../core/Grid';

// Charge move: maintain direction for bonus; spar zones refresh every ~3 s
const SPAR_COUNT = 10;          // 30 ÷ 3
const SPAR_RESPAWN_TICKS = 18;  // ~3 s at 165 ms/tick

export class FighterChargeMechanic extends BaseMechanic {
  private chargeCount = 0;
  private lastDir = '';
  private chargeReady = false;
  private sparZones: Cell[] = [];
  private grid!: Grid;
  private spawnTimer = 0;
  private respawnTimer = 0;

  protected onInit(): void {
    this.grid = new Grid(this.ctx.grid.cols, this.ctx.grid.rows);
    this.spawnSparZones();
  }

  private spawnSparZones(): void {
    this.sparZones = [];
    const occupied = new Set<string>(this.ctx.snake.body.map(c => cellKey(c)));
    for (let i = 0; i < SPAR_COUNT; i++) {
      const c = this.grid.randomFreeCell(occupied);
      if (c) { this.sparZones.push(c); occupied.add(cellKey(c)); }
    }
    this.respawnTimer = 0;
  }

  tick(_tickCount: number): MechanicUpdate {
    this.spawnTimer++;
    this.respawnTimer++;

    // Refresh all zones every ~3 seconds
    if (this.respawnTimer >= SPAR_RESPAWN_TICKS) {
      this.spawnSparZones();
    }

    const dir = this.ctx.snake.direction;
    if (dir === this.lastDir) {
      this.chargeCount++;
    } else {
      this.chargeCount = 0;
      this.lastDir = dir;
      this.chargeReady = false;
    }
    if (this.chargeCount >= 4) this.chargeReady = true;

    return {};
  }

  onPickupCollected(_cell: Cell): MechanicUpdate {
    if (this.chargeReady) {
      this.chargeCount = 0;
      this.chargeReady = false;
      return { score: 2 };
    }
    return {};
  }

  getExtraEntities(): ExtraEntity[] {
    const entities: ExtraEntity[] = this.sparZones.map(s => ({
      type: 'sparZone', cell: s, state: 'static' as const
    }));
    if (this.chargeReady) {
      entities.push({ type: 'chargeGlow', cell: this.ctx.snake.body[0], state: 'ready' });
    }
    return entities;
  }

  getDangerCells(): DangerCell[] {
    return this.sparZones.map(cell => ({ ...cell, source: 'chargeMove', lethal: true }));
  }

  getHudExtra(): string {
    if (this.chargeReady) return 'CHARGE PRÊTE !';
    return `CHARGE ${this.chargeCount}/4`;
  }
}
