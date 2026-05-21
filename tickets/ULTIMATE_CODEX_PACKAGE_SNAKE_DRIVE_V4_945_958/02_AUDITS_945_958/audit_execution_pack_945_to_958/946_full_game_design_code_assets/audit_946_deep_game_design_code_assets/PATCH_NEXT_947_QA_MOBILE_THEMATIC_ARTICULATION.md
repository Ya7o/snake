# PATCH — QA mobile finale + articulation thématique des 8 univers

## Contexte
Les 24 assets runtime sont présents. L’audit complet indique que le prochain travail utile est une QA gameplay/mobile par univers, pas un nouveau pipeline assets.

## Objectif
Valider que chaque univers est clair :
- pickup lisible ;
- obstacle lisible ;
- boss lisible ;
- mécanique compréhensible ;
- texte FR clair ;
- grille Snake prioritaire.

## Univers à vérifier
1. Castle — blink walls / miroir sorcier.
2. Sonic — ring chain / bumper / loop serpent.
3. Streets — foule / crime lord.
4. Fighter — charge / challenger.
5. OutRun — checkpoint / voiture / rival turbo.
6. Shinobi — shuriken / decoy / shadow ninja.
7. Kombat — finish token / fatal zone / dragon gate.
8. Paperboy — journal / chien / chaos quartier.

## À faire
1. Lancer check/build.
2. Démarrer preview mobile.
3. Tester chaque univers.
4. Ajuster la taille d’affichage des sprites :
   - pickup : 0.65–0.75 cellule ;
   - obstacle : 0.75–0.90 cellule ;
   - boss : 1.0–1.15 cellule.
5. Vérifier les textes FR d’intro.
6. Vérifier boss levels.
7. Nettoyer les logs / résidus.

## Interdits
- Ne pas créer de nouveaux assets.
- Ne pas relancer les anciens pipelines.
- Ne pas modifier les règles Snake.
- Ne pas remplacer les 24 PNG.
- Ne pas masquer la grille.

## Rapport final obligatoire
Pour chaque univers :
- screenshot ou description ;
- pickup OK/NOK ;
- obstacle OK/NOK ;
- boss OK/NOK ;
- mécanique OK/NOK ;
- taille retenue ;
- correction éventuelle.
