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

export const WORLD_MAP_VIEW = {
  HEADER_H: 34,
  FOOTER_H: 96,
  MAP_SAFE_PAD: 0,
  CROP_LEFT: 0,
  CROP_TOP: 0,
  CROP_RIGHT: 0,
  CROP_BOTTOM: 0,
  INITIAL_ZOOM: 1,
  MIN_ZOOM: 1,
  MAX_ZOOM: 2.85,
  NODE_R_NORMAL: 7,
  NODE_R_BOSS: 9,
  NODE_R_HIT: 24,
  DOUBLE_TAP_MS: 320,
  DRAG_THRESHOLD_PX: 10,
} as const;

export const MOBILE_UI = {
  MIN_TOUCH_H: 46,
  PRIMARY_TOUCH_H: 56,
  SAFE_BOTTOM: 18,
  LABEL_MIN: 12,
  CAPTION_MIN: 11,
  BUTTON_FONT: 17,
  SECONDARY_BUTTON_FONT: 14,
} as const;

export const UNIVERSE_FRAME_ASSETS = {
  castle: { key: 'frame-castle', url: 'assets/frames/castle/frame.png' },
  sonic: { key: 'frame-sonic', url: 'assets/frames/sonic/frame.png' },
  streets: { key: 'frame-streets', url: 'assets/frames/streets/frame.png' },
  fighter: { key: 'frame-fighter', url: 'assets/frames/fighter/frame.png' },
  outrun: { key: 'frame-outrun', url: 'assets/frames/outrun/frame.png' },
  shinobi: { key: 'frame-shinobi', url: 'assets/frames/shinobi/frame.png' },
  kombat: { key: 'frame-kombat', url: 'assets/frames/kombat/frame.png' },
  paperboy: { key: 'frame-paperboy', url: 'assets/frames/paperboy/frame.png' },
} as const;

export const UNIVERSE_DISPLAY_NAMES = {
  castle: 'CASTLE OF ILLUSION',
  sonic: 'SONIC',
  streets: 'STREETS OF RAGE',
  fighter: 'STREET FIGHTER',
  outrun: 'OUTRUN',
  shinobi: 'SHINOBI',
  kombat: 'MORTAL KOMBAT',
  paperboy: 'PAPERBOY',
} as const;
