# PATCH 943 — Pack final 24 assets runtime validés

## Objectif

Ce paquet remplace les essais précédents par une sélection maîtrisée de **24 images runtime** :
- 8 univers ;
- 3 assets par univers ;
- pickup / obstacle / boss ;
- fichiers PNG en RGBA avec couche alpha.

## À copier dans le projet

Copier tout le contenu de :

```txt
ready_to_copy/
```

à la racine du projet.

## Assets à garder

```txt
public/assets/runtime/universes/<univers>/*.png
```

Il y a exactement 24 fichiers runtime.

## Manifest Codex

```txt
src/assets/runtimeUniverseAssets.ts
src/assets/runtimeUniverseAssets.manifest.json
```

## Vérification alpha

Rapports :

```txt
reports/alpha_validation_report.csv
reports/alpha_validation_report.json
```

Contact sheet :

```txt
review/contact_sheets/runtime_assets_alpha_contact_sheet.jpg
```

## Important

Ce pack est volontairement réduit.  
Codex doit ignorer/supprimer les anciens dossiers expérimentaux :
- `public/assets/external/_downloaded/`
- `public/assets/external/_extracted/`
- `public/assets/design_board_icons/`
- `public/assets/runtime_candidates_from_design_boards/`
- anciens scripts d’extraction design-board ;
- anciens patchs de pipeline raté.

Le jeu doit utiliser uniquement les 24 PNG listés dans `runtimeUniverseAssets.ts`.
