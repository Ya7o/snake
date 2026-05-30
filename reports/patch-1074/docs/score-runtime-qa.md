# Score Runtime QA

## Objectif

Valider le score minimal runtime.

## Résultats

| Test | Résultat | Notes |
|---|---|---|
| Score initial | PASS | `runtimeScore` démarre à 0 sur `castle_normal`. |
| Pickup score | PASS | Pickup utile collecté via `GameScene.update` : `runtimeScore` passe de 0 à 100. |
| Clear bonus | PASS | Clear normal après pickup : best enregistré à 600, soit 100 + 500. |
| Best score saved | PASS | Reload sans `resetProgress` : best `castle_normal` conservé à 600. |
| Best score not overwritten by lower score | PASS | GameOver avec 100 après best 600 : best reste 600. |
| Boss score | PASS | Castle boss weakpoint réel via `resolveBossWeakPoint` : +250, puis boss clear à 1250 avec +1000. |
| GameOver score | PASS | GameOver affiche `SCORE : 100` et `BEST : 600`. |
| Reset scores | PASS | `?resetProgress=1` supprime `snakeDriveV4.bestScores`. |
| Difficulté inchangée | PASS | Score runtime séparé du score de progression, pas de vitesse/niveau/obstacle modifié par PATCH 1074. |

## LocalStorage

Clé observée : `snakeDriveV4.bestScores`.

Observations :

- reset initial avec `?resetProgress=1` : clé supprimée ;
- après clear normal : `castle_normal` passe à 600 ;
- après reload sans reset : `castle_normal` reste à 600 ;
- après GameOver plus faible : `castle_normal` reste à 600 ;
- après clear plus haut : `castle_normal` passe à 1200 ;
- après boss clear : `castle_boss` vaut 1250.

Résumé final :

```text
snakeDriveV4.bestScores = {"castle_normal":1200,"castle_boss":1250}
```

## Problèmes observés

Aucun problème bloquant observé.

Notes non bloquantes :

- warnings console WebGL `GPU stall due to ReadPixels` pendant les screenshots Playwright ;
- test automatisé local, pas un test mobile réel manuel ;
- le bonus temps reste hors scope et non testé.

## Verdict

PASS avec réserve.

## Recommandation

Score v1.1 validé pour un usage local minimal. Un test mobile réel reste recommandé avant diffusion publique large.
