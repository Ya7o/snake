# Mobile-first UX Audit

## Resume executif

Snake Drive V4 est jouable et l'architecture scene/renderers est saine pour une premiere build. Les principaux ecarts produit sont maintenant concentres sur la lisibilite mobile, la clarte des actions primaires, la finition modern-retro des overlays et la coherence des controles tactiles.

Le style 16-bit doit rester une inspiration visuelle, pas une excuse pour des textes fonctionnels minuscules ou des marqueurs trop pixellises. Les patches 910 a 912 commencent deja a corriger trois points P0/P1 : cadres de gameplay par univers, nodes WorldMap plus propres avec double tap, et vrais noms d'univers sur l'ecran titre.

## Problemes par scene

### TitleScene
- Action principale : entrer dans la WorldMap.
- Visibilite : correcte, mais le titre prend beaucoup de place.
- Probleme corrige par 912 : les anciennes briques tronquees donnaient une impression prototype.
- Risque restant : `TAP TO START` est textuel et bas dans l'ecran ; il merite un vrai bouton tactile commun.

### WorldMapScene
- Action principale : choisir et lancer un niveau.
- Probleme P0 initial : selection + START etait plus lent qu'un parcours mobile moderne.
- Correction 911 : double tap meme node pour lancer, simple tap pour selectionner.
- Risques restants : conflit potentiel entre drag et tap a tester sur Android reel ; les marqueurs restent des Graphics Phaser, mais leur taille ecran est maintenant stabilisee pendant le zoom.

### GameScene
- Action principale : jouer immediatement.
- Probleme P0 : le bouton retour map en bas est petit et proche de la zone systeme Android.
- Probleme P1 : les feedbacks gameplay sont encore tres fonctionnels ; pickups/obstacles/snake doivent gagner en clarte modern-retro.
- Correction 910 : cadre de grille thematique par univers sans reduire la grille.

### ClearScene
- Action principale : continuer au niveau suivant.
- Probleme P0/P1 : `NEXT LEVEL` est encore un texte interactif, pas un bouton tactile de 44 px.
- Le parcours est bon en intention, mais le bouton doit etre plus evident et plus confortable.

### GameOverScene
- Action principale : retry.
- Probleme P0/P1 : `RETRY` est visible, mais le hit target est celui du texte.
- Recommandation : bouton primaire large, feedback pressed, action au centre de la zone de confort.

### LevelIntroScene
- Action principale : lancer le niveau.
- Risque : scene intermediaire utile pour expliquer la mecanique, mais elle ajoute un tap au parcours.
- Recommandation : auto-start optionnel court ou gros bouton primaire clair.

## Problemes transverses

- Typographie fonctionnelle trop petite dans plusieurs textes secondaires.
- Les boutons sont souvent des `Text` interactifs sans surface tactile visible.
- Les textes pixel-art fonctionnels peuvent devenir baveux selon scale/canvas.
- Les labels d'univers etaient dupliques ; 912 centralise les noms.
- Les renderers sont globalement frugaux, mais les interactions tactiles doivent etre validees sur Chrome Android.
- Les assets design boards sont presents, mais l'integration doit rester progressive pour ne pas noyer la grille.

## Modern Retro Visual Polish

Garder :
- palettes par univers ;
- scanlines legeres ;
- cadres console ;
- sprites issus des boards quand ils restent lisibles.

A moderniser :
- boutons primaires et secondaires ;
- nodes WorldMap ;
- snake head/body pour mieux distinguer direction et collision ;
- pickups et obstacles trop proches de placeholders ;
- feedback de clear/game over/retry ;
- textes fonctionnels, qui doivent etre nets et assez grands.

## Performance mobile

Points positifs :
- grille statique dessinee avec dirty flag ;
- pas de grosse recreation de map dans `update()`;
- renderers separes.

Risques :
- trop de petites animations/timers non centralisees a terme ;
- listeners tactiles natifs de WorldMap a surveiller sur shutdown ;
- assets PNG multiples a tester en preview mobile ;
- `pixelArt`, `roundPixels` et antialias false peuvent accentuer le rendu brut de textes et overlays.

## Questions / blocages

- Les captures Android finales apres 910-912 restent a produire.
- Il faut decider si les textes fonctionnels doivent quitter `Press Start 2P` pour une police UI plus nette.
- Il faut valider sur un vrai Android si double tap WorldMap et drag ne se concurrencent pas.
