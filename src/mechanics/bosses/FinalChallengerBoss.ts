import { BaseBoss, BossHitResult } from './BaseBoss';
import { DangerCell, ExtraEntity, MechanicUpdate } from '../BaseMechanic';
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
    // Decrement counter zones
    for (const cz of this.counterZones) cz.ttl--;
    this.counterZones = this.counterZones.filter(cz => cz.ttl > 0);

    if (this.roundPhase === 'idle') {
      if (this.phaseTimer > 10) { this.roundPhase = 'attack_window'; this.phaseTimer = 0; }
    } else if (this.roundPhase === 'attack_window') {
      if (this.phaseTimer > 10) {
        // missed — counter attack; more zones as boss HP drops
        this.roundPhase = 'counter';
        this.phaseTimer = 0;
        const counterCount = [5, 7, 10][this.phase] ?? 5;
        const occ = new Set<string>(this.ctx.snake.body.map(c => cellKey(c)));
        for (let i = 0; i < counterCount; i++) {
          const c = this.grid.randomFreeCell(occ);
          if (c) { this.counterZones.push({ cell: c, ttl: 10 }); occ.add(cellKey(c)); }
        }
      }
    } else if (this.roundPhase === 'counter') {
      if (this.phaseTimer > 12) { this.roundPhase = 'idle'; this.phaseTimer = 0; }
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

  getDangerCells(): DangerCell[] {
    return this.counterZones.map(cz => ({ ...cz.cell, source: 'finalChallenger', lethal: true }));
  }

  getWeakPoints(): Cell[] {
    return this.roundPhase === 'attack_window' ? [this.bossCell] : [];
  }

  onWeakPointHit(cell: Cell): BossHitResult {
    if (this.roundPhase !== 'attack_window' || cell.col !== this.bossCell.col || cell.row !== this.bossCell.row) {
      return { hit: false, defeated: this.isDefeated() };
    }
    const result = super.onWeakPointHit(cell);
    if (result.hit && !result.defeated) {
      this.roundPhase = 'idle';
      this.phaseTimer = 0;
      const occ = new Set<string>(this.ctx.snake.body.map(c => cellKey(c)));
      const nextCell = this.grid.randomFreeCell(occ);
      if (nextCell) this.bossCell = nextCell;
    }
    return result;
  }

  getHudExtra(): string {
    if (this.roundPhase === 'attack_window') return 'FRAPPE';
    if (this.roundPhase === 'counter') return 'ÉVITE';
    return super.getHudExtra();
  }
}
