# Runtime Icon Size Harmonization Audit
## PATCH 1069 — Snake Drive V4

**Date** : 2026-05-30
**Type** : Audit statique — lecture code seule, aucune modification
**Contexte QA** : retours mobiles réels — icônes non homogènes. Référence positive : boîtes aux lettres Paperboy (mailbox) lisibles. Problème signalé : chiens Paperboy trop petits, autres univers potentiellement sous-taille.

---

## 1. Contexte technique

### Screen et Grid

| Paramètre | Valeur |
|-----------|--------|
| Rendu | Phaser.Scale.RESIZE — adaptatif |
| HUD height | 56px |
| Bottom margin | 24px |
| Cols × Rows (standard) | 16 × 20 |
| Cols × Rows (castle) | 16 × 26 |

### Calcul cellSize — mobile typique 390×844px (iPhone 14)

| Univers | widthFactor | cellSize estimé |
|---------|-------------|-----------------|
| castle  | 0.75 | ~18px |
| sonic   | 0.94 | ~23px |
| streets | 0.94 | ~23px |
| fighter | 0.94 | ~23px |
| outrun  | 0.78 | ~19px |
| shinobi | 0.94 | ~23px |
| kombat  | 0.94 | ~23px |
| paperboy | 0.94 | ~23px |

### Formules de rendu — source code

| Rôle | Fichier source | Formule affichage | Taille typique mobile |
|------|---------------|-------------------|----------------------|
| Pickup (image runtime) | PickupRenderer.ts:79 | `maxSize = cs * 1.9` → fitImageInCell | ~44px |
| Pickup OpenMoji (castle) | PickupRenderer.ts:79 | identique | ~34px (cs=18) |
| Obstacle (runtime PNG) | ObstacleRenderer.ts:112 | `setDisplaySize(cs * 0.74, cs * 0.74)` | ~17px |
| Obstacle (entityTexture OpenMoji) | ObstacleRenderer.ts:96 | `cs * OPENMOJI_GAMEPLAY_ICON_SCALE = cs * 1.9` | ~44px |
| Boss (runtime PNG) | ObstacleRenderer.ts:105 | `fitImageInCell(img, key, size * 1.05)` où size ≈ cs | ~22px |
| Mailbox (référence) | ObstacleRenderer.ts:96 | cs * 1.9 via entityTextureResolver | **~44px (RÉFÉRENCE)** |

---

## 2. Tableau principal — tailles et lisibilité mobile

