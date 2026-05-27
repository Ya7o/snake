# PATCH 998 — OutRun Runtime Template Binding

## Objectif
Appliquer à OutRun le modèle background/runtime validé sur Castle.

## Changements
- ajout `OUTRUN_RESULT_SCREEN_ASSETS` dans `src/config/constants.ts`
- binding gameplay background dans `GameScene.ts`
- binding system background dans `LevelIntroScene.ts`
- binding clear background dans `ClearScene.ts`
- binding game over background dans `GameOverScene.ts`
- assets copiés : `public/assets/ui/outrun/outrun_{system,gameplay,game_over,clear}_bg.png`

## Règles conservées
- image = ambiance
- runtime = UI
- aucun HUD baked
- aucun bouton baked
- aucun texte baked
- aucune modification gameplay
- aucune modification Castle

## Hors périmètre
- turboRival boss mechanic
- sons spécifiques OutRun
- refactor générique des result screens
- nouveaux assets runtime

## Critères d'acceptation
- npm run build OK
- OutRun normal affiche `outrun_gameplay_bg` derrière le board
- OutRun boss affiche `outrun_gameplay_bg` derrière le board
- OutRun LevelIntro affiche `outrun_system_bg`
- OutRun Clear affiche `outrun_clear_bg`
- OutRun GameOver affiche `outrun_game_over_bg`
- Castle non régressé
- Sonic non régressé
