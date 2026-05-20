# Ticket 006 — Layout mobile maître

## Objectif
Créer un layout qui empêche les erreurs V3.

## Fichiers à créer
- `src/ui/HudLayout.ts`
- `src/render/RenderHud.ts`
- `src/render/RenderFrame.ts`

## Fichiers à modifier
- `src/scenes/GameScene.ts`
- `src/scenes/LevelIntroScene.ts`
- `src/scenes/GameOverScene.ts`

## Fichiers interdits
- `src/mechanics/**`

## Contraintes
- Grille prioritaire.
- HUD compact.
- Frame adaptatif.
- Footer optionnel.
- Safe area.

## Tests
```bash
npm run check
```
Manuel : mobile portrait, pas de chevauchement.
