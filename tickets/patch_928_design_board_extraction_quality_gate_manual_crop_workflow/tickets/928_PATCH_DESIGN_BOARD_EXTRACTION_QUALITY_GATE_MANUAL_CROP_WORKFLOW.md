# PATCH — Extraction design boards : quality gate + workflow crop manuel

## Contexte
Le pipeline d’extraction des developer assets fonctionne techniquement, mais les crops générés sont trop approximatifs. Les sorties actuelles mélangent des titres de sections, coupent des objets, incluent des morceaux de sections voisines, et produisent une palette trop pauvre. Ces assets ne sont pas exploitables en jeu sans dégrader la qualité visuelle.

## Objectif
Remplacer l’approche “crop par grandes bandes approximatives” par un workflow robuste : manifest manuel par univers, visualisation debug, validation qualité, séparation sections/items, et blocage des exports non conformes. Le but n’est pas d’automatiser à tout prix, mais d’obtenir des assets propres, vérifiables et utilisables.

## Fichiers à modifier
- `tools/design-boards/extractDeveloperAssets.ts` — ajouter validation qualité, debug overlay, statuts d’export, et refus des crops invalides.
- `src/assets/designBoardManifest.ts` — enrichir le manifest avec sections, items, marges, statuts et règles de validation.
- `src/assets/DesignBoardManager.ts` — ne retourner que les assets validés `clean` ou explicitement autorisés.
- `docs/design_boards/DEVELOPER_ASSET_PIPELINE.md` — documenter la méthode correcte : section crops, item crops, debug review, validation.
- `docs/design_boards/DEVELOPER_ASSET_AUDIT.md` — lister les crops actuels invalides et les corrections attendues.
- `package.json` — ajouter ou compléter les scripts `assets:extract-design-boards`, `assets:debug-design-boards`, `assets:audit-design-boards`.

## Fichiers à créer
- `docs/design_boards/CROP_QUALITY_RULES.md` — règles précises pour valider un crop.
- `docs/design_boards/MANUAL_CROP_WORKFLOW.md` — procédure de correction manuelle univers par univers.
- `public/assets/generated/_debug/` — sorties debug avec rectangles de crop superposés aux planches source.
- `public/assets/generated/_audit/design-board-extraction-report.json` — rapport machine-readable.
- `public/assets/generated/_audit/design-board-extraction-report.md` — rapport lisible.

## Fichiers interdits
- Ne pas afficher les developer assets bruts dans le gameplay.
- Ne pas utiliser les crops actuels invalides dans le jeu.
- Ne pas imposer un crop unique à tous les univers.
- Ne pas supprimer les 8 univers.
- Ne pas supprimer les 16 niveaux.
- Ne pas supprimer les 8 boss.
- Ne pas modifier les règles gameplay Snake.
- Ne pas ajouter de dépendance lourde.
- Ne pas revenir à un HTML monofichier.

## Comportement attendu
- [ ] Le pipeline distingue `sectionCrop` et `itemCrop`.
- [ ] Les crops de section peuvent contenir un bloc complet, mais doivent être propres et ne pas inclure la section précédente.
- [ ] Les crops d’item doivent isoler un objet individuel sans titre, séparateur, ou objet voisin.
- [ ] `borders` est découpé en `borderTop`, `borderBottom`, `borderLeft`, `borderRight` quand possible, pas seulement en une bande globale.
- [ ] `palette.json` n’est généré que si la détection des carrés couleur est fiable.
- [ ] Si la palette JSON est incertaine, générer uniquement `palette.png` avec statut `ambiguous`.
- [ ] Chaque export reçoit un statut : `clean`, `containsLabel`, `partial`, `overlapsOtherSection`, `tooWide`, `tooTall`, `ambiguous`, `missing`, `invalid`.
- [ ] Les assets avec statut non-clean ne sont pas utilisés par `DesignBoardManager` sauf opt-in explicite.
- [ ] Une image debug est générée pour chaque planche avec rectangles et labels de crop.
- [ ] Le rapport d’audit liste les crops invalides avec raison et action recommandée.
- [ ] Les crops invalides n’échouent pas forcément tout le script, mais empêchent l’asset concerné d’être marqué utilisable.
- [ ] Le script peut être lancé en mode strict pour faire échouer le build si un asset requis est invalide.

## Contraintes
- Le workflow doit assumer que les planches sont semblables mais pas identiques.
- Les coordonnées doivent être explicites et versionnées dans le manifest.
- Pas de reconnaissance OCR obligatoire.
- Pas de “magie” : si Codex ne sait pas cropper proprement, il doit marquer `needsManualCrop`.
- Qualité visuelle > automatisation rapide.
- Les futurs assets doivent servir le gameplay sans noyer la grille Snake.
- Mobile Android reste la cible finale.

## Méthode parfaite attendue

### Étape 1 — Planche complète
Identifier l’image source par univers, sa taille exacte, et son orientation.

### Étape 2 — Sections propres
Créer des crops de sections propres :
- `gameplayPreview`
- `hud`
- `propsSection`
- `pickupsSection`
- `obstaclesSection`
- `bossSection`
- `badgesSection`
- `paletteStrip`
- `borderReference`

Ces crops peuvent garder les titres uniquement si leur rôle est documentaire. Ils ne doivent pas être utilisés tels quels en gameplay.

### Étape 3 — Items individuels
Créer ensuite les crops utilisables :
- pickups individuels ;
- obstacles individuels ;
- boss isolé ou panneau boss propre ;
- badges individuels ;
- morceaux de frame séparés.

### Étape 4 — Validation visuelle
Générer une planche debug avec rectangles colorés et labels. Codex doit la produire pour revue humaine.

### Étape 5 — Quality gate
Refuser les crops qui :
- coupent un objet ;
- contiennent le titre de la section précédente ;
- contiennent deux sections à la fois ;
- incluent trop de fond inutile ;
- sont trop proches du bord de l’objet ;
- mélangent label et asset gameplay ;
- ne correspondent pas au type attendu.

### Étape 6 — Exports utilisables
Seuls les assets `clean` passent dans `DesignBoardManager`.

## Hors scope
- Intégrer les assets dans le gameplay.
- Refaire les cadres en runtime.
- Refaire les HUD par univers.
- Refaire les pickups/obstacles en jeu.
- Corriger la WorldMap.
- Corriger les mécaniques gameplay.
- Faire de la segmentation IA.

## Rapport final obligatoire
À la fin, liste clairement :

1. Fichiers créés.
2. Fichiers modifiés.
3. Changements dans le manifest.
4. Statuts possibles et signification.
5. Cibles générées dans `_debug`.
6. Cibles générées dans `_audit`.
7. Cibles exportées comme utilisables.
8. Cibles bloquées comme invalides.
9. Tests effectués.
10. Questions ou points bloquants.

Si Codex a un doute, il doit écrire `needsManualCrop` et expliquer pourquoi.
