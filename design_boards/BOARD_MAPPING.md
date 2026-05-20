# BOARD_MAPPING.md

Ce fichier doit être complété par Claude Code / Codex au moment d’exécuter :

`tickets/029_MAP_DESIGN_BOARDS_TO_UNIVERSES.md`

## Fichiers source extraits

- `design_boards/_incoming/a_high_resolution_game_ui_sprite_sheet_style_ima.png`
- `design_boards/_incoming/a_detailed_pixel_art_game_ui_asset_sheet_overall.png`
- `design_boards/_incoming/a_detailed_pixel_art_ui_concept_sheet_game_hud_a.png`
- `design_boards/_incoming/a_detailed_pixel_art_game_ui_asset_sheet_mockup.png`
- `design_boards/_incoming/a_single_image_a_large_pixel_art_16_bit_style_u.png`
- `design_boards/_incoming/a_high_detail_pixel_art_ui_game_asset_sheet_poster.png`
- `design_boards/_incoming/a_detailed_game_ui_asset_sheet_poster_in_a_retro_1.png`
- `design_boards/_incoming/a_detailed_pixel_art_game_ui_asset_sheet_poster.png`

## Mapping — V4 First Build (2026-05-20)

Les planches `_incoming/` sont toutes des sheets pixel art retro UI génériques.
Aucune n'est assignable avec confiance haute à un univers spécifique.
Décision : **fallback procédural complet** pour la première build.
Les palettes de couleur sont codées par univers dans `src/config/universes.ts`.

| Univers | Planche source | Confiance | Justification | Statut |
|---|---|---:|---|---|
| castle | aucune — fallback | LOW | Sheets génériques sans thème castle clair | FALLBACK PROCÉDURAL |
| sonic | aucune — fallback | LOW | Sheets génériques sans thème Sonic clair | FALLBACK PROCÉDURAL |
| streets | aucune — fallback | LOW | Sheets génériques sans thème Streets clair | FALLBACK PROCÉDURAL |
| fighter | aucune — fallback | LOW | Sheets génériques sans thème Fighter clair | FALLBACK PROCÉDURAL |
| outrun | aucune — fallback | LOW | Sheets génériques sans thème OutRun clair | FALLBACK PROCÉDURAL |
| shinobi | aucune — fallback | LOW | Sheets génériques sans thème Shinobi clair | FALLBACK PROCÉDURAL |
| kombat | aucune — fallback | LOW | Sheets génériques sans thème Kombat clair | FALLBACK PROCÉDURAL |
| paperboy | aucune — fallback | LOW | Sheets génériques sans thème Paperboy clair | FALLBACK PROCÉDURAL |

## Décision design

Toutes les planches sont des sprite sheets retro UI pixelart polyvalents.
Ils seront utilisés dans un ticket dédié (030_DESIGN_PACK_INTEGRATION) pour
extraire des icônes HUD, frames de bord, et éléments de pickup.
Pour la première build V4, les rendus sont 100% procéduraux via Phaser Graphics.

## Règles

- Ne pas deviner silencieusement si la confiance est basse.
- Si deux planches sont ambiguës, utiliser fallback procédural et documenter.
- Ne jamais écraser les fichiers source.
- Copier/renommer plutôt que déplacer si doute.
