import { BaseMechanic } from '../BaseMechanic';

export abstract class BaseBoss extends BaseMechanic {
  protected hp = 3;
  protected maxHp = 3;
  protected phase = 0;
  protected hitCooldown = 0;

  getHp(): number { return this.hp; }
  getMaxHp(): number { return this.maxHp; }
  getPhase(): number { return this.phase; }
  isDefeated(): boolean { return this.hp <= 0; }

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
    return `HP ${'♥'.repeat(this.hp)}${'♡'.repeat(this.maxHp - this.hp)}`;
  }
}
