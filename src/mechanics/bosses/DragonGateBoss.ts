import { BaseBoss, BossHitResult } from './BaseBoss';
import { DangerCell, ExtraEntity, MechanicUpdate } from '../BaseMechanic';
import { Cell } from '../../core/Grid';

// Dragon Gate: gate opens for a brief finish window; outside = danger zone
type GatePhase = 'closed' | 'opening' | 'open' | 'danger';
interface DangerZone { cell: Cell; ttl: number }

export class DragonGateBoss extends BaseBoss {
  private gateCell!: Cell;
  private gatePhase: GatePhase = 'closed';
  private phaseTimer = 0;
  private dangerZones: DangerZone[] = [];

  protected onInit(): void {
    this.gateCell = { col: Math.floor(this.ctx.grid.cols / 2), row: Math.floor(this.ctx.grid.rows / 2) };
  }

  tick(_tickCount: number): MechanicUpdate {
    this.tickCooldown();
    this.phaseTimer++;

    for (const dz of this.dangerZones) dz.ttl--;
    this.dangerZones = this.dangerZones.filter(dz => dz.ttl > 0);

    if (this.gatePhase === 'closed') {
      if (this.phaseTimer > 25) { this.gatePhase = 'opening'; this.phaseTimer = 0; }
    } else if (this.gatePhase === 'opening') {
      if (this.phaseTimer > 8) { this.gatePhase = 'open'; this.phaseTimer = 0; }
    } else if (this.gatePhase === 'open') {
      if (this.phaseTimer > 12) {
        this.gatePhase = 'danger';
        this.phaseTimer = 0;
        // Spawn danger zones around gate
        for (let dc = -1; dc <= 1; dc++) {
          for (let dr = -1; dr <= 1; dr++) {
            if (dc === 0 && dr === 0) continue;
            const cell: Cell = { col: this.gateCell.col + dc, row: this.gateCell.row + dr };
            if (cell.col >= 0 && cell.col < this.ctx.grid.cols && cell.row >= 0 && cell.row < this.ctx.grid.rows) {
              this.dangerZones.push({ cell, ttl: 8 });
            }
          }
        }
      }
    } else if (this.gatePhase === 'danger') {
      if (this.phaseTimer > 10) { this.gatePhase = 'closed'; this.phaseTimer = 0; }
    }

    return {};
  }

  getExtraEntities(): ExtraEntity[] {
    const entities: ExtraEntity[] = [
      { type: 'dragonGate', cell: this.gateCell, state: this.gatePhase, data: { hp: this.hp } }
    ];
    for (const dz of this.dangerZones) {
      entities.push({ type: 'dangerZone', cell: dz.cell, state: 'active' });
    }
    return entities;
  }

  getDangerCells(): DangerCell[] {
    return this.dangerZones.map(dz => ({ ...dz.cell, source: 'dragonGate', lethal: true }));
  }

  getWeakPoints(): Cell[] {
    return this.gatePhase === 'open' ? [this.gateCell] : [];
  }

  onWeakPointHit(cell: Cell): BossHitResult {
    if (this.gatePhase !== 'open' || cell.col !== this.gateCell.col || cell.row !== this.gateCell.row) {
      return { hit: false, defeated: this.isDefeated() };
    }
    const result = super.onWeakPointHit(cell);
    if (result.hit && !result.defeated) {
      this.gatePhase = 'closed';
      this.phaseTimer = 0;
      this.gateCell = {
        col: Math.floor(Math.random() * this.ctx.grid.cols),
        row: Math.floor(Math.random() * this.ctx.grid.rows)
      };
    }
    return result;
  }

  getHudExtra(): string {
    if (this.gatePhase === 'opening') return 'ATTENTION';
    if (this.gatePhase === 'open') return 'FENÊTRE';
    if (this.gatePhase === 'danger') return 'DANGER';
    return super.getHudExtra();
  }
}
