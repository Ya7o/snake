# PATCH 1018D — OpenMoji Icon Mapping Pass

## Objectif

Corriger les placeholders visibles de gameplay via mapping runtime/OpenMoji.
Priorité : Paperboy (carré vert `deliveryTarget`). Correction secondaire : déblocage des assets runtime pour tous les univers non-Castle.

---

## Problème

### Paperboy carré vert

**Cause :** `deliveryTarget` n'est pas dans `OBSTACLE_IMAGE_TYPES` et aucun `entityTextureResolver` n'est défini pour Paperboy.  
→ `ObstacleRenderer.drawEntity()` est appelé en fallback.  
→ `fillStyle(0x27ae60, 0.8)` + `fillRect()` = carré vert plein.

`0x27ae60` = `paperboy.palette.primary` = vert exact.

### Condition rt_ bloquante (tous 7 univers non-Castle)

**Cause :** GameScene.ts ligne 226 vérifiait `!this.textures.exists(pickupKey)`.  
Les `db_` transparents (pickup_01.png, obstacle_01.png, boss.png) sont chargés d'abord et existent dans le cache Phaser.  
→ La condition échoue → les runtime assets (`rt_{uid}_pickup`, `rt_{uid}_obstacle`, `rt_{uid}_boss`) ne sont jamais câblés.  
→ Tous les 7 univers non-Castle affichaient halo procédural au lieu des runtime PNGs.

---

## Changements

| Univers | Élément | Avant | Après | Fichier modifié |
|---|---|---|---|---|
| Paperboy | `deliveryTarget` (cible livraison) | Carré vert `0x27ae60` | Icône mailbox `mailbox.svg` | `GameScene.ts`, `OpenMojiIconRegistry.ts` |
| Paperboy | `bossTarget` (cible boss) | Carré vert `0x27ae60` | Icône mailbox `mailbox.svg` | `GameScene.ts`, `OpenMojiIconRegistry.ts` |
| Paperboy | `routeObstacle` (obstacle de rue) | Rectangle gris procédural | Icône roadblock `roadblock.svg` | `GameScene.ts`, `OpenMojiIconRegistry.ts` |
| Paperboy | pickup journal | Halo jaune seul (db_ transparent) | `pickup_newspaper.png` runtime | `GameScene.ts` (condition rt_) |
| Paperboy | obstacle chien | Halo gris procédural (db_ transparent) | `obstacle_dog.png` runtime | `GameScene.ts` (condition rt_) |
| Paperboy | boss chaos | Glow procédural (db_ transparent) | `boss_neighborhood_chaos.png` runtime | `GameScene.ts` (condition rt_) |
| Sonic | pickup anneau | Halo jaune seul (db_ transparent) | `pickup_ring.png` runtime | `GameScene.ts` (condition rt_) |
| Sonic | obstacle bumper | Invisible (db_ transparent) | `obstacle_bumper.png` runtime | `GameScene.ts` (condition rt_) |
| Streets | pickup bonus | Halo blanc seul (db_ transparent) | `pickup_street_bonus.png` runtime | `GameScene.ts` (condition rt_) |
| Streets | obstacle foule | Rect orange procédural (db_ transparent) | `obstacle_crowd.png` runtime | `GameScene.ts` (condition rt_) |
| Fighter | pickup énergie | Halo orange seul (db_ transparent) | `pickup_energy.png` runtime | `GameScene.ts` (condition rt_) |
| OutRun | pickup checkpoint | Halo jaune seul (db_ transparent) | `pickup_checkpoint.png` runtime | `GameScene.ts` (condition rt_) |
| OutRun | obstacle traffic | Invisible (db_ transparent) | `obstacle_car.png` runtime | `GameScene.ts` (condition rt_) |
| Shinobi | pickup shuriken | Halo blanc seul (db_ transparent) | `pickup_shuriken.png` runtime | `GameScene.ts` (condition rt_) |
| Kombat | pickup token | Halo orange seul (db_ transparent) | `pickup_finish_token.png` runtime | `GameScene.ts` (condition rt_) |

---

## Icônes ajoutées

