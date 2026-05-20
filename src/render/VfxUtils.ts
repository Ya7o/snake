import Phaser from 'phaser';
import { MOBILE_UI } from '../config/constants';

export const ARCADE_FONT = '"Press Start 2P", monospace';
export const UI_FONT = 'Arial, Helvetica, sans-serif';

export interface MobileButtonOptions {
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  primary?: boolean;
  fillColor: number;
  strokeColor: number;
  textColor: string;
  pressedFillColor?: number;
  onClick: () => void;
}

export function addMobileButton(scene: Phaser.Scene, options: MobileButtonOptions): Phaser.GameObjects.Container {
  const container = scene.add.container(options.x, options.y).setDepth(8);
  const bg = scene.add.graphics();
  const label = scene.add.text(0, 0, options.label, {
    fontFamily: UI_FONT,
    fontSize: `${options.primary ? MOBILE_UI.BUTTON_FONT : MOBILE_UI.SECONDARY_BUTTON_FONT}px`,
    fontStyle: '700',
    color: options.textColor,
    align: 'center',
  }).setOrigin(0.5);
  const hit = scene.add.zone(0, 0, options.width, options.height).setInteractive({ useHandCursor: true });
  let isPressed = false;

  const draw = (pressed: boolean): void => {
    bg.clear();
    bg.fillStyle(pressed ? options.pressedFillColor ?? options.strokeColor : options.fillColor, 1);
    bg.fillRoundedRect(-options.width / 2, -options.height / 2, options.width, options.height, 8);
    bg.lineStyle(options.primary ? 3 : 2, options.strokeColor, 1);
    bg.strokeRoundedRect(-options.width / 2, -options.height / 2, options.width, options.height, 8);
  };

  draw(false);
  container.add([bg, label, hit]);
  container.setSize(options.width, options.height);

  hit.on('pointerover', () => draw(true));
  hit.on('pointerout', () => {
    isPressed = false;
    container.setScale(1);
    draw(false);
  });
  hit.on('pointerdown', () => {
    isPressed = true;
    container.setScale(0.98);
    draw(true);
  });
  hit.on('pointerup', () => {
    const shouldClick = isPressed;
    isPressed = false;
    container.setScale(1);
    draw(false);
    if (shouldClick) options.onClick();
  });

  return container;
}

export function setCrispTexture(scene: Phaser.Scene, key: string): void {
  if (!scene.textures.exists(key)) return;
  scene.textures.get(key).setFilter(Phaser.Textures.FilterMode.NEAREST);
}

/**
 * Draw a double-border rounded console frame — the V3 signature look.
 * Returns the Graphics object so the caller can add it to a container.
 */
export function drawConsoleFrame(
  scene: Phaser.Scene,
  x: number, y: number, w: number, h: number,
  outerColor: number,
  innerColor: number,
  depth = 5
): Phaser.GameObjects.Graphics {
  const gfx = scene.add.graphics().setDepth(depth);
  const r = 16;

  // Outer border
  gfx.lineStyle(5, outerColor, 1);
  gfx.strokeRoundedRect(x, y, w, h, r);

  // Inner border
  gfx.lineStyle(2, innerColor, 0.7);
  gfx.strokeRoundedRect(x + 8, y + 8, w - 16, h - 16, r - 4);

  // Corner accent squares
  const sq = 6;
  gfx.fillStyle(outerColor, 1);
  for (const [cx, cy] of [[x + 3, y + 3], [x + w - sq - 3, y + 3], [x + 3, y + h - sq - 3], [x + w - sq - 3, y + h - sq - 3]] as [number, number][]) {
    gfx.fillRect(cx, cy, sq, sq);
  }

  return gfx;
}

/**
 * Add a scanline overlay over the full scene — subtle CRT effect.
 * 907 — on mobile (touch device) uses a sparser step to reduce fill cost.
 */
export function addScanlines(scene: Phaser.Scene, alpha = 0.06, depth = 50): Phaser.GameObjects.Graphics {
  const { width, height } = scene.scale;
  const isMobile = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;
  const step = isMobile ? 6 : 3; // coarser scanlines on mobile
  const gfx = scene.add.graphics().setDepth(depth).setScrollFactor(0);
  gfx.fillStyle(0x000000, alpha);
  for (let y = 0; y < height; y += step) {
    gfx.fillRect(0, y, width, 1);
  }
  return gfx;
}

/**
 * Flash the full screen with a color, then fade out.
 */
export function flashScreen(
  scene: Phaser.Scene,
  color = 0xffffff,
  startAlpha = 0.7,
  durationMs = 300,
  depth = 40
): void {
  const { width, height } = scene.scale;
  const flash = scene.add.rectangle(width / 2, height / 2, width, height, color, startAlpha).setDepth(depth);
  scene.tweens.add({
    targets: flash,
    alpha: 0,
    duration: durationMs,
    ease: 'Sine.easeOut',
    onComplete: () => flash.destroy()
  });
}

/**
 * Draw diagonal decorative lines — V3 title background style.
 */
export function drawDiagLines(
  scene: Phaser.Scene,
  color1: number,
  color2: number,
  depth = 1
): Phaser.GameObjects.Graphics {
  const { width, height } = scene.scale;
  const gfx = scene.add.graphics().setDepth(depth);
  const step = 44;
  for (let i = 0; i < (width + height) / step + 2; i++) {
    gfx.lineStyle(2, i % 2 ? color1 : color2, 1);
    gfx.lineBetween(-width * 0.2 + i * step, 0, i * step, height);
  }
  return gfx;
}

/**
 * Draw a gradient-style background using stacked rectangles.
 */
export function drawGradientBg(
  scene: Phaser.Scene,
  topColor: number,
  bottomColor: number,
  depth = 0
): Phaser.GameObjects.Graphics {
  const { width, height } = scene.scale;
  const gfx = scene.add.graphics().setDepth(depth);
  const steps = 20;
  const tr = (topColor >> 16) & 0xff, tg = (topColor >> 8) & 0xff, tb = topColor & 0xff;
  const br = (bottomColor >> 16) & 0xff, bg2 = (bottomColor >> 8) & 0xff, bb = bottomColor & 0xff;
  for (let i = 0; i < steps; i++) {
    const t = i / steps;
    const r = Math.round(tr + (br - tr) * t);
    const g = Math.round(tg + (bg2 - tg) * t);
    const b = Math.round(tb + (bb - tb) * t);
    const col = (r << 16) | (g << 8) | b;
    gfx.fillStyle(col, 1);
    gfx.fillRect(0, (height / steps) * i, width, Math.ceil(height / steps) + 1);
  }
  return gfx;
}
