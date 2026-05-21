// src/systems/RuntimeAssetResolver.ts
// Patch 944 — preload et résolution des 24 assets runtime par univers.
// Ne charge que les 3 assets de l'univers courant ; fallback = clé nulle.

import Phaser from 'phaser';
import { getRuntimeAsset, RuntimeAssetRole } from '../assets/runtimeUniverseAssets';

const ROLES: RuntimeAssetRole[] = ['pickup', 'obstacle', 'boss'];

export function runtimeKey(universeId: string, role: RuntimeAssetRole): string {
  return `rt_${universeId}_${role}`;
}

/** À appeler dans preload() de la scène — queue uniquement les 3 assets du niveau. */
export function preloadRuntimeAssets(scene: Phaser.Scene, universeId: string): void {
  for (const role of ROLES) {
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
