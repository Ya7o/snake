import { BaseBoss } from './BaseBoss';
import { ExtraEntity, MechanicUpdate } from '../BaseMechanic';
import { Cell, cellKey } from '../../core/Grid';
import { Grid } from '../../core/Grid';

// Multiple mirrors spawn; one is real (briefly shown); touch real = hit boss
interface Mirror { cell: Cell; real: boolean; revealed: boolean; revealTicks: number }

export class WitchMirrorBoss extends BaseBoss {
  private mirrors: Mirror[] = [];
  private grid!: Grid;
  private revealTimer = 0;
  private revealInterval = 30;

  protected onInit(): void {
    this.grid = new Grid(this.ctx.grid.cols, this.ctx.grid.rows);
    this.spawnMirrors();
  }

  private spawnMirrors(): void {
    this.mirrors = [];
    const occupied = new Set<string>(this.ctx.snake.body.map(c => cellKey(c)));
    const count = 2 + this.phase;
    let realSet = false;
    for (let i = 0; i < count; i++) {
      const cell = this.grid.randomFreeCell(occupied);
      if (!cell) break;
      occupied.add(cellKey(cell));
      const real = !realSet;
      if (!realSet) realSet = true;
      this.mirrors.push({ cell, real, revealed: false, revealTicks: 0 });
    }
  }

  tick(_tickCount: number): MechanicUpdate {
    this.tickCooldown();
    this.revealTimer++;

    // Periodically reveal the real mirror briefly
    for (const m of this.mirrors) {
      if (m.revealTicks > 0) { m.revealTicks--; if (m.revealTicks === 0) m.revealed = false; }
    }
    if (this.revealTimer % this.revealInterval === 0) {
      const real = this.mirrors.find(m => m.real);
      if (real) { real.revealed = true; real.revealTicks = 8; }
    }

    // Check collision
    const head = this.ctx.snake.body[0];
    for (const m of this.mirrors) {
      if (m.cell.col === head.col && m.cell.row === head.row) {
        if (m.real) {
          this.registerHit();
          this.spawnMirrors();
        } else {
          return { hitDanger: true };
        }
        break;
      }
    }

    if (this.isDefeated()) return { hitDanger: false };
    return {};
  }

  getExtraEntities(): ExtraEntity[] {
    return this.mirrors.map(m => ({
      type: 'witchMirror',
      cell: m.cell,
      state: m.real && m.revealed ? 'real' : 'fake',
      data: { hp: this.hp }
    }));
  }
}
