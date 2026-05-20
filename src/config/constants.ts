export const BACKGROUND_COLOR = '#05050a';

export const ASSET_KEYS = {
  WORLD_MAP: 'world_map',
} as const;

export const ASSET_PATHS = {
  WORLD_MAP: 'assets/map/world_map.png',
} as const;

export const SCENES = {
  BOOT: 'BootScene',
  TITLE: 'TitleScene',
  WORLD_MAP: 'WorldMapScene',
  LEVEL_INTRO: 'LevelIntroScene',
  GAME: 'GameScene',
  CLEAR: 'ClearScene',
  GAME_OVER: 'GameOverScene'
} as const;
