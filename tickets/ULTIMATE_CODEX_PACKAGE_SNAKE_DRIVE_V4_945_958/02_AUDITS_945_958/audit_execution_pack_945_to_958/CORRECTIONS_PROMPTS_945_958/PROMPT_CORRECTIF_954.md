# PATCH 954 — Corrections après audit : Robustesse edge cases

## Contexte
Audit exécuté sur `snake-drive-v4-backup-20260520-2039.tar.gz`. Le projet doit rester mobile-first, en français, avec 8 univers, 16 niveaux, 8 boss et les 24 assets runtime validés.

## Constats principaux
- Signaux resize/orientation : 66.
- Signaux storage/try/catch : 283.
- Signaux fallback/texture : 614.
- Les edge cases doivent être testés manuellement en preview mobile.

## Actions correctives demandées
- [ ] Tester spam swipe/tap.
- [ ] Tester changement d'onglet puis retour.
- [ ] Tester refresh pendant niveau.
- [ ] Tester resize/orientation.
- [ ] Tester asset manquant volontairement.
- [ ] Tester localStorage corrompu.

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
