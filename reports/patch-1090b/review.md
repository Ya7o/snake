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

---

## Révision 1090B-v3

**Date** : 2026-05-30

### Objectif de la révision

1. Passer à 10 candidats OpenMoji par type d'icône (vs 5 en v2)
2. Gérer et afficher les états multiples visuels pour chaque type concerné
3. Recommandations de paires pour les types à 2 états visuels distincts

### Types à états multiples identifiés : 14 types

| Type | États |
|------|-------|
| obstacle_blinkWall | ghost / warning / active |
| obstacle_chainRing | active / inactive |
| obstacle_crowdBlocker | static / moving / warning / charging / danger |
| obstacle_fatalZone | warning / active |
| obstacle_focusDecoy | real / decoy |
| target_deliveryTarget | highlighted / idle |
| target_bossTarget | highlighted / idle |
| boss_witchMirror | idle / warning / attacking / vulnerable / hit / defeated |
| boss_loopSerpent | orb / body |
| boss_crimeLord | pressure / vulnerable |
| boss_finalChallenger | idle / attack_window / counter |
| boss_turboRival | moving / turboZone |
| boss_shadowNinja | real / shadow |
| boss_dragonGate | closed / opening / danger / vulnerable |

### Statistiques

- 16 niveaux couverts
- 36 types d'icônes (27 + zones secondaires)
- 10 candidats par type = 360 candidats total
- 124 SVG uniques copiés dans preview-assets/
- 0 SVG manquants
- Paires recommandées : 1F512/1F513 (blinkWall), 1FA99/26AA (chainRing), 1F3C3/1F6B6 (crowdBlocker), 1F525/26A0 (fatalZone), 1F977/1F441 (focusDecoy/shadowNinja), 1F4EA/1F4EC (deliveryTarget/bossTarget)

### Fichiers modifiés

- reports/patch-1090b/icon-candidate-selection-board.html — refait v3 (280 KB, 36 types x 11 colonnes)
- reports/patch-1090b/build_board_v3.py — nouveau script Python v3
- reports/patch-1090b/logs/icon-selection-options.csv — 360 lignes, colonnes enrichies
- reports/patch-1090b/preview-assets/ — 124 SVG (remplacés)
- reports/patch-1090b/review.md — cette mise à jour

### Tests

- npm run check : OK (aucune modification src/ ni package.json)
- Code/assets src/ inchangés : oui
- SVG manquants : 0

### Commit HEAD au moment du refactoring

a628865
