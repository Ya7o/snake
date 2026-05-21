import Phaser from 'phaser';
import { UNIVERSE_FRAME_ASSETS } from '../config/constants';
import { UniverseId } from '../config/types';
import { UNIVERSES } from '../config/universes';

export interface UniverseFrameRenderParams {
  universeId: UniverseId;
  gridBounds: Phaser.Geom.Rectangle;
  depth: number;
}

type FramePart =
  | Phaser.GameObjects.TileSprite
  | Phaser.GameObjects.Image
  | Phaser.GameObjects.Graphics;

const FULL_FRAME_INNER_RECT = { x: 156 / 941, y: 252 / 1672, w: 628 / 941, h: 1104 / 1672 };

export class UniverseFrameRenderer {
  private parts: FramePart[] = [];
  private currentUniverseId: UniverseId | null = null;
  private currentKey: string | null = null;
  private currentMode: 'full' | 'tile' | 'fallback' | null = null;

  constructor(private scene: Phaser.Scene) {}

  render(params: UniverseFrameRenderParams): void {
    const asset = UNIVERSE_FRAME_ASSETS[params.universeId];
    const key = this.scene.textures.exists(asset.key) ? asset.key : null;

    const mode = key && this.shouldUseFullFrame(params.universeId, key) ? 'full' : key ? 'tile' : 'fallback';

    if (this.currentUniverseId !== params.universeId || this.currentKey !== key || this.currentMode !== mode) {
      this.destroyParts();
      this.currentUniverseId = params.universeId;
      this.currentKey = key;
      this.currentMode = mode;
      if (key && mode === 'full') this.createFullFrame(params, key);
      else if (key) this.createTexturedFrame(params, key);
      else this.createFallbackFrame(params);
    }

    this.resize(params.gridBounds, params.depth);
  }

  resize(gridBounds: Phaser.Geom.Rectangle, depth = 1): void {
    if (!this.currentUniverseId) return;
    if (this.currentMode === 'full') {
      this.resizeFullFrame(gridBounds, depth);
      return;
    }

    const edge = Math.max(10, Math.min(18, Math.floor(gridBounds.width * 0.04)));
    const gap = this.frameGap(gridBounds);
    const outer = new Phaser.Geom.Rectangle(
      gridBounds.x - edge - gap,
      gridBounds.y - edge - gap,
      gridBounds.width + (edge + gap) * 2,
      gridBounds.height + (edge + gap) * 2,
    );

    const [top, bottom, left, right, tl, tr, bl, br, fallback] = this.parts;
    if (top instanceof Phaser.GameObjects.TileSprite) {
      top.setPosition(outer.centerX, outer.y + edge / 2).setSize(outer.width, edge).setDepth(depth);
    }
    if (bottom instanceof Phaser.GameObjects.TileSprite) {
      bottom.setPosition(outer.centerX, outer.bottom - edge / 2).setSize(outer.width, edge).setDepth(depth);
    }
    if (left instanceof Phaser.GameObjects.TileSprite) {
      left.setPosition(outer.x + edge / 2, outer.centerY).setSize(edge, outer.height).setDepth(depth);
    }
    if (right instanceof Phaser.GameObjects.TileSprite) {
      right.setPosition(outer.right - edge / 2, outer.centerY).setSize(edge, outer.height).setDepth(depth);
    }

    const corners: Array<[FramePart | undefined, number, number, number]> = [
      [tl, outer.x + edge / 2, outer.y + edge / 2, 0],
      [tr, outer.right - edge / 2, outer.y + edge / 2, 90],
      [bl, outer.x + edge / 2, outer.bottom - edge / 2, -90],
      [br, outer.right - edge / 2, outer.bottom - edge / 2, 180],
    ];
    for (const [part, x, y, angle] of corners) {
      if (part instanceof Phaser.GameObjects.Image) {
        part.setPosition(x, y).setDisplaySize(edge * 1.45, edge * 1.45).setAngle(angle).setDepth(depth + 0.1);
      }
    }

    if (fallback instanceof Phaser.GameObjects.Graphics) {
      this.drawFallback(fallback, gridBounds, depth);
    }
  }

