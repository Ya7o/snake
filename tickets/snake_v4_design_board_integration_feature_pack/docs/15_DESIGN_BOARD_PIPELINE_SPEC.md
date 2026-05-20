# 15 — Design Board Pipeline Spec

## Problème

Les planches design/UI placées dans `design_boards/_incoming` ne sont pas automatiquement utilisées par le jeu.

Un fichier dans `design_boards/` n’est pas un asset de jeu tant qu’il n’est pas :
1. mappé à un univers ;
2. analysé ;
3. découpé ou converti ;
4. copié dans `public/assets/universes/[univers]/` ;
5. référencé dans un manifest ;
6. chargé par le jeu ;
7. rendu par HUD/frame/pickups/obstacles/boss.

## Dossiers

Sources :

```text
design_boards/_incoming/
design_boards/[universe]/
```

Assets utilisés par le jeu :

```text
public/assets/universes/[universe]/
```

Manifest :

```text
public/assets/design-board-manifest.json
```

## Manifest attendu

```json
{
  "version": 1,
  "universes": {
    "outrun": {
      "boardSource": "design_boards/outrun/outrun_board_example.png",
      "assetBase": "assets/universes/outrun",
      "confidence": "high",
      "assets": {
        "boardPreview": "assets/universes/outrun/board_preview.png",
        "frame": "assets/universes/outrun/frame.png",
        "hudPanel": "assets/universes/outrun/hud_panel.png",
        "pickupCheckpoint": "assets/universes/outrun/pickup_checkpoint.png",
        "pickupTurbo": "assets/universes/outrun/pickup_turbo.png",
        "obstacleCone": "assets/universes/outrun/obstacle_cone.png",
        "obstacleSign": "assets/universes/outrun/obstacle_sign.png",
        "bossRival": "assets/universes/outrun/boss_rival.png"
      },
      "fallbacks": []
    }
  }
}
```

## Version acceptable

La première version peut être semi-automatique.

Pour chaque univers :
- garder une copie source ;
- créer `board_preview.png` ;
- créer `theme_palette.json` ;
- créer ou extraire :
  - `frame.png`
  - `hud_panel.png`
  - 2 pickups
  - 2 obstacles
  - 1 boss/menace
- noter les fallbacks dans le manifest.

## Règle

La planche ne doit jamais être affichée brute dans le gameplay.  
Elle peut être affichée seulement en debug/preview.