| Univers | Objet | Fichier asset | Dims asset | Formule | Taille affichée | Lisibilité mobile | vs Mailbox (44px) | Problème | Recommandation |
|---------|-------|---------------|-----------|---------|----------------|-------------------|-------------------|----------|----------------|
| Castle | Pickup baguette magique | openmoji SVG | 64×64 | cs × 1.9 | ~34px | OK | −23% | cs plus petit (18) | ✓ OK |
| Castle | Pickup gemme | openmoji SVG | 64×64 | cs × 1.9 | ~34px | OK | −23% | — | ✓ OK |
| Castle | Obstacle blinkWall feu/briques | openmoji SVG | 64×64 | cs × 1.9 | ~34px | OK | −23% | — | ✓ OK |
| Castle | Boss WitchMirror | openmoji SVG | 64×64 | cs × 1.9 | ~34px | OK | −23% | — | ✓ OK |
| Sonic | Pickup ring | pickup_ring.png | 256×256 | cs × 1.9 | ~44px | OK | = | — | ✓ OK |
| Sonic | Obstacle bumper | obstacle_bumper.png | 253×256 | cs × 0.74 | **~17px** | TROP PETIT | −61% | 61% sous la référence | Passer à cs × 1.2 min |
| Sonic | Boss loop serpent | boss_loop_serpent.png | 256×249 | cs ~1.0 | **~22px** | TROP PETIT | −50% | Même taille qu'un obstacle | Passer à cs × 1.5 min |
| Streets | Pickup street bonus | pickup_street_bonus.png | 250×256 | cs × 1.9 | ~44px | OK | = | — | ✓ OK |
| Streets | Obstacle crowd | obstacle_crowd.png | 256×254 | cs × 0.74 | **~17px** | TROP PETIT | −61% | 61% sous la référence | Passer à cs × 1.2 min |
| Streets | Boss crime lord | boss_crime_lord.png | 187×256 | cs ~1.0 | **~16×22px** | TROP PETIT | −50% | Portrait 0.73:1, rétréci en largeur par fitImageInCell | cs × 1.5 + recadrer asset 1:1 |
| Fighter | Pickup energy | pickup_energy.png | 250×256 | cs × 1.9 | ~44px | OK | = | — | ✓ OK |
| Fighter | Obstacle charge marker | obstacle_charge_marker.png | 236×256 | cs × 0.74 | **~17px** | TROP PETIT | −61% | Trop petit | Passer à cs × 1.2 min |
| Fighter | Boss final challenger | boss_final_challenger.png | 217×256 | cs ~1.0 | **~18×22px** | TROP PETIT | −50% | Portrait 0.85:1 | cs × 1.5 |
| OutRun | Pickup checkpoint | pickup_checkpoint.png | 160×256 | cs × 1.9 | **~22×36px** | MAL ALIGNÉ | −18% h | Portrait 0.625:1 dans cell carrée — asymétrique | Recadrer asset en 1:1 |
| OutRun | Obstacle car | obstacle_car.png | 256×160 | cs × 0.74 | **~14×14px** | CRITIQUE | −68% | cs plus petit (19) + aspect 1.6:1 forcé 14px | Priorité : cs × 1.4 + asset 1:1 |
| OutRun | Boss turbo rival | boss_turbo_rival.png | 256×165 | cs ~1.0 | **~22×14px** | CRITIQUE | −68% | Aspect 1.55:1 + fitImageInCell → très aplati | Recadrer asset 1:1 + cs × 1.5 |
| Shinobi | Pickup shuriken | pickup_shuriken.png | 256×256 | cs × 1.9 | ~44px | OK | = | — | ✓ OK |
| Shinobi | Obstacle decoy | obstacle_decoy.png | 251×256 | cs × 0.74 | **~17px** | TROP PETIT | −61% | Trop petit | Passer à cs × 1.2 min |
| Shinobi | Boss shadow ninja | boss_shadow_ninja.png | 256×250 | cs ~1.0 | **~22px** | TROP PETIT | −50% | Identique obstacle en taille | cs × 1.5 |
| Kombat | Pickup finish token | pickup_finish_token.png | 239×256 | cs × 1.9 | ~44px | OK | = | — | ✓ OK |
| Kombat | Obstacle fatal zone | obstacle_fatal_zone.png | 235×256 | cs × 0.74 | **~17px** | TROP PETIT | −61% | Trop petit | Passer à cs × 1.2 min |
| Kombat | Boss dragon gate | boss_dragon_gate.png | 243×256 | cs ~1.0 | **~22px** | TROP PETIT | −50% | — | cs × 1.5 |
| Paperboy | Pickup newspaper | pickup_newspaper.png | 256×191 | cs × 1.9 | ~44×33px | OK | ok | Landscape 1.34:1 — acceptable | ✓ OK |
| Paperboy | Mailbox (deliveryTarget) | mailbox.svg | 64×64 | cs × 1.9 | **~44px** | **RÉFÉRENCE ✓** | = | — | **RÉFÉRENCE** |
| Paperboy | Roadblock (routeObstacle) | roadblock.svg | 64×64 | cs × 1.9 | ~44px | OK | = | Remplace le chien en runtime normal | ✓ OK (voir §3) |
| Paperboy | Chien (obstacle_dog.png) | obstacle_dog.png | 256×170 | **DEAD** | **n/a** | **ASSET MORT** | — | Jamais affiché en runtime normal | Corriger routing (voir §3) |
| Paperboy | Boss chaosObstacle (obstacles mobiles) | procédural | — | procédural | ~cell proc | MOYEN | −50% | Aucune image — blob orange | Relier à boss_neighborhood_chaos.png |
| Paperboy | Boss neighborhood chaos (image) | boss_neighborhood_chaos.png | 256×233 | cs ~1.0 | **~22px** | TROP PETIT | −50% | Affiché pour bossTarget, pas chaosObstacle | cs × 1.5 |

---

## 3. Analyse approfondie — cas Paperboy chien (issue QA principale)

### Routing actuel du chien dans le code

```
GameScene.preload()
  → preloadRuntimeAssets(scene, 'paperboy', isBoss)
  → charge obstacle_dog.png → key: rt_paperboy_obstacle

GameScene.create()
  → obstacleRenderer.setObstacleTextureKey('rt_paperboy_obstacle')  // chien enregistré
  → obstacleRenderer.setEntityTextureResolver(entity => {
      if (entity.type === 'routeObstacle') return roadblock.svg     // ← INTERCEPTION (prioritaire)
      if (entity.type === 'deliveryTarget') return mailbox.svg
      return null
    })
```

### Ordre de priorité dans ObstacleRenderer.draw()

