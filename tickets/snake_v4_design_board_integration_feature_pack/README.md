# Feature Pack — Design Boards Integration

Ce pack corrige le problème : les planches dans `/home/kali/snake/design_boards/_incoming` existent, mais le jeu ne les utilise probablement pas réellement.

## Cause probable

Les boards n’ont pas été utilisés parce que :
1. `design_boards/` est un dossier source, pas un dossier chargé par le navigateur.
2. Le jeu charge normalement depuis `public/assets/...`.
3. Aucun script ne convertit board → assets.
4. Aucun manifest ne relie board → univers → assets.
5. Le ticket master autorisait des fallbacks procéduraux.
6. Aucun audit runtime ne prouve que les boards sont utilisés.

## Objectif

Créer un vrai pipeline :

```text
design_boards/_incoming/*.png
→ mapping par univers
→ génération/extraction assets
→ public/assets/design-board-manifest.json
→ DesignBoardManager
→ RenderHud / RenderFrame / RenderPickups / RenderObstacles / RenderBoss
```

## Installation

Copier le contenu du pack à la racine du repo :

```bash
cp -r snake_v4_design_board_integration_feature_pack/* /home/kali/snake/
```

Puis donner à Claude Code / Codex :

```text
Lis PROMPT_COPY_PASTE.md et exécute le ticket 903.
```
