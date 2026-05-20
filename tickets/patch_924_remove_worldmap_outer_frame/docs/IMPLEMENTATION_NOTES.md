# Notes d’implémentation — Patch 924

## Intention
Ce patch est volontairement minimal et ciblé. Le besoin n’est pas de redessiner la WorldMap, mais d’enlever un élément décoratif devenu inutile.

## Principe
La map doit rester la star. Si le cadre n’apporte ni structure ni ergonomie, il faut le retirer.

## Point de vigilance
Le cadre peut être :
- un sprite overlay ;
- un graphics Phaser ;
- un container UI ;
- une frame partagée avec d’autres écrans.

Il faut donc le supprimer proprement sans casser le reste du layout.
