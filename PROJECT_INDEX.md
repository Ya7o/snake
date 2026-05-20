# PROJECT_INDEX.md

## Racine

- `CLAUDE.md` : règles persistantes du projet.
- `README.md` : démarrage humain.
- `START_HERE_FOR_CLAUDE.md` : entrée rapide pour agent.
- `package.json` : scripts NPM.
- `vite.config.ts` / `tsconfig.json` : configuration build.

## Code

- `src/main.ts` : configuration Phaser et bootstrap.
- `src/scenes/` : scènes du flow complet.
- `src/core/` : grille, snake, spawn.
- `src/mechanics/` : mécaniques par univers et boss.
- `src/render/` : renderers visuels, HUD, cadres, boutons UI.
- `src/systems/` : input, audio, save, design board manager.
- `src/config/` : données niveaux/univers/world map.
- `src/qa/` : checks projet.

## Assets

- `public/assets/map/world_map.png` : world map runtime.
- `public/assets/frames/[univers]/frame.png` : cadres gameplay complets.
- `public/assets/universes/[univers]/` : HUD/pickups/obstacles/boss.
- `design_boards/[univers]/` : sources design triées.
- `design_boards/minimap/` : source minimap/world map.

## Docs

- `docs/00_REPO_STRUCTURE.md` : structure actuelle.
- `docs/01_VISION.md` à `docs/14_UNIVERSE_IMPLEMENTATION_SPEC.md` : specs produit/tech.
- `docs/audits/` : audits et plans mobile-first.

## Tickets

`tickets/` est volontairement léger. Les anciens packs appliqués ont été supprimés; garder seulement les tickets non appliqués ou nécessaires au prochain travail.
