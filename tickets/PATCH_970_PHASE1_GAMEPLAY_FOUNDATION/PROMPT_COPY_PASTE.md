Tu interviens sur le repo Snake Drive V4.

Lis d’abord :

- `CLAUDE.md`
- `PROJECT_INDEX.md`
- `docs/00_REPO_STRUCTURE.md`
- `docs/02_GAME_DESIGN.md`
- `docs/03_MECHANICS_BIBLE.md`
- `tickets/970_PATCH_PHASE1_GAMEPLAY_FOUNDATION.md`
- `docs/970_PHASE1_GAMEPLAY_DIRECTIVES.md`
- `docs/970_WORLD_RULES_MATRIX.md`
- `docs/970_PHASE1_TEST_PLAN.md`

## Mission

Implémenter le patch 970 : stabilisation Phase 1 gameplay.

L’objectif n’est pas de rajouter du contenu. L’objectif est de rendre Snake Drive V4 jouable de bout en bout, clair, stable et facile à continuer.

## Contraintes fortes

- Garder 8 univers.
- Garder 16 niveaux total.
- Garder 8 boss.
- Garder Phaser.
- Ne pas ajouter de dépendance.
- Ne pas refondre toute l’architecture.
- Ne pas modifier massivement les assets.
- Ne pas remplacer les backgrounds.
- Ne pas créer de système RPG, économie, shop, online, achievements.
- Ne pas transformer les boss en combats complexes.

## Scope attendu

1. Stabiliser `GameScene`.
2. Centraliser l’application des `MechanicUpdate` si nécessaire.
3. Vérifier que chaque mechanic respecte son gimmick unique.
4. Vérifier les conditions clear/fail.
5. Vérifier que chaque boss peut être battu et peut tuer.
6. Vérifier progression et save.
7. Vérifier mobile input.
8. Ajouter un debug gameplay léger seulement si utile.
9. Mettre à jour/créer une doc courte si une décision est prise.

## Point technique prioritaire

Inspecte `src/mechanics/BaseMechanic.ts` et `src/scenes/GameScene.ts`.

`MechanicUpdate` expose :

- `addPickup`
- `removePickup`
- `addWall`
- `removeWall`
- `hitDanger`
- `score`

Mais `GameScene` doit appliquer ces effets de manière cohérente. Si certains champs sont inutilisés, décide clairement :

- soit tu les appliques proprement via `applyMechanicUpdate()` ;
- soit tu simplifies l’interface, mais seulement si aucun mechanic n’en a besoin.

Recommandation : implémenter `applyMechanicUpdate()` proprement, sans usine à gaz.

## Tests à exécuter

```bash
npm run check
```

Puis test manuel avec :

```bash
npm run dev -- --host 0.0.0.0
```

Tester au minimum :

- Castle normal ;
- Castle boss ;
- Sonic normal ;
- OutRun normal ;
- Shinobi normal ;
- Kombat boss ;
- Paperboy boss.

## Critères de succès

- `npm run check` passe.
- Aucun nouveau monde/niveau n’est ajouté.
- Les 16 niveaux restent présents.
- Les 8 boss restent présents.
- Chaque niveau normal est clearable.
- Chaque boss est clearable.
- Les dangers spéciaux sont lisibles avant d’être létaux.
- Les contrôles mobile restent fiables.
- La progression World Map n’est pas cassée.

## Réponse attendue

À la fin, réponds avec :

1. fichiers modifiés ;
2. décisions prises ;
3. points volontairement non traités ;
4. résultat de `npm run check` ;
5. limites restantes ;
6. prochaine étape recommandée.
