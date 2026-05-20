Lis CLAUDE.md, PROJECT_INDEX.md, docs/13_ACCEPTANCE_MATRIX.md et docs/15_DESIGN_BOARD_PIPELINE_SPEC.md.

Problème :
Les planches dans /home/kali/snake/design_boards/_incoming ne sont pas réellement utilisées par le jeu.

Exécute le ticket :
tickets/903_INTEGRER_DESIGN_BOARDS_REELS.md

Objectif :
Créer un vrai pipeline board → assets → manifest → DesignBoardManager → renderers.

Contraintes :
- ne jamais afficher la planche brute dans le gameplay ;
- ne pas supprimer univers/boss/world map ;
- garder fallback procédural mais documenté ;
- utiliser au moins l’exemple OutRun visible dans le jeu ;
- lancer npm run assets:build, npm run assets:audit, npm run check.
