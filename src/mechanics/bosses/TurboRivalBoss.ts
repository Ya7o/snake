import { BaseBoss } from './BaseBoss';
import { ExtraEntity, MechanicUpdate } from '../BaseMechanic';
import { Cell } from '../../core/Grid';

// Turbo Rival: rival moves on lanes; turbo zone appears — enter to hit
interface TurboZone { cell: Cell; ttl: number }

export class TurboRivalBoss extends BaseBoss {
  private rivalCell!: Cell;
  private rivalLane = 0;
  private moveTimer = 0;
  private turboZones: TurboZone[] = [];
  private turboTimer = 0;

  protected onInit(): void {
    this.rivalLane = 1;
    this.rivalCell = { col: Math.floor(this.ctx.grid.cols / 2), row: 2 };
  }

  tick(_tickCount: number): MechanicUpdate {
    this.tickCooldown();
    this.moveTimer++;
    this.turboTimer++;

    // Move rival horizontally
    if (this.moveTimer % 5 === 0) {
      const step = Math.random() < 0.5 ? -1 : 1;
      const newCol = Math.max(0, Math.min(this.ctx.grid.cols - 1, this.rivalCell.col + step));
      this.rivalCell = { col: newCol, row: this.rivalCell.row };
    }

    // Spawn turbo zone every 25 ticks
    if (this.turboTimer % 25 === 0) {
      this.turboZones.push({
        cell: { col: this.rivalCell.col, row: this.rivalCell.row + 1 },
        ttl: 10
      });
    }
    for (const tz of this.turboZones) tz.ttl--;
    this.turboZones = this.turboZones.filter(tz => tz.ttl > 0);

    const head = this.ctx.snake.body[0];

    // Check turbo hit
    for (const tz of this.turboZones) {
      if (tz.cell.col === head.col && tz.cell.row === head.row) {
        // turbo entered — check if on rival
        if (head.col === this.rivalCell.col && head.row === this.rivalCell.row - 1) {
          this.registerHit();
          this.turboZones = [];
        }
      }
    }

    // Direct rival collision = danger
    if (head.col === this.rivalCell.col && head.row === this.rivalCell.row) {
      const inTurbo = this.turboZones.some(tz => tz.cell.col === head.col && tz.cell.row === head.row + 1);
      if (!inTurbo) return { hitDanger: true };
      else {
        this.registerHit();
        this.turboZones = [];
      }
    }

    return {};
  }

  getExtraEntities(): ExtraEntity[] {
    const entities: ExtraEntity[] = [
      { type: 'turboRival', cell: this.rivalCell, state: 'moving', data: { hp: this.hp } }
    ];
    for (const tz of this.turboZones) {
      entities.push({ type: 'turboZone', cell: tz.cell, state: 'active' });
    }
    return entities;
  }
}