```
1. entityTextureResolver → hasEntityTexture → cs × 1.9   ← roadblock.svg intercepte routeObstacle
2. isBossType && hasBossTexture → fitImageInCell ~cs
3. OBSTACLE_IMAGE_TYPES && hasObstacleTexture → cs × 0.74 ← chien ici, mais jamais atteint
4. drawEntity() → procédural
```

### Conséquence

- `routeObstacle` → roadblock.svg à **1.9× cell (~44px)** → lisible, mais c'est le ROADBLOCK, pas le chien
- `obstacle_dog.png` n'est **jamais affiché en fonctionnement normal**
- Cas fallback : si roadblock.svg échoue à charger → entityTextureKey = null → branche 3 → chien à **cs × 0.74 (~17×17px forcé)** → illisible sur mobile
- Le rapport QA "chiens trop petits" correspond probablement à ce fallback sur certains appareils où le SVG ne se charge pas à temps

### Impact boss Paperboy

- `chaosObstacle` (obstacles mobiles boss fight) : absent de OBSTACLE_IMAGE_TYPES et BOSS_ENTITY_TYPES → drawEntity() procédural → blob orange ~cs
- `bossTarget` → mailbox.svg via resolver → 1.9× cell (lisible)
- `boss_neighborhood_chaos.png` chargée mais uniquement active pour les entités bossTarget, pas chaosObstacle

---

## 4. Classification de lisibilité

| Statut | Objets concernés |
|--------|-----------------|
| ✓ OK | Pickups tous univers (cs×1.9), Castle obstacles OpenMoji (cs×1.9), Paperboy mailbox (cs×1.9), Paperboy roadblock (cs×1.9) |
| ⚠ TROP PETIT | Obstacles runtime PNG tous univers (cs×0.74 ≈17px), Boss runtime PNG tous univers (≈cs ≈22px) |
| 🔴 CRITIQUE | OutRun car (~14×14px), OutRun boss turbo_rival (~22×14px aplati) |
| 💀 ASSET MORT | Paperboy dog — enregistré mais jamais affiché |
| ↔ MAL ALIGNÉ | OutRun checkpoint portrait dans cell carrée (22×36px), Streets crime lord portrait rétréci (16×22px) |
| □ PROCÉDURAL SEUL | Paperboy chaosObstacle (boss fight) — aucune image |

---

## 5. Recommandations prioritaires

### P1 — Obstacles runtime PNG : passer de 0.74× à 1.2× minimum
**Affecte** : sonic bumper, streets crowd, fighter charge_marker, outrun car, shinobi decoy, kombat fatal_zone
**Fichier** : `src/render/ObstacleRenderer.ts:112`
Remplacer `setDisplaySize(cs * 0.74, cs * 0.74)` par fitImageInCell avec maxSize = cs × 1.2

### P2 — Boss runtime PNG : passer de ~1× à 1.5× minimum
**Affecte** : tous les boss PNG (8 univers)
**Fichier** : `src/render/ObstacleRenderer.ts:105`
Remplacer `size * 1.05` par maxSize = cs × 1.5 absolu

### P3 — Paperboy dog : corriger le routing ou décider d'un rôle clair
- **Option A** : Remplacer roadblock.svg par le chien dans l'entityTextureResolver pour `routeObstacle` → chien affiché à 1.9× cell
- **Option B** : Mapper `chaosObstacle` au chien via une nouvelle entrée dans OBSTACLE_IMAGE_TYPES ou BOSS_ENTITY_TYPES
- **Option C** : Supprimer `obstacle_dog.png` si le roadblock est définitif

### P4 — OutRun assets : recadrer en 1:1
`obstacle_car.png` (256×160) et `boss_turbo_rival.png` (256×165) → padding vertical jusqu'à 256×256
Évite l'aplatissement lors du `setDisplaySize` forcé

### P5 — OutRun pickup_checkpoint : asymétrie portrait
`pickup_checkpoint.png` (160×256) affiché 22×36px dans cell ~23×23 — incohérent visuellement
Recadrer l'asset en 1:1 avec padding latéral

---

## 6. Résumé chiffré

| Métrique | Valeur |
|----------|--------|
| Objets audités | 28 |
| Statut OK | 11 (39%) |
| Trop petit | 11 (39%) |
| Critique | 2 (7%) |
| Asset mort | 1 (4%) |
| Mal aligné | 2 (7%) |
| Procédural seul | 1 (4%) |
| Référence mailbox (cible) | ~44px (cs × 1.9) |
| Obstacles actuels | ~17px (cs × 0.74) — **61% sous la référence** |
| Boss actuels | ~22px (cs × 1.0) — **50% sous la référence** |
