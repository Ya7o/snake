# Ticket 902 — Optimisation réactivité web mobile

## Statut : DONE (2026-05-20)

## Causes identifiées (audit 2026-05-20)

### P0 — Bloquants réactivité

| # | Fichier | Problème | Impact |
|---|---|---|---|
| 1 | `GameScene.ts` + `GridRenderer.ts` | Grille redessinée CHAQUE tick (54 drawcalls) | CPU inutile toutes les 200ms |
| 2 | `InputSystem.ts` | Swipe déclenché sur `pointerup` (lever du doigt) | Latence 50-150ms de plus |
| 3 | `GameScene.ts` | `parseInt(palette.*.replace('#'))` non caché | String ops + parseInt chaque rendu |
| 4 | `GameScene.ts` | `inputSys.destroy()` jamais appelé sur shutdown | Listeners qui s'accumulent au retry |
| 5 | `HUDRenderer.ts` | `setText()` appelé inconditionnellement chaque tick | Redraw texte même si valeur identique |

### P1 — Confort visuel

| # | Fichier | Problème | Impact |
|---|---|---|---|
| 6 | `PickupRenderer.ts` | Pulse basé sur tickCount (~4fps) | Animation saccadée |
| 7 | `main.ts` | Pas de config render mobile Phaser | Antialiasing GPU inutile sur mobile |

### P2 — Non bloquants

- `WorldMapScene`: drag via `this.input.on()` — scoped à la scène Phaser, cleanup auto OK
- `index.html`: viewport et CSS tactile déjà corrects

## Corrections appliquées

1. `InputSystem.ts` — swipe sur `pointermove` dès 20px, cleanup avec callbacks nommés
2. `GameScene.ts` — couleurs pré-parsées, shutdown() qui détruit inputSys, rendu pickup séparé du tick
3. `GridRenderer.ts` — méthode `drawOnce()` qui marque `dirty=false`, `draw()` ne redessine que si dirty
4. `HUDRenderer.ts` — dirty checking par valeur
5. `PickupRenderer.ts` — pulse basé sur `time` passé en paramètre
6. `main.ts` — `antialias: false`, `roundPixels: true`, `powerPreference: high-performance`

## Résultat npm run check

**OK** — tsc + vite build sans erreur. 50 modules. dist/assets/index-Bi54KPXE.js 1535 kB / gzip 354 kB.

## Résultat npm run preview

**OK** — `http://10.0.2.15:4173/` répond HTTP 200. Accessible en réseau local.

## Tests Android recommandés

```
npm run build && npm run preview -- --host 0.0.0.0
```

Ouvrir `http://[IP_LOCAL]:4173/` sur Chrome Android.

1. Faire 20 swipes rapides dans Castle — chaque swipe doit changer direction immédiatement.
2. Mourir → Retry × 5 — input doit rester identique.
3. Aller sur la map → autre univers — même réactivité.
4. Vérifier absence de scroll/zoom.
5. Comparer dev vs preview — si preview notablement plus fluide, documenter.
