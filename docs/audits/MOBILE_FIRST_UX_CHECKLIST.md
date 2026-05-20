# Mobile-first UX Checklist

## Typographie

- [ ] Texte fonctionnel minimum 10-12 px sur mobile.
- [ ] Boutons d'action lisibles sans zoom navigateur.
- [ ] Pas de label coupe ou tronque brutalement.
- [ ] Contraste suffisant sur fonds themes.
- [ ] Titres retro acceptes, textes critiques privilegient la lisibilite.

## Zones tactiles

- [ ] Action primaire avec zone tappable proche de 44 px.
- [ ] Actions secondaires espacees des actions primaires.
- [ ] Retour map eloigne de la zone navigation Android.
- [ ] Feedback visuel immediat au tap.
- [ ] Fonctionne au pouce sur largeur 360-430 px.

## Economie d'interaction

- [ ] Title -> WorldMap en 1 tap.
- [ ] WorldMap -> niveau en double tap direct.
- [ ] Node selectionne -> START reste disponible.
- [ ] Clear -> next level direct et evident.
- [ ] GameOver -> retry direct et evident.
- [ ] Retour map toujours disponible mais secondaire.

## WorldMap

- [ ] Image cadrage utile, pas de grandes bandes vides.
- [ ] Nodes taille ecran stable pendant zoom.
- [ ] Simple tap selectionne seulement.
- [ ] Double tap meme node lance si accessible.
- [ ] Node locked ne lance jamais.
- [ ] Drag ne declenche pas de tap accidentel.
- [ ] Pinch conserve des limites propres.

## Gameplay

- [ ] Grille prioritaire et non couverte par le decor.
- [ ] Cadre univers visible mais hors cellules.
- [ ] Snake direction claire.
- [ ] Pickups plus visibles que obstacles.
- [ ] Dangers telegraphies.
- [ ] HUD lisible pendant l'action.

## Performance

- [ ] Pas de creation de textures dans `update()`.
- [ ] Pas de listeners accumules apres retry/retour map.
- [ ] Renderers detruits au shutdown.
- [ ] Build preview testee sur Android Chrome.
- [ ] FPS ressenti stable sur niveau rapide.
