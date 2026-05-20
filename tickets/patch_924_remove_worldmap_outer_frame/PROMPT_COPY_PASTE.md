Tu dois appliquer le patch suivant au projet Snake Drive V4.

# PATCH — Supprimer le cadre autour de la minimap WorldMap

## Demande
Supprimer le cadre décoratif autour de l’image de la minimap sur la WorldMap. Il est inutile et alourdit l’écran.

## Objectif
- garder l’image de minimap ;
- supprimer le cadre autour ;
- conserver le cadrage utile ;
- conserver les interactions et les nodes ;
- garder une présentation propre sur mobile Android.

## Fichiers à inspecter en priorité
- `src/scenes/WorldMapScene.ts`
- `src/worldmap/*`
- `src/ui/*`
- `src/config/*`

## À faire
- identifier où le cadre de la minimap est généré ;
- supprimer ce cadre proprement ;
- ajuster les marges / padding si nécessaire ;
- vérifier que la map reste lisible et interactive.

## Fichiers interdits
- Ne supprime pas la WorldMap.
- Ne remplace pas `world_map.png`.
- Ne modifie pas le gameplay Snake.
- Ne supprime aucun univers, niveau ou boss.
- N’ajoute pas de dépendance.
- Ne fais pas de HTML monofichier.

## Tests à faire
```bash
npm run check
npm run build
npm run preview -- --host 0.0.0.0
```

Puis vérifier manuellement sur Android / viewport mobile :
- plus de cadre autour de la minimap ;
- map lisible ;
- nodes toujours visibles ;
- interactions OK ;
- layout propre.

## Rapport final obligatoire
Liste :
1. Fichiers modifiés.
2. Source du cadre.
3. Suppression effectuée.
4. Ajustements layout.
5. Tests.
6. Questions / blocages.
