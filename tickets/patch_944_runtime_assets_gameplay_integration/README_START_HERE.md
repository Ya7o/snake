# PATCH 944 — Runtime assets gameplay integration

Ce paquet sert à brancher dans `GameScene` les 24 assets runtime validés du patch 943.

## À lire en premier
```txt
PROMPT_COPY_PASTE.md
```

## Fichiers inclus
```txt
tickets/944_PATCH_RUNTIME_ASSETS_GAMEPLAY_INTEGRATION.md
docs/RUNTIME_ASSET_GAMEPLAY_INTEGRATION.md
docs/RUNTIME_ASSET_MOBILE_QA.md
ready_to_copy/src/systems/RuntimeAssetResolver.ts
ready_to_copy/src/scenes/GameScene.patch944.snippet.ts
```

## Ce patch ne contient pas les 24 PNG
Les 24 PNG viennent du patch 943.  
Ce patch 944 est l’intégration gameplay.

## Règle
Codex doit utiliser uniquement :
```txt
src/assets/runtimeUniverseAssets.ts
public/assets/runtime/universes/<univers>/*.png
```

Aucun ancien pipeline ne doit revenir.
