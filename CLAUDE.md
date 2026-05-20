# CLAUDE.md — Snake Drive V4

## Rôle

Tu développes **Snake Drive V4** from scratch en web mobile.

Tu dois :
- produire une première build stable rapidement ;
- respecter les tickets ;
- respecter les mécaniques par univers ;
- respecter les boss ;
- utiliser le design pack fourni ;
- garder le jeu mobile lisible ;
- éviter le chaos du prototype HTML monofichier V3.

## Objectif final première build

Une V4 stable avec :
- écran titre ;
- world map ;
- 8 univers ;
- 16 niveaux ;
- 8 boss ;
- Snake jouable ;
- mécaniques différentes par univers ;
- boss jouables ;
- design thématique issu des planches ;
- Game Over / Clear / Retry ;
- sauvegarde simple ;
- test mobile via navigateur.

## Stack

- Vite
- TypeScript strict
- Phaser 3
- Web mobile
- localStorage
- assets dans `public/assets`
- planches source dans `design_boards`

## Règles absolues

1. Exécuter le ticket demandé.
2. Si ticket master, suivre les étapes internes.
3. Toujours lancer `npm run check`.
4. Ne jamais afficher une planche design brute en gameplay.
5. Ne jamais mettre de décor détaillé derrière la grille.
6. Grille Snake prioritaire.
7. Mobile portrait prioritaire.
8. Pickups plus visibles que obstacles.
9. Dangers télégraphiés.
10. Boss courts et compréhensibles.
11. Ne pas ajouter de dépendance sans raison.
12. Ne pas bloquer le jeu si un asset manque : fallback visuel procédural obligatoire.

## Développement “en un coup”

L’utilisateur veut une première V4 développée rapidement en un passage PC.  
C’est autorisé via `tickets/000_MASTER_BUILD_V4_STABLE.md`.

Mais même en mode “en un coup” :
- garder les modules séparés ;
- éviter un gros fichier unique ;
- implémenter des fallbacks ;
- livrer stable plutôt que parfait ;
- noter les limites.

## Design pack

Les planches sont dans :
`design_boards/_incoming/`

Tu dois :
1. identifier/associer les planches aux univers ;
2. déplacer ou copier les références vers `design_boards/[univers]/` si pertinent ;
3. extraire ou recréer des assets propres dans `public/assets/universes/[univers]/` ;
4. créer fallback procédural si découpe impossible ;
5. ne jamais afficher la planche brute dans la grille.

## Mécaniques obligatoires

Chaque univers doit avoir une mécanique distincte :

- Castle : blink walls / illusion tiles
- Sonic : ring chains
- Streets : crowd blockers
- Fighter : charge move / rounds
- OutRun : lane drift / checkpoints
- Shinobi : focus / decoys
- Kombat : fatal zones / finish window
- Paperboy : delivery targets / route mayhem

Chaque boss doit avoir une variation boss distincte.

## Priorités

1. stabilité ;
2. jouable mobile ;
3. lisibilité ;
4. mécaniques différenciées ;
5. design cohérent ;
6. polish.

## Réponse attendue après codage

Toujours répondre avec :
- fichiers créés ;
- fichiers modifiés ;
- ce qui marche ;
- ce qui est fallback ;
- commandes lancées ;
- résultat `npm run check` ;
- URL/dev instruction ;
- tests mobile à faire.
