# Gameplay HUD Template Harmonization Fix

## Probleme

PATCH 1070 a documente une divergence visible dans le HUD gameplay :

- Castle utilisait un template en trois capsules ;
- les autres univers utilisaient une bande large opaque avec accent de couleur et, si disponible, `hud_panel.png`.

Cette difference pouvait casser l'impression de template commun entre les univers, surtout en QA mobile.

## Decision

Unifier le template HUD gameplay.

Le template retenu est la bande large, car il est deja utilise par sept univers et garde plus de largeur pour les textes de regle, score, progression et boss HP.

## Template retenu

Le HUD gameplay utilise maintenant un seul template :

- fond opaque pleine largeur ;
- ligne d'accent en haut ;
- separateur bas ;
- nom d'univers a gauche ;
- regle/hint compact au centre ;
- score ou boss HP a droite ;
- overlay `hud_panel.png` quand l'univers en fournit un.

Castle passe sur ce meme template. Son identite reste portee par la couleur d'accent dorée de sa palette et par sa frame/board panel gameplay, qui ne sont pas modifies.

## Changements

| Fichier | Changement | Raison |
|---|---|---|
| `src/render/HUDRenderer.ts` | Suppression du mode capsule et conservation du template bande large unique | Eviter deux templates HUD gameplay concurrents |
| `src/scenes/GameScene.ts` | Castle instancie le HUD standard comme les autres univers | Harmoniser Castle sans toucher au gameplay |
| `reports/patch-1078/logs/hud-template-comparison.csv` | Tableau avant/apres par univers | Rendre le controle PATCH 1078 explicite |

## Avant / apres

| Univers | Avant | Apres | Notes |
|---|---|---|---|
| Castle | 3 capsules | Bande large | Accent doré conserve, pas d'asset ajoute |
| Castle boss | 3 capsules | Bande large | `BOSS HP` conserve a droite |
| Sonic | Bande large | Bande large | Inchangé |
| OutRun | Bande large | Bande large | Inchangé |
| Paperboy | Bande large | Bande large | Inchangé |
| Autres univers | Bande large | Bande large | Inchangé |

## Non-regression

- gameplay : aucune mecanique, collision, niveau ou boss modifie.
- boss HUD : `BOSS HP` reste affiche dans le HUD.
- score : affichage existant preserve.
- mobile : captures 390x844 et 360x640 generees.
- frames gameplay non modifiees : oui.

## Risques

- Castle perd une partie de son identite capsule.
- La couleur Castle peut necessiter un ajustement fin apres QA mobile reelle.
- La bande large reste dense sur les petits mobiles, meme si elle donne plus d'espace texte que les capsules.
