# Review

## Objectif
Appliquer la taille de plateau Castle comme référence à tous les univers.

## Résultat
La règle finale conserve le cadre Castle complet comme référence. Castle reste en 16x26; les univers 16x20 gardent leur grille logique, mais leur rendu s'étire sur toute l'empreinte Castle 288x468. Le cadre complet reprend les couleurs de la palette univers.

## Fichiers modifiés
- `src/scenes/GameScene.ts`
- `src/ui/CastleRuntimeLayering.ts`
- `src/render/GridRenderer.ts`
- `src/render/SnakeRenderer.ts`
- `src/render/PickupRenderer.ts`
- `src/render/ObstacleRenderer.ts`
- `reports/patch-1091/capture-patch-1091.mjs`
- `reports/patch-1091/docs/apply-castle-board-size-to-all-universes.md`
- `reports/patch-1091/logs/board-size-comparison.csv`
- `reports/patch-1091/screenshots/*.png`

## Tests / vérifications
Commandes lancées :
- `npm run check`
- `npm run build`

Résultat :
- OK. Build Vite terminé avec l'avertissement existant de chunk > 500 kB.

Vérifications fonctionnelles :
- Castle conservé comme référence : oui
- Sonic harmonisé avec Castle : oui
- Paperboy harmonisé avec Castle : oui
- OutRun traité : oui
- boss traités : oui
- gameplay inchangé : oui, pas de changement volontaire des mécaniques
- collisions inchangées ou documentées : oui, collisions inchangées sur la grille logique active

## Captures
- `reports/patch-1091/screenshots/castle_board_after.png`
- `reports/patch-1091/screenshots/sonic_board_after.png`
- `reports/patch-1091/screenshots/paperboy_board_after.png`
- `reports/patch-1091/screenshots/outrun_board_after.png`
- `reports/patch-1091/screenshots/boss_board_after.png`

## Documents
- `reports/patch-1091/docs/apply-castle-board-size-to-all-universes.md`
- `reports/patch-1091/logs/board-size-comparison.csv`

## Limites / risques
- Validation mobile réelle recommandée après déploiement GitHub Pages.
- Les backgrounds non-Castle peuvent demander un ajustement artistique ultérieur si le nouveau cadrage est jugé trop étroit.

## Liens GitHub
- Commit : ce commit
- PR :
