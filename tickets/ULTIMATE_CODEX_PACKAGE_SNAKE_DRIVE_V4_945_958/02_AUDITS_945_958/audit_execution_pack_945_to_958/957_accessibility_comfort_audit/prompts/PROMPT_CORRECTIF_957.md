# PATCH 957 — Corrections après audit : Accessibilité confort

## Contexte
Audit exécuté sur `snake-drive-v4-backup-20260520-2039.tar.gz`. Le projet doit rester mobile-first, en français, avec 8 univers, 16 niveaux, 8 boss et les 24 assets runtime validés.

## Constats principaux
- Signaux lisibilité/contraste : 248.
- Signaux motion/clignotement/tween : 422.
- Signaux audio/mute : 47.
- Le confort doit être validé sur écran réel; éviter clignotements agressifs.

## Actions correctives demandées
- [ ] Vérifier contraste de tous les textes visibles.
- [ ] Ne pas transmettre danger uniquement par couleur.
- [ ] Limiter clignotements / flashs.
- [ ] Ajouter ou vérifier mute si audio actif.
- [ ] Vérifier confort après 10 minutes de jeu.

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
