# Instructions Codex — intégrer uniquement les 24 assets validés

## Objectif
Remplacer les anciens essais par un système simple et maîtrisé : 24 PNG runtime.

## À faire
1. Copier `ready_to_copy/` à la racine du projet.
2. Copier ou exécuter le script :
   ```bash
   bash tools/cleanup/cleanup_failed_asset_pipelines.sh
   ```
3. Brancher `src/assets/runtimeUniverseAssets.ts`.
4. Dans `GameScene`, charger seulement les assets du niveau courant.
5. Utiliser fallback SVG si un asset manque.

## Interdits
- Ne pas charger `_downloaded`.
- Ne pas charger `_extracted`.
- Ne pas utiliser `design_board_icons`.
- Ne pas utiliser `runtime_candidates_from_design_boards`.
- Ne pas charger les ZIP.
- Ne pas garder les pipelines ratés.
- Ne pas intégrer tous les anciens assets.

## Tests
```bash
npm run check
npm run build
npm run preview -- --host 0.0.0.0
```

## Rapport final obligatoire
Lister :
1. anciens dossiers supprimés ;
2. 24 assets présents ;
3. scènes modifiées ;
4. tests effectués ;
5. rendu mobile.
