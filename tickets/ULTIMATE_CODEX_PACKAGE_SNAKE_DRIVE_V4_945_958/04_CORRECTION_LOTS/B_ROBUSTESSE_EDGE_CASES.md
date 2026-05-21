# LOT B — Robustesse edge cases

## Objectif
Éviter les crashes et états bloqués.

## À tester / corriger
- localStorage vide.
- localStorage corrompu.
- levelId invalide.
- universeId invalide.
- asset runtime manquant.
- refresh pendant niveau.
- retour d’onglet.
- resize / orientation.
- spam swipe/tap.

## Fichiers probables
- `src/scenes/GameScene.ts`
- `src/scenes/WorldMapScene.ts`
- fichiers progression/sauvegarde.

## Tests
```bash
npm run check
npm run build
npm run preview -- --host 0.0.0.0
```

## Rapport final
Lister edge cases testés et corrections.
