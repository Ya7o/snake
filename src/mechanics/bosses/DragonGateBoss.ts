import { BaseBoss, BossHitResult } from './BaseBoss';
import { DangerCell, ExtraEntity, MechanicUpdate } from '../BaseMechanic';
import { Cell } from '../../core/Grid';

// Dragon Gate: gate charges → big danger zone → brief vulnerable window for player
// New sequence: closed → opening → danger(attack) → vulnerable(hit window) → closed
type GatePhase = 'closed' | 'opening' | 'danger' | 'vulnerable';
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
      if (this.phaseTimer > 10) { this.gatePhase = 'opening'; this.phaseTimer = 0; }
    } else if (this.gatePhase === 'opening') {
      if (this.phaseTimer > 4) {
        this.gatePhase = 'danger';
        this.phaseTimer = 0;
        // Big circular danger zone — radius triples with phase loss
        const radius = 2 + this.phase;
        for (let dc = -radius; dc <= radius; dc++) {
          for (let dr = -radius; dr <= radius; dr++) {
            if (dc === 0 && dr === 0) continue;
            if (dc * dc + dr * dr > radius * radius + 0.5) continue;
            const cell: Cell = { col: this.gateCell.col + dc, row: this.gateCell.row + dr };
            if (cell.col >= 0 && cell.col < this.ctx.grid.cols && cell.row >= 0 && cell.row < this.ctx.grid.rows) {
              this.dangerZones.push({ cell, ttl: 8 });
            }
          }
        }
      }
    } else if (this.gatePhase === 'danger') {
      if (this.phaseTimer > 8) {
        // After attack, gate becomes vulnerable — hit window for player
        this.gatePhase = 'vulnerable';
        this.phaseTimer = 0;
        this.dangerZones = [];
      }
    } else if (this.gatePhase === 'vulnerable') {
      if (this.phaseTimer > 8) { this.gatePhase = 'closed'; this.phaseTimer = 0; }
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
    return this.gatePhase === 'vulnerable' ? [this.gateCell] : [];
  }

  onWeakPointHit(cell: Cell): BossHitResult {
    if (this.gatePhase !== 'vulnerable' || cell.col !== this.gateCell.col || cell.row !== this.gateCell.row) {
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
    if (this.gatePhase === 'danger') return 'DANGER';
    if (this.gatePhase === 'vulnerable') return 'ATTAQUE !';
    return super.getHudExtra();
  }
}
