# PATCH — Corrections avant production selon audit 947

## Contexte
L’audit 947 valide build/check et 24 assets runtime, mais demande une QA mobile réelle et une vérification visuelle du câblage GameScene.

## Objectif
Corriger les points avant production sur les 10 axes :
1. Build / stabilité.
2. GameScene / gameplay réel.
3. Lisibilité mobile.
4. Câblage 24 assets.
5. Cohérence 8 univers.
6. WorldMap / progression.
7. Écrans intro / victoire / game over.
8. Nettoyage assets.
9. Textes français.
10. QA Android.

## À faire
- Vérifier que GameScene affiche bien pickup / obstacle / boss.
- Tester les 8 univers.
- Ajuster tailles sprites.
- Supprimer les résidus :
  - public/assets/external/_audit
  - public/assets/external/_sources
  - public/assets/external/_licenses
- Vérifier textes FR visibles.
- Nettoyer logs inutiles.
- Produire rapport mobile.

## Interdits
- Ne pas réintroduire les anciens pipelines assets.
- Ne pas modifier les 24 PNG.
- Ne pas changer les règles Snake.
- Ne pas masquer la grille.
- Ne pas charger tous les assets globalement.

## Tests
npm run check
npm run build
npm run preview -- --host 0.0.0.0

## Rapport final obligatoire
Pour chaque point :
- OK / NOK ;
- fichiers modifiés ;
- captures ou observations ;
- blocages.
