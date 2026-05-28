# PATCH 1013A — World Map Minimap Refresh

## Objectif
Intégrer une nouvelle minimap 16:9 pour la world map et réaligner les points de progression / boss.

## Asset source
- `/home/kali/snake/design_boards/minimap/ChatGPT Image 27 mai 2026, 14_54_43.png`
- Dimensions : 1672×941 px (ratio 16:9)
- Contenu : console Mega Drive 2 encadrée, 8 îles univers, labels numérotés, cercles jaunes niveau + couronne boss

## Asset cible
- `public/assets/ui/worldmap/world_map_minimap_16_9.png`

## Changements

### Asset copié
- `public/assets/ui/worldmap/world_map_minimap_16_9.png` (2.8 MB)

### Fichiers code modifiés

**`src/config/constants.ts`**
- Ajout `ASSET_KEYS.WORLD_MAP_MINIMAP = 'world_map_minimap_16_9'`
- Ajout `ASSET_PATHS.WORLD_MAP_MINIMAP = 'assets/ui/worldmap/world_map_minimap_16_9.png'`

**`src/config/mapNodes.ts`**
- Recalibration complète des 16 coordonnées normalisées (x, y) sur la nouvelle image 1672×941
- Suppression de `drawCircle: true` sur paperboy_normal (cercle déjà présent dans l'image)
- Coordonnées détectées par analyse pixel (clusters jaunes) puis confirmées visuellement

**`src/scenes/WorldMapScene.ts`**
- `MAP_IMG_W` : 1448 → 1672
- `MAP_IMG_H` : 1086 → 941
- Constantes locales `WM_KEY` / `WM_PATH` pointant sur `ASSET_KEYS.WORLD_MAP_MINIMAP` / `ASSET_PATHS.WORLD_MAP_MINIMAP`
- Toutes les références `ASSET_KEYS.WORLD_MAP` remplacées par `WM_KEY` dans preload / create / debug overlay

### Système de coordonnées
Positions normalisées 0..1 relatives à l'image complète (1672×941).  
Pas de crop appliqué — le cadre console est conservé comme décor visuel.

### Coordonnées recalibrées

| Node | Univers        | Type   | x      | y      |
|------|----------------|--------|--------|--------|
| 1    | castle         | normal | 0.1888 | 0.3743 |
| 2    | castle         | boss   | 0.2166 | 0.3746 |
| 3    | sonic          | normal | 0.4741 | 0.3637 |
| 4    | sonic          | boss   | 0.5014 | 0.3635 |
| 5    | streets        | normal | 0.6701 | 0.3764 |
| 6    | streets        | boss   | 0.6980 | 0.3762 |
| 7    | fighter        | normal | 0.8522 | 0.4313 |
| 8    | fighter        | boss   | 0.8805 | 0.4322 |
| 9    | outrun         | normal | 0.4892 | 0.6016 |
| 10   | outrun         | boss   | 0.5165 | 0.6018 |
| 11   | shinobi        | normal | 0.2035 | 0.5802 |
| 12   | shinobi        | boss   | 0.2256 | 0.5834 |
| 13   | kombat         | normal | 0.2308 | 0.8426 |
| 14   | kombat         | boss   | 0.2591 | 0.8430 |
| 15   | paperboy       | normal | 0.7120 | 0.8422 |
| 16   | paperboy       | boss   | 0.7401 | 0.8424 |

## Règles conservées
- Aucun changement gameplay
- Aucun changement boss
- Aucun changement audio
- Aucun refactor global
- World map uniquement

## Critères d'acceptation
- [x] `npm run build` OK — 60 modules, 0 erreur TypeScript
- [x] Nouvelle minimap s'affiche (asset présent, clé branchée)
- [x] 8 univers correctement positionnés (confirmé par analyse pixel + overlay visuel)
- [x] Points jaunes alignés sur les cercles de l'image
- [x] Couronnes boss alignées sur les étoiles de l'image
- [x] Sélection reste fonctionnelle (logique inchangée)
- [x] Navigation inchangée (pan, pinch zoom, double-tap)
- [x] Aucune zone interactive hors écran
- [x] Aucune régression de navigation
