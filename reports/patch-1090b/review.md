# Review

## Objectif

Créer une planche visuelle de sélection des candidats OpenMoji pour Snake Drive V4 (PATCH 1090B). Audit documentaire uniquement — aucune modification de src/, public/assets/, design_boards/openemoji, package.json ni du gameplay.

## Résultat

Planche HTML interactive générée avec 120 candidats affichés sur 16 niveaux et 4 types d'icônes. 92 SVG OpenMoji copiés dans `preview-assets/` (dédupliqués depuis le CSV source de 120 lignes). Aucun SVG manquant — tous les 92 chemins uniques du CSV sont valides dans `/home/kali/apps/snake/design_boards/openemoji/color/svg/`.

## Fichiers modifiés

- `reports/patch-1090b/review.md`
- `reports/patch-1090b/icon-candidate-selection-board.html`
- `reports/patch-1090b/docs/icon-candidate-selection-board.md`
- `reports/patch-1090b/logs/icon-selection-options.csv`
- `reports/patch-1090b/preview-assets/` (92 SVG copiés)

## Tests / vérifications

Commandes lancées : `npm run check`
Résultat : OK (aucune modification des fichiers src/ ou package.json — check passe)

## Captures

Aucune. Le HTML est le livrable visuel principal.

## Documents

- `reports/patch-1090b/icon-candidate-selection-board.html` — planche visuelle (98 KB)
- `reports/patch-1090b/docs/icon-candidate-selection-board.md` — guide de sélection
- `reports/patch-1090b/logs/icon-selection-options.csv` — CSV simplifié avec selection_id

## Limites / risques

- lisibilité réelle à valider en jeu (résolution 72px minimum)
- certains candidats peuvent être ambigus (ex: 2747 sparkle petit à 72px, 26AA white circle — faible contraste fond sombre)
- aucun remplacement appliqué — décision appartient au reviewer
- chemins invalides : aucun (0 manquants)
- note : le CSV source liste 4 types fonctionnels (pickup, obstacle, boss_entity, target) ; la documentation PATCH 1090 mentionne 24 types qui correspondent aux shapes procédurales, pas aux types fonctionnels

## Liens GitHub

- Commit : 347a25d

---

## Révision 1090B-v2

**Date** : 2026-05-30

### Objectif de la révision

Refaire complètement le HTML de sélection pour afficher :
1. L'icône actuelle (colonne ACTUEL) pour chaque type d'icône
2. Tous les types d'icônes réels identifiés dans le code source (pas seulement 4)

### Types d'icônes réels identifiés : 27 types uniques, 36 instances sur 16 niveaux

| Niveau | Types d'icônes affichés |
|--------|------------------------|
| castle_normal | pickup, obstacle_blinkWall |
| castle_boss | boss_witchMirror, pickup_weakpoint |
| sonic_normal | pickup_ring, obstacle_chainRing |
| sonic_boss | boss_loopSerpent, pickup_ring |
| streets_normal | pickup_bonus, obstacle_crowdBlocker |
| streets_boss | boss_crimeLord, pickup_bonus |
| fighter_normal | pickup_energy, obstacle_sparZone, indicator_chargeGlow |
| fighter_boss | boss_finalChallenger, pickup_energy |
| outrun_normal | pickup_checkpoint, obstacle_trafficBlock |
| outrun_boss | boss_turboRival, special_turboZone, pickup_checkpoint |
| shinobi_normal | pickup_shuriken, obstacle_focusDecoy |
| shinobi_boss | boss_shadowNinja, pickup_shuriken |
| kombat_normal | pickup_finishToken, obstacle_fatalZone |
| kombat_boss | boss_dragonGate, pickup_finishToken |
| paperboy_normal | pickup_newspaper, target_deliveryTarget, obstacle_routeObstacle |
| paperboy_boss | boss_chaosObstacle, target_bossTarget, pickup_newspaper |

### Icône actuelle affichée

Oui. Colonne 0 de chaque rangée (badge ambre ACTUEL) :
- Source exacte (procedural / runtime PNG / OpenMoji inline)
- Description de la forme dessinée ou de l'asset chargé
- Valeur exacte dans le code (chemin fichier, nom de fonction)

### Fichiers modifiés

- reports/patch-1090b/icon-candidate-selection-board.html — refait intégralement (119 KB, 36 types x 6 colonnes)
- reports/patch-1090b/build_board.py — script Python de génération (conservé)
- reports/patch-1090b/review.md — cette mise à jour

### Tests

- npm run check : OK (aucune modification src/ ni package.json)
- Code/assets src/ inchangés : oui
- SVG manquants : 0 (82 SVG candidats présents dans preview-assets/)

### Commit HEAD au moment du refactoring

72db133
