# START_HERE_FOR_CLAUDE.md

Tu es sur Snake Drive V4, une build déjà fonctionnelle. Ne repars pas from scratch.

## Lire D'abord

1. `CLAUDE.md`
2. `README.md`
3. `PROJECT_INDEX.md`
4. `docs/00_REPO_STRUCTURE.md`
5. `docs/06_TECHNICAL_ARCHITECTURE.md`
6. `docs/13_ACCEPTANCE_MATRIX.md`
7. `docs/14_UNIVERSE_IMPLEMENTATION_SPEC.md`

## Travail Courant

Appliquer uniquement le ticket demandé par l'utilisateur. Les anciens tickets de première build ont été nettoyés; `tickets/` ne doit contenir que les tickets encore utiles.

## Commandes

```bash
npm install
npm run check
npm run dev
```

Ne lance pas de serveur si l'utilisateur demande explicitement de ne pas le faire.

## Règles

- Web mobile portrait prioritaire.
- 8 univers, 16 niveaux, 8 boss à préserver.
- Gameplay Snake lisible avant le décor.
- Assets runtime dans `public/assets`.
- Sources design dans `design_boards/[univers]`.
- Pas de planche brute affichée en gameplay.
