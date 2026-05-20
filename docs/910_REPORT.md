# Rapport Cadres Gameplay

## État Actuel

Les 8 univers utilisent maintenant un cadre gameplay complet issu de `design_boards/[univers]/cadre ...png`.

## Assets Runtime

- `public/assets/frames/castle/frame.png`
- `public/assets/frames/sonic/frame.png`
- `public/assets/frames/streets/frame.png`
- `public/assets/frames/fighter/frame.png`
- `public/assets/frames/outrun/frame.png`
- `public/assets/frames/shinobi/frame.png`
- `public/assets/frames/kombat/frame.png`
- `public/assets/frames/paperboy/frame.png`

## Implémentation

- `GameScene` charge `UNIVERSE_FRAME_ASSETS`.
- `UniverseFrameRenderer` détecte les cadres complets et les affiche comme image entière.
- Des ratios par univers alignent l'ouverture centrale du cadre sur la grille Snake.
- `GridRenderer.computeGridLayout()` accepte un facteur de largeur pour laisser respirer les cadres.
- Si le cadre manque, fallback procédural.

## Règle Design

Le cadre peut être riche, mais il ne doit jamais recouvrir les cellules jouables ni réduire la lisibilité du Snake.
