# Review — PATCH 1086

## Objectif
Améliorer la lisibilité et la difficulté des 8 niveaux normaux sans toucher aux boss.

## Résultat

| Niveau | Modification | Statut |
|---|---|---|
| Castle normal | maxWalls 2→3, spawnInterval 20→16 | ✅ |
| Sonic normal | Boost vitesse (×1.82) à chaîne complète, HUD "TURBO !" | ✅ |
| Streets normal | Attaque en ligne droite (warning→charging), max blockers 5 | ✅ |
| Street Fighter normal | Icône poing 👊 remplace logos Kombat sur sparZones | ✅ |
| OutRun normal | Icône trophée 🏆 remplace pickup générique | ✅ |
| Shinobi normal | Décoys en orbite circulaire (shuriken), vitesse π/12 par tick | ✅ |
| Mortal Kombat normal | Zones de lave 12–20 cellules (radius 2.0–2.5), max 2 zones | ✅ |
| Paperboy normal | Icône journal 📰 pour le pickup, mailbox et journal distincts | ✅ |

## Fichiers modifiés

| Fichier | Modification |
|---|---|
| `src/mechanics/BaseMechanic.ts` | `getSpeedMultiplier()` + état `'charging'` dans EntityState |
| `src/mechanics/CastleIllusionMechanic.ts` | Tuning maxWalls/spawnInterval |
| `src/mechanics/SonicRingsMechanic.ts` | Boost turbo + `getSpeedMultiplier()` override |
| `src/mechanics/StreetsCrowdMechanic.ts` | Charge attack (warning→charging) |
| `src/mechanics/ShinobiFocusMechanic.ts` | Décoys en orbite circulaire |
| `src/mechanics/KombatFatalMechanic.ts` | Zones multi-cellules (cluster circulaire) |
| `src/data/openmojiIconRegistry.ts` | Ajout `trophy` (pickups) et `fist` (obstacles) |
| `src/ui/OpenMojiIconRegistry.ts` | FIGHTER_OPENMOJI_ICONS, OUTRUN_OPENMOJI_ICONS, PAPERBOY_OPENMOJI_ICONS.newspaper |
| `src/render/ObstacleRenderer.ts` | Couleurs crowdBlocker : warning, charging, danger |
| `src/scenes/GameScene.ts` | getSpeedMultiplier, preload + wiring Fighter/OutRun/Paperboy icons |
| `public/assets/openmoji/obstacles/fist.svg` | OpenMoji 1F44A — nouveau |
| `public/assets/openmoji/pickups/trophy.svg` | OpenMoji 1F3C6 — nouveau |

## Tests / vérifications

```
npm run check
> tsc && vite build
✓ 60 modules transformed.
✓ built in 5.76s
0 erreur TypeScript.
Warning chunk > 500 kB : attendu, non bloquant.
```

## Captures

| Capture | Description |
|---|---|
| `outrun_pickup_trophy.png` | Trophée 🏆 visible comme pickup OutRun |
| `fighter_fist_obstacle.png` | Poings 👊 sur les sparZones Fighter (3 poings visibles) |
| `paperboy_newspaper_mailbox.png` | Journal 📰 comme pickup, mailbox rouge distinct |
| `kombat_lava_zones.png` | Zone de lave orange en warning (cluster multi-cellules) |

## Documents

- `docs/normal-levels-difficulty-readability-pass.md` : détail de chaque modification, paramètres, risques.

## Limites / risques

- Boss non modifiés (dans le scope de PATCH 1087).
- Score inchangé sauf Paperboy (déjà existant score:1 par livraison).
- Sonic boost : vitesse élevée peut surprendre — acceptable, c'est le reward de la chaîne.
- Kombat cluster : peut spawner proche du serpent avec seulement 8 ticks de warning.
- Shinobi décoys : orbite peut occasionnellement chevaucher la vraie cible.

## Liens GitHub
_(après push)_
