Tu es dans le repo Snake Drive V4.

Lis d'abord `CLAUDE.md`, puis exécute uniquement le ticket :

`tickets/XXX_PATCH_CASTLE_MOBILE_UI_READABILITY_AUDIT.md`

Objectif : corriger les problèmes mobiles observés sur Castle et auditer les 8 univers.

Ne fais pas de refonte globale. Ne supprime aucun univers, niveau, boss ou WorldMap. Ne crée pas de nouvelle dépendance. Ne mets pas de décor détaillé derrière la grille. La grille Snake, les pickups et les dangers priment sur le décor.

Ordre conseillé :
1. Lire `TitleScene.ts`, `LevelIntroScene.ts`, `GameScene.ts`, `HUDRenderer.ts`, `GridRenderer.ts`, `PickupRenderer.ts`, `ObstacleRenderer.ts`, `levels.ts`.
2. Corriger l'écran titre pour éviter le débordement de la ligne meta.
3. Reformuler Castle et relire les textes de tous les niveaux.
4. Réduire le HUD gameplay à une seule ligne compacte.
5. Dédupliquer règle statique et statut mécanique dans le HUD.
6. Agrandir / clarifier le pickup principal.
7. Afficher les obstacles clignotants avec l'asset obstacle de l'univers quand disponible, fallback procédural sinon.
8. Revoir le layout pour mieux exploiter l'espace disponible sans nuire à la lisibilité de la grille.
9. Auditer les 8 univers.
10. Lancer `npm run check`.

À la fin, réponds avec :
- fichiers modifiés ;
- résumé des choix UI ;
- résultat `npm run check` ;
- univers audités ;
- limites ou fallbacks restants.
