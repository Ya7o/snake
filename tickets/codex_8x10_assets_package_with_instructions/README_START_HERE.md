# PACKAGE CODEX — Banque 8 x 10 assets

## Contenu
- 8 univers
- 10 images par univers
- Total : 80 PNG
- 1 manifest global : `ready_to_copy/public/assets/universe_asset_bank/manifest.json`
- 1 manifest par univers

## Structure des fichiers

```txt
ready_to_copy/public/assets/universe_asset_bank/
  universe_01_castle/
  universe_02_sonic/
  universe_03_streets/
  universe_04_fighter/
  universe_05_outrun/
  universe_06_shinobi/
  universe_07_kombat/
  universe_08_paperboy/
```

## Ordre dans chaque univers

```txt
01-03 = pickups
04-06 = obstacles
07-08 = props décoratifs
09    = élément iconique majeur
10    = menace / boss
```

## Usage attendu
Ce package est une banque d’assets élargie. Il ne remplace pas automatiquement les 24 assets runtime déjà intégrés.

Codex doit :
1. copier `ready_to_copy/` à la racine du projet ;
2. lire le manifest global ;
3. sélectionner les assets par rôle ;
4. ne pas réintroduire les anciens pipelines d’extraction ;
5. conserver la lisibilité mobile de la grille.

## Note transparence
Les fichiers sont fournis en PNG. Le manifest indique `has_alpha_channel`, `alpha_min` et `alpha_max`.
Si un fichier a `alpha_min = 255`, il faut considérer qu’il n’a pas de transparence réelle et le nettoyer avant usage production.

## Contraintes
- Ne pas modifier les mécaniques Snake sans validation.
- Ne pas supprimer les 8 univers existants.
- Ne pas utiliser les images décoratives dans la grille gameplay si elles gênent la lisibilité.
- Précharger uniquement les assets de l’univers courant.
