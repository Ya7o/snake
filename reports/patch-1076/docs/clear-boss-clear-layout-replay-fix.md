# Clear/Boss Clear Layout + Replay Button Fix

## Probleme

Apres l'ajout du score sur Clear/Boss Clear, le layout etait trop serre en mobile portrait :

- le bloc `SCORE` / `BEST` / `NOUVEAU RECORD` laissait peu d'espace utile ;
- l'annonce du niveau suivant restait au centre de l'ecran et pouvait concurrencer le score ;
- le score rendait le replay plus important, mais Clear/Boss Clear ne proposait pas `REJOUER`.

## Changement

| Fichier | Changement | Raison |
|---|---|---|
| `src/scenes/ClearScene.ts` | Ajout d'un helper local de texte ajuste a une largeur max | Eviter les debordements texte sur mobile |
| `src/scenes/ClearScene.ts` | Panneau score plus large, hauteur stable, typo ajustee | Garder `SCORE`, `BEST` et `NOUVEAU RECORD` lisibles |
| `src/scenes/ClearScene.ts` | Annonce du prochain niveau deplacee au-dessus des actions | Rattacher l'annonce a `CONTINUER` plutot qu'au centre de l'ecran |
| `src/scenes/ClearScene.ts` | Ajout du bouton `REJOUER` | Relancer immediatement le meme niveau |

## Layout final

Le centre de l'ecran reste reserve au resultat principal et au bloc score.

Le bloc score regroupe :

- `SCORE`;
- `BEST`;
- `NOUVEAU RECORD` si applicable.

L'annonce du niveau suivant est affichee sous forme `PROCHAIN : ...`, juste au-dessus du bouton `CONTINUER`.

Les actions sont empilees en mobile portrait :

- `CONTINUER`;
- `REJOUER`;
- `CARTE`.

Quand aucun prochain niveau n'existe, `CONTINUER` reste masque comme dans la logique precedente sans destination valide, et l'ecran affiche la fin des mondes.

## Boutons

| Bouton | Action |
|---|---|
| `CONTINUER` | Lance l'intro du prochain node si un prochain niveau existe |
| `REJOUER` | Relance `SCENES.GAME` avec le meme `levelId` |
| `CARTE` | Retourne a `SCENES.WORLD_MAP` |

## Verifications

- Clear normal : `CONTINUER`, `REJOUER`, `CARTE` visibles.
- Boss Clear : `REJOUER` visible, `CONTINUER` garde la destination suivante.
- Nouveau record : `NOUVEAU RECORD` reste dans le bloc score.
- Replay meme niveau : verifie sur `sonic_boss`, relance `GameScene` avec `levelId = sonic_boss`.
- Mobile portrait : captures 390x844 et 360x640 sans overflow detecte.
- Desktop : capture 1280x720 sans overflow detecte.

## Risques

- Destination `CONTINUER` : depend toujours de l'ordre `MAP_NODES`.
- Score runtime au replay : remis a zero par la nouvelle instance de `GameScene`.
- Layout mobile tres petit : couvert en 360x640, mais les ecrans plus bas peuvent rester a surveiller.
