# PATCH 958 — Corrections après audit : Release candidate final

## Contexte
Audit exécuté sur `snake-drive-v4-backup-20260520-2039.tar.gz`. Le projet doit rester mobile-first, en français, avec 8 univers, 16 niveaux, 8 boss et les 24 assets runtime validés.

## Constats principaux
- Release candidate checks passés : 7/10.
- Le point explicitement non validé automatiquement est la QA Android réelle.
- Les textes FR restent à relire selon audit 952.

## Actions correctives demandées
- [ ] Faire une session complète Android réelle.
- [ ] Tester les 8 univers et au moins un boss.
- [ ] Relire et corriger textes visibles.
- [ ] Supprimer ou archiver les 3 résidus assets.
- [ ] Créer un tag release candidate uniquement après QA mobile.

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
