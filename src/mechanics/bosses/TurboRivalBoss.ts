import { BaseBoss, BossHitResult } from './BaseBoss';
import { DangerCell, ExtraEntity, MechanicUpdate } from '../BaseMechanic';
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

  getDangerCells(): DangerCell[] {
    const inTurbo = this.turboZones.some(tz => tz.cell.col === this.rivalCell.col && tz.cell.row === this.rivalCell.row + 1);
    return inTurbo ? [] : [{ ...this.rivalCell, source: 'turboRival', lethal: true }];
  }

  getWeakPoints(): Cell[] {
    return this.turboZones.map(tz => tz.cell);
  }

  onWeakPointHit(cell: Cell): BossHitResult {
    const turboZone = this.turboZones.find(tz => tz.cell.col === cell.col && tz.cell.row === cell.row);
    if (!turboZone) return { hit: false, defeated: this.isDefeated() };
    const result = super.onWeakPointHit(cell);
    if (result.hit) this.turboZones = [];
    return result;
  }
}
