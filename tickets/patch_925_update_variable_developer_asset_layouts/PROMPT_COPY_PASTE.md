Tu dois mettre à jour le patch 925 du projet Snake Drive V4.

# PATCH — Update 925 : layouts variables developer assets

## Constat
Les 8 planches developer assets sont semblables, mais pas identiques. Elles contiennent globalement :
- gameplay preview ;
- HUD mobile ;
- props ;
- pickups ;
- obstacles ;
- boss ;
- bordures ;
- badges ;
- palette.

Mais la mise en page varie légèrement, surtout la palette, les séparateurs et certaines hauteurs de blocs.

## Objectif
Adapter le pipeline developer assets pour utiliser un manifest par univers, pas un crop unique global.

## À faire
1. Scanner `design_boards/`.
2. Détecter les developer assets.
3. Créer / mettre à jour `src/assets/designBoardManifest.ts`.
4. Chaque univers doit avoir ses propres coordonnées de zones.
5. Chaque zone doit avoir un statut :
   - `confirmed`
   - `estimated`
   - `missing`
   - `ambiguous`
6. Le script d’extraction doit valider les coordonnées.
7. Le script doit produire les assets générés dans `public/assets/generated/{univers}/`.
8. Le script doit produire un rapport d’audit.

## Zones à gérer
- `gameplay_preview.png`
- `hud.png`
- `props.png`
- `pickups.png`
- `obstacles.png`
- `boss.png`
- `borders.png`
- `badges.png`
- `palette.png`
- `palette.json` seulement si extraction couleur fiable

## Point important : palette
La palette varie selon les planches. Ne pas supposer un x/y unique.
Si la conversion en JSON est incertaine, exporter `palette.png` et signaler `paletteJson: ambiguous`.

## Fichiers à modifier
- `tools/design-boards/extractDeveloperAssets.ts`
- `src/assets/designBoardManifest.ts`
- `src/assets/DesignBoardManager.ts`
- `docs/design_boards/DEVELOPER_ASSET_PIPELINE.md`
- `docs/design_boards/DEVELOPER_ASSET_AUDIT.md`
- `package.json`

## Interdits
- Ne pas afficher les planches brutes dans le gameplay.
- Ne pas appliquer le crop Castle à tous les univers.
- Ne pas supprimer univers/niveaux/boss.
- Ne pas modifier le gameplay Snake.
- Ne pas ajouter de dépendance lourde.

## Tests
```bash
npm run assets:extract-design-boards
npm run check
npm run build
```

## Rapport final obligatoire
Liste :
1. Fichiers modifiés.
2. Univers détectés.
3. Dimensions des planches.
4. Zones extraites.
5. Zones ambiguës.
6. Traitement palette.
7. Tests.
8. Questions / blocages.
