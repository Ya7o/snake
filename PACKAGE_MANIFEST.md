# Package Manifest

## État Actuel

Le repo n'est plus un package “from scratch”. C'est une build V4 active avec :

- Vite + TypeScript + Phaser 3.
- 8 univers / 16 niveaux / 8 boss.
- World map illustrée.
- Cadres gameplay complets par univers.
- Assets runtime dans `public/assets`.
- Sources design triées dans `design_boards/[univers]`.

## Nettoyage

Supprimé du repo de travail :

- `dist/` : artefact généré par build.
- `design_boards/_incoming/` : doublon après tri par univers.
- `tickets/1st build/` : archive première build obsolète.
- anciens packs de tickets appliqués 909-921.
- prototypes HTML V3 dans `references/prototypes/`.

## Commande De Validation

```bash
npm run check
```

## Convention

Les tickets futurs doivent être petits, ciblés et documentés. Ne pas réintroduire de gros packs d'archives dans le repo racine.
