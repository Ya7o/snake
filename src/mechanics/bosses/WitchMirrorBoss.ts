import { BaseBoss, BossHitResult } from './BaseBoss';
import { DangerCell, EntityState, ExtraEntity, MechanicUpdate } from '../BaseMechanic';
import { Cell, cellKey } from '../../core/Grid';
import { Grid } from '../../core/Grid';

type WitchMirrorState = 'idle' | 'moving' | 'warning' | 'attacking' | 'vulnerable' | 'hit' | 'defeated';

interface Mirror { cell: Cell; real: boolean }

export const WITCH_MIRROR_TUNING = {
  idleTicks: 8,
  movingTicks: 4,
  warningTicks: 10,
  attackingTicks: 10,
  vulnerableTicks: 18,
  hitTicks: 6,
} as const;

const STATE_DURATIONS: Record<WitchMirrorState, number> = {
  idle: WITCH_MIRROR_TUNING.idleTicks,
  moving: WITCH_MIRROR_TUNING.movingTicks,
  warning: WITCH_MIRROR_TUNING.warningTicks,
  attacking: WITCH_MIRROR_TUNING.attackingTicks,
  vulnerable: WITCH_MIRROR_TUNING.vulnerableTicks,
  hit: WITCH_MIRROR_TUNING.hitTicks,
  defeated: 999,
};

export class WitchMirrorBoss extends BaseBoss {
  private mirrors: Mirror[] = [];
  private grid!: Grid;
  private state: WitchMirrorState = 'idle';
  private stateTicksLeft = STATE_DURATIONS.idle;

  protected onInit(): void {
    this.grid = new Grid(this.ctx.grid.cols, this.ctx.grid.rows);
    this.state = 'idle';
    this.stateTicksLeft = STATE_DURATIONS.idle;
    this.spawnMirrors();
  }

  private spawnMirrors(): void {
    this.mirrors = [];
    const occupied = new Set<string>(this.ctx.snake.body.map(c => cellKey(c)));
    const count = 2 + this.phase;
    const realIndex = Math.floor(Math.random() * count);
    for (let i = 0; i < count; i++) {
      const cell = this.grid.randomFreeCell(occupied);
      if (!cell) break;
      occupied.add(cellKey(cell));
      this.mirrors.push({ cell, real: i === realIndex });
    }
  }

  tick(_tickCount: number): MechanicUpdate {
    this.tickCooldown();
    if (this.isDefeated()) {
      this.state = 'defeated';
      return {};
    }

    this.stateTicksLeft--;
    if (this.stateTicksLeft <= 0) {
      this.advanceState();
    }

    return {};
  }

  getExtraEntities(): ExtraEntity[] {
    return this.mirrors.map(m => ({
      type: 'witchMirror',
      cell: m.cell,
      state: this.entityState(m),
      data: { hp: this.hp, maxHp: this.maxHp, real: m.real }
    }));
  }

  getDangerCells(): DangerCell[] {
    if (this.state !== 'attacking') return [];
    return this.mirrors
      .filter(m => !m.real)
      .map(m => ({ ...m.cell, source: 'witchMirror', lethal: true }));
  }

  getWeakPoints(): Cell[] {
    if (this.state !== 'vulnerable') return [];
    return this.mirrors.filter(m => m.real).map(m => m.cell);
  }

  onWeakPointHit(cell: Cell): BossHitResult {
    const mirror = this.mirrors.find(m => m.real && m.cell.col === cell.col && m.cell.row === cell.row);
    if (!mirror || this.state !== 'vulnerable') return { hit: false, defeated: this.isDefeated() };
    const result = super.onWeakPointHit(cell);
    if (result.hit) {
      this.state = result.defeated ? 'defeated' : 'hit';
      this.stateTicksLeft = STATE_DURATIONS[this.state];
      if (!result.defeated) this.spawnMirrors();
    }
    return result;
  }

  getHudExtra(): string {
    if (this.state === 'warning') return 'ATTENTION';
    if (this.state === 'attacking') return 'DANGER';
    if (this.state === 'vulnerable') return 'FRAPPE';
    if (this.state === 'hit') return 'TOUCHÉ !';
    return 'PV BOSS';
  }

  private advanceState(): void {
    if (this.state === 'idle') {
      this.state = 'warning';
    } else if (this.state === 'warning') {
      this.state = 'attacking';
    } else if (this.state === 'attacking') {
      this.state = 'vulnerable';
    } else if (this.state === 'moving') {
      this.state = 'idle';
    } else {
      this.state = 'moving';
      this.spawnMirrors();
    }
    this.stateTicksLeft = STATE_DURATIONS[this.state];
  }

  private entityState(mirror: Mirror): EntityState {
    if (this.state === 'defeated') return 'defeated';
    if (this.state === 'hit') return mirror.real ? 'hit' : 'idle';
    if (this.state === 'vulnerable') return mirror.real ? 'vulnerable' : 'idle';
    if (this.state === 'warning') return mirror.real ? 'idle' : 'warning';
    if (this.state === 'attacking') return mirror.real ? 'idle' : 'attacking';
    return 'idle';
  }
}
