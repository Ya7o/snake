# PATCH 955 — Corrections après audit : Packaging web déploiement

## Contexte
Audit exécuté sur `snake-drive-v4-backup-20260520-2039.tar.gz`. Le projet doit rester mobile-first, en français, avec 8 univers, 16 niveaux, 8 boss et les 24 assets runtime validés.

## Constats principaux
- Build dist généré : 38594.0 Ko, 200 fichiers.
- Meta viewport détectée : True.
- Références favicon/manifest/theme : 15.

## Actions correctives demandées
- [ ] Vérifier dist sur hébergement cible.
- [ ] Vérifier chemins relatifs assets.
- [ ] Ajouter favicon/app icon si absent.
- [ ] Ajouter manifest PWA seulement si souhaité.
- [ ] Contrôler cache et hard refresh mobile.
- [ ] Documenter commande de déploiement.

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
