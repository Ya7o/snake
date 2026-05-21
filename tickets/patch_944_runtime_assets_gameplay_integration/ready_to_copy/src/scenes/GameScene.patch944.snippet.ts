// src/scenes/GameScene.patch944.snippet.ts
// Extrait d’intégration à adapter dans le GameScene existant.
// Ne pas coller tel quel si les noms de variables diffèrent.

import {
  preloadRuntimeAssets,
  getRuntimeTextureKey,
} from "../systems/RuntimeAssetResolver";

// 1. Récupérer l’univers courant depuis la structure existante du niveau.
// Exemple : const universeId = this.levelConfig.universeId;
// Adapter au code réel.
const universeId = this.levelConfig?.universeId ?? this.currentUniverseId;

// 2. Preload avant create / avant affichage.
preloadRuntimeAssets(this, universeId);

// 3. Au rendu pickup.
function drawRuntimePickup(scene: Phaser.Scene, universeId: string, x: number, y: number, cellSize: number) {
  const key = getRuntimeTextureKey(scene, universeId, "pickup");

  if (!key) {
    return false;
  }

  const sprite = scene.add.image(x, y, key);
  sprite.setDisplaySize(cellSize * 0.72, cellSize * 0.72);
  sprite.setDepth(20);
  return true;
}

// 4. Au rendu obstacle.
function drawRuntimeObstacle(scene: Phaser.Scene, universeId: string, x: number, y: number, cellSize: number) {
  const key = getRuntimeTextureKey(scene, universeId, "obstacle");

  if (!key) {
    return false;
  }

  const sprite = scene.add.image(x, y, key);
  sprite.setDisplaySize(cellSize * 0.82, cellSize * 0.82);
  sprite.setDepth(18);
  return true;
}

// 5. Au rendu boss marker.
function drawRuntimeBoss(scene: Phaser.Scene, universeId: string, x: number, y: number, cellSize: number) {
  const key = getRuntimeTextureKey(scene, universeId, "boss");

  if (!key) {
    return false;
  }

  const sprite = scene.add.image(x, y, key);
  sprite.setDisplaySize(cellSize * 1.15, cellSize * 1.15);
  sprite.setDepth(25);
  return true;
}
