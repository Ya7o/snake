# Review — PATCH 1087

## Objectif
Améliorer la lisibilité et la difficulté des boss sans refonte complète.

## Résultat

| Boss | Modification | Statut |
|---|---|---|
| Castle boss (WitchMirror) | Miroirs 3+phase (était 2+phase), attaque plus rapide | ✅ |
| Sonic boss (LoopSerpent) | Corps 5 (était 3), moveInterval 3 (était 4), HUD "FRAPPE LA QUEUE" | ✅ |
| Streets boss (CrimeLord) | 2 étaux simultanés (était 1), chaque ~45 % largeur | ✅ |
| Fighter boss (FinalChallenger) | idle 10 ticks (était 20), counter zones [5,7,10] par phase | ✅ |
| OutRun boss (TurboRival) | Rival mobile verticalement, turboZone ttl 18 (était 12), HUD clair | ✅ |
| Kombat boss (DragonGate) | Zone radius [2,3,4] par phase (était fixe 1 = 8 cases) | ✅ |
| Paperboy boss (NeighborhoodChaos) | Obstacles 3+wave×2 (était 2+wave), extra obstacle après 1ère livraison | ✅ |
| Shinobi boss (ShadowNinja) | Non modifié (hors scope) | — |

## Fichiers modifiés

| Fichier | Modification |
|---|---|
| `src/mechanics/bosses/WitchMirrorBoss.ts` | count 3+phase, warningTicks 8, attackingTicks 8, vulnerableTicks 16 |
| `src/mechanics/bosses/LoopSerpentBoss.ts` | moveInterval 3, body max 5, HUD 'FRAPPE LA QUEUE' |
| `src/mechanics/bosses/CrimeLordBoss.ts` | 2 étaux simultanés dans 2 moitiés de grille |
| `src/mechanics/bosses/FinalChallengerBoss.ts` | idle 10, counterCount [5,7,10] par phase, ttl 10 |
| `src/mechanics/bosses/TurboRivalBoss.ts` | mouvement vertical, ttl 18, interval 20, HUD 'RATTRAPE LE RIVAL'/'FRAPPE !' |
| `src/mechanics/bosses/DragonGateBoss.ts` | radius 2+phase, cluster circulaire, ttl 10 |
| `src/mechanics/bosses/NeighborhoodChaosBoss.ts` | waveObstacles 3+wave×2, addExtraObstacle() après 1ère livraison |

## Tests / vérifications

```
npm run check
> tsc && vite build
✓ 60 modules transformed.
✓ built in 7.62s
0 erreur TypeScript.
Warning chunk > 500 kB : attendu, non bloquant.
```

## Captures

| Capture | Description |
|---|---|
| `sonic_boss_clarity.png` | HUD "FRAPPE LA QUEUE" visible, corps de 5 segments, orbe cible |
| `outrun_boss_hint.png` | Rival visible dans la grille, HUD "DÉPASSEMENT" (ruleText), rival mobile |
| `kombat_boss_zone.png` | Dragon Gate boss visible au centre, prêt à spawner zone large |
| `paperboy_boss_wave.png` | HUD "VAGUE 1/3", 3 obstacles (chiens), 2 mailboxes, journal disponible |

## Documents

- `docs/boss-levels-difficulty-clarity-pass.md` : détail de chaque boss, paramètres avant/après, risques.

## Limites / risques

- FinalChallenger attaque à 1.65 s (au lieu de 3.3 s) — peut surprendre le joueur peu habitué.
- DragonGate à 1 PV : zone ~49 cellules, joueur a 10 ticks (~1.7 s) pour sortir.
- NeighborhoodChaos vague 3 : 7 obstacles + 1 extra après livraison = 8 obstacles actifs.

## Liens GitHub
_(après push)_
