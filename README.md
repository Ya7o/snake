# Snake Drive V4

Snake Drive V4 est un Snake web mobile en TypeScript + Phaser, inspiré Mega Drive / 16-bit, avec une world map, 8 univers, 16 niveaux et 8 boss.

## Démarrage

```bash
npm install
npm run check
npm run dev
```

`npm run check` lance TypeScript puis le build Vite. `dist/` est généré et ignoré par Git.

## Dossiers Clés

- `src/` : code du jeu.
- `src/scenes/` : Boot, Title, WorldMap, LevelIntro, Game, Clear, GameOver.
- `src/render/` : renderers grille, snake, HUD, pickups, obstacles, cadres.
- `src/mechanics/` : mécaniques normales et boss.
- `src/config/` : niveaux, univers, nodes, constantes.
- `public/assets/` : assets réellement chargés par Phaser.
- `design_boards/[univers]/` : planches source triées et cadres source par univers.
- `docs/` : vision, architecture, QA, audits et guides.
- `tickets/` : uniquement les tickets non appliqués ou en attente.

## Assets

Les planches brutes `_incoming` ont été triées puis supprimées. Les sources à conserver sont maintenant dans `design_boards/[univers]/`.

Les cadres gameplay utilisés au runtime sont dans :

```text
public/assets/frames/[univers]/frame.png
```

Les assets gameplay consommés par les renderers sont dans :

```text
public/assets/universes/[univers]/
```

Les petits tokens d'interface dans `public/assets/openmoji/` utilisent une selection d'assets OpenMoji.

## Credits

Selected emoji/icon assets by OpenMoji, the open-source emoji and icon project.
License: CC BY-SA 4.0.
https://openmoji.org/

## Règles Produit

- Mobile portrait prioritaire.
- Grille Snake prioritaire sur le décor.
- Ne jamais afficher une planche design brute en gameplay.
- Si un asset manque, le jeu doit fallback en procédural sans crash.
- Après chaque patch : `npm run check`.
