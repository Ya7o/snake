# Developer Asset Audit — Patch 928

## État initial post-patch 928

Tous les 8 univers sont présents. Toutes les planches sont `1024 × 1536`. Shinobi conserve le nom historique `developper assets.png.png`.

## Résultat quality gate

**0 zones clean** au premier passage. Toutes les zones nécessitent une revue visuelle via les images debug.

## Défauts connus (issus des bad_outputs patch 928)

Les sorties du pipeline précédent (patch 925) présentaient les défauts suivants, documentés dans `tickets/patch_928_design_board_extraction_quality_gate_manual_crop_workflow/references/bad_outputs/` :

| Zone | Défaut observé | Statut assigné |
|------|---------------|----------------|
| `badges` | Titre "BORDURES" visible à la place des badges | `containsLabel` |
| `borders` | Titre de section mélangé avec les bordures | `containsLabel` |
| `boss` | Fin de la section précédente visible en haut du crop | `overlapsOtherSection` |
| `obstacles` | Label "OBSTACLES" inclus dans le crop | `containsLabel` |
| `palette.json` | Seulement 5 couleurs extraites (seuil minimum : 8) | `needsManualCrop` |
| `gameplayPreview` | Zone trop approximative pour usage gameplay | `needsManualCrop` |
| `pickups` | Bords non vérifiés | `needsManualCrop` |
| `props` | Séparateurs et labels potentiels | `needsManualCrop` |

Ces défauts sont appliqués à l'ensemble des 8 univers par défaut (par analogie avec le layout Castle). Des corrections par univers sont attendues après revue des images debug.

## Zones borderTop/Bottom/Left/Right

Non définies pour les 8 univers (statut `missing`). À définir après identification visuelle des bandes de cadre dans chaque planche.

## Statuts par univers (initial)

| Univers | clean | needsManualCrop | containsLabel | overlapsOtherSection | ambiguous | missing |
|---------|-------|-----------------|---------------|----------------------|-----------|---------|
| castle | 0 | 5 | 4 | 1 | 0 | 4 |
| sonic | 0 | 5 | 4 | 1 | 0 | 4 |
| streets | 0 | 4 | 4 | 1 | 1 | 4 |
| fighter | 0 | 4 | 4 | 1 | 1 | 4 |
| outrun | 0 | 5 | 4 | 1 | 0 | 4 |
| shinobi | 0 | 5 | 4 | 1 | 0 | 4 |
| kombat | 0 | 4 | 4 | 1 | 1 | 4 |
| paperboy | 0 | 5 | 4 | 1 | 0 | 4 |

## Actions prioritaires

1. Corriger `obstacles` (8 univers) — relever `y` pour passer sous le label
2. Corriger `boss` (8 univers) — relever `y` pour exclure la section précédente
3. Corriger `badges` (8 univers) — vérifier le `y` exact après le séparateur
4. Corriger `borders` (8 univers) — exclure le titre de section
5. Vérifier `pickups` et `props` — promouvoir en `clean` si bords propres
6. Définir `borderTop/Bottom/Left/Right` — si les bandes sont identifiables
7. Vérifier `palette` — promouvoir en `clean` si ≥ 8 couleurs distinctes

## Outils

```bash
# Extraction complète + debug + audit
npm run assets:extract-design-boards

# Debug overlay uniquement (sans recropper)
npm run assets:debug-design-boards

# Rapport d'audit uniquement
npm run assets:audit-design-boards
```

Rapport machine-readable : `public/assets/generated/_audit/design-board-extraction-report.json`  
Rapport lisible : `public/assets/generated/_audit/design-board-extraction-report.md`

## Workflow de correction

Voir `docs/design_boards/MANUAL_CROP_WORKFLOW.md`.
