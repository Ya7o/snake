import { BaseBoss, BossHitResult } from './BaseBoss';
import { DangerCell, ExtraEntity, MechanicUpdate } from '../BaseMechanic';
import { Cell } from '../../core/Grid';

// Turbo Rival: moves between 3 fixed lanes; turbo zone is the attack window
interface TurboZone { cell: Cell; ttl: number }

export class TurboRivalBoss extends BaseBoss {
  private rivalCell!: Cell;
  private rivalLane = 1; // 0=left 1=center 2=right
  private lanes: number[] = [];
  private moveTimer = 0;
  private turboZones: TurboZone[] = [];
  private turboTimer = 0;

  protected onInit(): void {
    const cols = this.ctx.grid.cols;
    // Three evenly-spaced lanes
    this.lanes = [
      Math.floor(cols / 4),
      Math.floor(cols / 2),
      Math.floor((3 * cols) / 4),
    ];
    this.rivalLane = 1;
    this.rivalCell = { col: this.lanes[this.rivalLane], row: 2 };
  }

  tick(_tickCount: number): MechanicUpdate {
    this.tickCooldown();
    this.moveTimer++;
    this.turboTimer++;

    // Move rival to an adjacent lane every 8 ticks
    if (this.moveTimer % 8 === 0) {
      const dir = Math.random() < 0.5 ? -1 : 1;
      this.rivalLane = Math.max(0, Math.min(2, this.rivalLane + dir));
      this.rivalCell = { col: this.lanes[this.rivalLane], row: this.rivalCell.row };
    }

    // Spawn turbo zone every 25 ticks — one row ahead (lower row index = towards top)
    if (this.turboTimer % 25 === 0) {
      const turboRow = Math.max(0, this.rivalCell.row - 1);
      this.turboZones.push({
        cell: { col: this.rivalCell.col, row: turboRow },
        ttl: 12,
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

  // Rival is always danger — entering its cell is lethal
  getDangerCells(): DangerCell[] {
    return [{ ...this.rivalCell, source: 'turboRival', lethal: true }];
  }

  // TurboZone is the weakpoint / attack window
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
    if (this.turboZones.length > 0) return 'FRAPPE MAINTENANT !';
    return 'ÉVITE';
  }
}
