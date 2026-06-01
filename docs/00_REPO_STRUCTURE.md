# 00 — Repo Structure

## Source

- `src/main.ts` — bootstrap Phaser.
- `src/scenes/` — Boot, Title, WorldMap, LevelIntro, Game, Clear, GameOver.
- `src/core/` — grille, snake, spawn.
- `src/mechanics/` — mécaniques normales + boss (sous-dossier `bosses/`).
- `src/render/` — GridRenderer, SnakeRenderer, PickupRenderer, ObstacleRenderer, HUDRenderer, VfxUtils, TextureFiltering.
- `src/systems/` — InputSystem, AudioSystem, SaveSystem, RuntimeAssetResolver.
- `src/config/` — constants, levels, universes, mapNodes, menuThemes, types.
- `src/assets/` — runtimeUniverseAssets (registry rt_ paths).
- `src/ui/` — RuntimeUILayout, CastleRuntimeLayering, OpenMojiIconRegistry.
- `src/qa/` — QAChecks.

## Assets Runtime (`public/assets/`)

```
frames/[univers]/frame.png                    — cadres gameplay (8 univers)
level-intros/[univers]/intro.png              — backgrounds LevelIntroScene (8 univers)
ui/[univers]/[uid]_system_bg.png              — backgrounds result screens (8 univers × 5 slots)
ui/[univers]/[uid]_boss_system_bg.png
ui/[univers]/[uid]_gameplay_bg.png
ui/[univers]/[uid]_game_over_bg.png
ui/[univers]/[uid]_clear_bg.png
universes/[univers]/                          — db_ assets Castle (pickup, obstacle, boss, etc.)
runtime/universes/[7 univers]/                — rt_ assets 6 rôles × 7 univers non-Castle
  01/02/03/04/05/06_*.png (64×64 RGBA)
map/world_map.png                             — image WorldMap complète
ui/worldmap/world_map_minimap_16_9.png        — minimap 16:9 (1672×941)
ui/title/title_hub_bg.png                     — background TitleScene
```

### Pipeline de priorité asset
`db_` (Castle) > `rt_` (7 autres univers) > fallback procédural.

Le tier codex (`universe_asset_bank/`) a été supprimé le 2026-05-22.

## Sources Design

- `design_boards/[univers]/` — planches source et README par univers.
- `design_boards/minimap/` — source visuelle minimap.

## Documentation

- `docs/00`–`18_*.md` — docs projet (vision, GDD, architecture, QA…).
- `docs/audits/` — audits mobiles et conformité.
- `docs/design_boards/` — guides pipeline asset.
- `docs/WORKFLOW_TEMPLATE.md` — template flux GitHub-first.

## Reports

- `reports/patch-XXXX/review.md` — livrable obligatoire par patch.
- `reports/patch-XXXX/screenshots/` — captures si tâche visuelle.
- `reports/patch-XXXX/docs/` — documents complémentaires.
- `reports/patch-XXXX/logs/` — résultats JSON/CSV.

## Tickets

`tickets/` : uniquement les tickets non appliqués. Supprimer après intégration.

## Artefacts ignorés

- `node_modules/`, `dist/`, `.vite/`, logs, `.env`
- `public/assets/ui/*/world_token_*.png` — orphelins non référencés dans le code (à ne pas supprimer en pre-release)
