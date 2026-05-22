import { BaseBoss, BossHitResult } from './BaseBoss';
import { DangerCell, ExtraEntity, MechanicUpdate } from '../BaseMechanic';
import { Cell, cellKey } from '../../core/Grid';
import { Grid } from '../../core/Grid';

// Crime Lord: zones of pressure; boss vulnerable after attack phase
type Phase = 'pressure' | 'vulnerable';
interface PressureZone { col: number; row: number }

export class CrimeLordBoss extends BaseBoss {
  private bossCell!: Cell;
  private pressureZones: PressureZone[] = [];
  private currentPhase: Phase = 'pressure';
  private phaseTimer = 0;
  private grid!: Grid;

  protected onInit(): void {
    this.grid = new Grid(this.ctx.grid.cols, this.ctx.grid.rows);
    this.bossCell = { col: Math.floor(this.ctx.grid.cols / 2), row: Math.floor(this.ctx.grid.rows / 2) };
    this.spawnPressure();
  }

  private spawnPressure(): void {
    this.pressureZones = [];
    // horizontal row attack
    const row = Math.floor(Math.random() * this.ctx.grid.rows);
    for (let c = 0; c < this.ctx.grid.cols; c++) {
      this.pressureZones.push({ col: c, row });
    }
  }

  tick(_tickCount: number): MechanicUpdate {
    this.tickCooldown();
    this.phaseTimer++;

    if (this.currentPhase === 'pressure') {
      if (this.phaseTimer > 20) {
        this.currentPhase = 'vulnerable';
        this.phaseTimer = 0;
        this.pressureZones = [];
      }
    } else {
      if (this.phaseTimer > 15) {
        this.currentPhase = 'pressure';
        this.phaseTimer = 0;
        this.spawnPressure();
      }
    }

    return {};
  }

  getExtraEntities(): ExtraEntity[] {
    const entities: ExtraEntity[] = [
      { type: 'crimeLord', cell: this.bossCell, state: this.currentPhase, data: { hp: this.hp } }
    ];
    for (const z of this.pressureZones) {
      entities.push({ type: 'pressureZone', cell: { col: z.col, row: z.row }, state: 'active' });
    }
    return entities;
  }

  getDangerCells(): DangerCell[] {
    return this.pressureZones.map(z => ({
      col: z.col,
      row: z.row,
      source: 'crimeLord',
      lethal: true,
    }));
  }

  getWeakPoints(): Cell[] {
    return this.currentPhase === 'vulnerable' ? [this.bossCell] : [];
  }

  onWeakPointHit(cell: Cell): BossHitResult {
    if (this.currentPhase !== 'vulnerable' || cell.col !== this.bossCell.col || cell.row !== this.bossCell.row) {
      return { hit: false, defeated: this.isDefeated() };
    }
    const result = super.onWeakPointHit(cell);
    if (result.hit && !result.defeated) {
      this.currentPhase = 'pressure';
      this.phaseTimer = 0;
      this.spawnPressure();
      const occ = new Set<string>(this.ctx.snake.body.map(c => cellKey(c)));
      const nextCell = this.grid.randomFreeCell(occ);
      if (nextCell) this.bossCell = nextCell;
    }
    return result;
  }
}
