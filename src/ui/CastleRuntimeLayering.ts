import Phaser from 'phaser';
import { GAMEPLAY_LAYERS } from './RuntimeUILayout';

export interface CastleRuntimeLayerDebugInfo {
  background: 'runtime-fill+gameplay-bg';
  legacyFrame: 'skipped' | 'rendered';
  localBoardDim: 'runtime';
  boardPanel: 'runtime';
  grid: 'runtime';
  hud: 'runtime';
}

export function drawCastleRuntimeBoardPanel(
  scene: Phaser.Scene,
  gridBounds: Phaser.Geom.Rectangle,
  colors: { bg: number; primary: number; accent: number } = {
    bg: 0x0b0618,
    primary: 0x9b59b6,
    accent: 0xf6c45c,
  },
): Phaser.GameObjects.Graphics {
  const pad = Math.max(10, Math.floor(gridBounds.width * 0.042));
  const radius = Math.max(8, Math.floor(pad * 0.8));
  const panel = scene.add.graphics().setDepth(GAMEPLAY_LAYERS.BOARD_PANEL);
  const x = gridBounds.x - pad;
  const y = gridBounds.y - pad;
  const w = gridBounds.width + pad * 2;
  const h = gridBounds.height + pad * 2;

  panel.fillStyle(0x000000, 0.22);
  panel.fillRoundedRect(gridBounds.x - 4, gridBounds.y - 4, gridBounds.width + 8, gridBounds.height + 8, Math.max(6, radius - 5));
  panel.fillStyle(0x000000, 0.42);
  panel.fillRoundedRect(x + 6, y + 8, w, h, radius);
  panel.fillStyle(colors.bg, 0.74);
  panel.fillRoundedRect(x, y, w, h, radius);
  panel.lineStyle(4, colors.primary, 0.46);
  panel.strokeRoundedRect(x - 2, y - 2, w + 4, h + 4, radius + 2);
  panel.lineStyle(2, colors.accent, 0.72);
  panel.strokeRoundedRect(x, y, w, h, radius);
  panel.lineStyle(1, colors.primary, 0.66);
  panel.strokeRoundedRect(x + 7, y + 7, w - 14, h - 14, Math.max(3, radius - 4));
  panel.lineStyle(1, colors.accent, 0.48);
  panel.strokeRoundedRect(x + 12, y + 12, w - 24, h - 24, Math.max(2, radius - 7));

  return panel;
}

export function getCastleRuntimeLayerDebugInfo(): CastleRuntimeLayerDebugInfo {
  return {
    background: 'runtime-fill+gameplay-bg',
    legacyFrame: 'skipped',
    localBoardDim: 'runtime',
    boardPanel: 'runtime',
    grid: 'runtime',
    hud: 'runtime',
  };
}

export function logCastleRuntimeLayers(): void {
  const info = getCastleRuntimeLayerDebugInfo();
  console.info('[debugLayers=1] Castle runtime layers', {
    ...info,
    order: {
      backgroundFill: GAMEPLAY_LAYERS.BACKGROUND_FILL,
      backgroundImage: GAMEPLAY_LAYERS.BACKGROUND_IMAGE,
      boardPanel: GAMEPLAY_LAYERS.BOARD_PANEL,
      grid: GAMEPLAY_LAYERS.GRID,
      gameplayObjects: GAMEPLAY_LAYERS.GAMEPLAY_OBJECTS,
      gameplayFx: GAMEPLAY_LAYERS.GAMEPLAY_FX,
      hudStrip: GAMEPLAY_LAYERS.HUD_STRIP,
      hudText: GAMEPLAY_LAYERS.HUD_TEXT,
    },
  });
}
