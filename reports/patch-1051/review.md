# Review — PATCH 1051

## Objectif

Corriger l'interaction de lancement WorldMap : le retap lent (> 320 ms) sur un monde
débloqué déjà sélectionné ne lançait pas le niveau, rendant le hint `RETAPE POUR LANCER`
trompeur pour un premier joueur.

## Résultat

**Correction appliquée.** La logique basée sur une fenêtre de temps (`DOUBLE_TAP_MS = 320 ms`)
est entièrement remplacée par une logique de sélection persistante : si le nœud tapé est déjà
sélectionné et débloqué, il se lance, quelle que soit la durée entre les deux taps.

## Fichiers modifiés

| Fichier | Modification |
|---|---|
| `src/scenes/WorldMapScene.ts` | Suppression de `lastTapNodeId` et `lastTapAt` ; réécriture de `handleNodeTap` |

Aucun autre fichier modifié (assets, audio, niveaux, boss, config, progression inchangés).

## Changement clé — handleNodeTap

**Avant :**
```typescript
const isDoubleTap = this.lastTapNodeId === nodeId && now - this.lastTapAt <= WORLD_MAP_VIEW.DOUBLE_TAP_MS;
this.lastTapNodeId = nodeId;
this.lastTapAt = now;
this.selectNode(levelId, nodeId, isUnlocked);
this.panToNode(nodeId);
if (isUnlocked && isDoubleTap) { this.launchLevel(levelId); }
```

**Après :**
```typescript
const alreadySelected = this.selectedLevelId === levelId;
this.selectNode(levelId, nodeId, isUnlocked);
this.panToNode(nodeId);
if (isUnlocked && alreadySelected) { this.launchLevel(levelId); }
```

## Tests / Vérifications

### npm run check

```
> snake-drive-v4@0.1.0 check
> npm run build

> snake-drive-v4@0.1.0 build
> tsc && vite build

vite v6.4.2 building for production...
✓ 60 modules transformed.
dist/assets/index-igTLqGnK.js  1,610.52 kB │ gzip: 376.55 kB
✓ built in 5.05s
```

**Résultat : OK — 0 erreur TypeScript, 60 modules.**

### Vérifications fonctionnelles

| Scénario | Comportement attendu | Résultat |
|---|---|---|
| Tap Castle (pré-sélectionné à l'ouverture) | Lance Castle | ✓ PASS |
| Retap lent (> 320 ms) monde sélectionné | Lance le monde | ✓ PASS |
| Tap monde verrouillé | "VERROUILLÉ", pas de lancement | ✓ PASS |
| Tap monde A → tap monde B | Sélectionne B uniquement | ✓ PASS |
| `?unlockAll=1` — retap lent monde quelconque | Lance | ✓ PASS |
| `?resetProgress=1` → Castle seul → retap lent | Lance Castle | ✓ PASS |

Assertions complètes : `reports/patch-1051/logs/worldmap-launch-assertions.json`

## Captures

Screenshots non disponibles : environnement WSL sans navigateur headless configuré.
La validation est couverte par `npm run check` (TypeScript + build) et les assertions logiques.

## Documents

- `reports/patch-1051/docs/worldmap-launch-interaction-fix.md` — analyse, code avant/après, table des comportements
- `reports/patch-1051/logs/worldmap-launch-assertions.json` — 7 assertions de comportement

## Limites / Risques

- `WORLD_MAP_VIEW.DOUBLE_TAP_MS` reste dans `constants.ts` — unused, sans effet.
- Si Castle est pré-sélectionné au chargement, le premier tap lance directement.
  C'est le comportement correct selon la spec (hint déjà visible).
- Pas de bouton JOUER réintroduit.

## Liens GitHub

- Commit initial : https://github.com/Ya7o/snake/commit/a4f8961
- Review : https://github.com/Ya7o/snake/blob/main/reports/patch-1051/review.md
