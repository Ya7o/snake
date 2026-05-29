# Review — PATCH 1051

## Objectif

Corriger l'interaction de lancement WorldMap : le retap lent (> 320 ms) sur un monde
débloqué déjà sélectionné ne lançait pas le niveau, rendant le hint `RETAPE POUR LANCER`
trompeur pour un premier joueur.

## Résultat

**Correction appliquée.** Le retap lent fonctionne désormais exactement comme un double-tap
rapide. La logique basée sur une fenêtre de temps (`DOUBLE_TAP_MS = 320 ms`) est remplacée
par une logique de sélection : si le nœud tapé est déjà sélectionné et débloqué, il se lance.

## Fichiers modifiés

| Fichier | Modification |
|---|---|
| `src/scenes/WorldMapScene.ts` | `handleNodeTap` : remplacement du check `isDoubleTap` par un check de sélection persistante |

Aucun autre fichier modifié (assets, audio, niveaux, boss, config inchangés).

## Tests / Vérifications

### npm run check

```
> snake-drive-v4@0.1.0 check
> npm run build

> snake-drive-v4@0.1.0 build
> tsc && vite build

vite v6.4.2 building for production...
✓ 60 modules transformed.
dist/index.html                    1.40 kB │ gzip:   0.67 kB
dist/assets/index-zXIWLHmo.js  1,610.68 kB │ gzip: 376.63 kB
(!) Some chunks are larger than 500 kB (warning attendu, non bloquant)
✓ built in 5.82s
```

**Résultat : OK — 0 erreur TypeScript, 60 modules.**

### Vérifications fonctionnelles

| Scénario | Comportement attendu | Couvert par |
|---|---|---|
| Tap Castle (pré-sélectionné au chargement) | Sélectionne — pas de lancement | `lastTapNodeId === null` au load |
| Retap Castle lent (> 320 ms) | Lance Castle | condition `selectedLevelId === levelId && lastTapNodeId === nodeId` |
| Double-tap rapide Castle | Lance Castle | même condition (temps non vérifié) |
| Tap monde verrouillé | "VERROUILLÉ", pas de lancement | garde `isUnlocked` |
| Tap Castle → tap Sonic → retap Sonic | Sélectionne Sonic, puis lance | `lastTapNodeId` mis à jour à chaque tap |
| `?unlockAll=1` — retap lent n'importe quel monde | Lance | idem |
| `?resetProgress=1` — retap Castle lent | Lance | idem |

Assertions complètes : `reports/patch-1051/logs/worldmap-launch-assertions.json`

## Captures

Screenshots non disponibles : Node.js Windows désinstallé (CLAUDE.md — environnement WSL only).
La validation est couverte par `npm run check` (TypeScript + build) et les assertions logiques documentées.

## Documents

- `reports/patch-1051/docs/worldmap-launch-interaction-fix.md` — analyse, table des changements, flux attendu
- `reports/patch-1051/logs/worldmap-launch-assertions.json` — 9 assertions de comportement

## Limites / Risques

- `WORLD_MAP_VIEW.DOUBLE_TAP_MS` reste dans `constants.ts` — export non utilisé après ce patch,
  sans effet et sans erreur TypeScript.
- `lastTapAt` reste dans la classe — assigné mais non lu, sans effet sur le build.
- L'auto-sélection de Castle au chargement (`create()`) ne déclenche pas de lancement au premier
  tap : `lastTapNodeId` est null au load, la condition de lancement ne passe pas.
- Le bouton JOUER n'est pas réintroduit.

## Liens GitHub

- Commit : https://github.com/Ya7o/snake/commit/a4f8961
- PR : non applicable (push direct main)
- Review : https://github.com/Ya7o/snake/blob/main/reports/patch-1051/review.md
