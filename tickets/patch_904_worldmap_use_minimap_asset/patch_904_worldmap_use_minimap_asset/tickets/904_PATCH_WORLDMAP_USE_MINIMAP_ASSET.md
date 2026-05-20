# PATCH — World Map utilise la minimap

## Contexte
La WorldMap actuelle affiche seulement un fond sombre avec des nodes et des lignes de liaison. La minimap/design map fournie dans les assets ou design boards n’est pas utilisée visuellement, donc l’écran ne respecte pas l’intention graphique du projet.

## Objectif
Faire en sorte que la WorldMap affiche réellement l’image de minimap / world map comme fond principal, avec les nodes positionnés par-dessus, tout en gardant drag, pinch, tap node et bouton START fonctionnels sur mobile.

## Fichiers à modifier
- `src/scenes/WorldMapScene.ts` — charger et afficher la minimap comme fond de world map, puis placer nodes/lignes au-dessus.
- `src/worldmap/MapRenderer.ts` — rendre la carte image + lignes + nodes avec les bons calques/profondeurs.
- `src/worldmap/MapCamera.ts` — gérer le cadrage, zoom, bounds et centrage sur l’image de map.
- `src/worldmap/MapInput.ts` — garantir que drag/pinch/tap fonctionne avec une image de fond.
- `src/config/mapNodes.ts` — aligner les coordonnées des nodes sur l’image de minimap utilisée.
- `src/systems/AssetManager.ts` — déclarer/charger l’asset map si le chargement centralisé existe.
- `src/config/constants.ts` — ajouter la clé ou le chemin de l’asset map si nécessaire.
- `docs/13_ACCEPTANCE_MATRIX.md` — ajouter ou cocher le critère “world map asset réellement utilisé”.

## Fichiers à créer
- `public/assets/map/world_map.png` — copie normalisée de la minimap/world map utilisée par le jeu si elle n’existe pas déjà.
- `docs/16_WORLDMAP_ASSET_USAGE.md` — documentation courte du pipeline map : source, asset final, coordonnées nodes.
- `references/screenshots/worldmap_current_not_using_minimap.png` — référence du bug actuel.

## Fichiers interdits
- Ne pas supprimer les 16 nodes.
- Ne pas supprimer les 8 univers.
- Ne pas supprimer les boss.
- Ne pas remplacer la world map par un simple écran statique.
- Ne pas casser drag/pinch/tap.
- Ne pas modifier les mécaniques de gameplay Snake.
- Ne pas afficher une planche UI complète comme map si elle n’est pas la minimap prévue.
- Ne pas hardcoder des coordonnées impossibles à maintenir sans les documenter.

## Comportement attendu
- [ ] La WorldMap affiche une vraie image de minimap/world map en fond.
- [ ] Les lignes de liaison restent visibles au-dessus de la map.
- [ ] Les 16 nodes restent visibles au-dessus de la map.
- [ ] Les nodes sont alignés sur les points/lieux correspondants de l’image.
- [ ] Le node sélectionné est clairement visible.
- [ ] Le label de l’univers sélectionné reste lisible.
- [ ] Le bouton START reste disponible après sélection.
- [ ] Drag fonctionne sur Android.
- [ ] Pinch zoom fonctionne sur Android.
- [ ] Tap node ne déclenche pas de double lancement.
- [ ] Le rendu reste fluide en web mobile.
- [ ] Si l’image `public/assets/map/world_map.png` est absente, un fallback procédural s’affiche avec warning clair.
- [ ] `npm run check` passe.

## Contraintes
- Web mobile Android prioritaire.
- Performance : ne pas redessiner ou recréer l’image de map à chaque frame.
- L’image de map doit être créée/chargée une seule fois puis transformée via camera/container.
- Les nodes/lignes doivent être dans un container ou layer au-dessus de l’image.
- Le zoom doit avoir des limites min/max.
- Le drag ne doit pas faire sortir définitivement la carte de l’écran.
- Pas de nouvelle dépendance.
- Si les coordonnées doivent être ajustées, les documenter dans `docs/16_WORLDMAP_ASSET_USAGE.md`.
- Garder un fallback si l’asset map manque.

## Hors scope
- Refaire entièrement le design de la minimap.
- Créer une nouvelle map illustrée.
- Refaire la progression du jeu.
- Verrouiller/déverrouiller les niveaux.
- Refaire les univers.
- Ajouter des animations complexes sur la map.
- Optimisation spritesheet finale.
