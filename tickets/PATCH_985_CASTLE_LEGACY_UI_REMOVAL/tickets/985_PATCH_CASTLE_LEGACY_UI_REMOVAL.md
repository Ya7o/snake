# 985_PATCH_CASTLE_LEGACY_UI_REMOVAL

## Roadmap status

```txt
Snake Drive Audit And Game Design Foundations
Current phase: PHASE 2 — Castle Vertical Slice
Current patch: 985 — Castle Legacy UI Removal
Goal: remove old Castle UI layers before template extraction
Next patch if validated: 990 — Vertical Slice Template Extraction
```

---

## Context

PATCH 984 introduced the correct image strategy:

```txt
castle_system_bg
castle_gameplay_bg
castle_game_over_bg
castle_clear_bg
```

and the correct doctrine:

```txt
Images provide atmosphere.
Runtime owns UI.
```

The new assets are good.

The remaining problem is not image generation.

The remaining problem is that the old UI system is still visible in places.

Post-984 screenshots show:

1. **Gameplay still has legacy header artifacts**
   - old red/blue bars visible under the runtime HUD;
   - old frame/header still present;
   - runtime HUD is clean but legacy UI is still underneath.

2. **Stage Clear has legacy slots/panels**
   - an empty rectangle appears under `CARTE`;
   - too many stacked panels;
   - old result-screen structure remains.

3. **Game Over is acceptable but should be checked against the same cleaned result layout**
   - it is close to valid;
   - do not overwork it.

4. **Intro is acceptable**
   - no major redesign needed.

PATCH 985 must remove the legacy layers, not mask them.

---

# Goal

Make Castle screens use only:

```txt
new background
+ runtime UI
```

Not:

```txt
new background
+ old frame
+ old panels
+ runtime UI
```

---

# Required fixes

## 1. Remove legacy Castle gameplay frame/header

For Castle gameplay, stop rendering any old full-frame/header asset that contains:
- score numbers,
- red/blue bars,
- hearts,
- old arcade HUD,
- top decorative UI strip.

Use only:
- `castle_gameplay_bg.png`,
- runtime HUD,
- runtime grid panel,
- runtime grid border,
- runtime bottom/peripheral decoration only if it contains no HUD.

### Acceptance criteria

- [ ] No red/blue old bars visible.
- [ ] No old score digits visible.
- [ ] No old hearts/old HUD fragments visible.
- [ ] No old top frame header visible.
- [ ] Runtime HUD is the only HUD.
- [ ] Castle still feels visually themed.

---

## 2. Clean Castle Stage Clear / Boss Clear

Remove the empty legacy slot under `CARTE`.

Result screens must have only:

```txt
title
subtitle
optional context
primary button
secondary button
```

No third empty panel.
No hidden inactive button background.
No leftover placeholder.

### Acceptance criteria

- [ ] No empty rectangle below `CARTE`.
- [ ] No unused button slot.
- [ ] No stacked legacy panel behind buttons unless it serves a clear runtime purpose.
- [ ] Stage Clear remains readable.
- [ ] Boss Clear remains readable.
- [ ] Continue works.
- [ ] Map works.

---

## 3. Consolidate result screen layout

Game Over, Stage Clear, and Boss Clear should use the same runtime result layout rules.

If a helper exists from 984, use it.
If not, create a small one or at least centralize constants.

Do not duplicate drift-prone layout logic.

### Acceptance criteria

- [ ] Game Over and Clear share result layout constants or helper.
- [ ] Primary and secondary buttons align consistently.
- [ ] Castle backgrounds differ by state, but runtime UI structure is consistent.
- [ ] Text/buttons remain runtime-rendered.

---

## 4. Keep Castle Intro stable

Castle Intro is acceptable after 984.

Only fix if necessary:
- obvious spacing issue,
- button alignment regression,
- conflict with new background model.

### Acceptance criteria

- [ ] Intro still uses `castle_system_bg`.
- [ ] Runtime panel/text/buttons still work.
- [ ] `JOUER` primary.
- [ ] `CARTE` secondary.

---

## 5. Do not change assets

The four Castle backgrounds are validated.

Do not regenerate images.

Do not replace them.

Only fix code integration.

### Acceptance criteria

- [ ] No new generated images.
- [ ] Existing 984 assets remain used.
- [ ] No old Castle result templates reintroduced.

---

# Files likely to modify

Search actual repo structure.

Likely:

```txt
src/scenes/GameScene.ts
src/scenes/ClearScene.ts
src/scenes/GameOverScene.ts
src/scenes/LevelIntroScene.ts
src/render/UniverseFrameRenderer.ts
src/render/HUDRenderer.ts
src/render/GridRenderer.ts
src/ui/*
src/data/themes.ts
src/data/worlds.ts
docs/*
```

---

# Files allowed to create

Only if useful:

```txt
src/ui/ResultScreenRenderer.ts
src/ui/CastleRuntimeTheme.ts
src/ui/RuntimeUILayout.ts
docs/985_CASTLE_SCREENSHOT_GATE.md
```

Keep helpers small.

---

# Files forbidden to modify

Do not modify unless required:

```txt
package.json
vite.config.*
tsconfig.*
```

Do not add dependencies.

Do not modify image files.

---

# Out of scope

Do not work on:
- Sonic,
- Streets,
- Fighter,
- OutRun,
- Shinobi,
- Kombat,
- Paperboy,
- Title screen redesign,
- new gameplay,
- new levels,
- boss design,
- audio,
- economy,
- localization,
- all-world template extraction.

---

# Tests to run

```bash
npm ci
npm run build
```

If available:

```bash
npm run test
npm run qa
npm run lint
```

Manual screenshot gate:

```txt
1. Castle Gameplay
2. Castle Stage Clear
3. Castle Game Over
```

Optional:

```txt
4. Castle Intro
```

---

# Definition of done

- [ ] Build passes.
- [ ] Castle gameplay has no legacy HUD/header artifacts.
- [ ] Stage Clear has no empty legacy slot.
- [ ] Result screen layout is clean and shared.
- [ ] Game Over remains Castle-themed.
- [ ] Intro remains acceptable.
- [ ] No new assets added.
- [ ] No other universes modified.
- [ ] Ready for screenshot audit before PATCH 990.
