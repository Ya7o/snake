import Phaser from 'phaser';
import { ExtraEntity } from '../mechanics/BaseMechanic';
import { GridLayout, cellToPixel } from './GridRenderer';

// Boss entity types — peuvent utiliser un asset image si disponible
const BOSS_ENTITY_TYPES = new Set([
  'witchMirror', 'loopSerpent', 'crimeLord', 'finalChallenger',
  'turboRival', 'shadowNinja', 'dragonGate', 'chaosObstacle'
]);

const ENTITY_COLORS: Record<string, Record<string, number>> = {
  blinkWall:      { ghost: 0x4a235a, warning: 0xf39c12, active: 0xe74c3c },
  chainRing:      { active: 0xf9ca24, inactive: 0x5d4e00 },
  crowdBlocker:   { static: 0xe67e22, moving: 0xff6b35 },
  sparZone:       { static: 0xc0392b },
  trafficBlock:   { moving: 0xff6b9d },
  focusTarget:    { real: 0x00b4d8, decoy: 0x666666 },
  fatalZone:      { warning: 0xf39c12, active: 0xe74c3c },
  deliveryTarget: { highlighted: 0xf1c40f, idle: 0x27ae60 },
  routeObstacle:  { static: 0x666666 },
  // Boss entities
  witchMirror:    { real: 0xf1c40f, fake: 0x9b59b6 },
  loopSerpent:    { orb: 0x00ff88, body: 0x00aa55 },
  crimeLord:      { pressure: 0xe74c3c, vulnerable: 0xf1c40f },
  pressureZone:   { active: 0xc0392b },
  finalChallenger:{ idle: 0xaaaaaa, attack_window: 0xf1c40f, counter: 0xe74c3c },
  counterZone:    { danger: 0xe74c3c },
  turboRival:     { moving: 0xff6b9d },
  turboZone:      { active: 0xffd32a },
  shadowNinja:    { real: 0x00b4d8, shadow: 0x333355 },
  dragonGate:     { closed: 0x444444, opening: 0xf39c12, open: 0xf1c40f, danger: 0xe74c3c },
  dangerZone:     { active: 0xc0392b },
  chaosObstacle:  { moving: 0xe67e22 },
  bossTarget:     { highlighted: 0xf1c40f, idle: 0x27ae60 },
};

