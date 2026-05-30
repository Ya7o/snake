# Icon Candidate Visual Selection Board

## Objectif

Fournir une planche visuelle interactive permettant de choisir, parmi les candidats OpenMoji pré-sélectionnés, les icônes à intégrer dans Snake Drive V4 pour chaque niveau et chaque type d'élément de jeu. Ce document est un audit documentaire uniquement — aucune modification du gameplay ou des assets n'a été effectuée.

## Comment choisir

Pour sélectionner une icône, répondre avec l'identifiant au format :

```
levelId.iconType = cN
```

Exemples :
- `sonic_normal.pickup = c1`
- `paperboy_normal.mailbox = c3`
- `castle_boss.boss_entity = c2`

Les identifiants sont visibles directement sur chaque carte dans la planche HTML. Cliquer dessus pour les copier automatiquement.

## Fichiers

- HTML board : `reports/patch-1090b/icon-candidate-selection-board.html`
- CSV options : `reports/patch-1090b/logs/icon-selection-options.csv`
- SVG candidats : `reports/patch-1090b/preview-assets/` (92 fichiers)

## Résumé

- niveaux couverts : 16/16
- types couverts : 4/4 (pickup, obstacle, boss_entity, target)
- candidats affichés : 120
- fichiers SVG copiés : 92 (dédupliqués — certains SVG sont partagés entre plusieurs niveaux/types)

## Limites

- lisibilité réelle à valider en jeu (résolution 72px minimum recommandée)
- certains SVG peuvent être ambigus hors contexte (ex: `2747 sparkle` petit à 72px)
- aucun remplacement appliqué — seule la planche visuelle est produite
- 4 types d'icônes identifiés dans le CSV (pickup, obstacle, boss_entity, target) ; le CSV source mentionne 24 types dans l'audit précédent mais ceux-ci sont des variantes de shapes, pas des types fonctionnels distincts
- chemins invalides : aucun (92/92 fichiers présents dans openemoji)
