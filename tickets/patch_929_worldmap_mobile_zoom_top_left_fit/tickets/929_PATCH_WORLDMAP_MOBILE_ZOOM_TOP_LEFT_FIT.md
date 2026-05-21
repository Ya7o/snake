# PATCH — WorldMap mobile : zoom ancré en haut à gauche

## Contexte
Sur téléphone Android, la WorldMap affiche de grandes bandes noires quand la map est affichée dans un mode dézoomé / mal ajusté. Le rendu actuel centre trop la map dans une zone utile trop petite. Le résultat est mauvais : perte d’espace, lisibilité réduite, impression de maquette non finalisée.

La cible visuelle est celle de la 2e capture : la map doit être agrandie, ancrée en haut à gauche, occuper bien mieux l’espace utile, et réduire fortement les bandes noires.

## Objectif
Corriger le layout mobile de la WorldMap pour que :
- la map soit ancrée en haut à gauche en mode zoom / fit mobile ;
- la zone utile soit priorisée ;
- les bandes noires soient supprimées ou fortement réduites ;
- la frame WorldMap reste visible de manière cohérente ;
- le comportement soit stable sur Android portrait.

## Fichiers à inspecter / modifier
- `src/scenes/WorldMapScene.ts`
- `src/worldmap/*`
- `src/ui/*`
- `src/config/*`
- tout helper responsable de :
  - calcul du scale ;
  - calcul du zoom ;
  - positionnement du container map ;
  - camera / scroll / viewport ;
  - zone HUD / footer `SELECTIONNER UN NIVEAU`.

## Fichiers interdits
- Ne pas supprimer la WorldMap.
- Ne pas supprimer les 8 univers.
- Ne pas supprimer les nodes / étoiles / badges boss.
- Ne pas remplacer l’asset principal de map.
- Ne pas revenir à une version desktop centrée.
- Ne pas ajouter de dépendance.
- Ne pas modifier le gameplay Snake.
- Ne pas revenir à un HTML monofichier.

## Problème constaté
- La map est trop petite.
- Elle est trop centrée.
- De grandes bandes noires apparaissent en haut et en bas.
- Le viewport mobile n’est pas utilisé intelligemment.
- Le mode zoom actuel ne respecte pas la composition attendue sur mobile.

## Comportement attendu
- [ ] La WorldMap mobile s’aligne sur le coin haut-gauche de la zone de contenu utile.
- [ ] Le scale de la map augmente pour mieux remplir l’écran.
- [ ] Les bandes noires haut/bas sont supprimées ou fortement réduites.
- [ ] Le cadrage priorise la map, pas le vide.
- [ ] Le coin haut-gauche de la frame WorldMap reste visible.
- [ ] Le footer / aide en bas peut rester visible, mais ne doit plus forcer un énorme vide au-dessus.
- [ ] Le ratio de la map est conservé.
- [ ] Aucune déformation.
- [ ] Les nodes restent tapables.
- [ ] Le bouton / texte `SELECTIONNER UN NIVEAU` reste lisible.
- [ ] Le comportement reste propre sur 360–430 px de large.

## Règle d’implémentation
Ne pas simplement “agrandir un peu”. Il faut corriger la logique de layout :
1. calculer la hauteur réellement disponible ;
2. calculer un scale mobile plus agressif ;
3. ancrer le container / camera en haut à gauche ;
4. limiter les marges automatiques centrées ;
5. réserver la place minimale utile au footer seulement.

## Hypothèse technique à vérifier
Le bug vient probablement d’un ou plusieurs de ces problèmes :
- fit mode basé sur centrage global ;
- `setOrigin(0.5, 0.5)` au lieu d’un ancrage haut-gauche ;
- container ou camera centrée par défaut ;
- scale calculé sur largeur ET hauteur avec la plus restrictive, ce qui crée trop de vide ;
- réservation excessive d’espace vertical pour footer / safe areas ;
- absence de mode distinct “mobile zoom fit”.

## Solution attendue
Mettre en place un mode de layout explicite WorldMap mobile :
- `mobileFitMode: "top-left-zoom"` ou équivalent ;
- ancrage `x = 0`, `y = topInset / margin`;
- scale calculé pour maximiser la map dans la zone utile ;
- clamp du viewport pour éviter les débordements ;
- footer indépendant du container map ;
- si nécessaire, accepter qu’une partie droite ou basse soit moins visible au premier cadrage, tant que le rendu général est bien meilleur.

## Contraintes UX
- Mobile Android prioritaire.
- La map doit sembler “présente” immédiatement.
- Le joueur doit voir la carte, pas du vide.
- Le premier écran doit être lisible sans pinch zoom.
- Le comportement en zoom ne doit pas casser la sélection de niveau.

## Hors scope
- Refaire toute la WorldMap.
- Refaire les nodes.
- Refaire les design boards.
- Corriger les autres écrans.
- Modifier les mécaniques gameplay.
- Changer les noms ou traductions.

## Tests à faire
```bash
npm run check
npm run build
npm run preview -- --host 0.0.0.0
```

Puis test manuel sur viewport mobile :
- 360x800
- 390x844
- 412x915

Vérifier :
- plus de grosses bandes noires ;
- map calée en haut à gauche ;
- scale plus grand ;
- footer toujours OK ;
- nodes tapables ;
- sélection niveau OK.

## Rapport final obligatoire
À la fin, lister clairement :
1. Fichiers modifiés.
2. Cause du mauvais centrage.
3. Nouvelle logique de scale.
4. Nouvelle logique d’ancrage.
5. Viewports testés.
6. Résultats.
7. Questions ou points bloquants.
