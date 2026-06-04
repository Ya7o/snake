import { SnakeSkinData } from './types';
import { UNIVERSES } from './universes';

export const SNAKE_SKINS: Record<string, SnakeSkinData> = {
  snake_u01_sonic: {
    id: 'snake_u01_sonic',
    headSprite: 'snake_u01_head',
    bodySprite: 'snake_u01_body',
    tailSprite: 'snake_u01_tail',
    // PNG dimensions after PATCH 1121E crop (head/tail only):
    //   head: 60x45 (content 56x41, 2px padding), body: 64x64 (unchanged), tail: 60x26 (content 56x22, 2px padding)
    // Rendered visual height at these scales (reference: body = cs*0.863):
    //   head  = cs*0.92*1.85*(41/60) = cs*1.164  (+35% vs body)
    //   body  = cs*0.92*2.0 *(30/64) = cs*0.863  (reference)
    //   tail  = cs*0.92*3.35*(22/60) = cs*1.131  (+31% vs body)
    headScale: 1.85,
    bodyScale: 2.0,
    tailScale: 3.35,
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
