import type { LevelType } from '../config/types';
import { CASTLE_V1_OPENMOJI } from '../data/openmojiIconRegistry';

export type OpenMojiAsset = Readonly<{
  key: string;
  url: string;
}>;

export const CASTLE_OPENMOJI_ICONS = {
  world: { key: 'openmoji-castle-world', url: CASTLE_V1_OPENMOJI.world },
  stage: { key: 'openmoji-castle-stage', url: CASTLE_V1_OPENMOJI.stage },
  pickupPrimary: { key: 'openmoji-castle-magic', url: CASTLE_V1_OPENMOJI.pickupPrimary },
  pickupSecondary: { key: 'openmoji-castle-gem', url: CASTLE_V1_OPENMOJI.bonusGem },
  rareOrb: { key: 'openmoji-castle-orb', url: CASTLE_V1_OPENMOJI.rareOrb },
  keyUnlock: { key: 'openmoji-castle-key', url: CASTLE_V1_OPENMOJI.keyUnlock },
  shieldPowerup: { key: 'openmoji-castle-shield', url: CASTLE_V1_OPENMOJI.shieldPowerup },
  bonusStar: { key: 'openmoji-castle-bonus-star', url: CASTLE_V1_OPENMOJI.bonusStar },
  perfectStar: { key: 'openmoji-castle-perfect-star', url: CASTLE_V1_OPENMOJI.perfectStar },
  obstacleFixed: { key: 'openmoji-castle-brick', url: CASTLE_V1_OPENMOJI.obstacleFixed },
  obstacleAlt: { key: 'openmoji-castle-stone', url: CASTLE_V1_OPENMOJI.obstacleAlt },
  obstacleDoor: { key: 'openmoji-castle-door', url: CASTLE_V1_OPENMOJI.obstacleDoor },
  dangerPrimary: { key: 'openmoji-castle-fire', url: CASTLE_V1_OPENMOJI.dangerPrimary },
  warningImpact: { key: 'openmoji-castle-impact', url: CASTLE_V1_OPENMOJI.dangerImpact },
  warning: { key: 'openmoji-castle-warning', url: CASTLE_V1_OPENMOJI.dangerWarning },
  boss: { key: 'openmoji-castle-boss-event', url: CASTLE_V1_OPENMOJI.bossEvent },
  bossDanger: { key: 'openmoji-castle-boss-danger', url: CASTLE_V1_OPENMOJI.bossDanger },
  bossReward: { key: 'openmoji-castle-boss-reward', url: CASTLE_V1_OPENMOJI.bossReward },
  pause: { key: 'openmoji-castle-pause', url: CASTLE_V1_OPENMOJI.pause },
  play: { key: 'openmoji-castle-play', url: CASTLE_V1_OPENMOJI.play },
  home: { key: 'openmoji-castle-home', url: CASTLE_V1_OPENMOJI.home },
  clear: { key: 'openmoji-castle-clear', url: CASTLE_V1_OPENMOJI.clear },
} as const satisfies Record<string, OpenMojiAsset>;

export const CASTLE_OPENMOJI_ICON_ASSETS: OpenMojiAsset[] = Object.values(CASTLE_OPENMOJI_ICONS);

// Paperboy entity icons
export const PAPERBOY_OPENMOJI_ICONS = {
  deliveryTarget: { key: 'openmoji-paperboy-mailbox',    url: 'assets/runtime/universes/paperboy/icon_delivery_mailbox.svg' },
  routeObstacle:  { key: 'openmoji-paperboy-roadblock',  url: 'assets/runtime/universes/paperboy/icon_route_roadblock.svg' },
  newspaper:      { key: 'openmoji-paperboy-newspaper',  url: 'assets/runtime/universes/paperboy/icon_pickup_newspaper.svg' },
} as const satisfies Record<string, OpenMojiAsset>;

export const PAPERBOY_OPENMOJI_ICON_ASSETS: OpenMojiAsset[] = Object.values(PAPERBOY_OPENMOJI_ICONS);

// Fighter sparZone icon — fist replaces generic obstacle texture
export const FIGHTER_OPENMOJI_ICONS = {
  sparZone: { key: 'openmoji-fighter-fist', url: 'assets/runtime/universes/fighter/icon_spar_fist.svg' },
} as const satisfies Record<string, OpenMojiAsset>;

export const FIGHTER_OPENMOJI_ICON_ASSETS: OpenMojiAsset[] = Object.values(FIGHTER_OPENMOJI_ICONS);

// OutRun checkpoint pickup — trophy replaces generic pickup texture
export const OUTRUN_OPENMOJI_ICONS = {
  checkpoint: { key: 'openmoji-outrun-trophy', url: 'assets/runtime/universes/outrun/icon_pickup_trophy.svg' },
} as const satisfies Record<string, OpenMojiAsset>;

export const OUTRUN_OPENMOJI_ICON_ASSETS: OpenMojiAsset[] = Object.values(OUTRUN_OPENMOJI_ICONS);

export function getCastleOpenMojiBadge(levelType: LevelType): OpenMojiAsset {
  return levelType === 'boss' ? CASTLE_OPENMOJI_ICONS.boss : CASTLE_OPENMOJI_ICONS.pickupPrimary;
}
