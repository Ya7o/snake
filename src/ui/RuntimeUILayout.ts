export const GAMEPLAY_HUD = {
  HEIGHT: 56,
  PADDING_X: 10,
} as const;

export const GAMEPLAY_LAYERS = {
  BACKGROUND_FILL: 0,
  BACKGROUND_IMAGE: 1,
  BOARD_PANEL: 10,
  GRID: 30,
  GAMEPLAY_OBJECTS: 40,
  GAMEPLAY_FX: 70,
  HUD_STRIP: 80,
  HUD_TEXT: 90,
  SCREEN_FX: 110,
  DEBUG: 120,
} as const;

export const RESULT_SCREEN_LAYOUT = {
  titleY: 0.24,
  subtitleY: 0.36,
  contextY: 0.47,
  primaryButtonY: 0.63,
  separatorY: 0.72,
  secondaryButtonY: 0.81,
  primaryButtonW: 0.56,
  secondaryButtonW: 0.42,
  primaryButtonH: 50,
  secondaryButtonH: 42,
} as const;

import { MENU_THEMES, MenuThemeButtons } from '../config/menuThemes';
export type { MenuThemeButtons };

export function getUniverseButtons(uid: string): MenuThemeButtons {
  return MENU_THEMES[uid]?.buttons ?? MENU_THEMES.castle.buttons;
}

// Title-only colors for result screens (not buttons)
export const CASTLE_RESULT_THEME = {
  titleLoss: '#ff6b5f',
  titleClear: '#f6c45c',
} as const;
