# Notes d’implémentation — Patch 922

## Direction produit
Le jeu doit être français d’abord. L’anglais donne une impression de prototype et rend la compréhension plus difficile.

## Problème de fond
Chaque univers a une mécanique spécifique, mais le joueur ne peut pas toujours la deviner :
- murs qui clignotent ;
- anneaux en chaîne ;
- foule qui bloque ;
- charge ;
- voies / checkpoints ;
- leurres ;
- zones fatales ;
- livraisons.

Sans écran d’introduction, le joueur subit la mécanique au lieu de la comprendre.

## Format conseillé pour l’intro
Titre :
`CASTLE OF ILLUSION`

Badge :
`NIVEAU 1` ou `BOSS`

Bloc court :
`Objectif : Mange les orbes.`
`Mécanique : Certains murs clignotent.`
`Astuce : Observe le rythme.`

Actions :
- bouton principal : `JOUER`
- bouton secondaire : `CARTE`

## Règle de concision
Pas de paragraphe long. Le joueur doit comprendre en moins de 3 secondes.
