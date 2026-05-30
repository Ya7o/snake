import Phaser from 'phaser';
import { ExtraEntity } from '../mechanics/BaseMechanic';
import { GridLayout, cellToPixel } from './GridRenderer';
import { GAMEPLAY_LAYERS } from '../ui/RuntimeUILayout';

// Boss entity types — peuvent utiliser un asset image si disponible
const BOSS_ENTITY_TYPES = new Set([
  'witchMirror', 'loopSerpent', 'crimeLord', 'finalChallenger',
  'turboRival', 'shadowNinja', 'dragonGate', 'chaosObstacle'
]);

// Types d'obstacles physiques sans rendu spécifique — éligibles à l'image runtime obstacle
const OBSTACLE_IMAGE_TYPES = new Set([
  'blinkWall',
  'crowdBlocker', 'sparZone', 'trafficBlock', 'fatalZone',
  'pressureZone', 'counterZone', 'turboZone', 'dangerZone',
  'routeObstacle',
]);

const OPENMOJI_GAMEPLAY_ICON_SCALE = 1.9;
const DEFAULT_RUNTIME_OBSTACLE_ICON_SCALE = 1.70;
const DEFAULT_RUNTIME_BOSS_ICON_SCALE = 1.75;

const RUNTIME_OBSTACLE_ICON_SCALE_BY_TYPE: Record<string, number> = {
  trafficBlock: 1.75,
  routeObstacle: 1.70,
};

const RUNTIME_BOSS_ICON_SCALE_BY_TYPE: Record<string, number> = {
  crimeLord: 1.82,
  finalChallenger: 1.78,
  turboRival: 1.82,
  chaosObstacle: 1.60,
};

type EntityTextureResolver = (entity: ExtraEntity) => string | null;

