# PATCH 951 — Corrections après audit : Progression sauvegarde WorldMap

## Contexte
Audit exécuté sur `snake-drive-v4-backup-20260520-2039.tar.gz`. Le projet doit rester mobile-first, en français, avec 8 univers, 16 niveaux, 8 boss et les 24 assets runtime validés.

## Constats principaux
- Signaux sauvegarde/progression détectés : 200.
- Signaux WorldMap/unlock détectés : 853.
- La robustesse save corrompue / niveau invalide reste à tester explicitement.

## Actions correctives demandées
- [ ] Tester progression depuis zéro.
- [ ] Tester refresh pendant niveau, après clear et après game over.
- [ ] Tester localStorage vide et localStorage corrompu.
- [ ] Vérifier retour WorldMap et unlock boss.
- [ ] Ajouter fallback si levelId/universeId invalide.

## Contraintes strictes
- Ne pas réintroduire les anciens pipelines assets.
- Ne pas modifier les 24 PNG runtime sans validation explicite.
- Ne pas supprimer les univers/niveaux/boss.
- Ne pas réécrire globalement le jeu.
- Garder la grille Snake prioritaire.
- Mobile Android / Chrome Android prioritaire.

## Tests obligatoires
```bash
npm run check
npm run build
npm run preview -- --host 0.0.0.0
```

## Rapport final obligatoire
Lister :
1. fichiers modifiés ;
2. corrections faites ;
3. tests lancés ;
4. résultat mobile si testé ;
5. risques restants ;
6. blocages / questions.
