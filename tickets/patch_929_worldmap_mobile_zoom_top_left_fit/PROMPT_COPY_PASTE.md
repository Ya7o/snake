Tu dois appliquer le patch suivant au projet Snake Drive V4.

# PATCH — WorldMap mobile : zoom ancré en haut à gauche

## Besoin
Sur mobile, la WorldMap laisse de grandes bandes noires. Il faut corriger ça en se rapprochant du rendu de la 2e capture :
- map plus grande ;
- ancrée en haut à gauche ;
- beaucoup moins de vide ;
- toujours propre et tapable.

## Objectif
Créer un mode de layout mobile WorldMap qui :
- ancre la map en haut à gauche ;
- augmente le scale utile ;
- réduit les bandes noires ;
- conserve le ratio ;
- garde les nodes interactifs ;
- laisse le footer / `SELECTIONNER UN NIVEAU` lisible sans sacrifier toute la hauteur.

## Fichiers à inspecter
- `src/scenes/WorldMapScene.ts`
- `src/worldmap/*`
- `src/ui/*`
- `src/config/*`

## À faire
1. Identifier la logique actuelle de centrage / zoom / scale.
2. Corriger le mode mobile pour ancrer la map en haut à gauche.
3. Réduire les marges verticales inutiles.
4. Calculer un scale mobile plus agressif.
5. Garder le footer séparé du container map.
6. Vérifier que les nodes restent tapables.

## Interdits
- Ne pas supprimer la WorldMap.
- Ne pas remplacer la map.
- Ne pas supprimer les 8 univers.
- Ne pas modifier le gameplay Snake.
- Ne pas ajouter de dépendance.
- Ne pas faire de HTML monofichier.

## Tests
```bash
npm run check
npm run build
npm run preview -- --host 0.0.0.0
```

Puis vérifier manuellement sur viewport mobile :
- 360x800
- 390x844
- 412x915

## Critères de succès
- plus de grandes bandes noires ;
- map plus grande ;
- ancrage haut-gauche ;
- rendu proche de la 2e capture ;
- footer lisible ;
- nodes sélectionnables.

## Rapport final obligatoire
Liste :
1. Fichiers modifiés.
2. Cause du bug.
3. Correctif de scale.
4. Correctif d’ancrage.
5. Tests.
6. Questions / blocages.
