# Ticket 029 — Mapper les 8 planches design aux univers

## Objectif

Associer les 8 images du design pack aux 8 univers du jeu avant intégration visuelle.

## Source

Images dans :

```text
design_boards/_incoming/
```

Fichier à compléter :

```text
design_boards/BOARD_MAPPING.md
```

## Résultat attendu

À la fin :
- chaque univers a une planche source ou un fallback documenté ;
- les images sont copiées dans les dossiers univers ;
- `BOARD_MAPPING.md` est complété ;
- aucune image source n’est supprimée ;
- le niveau de confiance est documenté.

## Fichiers à créer

- copies renommées dans :
  - `design_boards/castle/`
  - `design_boards/sonic/`
  - `design_boards/streets/`
  - `design_boards/fighter/`
  - `design_boards/outrun/`
  - `design_boards/shinobi/`
  - `design_boards/kombat/`
  - `design_boards/paperboy/`

## Fichiers à modifier

- `design_boards/BOARD_MAPPING.md`
- éventuellement `docs/10_DESIGN_PACK_USAGE.md`

## Fichiers interdits

- ne pas supprimer `design_boards/_incoming/`;
- ne pas modifier gameplay ;
- ne pas modifier `src/`.

## Contraintes design

- Ne pas deviner sans documenter.
- Si l’image ne correspond pas clairement à un univers, mettre confiance `LOW`.
- Si nécessaire, utiliser le style comme inspiration générique.

## Tests

Pas de build obligatoire si aucun code modifié, mais si ce ticket est exécuté dans le master :

```bash
npm run check
```

## Résumé attendu

- mapping final ;
- fichiers copiés ;
- incertitudes ;
- fallbacks nécessaires.
