import Phaser from 'phaser';
import { Cell } from '../core/Grid';
import { GridLayout, cellToPixel } from './GridRenderer';
import { GAMEPLAY_LAYERS } from '../ui/RuntimeUILayout';

// Shape per universe — matches the game's theme
const UNIVERSE_SHAPES: Record<string, 'star' | 'ring' | 'diamond' | 'lightning' | 'triangle' | 'cross' | 'flame' | 'circle'> = {
  castle:   'star',
  sonic:    'ring',
  streets:  'diamond',
  fighter:  'lightning',
  outrun:   'triangle',
  shinobi:  'cross',
  kombat:   'flame',
  paperboy: 'circle',
};

type PickupImageProfile = Readonly<{
  maxSizeScale: number;
  offsetXCells?: number;
  offsetYCells?: number;
  haloScale?: number;
  ringScale?: number;
}>;

const DEFAULT_IMAGE_PROFILE: PickupImageProfile = {
  maxSizeScale: 1.9,
};

const PICKUP_IMAGE_PROFILES: Record<string, PickupImageProfile> = {
  // OutRun uses a smaller board and a tall checkpoint beacon, so it needs
  // extra draw room to read like an icon instead of a thin stripe.
  outrun: {
    maxSizeScale: 2.35,
    offsetYCells: -0.04,
    haloScale: 1.18,
    ringScale: 1.12,
  },
  // The shuriken PNG is optically top-left heavy after trimming stray pixels.
  // A tiny runtime offset keeps the icon seated in the halo on mobile.
  shinobi: {
    maxSizeScale: 2.05,
    offsetXCells: 0.02,
    offsetYCells: 0.04,
    haloScale: 1.08,
  },
};

