Tu dois appliquer le patch suivant au projet Snake Drive V4.

# PATCH — Extraction design boards : quality gate + workflow crop manuel

## Problème
Le pipeline actuel extrait des assets trop approximatifs :
- titres de sections inclus dans les crops ;
- objets coupés ;
- sections mélangées ;
- bordures inutilisables ;
- palette JSON trop pauvre ;
- crops non fiables pour le gameplay.

Ces sorties ne doivent pas être utilisées en jeu.

## Objectif
Transformer le pipeline en workflow propre :
1. manifest manuel par univers ;
2. section crops propres ;
3. item crops individuels ;
4. images debug avec rectangles ;
5. rapport d’audit ;
6. quality gate ;
7. `DesignBoardManager` ne charge que les assets validés.

## Fichiers à modifier
- `tools/design-boards/extractDeveloperAssets.ts`
- `src/assets/designBoardManifest.ts`
- `src/assets/DesignBoardManager.ts`
- `docs/design_boards/DEVELOPER_ASSET_PIPELINE.md`
- `docs/design_boards/DEVELOPER_ASSET_AUDIT.md`
- `package.json`

## Fichiers à créer
- `docs/design_boards/CROP_QUALITY_RULES.md`
- `docs/design_boards/MANUAL_CROP_WORKFLOW.md`
- `public/assets/generated/_debug/`
- `public/assets/generated/_audit/design-board-extraction-report.json`
- `public/assets/generated/_audit/design-board-extraction-report.md`

## Règle fondamentale
Ne pas essayer de tout automatiser. Les planches sont similaires mais pas identiques. La méthode correcte est un manifest explicite, vérifiable et corrigible humainement.

## Statuts d’export obligatoires
Chaque crop doit avoir un statut :
- `clean`
- `containsLabel`
- `partial`
- `overlapsOtherSection`
- `tooWide`
- `tooTall`
- `ambiguous`
- `missing`
- `invalid`
- `needsManualCrop`

## Section crops vs item crops
Créer deux niveaux :

### Section crops
Pour documentation / debug :
- `gameplayPreview`
- `hud`
- `propsSection`
- `pickupsSection`
- `obstaclesSection`
- `bossSection`
- `badgesSection`
- `paletteStrip`
- `borderReference`

### Item crops
Pour usage futur en jeu :
- pickups individuels ;
- obstacles individuels ;
- boss propre ;
- badges individuels ;
- morceaux de frame séparés : top, bottom, left, right.

## Borders
Ne plus exporter seulement `borders.png` comme bande globale.
Créer si possible :
- `border_top.png`
- `border_bottom.png`
- `border_left.png`
- `border_right.png`

## Palette
Ne générer `palette.json` que si au moins 8 couleurs fiables sont extraites depuis des carrés couleur identifiés.
Sinon :
- générer `palette.png` ;
- marquer `paletteJson: ambiguous`.

## Debug obligatoire
Pour chaque univers :
- générer une image source avec rectangles de crop superposés ;
- écrire les noms des zones ;
- sauver dans `public/assets/generated/_debug/{univers}_crop_debug.png`.

## Audit obligatoire
Générer :
- `public/assets/generated/_audit/design-board-extraction-report.json`
- `public/assets/generated/_audit/design-board-extraction-report.md`

Le rapport doit dire clairement :
- clean ;
- bloqué ;
- à recropper manuellement ;
- pourquoi.

## Tests
```bash
npm run assets:extract-design-boards
npm run assets:audit-design-boards
npm run check
npm run build
```

## Interdits
- Ne pas utiliser les crops actuels invalides dans le jeu.
- Ne pas afficher une planche brute dans le gameplay.
- Ne pas imposer le layout Castle à tous les univers.
- Ne pas modifier le gameplay Snake.
- Ne pas supprimer univers/niveaux/boss.
- Ne pas ajouter de dépendance lourde.

## Rapport final obligatoire
Liste :
1. Fichiers modifiés.
2. Fichiers créés.
3. Assets marqués clean.
4. Assets bloqués.
5. Debug images générées.
6. Audit généré.
7. Tests.
8. Questions / blocages.
