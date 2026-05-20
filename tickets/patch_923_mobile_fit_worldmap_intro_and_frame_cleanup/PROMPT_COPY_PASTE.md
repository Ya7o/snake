Tu dois appliquer le patch suivant au projet Snake Drive V4.

# PATCH — Mobile fit, WorldMap, intro et cadres

## Problèmes observés sur Android
1. Le bouton de l’écran d’introduction déborde.
2. La WorldMap arrive trop zoomée ; il faut dézoomer pour qu’on voie le cadre comme sur la capture de référence.
3. Le bouton `START` sous la minimap doit être supprimé.
4. Certaines icônes boss affichent un bandeau rouge parasite.
5. Les étoiles et icônes de sélection de niveau sont incohérentes.
6. Le niveau / intro Sonic reste en anglais et n’explique pas bien la mécanique spéciale.
7. Certains cadres de gameplay ne fit pas l’écran (Sonic, Kombat) et les décors chevauchent le plateau.

## Objectif
Corriger ces régressions sans refonte globale.

## Fichiers à inspecter en priorité
- `src/scenes/WorldMapScene.ts`
- `src/scenes/LevelIntroScene.ts`
- `src/scenes/GameScene.ts`
- `src/data/levels.ts`
- `src/data/worldMap*.ts`
- `src/renderers/*`
- `src/ui/*`
- `src/config/*`

## À faire
- Corriger le layout mobile de l’intro pour que les boutons tiennent proprement.
- Traduire l’intro Sonic en français.
- Ajouter une consigne claire sur la mécanique Sonic : anneaux en chaîne, objectif, astuce courte.
- Appliquer le même principe FR aux intros qui restent bancales.
- Dézoomer légèrement la WorldMap au chargement pour montrer le cadre.
- Supprimer le bouton `START` sous la minimap.
- Nettoyer les badges / marqueurs boss : plus de bandeau rouge parasite.
- Clarifier la logique visuelle étoiles / sélection / boss / check.
- Corriger le fit des cadres de gameplay sur mobile portrait.
- Faire en sorte que le décor n’empiète pas sur le plateau Snake.

## Résultats attendus
- Intro propre, sans débordement.
- WorldMap plus respirable, cadre visible.
- Pas de `START` sous la minimap.
- Icônes boss propres.
- Sélection / progression lisibles.
- Sonic FR + mécanique compréhensible.
- Cadres Sonic et Kombat adaptés à l’écran.
- Plateau de jeu prioritaire.

## Fichiers interdits
- Ne supprime aucun univers, niveau ou boss.
- Ne modifie pas les règles Snake.
- Ne refais pas complètement la WorldMap.
- N’ajoute pas de dépendance.
- Ne fais pas de HTML monofichier.

## Tests à faire
```bash
npm run check
npm run build
npm run preview -- --host 0.0.0.0
```

Puis vérifier manuellement sur Android / viewport mobile :
- intro : pas de débordement ;
- Sonic : intro FR et consigne lisible ;
- WorldMap : cadre visible, zoom plus juste ;
- pas de bouton `START` sous la map ;
- pas de bandeaux rouges parasites ;
- étoiles / sélection / boss propres ;
- Sonic et Kombat : cadre fit, plateau lisible, décor non intrusif.

## Rapport final obligatoire
Liste :
1. Fichiers modifiés.
2. Causes des 5 problèmes principaux.
3. Choix retenus pour WorldMap / intro / cadres.
4. Textes FR corrigés.
5. Tests effectués.
6. Questions / blocages.
