Tu interviens sur Snake Drive V4.

Lis :
- `CLAUDE.md`
- `tickets/AUDIT_PATCH_MOBILE_UI_LEVEL_INTRO_SONIC_SHINOBI.md`
- `docs/audit_mobile_ui_level_intro_sonic_shinobi_notes.md`

Mission : corriger les régressions UI mobile portrait révélées par l'audit Shinobi/Sonic.

Problèmes :
1. Shinobi intro niveau : panneau mission chevauche les boutons JOUER/CARTE.
2. Sonic gameplay : HUD haut trop volumineux.
3. Sonic gameplay : pickups/anneaux semi-transparents trop peu lisibles.
4. Le correctif doit être audité sur tous les univers, pas hardcodé uniquement pour Shinobi/Sonic.

Exigences :
- Réserver une zone boutons fixe et sûre dans les intros niveau.
- Empêcher tout overlap entre mission card et boutons.
- Réduire/normaliser le HUD gameplay en portrait.
- Garder la grille prioritaire sur HUD/frame/décor.
- Rendre les pickups visibles en continu, même lorsqu'ils pulsent/clignotent.
- Pickups plus visibles que obstacles/leurres.
- Pas de nouvelle dépendance.
- Pas de suppression des 8 univers / 16 niveaux / 8 boss / World Map.
- Lancer `npm run check`.

Fichiers probables :
- `src/scenes/LevelIntroScene.ts`
- `src/scenes/GameScene.ts`
- `src/render/HUDRenderer.ts`
- `src/render/PickupRenderer.ts`
- `src/render/GridRenderer.ts`
- tout module de layout responsive existant

Sortie attendue :
- résumé des changements ;
- fichiers modifiés ;
- résultat de `npm run check` ;
- validation manuelle sur Shinobi, Sonic et audit rapide multi-univers ;
- limites/fallbacks éventuels.
