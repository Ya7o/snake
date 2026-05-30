# Review — PATCH 1085

## Objectif
Supprimer le ruban/bandeau noir du HUD gameplay, garder les capsules HUD flottantes sur le fond d'écran, et harmoniser la taille visuelle du plateau entre les univers.

## Résultat
- ✅ Ruban opaque supprimé : les capsules flottent directement sur le background.
- ✅ Fond d'écran moins masqué en zone HUD (56 px libérés du noir plein).
- ✅ Capsules lisibles sur tous les fonds testés (Castle sombre, Sonic jungle, OutRun coucher de soleil, Castle boss).
- ✅ Y-bias Sonic harmonisé : 0.18 → 0.22 (aligne Sonic sur le groupe streets/fighter/shinobi/kombat/paperboy).
- ✅ Exceptions Castle et OutRun documentées et non modifiées.
- ✅ Aucune mécanique de jeu modifiée.

## Fichiers modifiés

| Fichier | Modification |
|---|---|
| `src/render/HUDRenderer.ts` | Suppression `this.bg` (Rectangle opaque), suppression ligne accent séparatrice |
| `src/scenes/GameScene.ts` | `FRAME_GRID_Y_BIAS.sonic` : 0.18 → 0.22 |

## Tests / vérifications

```
npm run check
> tsc && vite build
✓ 60 modules transformed.
✓ built in 5.70s
0 erreur TypeScript.
Warning chunk > 500 kB : attendu, non bloquant.
```

## Captures

| Capture | Description |
|---|---|
| `castle_hud_after.png` | Capsules CASTLE/MURS CACHÉS/MAGIC 0/10 flottantes sur fond castle |
| `sonic_hud_after.png` | Capsules SONIC/ANNEAU 1·4/0/15 flottantes sur fond jungle, grille légèrement plus basse (+12 px) |
| `outrun_hud_after.png` | Capsules OUTRUN/BALISES/0/10 flottantes sur coucher de soleil, grille OutRun basse (exception conservée) |
| `castle_boss_hud_after.png` | Capsules CASTLE/BOSS/HP 3/3 flottantes, boss actif |

## Documents

- `docs/gameplay-template-board-size-harmonization.md` : détail suppression ruban, layout capsules, règle taille plateau, univers harmonisés, exceptions, risques.

## Limites / risques
- Les capsules reposent sur leur propre fond sombre (opacité 84–90 %). Sur un fond futur très sombre de même teinte, la lisibilité pourrait baisser — corriger en augmentant l'opacité capsule si nécessaire.
- OutRun et Castle restent intentionnellement différents des 6 autres univers.

## Liens GitHub
_(après push)_