export class ObstacleRenderer {
  private gfx: Phaser.GameObjects.Graphics;
  private scene: Phaser.Scene;
  private bossTextureKey: string | null = null;
  private bossImages: Map<string, Phaser.GameObjects.Image> = new Map();

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.gfx = scene.add.graphics();
    this.gfx.setDepth(1);
  }

  /** Appelé par GameScene si le boss texture est disponible */
  setBossTextureKey(key: string): void {
    if (this.bossTextureKey === key) return;
    this.bossTextureKey = key;
    this.clearBossImages();
  }

  draw(entities: ExtraEntity[], layout: GridLayout): void {
    this.gfx.clear();
    const cs = layout.cellSize;
    const pad = Math.max(1, Math.floor(cs * 0.08));

    const bossKey = this.bossTextureKey;
    const hasBossTexture = !!(bossKey && this.scene.textures.exists(bossKey));
    const seenBossIds = new Set<string>();

    for (const e of entities) {
      const { px, py } = cellToPixel(layout, e.cell.col, e.cell.row);
      const colorMap = ENTITY_COLORS[e.type];
      const color = colorMap ? (colorMap[e.state] ?? 0x888888) : 0x888888;
      const size = cs - pad * 2;

      const isBossType = BOSS_ENTITY_TYPES.has(e.type);
      if (isBossType && hasBossTexture) {
        // Rendu image pour boss — glow procédural + sprite
        this.gfx.fillStyle(color, 0.2);
        this.gfx.fillCircle(px, py, size * 0.7);
        const imgId = `${e.type}_${e.cell.col}_${e.cell.row}`;
        seenBossIds.add(imgId);
        let img = this.bossImages.get(imgId);
        if (!img) {
          img = this.scene.add.image(px, py, bossKey!).setDepth(1);
          this.bossImages.set(imgId, img);
        }
        img.setPosition(px, py).setScale(size / 48).setVisible(true);
      } else {
        this.drawEntity(e, px, py, size, color);
      }
    }

    // Masquer boss images qui ne sont plus actives
    for (const [id, img] of this.bossImages.entries()) {
      if (!seenBossIds.has(id)) img.setVisible(false);
    }
  }

  private clearBossImages(): void {
    for (const img of this.bossImages.values()) img.destroy();
    this.bossImages.clear();
  }

  private drawEntity(e: ExtraEntity, px: number, py: number, size: number, color: number): void {
    switch (e.type) {
      case 'blinkWall':
        this.gfx.fillStyle(color, e.state === 'ghost' ? 0.3 : e.state === 'warning' ? 0.7 : 1);
        this.gfx.fillRect(px - size / 2, py - size / 2, size, size);
        if (e.state === 'warning') {
          this.gfx.lineStyle(2, 0xf39c12, 0.8);
          this.gfx.strokeRect(px - size / 2 - 2, py - size / 2 - 2, size + 4, size + 4);
        }
        break;

      case 'chainRing':
        this.gfx.lineStyle(e.state === 'active' ? 3 : 1, color, e.state === 'active' ? 1 : 0.4);
        this.gfx.strokeCircle(px, py, size * 0.45);
        if (e.state === 'active') {
          this.gfx.fillStyle(color, 0.3);
          this.gfx.fillCircle(px, py, size * 0.3);
        }
        break;

      case 'focusTarget':
        this.gfx.fillStyle(color, e.state === 'decoy' ? 0.5 : 1);
        this.drawDiamond(px, py, size * 0.45);
        if (e.state === 'real') {
          this.gfx.lineStyle(2, 0xffffff, 0.6);
          this.drawDiamondStroke(px, py, size * 0.55);
        }
        break;

      case 'deliveryTarget':
      case 'bossTarget': {
        const s = size * 0.4;
        this.gfx.fillStyle(color, 0.8);
        this.gfx.fillRect(px - s, py - s, s * 2, s * 2);
        this.gfx.lineStyle(2, 0xffffff, 0.6);
        this.gfx.strokeRect(px - s, py - s, s * 2, s * 2);
        break;
      }

      case 'witchMirror':
      case 'shadowNinja':
      case 'finalChallenger':
      case 'crimeLord':
      case 'dragonGate':
      case 'turboRival': {
        // Boss entity — larger with border
        const hp = (e.data?.['hp'] as number) ?? 3;
        const alpha = 0.5 + 0.5 * (hp / 3);
        this.gfx.fillStyle(color, alpha);
        this.gfx.fillRoundedRect(px - size / 2, py - size / 2, size, size, 4);
        this.gfx.lineStyle(2, 0xffffff, 0.7);
        this.gfx.strokeRoundedRect(px - size / 2, py - size / 2, size, size, 4);
        break;
      }

      case 'loopSerpent':
        if (e.state === 'orb') {
          this.gfx.fillStyle(color, 1);
          this.gfx.fillCircle(px, py, size * 0.4);
          this.gfx.lineStyle(2, 0xffffff, 0.8);
          this.gfx.strokeCircle(px, py, size * 0.48);
        } else {
          this.gfx.fillStyle(color, 0.7);
          this.gfx.fillCircle(px, py, size * 0.3);
        }
        break;

      default:
        this.gfx.fillStyle(color, 0.8);
        this.gfx.fillRect(px - size / 2, py - size / 2, size, size);
    }
  }

  private drawDiamond(px: number, py: number, r: number): void {
    this.gfx.fillTriangle(px, py - r, px + r, py, px - r, py);
    this.gfx.fillTriangle(px, py + r, px + r, py, px - r, py);
  }

  private drawDiamondStroke(px: number, py: number, r: number): void {
    this.gfx.beginPath();
    this.gfx.moveTo(px, py - r);
    this.gfx.lineTo(px + r, py);
    this.gfx.lineTo(px, py + r);
    this.gfx.lineTo(px - r, py);
    this.gfx.closePath();
    this.gfx.strokePath();
  }

  destroy(): void {
    this.clearBossImages();
    this.gfx.destroy();
  }
}
