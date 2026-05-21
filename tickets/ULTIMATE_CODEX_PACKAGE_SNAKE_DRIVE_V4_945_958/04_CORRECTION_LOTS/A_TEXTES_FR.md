# LOT A — Correction textes français visibles

## Objectif
Corriger tous les textes visibles joueur pour que le jeu soit entièrement compréhensible en français.

## Fichiers à inspecter
- `src/scenes/TitleScene.ts`
- `src/scenes/WorldMapScene.ts`
- `src/scenes/LevelIntroScene.ts`
- `src/scenes/ClearScene.ts`
- `src/scenes/GameOverScene.ts`
- tout fichier contenant du texte UI.

## À faire
- Remplacer anglais visible par français.
- Raccourcir textes trop longs sur mobile.
- Uniformiser les boutons :
  - Jouer
  - Continuer
  - Rejouer
  - Carte
  - Suivant
  - Retour
- Vérifier accents.
- Garder les noms internes anglais si non visibles.

## Interdits
- Ne pas toucher aux règles gameplay.
- Ne pas modifier les assets.

## Tests
```bash
npm run check
npm run build
```

## Rapport final
Lister textes modifiés, fichiers, tests.
