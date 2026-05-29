export const BACKGROUND_COLOR = '#05050a';

// Keep false for release. Use ?unlockAll=1 URL param for session debug unlock.
export const DEV_UNLOCK_ALL = false;

export const ASSET_KEYS = {
  WORLD_MAP: 'world_map',
  WORLD_MAP_MINIMAP: 'world_map_minimap_16_9',
} as const;

export const ASSET_PATHS = {
  WORLD_MAP: 'assets/map/world_map.png',
  WORLD_MAP_MINIMAP: 'assets/ui/worldmap/world_map_minimap_16_9.png',
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
  FOOTER_H: 44,
  MAP_SAFE_PAD: 0,
  CROP_LEFT: 0,
  CROP_TOP: 0,
  CROP_RIGHT: 0,
  CROP_BOTTOM: 0,
  // Portrait: zoom in so the map fills the viewport and user pans to explore.
  // MIN_ZOOM=1 keeps full-height cover visible when user pinches out.
  // PATCH 1017A: reduced from 1.7 → 1.5 for comfort (≈−12 %)
  INITIAL_ZOOM: 1.5,
  MIN_ZOOM: 1,
  MAX_ZOOM: 3.0,
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
  BUTTON_FONT: 15,
  SECONDARY_BUTTON_FONT: 12,
} as const;

export const UNIVERSE_FRAME_ASSETS = {
  sonic: { key: 'frame-sonic', url: 'assets/frames/sonic/frame.png' },
  streets: { key: 'frame-streets', url: 'assets/frames/streets/frame.png' },
  fighter: { key: 'frame-fighter', url: 'assets/frames/fighter/frame.png' },
  outrun: { key: 'frame-outrun', url: 'assets/frames/outrun/frame.png' },
  shinobi: { key: 'frame-shinobi', url: 'assets/frames/shinobi/frame.png' },
  kombat: { key: 'frame-kombat', url: 'assets/frames/kombat/frame.png' },
  paperboy: { key: 'frame-paperboy', url: 'assets/frames/paperboy/frame.png' },
} as const;

export const UNIVERSE_LEVEL_INTRO_ASSETS = {
  castle: { key: 'level-intro-castle', url: 'assets/level-intros/castle/intro.png' },
  sonic: { key: 'level-intro-sonic', url: 'assets/level-intros/sonic/intro.png' },
  streets: { key: 'level-intro-streets', url: 'assets/level-intros/streets/intro.png' },
  fighter: { key: 'level-intro-fighter', url: 'assets/level-intros/fighter/intro.png' },
  outrun: { key: 'level-intro-outrun', url: 'assets/level-intros/outrun/intro.png' },
  shinobi: { key: 'level-intro-shinobi', url: 'assets/level-intros/shinobi/intro.png' },
  kombat: { key: 'level-intro-kombat', url: 'assets/level-intros/kombat/intro.png' },
  paperboy: { key: 'level-intro-paperboy', url: 'assets/level-intros/paperboy/intro.png' },
} as const;

interface BgSlot { key: string; url: string }
export interface UniverseBgSet {
  system: BgSlot;
  bossSystem?: BgSlot;
  gameplay: BgSlot;
  gameOver: BgSlot;
  clear: BgSlot;
}

const mk = (uid: string): UniverseBgSet => ({
  system:     { key: `bg-${uid}-system`,    url: `assets/ui/${uid}/${uid}_system_bg.png` },
  bossSystem: { key: `bg-${uid}-boss-sys`,  url: `assets/ui/${uid}/${uid}_boss_system_bg.png` },
  gameplay:   { key: `bg-${uid}-gameplay`,  url: `assets/ui/${uid}/${uid}_gameplay_bg.png` },
  gameOver:   { key: `bg-${uid}-gameover`,  url: `assets/ui/${uid}/${uid}_game_over_bg.png` },
  clear:      { key: `bg-${uid}-clear`,     url: `assets/ui/${uid}/${uid}_clear_bg.png` },
});

export const UNIVERSE_RESULT_SCREEN_ASSETS: Record<string, UniverseBgSet> = {
  castle:   mk('castle'),
  sonic:    mk('sonic'),
  streets:  mk('streets'),
  fighter:  mk('fighter'),
  outrun:   mk('outrun'),
  shinobi:  mk('shinobi'),
  kombat:   mk('kombat'),
  paperboy: mk('paperboy'),
};

// Backward-compat aliases — external code that imports these still works
export const CASTLE_RESULT_SCREEN_ASSETS = UNIVERSE_RESULT_SCREEN_ASSETS['castle'];
export const OUTRUN_RESULT_SCREEN_ASSETS  = UNIVERSE_RESULT_SCREEN_ASSETS['outrun'];

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
