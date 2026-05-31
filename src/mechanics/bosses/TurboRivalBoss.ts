import { BaseBoss, BossHitResult } from './BaseBoss';
import { DangerCell, ExtraEntity, MechanicUpdate } from '../BaseMechanic';
import { Cell } from '../../core/Grid';

// Turbo Rival: rival car + fast obstacle cars screaming down the lanes
interface TurboZone { cell: Cell; ttl: number }
interface FastCar { col: number; row: number; timer: number }

export class TurboRivalBoss extends BaseBoss {
  private rivalCell!: Cell;
  private rivalLane = 1;
  private rivalRow = 3;
  private lanes: number[] = [];
  private moveTimer = 0;
  private turboZones: TurboZone[] = [];
  private turboTimer = 0;
  private fastCars: FastCar[] = [];
  private carSpawnTimer = 0;

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
    this.carSpawnTimer++;

    // Rival moves laterally every 6 ticks
    if (this.moveTimer % 6 === 0) {
      const dir = Math.random() < 0.5 ? -1 : 1;
      this.rivalLane = Math.max(0, Math.min(2, this.rivalLane + dir));
    }
    // Rival drifts vertically every 8 ticks
    if (this.moveTimer % 8 === 0) {
      const rows = this.ctx.grid.rows;
      const vdir = Math.random() < 0.5 ? -1 : 1;
      this.rivalRow = Math.max(2, Math.min(Math.floor(rows * 0.6), this.rivalRow + vdir));
    }
    this.rivalCell = { col: this.lanes[this.rivalLane], row: this.rivalRow };

    // Turbo zone (attack window) every 20 ticks
    if (this.turboTimer % 20 === 0) {
      this.turboZones.push({ cell: { col: this.rivalCell.col, row: this.rivalCell.row }, ttl: 18 });
    }
    for (const tz of this.turboZones) tz.ttl--;
    this.turboZones = this.turboZones.filter(tz => tz.ttl > 0);

    // Fast cars spawn every 5 ticks — one per random lane, starts at top, moves 2 cells/tick
    if (this.carSpawnTimer % 5 === 0) {
      const lane = Math.floor(Math.random() * this.lanes.length);
      this.fastCars.push({ col: this.lanes[lane], row: 0, timer: 0 });
    }
    // Move fast cars 2 cells every tick
    for (const car of this.fastCars) {
      car.row += 2;
    }
    this.fastCars = this.fastCars.filter(c => c.row < this.ctx.grid.rows);

    return {};
  }

  getExtraEntities(): ExtraEntity[] {
    const entities: ExtraEntity[] = [
      { type: 'turboRival', cell: this.rivalCell, state: this.turboZones.length > 0 ? 'active' : 'moving', data: { hp: this.hp } },
    ];
    for (const tz of this.turboZones) {
      entities.push({ type: 'turboZone', cell: tz.cell, state: 'active' });
    }
    for (const car of this.fastCars) {
      entities.push({ type: 'trafficBlock', cell: { col: car.col, row: car.row }, state: 'moving' });
    }
    return entities;
  }

  getDangerCells(): DangerCell[] {
    const cells: DangerCell[] = [{ ...this.rivalCell, source: 'turboRival', lethal: true }];
    for (const car of this.fastCars) {
      cells.push({ col: car.col, row: car.row, source: 'fastCar', lethal: true });
      // Also mark 1 cell behind (car body)
      if (car.row - 1 >= 0) cells.push({ col: car.col, row: car.row - 1, source: 'fastCar', lethal: true });
    }
    return cells;
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
