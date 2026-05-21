# PATCH — QA ergonomie mobile + performance

## Contexte
L’audit 948 cible uniquement l’ergonomie mobile, la lisibilité et la performance. Le build passe, les 24 assets runtime existent. Le risque restant est la validation sur écran téléphone réel.

## Objectif
Contrôler et corriger :
- viewport / resize ;
- contrôles tactiles ;
- safe area ;
- lisibilité grille/HUD ;
- taille des sprites runtime ;
- performance Phaser ;
- logs / résidus ;
- test Android réel.

## À faire
1. Lancer :
   ```bash
   npm run check
   npm run build
   npm run preview -- --host 0.0.0.0
   ```
2. Tester sur Chrome Android.
3. Contrôler 360x800, 390x844, 412x915.
4. Ajuster tailles :
   - pickup : 0.65–0.75 cell ;
   - obstacle : 0.75–0.90 cell ;
   - boss : 1.0–1.15 cell.
5. Vérifier que les sprites ne masquent jamais la grille.
6. Supprimer ou archiver les résidus :
   - public/assets/external/_audit
   - public/assets/external/_sources
   - public/assets/external/_licenses
7. Nettoyer logs non utiles.
8. Faire une session de 10 parties pour détecter ralentissements.

## Interdits
- Ne pas créer de nouveaux assets.
- Ne pas relancer les pipelines d’extraction.
- Ne pas modifier les règles Snake.
- Ne pas agrandir la grille pour compenser un sprite.
- Ne pas charger tous les assets globalement.

## Rapport final obligatoire
Lister :
- tailles écran testées ;
- contrôles testés ;
- univers testés ;
- FPS/ressenti performance ;
- corrections appliquées ;
- fichiers modifiés ;
- blocages.
