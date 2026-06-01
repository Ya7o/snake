import Phaser from 'phaser';

const SHARP_RUNTIME_KEY_PREFIX = 'rt_';
const SMOOTH_VECTOR_KEY_PREFIX = 'openmoji-';

// All non-castle runtime universes use stylised non-pixel-art 48×48 icons.
// LINEAR gives clean upscaling to ~50–65 px cell display sizes on mobile.
// NEAREST would produce blocky artefacts on smooth artwork at these scales.
const SMOOTH_RUNTIME_UNIVERSES = new Set(['sonic', 'streets', 'fighter', 'outrun', 'shinobi', 'kombat', 'paperboy']);

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
