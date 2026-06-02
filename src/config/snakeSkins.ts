import { SnakeSkinData } from './types';
import { UNIVERSES } from './universes';

export const SNAKE_SKINS: Record<string, SnakeSkinData> = {
  snake_u01_sonic: {
    id: 'snake_u01_sonic',
    headSprite: 'snake_u01_head',
    bodySprite: 'snake_u01_body',
    tailSprite: 'snake_u01_tail',
    // Content ratios within each PNG (opaque area / sprite size): head ~88%, body ~47%, tail ~34%.
    // headScale and tailScale are boosted above body to compensate for sparse tail content and
    // to make head/tail visually larger than body segments (~17% and ~12% bigger respectively).
    headScale: 1.25,
    bodyScale: 2.0,
    tailScale: 3.1,
  },
};

/** Asset URL for a skin sprite key - matches public/assets/snakes/<key>.png */
export function snakeSkinSpriteUrl(spriteKey: string): string {
  return `assets/snakes/${spriteKey}.png`;
}

/**
 * Returns the SnakeSkinData for the given universe, or null if the universe
 * has no skin or the skin id is unknown. Safe to call with any universe id.
 */
export function resolveSnakeSkinForUniverse(universeId: string): SnakeSkinData | null {
  const universe = UNIVERSES[universeId];
  if (!universe?.snakeSkinId) return null;
  return SNAKE_SKINS[universe.snakeSkinId] ?? null;
}
