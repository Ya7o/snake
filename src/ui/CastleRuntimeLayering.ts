import Phaser from 'phaser';
import { GAMEPLAY_LAYERS } from './RuntimeUILayout';

export interface CastleRuntimeLayerDebugInfo {
  background: string;
  legacyFrame: 'skipped' | 'rendered';
  boardPanel: 'runtime';
  grid: 'runtime';
  hud: 'runtime';
}

export function drawCastleRuntimeBoardPanel(
  scene: Phaser.Scene,
  gridBounds: Phaser.Geom.Rectangle,
): Phaser.GameObjects.Graphics {
  const pad = Math.max(12, Math.floor(gridBounds.width * 0.052));
  const radius = Math.max(8, Math.floor(pad * 0.8));
  const panel = scene.add.graphics().setDepth(GAMEPLAY_LAYERS.BOARD_PANEL);
  const x = gridBounds.x - pad;
  const y = gridBounds.y - pad;
  const w = gridBounds.width + pad * 2;
  const h = gridBounds.height + pad * 2;

  panel.fillStyle(0x020009, 0.72);
  panel.fillRoundedRect(x + 6, y + 8, w, h, radius);
  panel.fillStyle(0x0b0618, 0.96);
  panel.fillRoundedRect(x, y, w, h, radius);
  panel.lineStyle(7, 0x2b143d, 1);
  panel.strokeRoundedRect(x - 2, y - 2, w + 4, h + 4, radius + 2);
  panel.lineStyle(5, 0xf6c45c, 0.94);
  panel.strokeRoundedRect(x, y, w, h, radius);
  panel.lineStyle(3, 0xa94cff, 1);
  panel.strokeRoundedRect(x + 7, y + 7, w - 14, h - 14, Math.max(3, radius - 4));
  panel.lineStyle(1, 0xffe6a0, 0.9);
  panel.strokeRoundedRect(x + 12, y + 12, w - 24, h - 24, Math.max(2, radius - 7));

  return panel;
}

export function getCastleRuntimeLayerDebugInfo(): CastleRuntimeLayerDebugInfo {
  return {
    background: 'castle_gameplay_bg',
    legacyFrame: 'skipped',
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
