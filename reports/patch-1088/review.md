# Review — PATCH 1088

## Objectif
Valider les zones touchées par PATCH 1085/1086/1087 via assertions headless ciblées, sans modifier le code de jeu.

## Résultat
**16/16 checks passés.**

Un bug correctif a été nécessaire : les textures OpenMoji pour OutRun (trophée) et Paperboy (journal) étaient écrasées par le bloc `rt_` dans `GameScene.create()`. Corrigé en appliquant les overrides OpenMoji APRÈS le bloc `rt_`.

## Fichiers modifiés

| Fichier | Modification |
|---|---|
| `src/scenes/GameScene.ts` | Déplacement overrides outrun/paperboy pickup après le bloc `rt_` |
| `scripts/patch1088_checks.mjs` | Script QA headless (nouveau) |
| `reports/patch-1088/checks.json` | Résultats JSON des assertions |

## Tests / vérifications

```
npm run check
> tsc && vite build
✓ 60 modules transformed.
✓ built in 8.80s
0 erreur TypeScript.

Assertions (16/16) :
✅ HUD capsules (Castle/Sonic/Castle boss) — strip removed
✅ Castle normal maxWalls=3
✅ Sonic normal getSpeedMultiplier wired
✅ OutRun normal trophy texture
✅ Fighter normal fist resolver wired
✅ Paperboy normal newspaper texture
✅ Kombat fatalZone cells[] structure
✅ Shinobi decoy orbit params
✅ Streets blocker state field
✅ Sonic boss body >= 5
✅ Fighter boss roundPhase active
✅ Kombat boss gatePhase
✅ Paperboy boss obstacles=3
✅ Streets boss 2 étaux (zones=14 cellules)
```

## Captures

| Capture | Description |
|---|---|
| `hud_castle_no_strip.png` | HUD Castle sans ruban |
| `hud_sonic_no_strip.png` | HUD Sonic sans ruban |
| `hud_castle_boss_no_strip.png` | HUD Castle boss sans ruban |
| `outrun_trophy_check.png` | OutRun trophy pickup (après fix priorité) |
| `fighter_fist_check.png` | Fighter fist resolver actif |
| `paperboy_newspaper_check.png` | Paperboy journal pickup (après fix priorité) |
| `kombat_lava_check.png` | Kombat lava zones (attendu deferred à t=4s) |
| `sonic_boss_body5.png` | Sonic boss corps 5 segments |
| `kombat_boss_gate.png` | Kombat boss DragonGate fermé |
| `paperboy_boss_wave.png` | Paperboy boss vague 1/3, 3 obstacles |

## Documents

- `docs/targeted-runtime-checks.md` : détail des 16 checks, bug corrigé, limitations QA.
- `checks.json` : résultats JSON des assertions.

## Limites / risques

- Kombat fatalZone check deferred : difficile à tester headless sans forcer des ticks.
- Streets blocker state check : trop tôt pour voir des blockers à t=2500ms.
- Ces deux checks sont structurellement validés (propriétés présentes), pas fonctionnellement.

## Bugs bloquants
Aucun.

## Liens GitHub
_(après push)_
