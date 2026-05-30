import { BaseBoss, BossHitResult } from './BaseBoss';
import { DangerCell, ExtraEntity, MechanicUpdate } from '../BaseMechanic';
import { Cell, cellKey } from '../../core/Grid';
import { Grid } from '../../core/Grid';

// Neighborhood Chaos: 3 waves of obstacles + delivery targets; complete deliveries per wave
interface MobileObstacle { cell: Cell; dir: { col: number; row: number }; speed: number; timer: number }
interface BossTarget { cell: Cell; active: boolean }

export class NeighborhoodChaosBoss extends BaseBoss {
  private wave = 0;
  private obstacles: MobileObstacle[] = [];
  private targets: BossTarget[] = [];
  private deliveredInWave = 0;
  private hasPaper = false;
  private grid!: Grid;
  private waveTimer = 0;

  protected onInit(): void {
    this.grid = new Grid(this.ctx.grid.cols, this.ctx.grid.rows);
    this.startWave();
  }

  private startWave(): void {
    this.obstacles = [];
    this.targets = [];
    this.deliveredInWave = 0;
    this.hasPaper = false;
    const waveObstacles = 3 + this.wave * 2; // 3, 5, 7 per wave
    const occ = new Set<string>(this.ctx.snake.body.map(c => cellKey(c)));
    const dirs = [{ col: 1, row: 0 }, { col: -1, row: 0 }, { col: 0, row: 1 }];
    for (let i = 0; i < waveObstacles; i++) {
      const cell = this.grid.randomFreeCell(occ);
      if (!cell) break;
      occ.add(cellKey(cell));
      this.obstacles.push({ cell, dir: dirs[i % dirs.length], speed: 3 + this.wave, timer: 0 });
    }
    // 2 delivery targets per wave
    for (let i = 0; i < 2; i++) {
      const cell = this.grid.randomFreeCell(occ);
      if (!cell) break;
      occ.add(cellKey(cell));
      this.targets.push({ cell, active: true });
    }
  }

  tick(_tickCount: number): MechanicUpdate {
    this.tickCooldown();
    this.waveTimer++;

    // Move obstacles
    for (const obs of this.obstacles) {
      obs.timer++;
      if (obs.timer % obs.speed === 0) {
        const nx = obs.cell.col + obs.dir.col;
        const ny = obs.cell.row + obs.dir.row;
        if (nx < 0 || nx >= this.ctx.grid.cols || ny < 0 || ny >= this.ctx.grid.rows) {
          obs.dir = { col: -obs.dir.col, row: -obs.dir.row };
        } else {
          obs.cell = { col: nx, row: ny };
        }
      }
    }

    return {};
  }

  onPickupCollected(_cell: Cell): MechanicUpdate {
    this.hasPaper = true;
    return {};
  }

  getExtraEntities(): ExtraEntity[] {
    const entities: ExtraEntity[] = [];
    for (const obs of this.obstacles) {
      entities.push({ type: 'chaosObstacle', cell: obs.cell, state: 'moving' });
    }
    for (const t of this.targets) {
      if (t.active) entities.push({ type: 'bossTarget', cell: t.cell, state: this.hasPaper ? 'highlighted' : 'idle', data: { wave: this.wave } });
    }
    return entities;
  }

  getDangerCells(): DangerCell[] {
    return this.obstacles.map(obs => ({ ...obs.cell, source: 'neighborhoodChaos', lethal: true }));
  }

  getWeakPoints(): Cell[] {
    return this.hasPaper ? this.targets.filter(t => t.active).map(t => t.cell) : [];
  }

  onWeakPointHit(cell: Cell): BossHitResult {
    const target = this.targets.find(t => t.active && t.cell.col === cell.col && t.cell.row === cell.row);
    if (!this.hasPaper || !target) return { hit: false, defeated: this.isDefeated() };
    target.active = false;
    this.hasPaper = false;
    this.deliveredInWave++;
    if (this.deliveredInWave < 2) {
      // After each delivery, spawn an extra obstacle (pressure escalates)
      this.addExtraObstacle();
      return { hit: true, defeated: this.isDefeated() };
    }
    const result = super.onWeakPointHit(cell);
    if (result.hit && !result.defeated) {
      this.wave = Math.min(2, this.wave + 1);
      this.startWave();
    }
    return result;
  }

  private addExtraObstacle(): void {
    const occ = new Set<string>(this.ctx.snake.body.map(c => cellKey(c)));
    for (const obs of this.obstacles) occ.add(cellKey(obs.cell));
    for (const t of this.targets) if (t.active) occ.add(cellKey(t.cell));
    const cell = this.grid.randomFreeCell(occ);
    if (cell) {
      const dirs = [{ col: 1, row: 0 }, { col: -1, row: 0 }, { col: 0, row: 1 }];
      this.obstacles.push({ cell, dir: dirs[Math.floor(Math.random() * dirs.length)], speed: 3 + this.wave, timer: 0 });
    }
  }

  getHudExtra(): string {
    if (this.hasPaper) return 'LIVRE';
    return `VAGUE ${this.wave + 1}/3`;
  }
}
