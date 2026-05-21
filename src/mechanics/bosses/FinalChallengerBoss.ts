import { BaseBoss } from './BaseBoss';
import { ExtraEntity, MechanicUpdate } from '../BaseMechanic';
import { Cell, cellKey } from '../../core/Grid';
import { Grid } from '../../core/Grid';

// Final Challenger: round-based; attack window opens, if missed boss counter-attacks
type RoundPhase = 'idle' | 'attack_window' | 'counter';
interface CounterZone { cell: Cell; ttl: number }

export class FinalChallengerBoss extends BaseBoss {
  private bossCell!: Cell;
  private roundPhase: RoundPhase = 'idle';
  private phaseTimer = 0;
  private counterZones: CounterZone[] = [];
  private grid!: Grid;

  protected onInit(): void {
    this.grid = new Grid(this.ctx.grid.cols, this.ctx.grid.rows);
    this.bossCell = { col: Math.floor(this.ctx.grid.cols / 2), row: 2 };
  }

  tick(_tickCount: number): MechanicUpdate {
    this.tickCooldown();
    this.phaseTimer++;
    const head = this.ctx.snake.body[0];

    // Decrement counter zones
    for (const cz of this.counterZones) cz.ttl--;
    this.counterZones = this.counterZones.filter(cz => cz.ttl > 0);
    for (const cz of this.counterZones) {
      if (cz.cell.col === head.col && cz.cell.row === head.row) return { hitDanger: true };
    }

    if (this.roundPhase === 'idle') {
      if (this.phaseTimer > 20) { this.roundPhase = 'attack_window'; this.phaseTimer = 0; }
    } else if (this.roundPhase === 'attack_window') {
      if (head.col === this.bossCell.col && head.row === this.bossCell.row) {
        this.registerHit();
        this.roundPhase = 'idle';
        this.phaseTimer = 0;
        const occ = new Set<string>(this.ctx.snake.body.map(c => cellKey(c)));
        const cell = this.grid.randomFreeCell(occ);
        if (cell) this.bossCell = cell;
        return {};
      }
      if (this.phaseTimer > 12) {
        // missed — counter attack
        this.roundPhase = 'counter';
        this.phaseTimer = 0;
        const occ = new Set<string>(this.ctx.snake.body.map(c => cellKey(c)));
        for (let i = 0; i < 4; i++) {
          const c = this.grid.randomFreeCell(occ);
          if (c) { this.counterZones.push({ cell: c, ttl: 8 }); occ.add(cellKey(c)); }
        }
      }
    } else if (this.roundPhase === 'counter') {
      if (this.phaseTimer > 10) { this.roundPhase = 'idle'; this.phaseTimer = 0; }
    }

    return {};
  }

  getExtraEntities(): ExtraEntity[] {
    const entities: ExtraEntity[] = [
      { type: 'finalChallenger', cell: this.bossCell, state: this.roundPhase, data: { hp: this.hp } }
    ];
    for (const cz of this.counterZones) {
      entities.push({ type: 'counterZone', cell: cz.cell, state: 'danger' });
    }
    return entities;
  }

  getHudExtra(): string {
    const base = super.getHudExtra();
    if (this.roundPhase === 'attack_window') return `${base} FRAPPE !`;
    return base;
  }
}
