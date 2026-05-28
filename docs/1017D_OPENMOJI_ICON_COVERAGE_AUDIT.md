# PATCH 1017D — OpenMoji Icon Coverage Audit

## Objectif

Auditer la couverture icônes/pickups/obstacles/boss et identifier les placeholders.
Ce patch est un **audit uniquement** — aucune modification du jeu.

---

## Résumé

| Univers  | Pickup icon        | Obstacle icon     | Boss icon          | Placeholder détecté ?                   | Statut        |
|----------|--------------------|-------------------|--------------------|-----------------------------------------|---------------|
| castle   | OpenMoji (gem.svg) | OpenMoji (castle) | OpenMoji (boss.svg)| Non — complet                           | ✅ OK         |
| sonic    | Transparent PNG    | Transparent PNG   | Transparent PNG    | Oui — db_ placeholders + halo seul      | ⚠️ Partiel    |
| streets  | Transparent PNG    | Transparent PNG   | Transparent PNG    | Oui — db_ placeholders + halo seul      | ⚠️ Partiel    |
| fighter  | Transparent PNG    | Transparent PNG   | Transparent PNG    | Oui — db_ placeholders + halo seul      | ⚠️ Partiel    |
| outrun   | Transparent PNG    | Transparent PNG   | Transparent PNG    | Oui — db_ placeholders + halo seul      | ⚠️ Partiel    |
| shinobi  | Transparent PNG    | Transparent PNG   | Transparent PNG    | Oui — db_ placeholders + halo seul      | ⚠️ Partiel    |
| kombat   | Transparent PNG    | Transparent PNG   | Transparent PNG    | Oui — db_ placeholders + halo seul      | ⚠️ Partiel    |
| paperboy | Transparent PNG    | Transparent PNG   | Transparent PNG    | Oui — **carré vert deliveryTarget**     | 🔴 Critique   |

---

## Cause racine — Le bug du carré vert (Paperboy)

### Chaîne de rendu défectueuse (commune à tous les 7 univers non-Castle)

```
public/assets/universes/{uid}/pickup_01.png
  → 32x32 PNG, ~130–325 octets, RGBA = #000000 alpha=0 (entièrement transparent)
  → Phaser.textures.exists('db_{uid}_pickup01') = TRUE
  → pickupRenderer.setTextureKey('db_{uid}_pickup01') est appelé
  → Condition runtime : if (rtPickup && !textures.exists(pickupKey)) → FALSE
  → pickup_newspaper.png / autres runtime JAMAIS chargés
  → Rendu : image transparente + halo de couleur accent seulement
```

**Les fichiers `db_` non-Castle sont des PNG valides mais entièrement transparents.
Leur existence dans le cache de textures court-circuite le fallback runtime.**

### Carré vert spécifique à Paperboy

L'entité `deliveryTarget` (case où livrer le journal) est rendue par `ObstacleRenderer.drawEntity()` :

```typescript
case 'deliveryTarget':
case 'bossTarget': {
  this.gfx.fillStyle(color, 0.8);
  this.gfx.fillRect(px - s, py - s, s * 2, s * 2);   // ← carré plein
  this.gfx.strokeRect(px - s, py - s, s * 2, s * 2);
}
```

`color` = `ENTITY_COLORS.deliveryTarget.idle` = `0x27ae60`
= même valeur que `paperboy.palette.primary` = `#27ae60` = **vert**

→ **Carré vert = deliveryTarget en état idle, rendu sans icône dédiée.**

`deliveryTarget` n'est pas dans `OBSTACLE_IMAGE_TYPES` → jamais promu vers le rendu image.

---

## Détail par univers

### Castle ✅

| Rôle          | Asset utilisé                                | Mécanisme         |
|---------------|----------------------------------------------|-------------------|
| pickup_01     | `openmoji/castle/gem.svg` (64×64)           | OpenMoji registry |
| pickup_02     | `openmoji/castle/orb.svg`                   | OpenMoji registry |
| obstacle_01   | `openmoji/castle/warning.svg` (blinkWall)   | EntityResolver    |
| obstacle_02   | `openmoji/castle/magic.svg` (ghost state)   | EntityResolver    |
| boss          | `openmoji/castle/boss_fallback.svg`         | EntityResolver    |

- Aucun placeholder. Entités avec résolution contextuelle par état (ghost/warning/attacking/vulnerable).
- `db_castle_*.png` — réels (64×64, 6–19 Ko), utilisés comme fond/fallback.

---

### Sonic ⚠️

