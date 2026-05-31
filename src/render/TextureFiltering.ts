import Phaser from 'phaser';

const SHARP_RUNTIME_KEY_PREFIX = 'rt_';
const SMOOTH_VECTOR_KEY_PREFIX = 'openmoji-';

export function filterModeForGameplayTexture(textureKey: string): Phaser.Textures.FilterMode {
  if (textureKey.startsWith(SMOOTH_VECTOR_KEY_PREFIX)) {
    return Phaser.Textures.FilterMode.LINEAR;
  }

  if (textureKey.startsWith(SHARP_RUNTIME_KEY_PREFIX)) {
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
