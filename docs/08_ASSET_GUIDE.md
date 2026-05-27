# 08 — Asset Guide

## Sources

Les sources design sont triées par univers :

```text
design_boards/[univers]/
```

## Structure public/assets (état 2026-05-22)

```text
public/assets/
  map/
    world_map.png                        — fond WorldMapScene
  frames/[univers]/
    frame.png                            — cadre gameplay (8 univers)
  level-intros/[univers]/
    intro.png                            — background LevelIntroScene (8 univers)
  ui/castle/
    castle_system_bg.png                 — background LevelIntroScene Castle
    castle_gameplay_bg.png               — background GameScene Castle
    castle_clear_bg.png                  — background ClearScene Castle
    castle_game_over_bg.png              — background GameOverScene Castle
  universes/[univers]/
    pickup_01.png                        — db_ pickup principal (clé db_{uid}_pickup01)
    pickup_02.png                        — db_ pickup secondaire
    obstacle_01.png                      — db_ obstacle
    obstacle_02.png                      — db_ obstacle secondaire
    boss.png                             — db_ boss (clé db_{uid}_boss)
    frame_tile.png                       — db_ tuile de cadre
    hud_panel.png                        — db_ panel HUD
  runtime/universes/[7 univers sauf castle]/
    pickup_*.png                         — rt_ pickup override (clé rt_{uid}_pickup)
    obstacle_*.png                       — rt_ obstacle override
    boss_*.png                           — rt_ boss override
  ui/
    title_hub_bg.png                     — background TitleScene
```

## Pipeline asset (priorité d'affichage)

```
db_{uid}_{slot}   >   rt_{uid}_{role}   >   fallback procédural
```

- **Castle** : db_ uniquement — pas de rt_, pas de codex.
- **7 autres univers** : db_ présents + rt_ override optionnel. Si db_ chargé, rt_ ignoré.
- **Codex supprimé** (2026-05-22) — tier 3 jamais atteint, 80 PNGs retirés du build.

## Règles de preload par scène

| Scène | Charge |
|---|---|
| TitleScene | title_hub_bg.png |
| WorldMapScene | world_map.png |
| LevelIntroScene (normal) | background intro + db_{uid}_pickup01 |
| LevelIntroScene (boss) | background intro + db_{uid}_boss |
| GameScene | tous les db_ slots + rt_ si non-castle + frame.png univers actif |
| ClearScene | castle_clear_bg.png (castle seulement) |
| GameOverScene | castle_game_over_bg.png (castle seulement) |

**Règle stricte** : chaque scène charge uniquement ce qu'elle affiche.
`LevelIntroScene` ne pré-charge pas `boss.png` sur un niveau normal, et ne pré-charge pas `pickup_01.png` sur un niveau boss.

## Fallback procédural

Si un asset db_ manque à l'affichage, les renderers (PickupRenderer, ObstacleRenderer) reviennent au rendu graphique procédural. Ne jamais supprimer les fallbacks des renderers.

## Pipeline d'ajout d'un nouvel asset

1. Copier l'asset dans `public/assets/universes/[univers]/`.
2. Ajouter l'entrée dans `GameScene.preload()` si nouveau slot.
3. `npm run check`.
4. Supprimer les sources temporaires de `design_boards/_incoming/`.
