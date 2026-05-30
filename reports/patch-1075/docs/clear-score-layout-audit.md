# Clear/Boss Clear Score Layout Audit

## Objectif

Auditer le layout des ecrans Clear/Boss Clear apres ajout du score.

## Contexte QA mobile

Deux problemes QA mobile etaient a verifier apres PATCH 1073 :

- le bloc score/best score peut pousser le texte hors cadre ou creer une pression verticale sur mobile portrait ;
- l'annonce du niveau suivant apparait au milieu de l'ecran et son emplacement doit etre reconsidere.

PATCH 1062 avait deja corrige le titre `NIVEAU REUSSI`, mais PATCH 1073 ajoute `SCORE`, `BEST` et parfois `NOUVEAU RECORD`.

## Captures

- `reports/patch-1075/screenshots/clear_normal_mobile_score.png` : Clear normal Castle, mobile 390x844, nouveau record.
- `reports/patch-1075/screenshots/clear_normal_mobile_score_fullscreen.png` : meme etat, capture pleine page.
- `reports/patch-1075/screenshots/boss_clear_mobile_score.png` : Boss Clear Sonic, mobile 390x844, `?unlockAll=1`, nouveau record.
- `reports/patch-1075/screenshots/boss_clear_mobile_score_fullscreen.png` : meme etat, capture pleine page.
- `reports/patch-1075/screenshots/gameover_mobile_score.png` : GameOver Sonic, mobile 390x844, score affiche.
- `reports/patch-1075/screenshots/clear_desktop_score.png` : Clear normal Castle, desktop 1280x720.
- `reports/patch-1075/screenshots/boss_clear_desktop_score.png` : Boss Clear Sonic, desktop 1280x720.

## Resultats

| Ecran | Viewport | Titre OK | Score OK | Best OK | Next level OK | Boutons OK | Probleme |
|---|---|---:|---:|---:|---:|---:|---|
| Clear normal Castle | 390x844 | oui | reserve | reserve | non | oui | Pas de sortie de viewport, mais bloc score tres serre et annonce next level colle sous `NOUVEAU RECORD`. |
| Boss Clear Sonic | 390x844 | oui | reserve | reserve | non | oui | Meme pression verticale ; annonce `BAGARRE EN RUELLE` placee au centre juste sous le bloc score. |
| GameOver Sonic | 390x844 | oui | oui | oui | n/a | oui | Score lisible, pas de debordement observe ; nom du niveau reste central mais moins surcharge. |
| Clear normal Castle | 1280x720 | oui | reserve | reserve | non | oui | Probleme aussi visible en desktop bas : `NOUVEAU RECORD` touche presque l'annonce next level. |
| Boss Clear Sonic | 1280x720 | oui | reserve | reserve | non | oui | Meme empilement compact que mobile. |

## Analyse layout

Elements affiches sur Clear normal Castle :

- titre shadow + titre `NIVEAU REUSSI` a `RESULT_SCREEN_LAYOUT.titleY = 0.24` ;
- sous-titre `BOSS DU CHATEAU DEBLOQUE` a `subtitleY = 0.36` ;
- panneau score a `scoreY = H * 0.405` ;
- `SCORE`, `BEST`, et `NOUVEAU RECORD` si nouveau record ;
- annonce du prochain niveau a `contextY = 0.47` ;
- bouton principal a `primaryButtonY = 0.63` ;
- separateur a `separatorY = 0.72` ;
- bouton secondaire a `secondaryButtonY = 0.81`.

Elements affiches sur Boss Clear Sonic :

- titre shadow + titre `BOSS VAINCU` ;
- badge `BOSS VAINCU !` a `subtitleY = 0.36` ;
- panneau score identique ;
- annonce du prochain niveau a `contextY = 0.47` ;
- boutons `SUIVANT` et `CARTE`.

Positions observees en 390x844 :

