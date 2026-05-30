# Review

## Objectif
Appliquer la taille de plateau Castle comme référence à tous les univers.

## Résultat
La règle finale sépare la grille logique de l'empreinte visuelle. Castle fournit une référence 16x26 pour le panneau/plateau visible, et les univers 16x20 sont centrés dans cette empreinte avec la même taille de cellule. Les mécaniques et collisions restent sur la grille logique active.

## Fichiers modifiés
- `src/scenes/GameScene.ts`
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
