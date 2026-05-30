import { BaseBoss, BossHitResult } from './BaseBoss';
import { DangerCell, ExtraEntity, MechanicUpdate } from '../BaseMechanic';
import { Cell } from '../../core/Grid';

// Boss moves in a loop; hit the orb at the tail end
export class LoopSerpentBoss extends BaseBoss {
  private bossPath: Cell[] = [];
  private bossIndex = 0;
  private orbIndex = 0;  // vulnerable spot = last in body
  private moveTimer = 0;
  private moveInterval = 3;
  private bossBody: Cell[] = [];

  protected onInit(): void {
    this.buildLoop();
  }

  private buildLoop(): void {
    const cx = Math.floor(this.ctx.grid.cols / 2);
    const cy = Math.floor(this.ctx.grid.rows / 2);
    const r = 3 + this.phase;
    this.bossPath = [];
    // Circular-ish path
    for (let i = 0; i < 16; i++) {
      const angle = (i / 16) * Math.PI * 2;
      this.bossPath.push({
        col: Math.round(cx + r * Math.cos(angle)),
        row: Math.round(cy + r * Math.sin(angle))
      });
    }
    this.bossIndex = 0;
    this.bossBody = this.bossPath.slice(0, Math.min(5, this.bossPath.length));
  }

  tick(_tickCount: number): MechanicUpdate {
    this.tickCooldown();
    this.moveTimer++;

    if (this.moveTimer % this.moveInterval === 0) {
      this.bossIndex = (this.bossIndex + 1) % this.bossPath.length;
      this.bossBody.unshift(this.bossPath[this.bossIndex]);
      if (this.bossBody.length > 5) this.bossBody.pop();
    }

    return {};
  }

  getExtraEntities(): ExtraEntity[] {
    return this.bossBody.map((c, i) => ({
      type: 'loopSerpent',
      cell: c,
      state: i === this.bossBody.length - 1 ? 'orb' : 'body',
      data: { hp: this.hp }
    }));
  }

  getDangerCells(): DangerCell[] {
    return this.bossBody
      .slice(0, -1)
      .map(cell => ({ ...cell, source: 'loopSerpent', lethal: true }));
  }

  getWeakPoints(): Cell[] {
    const orb = this.bossBody[this.bossBody.length - 1];
    return orb ? [orb] : [];
  }

  onWeakPointHit(cell: Cell): BossHitResult {
    const orb = this.bossBody[this.bossBody.length - 1];
    if (!orb || orb.col !== cell.col || orb.row !== cell.row) {
      return { hit: false, defeated: this.isDefeated() };
    }
    const result = super.onWeakPointHit(cell);
    if (result.hit && !result.defeated) this.buildLoop();
    return result;
  }

  getHudExtra(): string {
    return 'FRAPPE LA QUEUE';
  }
}
