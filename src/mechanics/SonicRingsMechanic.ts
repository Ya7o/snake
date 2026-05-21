import { BaseMechanic, ExtraEntity, MechanicUpdate } from './BaseMechanic';
import { Cell, cellKey } from '../core/Grid';
import { Grid } from '../core/Grid';

// Ring chains: rings appear in a chain; collect in order for bonus
interface ChainRing { cell: Cell; index: number; active: boolean }

export class SonicRingsMechanic extends BaseMechanic {
  private chain: ChainRing[] = [];
  private chainIndex = 0;   // next ring to collect
  private chainSize = 4;
  private grid!: Grid;
  private spawnTimer = 0;

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
    // Update active ring (first uncollected)
    for (const r of this.chain) {
      r.active = r.index === this.chainIndex;
    }
    // Replace pickups to be chain rings only — handled via getExtraEntities
    return {};
  }

  onPickupCollected(cell: Cell): MechanicUpdate {
    // find which ring was collected
    const ring = this.chain.find(r => r.cell.col === cell.col && r.cell.row === cell.row);
    if (!ring) return {};
    if (ring.index === this.chainIndex) {
      // correct order
      this.chainIndex++;
      if (this.chainIndex >= this.chain.length) {
        // chain complete — spawn new chain
        this.spawnChain();
      } else {
        // activate next
        for (const r of this.chain) r.active = r.index === this.chainIndex;
      }
    } else {
      // wrong order — restart chain
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
    return `ANNEAU ${this.chainIndex + 1}/${this.chainSize}`;
  }
}
