import Phaser from 'phaser';

const SHARP_RUNTIME_KEY_PREFIX = 'rt_';
const SMOOTH_VECTOR_KEY_PREFIX = 'openmoji-';

// These universe runtimes use stylised non-pixel-art icons. LINEAR gives cleaner
// results when downscaling 256 px sources to ~50–65 px cell display sizes on mobile.
// NEAREST at 0.20–0.25x scale creates aliasing artifacts on smooth artwork.
const SMOOTH_RUNTIME_UNIVERSES = new Set(['outrun']);

export function filterModeForGameplayTexture(textureKey: string): Phaser.Textures.FilterMode {
  if (textureKey.startsWith(SMOOTH_VECTOR_KEY_PREFIX)) {
    return Phaser.Textures.FilterMode.LINEAR;
  }

  if (textureKey.startsWith(SHARP_RUNTIME_KEY_PREFIX)) {
    const universeId = textureKey.slice(SHARP_RUNTIME_KEY_PREFIX.length).split('_')[0];
    if (SMOOTH_RUNTIME_UNIVERSES.has(universeId)) {
      return Phaser.Textures.FilterMode.LINEAR;
    }
    return Phaser.Textures.FilterMode.NEAREST;
  }

  return Phaser.Textures.FilterMode.LINEAR;
}

export function applyGameplayTextureFilter(
  scene: Phaser.Scene,
  textureKey: string,
  filteredKeys: Set<string>,
): void {
  if (filteredKeys.has(textureKey) || !scene.textures.exists(textureKey)) return;
  scene.textures.get(textureKey).setFilter(filterModeForGameplayTexture(textureKey));
  filteredKeys.add(textureKey);
}
