# 18 — Repo Cleanup Log

## 2026-05-20

Nettoyage demandé après accumulation de tickets, prototypes et assets intermédiaires.

## Supprimé

- `dist/` : build généré par Vite.
- `design_boards/_incoming/` : doublons après tri des planches par univers.
- `tickets/1st build/` : archive de première build et prototypes dupliqués.
- anciens packs de tickets appliqués 909-921.
- `references/prototypes/` : prototypes HTML V3 monofichier obsolètes.
- `references/assets/` : ancien asset Castle non consommé.

## Conservé

- `src/` : code source.
- `public/assets/` : assets runtime chargés par Phaser.
- `design_boards/[univers]/` : sources design triées.
- `design_boards/minimap/` : source minimap.
- `references/screenshots/` : captures encore citées par la doc WorldMap.
- `tickets/patch_922_french_intro_instructions_by_level/` et `tickets/patch_923_mobile_fit_worldmap_intro_and_frame_cleanup/` : tickets non appliqués à date.

## 2026-05-22

Audit stabilisation — nettoyage pipeline asset et code mort.

### Supprimé

- `public/assets/developer-assets/` : 78 fichiers dev inclus par erreur dans le build.
- `public/assets/runtime/universes/castle/` : 3 PNGs ghost (pickup_orb, obstacle_blink_wall, boss_witch_mirror) remplacés par les db_ assets officiels.
- `public/assets/menu-backgrounds/` : 8 PNGs jamais affichés — les `level-intros/*.png` existent pour les 8 univers et ont priorité.
- `public/assets/universe_asset_bank/` : 80 PNGs du système codex (tier 3 jamais atteint, tous les univers ont db_ ou rt_).
- `src/systems/CodexAssetResolver.ts` : système codex mort.
- `src/assets/universeAssetBank.ts` : catalogue codex mort.
- `src/systems/DesignBoardManager.ts` : dead code.
- `src/assets/designBoardManifest.ts` : dead code.
- `src/assets/runtimeUniverseAssets.manifest.json` : manifest orphelin avec les 3 anciennes entrées castle.

### Modifié

- `src/config/menuThemes.ts` : `bgKey`/`bgUrl` supprimés de l'interface `MenuTheme` et des 8 entrées.
- `src/scenes/LevelIntroScene.ts` : `preload()` charge uniquement l'asset badge du niveau (pickup_01 ou boss selon type). `create()` : sélection background simplifiée.
- `src/scenes/GameScene.ts` : `preload()` simplifié — rt_ uniquement pour non-castle, codex supprimé.
- Tous les fichiers `GameScene`, `LevelIntroScene`, `ClearScene`, `GameOverScene` : `resolveLevelId()` unifié.

### État public/assets après nettoyage

```
public/assets/
  frames/[univers]/frame.png          — 8 cadres gameplay
  level-intros/[univers]/intro.png    — 8 backgrounds intro niveau
  map/world_map.png
  runtime/universes/[7 univers]/      — 21 PNGs rt_ (pas castle)
  ui/castle/                          — 4 backgrounds result/system Castle
  universes/[univers]/                — db_ assets (pickup, obstacle, boss, etc.)
```

## Convention Future

Après application d'un ticket pack :

1. Copier les décisions utiles dans `docs/`.
2. Supprimer les screenshots/prompts du pack si le code est intégré.
3. Garder seulement les tickets non appliqués.
4. Laisser `dist/` hors repo.
