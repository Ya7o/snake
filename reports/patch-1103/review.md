# Review — PATCH 1103

## Objectif

Afficher une décomposition compacte du score sur les écrans Clear/GameOver pour rendre le score final compréhensible. Renommer "SCORE :" en "TOTAL :" pour cohérence avec la terminologie V2.

## Résultat

Breakdown implémenté. ClearScene affiche une ligne `PICKUPS +N` (normal) ou `BOSS +N` (boss) avant le TOTAL. GameOver affiche uniquement TOTAL + BEST (trop serré pour breakdown). Aucun gameplay modifié.

## Fichiers modifiés

| Fichier | Changement |
|---|---|
| `src/scenes/GameScene.ts` | Compteurs `pickupCount`/`bossHitCount`, reset, incréments, transmission via sceneData |
| `src/scenes/ClearScene.ts` | Import `SCORE_VALUES`, `ClearData` étendu, breakdown line, `SCORE` → `TOTAL` |
| `src/scenes/GameOverScene.ts` | `GameOverData` étendu, `SCORE` → `TOTAL` |

## Tests / vérifications

```
npm run check : OK
tsc : 0 erreur
vite build : OK (warning chunk > 500 kB attendu, non bloquant)
61 modules transformés
```

## Captures

Non disponibles (serveur dev non démarré). Changement limité au bloc score panel de ClearScene — aucun risque de régression sur layout principal.

## Documents

- `reports/patch-1103/docs/score-breakdown-clear-gameover.md`
- `reports/patch-1103/logs/score-breakdown-assertions.json`

## Limites

- Breakdown GameOver non implémenté (trop serré entre score panel et level name sur petit écran) — documenté
- Paperboy boss : seul cas avec pickups + boss hits simultanément ; breakdown affiche BOSS uniquement (bossHitCount en priorité) — edge case acceptable
- Validation mobile réelle recommandée pour panel à 5 lignes (Clear normal avec time bonus + nouveau record)

## Liens GitHub

Commit dans ce push.
