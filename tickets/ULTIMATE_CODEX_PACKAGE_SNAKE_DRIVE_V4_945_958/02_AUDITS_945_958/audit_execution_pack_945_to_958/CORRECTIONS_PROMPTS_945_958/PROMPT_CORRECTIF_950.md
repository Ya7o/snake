# PATCH 950 — Corrections après audit : Mécaniques par univers

## Contexte
Audit exécuté sur `snake-drive-v4-backup-20260520-2039.tar.gz`. Le projet doit rester mobile-first, en français, avec 8 univers, 16 niveaux, 8 boss et les 24 assets runtime validés.

## Constats principaux
- Les 8 univers sont référencés dans le code/projet.
- L'audit statique confirme des signaux thématiques, mais pas la sensation réelle de différence gameplay.
- Risque : certains univers peuvent rester des skins avec assets différents mais mécanique trop proche.

## Actions correctives demandées
- [ ] Pour chaque univers, écrire une règle gameplay visible en une phrase.
- [ ] Vérifier en jeu que pickup/obstacle/boss provoquent un comportement différent.
- [ ] Renforcer les univers faibles avec feedback spécifique plutôt qu'ajouter des assets.
- [ ] Créer une matrice univers → mécanique → feedback → risque.

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
