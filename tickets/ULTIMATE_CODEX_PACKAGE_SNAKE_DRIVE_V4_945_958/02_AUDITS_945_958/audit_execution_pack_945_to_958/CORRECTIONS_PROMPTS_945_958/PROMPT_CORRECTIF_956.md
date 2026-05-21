# PATCH 956 — Corrections après audit : Licences propriété assets

## Contexte
Audit exécuté sur `snake-drive-v4-backup-20260520-2039.tar.gz`. Le projet doit rester mobile-first, en français, avec 8 univers, 16 niveaux, 8 boss et les 24 assets runtime validés.

## Constats principaux
- 24 assets runtime validés : 24/24.
- Images totales dans projet : 469.
- Hits licence/source/crédit : 3065.
- Dossiers legacy résiduels : 3.

## Actions correctives demandées
- [ ] Confirmer que seuls les 24 assets runtime sont utilisés en gameplay.
- [ ] Archiver ou supprimer dossiers _audit/_sources/_licenses s'ils ne sont pas requis en runtime.
- [ ] Conserver un README de provenance des 24 assets générés.
- [ ] Vérifier qu'aucun ancien asset externe n'est embarqué par erreur.

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
