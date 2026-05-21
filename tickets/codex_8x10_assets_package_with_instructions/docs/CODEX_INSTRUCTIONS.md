# INSTRUCTIONS CODEX — Intégration banque 8x10 assets

## Objectif
Installer une banque visuelle élargie de 80 images, sans casser le gameplay existant.

## Fichiers à copier
Copier ce dossier à la racine du projet :

```txt
ready_to_copy/
```

Il ajoutera :

```txt
public/assets/universe_asset_bank/
```

## Rôles des images

Chaque univers contient 10 images :

```txt
01-03 pickups
04-06 obstacles
07-08 props décoratifs
09 élément iconique majeur
10 boss / menace
```

## Intégration recommandée

### Étape 1 — Ne rien brancher automatiquement
Commencer par copier les fichiers et vérifier que le build passe.

```bash
npm run check
npm run build
```

### Étape 2 — Créer un loader optionnel
Créer un système léger, par exemple :

```txt
src/assets/universeAssetBank.ts
```

Il doit lire/mapper les chemins depuis le manifest ou depuis une structure TypeScript copiée du manifest.

### Étape 3 — Sélection contrôlée
Ne pas afficher les 80 images en gameplay.

Usage conseillé :
- pickups : candidats alternatifs ;
- obstacles : candidats alternatifs ;
- props : décor hors grille ou écrans d’intro ;
- iconic_major : écran intro / WorldMap / boss intro ;
- boss : boss marker ou écran boss.

### Étape 4 — Mobile first
Avant intégration dans la grille :
- pickup : 65–75% cellule ;
- obstacle : 75–90% cellule ;
- boss : 100–115% cellule maximum ;
- prop : jamais dans une cellule critique si trop détaillé.

## Fichiers interdits
Ne pas réintroduire :
- `public/assets/external/_downloaded`
- `public/assets/external/_extracted`
- `public/assets/design_board_icons`
- `public/assets/runtime_candidates_from_design_boards`

## Tests obligatoires
```bash
npm run check
npm run build
npm run preview -- --host 0.0.0.0
```

## Rapport final obligatoire
Codex doit lister :
1. fichiers copiés ;
2. assets réellement utilisés ;
3. assets non utilisés ;
4. éventuels fichiers sans vraie transparence ;
5. impact mobile ;
6. tests exécutés ;
7. blocages.