  destroy(): void {
    this.destroyParts();
  }

  private createTexturedFrame(params: UniverseFrameRenderParams, key: string): void {
    const alpha = 0.72;
    const top = this.scene.add.tileSprite(0, 0, 1, 1, key).setAlpha(alpha);
    const bottom = this.scene.add.tileSprite(0, 0, 1, 1, key).setAlpha(alpha).setFlipY(true);
    const left = this.scene.add.tileSprite(0, 0, 1, 1, key).setAlpha(alpha).setAngle(90);
    const right = this.scene.add.tileSprite(0, 0, 1, 1, key).setAlpha(alpha).setAngle(90).setFlipY(true);
    const tl = this.scene.add.image(0, 0, key).setAlpha(0.9);
    const tr = this.scene.add.image(0, 0, key).setAlpha(0.9);
    const bl = this.scene.add.image(0, 0, key).setAlpha(0.9);
    const br = this.scene.add.image(0, 0, key).setAlpha(0.9);
    this.parts = [top, bottom, left, right, tl, tr, bl, br];
    this.resize(params.gridBounds, params.depth);
  }

  private createFullFrame(params: UniverseFrameRenderParams, key: string): void {
    this.scene.textures.get(key).setFilter(Phaser.Textures.FilterMode.NEAREST);
    const frame = this.scene.add.image(0, 0, key)
      .setAlpha(0.98)
      .setOrigin(0.5);
    this.parts = [frame];
    this.resize(params.gridBounds, params.depth);
  }

  private createFallbackFrame(params: UniverseFrameRenderParams): void {
    const gfx = this.scene.add.graphics();
    this.parts = [gfx];
    this.resize(params.gridBounds, params.depth);
  }

  private drawFallback(gfx: Phaser.GameObjects.Graphics, gridBounds: Phaser.Geom.Rectangle, depth: number): void {
    if (!this.currentUniverseId) return;
    const universe = UNIVERSES[this.currentUniverseId];
    const primary = parseInt(universe.palette.primary.replace('#', ''), 16);
    const accent = parseInt(universe.palette.accent.replace('#', ''), 16);
    const gap = this.frameGap(gridBounds);
    gfx.clear().setDepth(depth);
    gfx.lineStyle(4, primary, 0.58);
    gfx.strokeRect(gridBounds.x - gap, gridBounds.y - gap, gridBounds.width + gap * 2, gridBounds.height + gap * 2);
    gfx.lineStyle(1, accent, 0.72);
    gfx.strokeRect(gridBounds.x - gap - 4, gridBounds.y - gap - 4, gridBounds.width + gap * 2 + 8, gridBounds.height + gap * 2 + 8);
  }

  private frameGap(gridBounds: Phaser.Geom.Rectangle): number {
    return Math.max(4, Math.min(8, Math.floor(gridBounds.width * 0.014)));
  }

  private shouldUseFullFrame(universeId: UniverseId, key: string): boolean {
    const source = this.scene.textures.get(key).getSourceImage() as HTMLImageElement | HTMLCanvasElement | undefined;
    return Boolean(source && source.width >= 128 && source.height >= 128);
  }

  private resizeFullFrame(gridBounds: Phaser.Geom.Rectangle, depth: number): void {
    const frame = this.parts[0];
    if (!(frame instanceof Phaser.GameObjects.Image)) return;
    if (!this.currentUniverseId) return;

    const innerX = FULL_FRAME_INNER_RECT.x;
    const innerY = FULL_FRAME_INNER_RECT.y;
    const innerW = FULL_FRAME_INNER_RECT.w;
    const innerH = FULL_FRAME_INNER_RECT.h;
    const displayW = gridBounds.width / innerW;
    const displayH = gridBounds.height / innerH;
    const displayX = gridBounds.x - innerX * displayW;
    const displayY = gridBounds.y - innerY * displayH;

    frame
      .setPosition(displayX + displayW / 2, displayY + displayH / 2)
      .setDisplaySize(displayW, displayH)
      .setDepth(depth + 0.2);
  }

  private destroyParts(): void {
    for (const part of this.parts) part.destroy();
    this.parts = [];
    this.currentMode = null;
  }
}
