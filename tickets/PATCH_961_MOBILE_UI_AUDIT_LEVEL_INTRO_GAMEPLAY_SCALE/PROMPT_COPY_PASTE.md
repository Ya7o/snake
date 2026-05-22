Tu interviens sur Snake Drive V4.

Lis :
- `CLAUDE.md`
- `tickets/961_PATCH_MOBILE_UI_AUDIT_LEVEL_INTRO_GAMEPLAY_SCALE.md`
- `docs/961_mobile_ui_audit_analysis.md`

## Mission
Corriger le layout mobile après audit :

1. OutRun gameplay : trop de vide vertical au-dessus du frame, scène trop réduite/trop basse.
2. Shinobi/Kombat intro : panneau + boutons trop bas, boutons proches/chevauchants du cadre bas.
3. Sonic gameplay : audit de contrôle pickup/frame/HUD.
4. Vérifier les 8 univers pour éviter une correction locale fragile.

## Contraintes
- Pas de dépendance.
- Pas de suppression d’univers/niveaux/boss/World Map.
- Grille prioritaire sur frame/décor/effets.
- Textes fonctionnels lisibles.
- Boutons utilisables tactilement.
- Ne pas laisser de serveur lancé.

## Implémentation attendue
- Remplacer les offsets fixes fragiles par un budget vertical responsive borné.
- Pour gameplay : réduire le vide entre HUD top et frame sans recouper le frame.
- Pour intro : définir une zone safe pour mission panel + boutons, avec compression progressive.
- Tester OutRun, Sonic, Shinobi, Kombat au minimum, puis audit rapide autres univers.

## Fichiers probables
- `src/scenes/GameScene.ts`
- `src/scenes/LevelIntroScene.ts`
- `src/render/HUDRenderer.ts`
- `src/render/GridRenderer.ts`
- `src/render/FrameRenderer.ts` ou équivalent
- `src/config/universes.ts`
- `src/config/levels.ts`
- tout helper layout existant

## Validation
Lancer `npm run check`.

Réponse finale attendue : fichiers modifiés, logique du layout, résultat du check, limites/fallbacks.
