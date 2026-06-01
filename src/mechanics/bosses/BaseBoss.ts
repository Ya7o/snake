import { Cell } from '../../core/Grid';
import { BaseMechanic, MechanicContext } from '../BaseMechanic';

export interface BossHitResult {
  hit: boolean;
  defeated: boolean;
}

export abstract class BaseBoss extends BaseMechanic {
  protected hp = 3;
  protected maxHp = 3;
  protected phase = 0;
  protected hitCooldown = 0;

  init(ctx: MechanicContext): void {
    const hp = Math.max(1, ctx.levelConfig.bossHp ?? 3);
    this.hp = hp;
    this.maxHp = hp;
    this.phase = 0;
    this.hitCooldown = 0;
    super.init(ctx);
  }

  getHp(): number { return this.hp; }
  getMaxHp(): number { return this.maxHp; }
  getPhase(): number { return this.phase; }
  isDefeated(): boolean { return this.hp <= 0; }

  getWeakPoints(): Cell[] {
    return [];
  }

  onWeakPointHit(_cell: Cell): BossHitResult {
    if (this.hitCooldown > 0 || this.isDefeated()) return { hit: false, defeated: this.isDefeated() };
    this.registerHit();
    return { hit: true, defeated: this.isDefeated() };
  }

  protected registerHit(): void {
    if (this.hitCooldown > 0) return;
    this.hp = Math.max(0, this.hp - 1);
    this.hitCooldown = 6; // invincibility frames
    if (this.hp > 0) {
      this.phase = this.maxHp - this.hp;
    }
  }

  protected tickCooldown(): void {
    if (this.hitCooldown > 0) this.hitCooldown--;
  }

  getHudExtra(): string {
    return '';
  }
}
