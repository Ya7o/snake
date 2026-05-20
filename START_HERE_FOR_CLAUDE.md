# START_HERE_FOR_CLAUDE.md

Tu es Claude Code / Codex sur le projet Snake Drive V4.

## But immédiat

Créer une première build V4 stable from scratch, web mobile, testable rapidement sur téléphone.

## Avant de coder

Lire dans cet ordre :

1. `CLAUDE.md`
2. `PROJECT_INDEX.md`
3. `docs/01_VISION.md`
4. `docs/02_GAME_DESIGN.md`
5. `docs/03_MECHANICS_BIBLE.md`
6. `docs/04_ART_BIBLE.md`
7. `docs/06_TECHNICAL_ARCHITECTURE.md`
8. `docs/07_QA_CHECKLIST.md`
9. `docs/10_DESIGN_PACK_USAGE.md`
10. `docs/13_ACCEPTANCE_MATRIX.md`
11. `docs/14_UNIVERSE_IMPLEMENTATION_SPEC.md`
12. `design_boards/BOARD_MAPPING.md`
13. `tickets/000_MASTER_BUILD_V4_STABLE.md`

## Instruction principale

Exécuter :

```text
tickets/000_MASTER_BUILD_V4_STABLE.md
```

Ce ticket master autorise une première build complète en une séquence PC.

## Après première build

Exécuter ensuite :

1. `tickets/900_AUDIT_CONFORMITE_PROJET.md`
2. si nécessaire : `tickets/901_PLAN_CORRECTIONS_POST_AUDIT.md`

## Commandes

```bash
npm install
npm run check
npm run dev
```

## Règles

- Web mobile portrait prioritaire.
- Grille Snake prioritaire.
- 8 univers / 16 niveaux / 8 boss.
- Une mécanique différente par univers.
- Une mécanique boss différente.
- Design pack utilisé ou fallback documenté.
- Ne jamais afficher les planches brutes dans le gameplay.
- Remplir/résumer la matrice d’acceptation.
