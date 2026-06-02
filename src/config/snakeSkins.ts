import { SnakeSkinData } from './types';
import { UNIVERSES } from './universes';

export const SNAKE_SKINS: Record<string, SnakeSkinData> = {
  snake_u01_sonic: {
    id: 'snake_u01_sonic',
    headSprite: 'snake_u01_head',
    bodySprite: 'snake_u01_body',
    tailSprite: 'snake_u01_tail',
  },
};

/** Asset URL for a skin sprite key — matches public/assets/snakes/<key>.png */
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
