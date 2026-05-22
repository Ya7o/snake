# 960 OutRun Mobile Layout Notes

Patch: `PATCH_960_OUTRUN_MOBILE_LAYOUT_PICKUP_READABILITY`

## Changements

- World Map : footer réduit à une caption bar compacte de 44 px, texte centré, 2 lignes maximum.
- OutRun gameplay : largeur de grille ajustée pour mieux laisser respirer le frame complet en portrait.
- Pickup : sprite toujours visible, alpha doux, halo et double contour animés au lieu d'un effet qui peut rendre l'icône illisible.

## Audit rapide

La logique pickup reste transversale pour les 8 univers : tous les pickups image/procéduraux gardent un halo lisible, sans disparition complète. Le layout OutRun reçoit un facteur spécifique car son frame plein écran est le cas visible où le décor large se faisait couper.

## Limites

- `CLAUDE.md` interdit de lancer un serveur local côté agent; les captures mobiles réelles restent donc à confirmer par l'utilisateur.
- Les viewports Android réels proches de 960 px n'ont pas été rejoués dans cette passe.

