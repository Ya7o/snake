# PATCH — Supprimer le cadre autour de la minimap WorldMap

## Contexte
La WorldMap mobile affiche actuellement un cadre décoratif autour de l’image de minimap. Après les derniers ajustements, ce cadre n’apporte plus de valeur : il prend de la place, alourdit l’écran, et n’aide ni la lisibilité ni l’ergonomie. Le besoin est maintenant de simplifier la présentation en supprimant ce cadre autour de l’image.

## Objectif
Supprimer le cadre décoratif autour de l’image de la minimap WorldMap, tout en conservant l’image de carte, son cadrage utile, ses interactions, et la lisibilité des nodes.

## Fichiers à modifier
- `src/scenes/WorldMapScene.ts` — retirer l’affichage du cadre / border / overlay autour de la minimap, et ajuster le layout si nécessaire.
- `src/worldmap/*` ou `src/ui/*` — si le cadre est rendu via un composant ou renderer dédié, corriger ici plutôt que dans la scène.
- `src/config/*` — uniquement si des constantes de marge / padding / frame sont centralisées.

## Fichiers interdits
- Ne pas supprimer la WorldMap.
- Ne pas remplacer `public/assets/map/world_map.png`.
- Ne pas supprimer les 8 univers.
- Ne pas supprimer les 16 niveaux.
- Ne pas supprimer les 8 boss.
- Ne pas modifier les règles de gameplay Snake.
- Ne pas ajouter de dépendance.
- Ne pas revenir à un HTML monofichier.

## Comportement attendu
- [ ] Le cadre décoratif autour de l’image de minimap est supprimé.
- [ ] L’image de minimap reste visible et correctement cadrée.
- [ ] Les nodes, étoiles, badges boss et éléments de sélection restent visibles.
- [ ] Le retrait du cadre ne casse pas les interactions tap / drag / double tap.
- [ ] Le layout reste propre sur Android portrait.
- [ ] L’écran gagne en lisibilité et en espace utile.

## Contraintes
- Mobile Android prioritaire.
- Viewport cible : 360–430 px de large.
- Si le retrait du cadre laisse des marges inutiles, les réduire proprement.
- Ne pas introduire une nouvelle couche décorative de remplacement.
- Préférer une suppression nette plutôt qu’un simple masquage fragile.

## Hors scope
- Refaire complètement la WorldMap.
- Refaire les nodes.
- Refaire les noms d’univers.
- Refaire les intros de niveaux.
- Corriger le gameplay ingame.
- Refaire tous les cadres des autres scènes.

## Rapport final obligatoire
À la fin, liste clairement :

1. Fichiers modifiés.
2. Où le cadre était généré.
3. Comment il a été supprimé.
4. Ajustements de layout éventuels.
5. Tests effectués et résultats.
6. Questions ou points bloquants.