export class PickupRenderer {
  private gfx: Phaser.GameObjects.Graphics;
  private scene: Phaser.Scene;
  private imagePool: Phaser.GameObjects.Image[] = [];
  private textureKey: string | null = null;
  private secondaryTextureKey: string | null = null;
  private blendMode: number = Phaser.BlendModes.NORMAL;
  private lastCellKeys = '';
  private universeId = '';
  private depth: number = GAMEPLAY_LAYERS.GAMEPLAY_OBJECTS + 2;
  private filteredKeys = new Set<string>();

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.gfx = scene.add.graphics();
    this.gfx.setDepth(this.depth);
  }

  setTextureKey(key: string): void {
    if (this.textureKey === key) return;
    this.textureKey = key;
    this.clearImagePool();
    this.lastCellKeys = '';
  }

  setImageBlendMode(mode: number): void {
    if (this.blendMode === mode) return;
    this.blendMode = mode;
    for (const img of this.imagePool) img.setBlendMode(mode);
  }

  /** 906 — secondary texture for alternate pickup types */
  setSecondaryTextureKey(key: string): void {
    this.secondaryTextureKey = key;
  }

  setUniverseId(uid: string): void {
    this.universeId = uid;
  }

  setDepth(depth: number): void {
    this.depth = depth;
    this.gfx.setDepth(depth);
    for (const img of this.imagePool) img.setDepth(depth);
  }

  draw(pickups: Cell[], layout: GridLayout, color: number, time: number): void {
    const cs = layout.cellSize;
    const key = this.textureKey;
    const useImages = !!(key && this.scene.textures.exists(key));
    const pulse = Math.sin(time / 400) * 0.5 + 0.5;
    const imageProfile = this.getImageProfile();
    this.gfx.clear(); // single clear per frame

    if (useImages) {
      const cellKeysNow = pickups.map(p => `${p.col},${p.row}`).join('|');
      if (cellKeysNow !== this.lastCellKeys) {
        this.syncImagePool(pickups.length);
        this.lastCellKeys = cellKeysNow;
      }
      // Halo under the image
      this.drawPickupHalo(pickups, layout, color, cs, pulse, imageProfile);

      const maxSize = cs * imageProfile.maxSizeScale;
      for (let i = 0; i < pickups.length; i++) {
        const { px, py } = cellToPixel(layout, pickups[i].col, pickups[i].row);
        const img = this.imagePool[i];
        const useSecondary = i % 2 === 1 && this.secondaryTextureKey && this.scene.textures.exists(this.secondaryTextureKey);
        const texKey = useSecondary ? this.secondaryTextureKey! : key!;
        if (img.texture.key !== texKey) img.setTexture(texKey);
        this.fitImageInCell(img, texKey, maxSize);
        img.setPosition(
          px + cs * (imageProfile.offsetXCells ?? 0),
          py + cs * (imageProfile.offsetYCells ?? 0),
        ).setAlpha(0.88 + 0.12 * pulse).setBlendMode(this.blendMode).setVisible(true);
      }
      for (let i = pickups.length; i < this.imagePool.length; i++) {
        this.imagePool[i].setVisible(false);
      }
    } else {
      this.hideAllImages();
      this.drawProcedural(pickups, layout, color, 1, cs);
    }
  }

  private drawProcedural(pickups: Cell[], layout: GridLayout, color: number, scale: number, cs: number): void {
    if (pickups.length === 0) return;

    const shape = UNIVERSE_SHAPES[this.universeId] ?? 'circle';

    for (const p of pickups) {
      const { px, py } = cellToPixel(layout, p.col, p.row);
      this.drawShape(px, py, cs, color, scale, shape);
    }
  }

  private drawPickupHalo(
    pickups: Cell[],
    layout: GridLayout,
    color: number,
    cs: number,
    pulse: number,
    profile: PickupImageProfile,
  ): void {
    if (pickups.length === 0) return;

    // Ambient bloom — very subtle, just suggests "collectible"
    const bloomAlpha = 0.10 + 0.05 * Math.max(0, pulse);
    // Tight inner glow — anchors the image without dominating
    const glowAlpha  = 0.22 + 0.08 * Math.max(0, pulse);
    const haloScale = profile.haloScale ?? 1;
    const ringScale = profile.ringScale ?? haloScale;
    for (const p of pickups) {
      const { px, py } = cellToPixel(layout, p.col, p.row);

      // Outer ambient bloom (barely visible, gives a soft colored floor)
      this.gfx.fillStyle(color, bloomAlpha);
      this.gfx.fillCircle(px, py, cs * (0.60 + 0.04 * pulse) * haloScale);

      // Inner glow — tight around the image
      this.gfx.fillStyle(color, glowAlpha);
      this.gfx.fillCircle(px, py, cs * (0.42 + 0.03 * pulse) * haloScale);

      // Thin white ring — minimal outline, separates gem from dark bg
      this.gfx.lineStyle(Math.max(1, Math.floor(cs * 0.07)), 0xffffff, 0.28 + 0.08 * Math.max(0, pulse));
      this.gfx.strokeCircle(px, py, cs * 0.46 * ringScale);
    }
  }

  private getImageProfile(): PickupImageProfile {
    return PICKUP_IMAGE_PROFILES[this.universeId] ?? DEFAULT_IMAGE_PROFILE;
  }

  private drawShape(px: number, py: number, cs: number, color: number, scale: number, shape: string): void {
    const r = cs * 0.39 * scale;
    const gfx = this.gfx;

    // Outer glow
    gfx.fillStyle(color, 0.2);
    gfx.fillCircle(px, py, r * 1.7);

    switch (shape) {
      case 'star': {
        // 4-point star (★)
        gfx.fillStyle(color, 1);
        this.drawStar(px, py, r * 1.1, r * 0.45, 5);
        gfx.fillStyle(0xffffff, 0.4);
        this.drawStar(px - r * 0.2, py - r * 0.2, r * 0.35, r * 0.15, 5);
        break;
      }
      case 'ring': {
        // Ring with hollow center
        gfx.lineStyle(Math.max(2, cs * 0.1), color, 1);
        gfx.strokeCircle(px, py, r);
        gfx.fillStyle(color, 0.3);
        gfx.fillCircle(px, py, r * 0.45);
        // Shine
        gfx.lineStyle(Math.max(1, cs * 0.06), 0xffffff, 0.6);
        gfx.beginPath();
        gfx.arc(px, py, r, -Math.PI * 0.7, -Math.PI * 0.2);
        gfx.strokePath();
        break;
      }
      case 'diamond': {
        // ◆ diamond
        gfx.fillStyle(color, 1);
        gfx.beginPath();
        gfx.moveTo(px,        py - r * 1.15);
        gfx.lineTo(px + r,    py);
        gfx.lineTo(px,        py + r * 1.15);
        gfx.lineTo(px - r,    py);
        gfx.closePath();
        gfx.fillPath();
        gfx.fillStyle(0xffffff, 0.35);
        gfx.beginPath();
        gfx.moveTo(px, py - r * 1.15);
        gfx.lineTo(px + r, py);
        gfx.lineTo(px, py);
        gfx.closePath();
        gfx.fillPath();
        break;
      }
      case 'lightning': {
        // ⚡ bolt
        gfx.fillStyle(color, 1);
        const lx = r * 0.5;
        gfx.beginPath();
        gfx.moveTo(px + lx,     py - r * 1.1);
        gfx.lineTo(px - lx * 0.3, py - r * 0.1);
        gfx.lineTo(px + lx * 0.4, py - r * 0.1);
        gfx.lineTo(px - lx,     py + r * 1.1);
        gfx.lineTo(px + lx * 0.3, py + r * 0.1);
        gfx.lineTo(px - lx * 0.4, py + r * 0.1);
        gfx.closePath();
        gfx.fillPath();
        break;
      }
      case 'triangle': {
        // ▲ arrow/triangle
        gfx.fillStyle(color, 1);
        gfx.beginPath();
        gfx.moveTo(px,       py - r * 1.2);
        gfx.lineTo(px + r,   py + r * 0.8);
        gfx.lineTo(px - r,   py + r * 0.8);
        gfx.closePath();
        gfx.fillPath();
        gfx.fillStyle(0xffffff, 0.3);
        gfx.beginPath();
        gfx.moveTo(px,       py - r * 1.2);
        gfx.lineTo(px + r,   py + r * 0.8);
        gfx.lineTo(px,       py);
        gfx.closePath();
        gfx.fillPath();
        break;
      }
      case 'cross': {
        // + / shuriken cross
        const arm = r * 0.38;
        gfx.fillStyle(color, 1);
        gfx.fillRect(px - arm, py - r, arm * 2, r * 2);
        gfx.fillRect(px - r, py - arm, r * 2, arm * 2);
        gfx.fillStyle(0xffffff, 0.25);
        gfx.fillCircle(px, py, r * 0.3);
        break;
      }
      case 'flame': {
        // Pentagon / flame shape (approximated with polygon)
        gfx.fillStyle(color, 1);
        const pts = 7;
        gfx.beginPath();
        for (let i = 0; i < pts; i++) {
          const a = (i / pts) * Math.PI * 2 - Math.PI / 2;
          const ir = i % 2 === 0 ? r * 1.1 : r * 0.65;
          const x2 = px + Math.cos(a) * ir;
          const y2 = py + Math.sin(a) * ir;
          if (i === 0) gfx.moveTo(x2, y2); else gfx.lineTo(x2, y2);
        }
        gfx.closePath();
        gfx.fillPath();
        gfx.fillStyle(0xffffff, 0.3);
        gfx.fillCircle(px - r * 0.2, py - r * 0.3, r * 0.28);
        break;
      }
      default: {
        // circle fallback
        gfx.fillStyle(color, 1);
        gfx.fillCircle(px, py, r);
        gfx.fillStyle(0xffffff, 0.45);
        gfx.fillCircle(px - r * 0.3, py - r * 0.3, r * 0.3);
      }
    }
  }

  // 5 or n-point star helper
  private drawStar(cx: number, cy: number, outerR: number, innerR: number, points: number): void {
    const gfx = this.gfx;
    gfx.beginPath();
    for (let i = 0; i < points * 2; i++) {
      const angle = (i * Math.PI) / points - Math.PI / 2;
      const r = i % 2 === 0 ? outerR : innerR;
      const x = cx + Math.cos(angle) * r;
      const y = cy + Math.sin(angle) * r;
      if (i === 0) gfx.moveTo(x, y); else gfx.lineTo(x, y);
    }
    gfx.closePath();
    gfx.fillPath();
  }

  private syncImagePool(count: number): void {
    while (this.imagePool.length < count) {
      const img = this.scene.add.image(0, 0, this.textureKey!)
        .setDepth(this.depth)
        .setBlendMode(this.blendMode)
        .setVisible(false);
      this.imagePool.push(img);
    }
  }

  private fitImageInCell(img: Phaser.GameObjects.Image, textureKey: string, maxSize: number): void {
    if (!this.filteredKeys.has(textureKey) && this.scene.textures.exists(textureKey)) {
      this.scene.textures.get(textureKey).setFilter(Phaser.Textures.FilterMode.LINEAR);
      this.filteredKeys.add(textureKey);
    }
    const frame = this.scene.textures.getFrame(textureKey);
    const fw = frame?.width ?? img.width;
    const fh = frame?.height ?? img.height;
    const ratio = fw > 0 && fh > 0 ? Math.min(maxSize / fw, maxSize / fh) : 1;
    img.setDisplaySize(fw * ratio, fh * ratio);
  }

  private hideAllImages(): void {
    for (const img of this.imagePool) img.setVisible(false);
  }

  private clearImagePool(): void {
    for (const img of this.imagePool) img.destroy();
    this.imagePool = [];
  }

  destroy(): void {
    this.clearImagePool();
    this.gfx.destroy();
  }
}
