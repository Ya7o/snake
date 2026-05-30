# Review

## Objectif
Corriger GameOver mobile layout et harmoniser réellement la taille du board gameplay.

## Résultat
GameOver mobile a maintenant une composition verticale stable : titre, cause, score/best, niveau, puis actions. Le panneau score accepte des scores longs sans débordement sur 390x844.

Le sizing gameplay utilise une règle commune pour Sonic et les autres univers 16x20. Castle reste une exception documentée à cause de son plateau 16x26; OutRun reste une exception de cadrage artistique.

## Fichiers modifiés
- `src/scenes/GameOverScene.ts`
- `src/scenes/GameScene.ts`
- `reports/patch-1089/capture-patch-1089.mjs`
- `reports/patch-1089/docs/persistent-mobile-layout-fix.md`
- `reports/patch-1089/logs/board-size-comparison.csv`
- `reports/patch-1089/screenshots/*.png`

## Tests / vérifications
Commandes lancées :
- `npm run check`
- `npm run build` via `npm run check`

Résultat :
- OK. Build Vite terminé avec l'avertissement existant de chunk > 500 kB.

Vérifications fonctionnelles :
- GameOver mobile lisible : oui
- score/best GameOver sans débordement : oui
- boutons GameOver lisibles : oui
- Castle board OK : oui
- Sonic board harmonisé : oui
- autres univers non cassés : oui, Paperboy vérifié comme troisième univers
- gameplay inchangé : oui, sizing visuel uniquement; grille logique et mécaniques inchangées

## Captures
- `reports/patch-1089/screenshots/gameover_mobile_after.png`
- `reports/patch-1089/screenshots/castle_board_mobile_after.png`
- `reports/patch-1089/screenshots/sonic_board_mobile_after.png`
- `reports/patch-1089/screenshots/third_universe_board_after.png`

## Documents
- `reports/patch-1089/docs/persistent-mobile-layout-fix.md`
- `reports/patch-1089/logs/board-size-comparison.csv`

## Limites / risques
- Validation mobile réelle recommandée après déploiement GitHub Pages.
- Les plus petits viewports peuvent encore demander un ajustement fin.
- OutRun garde une exception visuelle volontaire pour préserver le cadrage cockpit.

## Liens GitHub
- Commit : ce commit `PATCH 1089 — Fix GameOver layout and board size`
- PR :
