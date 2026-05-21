# AUDIT 952 — Textes français / microcopy

## Constats
- Occurrences anglaises brutes : 68
- Occurrences françaises : 139

## Risques
- P0 : instruction de gameplay incomprise.
- P1 : mélange français/anglais visible.
- P1 : texte trop long sur mobile.
- P2 : incohérence de ton.

## Corrections recommandées
- Relire TitleScene, WorldMapScene, LevelIntroScene, ClearScene, GameOverScene.
- Remplacer l'anglais visible par français court.
- Limiter les instructions niveau à une phrase.
- Uniformiser boutons : Jouer, Continuer, Rejouer, Carte, Suivant.
- Vérifier accents sur mobile.

## Fichiers à relire en priorité
- `src/scenes/TitleScene.ts`
- `src/scenes/WorldMapScene.ts`
- `src/scenes/LevelIntroScene.ts`
- `src/scenes/ClearScene.ts`
- `src/scenes/GameOverScene.ts`
