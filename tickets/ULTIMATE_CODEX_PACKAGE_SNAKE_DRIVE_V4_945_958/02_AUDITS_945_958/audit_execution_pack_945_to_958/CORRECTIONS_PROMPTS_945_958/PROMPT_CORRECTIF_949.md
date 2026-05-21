# PATCH 949 — Corrections après audit : Gameplay balance

## Contexte
Audit exécuté sur `snake-drive-v4-backup-20260520-2039.tar.gz`. Le projet doit rester mobile-first, en français, avec 8 univers, 16 niveaux, 8 boss et les 24 assets runtime validés.

## Constats principaux
- Build/check exécutés; résultats centralisés dans le package.
- Le gameplay contient des signaux de score, collision, niveaux et victoire/défaite.
- L'équilibrage réel ne peut pas être validé statiquement : il faut une passe en jeu sur les 16 niveaux.
- Risque principal : courbe de difficulté non mesurée niveau par niveau.

## Actions correctives demandées
- [ ] Créer une table de difficulté pour les 16 niveaux.
- [ ] Tester vitesse Snake, taille grille, nombre d'obstacles et objectifs par niveau.
- [ ] Noter tous les décès injustes ou incompréhensibles.
- [ ] Calibrer progression : premiers niveaux courts, boss plus lisibles, difficulté graduelle.

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
