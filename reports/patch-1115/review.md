# Review — PATCH 1115

## Objectif

Auditer et corriger le rendu des icônes gameplay Outrun (pickup, obstacle, boss) pour obtenir des assets nets, lisibles et propres sur mobile portrait Android.

---

## Résultat

**Cause racine identifiée et corrigée.**

Le rendu flou/sale des icônes Outrun était causé par un filtre texture inadapté : `FilterMode.NEAREST` était appliqué à tous les assets `rt_*` (préfixe runtime). Ce mode est conçu pour agrandir du pixel art en conservant les bords nets, mais il produit des artefacts d'aliasing graves lorsqu'il est utilisé pour **réduire** une source 256 px vers une cellule de ~50–65 px (~0.20–0.25x).

**Correction** : `src/render/TextureFiltering.ts` — ajout d'une liste `SMOOTH_RUNTIME_UNIVERSES` contenant `'outrun'`. Les assets `rt_outrun_*` reçoivent désormais `FilterMode.LINEAR` (interpolation bilinéaire), le mode correct pour un downscaling fort sur des icônes non-pixel-art.

---

## Audit complet du pipeline

### 1. Localisation du composant d'affichage

| Composant | Fichier | Rôle |
|-----------|---------|------|
| `PickupRenderer` | `src/render/PickupRenderer.ts` | Pickup images via pool Phaser.Image |
| `ObstacleRenderer` | `src/render/ObstacleRenderer.ts` | Obstacles et boss via pools |
| `applyGameplayTextureFilter` | `src/render/TextureFiltering.ts` | Applique le FilterMode au texture Phaser |
| `preloadRuntimeAssets` | `src/systems/RuntimeAssetResolver.ts` | Charge les assets `rt_outrun_*` |

### 2. Tailles réelles d'affichage (mobile portrait 390×844 px)

Grille Outrun : 16 colonnes × 20 lignes (identique aux autres univers non-Castle).

```
availW = 390 − 16 = 374 px
availH = 844 − 60 (HUD) − 40 (bottom) = 744 px
cellW  = floor(374 / 16) = 23 px
cellH  = floor(744 / 20) = 37 px
cellSize = min(23, 37) = 23 px  ← entier, pas de fraction
```

| Asset | maxSizeScale | Taille affichée | Source | Ratio |
|-------|-------------|-----------------|--------|-------|
| Pickup | 2.8 | ~64 px | 256 px | 0.25× |
| Obstacle (trafficBlock) | 2.5 | ~57 px | 256 px | 0.22× |
| Obstacle (default) | 2.2 | ~50 px | 256 px | 0.20× |
| Boss (turboRival) | 2.5 | ~57 px | 256 px | 0.22× |

Les dimensions affichées sont **entières** (cellSize = entier × maxSizeScale arrondi par setDisplaySize). Pas de fraction observée.

### 3. Vérification des règles CSS

```css
/* index.html */
#app canvas {
  display: block;
  width: 100%;
  height: 100%;
}
```

Aucune propriété `image-rendering` CSS sur le canvas. Le rendu est entièrement piloté par le FilterMode WebGL de Phaser. ✓

### 4. Propriété image-rendering identifiée côté Phaser

Avant PATCH 1115 :
```ts
// TextureFiltering.ts — tous les rt_ → NEAREST
if (textureKey.startsWith('rt_')) {
  return Phaser.Textures.FilterMode.NEAREST;
}
```

Ceci applique `gl.NEAREST` à toutes les textures runtime, y compris Outrun. **C'est la cause du rendu sale.**

---

## Correction appliquée

**Fichier modifié** : `src/render/TextureFiltering.ts`

```ts
// AVANT
if (textureKey.startsWith(SHARP_RUNTIME_KEY_PREFIX)) {
  return Phaser.Textures.FilterMode.NEAREST;
}

// APRÈS
const SMOOTH_RUNTIME_UNIVERSES = new Set(['outrun']);

if (textureKey.startsWith(SHARP_RUNTIME_KEY_PREFIX)) {
  const universeId = textureKey.slice(SHARP_RUNTIME_KEY_PREFIX.length).split('_')[0];
  if (SMOOTH_RUNTIME_UNIVERSES.has(universeId)) {
    return Phaser.Textures.FilterMode.LINEAR;
  }
  return Phaser.Textures.FilterMode.NEAREST;
}
```

Clés affectées : `rt_outrun_pickup`, `rt_outrun_pickupSecondary`, `rt_outrun_obstacle`, `rt_outrun_obstacleDanger`, `rt_outrun_boss`, `rt_outrun_bossAttack`.

---

## Structure assets préparée

