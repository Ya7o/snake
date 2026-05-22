Tu interviens sur le repo Snake Drive V4.

Lis et applique strictement :
- `CLAUDE.md`
- `tickets/960_PATCH_OUTRUN_MOBILE_LAYOUT_PICKUP_READABILITY.md`
- `docs/960_outrun_mobile_layout_notes.md`

## Mission
Corriger le layout mobile portrait et la lisibilité sur **OutRun**, puis auditer la même logique sur tous les univers.

## Problèmes à traiter
1. En jeu, sur mobile portrait ~960 px, le cadre gameplay OutRun ne fit plus correctement l’écran.
2. Le pickup clignotant est illisible à cause de l’effet ; il doit être plus lisible que les obstacles.
3. Le HUD haut doit rester compact et ne pas regagner trop de hauteur.
4. Sur le World Map, la bordure/panneau inférieur est trop haut et gaspille de l’espace : viser 1 ligne utile, 2 maximum.

## Attentes d’implémentation
- Corriger la logique de layout pour que la grille reste prioritaire.
- Préserver l’identité visuelle OutRun.
- Rendre le pickup clignotant lisible sans disparition ON/OFF agressive.
- Réduire la hauteur du panneau bas du World Map.
- Éviter une correction hardcodée uniquement pour OutRun si la cause est partagée.
- Ne pas ajouter de dépendance.
- Si un asset manque, fallback procédural obligatoire.

## Fichiers probables à inspecter
- `src/scenes/GameScene.ts`
- `src/scenes/WorldMapScene.ts`
- `src/render/HUDRenderer.ts`
- `src/render/GridRenderer.ts`
- `src/render/PickupRenderer.ts`
- tout module de layout/frame partagé
- éventuelles configs `src/config/levels.ts` / `src/config/universes.ts`

## Sortie attendue
1. Implémentation.
2. Résumé court des fichiers modifiés.
3. Résumé de la logique choisie pour :
   - frame fit mobile,
   - pickup blink lisible,
   - bottom bar World Map compacte.
4. Résultat de `npm run check`.
5. Mention des fallbacks/limites.

## Rappels non négociables
- Pas de suppression des 8 univers / 16 niveaux / 8 boss / World Map.
- Pas de décor détaillé derrière la grille.
- La grille Snake reste prioritaire sur le cadre et les effets.
- Textes fonctionnels lisibles.
- Pickups plus visibles que les obstacles.
- Ne laisse pas de serveur lancé.
