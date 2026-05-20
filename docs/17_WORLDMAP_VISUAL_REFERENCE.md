# 17 - WorldMap Visual Reference

## Probleme observe

La V4 utilise l'image de world map, mais le rendu mobile precedent etait trop eloigne de la reference : carte trop petite, grands vides noirs, nodes trop gros et footer trop distant.

## Rendu V4 mauvais

Fichier :

```text
references/screenshots/v4_bad_zoomed_out_tiny_map.jpg
```

Symptomes :
- carte trop petite ;
- espace noir important au-dessus et au-dessous ;
- nodes trop gros ;
- image compressee dans une bande horizontale ;
- labels et details de la map difficiles a lire ;
- interface basse trop distante de la carte.

## Reference attendue

Fichier :

```text
references/screenshots/target_reference_good_map_framing.jpg
```

Qualites :
- carte tres presente a l'ecran ;
- cadrage zoome ;
- univers lisibles ;
- nodes integres ;
- interface basse compacte ;
- aspect console/arcade coherent ;
- pas de grands vides inutiles.

## Regles de correction

1. La map doit remplir la zone utile.
2. Le zoom initial doit etre superieur au fit complet de l'image.
3. Les nodes doivent rester proportionnels a la carte.
4. Le header doit rester court.
5. Le footer doit rester court.
6. Le joueur doit pouvoir drag et pinch pour explorer.
7. Le cadrage par defaut doit etre plaisant avant interaction.

## Algorithme applique

```text
viewport = zone disponible entre header et footer
coverScale = max(viewportWidth / mapWidth, viewportHeight / mapHeight)
initialZoom = coverScale local * 1.22
minZoom = coverScale local * 1.04
maxZoom = coverScale local * 2.85
```

Dans l'implementation, `coverScale` est applique a la taille d'affichage de l'image, puis les zooms sont des multiplicateurs locaux du container.

## Acceptance patch 909

Le patch est valide si une capture mobile ressemble davantage a `target_reference_good_map_framing.jpg` qu'a `v4_bad_zoomed_out_tiny_map.jpg`, avec drag, pinch et selection de node toujours fonctionnels.
