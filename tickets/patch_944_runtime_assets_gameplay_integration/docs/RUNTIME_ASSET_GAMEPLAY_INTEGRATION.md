# Intégration gameplay des assets runtime

## Principe
Le patch 943 a installé exactement 24 assets gameplay :

```txt
public/assets/runtime/universes/<univers>/
```

Le patch 944 doit les afficher dans `GameScene`.

## Règle de chargement
Ne pas précharger les 24 assets au démarrage global si ce n’est pas nécessaire.

Charger uniquement :
- pickup ;
- obstacle ;
- boss ;

pour l’univers courant.

## Helper proposé
Créer :

```txt
src/systems/RuntimeAssetResolver.ts
```

Puis dans `GameScene` :

```ts
import {
  preloadRuntimeAssets,
  getRuntimeTextureKey,
} from "../systems/RuntimeAssetResolver";
```

## Exemple preload
Dans le preload ou au moment de préparer le niveau :

```ts
preloadRuntimeAssets(this, universeId);
```

Si la scène charge dynamiquement après `create`, utiliser le flux Phaser existant du projet. Ne pas casser le cycle de chargement.

## Exemple affichage pickup
Au moment de dessiner un pickup :

```ts
const key = getRuntimeTextureKey(this, universeId, "pickup");

if (key) {
  const sprite = this.add.image(cellCenterX, cellCenterY, key);
  sprite.setDisplaySize(cellSize * 0.72, cellSize * 0.72);
  sprite.setDepth(20);
} else {
  // fallback existant
}
```

## Exemple obstacle
```ts
const key = getRuntimeTextureKey(this, universeId, "obstacle");

if (key) {
  const sprite = this.add.image(cellCenterX, cellCenterY, key);
  sprite.setDisplaySize(cellSize * 0.82, cellSize * 0.82);
  sprite.setDepth(18);
} else {
  // fallback obstacle existant
}
```

## Exemple boss marker
```ts
const key = getRuntimeTextureKey(this, universeId, "boss");

if (key && isBossLevel) {
  const sprite = this.add.image(cellCenterX, cellCenterY, key);
  sprite.setDisplaySize(cellSize * 1.15, cellSize * 1.15);
  sprite.setDepth(25);
} else {
  // fallback boss existant
}
```

## Attention
Si les sprites sont trop gros :
- pickup : 65–75% de la cellule ;
- obstacle : 75–90% de la cellule ;
- boss marker : 100–120% maximum, seulement si lisible.

## Interdits
- Ne pas charger `_downloaded`.
- Ne pas charger `_extracted`.
- Ne pas charger les planches.
- Ne pas utiliser les anciennes candidates.
- Ne pas remplacer la grille.
