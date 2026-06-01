import type { LevelType } from '../config/types';
import { CASTLE_V1_OPENMOJI } from '../data/openmojiIconRegistry';

export type OpenMojiAsset = Readonly<{
  key: string;
  url: string;
}>;

export const CASTLE_OPENMOJI_ICONS = {
  pickupPrimary: { key: 'openmoji-castle-magic', url: CASTLE_V1_OPENMOJI.pickupPrimary },
  obstacleAlt: { key: 'openmoji-castle-stone', url: CASTLE_V1_OPENMOJI.obstacleAlt },
  dangerPrimary: { key: 'openmoji-castle-fire', url: CASTLE_V1_OPENMOJI.dangerPrimary },
  warningImpact: { key: 'openmoji-castle-impact', url: CASTLE_V1_OPENMOJI.dangerImpact },
  boss: { key: 'openmoji-castle-boss-event', url: CASTLE_V1_OPENMOJI.bossEvent },
  bossDanger: { key: 'openmoji-castle-boss-danger', url: CASTLE_V1_OPENMOJI.bossDanger },
  bossReward: { key: 'openmoji-castle-boss-reward', url: CASTLE_V1_OPENMOJI.bossReward },
} as const satisfies Record<string, OpenMojiAsset>;

export const CASTLE_OPENMOJI_ICON_ASSETS: OpenMojiAsset[] = Object.values(CASTLE_OPENMOJI_ICONS);

export function getCastleOpenMojiBadge(levelType: LevelType): OpenMojiAsset {
  return levelType === 'boss' ? CASTLE_OPENMOJI_ICONS.boss : CASTLE_OPENMOJI_ICONS.pickupPrimary;
}
