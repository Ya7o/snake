import { BaseBoss } from './BaseBoss';
import { ExtraEntity, MechanicUpdate } from '../BaseMechanic';
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

    const head = this.ctx.snake.body[0];

    if (this.currentPhase === 'pressure') {
      // Check pressure collision
      for (const z of this.pressureZones) {
        if (z.col === head.col && z.row === head.row) return { hitDanger: true };
      }
      if (this.phaseTimer > 20) {
        this.currentPhase = 'vulnerable';
        this.phaseTimer = 0;
        this.pressureZones = [];
      }
    } else {
      // Vulnerable — check hit on boss cell
      if (head.col === this.bossCell.col && head.row === this.bossCell.row) {
        this.registerHit();
        this.currentPhase = 'pressure';
        this.phaseTimer = 0;
        this.spawnPressure();
        // Move boss
        const occ = new Set<string>(this.ctx.snake.body.map(c => cellKey(c)));
        const cell = this.grid.randomFreeCell(occ);
        if (cell) this.bossCell = cell;
      }
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
}
