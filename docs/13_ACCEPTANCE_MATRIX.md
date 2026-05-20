# 13 — Acceptance Matrix

Ce fichier sert à valider la build V4 actuelle après patchs.

## Statuts autorisés

- `OK` : conforme et testé.
- `PARTIAL` : présent mais incomplet ou fallback.
- `FAIL` : absent ou cassé.
- `NOT TESTED` : non testé manuellement.

## Matrice globale

| Domaine | Critère | Statut | Notes |
|---|---|---:|---|
| Build | `npm run check` passe | OK | Dernier check demandé pendant nettoyage repo |
| Web mobile | `npm run dev` accessible sur téléphone via Wi-Fi | NOT TESTED | |
| Architecture | Pas de fichier monolithique | NOT TESTED | |
| Architecture | Scènes séparées | NOT TESTED | |
| Architecture | Core Snake séparé du rendu | NOT TESTED | |
| Architecture | Mécaniques séparées par univers | NOT TESTED | |
| UX | TitleScene fonctionnelle | NOT TESTED | |
| UX | WorldMapScene fonctionnelle | NOT TESTED | |
| UX | World map asset réellement utilisé | OK | `public/assets/map/world_map.png` 1448×1086 |
| UX | World map cadrage mobile patch 909 | NOT TESTED | Cover scale, zoom initial, nodes compacts, footer/header réduits |
| UX | World map nodes + double tap patch 911 | NOT TESTED | Nodes taille écran stable, simple tap sélection, double tap lance |
| UX | Title noms univers patch 912 | NOT TESTED | Labels centralisés, noms complets sur 2 colonnes |
| Design | Cadres gameplay univers | OK | 8 cadres complets dans `public/assets/frames/[univers]/frame.png`; runtime non testé visuellement dans cette passe |
| Audit | Audit mobile-first | OK | Rapports dans `docs/audits/` |
| UX | LevelIntroScene fonctionnelle | NOT TESTED | |
| UX | ClearScene fonctionnelle | NOT TESTED | |
| UX | GameOverScene fonctionnelle | NOT TESTED | |
| Input | Swipe gameplay | NOT TESTED | |
| Input | Clavier desktop fallback | NOT TESTED | |
| Input | Map drag | NOT TESTED | |
| Input | Map pinch | NOT TESTED | |
| Input | Pas de double tap involontaire | NOT TESTED | |
| Gameplay | Snake avance à timestep fixe | NOT TESTED | |
| Gameplay | Pickup spawn safe | NOT TESTED | |
| Gameplay | Collision mur | NOT TESTED | |
| Gameplay | Collision corps | NOT TESTED | |
| Gameplay | Retry après Game Over | NOT TESTED | |
| Gameplay | Clear après objectif | NOT TESTED | |
| Save | Progression sauvegardée en localStorage | NOT TESTED | |
| Design | Design pack utilisé | NOT TESTED | |
| Design | Pas de planche brute visible dans gameplay | NOT TESTED | |
| Design | Grille prioritaire | NOT TESTED | |
| Design | Pickups visibles | NOT TESTED | |
| Design | Obstacles lisibles | NOT TESTED | |
| Audio | Audio ne bloque pas le jeu | NOT TESTED | |

## Matrice univers

| Univers | Normal jouable | Mécanique normale distincte | Boss jouable | Mécanique boss distincte | Design identifiable | Notes |
|---|---:|---:|---:|---:|---:|---|
| Castle | NOT TESTED | NOT TESTED | NOT TESTED | NOT TESTED | NOT TESTED | |
| Sonic | NOT TESTED | NOT TESTED | NOT TESTED | NOT TESTED | NOT TESTED | |
| Streets | NOT TESTED | NOT TESTED | NOT TESTED | NOT TESTED | NOT TESTED | |
| Fighter | NOT TESTED | NOT TESTED | NOT TESTED | NOT TESTED | NOT TESTED | |
| OutRun | NOT TESTED | NOT TESTED | NOT TESTED | NOT TESTED | NOT TESTED | |
| Shinobi | NOT TESTED | NOT TESTED | NOT TESTED | NOT TESTED | NOT TESTED | |
| Kombat | NOT TESTED | NOT TESTED | NOT TESTED | NOT TESTED | NOT TESTED | |
| Paperboy | NOT TESTED | NOT TESTED | NOT TESTED | NOT TESTED | NOT TESTED | |

## Critère d’acceptation première build

La première build est acceptable si :

- `npm run check` = OK ;
- Title, map, game, clear, game over = OK ;
- Snake core = OK ;
- au moins 8 niveaux normaux lançables = OK ;
- au moins 8 boss lançables = OK ;
- chaque univers a une différence mécanique visible = OK ou PARTIAL documenté ;
- design pack utilisé ou fallback documenté ;
- pas de crash bloquant mobile.

## Si la matrice n’est pas conforme

Ne pas prétendre que la build est finie.

Créer immédiatement des tickets correctifs :
- P0 : crash, build, écran noir, input cassé ;
- P1 : mécanique absente, boss absent, map cassée, lisibilité mauvaise ;
- P2 : polish visuel, audio, transitions.
