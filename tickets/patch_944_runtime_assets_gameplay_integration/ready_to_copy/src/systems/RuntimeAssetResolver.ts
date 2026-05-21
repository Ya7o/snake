// src/systems/RuntimeAssetResolver.ts
// Patch 944 — helper léger pour brancher les 24 assets runtime.
// Adapter les imports relatifs selon l’emplacement réel dans le projet.

import { getRuntimeAsset, type RuntimeAssetRole } from "../assets/runtimeUniverseAssets";

export type RuntimeAssetLoadEntry = {
  role: RuntimeAssetRole;
  key: string;
  path: string;
};

export function runtimeAssetKey(universeId: string, role: RuntimeAssetRole): string {
  return `runtime:${universeId}:${role}`;
}

export function getRuntimeAssetLoadList(universeId: string): RuntimeAssetLoadEntry[] {
  const roles: RuntimeAssetRole[] = ["pickup", "obstacle", "boss"];

  return roles
    .map((role) => {
      const path = getRuntimeAsset(universeId, role);
      if (!path) return null;

      return {
        role,
        key: runtimeAssetKey(universeId, role),
        path,
      };
    })
    .filter((entry): entry is RuntimeAssetLoadEntry => Boolean(entry));
}

export function preloadRuntimeAssets(scene: Phaser.Scene, universeId: string): void {
  for (const asset of getRuntimeAssetLoadList(universeId)) {
    if (!scene.textures.exists(asset.key)) {
      scene.load.image(asset.key, asset.path);
    }
  }
}

export function getRuntimeTextureKey(scene: Phaser.Scene, universeId: string, role: RuntimeAssetRole): string | undefined {
  const key = runtimeAssetKey(universeId, role);
  return scene.textures.exists(key) ? key : undefined;
}
