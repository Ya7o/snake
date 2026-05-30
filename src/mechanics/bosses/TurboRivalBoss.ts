import { BaseBoss, BossHitResult } from './BaseBoss';
import { DangerCell, ExtraEntity, MechanicUpdate } from '../BaseMechanic';
import { Cell } from '../../core/Grid';

// Turbo Rival: moves in lanes AND vertically; turbo zone is the attack window
interface TurboZone { cell: Cell; ttl: number }

export class TurboRivalBoss extends BaseBoss {
  private rivalCell!: Cell;
  private rivalLane = 1; // 0=left 1=center 2=right
  private rivalRow = 3;
  private lanes: number[] = [];
  private moveTimer = 0;
  private turboZones: TurboZone[] = [];
  private turboTimer = 0;

  protected onInit(): void {
    const cols = this.ctx.grid.cols;
    const rows = this.ctx.grid.rows;
    this.lanes = [
      Math.floor(cols / 4),
      Math.floor(cols / 2),
      Math.floor((3 * cols) / 4),
    ];
    this.rivalLane = 1;
    this.rivalRow = Math.floor(rows * 0.2);
    this.rivalCell = { col: this.lanes[this.rivalLane], row: this.rivalRow };
  }

  tick(_tickCount: number): MechanicUpdate {
    this.tickCooldown();
    this.moveTimer++;
    this.turboTimer++;

    // Move rival laterally every 6 ticks (was 8)
    if (this.moveTimer % 6 === 0) {
      const dir = Math.random() < 0.5 ? -1 : 1;
      this.rivalLane = Math.max(0, Math.min(2, this.rivalLane + dir));
    }
    // Move rival vertically every 10 ticks — keep in upper 60 % of the grid
    if (this.moveTimer % 10 === 0) {
      const rows = this.ctx.grid.rows;
      const vdir = Math.random() < 0.5 ? -1 : 1;
      this.rivalRow = Math.max(2, Math.min(Math.floor(rows * 0.6), this.rivalRow + vdir));
    }
    this.rivalCell = { col: this.lanes[this.rivalLane], row: this.rivalRow };

    // Spawn turbo zone every 20 ticks (was 25); zone appears AT the rival
    if (this.turboTimer % 20 === 0) {
      this.turboZones.push({
        cell: { col: this.rivalCell.col, row: this.rivalCell.row },
        ttl: 18, // was 12 — longer window to reach the rival
      });
    }
    for (const tz of this.turboZones) tz.ttl--;
    this.turboZones = this.turboZones.filter(tz => tz.ttl > 0);

    return {};
  }

  getExtraEntities(): ExtraEntity[] {
    const entities: ExtraEntity[] = [
      { type: 'turboRival', cell: this.rivalCell, state: 'moving', data: { hp: this.hp } },
    ];
    for (const tz of this.turboZones) {
      entities.push({ type: 'turboZone', cell: tz.cell, state: 'active' });
    }
    return entities;
  }

  getDangerCells(): DangerCell[] {
    return [{ ...this.rivalCell, source: 'turboRival', lethal: true }];
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

  getHudExtra(): string {
    if (this.turboZones.length > 0) return 'FRAPPE !';
    return 'RATTRAPE LE RIVAL';
  }
}