| Rôle              | db_ asset (chargé)              | Runtime asset (bloqué)              | Rendu effectif          |
|-------------------|---------------------------------|-------------------------------------|-------------------------|
| pickup (anneau)   | transparent 32×32 (213B)        | `pickup_ring.png` (256×? réel)      | Halo jaune seul         |
| obstacle (bumper) | transparent 32×32 (170B)        | `obstacle_bumper.png`               | Cercle procédural seul  |
| boss (serpent)    | transparent 48×48 (210B)        | `boss_loop_serpent.png`             | Glow procédural + invis.|
| chainRing         | —                               | —                                   | Procédural ✓ (bon)      |

- pickup procédural : forme `ring` (cercle creux) — acceptable mais pas de l'animo
- Entité `chainRing` : rendu procédural dédié — **correctement lisible**

---

### Streets ⚠️

| Rôle              | db_ asset (chargé)              | Runtime asset (bloqué)              | Rendu effectif          |
|-------------------|---------------------------------|-------------------------------------|-------------------------|
| pickup (bonus)    | transparent 32×32 (233B)        | `pickup_street_bonus.png`           | Halo blanc seul         |
| obstacle (foule)  | transparent 32×32 (135B)        | `obstacle_crowd.png`                | Rect orange procédural  |
| boss (crime lord) | transparent 48×48 (209B)        | `boss_crime_lord.png`               | Glow rouge procédural   |
| crowdBlocker      | —                               | —                                   | Rect orange procédural  |

- pickup procédural : forme `diamond`
- Entité `crowdBlocker` dans OBSTACLE_IMAGE_TYPES mais texture transparente → invisible

---

### Fighter ⚠️

| Rôle              | db_ asset (chargé)              | Runtime asset (bloqué)              | Rendu effectif          |
|-------------------|---------------------------------|-------------------------------------|-------------------------|
| pickup (énergie)  | transparent 32×32 (244B)        | `pickup_energy.png`                 | Halo orange seul        |
| obstacle (charge) | transparent 32×32 (137B)        | `obstacle_charge_marker.png`        | Cercle de charge proc.  |
| boss (challenger) | transparent 48×48 (325B)        | `boss_final_challenger.png`         | Glow rouge procédural   |
| chargeGlow        | —                               | —                                   | Procédural ✓ (ok)       |

- pickup procédural : forme `lightning`
- `chargeGlow` type non dans OBSTACLE_IMAGE_TYPES → procédural, mais explicitement dessiné (cercles orange) — bon

---

### OutRun ⚠️

| Rôle              | db_ asset (chargé)              | Runtime asset (bloqué)              | Rendu effectif          |
|-------------------|---------------------------------|-------------------------------------|-------------------------|
| pickup (checkpoint)| transparent 32×32 (132B)       | `pickup_checkpoint.png`             | Halo jaune seul         |
| obstacle (voiture) | transparent 32×32 (168B)       | `obstacle_car.png`                  | Rect rose procédural    |
| boss (rival)      | transparent 48×48 (213B)        | `boss_turbo_rival.png`              | Glow rose procédural    |
| trafficBlock      | —                               | dans OBSTACLE_IMAGE_TYPES           | Transparent → invisible |

- pickup procédural : forme `triangle` (flèche)
- `trafficBlock` est dans OBSTACLE_IMAGE_TYPES mais texture transparente → **rendu invisible**

---

### Shinobi ⚠️

| Rôle              | db_ asset (chargé)              | Runtime asset (bloqué)              | Rendu effectif          |
|-------------------|---------------------------------|-------------------------------------|-------------------------|
| pickup (shuriken) | transparent 32×32 (174B)        | `pickup_shuriken.png`               | Halo blanc seul         |
| obstacle (decoy)  | transparent 32×32 (161B)        | `obstacle_decoy.png`                | Diamant cyan procédural |
| boss (shadow)     | transparent 48×48 (228B)        | `boss_shadow_ninja.png`             | Glow cyan procédural    |
| focusTarget       | —                               | —                                   | Diamant (real/decoy) ✓  |

- pickup procédural : forme `cross` (shuriken approximatif)
- `focusTarget` rendu procédural spécialisé real/decoy — **correctement lisible**

---

### Kombat ⚠️

| Rôle              | db_ asset (chargé)              | Runtime asset (bloqué)              | Rendu effectif          |
|-------------------|---------------------------------|-------------------------------------|-------------------------|
| pickup (token)    | transparent 32×32 (220B)        | `pickup_finish_token.png`           | Halo orange seul        |
| obstacle (zone)   | transparent 32×32 (134B)        | `obstacle_fatal_zone.png`           | Rect rouge procédural   |
| boss (dragon)     | transparent 48×48 (215B)        | `boss_dragon_gate.png`              | Glow rouge procédural   |
| fatalZone         | —                               | dans OBSTACLE_IMAGE_TYPES           | Transparent → invisible |
| dangerZone        | —                               | dans OBSTACLE_IMAGE_TYPES           | Transparent → invisible |

