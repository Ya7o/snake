import { BaseMechanic, ExtraEntity, MechanicUpdate } from './BaseMechanic';
import { Cell, cellKey } from '../core/Grid';
import { Grid } from '../core/Grid';

// Ring chains: rings appear in a chain; collect in order for bonus
interface ChainRing { cell: Cell; index: number; active: boolean }

const BOOST_TICKS = 20;   // ~2.7 s at 135 ms/tick
const BOOST_SPEED_MULT = 0.55; // 45 % faster

export class SonicRingsMechanic extends BaseMechanic {
  private chain: ChainRing[] = [];
  private chainIndex = 0;   // next ring to collect
  private chainSize = 4;
  private grid!: Grid;
  private spawnTimer = 0;
  private boostTicksLeft = 0;

  protected onInit(): void {
    this.grid = new Grid(this.ctx.grid.cols, this.ctx.grid.rows);
    this.spawnChain();
  }

  private spawnChain(): void {
    this.chain = [];
    this.chainIndex = 0;
    const occupied = new Set<string>(this.ctx.snake.body.map(c => cellKey(c)));
    for (let i = 0; i < this.chainSize; i++) {
      const cell = this.grid.randomFreeCell(occupied);
      if (!cell) break;
      occupied.add(cellKey(cell));
      this.chain.push({ cell, index: i, active: i === 0 });
    }
  }

  tick(_tickCount: number): MechanicUpdate {
    this.spawnTimer++;
    if (this.boostTicksLeft > 0) this.boostTicksLeft--;
    // Update active ring (first uncollected)
    for (const r of this.chain) {
      r.active = r.index === this.chainIndex;
    }
    return {};
  }

  onPickupCollected(cell: Cell): MechanicUpdate {
    const ring = this.chain.find(r => r.cell.col === cell.col && r.cell.row === cell.row);
    if (!ring) return {};
    if (ring.index === this.chainIndex) {
      this.chainIndex++;
      if (this.chainIndex >= this.chain.length) {
        // Chain complete — activate speed boost then spawn new chain
        this.boostTicksLeft = BOOST_TICKS;
        this.spawnChain();
      } else {
        for (const r of this.chain) r.active = r.index === this.chainIndex;
      }
    } else {
      // Wrong order — restart chain, no boost
      this.spawnChain();
    }
    return {};
  }

  // Override: the active ring IS the pickup; non-active rings are obstacles
  getExtraEntities(): ExtraEntity[] {
    return this.chain.map(r => ({
      type: 'chainRing',
      cell: r.cell,
      state: r.active ? 'active' : 'inactive',
      data: { index: r.index }
    }));
  }

  getChainPickups(): Cell[] {
    // Return only the active ring as the current pickup
    const active = this.chain.find(r => r.active);
    return active ? [active.cell] : [];
  }

  getHudExtra(): string {
    if (this.boostTicksLeft > 0) return 'TURBO !';
    return `ANNEAU ${this.chainIndex + 1}/${this.chainSize}`;
  }

  override getSpeedMultiplier(): number {
    return this.boostTicksLeft > 0 ? BOOST_SPEED_MULT : 1;
  }
}
