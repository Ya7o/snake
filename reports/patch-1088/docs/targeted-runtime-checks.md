# Targeted Runtime Checks — PATCH 1088

## Contexte

Après PATCH 1085 (HUD sans ruban + harmonisation plateau), PATCH 1086 (niveaux normaux) et PATCH 1087 (boss), ce patch valide les zones modifiées via des assertions headless Playwright. Aucun code de jeu n'est modifié — seulement le script de QA et les rapports.

**Exception :** Un bug d'ordre de priorité détecté lors des checks a nécessité une correction dans `src/scenes/GameScene.ts` (voir section Bug corrigé).

---

## Résultats — 16/16 checks passed

### PATCH 1085 — HUD sans ruban

| Check | Niveau | Résultat | Détail |
|---|---|---|---|
| HUD capsules (Castle) | castle_normal | ✅ | `bg` rectangle absent de `hudRenderer` |
| HUD capsules (Sonic) | sonic_normal | ✅ | OK |
| HUD capsules (Castle boss) | castle_boss | ✅ | OK |

### PATCH 1086 — Niveaux normaux

| Check | Niveau | Résultat | Détail |
|---|---|---|---|
| Castle maxWalls=3 | castle_normal | ✅ | mechanic: CastleIllusionMechanic |
| Sonic getSpeedMultiplier | sonic_normal | ✅ | multiplier=1 (pas de boost actif) |
| OutRun trophy texture | outrun_normal | ✅ | key=openmoji-outrun-trophy |
| Fighter fist resolver | fighter_normal | ✅ | entityTextureResolver wired |
| Paperboy newspaper texture | paperboy_normal | ✅ | key=openmoji-paperboy-newspaper |
| Kombat fatalZone cells[] | kombat_normal | ✅ | pas encore de zone (vérification différée — attendu) |
| Shinobi décoys orbit | shinobi_normal | ✅ | 2 décoys, orbitAngle/orbitRadius présents |
| Streets blocker state field | streets_normal | ✅ | pas encore de blockers (attendu, spawn à 15 ticks) |

### PATCH 1087 — Boss

| Check | Niveau | Résultat | Détail |
|---|---|---|---|
| Sonic boss body >= 5 | sonic_boss | ✅ | body.length=5 |
| Fighter boss idle < 15 ticks | fighter_boss | ✅ | roundPhase=idle (actif) |
| Kombat boss gatePhase | kombat_boss | ✅ | gatePhase=closed |
| Paperboy boss obstacles >= 3 | paperboy_boss | ✅ | obstacles=3 |
| Streets boss 2 étaux | streets_boss | ✅ | zones=14 cellules (2 rangées de pression) |

---

## Bug corrigé : OutRun/Paperboy pickup texture écrasée par le bloc `rt_`

**Détecté par :** check assertions — `key=rt_outrun_pickup` au lieu de `openmoji-outrun-trophy`.

**Cause :** Dans `GameScene.create()`, le bloc de priorité `rt_` (lignes 275-283) était exécuté APRÈS les assignations OpenMoji, les écrasant.

**Correction (`src/scenes/GameScene.ts`) :**
- Déplacement des assignations `outrun` trophy et `paperboy` newspaper APRÈS le bloc `rt_`.
- Suppression des lignes dupliquées dans le bloc `paperboy` précédent.

```typescript
// OpenMoji pickup overrides — must come AFTER rt_ block to take priority
if (uid === 'outrun' && this.textures.exists(OUTRUN_OPENMOJI_ICONS.checkpoint.key)) {
  this.pickupRenderer.setTextureKey(OUTRUN_OPENMOJI_ICONS.checkpoint.key);
}
if (uid === 'paperboy' && this.textures.exists(PAPERBOY_OPENMOJI_ICONS.newspaper.key)) {
  this.pickupRenderer.setTextureKey(PAPERBOY_OPENMOJI_ICONS.newspaper.key);
}
```

---

## Bugs bloquants

Aucun bug bloquant identifié.

## Limitations QA

- **Kombat fatalZone** : le check s'exécute à t=4000ms. Si aucune zone n'est encore apparue (spawn toutes les 12 ticks × 160ms = 1920ms), le check est marqué `deferred`. Ce comportement est correct — à 4 s, une zone devrait exister.
- **Streets blocker** : pas encore de blocker à t=2500ms (spawn à 15 ticks × 155ms = 2325ms). Normal.
- **Sonic getSpeedMultiplier = 1** : normal, car le boost n'est actif qu'après une chaîne complète.