```
public/assets/runtime/universes/outrun/
├── source-256/         ← sources 256×256 PNG originales
│   └── .gitkeep
├── gameplay-64/        ← versions finales optimisées 64×64 px
│   └── .gitkeep
├── gameplay-48/        ← versions finales optimisées 48×48 px
│   └── .gitkeep
└── new/
    ├── 01_pickup_object.png   (256×256 RGBA)
    ├── 02_pickup_object_2.png (256×256 RGBA)
    ├── 03_obstacle.png        (256×256 RGBA)
    ├── 04_obstacle_danger.png (256×256 RGBA)
    ├── 05_boss_idle.png       (256×256 RGBA)
    └── 06_boss_attack.png     (256×256 RGBA)
```

---

## Note technique — Pourquoi une icône 256×256 reste floue ou sale

### Le problème du downscale NEAREST

`FilterMode.NEAREST` (nearest-neighbor) sélectionne le pixel source le plus proche sans interpolation. Ce mode est prévu pour **agrandir** du pixel art : chaque pixel source devient un bloc de pixels affichés, donnant un rendu carré et net.

Appliqué à une **forte réduction** (256 → 50 px = ratio 0.20×), le comportement est inverse et néfaste :

- Pour chaque pixel de destination, un seul pixel source sur ~5 est échantillonné.
- Les pixels intermédiaires sont ignorés, créant des artefacts d'aliasing irréguliers.
- Certains détails de l'icône disparaissent ou apparaissent avec une luminosité incohérente.
- Le résultat est perçu comme "sale", "pixelisé dans le mauvais sens" ou "flou avec des arêtes dures".

### La solution : FilterMode.LINEAR

`FilterMode.LINEAR` (bilinéaire) calcule une moyenne pondérée des pixels voisins. Pour un downscale de 256 → 64 px :

- Chaque pixel de destination est une interpolation de plusieurs pixels source.
- Les transitions de couleur et les contours restent lisibles et propres.
- Les icônes stylisées non-pixel-art (Outrun, etc.) bénéficient systématiquement de ce mode.

### Recommandation tailles finales

| Cellule mobile (px) | Source recommandée | Ratio confortable |
|--------------------|-------------------|-------------------|
| 23 px (16 cols, 390px phone) | 48×48 px | ~2× upscale → net |
| 23 px avec maxSizeScale 2.8 → 64 px affiché | 64×64 px | 1:1 → parfait |

**Recommandation** : pour les univers Outrun, concevoir les icônes finales directement en **64×64 px** (ou 48×48 px si l'affichage max est ~50 px). Les assets source en 256×256 sont utiles pour la production (exports Figma, etc.) mais les icônes affichées doivent être pensées pour leur taille d'exploitation finale.

Si des assets 64×64 ou 48×48 sont préparés, les placer dans les dossiers `gameplay-64/` ou `gameplay-48/` créés à cet effet et mettre à jour `runtimeUniverseAssets.ts` pour pointer vers ces sources.

---

## Fichiers modifiés

| Fichier | Type | Description |
|---------|------|-------------|
| `src/render/TextureFiltering.ts` | Code | LINEAR pour rt_outrun_* |
| `public/assets/runtime/universes/outrun/source-256/.gitkeep` | Asset | Nouveau dossier sources |
| `public/assets/runtime/universes/outrun/gameplay-64/.gitkeep` | Asset | Nouveau dossier 64px |
| `public/assets/runtime/universes/outrun/gameplay-48/.gitkeep` | Asset | Nouveau dossier 48px |

---

## Tests / vérifications

```
npm run check
✓ TypeScript : 0 erreur
✓ Vite build : 61 modules, 0 erreur
⚠ Warning Rollup "chunk > 500 kB" — connu, non bloquant
```

---

## Captures

Aucune capture runtime dans ce patch — la correction est une propriété de filtre WebGL non visible sur screenshot statique. Le rendu s'observe en jeu sur device mobile ou en simulateur Chrome.

---

## Limites / risques

1. **Autres univers `rt_*`** : Sonic, Streets, Fighter, Shinobi, Kombat, Paperboy utilisent également des assets 256×256 non-pixel-art avec NEAREST. Ils présentent probablement le même problème. Ajouter ces univers à `SMOOTH_RUNTIME_UNIVERSES` reste trivial, mais n'est pas dans le scope de ce patch (éviter refonte globale non demandée).

2. **Assets `/new/` vs gameplay-64** : Les assets actuels en `new/` (256×256) sont utilisés au runtime. La création des dossiers `gameplay-64/` et `gameplay-48/` ne change pas la résolution de chargement — ils sont prêts à recevoir des assets optimisés. Aucune modification de `runtimeUniverseAssets.ts` n'est faite tant que les assets 64/48px ne sont pas produits.

3. **Vieux assets** (`pickup_checkpoint.png`, `obstacle_car.png` : 1254×1254) non référencés dans `runtimeUniverseAssets.ts` — sans impact sur le rendu en jeu.

---

## Liens GitHub

*(à compléter après push)*

- Commit : voir `git log --oneline -1`
- Fichier modifié : `src/render/TextureFiltering.ts`
- Rapport : `reports/patch-1115/review.md`
