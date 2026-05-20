# 10 — Design Pack Usage

Le design pack est maintenant trié par univers. Les sources brutes `_incoming` ont été supprimées après intégration.

## Sources Conservées

- `design_boards/castle/`
- `design_boards/sonic/`
- `design_boards/streets/`
- `design_boards/fighter/`
- `design_boards/outrun/`
- `design_boards/shinobi/`
- `design_boards/kombat/`
- `design_boards/paperboy/`

## Cadres Gameplay

Chaque univers possède un cadre source `cadre ...png` dans `design_boards/[univers]/`.

Les versions runtime sont copiées dans :

```text
public/assets/frames/[univers]/frame.png
```

`UniverseFrameRenderer` aligne l'ouverture centrale du cadre sur la grille Snake.

## Assets Gameplay

Les renderers consomment les fichiers de :

```text
public/assets/universes/[univers]/
```

Ces assets doivent rester découpés ou recréés proprement. Ne pas afficher les planches source directement.

## Fallback

Si un asset manque :

- gameplay ne crashe pas ;
- renderer procédural prend le relais ;
- warning/debug éventuel documenté.
