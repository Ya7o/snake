# PATCH 952 — Corrections après audit : Textes français microcopy

## Contexte
Audit exécuté sur `snake-drive-v4-backup-20260520-2039.tar.gz`. Le projet doit rester mobile-first, en français, avec 8 univers, 16 niveaux, 8 boss et les 24 assets runtime validés.

## Constats principaux
- Occurrences anglaises détectées par scan brut : 68.
- Occurrences françaises détectées : 139.
- Le scan brut peut inclure noms internes; il faut relire uniquement le texte visible joueur.

## Actions correctives demandées
- [ ] Relire TitleScene, WorldMapScene, LevelIntroScene, ClearScene, GameOverScene.
- [ ] Remplacer l'anglais visible par français court.
- [ ] Limiter les instructions niveau à une phrase.
- [ ] Uniformiser boutons : Jouer, Continuer, Rejouer, Carte, Suivant.
- [ ] Vérifier accents sur mobile.

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
