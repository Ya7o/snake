# Developer Asset Pipeline

Patch 928 remplace l'approche "crop par grandes bandes approximatives" par un workflow robuste : manifest manuel, visualisation debug, quality gate, séparation section/item.

## Source of Truth

- Manifest TypeScript : `src/assets/designBoardManifest.ts`
- Extractor runnable : `tools/design-boards/extractDeveloperAssets.mjs`
- Scripts :
  - `npm run assets:extract-design-boards` — extraction complète + debug + audit
  - `npm run assets:debug-design-boards` — debug overlay uniquement
  - `npm run assets:audit-design-boards` — rapport d'audit uniquement

## Sorties

```
public/assets/generated/
  [univers]/
    staging/       ← tous les crops, statut quelconque
    clean/         ← uniquement statut clean (utilisable en jeu)
  _debug/
    {univers}_crop_debug.png   ← overlay rectangles colorés
  _audit/
    design-board-extraction-report.json
    design-board-extraction-report.md
```

## Deux niveaux de crop

### Section crops (`type: 'section'`)
Pour documentation et debug. Peuvent contenir le titre de section si c'est intentionnel.  
Ne doivent **jamais** être utilisés tels quels comme décor gameplay.

Zones : `gameplayPreview`, `hud`, `props`, `pickups`, `obstacles`, `boss`, `borders`, `badges`

### Item crops (`type: 'item'`)
Pour usage futur en jeu. Doivent isoler un objet unique, sans titre ni section voisine.

Zones : `palette`, `borderTop`, `borderBottom`, `borderLeft`, `borderRight`

## Quality Gate

Seules les zones avec `status: 'clean'` sont copiées dans `clean/`.  
`DesignBoardManager.getDeveloperExtractedPath()` retourne `null` pour tout autre statut.

### Statuts disponibles

| Statut | Signification | Action |
|--------|---------------|--------|
| `clean` | Utilisable en jeu | Aucune |
| `needsManualCrop` | Coordonnées non vérifiées visuellement | Revoir image debug |
| `containsLabel` | Titre/étiquette parasite inclus | Ajuster y/height |
| `overlapsOtherSection` | Section voisine visible | Ajuster y |
| `partial` | Objet coupé | Agrandir rect |
| `tooWide` / `tooTall` | Trop de fond | Réduire rect |
| `ambiguous` | Non fiable sans revue | Revue obligatoire |
| `missing` | Coordonnées non définies | Définir rect |
| `invalid` | Rect hors image | Corriger coordonnées |

## Palette

`palette.json` n'est généré que si :
- La zone `palette` est `clean`, **ET**
- Au moins 8 couleurs distinctes sont extraites de manière fiable.

Sinon : `palette.png` uniquement dans `staging/`.

## Debug overlay

Généré pour chaque univers dans `_debug/`. Couleur par statut :
- 🟢 vert — `clean`
- 🟡 jaune — `needsManualCrop`
- 🟠 orange — `containsLabel`
- 🔴 rouge — `overlapsOtherSection`
- 🔵 cyan — `ambiguous`
- ⬛ gris — `missing`

## Workflow de correction

Voir `docs/design_boards/MANUAL_CROP_WORKFLOW.md`.

## Frontière runtime

`public/assets/design-board-manifest.json` est le manifest runtime chargé par les scènes. Il reste indépendant du pipeline d'extraction developer. Les assets developer ne sont intégrés au gameplay qu'après promotion explicite via le quality gate.