---

### Paperboy 🔴

| Rôle              | db_ asset (chargé)              | Runtime asset (bloqué)              | Rendu effectif          |
|-------------------|---------------------------------|-------------------------------------|-------------------------|
| pickup (journal)  | transparent 32×32 (151B)        | `pickup_newspaper.png` (256×191)    | **Halo jaune seul**     |
| obstacle (chien)  | transparent 32×32 (170B)        | `obstacle_dog.png` (256×170)        | Rect gris procédural    |
| boss (chaos)      | transparent 48×48 (227B)        | `boss_neighborhood_chaos.png`       | Glow orange procédural  |
| deliveryTarget    | — (non dans OBSTACLE_IMAGE_TYPES)| `obstacles/mailbox.svg` (OpenMoji) | **Carré vert 0x27ae60** |
| routeObstacle     | dans OBSTACLE_IMAGE_TYPES       | texture transparente                | **Rendu invisible**     |
| bossTarget        | — (non dans OBSTACLE_IMAGE_TYPES)| —                                  | Carré vert 0x27ae60     |
| chaosObstacle     | dans BOSS_ENTITY_TYPES          | boss texture transparente           | Glow procédural         |

**Cause du carré vert :**
`deliveryTarget.idle` color = `0x27ae60` = vert exact = `paperboy.palette.primary`
Entity type absent de `OBSTACLE_IMAGE_TYPES` → `drawEntity()` → `fillRect` → **carré vert plein**

---

## Paperboy focus

### pickup journal / livraison
- **État actuel** : image transparente (`db_paperboy_pickup01.png`, 32×32, 151B, alpha=0)
- **Visible** : halo jaune (`accent = #f1c40f`) seulement — aucune silhouette de journal
- **Runtime** : `pickup_newspaper.png` (256×191) existe mais est bloqué par le db_ transparent
- **OpenMoji disponible** : `pickups/newspaper.svg` (1F5DE) ✓

### obstacle chien / boîte aux lettres / poubelle
- Chien (`routeObstacle`) : dans OBSTACLE_IMAGE_TYPES, mais texture transparente → invisible
- `obstacle_dog.png` (256×170) existe en runtime mais bloqué
- OpenMoji pour les obstacles de route : `obstacles/roadblock.svg`, `obstacles/cone.svg`, `obstacles/barrel.svg`

### boss neighborhoodChaos
- `boss_neighborhood_chaos.png` (256×233) existe mais bloqué par `db_paperboy_boss.png` transparent
- `chaosObstacle` entities → glow procédural orange (`0xe67e22`)
- `bossTarget` entities → carré vert (même problème que deliveryTarget)
- OpenMoji : `boss/skull.svg` (1F480) ou `danger/fire.svg`

### Cause du carré vert — synthèse
1. `deliveryTarget` n'est pas dans `OBSTACLE_IMAGE_TYPES`
2. Aucun `entityTextureResolver` défini pour Paperboy (contrairement à Castle)
3. Fallback `drawEntity()` : `fillRect` avec `color = ENTITY_COLORS.deliveryTarget.idle = 0x27ae60`
4. `0x27ae60` = vert = même valeur que `paperboy.palette.primary`

---

## OpenMoji candidates

Les icônes suivantes sont **déjà présentes** dans `public/assets/openmoji/` et peuvent être utilisées directement pour enrichir les univers.

