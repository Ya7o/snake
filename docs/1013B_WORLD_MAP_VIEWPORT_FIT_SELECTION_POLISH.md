# PATCH 1013B — World Map Viewport Fit & Selection Polish

## Objectif

Corriger l'intégration viewport de la nouvelle minimap 16:9 en mobile portrait.

## Problème

Après PATCH 1013A, la map était correctement branchée sur `world_map_minimap_16_9.png` (1672×941) mais son positionnement initial (`INITIAL_ZOOM: 1`, ancrage top-left en portrait) donnait l'impression d'une carte trop petite avec un grand vide noir vertical.

## Changements

### `src/config/constants.ts`

| Clé | Avant | Après | Raison |
|---|---|---|---|
| `INITIAL_ZOOM` | `1` | `1.7` | Portrait zoomed-in dès l'entrée, pas de vide noir |
| `MAX_ZOOM` | `2.85` | `3.0` | Légèrement étendu pour cohérence |

`MIN_ZOOM` conservé à `1` : à ce niveau la map couvre exactement la hauteur utile sans bande noire.

### `src/scenes/WorldMapScene.ts`

**Positionnement initial portrait**

Suppression du bloc portrait spécial qui ancrait en top-left corner (`b.maxX, b.maxY`). Remplacement par `centerOnNode(MAP_NODES[0])` pour les deux orientations. La map démarre centrée sur le premier nœud (Castle) dans tous les cas.

**Champs tweens ajoutés**

```ts
private selectionPulseTween: Phaser.Tweens.Tween | null = null;
private panTween: Phaser.Tweens.Tween | null = null;
```

**Sélection runtime améliorée**

Halo glow semi-transparent (`fillStyle` + `fillCircle`) ajouté autour du nœud sélectionné, ring outer plus épais, ring accent plus lumineux. Pulse tween Phaser `alpha: 0.55→1.0, 680ms, Sine.easeInOut, repeat: -1` sur les nœuds débloqués.

**Pan animé vers le nœud sélectionné**

`panToNode(nodeId)` : tween 300ms `Quad.easeOut` vers la position clamped dans `panBounds()`. Déclenché par chaque `handleNodeTap`. Le drag annule le tween en cours et synchronise `containerX/containerY`.

**Cleanup shutdown**

`selectionPulseTween` et `panTween` stoppés dans `doShutdown()`.

## Comportement résultant

En portrait 390×844 (exemple) :
- `coverScale ≈ 0.85` (remplit hauteur à zoom=1)
- `INITIAL_ZOOM=1.7` → map affichée à `1421×800 * 1.7 = 2416×1360px` dans un viewport de `390×800px`
- Aucun vide noir vertical (map > viewport en hauteur)
- Castle visible et centré au démarrage
- Nœuds navigables via pan ; zoom-out à 1.0 pour vue complète hauteur

## Règles conservées

- Nouvel asset `world_map_minimap_16_9.png` conservé intact
- Aucun changement gameplay
- Aucun changement boss
- Aucun changement audio
- Aucun changement niveaux
- WorldMap seulement (`WorldMapScene.ts` + `constants.ts`)

## Critères d'acceptation

- [x] `npm run build` OK — 0 erreur TypeScript, 60 modules
- [x] Map plus grande en portrait — zoom initial 1.7
- [x] Vide noir fortement réduit — map > viewport en hauteur et largeur
- [x] Sélection visible — halo glow + pulse tween
- [x] Castle sélectionné visible — centré au démarrage
- [x] OutRun sélectionné visible — accessible après pan horizontal
- [x] Paperboy sélectionné visible — accessible après pan diagonal
- [x] Hitboxes alignées — hitbox = `NODE_R_HIT * 2` px écran, indépendant du zoom via `updateNodeScreenScale`
- [x] Pan/zoom fonctionnels — drag + pinch inchangés
- [x] Aucun nœud inaccessible — `MIN_ZOOM=1` + `panBounds` couvre toute la map

## Build

```
npm run build
✓ built in 11.69s — 0 erreur TypeScript
```
