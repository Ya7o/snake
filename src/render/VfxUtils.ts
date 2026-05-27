import Phaser from 'phaser';
import { MOBILE_UI } from '../config/constants';
import { AudioSystem } from '../systems/AudioSystem';

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

function darkenColor(color: number, factor: number): number {
  const r = Math.min(255, Math.floor(((color >> 16) & 0xff) * factor));
  const g = Math.min(255, Math.floor(((color >> 8) & 0xff) * factor));
  const b = Math.min(255, Math.floor((color & 0xff) * factor));
  return (r << 16) | (g << 8) | b;
}

export function addMobileButton(scene: Phaser.Scene, options: MobileButtonOptions): Phaser.GameObjects.Container {
  const container = scene.add.container(options.x, options.y).setDepth(8);
  const bg = scene.add.graphics();
  const targetFont = options.primary ? MOBILE_UI.BUTTON_FONT : MOBILE_UI.SECONDARY_BUTTON_FONT;
  const label = scene.add.text(0, 0, options.label, {
    fontFamily: UI_FONT,
    fontSize: `${targetFont}px`,
    fontStyle: '700',
    color: options.textColor,
    align: 'center',
  }).setOrigin(0.5);
  const maxLabelW = options.width - 20;
  let fittedFont = targetFont;
  while (label.width > maxLabelW && fittedFont > 10) {
    fittedFont -= 1;
    label.setFontSize(fittedFont);
  }
  const hit = scene.add.zone(0, 0, options.width, options.height).setInteractive({ useHandCursor: true });
  let isPressed = false;

  const draw = (pressed: boolean): void => {
    const W = options.width;
    const H = options.height;
    const hw = W / 2;
    const hh = H / 2;
    const isPrimary = options.primary === true;
    const radius = isPrimary ? 14 : Math.floor(H / 2);
    const fill = pressed ? (options.pressedFillColor ?? darkenColor(options.fillColor, 0.75)) : options.fillColor;

    bg.clear();

    if (isPrimary) {
      // Drop shadow — darker rect offset down
      if (!pressed) {
        bg.fillStyle(darkenColor(fill, 0.45), 0.75);
        bg.fillRoundedRect(-hw + 1, -hh + 4, W, H, radius);
      }

      // Main fill
      bg.fillStyle(fill, 1);
      bg.fillRoundedRect(-hw, -hh, W, H, radius);

      // Top highlight (simulates top light source)
      if (!pressed) {
        bg.fillStyle(0xffffff, 0.20);
        bg.fillRoundedRect(-hw + 3, -hh + 3, W - 6, Math.floor(H * 0.42), radius - 2);
      }

      // External glow
      if (!pressed) {
        bg.lineStyle(7, options.strokeColor, 0.18);
        bg.strokeRoundedRect(-hw - 3, -hh - 3, W + 6, H + 6, radius + 2);
      }

      // Border
      bg.lineStyle(2, options.strokeColor, pressed ? 0.55 : 0.95);
      bg.strokeRoundedRect(-hw, -hh, W, H, radius);

    } else {
      // Secondary — pill shape, semi-transparent fill + colored border
      bg.fillStyle(options.fillColor, pressed ? 0.95 : 0.88);
      bg.fillRoundedRect(-hw, -hh, W, H, radius);

      bg.lineStyle(pressed ? 1 : 2, options.strokeColor, pressed ? 0.5 : 0.80);
      bg.strokeRoundedRect(-hw, -hh, W, H, radius);

      if (!pressed) {
        bg.lineStyle(1, 0xffffff, 0.09);
        bg.strokeRoundedRect(-hw + 2, -hh + 2, W - 4, H - 4, radius - 2);
      }
    }
  };

  draw(false);
  container.add([bg, label, hit]);
  container.setSize(options.width, options.height);

  hit.on('pointerover', () => { if (!isPressed) container.setAlpha(0.88); });
  hit.on('pointerout', () => {
    isPressed = false;
    container.setY(options.y);
    container.setAlpha(1);
    draw(false);
  });
  hit.on('pointerdown', () => {
    isPressed = true;
    container.setY(options.y + 1);
    draw(true);
  });
  hit.on('pointerup', () => {
    const shouldClick = isPressed;
    isPressed = false;
    container.setY(options.y);
    container.setAlpha(1);
    draw(false);
    if (shouldClick) {
      AudioSystem.uiButton();
      options.onClick();
    }
  });

  return container;
}

/** Opt-in NEAREST filter — only call on assets that are intentional pixel art (grid cells, icons drawn at native 1:1). */
export function setCrispPixelArt(scene: Phaser.Scene, key: string): void {
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