- Clear normal : `NOUVEAU RECORD` bbox bottom=380, next level `LA SORCIERE AU MIROIR` bbox y=385. Il reste environ 5 px entre les deux textes.
- Boss Clear : `NOUVEAU RECORD` bbox bottom=380, next level `BAGARRE EN RUELLE` bbox y=385. Meme respiration d'environ 5 px.
- Le panneau score fait 60 px en mode nouveau record, de y=315 environ a y=375 environ.
- L'annonce du niveau suivant est centree vers y=397, donc visuellement dans la zone centrale de l'ecran, pas rattachee au bouton `CONTINUER`/`SUIVANT`.
- Les boutons sont lisibles et ne sortent pas de l'ecran dans les captures.

Zones de collision visuelle :

- sous-titre/badge vers y=304 et score vers y=321 : l'espace est court mais encore lisible ;
- `SCORE`/`BEST` ont des bounding boxes qui se chevauchent legerement a cause de la hauteur de police et des strokes, mais la lecture visuelle reste acceptable ;
- `NOUVEAU RECORD` et l'annonce next level sont trop proches, surtout parce que l'annonce ressemble a une information principale placee au milieu de l'ecran.

Hypothese cause :

- `RESULT_SCREEN_LAYOUT.contextY = 0.47` existait avant le bloc score.
- PATCH 1073 a ajoute le score a `H * 0.405` avec une hauteur de 44 ou 60 px.
- En cas de nouveau record, le bloc score descend jusqu'a environ `H * 0.405 + 33`, tandis que l'annonce next level commence autour de `H * 0.47 - 12`.
- Sur 390x844, cela donne seulement quelques pixels d'ecart.
- Le layout utilise des ratios globaux identiques mobile/desktop, sans pile verticale responsive pour absorber l'ajout du score.

Difference normal clear vs boss clear :

- Clear normal Castle ajoute un sous-titre long `BOSS DU CHATEAU DEBLOQUE`.
- Boss Clear non-Castle ajoute un badge rouge `BOSS VAINCU !`.
- Le probleme principal reste commun : score nouveau record + next level partagent la meme zone verticale.

## Recommandations de correction

### Option A - Compact score block

Regrouper `SCORE`, `BEST`, `NOUVEAU RECORD` dans un bloc compact sous le titre, avec line-height/gaps controles. Garder une hauteur connue pour que le reste du layout puisse s'ancrer dessous.

### Option B - Deplacer annonce niveau suivant

Mettre l'annonce du niveau suivant pres du bouton `SUIVANT`/`CONTINUER`, par exemple comme label secondaire juste au-dessus du bouton, afin qu'elle soit comprise comme destination de l'action et non comme contenu central concurrent du score.

### Option C - Responsive vertical stack

Ajouter une variante mobile portrait : reduire legerement les gaps titre/sous-titre/score, fixer une marge minimale entre score et next level, et ajuster `contextY`/`primaryButtonY` selon la hauteur disponible.

### Option D - Masquer annonce niveau suivant sur mobile si trop charge

Option de dernier recours seulement : masquer l'annonce si `NOUVEAU RECORD` est present et que la hauteur utile est insuffisante. A eviter si Option B suffit.

## Recommandation finale

Prevoir le patch suivant :

`PATCH 1076 - Clear/Boss Clear Score Layout Fix`

Correction recommandee : Option B + Option C. L'annonce du niveau suivant devrait etre rattachee au bouton principal, avec une pile responsive qui garantit une marge minimale entre le bloc score et tout texte suivant.

## Ne pas faire

- reduire tout le texte au point de le rendre illisible ;
- supprimer le score ;
- supprimer best score ;
- reintroduire accents dans les titres pixel-font fragiles ;
- modifier gameplay.

## Verdict

PASS avec reserve.

Le debordement hors viewport n'a pas ete reproduit dans les captures Playwright 390x844, mais le probleme de layout est confirme : le bloc score nouveau record et l'annonce du niveau suivant sont trop proches, et l'annonce reste placee trop au centre de l'ecran.
