# Review — PATCH 1089

## Objectif
Quick fix : ajustements de difficulté mécanique sur 10 niveaux/boss.

## Modifications

| Cible | Modification | Valeur avant | Valeur après |
|---|---|---|---|
| Castle normal | maxWalls | 3 | 30 |
| Castle normal | spawnIntervalTicks | 16 | 2 |
| Castle normal | safeTicks/warningTicks | 8/8 | 6/6 |
| Castle boss | count miroirs | 3+phase (3/4/5) | (3+phase)×3 (9/12/15) |
| Sonic normal | BOOST_TICKS durée | 20 ticks (~2.7 s) | 60 ticks (~8 s) |
| Sonic boss | moveInterval | 3 | 1 (triple vitesse) |
| Kombat boss | zone radius | 2+phase | (2+phase)×3 (6/9/12) |
| Kombat boss | séquence | closed→opening→open→danger | closed→opening→danger→vulnerable |
| Kombat boss | timers | closed>25, opening>8 | closed>10, opening>4 |
| Streets normal | max blockers | 5 | 10 |
| Streets normal | chargeSteps | 2–5 cases | 5–12 cases |
| Streets normal | chargeInterval | 25 ticks | 15 ticks |
| Streets boss | étaux simultanés | 2 | 4 (répartis en 4 quarts grille) |
| Fighter normal | sparZones count | 3 | 30 |
| Fighter normal | respawn zones | jamais | toutes les 18 ticks (~3 s) |
| OutRun boss | voitures rapides | aucune | spawn toutes les 5 ticks, vitesse 2/tick |
| Paperboy normal | speedMs | 155 ms | 110 ms |

## Fichiers modifiés

- `src/mechanics/CastleIllusionMechanic.ts`
- `src/mechanics/bosses/WitchMirrorBoss.ts`
- `src/mechanics/SonicRingsMechanic.ts`
- `src/mechanics/bosses/LoopSerpentBoss.ts`
- `src/mechanics/bosses/DragonGateBoss.ts`
- `src/render/ObstacleRenderer.ts` (dragonGate color open→vulnerable)
- `src/mechanics/StreetsCrowdMechanic.ts`
- `src/mechanics/bosses/CrimeLordBoss.ts`
- `src/mechanics/FighterChargeMechanic.ts`
- `src/mechanics/bosses/TurboRivalBoss.ts`
- `src/config/levels.ts` (paperboy_normal speedMs)

## Tests

```
npm run check
✓ 60 modules — 0 erreur TypeScript — built in 8.11s
```

## Limites / risques

- Castle normal : ~11 murs simultanés en régime permanent (cycle 17 ticks, spawn 2 ticks).
- WitchMirror phase 2 : 15 miroirs — 1 réel, 14 dangereux. Grille 16×26 = 416 cells, 3.6 % couverts.
- DragonGate phase 2 : radius=12 → ~452 cells (≈141 % de la grille 16×20). En pratique clampé aux bords, ~320 cells max. Zone couvre toute la grille à phase 2.
- Sonic boss moveInterval=1 : 16 positions de boucle parcourues en 16 ticks = 2.3 s à 145ms/tick. Très rapide.
- OutRun fast cars : 2 cells/tick, spawn toutes les 5 ticks → 3-4 cars actives simultanément. Létales sur 2 cells (tête + corps).
