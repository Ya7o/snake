Tu dois intégrer le package `universe_asset_bank` dans Snake Drive V4.

Contexte :
- Le package contient 8 univers x 10 images = 80 PNG.
- C’est une banque visuelle élargie, pas un remplacement automatique du runtime.
- Le gameplay existant et les 24 assets runtime doivent rester stables.

À faire :
1. Copier `ready_to_copy/` à la racine du projet.
2. Vérifier que les 80 fichiers sont présents.
3. Lire `public/assets/universe_asset_bank/manifest.json`.
4. Préparer un mapping TypeScript optionnel si nécessaire.
5. Ne brancher en gameplay que les images validées.
6. Garder les props pour intro/WorldMap/décor, pas pour la grille si elles gênent.
7. Tester check/build.

Interdits :
- Ne pas réintroduire les anciens pipelines assets.
- Ne pas modifier les règles Snake.
- Ne pas charger les 80 assets globalement au démarrage.
- Ne pas utiliser un asset sans vraie transparence en gameplay avant nettoyage.

Rapport final :
- fichiers copiés ;
- fichiers créés/modifiés ;
- assets branchés ;
- assets laissés en banque ;
- résultat check/build ;
- alertes transparence ;
- recommandations mobile.