Aucun nouveau fichier ajouté dans `public/assets/`. Les SVGs et PNGs utilisés existaient déjà.

| Asset utilisé | Chemin | Usage |
|---|---|---|
| `mailbox.svg` | `public/assets/openmoji/obstacles/mailbox.svg` | `deliveryTarget` + `bossTarget` Paperboy |
| `roadblock.svg` | `public/assets/openmoji/obstacles/roadblock.svg` | `routeObstacle` Paperboy |
| `pickup_newspaper.png` | `public/assets/runtime/universes/paperboy/pickup_newspaper.png` | Pickup journal Paperboy |
| `obstacle_dog.png` | `public/assets/runtime/universes/paperboy/obstacle_dog.png` | Obstacle chien Paperboy |
| `boss_neighborhood_chaos.png` | `public/assets/runtime/universes/paperboy/boss_neighborhood_chaos.png` | Boss Paperboy |

---

## Détail technique des modifications

### `src/ui/OpenMojiIconRegistry.ts`

Ajout du registry Paperboy :
```typescript
export const PAPERBOY_OPENMOJI_ICONS = {
  deliveryTarget: { key: 'openmoji-paperboy-mailbox',   url: 'assets/openmoji/obstacles/mailbox.svg' },
  routeObstacle:  { key: 'openmoji-paperboy-roadblock', url: 'assets/openmoji/obstacles/roadblock.svg' },
} as const satisfies Record<string, OpenMojiAsset>;

export const PAPERBOY_OPENMOJI_ICON_ASSETS: OpenMojiAsset[] = Object.values(PAPERBOY_OPENMOJI_ICONS);
```

### `src/scenes/GameScene.ts`

**1. preload() — chargement SVG Paperboy :**
```typescript
if (uid === 'paperboy') {
  for (const icon of PAPERBOY_OPENMOJI_ICON_ASSETS) {
    if (!this.textures.exists(icon.key)) this.load.svg(icon.key, icon.url, { width: 64, height: 64 });
  }
}
```

**2. create() — entity texture resolver Paperboy :**
```typescript
if (uid === 'paperboy') {
  this.obstacleRenderer.setEntityTextureResolver(entity => {
    if (entity.type === 'deliveryTarget' || entity.type === 'bossTarget') {
      return this.textures.exists(PAPERBOY_OPENMOJI_ICONS.deliveryTarget.key)
        ? PAPERBOY_OPENMOJI_ICONS.deliveryTarget.key : null;
    }
    if (entity.type === 'routeObstacle') {
      return this.textures.exists(PAPERBOY_OPENMOJI_ICONS.routeObstacle.key)
        ? PAPERBOY_OPENMOJI_ICONS.routeObstacle.key : null;
    }
    return null;
  });
}
```

**3. create() — condition rt_ corrigée :**
```typescript
// Avant (bloqué par db_ transparents) :
if (rtPickup && !this.textures.exists(pickupKey)) ...

// Après (runtime toujours prioritaire) :
if (rtPickup) this.pickupRenderer.setTextureKey(rtPickup);
```

---

## Règles conservées

- Pas de changement gameplay
- Pas de changement niveau
- Pas de changement audio
- Pas de changement background
- Pas de refactor global
- OpenMoji complet non copié
- Clone OpenMoji non utilisé (SVGs déjà présents)
- Castle non modifié (utilise OpenMoji dédié, non affecté)

---

## Critères d'acceptation

- [x] `npm run build` OK — 0 erreur TypeScript, 60 modules
- [x] Paperboy normal n'affiche plus de carré vert placeholder — `deliveryTarget` → mailbox SVG
- [x] Paperboy boss n'affiche plus de carré vert pour `bossTarget` — mailbox SVG
- [x] `routeObstacle` Paperboy affiche roadblock SVG au lieu de rectangle gris
- [x] Pickup newspaper Paperboy visible (runtime PNG débloqué)
- [x] Castle non régressé — gameplay OpenMoji intact
- [x] OutRun obstacles visibles (runtime PNG débloqué)
- [x] Pas d'asset 404 — assets existants uniquement
- [x] Pas d'erreur console texture/SVG
