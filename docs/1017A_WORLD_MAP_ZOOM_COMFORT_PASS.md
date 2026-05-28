# 1017A — World Map Zoom Comfort Pass

## Objectif

Réduire légèrement le zoom initial de la WorldMap après retour joueur (PATCH 1013B).
La map était trop zoomée, gênant la lisibilité globale au démarrage.

## Valeur de zoom avant / après

| Paramètre      | Avant (1013B) | Après (1017A) | Delta   |
|---------------|--------------|--------------|---------|
| `INITIAL_ZOOM` | 1.7          | 1.5          | −11.8 % |
| `MIN_ZOOM`     | 1            | 1            | —       |
| `MAX_ZOOM`     | 3.0          | 3.0          | —       |

## Fichiers modifiés

| Fichier                        | Modification                                              |
|-------------------------------|----------------------------------------------------------|
| `src/config/constants.ts`     | `WORLD_MAP_VIEW.INITIAL_ZOOM : 1.7 → 1.5`               |

`src/scenes/WorldMapScene.ts` : aucune modification dans ce patch (consomme `INITIAL_ZOOM` via constante).

## Captures générées

| Fichier                               | Contenu                                             |
|--------------------------------------|-----------------------------------------------------|
| `worldmap_default.png`               | Vue initiale au démarrage — Castle + Shinobi visibles |
| `worldmap_castle_selected.png`       | Node Castle sélectionné (highlight doré)            |
| `worldmap_outrun_selected.png`       | Après pan vers OutRun                               |
| `worldmap_paperboy_selected.png`     | Après pan vers Paperboy                             |
| `worldmap_all_points_check.png`      | Vue avec debug overlay (`initialZoom: 1.5`)         |

Toutes les captures se trouvent dans `snake/tmp/patch1017A/captures/`.

## Validation des hitboxes

- `updateNodeScreenScale()` applique `scale = 1 / currentZoom` à chaque container de node.
- Les hitboxes restent à taille constante en pixels écran quelle que soit la valeur de zoom.
- Ce patch ne modifie que `INITIAL_ZOOM` : aucun risque de désalignement hitbox.

## Validation fonctionnelle

- ✅ Build propre : 0 erreur TypeScript, 60 modules
- ✅ Castle visible au démarrage (center-on-node conservé)
- ✅ Debug overlay confirme `initialZoom: 1.5 range: 1..3`
- ✅ Shinobi visible dans la moitié basse au démarrage (plus de surface qu'à 1.7)
- ✅ Pan vers OutRun et Paperboy fonctionnel
- ✅ Pan bounds inchangés — pas de bord noir visible
- ✅ Footer auto-sélection Castle au démarrage opérationnelle

## Risques restants

- Le zoom 1.5 est plus généreux : l'image source (1672×941) peut apparaître légèrement
  moins nette sur très grands écrans tablette, car le facteur de couverture est plus faible.
  Sur mobile portrait 390×844 (cible principale), aucun problème observé.
- Les utilisateurs qui préféraient le zoom serré peuvent pincher-to-zoom jusqu'à 3.0.
- Retour au zoom 1.7 possible en modifiant `WORLD_MAP_VIEW.INITIAL_ZOOM` dans `constants.ts`.
