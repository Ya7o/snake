import { BaseBoss } from './BaseBoss';
import { ExtraEntity, MechanicUpdate } from '../BaseMechanic';
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
    const waveObstacles = 2 + this.wave;
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
    const head = this.ctx.snake.body[0];
    let hitDanger = false;

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
      if (obs.cell.col === head.col && obs.cell.row === head.row) hitDanger = true;
    }

    // Delivery check
    if (this.hasPaper) {
      for (const t of this.targets) {
        if (t.active && t.cell.col === head.col && t.cell.row === head.row) {
          t.active = false;
          this.hasPaper = false;
          this.deliveredInWave++;
          if (this.deliveredInWave >= 2) {
            this.registerHit();
            this.wave = Math.min(2, this.wave + 1);
            if (!this.isDefeated()) this.startWave();
          }
          break;
        }
      }
    }

    return { hitDanger };
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

  getHudExtra(): string {
    return `${super.getHudExtra()} V${this.wave + 1}`;
  }
}