| Usage                     | OpenMoji candidat                 | Chemin dans projet                         | Code Unicode | Commentaire                              |
|---------------------------|-----------------------------------|--------------------------------------------|-------------|------------------------------------------|
| **Paperboy** pickup journal | newspaper.svg                   | `openmoji/pickups/newspaper.svg`           | 1F5DE       | Parfait match thème livraison journal    |
| **Paperboy** deliveryTarget | mailbox.svg                     | `openmoji/obstacles/mailbox.svg`           | 1F4EB       | Boîte aux lettres — correspond exactement|
| **Paperboy** routeObstacle  | roadblock.svg / cone.svg        | `openmoji/obstacles/roadblock.svg`         | 26D4        | No entry = obstacle de rue               |
| **Paperboy** boss chaos     | skull.svg                       | `openmoji/boss/skull.svg`                  | 1F480       | Boss final                               |
| **Sonic** pickup anneau     | ring.svg                        | `openmoji/pickups/ring.svg`                | 1F48D       | Anneau exact                             |
| **Sonic** boss Loop Serpent | portal.svg                      | `openmoji/boss/portal.svg`                 | 1F300       | Tourbillon / boucle                      |
| **Streets** pickup bonus    | gem.svg                         | `openmoji/pickups/gem.svg`                 | 1F48E       | Bonus jeton de rue                       |
| **Streets** obstacle foule  | roadblock.svg                   | `openmoji/obstacles/roadblock.svg`         | 26D4        | Bloqueur de foule                        |
| **Streets** boss Crime Lord | skull.svg                       | `openmoji/boss/skull.svg`                  | 1F480       | Boss criminel                            |
| **Fighter** pickup énergie  | turbo.svg (⚡)                  | `openmoji/pickups/turbo.svg`               | 26A1        | Énergie combat                           |
| **Fighter** boss Challenger | crossed_swords.svg              | `openmoji/boss/crossed_swords.svg`         | 2694        | Duelliste final                          |
| **OutRun** pickup checkpoint| turbo.svg (⚡)                  | `openmoji/pickups/turbo.svg`               | 26A1        | Vitesse / checkpoint                     |
| **OutRun** obstacle traffic | cone.svg                        | `openmoji/obstacles/cone.svg`              | 1F6A7       | Cône de circulation                      |
| **OutRun** boss Turbo Rival | shield.svg                      | `openmoji/boss/shield.svg`                 | 1F6E1       | Bouclier véhicule                        |
| **Shinobi** pickup shuriken | magic_star.svg (✨)             | `openmoji/pickups/magic_star.svg`          | 2728        | Étoile shuriken                          |
| **Shinobi** obstacle decoy  | stone.svg                       | `openmoji/obstacles/stone.svg`             | 1FAA8       | Leurre / pierre                          |
| **Shinobi** boss Shadow     | skull.svg                       | `openmoji/boss/skull.svg`                  | 1F480       | Ninja de l'ombre                         |
| **Kombat** pickup token     | shield.svg                      | `openmoji/pickups/shield.svg`              | 1F6E1       | Token de victoire                        |
| **Kombat** fatalZone        | fire.svg / danger/fire.svg      | `openmoji/danger/fire.svg`                 | 1F525       | Zone fatale                              |
| **Kombat** boss Dragon Gate | dragon.svg                      | `openmoji/boss/dragon.svg`                 | 1F409       | Dragon exact                             |

---

## Recommandation

### PATCH 1018D — OpenMoji Icon Mapping Pass

**Objectif** : corriger les placeholders transparents et câbler les icônes OpenMoji existantes pour les 7 univers non-Castle.

**Actions proposées** (sans modifier Castle, gameplay, niveaux ou boss) :

1. **Corriger la condition de fallback runtime** dans `GameScene.ts` :
   ```typescript
   // Actuel (buggé) :
   if (rtPickup && !this.textures.exists(pickupKey)) ...
   
   // Proposé : tester si la texture est non-vide en plus d'exister
   // OU : ne pas charger les db_ transparents du tout pour les non-Castle
   ```
   Alternative plus propre : supprimer les db_ transparents pour les 7 univers non-Castle (ils ne sont que des gitkeep déguisés en PNG).

2. **Câbler un `entityTextureResolver` pour Paperboy** similaire à Castle, mappant :
   - `deliveryTarget` → `openmoji/obstacles/mailbox.svg`
   - `routeObstacle` → `openmoji/obstacles/roadblock.svg`
   - `chaosObstacle` / `bossTarget` → `openmoji/boss/skull.svg`

3. **Étendre `OBSTACLE_IMAGE_TYPES`** pour inclure `deliveryTarget` et `bossTarget`.

4. **Charger les SVGs OpenMoji** pour les univers qui en ont besoin (au minimum Paperboy), en suivant le même pattern que `CASTLE_OPENMOJI_ICON_ASSETS`.

**Priorité** :
- 🔴 P0 : Paperboy `deliveryTarget` vert → `mailbox.svg`
- 🔴 P0 : Paperboy pickup → `newspaper.svg` (runtime ou OpenMoji)
- 🟠 P1 : Débloquer le runtime fallback pour tous les 7 univers (pickup + obstacle + boss)
- 🟡 P2 : Câbler OpenMoji pour Sonic, Streets, Fighter (ring, gem, turbo)
- 🟢 P3 : Câbler OpenMoji pour OutRun, Shinobi, Kombat

**Fichiers à modifier dans 1018D** :
- `src/scenes/GameScene.ts` (condition fallback + resolver Paperboy)
- `src/ui/OpenMojiIconRegistry.ts` (ajouter registries Paperboy / autres univers)
- `src/render/ObstacleRenderer.ts` (OBSTACLE_IMAGE_TYPES)

**Ne pas modifier** : gameplay, mécaniques, niveaux, boss, assets existants.
