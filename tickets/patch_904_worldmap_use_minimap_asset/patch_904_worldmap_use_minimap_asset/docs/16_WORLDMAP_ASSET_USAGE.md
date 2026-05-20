# 16 — World Map Asset Usage

## Problème

La WorldMap ne doit pas être seulement un graphe sombre avec des nodes.  
Elle doit utiliser une vraie image de minimap/world map comme fond principal.

## Asset attendu

Chemin runtime recommandé :

```text
public/assets/map/world_map.png
```

Chemin côté navigateur :

```text
assets/map/world_map.png
```

## Pipeline attendu

```text
source minimap
→ public/assets/map/world_map.png
→ AssetManager ou WorldMapScene preload
→ MapRenderer
→ image map en fond
→ lignes/nodes/labels par-dessus
```

## Règles de rendu

Ordre des calques :

1. fond global ;
2. image `world_map.png` ;
3. routes/lignes ;
4. nodes ;
5. état selected/clear ;
6. HUD/label/bouton START.

## Règles de coordonnées

Les nodes doivent être positionnés en coordonnées relatives à l’image de map, pas seulement à l’écran.

Format recommandé :

```ts
{
  id: "castle_normal",
  levelId: "castle_normal",
  x: 0.12,
  y: 0.28,
  label: "CASTLE"
}
```

où `x` et `y` sont entre `0` et `1`.

Le renderer convertit ensuite :

```ts
screenX = mapImageX + x * mapImageWidth
screenY = mapImageY + y * mapImageHeight
```

## Fallback

Si `world_map.png` est absent :
- afficher le graphe procédural actuel ;
- log warning : `World map image missing, using procedural fallback`;
- ne pas crasher.
