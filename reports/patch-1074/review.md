# Review

## Objectif

Auditer le score minimal runtime livré par PATCH 1073.

## Résultat

La QA locale valide le score runtime, les bonus pickup/clear/boss, le best score local par niveau, la persistance après reload, le non-écrasement par un score plus faible, l'affichage ClearScene/GameOver, le reset des scores avec `?resetProgress=1`, et l'absence de durcissement de difficulté observée.

Verdict : PASS avec réserve, car le test est automatisé localement via Vite + Playwright et non réalisé sur mobile réel.

## Fichiers modifiés

- reports/patch-1074/review.md
- reports/patch-1074/docs/score-runtime-qa.md
- reports/patch-1074/logs/score-results.json
- reports/patch-1074/logs/localstorage-summary.txt
- reports/patch-1074/logs/console-summary.txt
- reports/patch-1074/logs/network-summary.txt
- reports/patch-1074/screenshots/clear_score_runtime.png
- reports/patch-1074/screenshots/gameover_score_runtime.png
- reports/patch-1074/screenshots/boss_clear_score_runtime.png

## Tests / vérifications

Commandes lancées :

- `npm run check`
- Vite local + Playwright runtime QA

Résultat :

- `npm run check` : OK. Build Vite terminé avec le warning Rollup connu `chunk > 500 kB`, non bloquant.
- score runtime QA : PASS avec réserve.

Vérifications fonctionnelles :

- score initial : PASS
- pickup donne points : PASS
- clear donne bonus : PASS
- best score sauvegardé : PASS
- best score non écrasé par score plus faible : PASS
- nouveau record supérieur : PASS
- boss hit donne points : PASS
- boss clear donne bonus : PASS
- GameOver affiche score/best : PASS
- reset progress reset scores : PASS
- difficulté inchangée : PASS

## Captures

- reports/patch-1074/screenshots/clear_score_runtime.png
- reports/patch-1074/screenshots/gameover_score_runtime.png
- reports/patch-1074/screenshots/boss_clear_score_runtime.png

## Documents

- reports/patch-1074/docs/score-runtime-qa.md
- reports/patch-1074/logs/score-results.json
- reports/patch-1074/logs/localstorage-summary.txt
- reports/patch-1074/logs/console-summary.txt
- reports/patch-1074/logs/network-summary.txt

## Limites / risques

- QA automatisée locale, pas un test mobile réel manuel ;
- les transitions clear/GameOver sont pilotées par Playwright pour isoler le score ;
- warnings console WebGL `GPU stall due to ReadPixels` liés aux captures, non bloquants ;
- bonus temps non testé car il n'est pas implémenté.

## Liens GitHub

- Commit : PATCH 1074 — QA minimal score runtime
- PR : non créée
