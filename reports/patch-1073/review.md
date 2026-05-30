# Review

## Objectif

Implémenter score minimal + best score local.

## Résultat

Le patch ajoute un score runtime séparé du compteur de progression, un barème centralisé, des best scores locaux par `levelId`, le reset des scores avec `?resetProgress=1`, et l'affichage du score sur GameOver. ClearScene affiche déjà le score, le best score et `NOUVEAU RECORD`; ce patch câble les données runtime vers cette scène.

## Fichiers modifiés

- src/config/constants.ts
- src/scenes/GameScene.ts
- src/scenes/GameOverScene.ts
- src/systems/SaveSystem.ts
- reports/patch-1073/review.md
- reports/patch-1073/docs/minimal-score-system-implementation.md
- reports/patch-1073/screenshots/clear_score_mobile.png
- reports/patch-1073/screenshots/clear_new_record_mobile.png
- reports/patch-1073/screenshots/gameover_score_mobile.png
- reports/patch-1073/screenshots/boss_clear_score_mobile.png

## Tests / vérifications

Commandes lancées :

- `npm run check`

Résultat :

- OK. Build Vite terminé avec le warning Rollup connu `chunk > 500 kB`, non bloquant.

Vérifications fonctionnelles :

- score runtime : oui
- pickup donne points : oui
- clear donne bonus : oui
- boss hit donne points : oui
- boss clear donne points : oui
- best score sauvegardé : oui
- reset progress reset scores : oui
- ClearScene affiche score : oui
- GameOver affiche score : oui
- difficulté inchangée : oui

Vérifications complémentaires :

- captures mobiles générées via Vite + Playwright ;
- `?resetProgress=1` vérifié : `snakeDriveV4.bestScores` est supprimé ;
- `npm run build` non lancé séparément car `npm run check` exécute déjà `npm run build`.

## Captures

- reports/patch-1073/screenshots/clear_score_mobile.png
- reports/patch-1073/screenshots/clear_new_record_mobile.png
- reports/patch-1073/screenshots/gameover_score_mobile.png
- reports/patch-1073/screenshots/boss_clear_score_mobile.png

## Documents

- reports/patch-1073/docs/minimal-score-system-implementation.md

## Limites / risques

- bonus temps restant reporté car aucun timer de temps restant simple n'est exposé ;
- les captures valident les scènes de résultat pilotées, pas une partie complète jouée manuellement ;
- test mobile réel recommandé après merge ;
- aucun leaderboard, grade, monnaie, shop, upgrade ou changement de difficulté ajouté.

## Liens GitHub

- Commit : PATCH 1073 — Implement minimal score system
- PR : non créée
