Respecte strictement le template PATCH fourni.

Lis :
- CLAUDE.md
- PROJECT_INDEX.md
- docs/13_ACCEPTANCE_MATRIX.md
- docs/16_WORLDMAP_ASSET_USAGE.md
- tickets/904_PATCH_WORLDMAP_USE_MINIMAP_ASSET.md

Problème :
La WorldMap affiche un graphe sombre avec nodes/lignes, mais la minimap/world map visuelle n’est pas utilisée.

Exécute le patch :
tickets/904_PATCH_WORLDMAP_USE_MINIMAP_ASSET.md

Objectif :
Afficher réellement l’image de minimap/world map comme fond de WorldMapScene, avec les 16 nodes/lignes par-dessus, tout en gardant drag/pinch/tap/START fonctionnels sur Android.

Commandes finales obligatoires :
npm run check
npm run dev

Test conseillé :
npm run build
npm run preview -- --host 0.0.0.0

Ne supprime aucun univers, boss, node ou mécanique.
Ne casse pas le drag/pinch/tap.
