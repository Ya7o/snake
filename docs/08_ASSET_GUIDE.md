# 08 — Asset Guide

## Sources

Les sources design sont triées par univers :

```text
design_boards/[univers]/
```

Chaque dossier univers peut contenir :

- une planche source ;
- un cadre source `cadre ...png` ;
- un `README.md`.

## Assets Runtime

Assets consommés par Phaser :

```text
public/assets/
```

Structure principale :

- `public/assets/map/world_map.png`
- `public/assets/frames/[univers]/frame.png`
- `public/assets/universes/[univers]/hud_panel.png`
- `public/assets/universes/[univers]/pickup_01.png`
- `public/assets/universes/[univers]/pickup_02.png`
- `public/assets/universes/[univers]/obstacle_01.png`
- `public/assets/universes/[univers]/obstacle_02.png`
- `public/assets/universes/[univers]/boss.png`

## Pipeline

1. Ajouter temporairement les sources dans `design_boards/[univers]/`.
2. Exporter/copier les assets runtime vers `public/assets`.
3. Vérifier que les renderers utilisent les assets finaux.
4. Garder un fallback procédural si l'asset manque.
5. Supprimer les dossiers d'import temporaires.

## Règle

Une planche est une source, pas un écran de jeu. Ne jamais afficher une planche brute dans gameplay.
