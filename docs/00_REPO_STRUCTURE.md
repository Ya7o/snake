# 00 — Repo Structure

## Source

- `src/main.ts` — bootstrap Phaser.
- `src/scenes/` — flow complet : Boot, Title, WorldMap, LevelIntro, Game, Clear, GameOver.
- `src/core/` — grille, snake, spawn.
- `src/mechanics/` — mécaniques normales et boss.
- `src/render/` — grille, snake, pickups, obstacles, HUD, cadres, helpers UI.
- `src/systems/` — input, audio, sauvegarde, manifest design.
- `src/config/` — constantes, niveaux, univers, nodes.
- `src/qa/` — checks de conformité.

## Assets Runtime

- `public/assets/map/world_map.png` — image WorldMap.
- `public/assets/frames/[univers]/frame.png` — cadre complet autour de la grille.
- `public/assets/universes/[univers]/` — HUD, pickups, obstacles, boss, palettes et previews.
- `public/assets/design-board-manifest.json` — manifest assets par univers.

## Sources Design

- `design_boards/[univers]/` — planches source, cadre source et README par univers.
- `design_boards/minimap/` — source visuelle minimap/world map.

Le dossier `_incoming` a été supprimé après tri. Ne pas le recréer sauf import temporaire immédiatement nettoyé.

## Documentation

- `docs/01_VISION.md` à `docs/14_UNIVERSE_IMPLEMENTATION_SPEC.md` — docs projet.
- `docs/audits/` — audits et plans.
- `docs/18_REPO_CLEANUP_LOG.md` — journal du nettoyage.

## Tickets

`tickets/` ne doit contenir que les tickets non appliqués ou utiles au prochain travail. Les packs appliqués doivent être supprimés après intégration dans `docs/`.

## Artefacts Ignorés

- `node_modules/`
- `dist/`
- `.vite/`
- logs et `.env`