const ENTITY_COLORS: Record<string, Record<string, number>> = {
  blinkWall:      { ghost: 0x4a235a, warning: 0xf39c12, active: 0xe74c3c },
  chainRing:      { active: 0xf9ca24, inactive: 0x5d4e00 },
  crowdBlocker:   { static: 0xe67e22, moving: 0xff6b35, warning: 0xf39c12, charging: 0xe74c3c, danger: 0xc0392b },
  sparZone:       { static: 0xc0392b },
  chargeGlow:     { ready: 0xf39c12 },
  trafficBlock:   { moving: 0xff6b9d },
  focusTarget:    { real: 0x00b4d8, decoy: 0x666666 },
  fatalZone:      { warning: 0xf39c12, active: 0xe74c3c },
  deliveryTarget: { highlighted: 0xf1c40f, idle: 0x27ae60 },
  routeObstacle:  { static: 0x666666 },
  // Boss entities
  witchMirror:    { idle: 0x6c5ce7, warning: 0xf39c12, attacking: 0xe74c3c, vulnerable: 0xf1c40f, hit: 0xffffff, defeated: 0x7cff9d, real: 0xf1c40f, fake: 0x9b59b6 },
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
  private bossBlendMode: number = Phaser.BlendModes.NORMAL;
  private obstacleTextureKey: string | null = null;
  private obstaclePool: Phaser.GameObjects.Image[] = [];
  private obstacleBlendMode: number = Phaser.BlendModes.NORMAL;
  private entityTextureResolver: EntityTextureResolver | null = null;
  private depth: number = GAMEPLAY_LAYERS.GAMEPLAY_OBJECTS;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.gfx = scene.add.graphics();
    this.gfx.setDepth(this.depth);
  }

  /** Appelé par GameScene si le boss texture est disponible */
  setBossTextureKey(key: string): void {
    if (this.bossTextureKey === key) return;
    this.bossTextureKey = key;
    this.clearBossImages();
  }

  setBossBlendMode(mode: number): void {
    this.bossBlendMode = mode;
    for (const img of this.bossImages.values()) img.setBlendMode(mode);
  }

  /** Appelé par GameScene si l'obstacle texture runtime est disponible */
  setObstacleTextureKey(key: string): void {
    if (this.obstacleTextureKey === key) return;
    this.obstacleTextureKey = key;
    this.clearObstaclePool();
  }

  setObstacleBlendMode(mode: number): void {
    this.obstacleBlendMode = mode;
    for (const img of this.obstaclePool) img.setBlendMode(mode);
  }

  setEntityTextureResolver(resolver: EntityTextureResolver | null): void {
    this.entityTextureResolver = resolver;
    this.clearObstaclePool();
  }

  setDepth(depth: number): void {
    this.depth = depth;
    this.gfx.setDepth(depth);
    for (const img of this.bossImages.values()) img.setDepth(depth + 1);
    for (const img of this.obstaclePool) img.setDepth(depth + 1);
  }

  draw(entities: ExtraEntity[], layout: GridLayout): void {
    this.gfx.clear();
    const cs = layout.cellSize;
    const pad = Math.max(1, Math.floor(cs * 0.08));

    const bossKey = this.bossTextureKey;
    const hasBossTexture = !!(bossKey && this.scene.textures.exists(bossKey));
    const seenBossIds = new Set<string>();

    const obstacleKey = this.obstacleTextureKey;
    const hasObstacleTexture = !!(obstacleKey && this.scene.textures.exists(obstacleKey));
    let obsPoolIdx = 0;

    for (const e of entities) {
      const { px, py } = cellToPixel(layout, e.cell.col, e.cell.row);
      const colorMap = ENTITY_COLORS[e.type];
      const color = colorMap ? (colorMap[e.state] ?? 0x888888) : 0x888888;
      const size = cs - pad * 2;
      const entityTextureKey = this.entityTextureResolver?.(e) ?? null;
      const hasEntityTexture = !!(entityTextureKey && this.scene.textures.exists(entityTextureKey));

      const isBossType = BOSS_ENTITY_TYPES.has(e.type);
      if (e.type === 'turboZone') {
        this.drawTurboZone(px, py, size, color);
      } else if (hasEntityTexture) {
        const alpha = this.entityAlpha(e);
        if (obsPoolIdx >= this.obstaclePool.length) {
          this.obstaclePool.push(
            this.scene.add.image(px, py, entityTextureKey!).setDepth(this.depth + 1).setBlendMode(this.obstacleBlendMode),
          );
        }
        const img = this.obstaclePool[obsPoolIdx];
        img.setTexture(entityTextureKey!).setPosition(px, py)
          .setDisplaySize(cs * OPENMOJI_GAMEPLAY_ICON_SCALE, cs * OPENMOJI_GAMEPLAY_ICON_SCALE)
          .setAlpha(e.type === 'witchMirror' ? this.witchMirrorAlpha(e.state) : alpha)
          .setVisible(true);
        obsPoolIdx++;
      } else if (isBossType && hasBossTexture) {
        // Rendu image pour boss — glow procédural + sprite
        this.drawBossTelegraph(e, px, py, size, color);
        const imgId = `${e.type}_${e.cell.col}_${e.cell.row}`;
        seenBossIds.add(imgId);
        let img = this.bossImages.get(imgId);
        if (!img) {
          img = this.scene.add.image(px, py, bossKey!).setDepth(this.depth + 1).setBlendMode(this.bossBlendMode);
          this.bossImages.set(imgId, img);
        }
        this.fitImageInCell(img, bossKey!, cs * this.bossIconScale(e));
        img.setPosition(px, py).setVisible(true);
        if (e.type === 'witchMirror') {
          img.setAlpha(this.witchMirrorAlpha(e.state));
        }
      } else if (!isBossType && OBSTACLE_IMAGE_TYPES.has(e.type) && hasObstacleTexture) {
        // Rendu image pour obstacles physiques — glow + sprite poolé
        const alpha = this.entityAlpha(e);
        this.gfx.fillStyle(color, e.type === 'blinkWall' ? 0.18 + alpha * 0.18 : 0.25);
        this.gfx.fillCircle(px, py, cs * 0.43);
        if (obsPoolIdx >= this.obstaclePool.length) {
          this.obstaclePool.push(
            this.scene.add.image(px, py, obstacleKey!).setDepth(this.depth + 1).setBlendMode(this.obstacleBlendMode),
          );
        }
        const img = this.obstaclePool[obsPoolIdx];
        img.setTexture(obstacleKey!).setPosition(px, py)
          .setAlpha(alpha).setVisible(true);
        this.fitImageInCell(img, obstacleKey!, cs * this.obstacleIconScale(e));
        if (e.type === 'blinkWall') {
          this.drawBlinkWallTelegraph(px, py, size, color, e.state);
        }
        obsPoolIdx++;
      } else {
        this.drawEntity(e, px, py, size, color);
      }
    }

    // Masquer boss images qui ne sont plus actives
    for (const [id, img] of this.bossImages.entries()) {
      if (!seenBossIds.has(id)) img.setVisible(false);
    }
    // Masquer les images obstacle inutilisées ce tick
    for (let i = obsPoolIdx; i < this.obstaclePool.length; i++) {
      this.obstaclePool[i].setVisible(false);
    }
  }

  private clearBossImages(): void {
    for (const img of this.bossImages.values()) img.destroy();
    this.bossImages.clear();
  }

  private fitImageInCell(img: Phaser.GameObjects.Image, textureKey: string, maxSize: number): void {
    const frame = this.scene.textures.getFrame(textureKey);
    const fw = frame?.width ?? img.width;
    const fh = frame?.height ?? img.height;
    const ratio = fw > 0 && fh > 0 ? Math.min(maxSize / fw, maxSize / fh) : 1;
    img.setDisplaySize(fw * ratio, fh * ratio);
  }

  private obstacleIconScale(e: ExtraEntity): number {
    return RUNTIME_OBSTACLE_ICON_SCALE_BY_TYPE[e.type] ?? DEFAULT_RUNTIME_OBSTACLE_ICON_SCALE;
  }

  private bossIconScale(e: ExtraEntity): number {
    return RUNTIME_BOSS_ICON_SCALE_BY_TYPE[e.type] ?? DEFAULT_RUNTIME_BOSS_ICON_SCALE;
  }

  private clearObstaclePool(): void {
    for (const img of this.obstaclePool) img.destroy();
    this.obstaclePool = [];
  }

  private drawEntity(e: ExtraEntity, px: number, py: number, size: number, color: number): void {
    switch (e.type) {
      case 'blinkWall':
        this.gfx.fillStyle(color, this.entityAlpha(e));
        this.gfx.fillRect(px - size / 2, py - size / 2, size, size);
        this.drawBlinkWallTelegraph(px, py, size, color, e.state);
        break;

      case 'chargeGlow':
        this.gfx.lineStyle(3, color, 0.85);
        this.gfx.strokeCircle(px, py, size * 0.6);
        this.gfx.lineStyle(1, color, 0.35);
        this.gfx.strokeCircle(px, py, size * 0.78);
        break;

      case 'chainRing':
        this.drawChainRing(px, py, size, color, e.state);
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
        const maxHp = (e.data?.['maxHp'] as number) ?? 3;
        const alpha = e.type === 'witchMirror' ? this.witchMirrorAlpha(e.state) : 0.5 + 0.5 * (hp / maxHp);
        this.gfx.fillStyle(color, alpha);
        this.gfx.fillRoundedRect(px - size / 2, py - size / 2, size, size, 4);
        this.gfx.lineStyle(e.state === 'vulnerable' ? 3 : 2, e.state === 'attacking' ? 0x2b0000 : 0xffffff, 0.7);
        this.gfx.strokeRoundedRect(px - size / 2, py - size / 2, size, size, 4);
        if (e.type === 'witchMirror') this.drawWitchMirrorSymbol(px, py, size, e.state);
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

  private drawTurboZone(px: number, py: number, size: number, color: number): void {
    const pulse = Math.sin(this.scene.time.now / 120) * 0.5 + 0.5;
    const half = size / 2;
    const outer = size * (0.72 + pulse * 0.07);
    const inner = size * 0.44;

    this.gfx.fillStyle(0x18f7ff, 0.12 + pulse * 0.06);
    this.gfx.fillCircle(px, py, outer);
    this.gfx.fillStyle(color, 0.28 + pulse * 0.12);
    this.gfx.fillRoundedRect(px - half, py - half, size, size, 5);

    this.gfx.lineStyle(4, 0xffffff, 0.82);
    this.gfx.strokeRoundedRect(px - half - 1, py - half - 1, size + 2, size + 2, 5);
    this.gfx.lineStyle(2, 0x18f7ff, 0.9);
    this.gfx.strokeCircle(px, py, inner);

    const arrowY = py - size * 0.04;
    const arrowW = size * 0.24;
    const arrowH = size * 0.22;
    this.gfx.lineStyle(3, 0xffffff, 0.92);
    this.gfx.lineBetween(px - arrowW, arrowY + arrowH, px, arrowY);
    this.gfx.lineBetween(px, arrowY, px + arrowW, arrowY + arrowH);
    this.gfx.lineStyle(2, 0x060d18, 0.58);
    this.gfx.strokeCircle(px, py, size * 0.16);
  }

  private entityAlpha(e: ExtraEntity): number {
    if (e.type !== 'blinkWall') return 0.88;
    if (e.state === 'ghost') return 0.24;
    if (e.state === 'warning') return 0.62;
    return 1;
  }

  private drawChainRing(px: number, py: number, size: number, color: number, state: string): void {
    const active = state === 'active';
    const r = size * (active ? 0.48 : 0.43);
    this.gfx.fillStyle(color, active ? 0.22 : 0.12);
    this.gfx.fillCircle(px, py, size * (active ? 0.64 : 0.50));
    this.gfx.lineStyle(active ? 4 : 2, color, active ? 1 : 0.72);
    this.gfx.strokeCircle(px, py, r);
    this.gfx.lineStyle(1, 0xffffff, active ? 0.78 : 0.42);
    this.gfx.strokeCircle(px, py, r * 0.72);
    if (active) {
      this.gfx.fillStyle(color, 0.26);
      this.gfx.fillCircle(px, py, size * 0.24);
    }
  }

  private drawBlinkWallTelegraph(px: number, py: number, size: number, color: number, state: string): void {
    const half = size / 2;
    const strokeColor = state === 'active' ? 0xe74c3c : state === 'warning' ? 0xf39c12 : color;
    const alpha = state === 'ghost' ? 0.32 : state === 'warning' ? 0.95 : 1;
    this.gfx.lineStyle(state === 'active' ? 4 : state === 'warning' ? 3 : 1, strokeColor, alpha);
    this.gfx.strokeRect(px - half - 1, py - half - 1, size + 2, size + 2);
    if (state === 'warning') {
      this.gfx.lineStyle(2, 0xffffff, 0.72);
      this.gfx.strokeRect(px - half + 3, py - half + 3, size - 6, size - 6);
      this.gfx.lineStyle(2, 0xffffff, 0.62);
      this.gfx.lineBetween(px - half * 0.6, py, px + half * 0.6, py);
      this.gfx.lineBetween(px, py - half * 0.6, px, py + half * 0.6);
    } else if (state === 'active') {
      this.gfx.fillStyle(0x2b0000, 0.22);
      this.gfx.fillCircle(px, py, size * 0.46);
      this.gfx.lineStyle(3, 0xffffff, 0.35);
      this.gfx.lineBetween(px - half * 0.65, py - half * 0.65, px + half * 0.65, py + half * 0.65);
      this.gfx.lineBetween(px + half * 0.65, py - half * 0.65, px - half * 0.65, py + half * 0.65);
    }
  }

  private drawBossTelegraph(e: ExtraEntity, px: number, py: number, size: number, color: number): void {
    const alpha = e.type === 'witchMirror' ? this.witchMirrorAlpha(e.state) : 0.2;
    this.gfx.fillStyle(color, alpha * (e.state === 'vulnerable' ? 0.72 : 0.55));
    this.gfx.fillCircle(px, py, size * (e.state === 'vulnerable' ? 0.82 : 0.72));
    if (e.type === 'witchMirror') {
      this.gfx.lineStyle(e.state === 'vulnerable' ? 4 : 2, e.state === 'vulnerable' ? 0xffffff : color, Math.min(1, alpha + 0.2));
      this.gfx.strokeCircle(px, py, size * 0.52);
      this.drawWitchMirrorSymbol(px, py, size, e.state);
    }
  }

  private witchMirrorAlpha(state: string): number {
    if (state === 'idle') return 0.28;
    if (state === 'warning') return 0.72;
    if (state === 'attacking') return 0.95;
    if (state === 'vulnerable') return 1;
    if (state === 'hit') return 1;
    return 0.5;
  }

  private drawWitchMirrorSymbol(px: number, py: number, size: number, state: string): void {
    const half = size * 0.35;
    if (state === 'warning' || state === 'attacking') {
      this.gfx.lineStyle(2, state === 'attacking' ? 0x2b0000 : 0xffffff, state === 'attacking' ? 0.9 : 0.58);
      this.gfx.lineBetween(px - half, py - half, px + half, py + half);
      this.gfx.lineBetween(px + half, py - half, px - half, py + half);
    } else if (state === 'vulnerable' || state === 'hit') {
      this.gfx.lineStyle(state === 'hit' ? 4 : 3, 0xffffff, 0.98);
      this.drawDiamondStroke(px, py, size * 0.38);
      this.gfx.lineStyle(2, 0xf1c40f, 0.9);
      this.drawDiamondStroke(px, py, size * 0.50);
      this.gfx.fillStyle(state === 'hit' ? 0xffffff : 0xf1c40f, state === 'hit' ? 0.9 : 0.72);
      this.gfx.fillCircle(px, py, size * (state === 'hit' ? 0.16 : 0.12));
      if (state === 'vulnerable') {
        this.gfx.lineStyle(2, 0xffffff, 0.82);
        this.gfx.lineBetween(px, py - size * 0.72, px - size * 0.16, py - size * 0.52);
        this.gfx.lineBetween(px, py - size * 0.72, px + size * 0.16, py - size * 0.52);
      }
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
    this.clearObstaclePool();
    this.gfx.destroy();
  }
}
