import { BaseBoss, BossHitResult } from './BaseBoss';
import { DangerCell, ExtraEntity, MechanicUpdate } from '../BaseMechanic';
import { Cell, cellKey } from '../../core/Grid';
import { Grid } from '../../core/Grid';

// Shadow Ninja: clones appear; real ninja briefly revealed; touch real = hit
interface Clone { cell: Cell; real: boolean; revealed: boolean; revealTicks: number }

export class ShadowNinjaBoss extends BaseBoss {
  private clones: Clone[] = [];
  private grid!: Grid;
  private revealTimer = 0;
  private revealInterval = 28;

  protected onInit(): void {
    this.grid = new Grid(this.ctx.grid.cols, this.ctx.grid.rows);
    this.spawnClones();
  }

  private spawnClones(): void {
    this.clones = [];
    const occupied = new Set<string>(this.ctx.snake.body.map(c => cellKey(c)));
    const count = 2 + this.phase;
    let realSet = false;
    for (let i = 0; i < count; i++) {
      const cell = this.grid.randomFreeCell(occupied);
      if (!cell) break;
      occupied.add(cellKey(cell));
      const real = !realSet;
      if (!realSet) realSet = true;
      this.clones.push({ cell, real, revealed: false, revealTicks: 0 });
    }
  }

  tick(_tickCount: number): MechanicUpdate {
    this.tickCooldown();
    this.revealTimer++;

    for (const c of this.clones) {
      if (c.revealTicks > 0) { c.revealTicks--; if (c.revealTicks === 0) c.revealed = false; }
    }
    if (this.revealTimer % this.revealInterval === 0) {
      const real = this.clones.find(c => c.real);
      if (real) { real.revealed = true; real.revealTicks = 6; }
    }

    return {};
  }

  getExtraEntities(): ExtraEntity[] {
    return this.clones.map(cl => ({
      type: 'shadowNinja',
      cell: cl.cell,
      state: cl.real && cl.revealed ? 'real' : 'shadow',
      data: { hp: this.hp }
    }));
  }

  getDangerCells(): DangerCell[] {
    return this.clones
      .filter(cl => !cl.real)
      .map(cl => ({ ...cl.cell, source: 'shadowNinja', lethal: true }));
  }

  getWeakPoints(): Cell[] {
    return this.clones.filter(cl => cl.real).map(cl => cl.cell);
  }

  onWeakPointHit(cell: Cell): BossHitResult {
    const clone = this.clones.find(cl => cl.real && cl.cell.col === cell.col && cl.cell.row === cell.row);
    if (!clone) return { hit: false, defeated: this.isDefeated() };
    const result = super.onWeakPointHit(cell);
    if (result.hit && !result.defeated) this.spawnClones();
    return result;
  }
}
