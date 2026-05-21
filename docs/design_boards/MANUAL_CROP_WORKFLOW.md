# Manual Crop Workflow

## Quand l'utiliser

Après avoir exécuté `npm run assets:extract-design-boards`, le rapport d'audit liste les zones bloquées ou `needsManualCrop`. Ce workflow décrit comment les corriger univers par univers.

## Étapes

### 1 — Lancer l'extraction complète

```bash
npm run assets:extract-design-boards
```

Cela génère :
- `public/assets/generated/[univers]/staging/` — tous les crops bruts
- `public/assets/generated/_debug/[univers]_crop_debug.png` — overlay rectangles
- `public/assets/generated/_audit/design-board-extraction-report.md` — rapport lisible

### 2 — Ouvrir l'image debug

```
public/assets/generated/_debug/{univers}_crop_debug.png
```

Chaque rectangle est coloré selon son statut :
- 🟢 vert — `clean`
- 🟡 jaune — `needsManualCrop`
- 🟠 orange — `containsLabel`
- 🔴 rouge — `overlapsOtherSection`
- 🔵 cyan — `ambiguous`
- ⬛ gris — `missing`

### 3 — Identifier les corrections nécessaires

Pour chaque zone problématique, noter les nouvelles coordonnées `x, y, width, height` en pixels en utilisant l'image source (1024 × 1536) comme référence.

Outils recommandés : GIMP (Tools > Measure), Inkscape, ou tout éditeur affichant les coordonnées pixel.

### 4 — Corriger les deux fichiers de manifest

Les coordonnées doivent être mises à jour **dans les deux fichiers** :

#### `src/assets/designBoardManifest.ts`
```typescript
obstacles: s('section', { x: 58, y: 820, width: 420, height: 154 }, 'clean', 'Obstacles sans label.'),
```

#### `tools/design-boards/extractDeveloperAssets.mjs`
```javascript
obstacles: s('section', 58, 820, 420, 154, 'clean', 'Obstacles sans label.'),
```

⚠️ Changer le statut de `containsLabel` / `needsManualCrop` → `clean` seulement si le crop est vérifié propre.

### 5 — Relancer extraction + audit

```bash
npm run assets:extract-design-boards
npm run assets:audit-design-boards
```

Vérifier que le statut de la zone est passé à `clean` dans le rapport.

### 6 — Vérifier le debug mis à jour

Rouvrir `_debug/{univers}_crop_debug.png` et confirmer que le rectangle est maintenant vert.

### 7 — `npm run check`

```bash
npm run check
```

## Règles

- Ne pas promouvoir une zone en `clean` sans l'avoir vérifiée visuellement.
- Un crop douteux bloqué est préférable à un crop mal intégré.
- Les `borderTop/Bottom/Left/Right` nécessitent d'abord d'identifier les bandes sur la planche source (parfois absentes ou non utilisables).
- `palette.json` n'est généré que pour les zones `clean` avec ≥ 8 couleurs distinctes.

## Priorité de correction recommandée

1. `obstacles` (containsLabel → relever y)
2. `boss` (overlapsOtherSection → relever y)
3. `badges` (containsLabel → corriger y)
4. `borders` (containsLabel → recadrer)
5. `pickups`, `props` (needsManualCrop → vérifier bords)
6. `palette` (needsManualCrop → vérifier nombre de couleurs)
7. `borderTop/Bottom/Left/Right` (missing → définir si les bandes sont identifiables)
