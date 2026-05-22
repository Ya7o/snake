# Notes d'audit — Mobile UI / Level Intro / Sonic / Shinobi

## Diagnostic

Les captures confirment deux familles de problèmes :

1. **Système d'intro niveau non contraint par une zone boutons fixe.**
   Le panneau mission peut descendre sur les boutons. C'est fragile : dès qu'un univers a un décor haut, un titre long ou une description sur deux lignes, l'interface se chevauche.

2. **HUD gameplay encore trop décoratif.**
   Sonic affiche plusieurs couches : bandeau objectif, score/tokens/level, barre vies/énergie. Cette structure coûte trop cher en hauteur sur mobile portrait.

3. **Pickups à contraste insuffisant.**
   Les anneaux très sombres ou semi-transparents deviennent difficiles à lire dans la grille. Un collectable doit rester évident même lorsqu'il pulse ou clignote.

## Correction recommandée

### Intro niveau

Traiter l'écran comme une colonne avec zones réservées :

- header fixe ou semi-fixe ;
- artwork compressible ;
- mission card à hauteur max ;
- action bar fixe en bas ;
- gap minimal obligatoire entre mission card et action bar.

Si la place manque, compresser artwork et paddings avant de toucher aux boutons.

### HUD gameplay

Créer une limite de hauteur HUD portrait. Le HUD doit devenir informatif, pas décoratif :

- ligne 1 : monde + objectif + progression ;
- ligne 2 optionnelle : jauge mécanique vraiment active ;
- score/best/tokens/level secondaires si pas nécessaires à la décision immédiate.

### Pickups

Ne jamais faire disparaître totalement un pickup pendant une animation. Préférer :

- alpha min élevée ;
- halo stable ;
- contour visible ;
- pulse doux ;
- taille minimale par cellule.

## Point de vigilance

Un correctif purement esthétique sur Shinobi ou Sonic serait insuffisant. Le défaut vient probablement d'un calcul de layout partagé. Il faut auditer tous les univers après correction.
