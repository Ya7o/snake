# Review — PATCH 1102

## Objectif

Ajouter des popups de score courts et lisibles au moment des événements pickup et boss hit. Feedback immédiat sans modifier le calcul du score ni le layout.

## Résultat

Popups `+100` (pickup) et `+250` (boss hit) implémentés. Texte flottant or, monte et s'efface en 650 ms. Aucun gameplay modifié.

## Fichiers modifiés

| Fichier | Changement |
|---|---|
| `src/scenes/GameScene.ts` | Import `UI_FONT`, méthode `spawnScorePopup()`, appels sur pickup et boss hit |

## Tests / vérifications

```
npm run check : OK
tsc : 0 erreur
vite build : OK (warning chunk > 500 kB attendu, non bloquant)
61 modules transformés
```

## Captures

Non disponibles (serveur dev non démarré). Changement limité à 3 lignes de code + 1 méthode — aucun risque de régression layout.

## Documents

- `reports/patch-1102/docs/score-popups.md`
- `reports/patch-1102/logs/score-popup-assertions.json`

## Limites

- Popup stage/boss clear non ajouté (transition trop rapide, redondant avec écran résultat)
- Pas de combo, pas de breakdown (respectivement non demandés, prévu PATCH 1103)
- Validation mobile réelle recommandée pour vérifier lisibilité sur petit écran

## Liens GitHub

Commit dans ce push.
