# 10 — Design Pack Usage

Le pack utilisateur contient des planches design/UI pour les 8 thèmes.

## Fichiers extraits

- `design_boards/_incoming/a_high_resolution_game_ui_sprite_sheet_style_ima.png`
- `design_boards/_incoming/a_detailed_pixel_art_game_ui_asset_sheet_overall.png`
- `design_boards/_incoming/a_detailed_pixel_art_ui_concept_sheet_game_hud_a.png`
- `design_boards/_incoming/a_detailed_pixel_art_game_ui_asset_sheet_mockup.png`
- `design_boards/_incoming/a_single_image_a_large_pixel_art_16_bit_style_u.png`
- `design_boards/_incoming/a_high_detail_pixel_art_ui_game_asset_sheet_poster.png`
- `design_boards/_incoming/a_detailed_game_ui_asset_sheet_poster_in_a_retro_1.png`
- `design_boards/_incoming/a_detailed_pixel_art_game_ui_asset_sheet_poster.png`

## Travail attendu de Claude Code

1. Inspecter les images dans `design_boards/_incoming/`.
2. Associer chaque planche à un univers.
3. Copier/renommer les planches dans :
   - `design_boards/castle/`
   - `design_boards/sonic/`
   - `design_boards/streets/`
   - `design_boards/fighter/`
   - `design_boards/outrun/`
   - `design_boards/shinobi/`
   - `design_boards/kombat/`
   - `design_boards/paperboy/`
4. Créer assets finaux ou fallback dans `public/assets/universes/[univers]/`.
5. Ne jamais afficher la planche brute dans le gameplay.
6. Si la découpe automatique est incertaine, utiliser rendu procédural inspiré de la planche et documenter le fallback.

## Objectif visuel première build

La première build doit déjà être identifiable par univers, même si certains assets sont simplifiés.
