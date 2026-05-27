// src/systems/RuntimeAssetResolver.ts
// Patch 944 — preload et résolution des 24 assets runtime par univers.
// Ne charge que les 3 assets de l'univers courant ; fallback = clé nulle.

import Phaser from 'phaser';
import { getRuntimeAsset, RuntimeAssetRole } from '../assets/runtimeUniverseAssets';

const ROLES_NORMAL: RuntimeAssetRole[] = ['pickup', 'obstacle'];
const ROLES_BOSS:   RuntimeAssetRole[] = ['pickup', 'obstacle', 'boss'];

export function runtimeKey(universeId: string, role: RuntimeAssetRole): string {
  return `rt_${universeId}_${role}`;
}

/** Charge pickup + obstacle, et boss uniquement si isBoss = true. */
export function preloadRuntimeAssets(scene: Phaser.Scene, universeId: string, isBoss = false): void {
  const roles = isBoss ? ROLES_BOSS : ROLES_NORMAL;
  for (const role of roles) {
    const key = runtimeKey(universeId, role);
    if (scene.textures.exists(key)) continue;
    const path = getRuntimeAsset(universeId, role);
    if (path) scene.load.image(key, path);
  }
}

/** Retourne la clé Phaser si la texture est chargée, sinon null (fallback procédural). */
export function getRuntimeTextureKey(
  scene: Phaser.Scene,
  universeId: string,
  role: RuntimeAssetRole,
): string | null {
  const key = runtimeKey(universeId, role);
  return scene.textures.exists(key) ? key : null;
}
