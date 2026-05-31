// src/systems/RuntimeAssetResolver.ts
// Preload and resolve gameplay runtime assets for the active universe.

import Phaser from 'phaser';
import { getRuntimeAsset, RuntimeAssetRole } from '../assets/runtimeUniverseAssets';

const ROLES_NORMAL: RuntimeAssetRole[] = ['pickup', 'pickupSecondary', 'obstacle'];
const ROLES_BOSS:   RuntimeAssetRole[] = ['pickup', 'pickupSecondary', 'obstacle', 'boss'];

export function runtimeKey(universeId: string, role: RuntimeAssetRole): string {
  return `rt_${universeId}_${role}`;
}

/** Loads pickup + obstacle assets, and boss only for boss levels. */
export function preloadRuntimeAssets(scene: Phaser.Scene, universeId: string, isBoss = false): void {
  const roles = isBoss ? ROLES_BOSS : ROLES_NORMAL;
  for (const role of roles) {
    const key = runtimeKey(universeId, role);
    if (scene.textures.exists(key)) continue;
    const path = getRuntimeAsset(universeId, role);
    if (path) scene.load.image(key, path);
  }
}

/** Returns the Phaser texture key when loaded, otherwise null. */
export function getRuntimeTextureKey(
  scene: Phaser.Scene,
  universeId: string,
  role: RuntimeAssetRole,
): string | null {
  const key = runtimeKey(universeId, role);
  return scene.textures.exists(key) ? key : null;
}
