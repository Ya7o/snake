# 983_PATCH_CASTLE_RUNTIME_LAYOUT_REBUILD

## Roadmap status

```txt
Snake Drive Audit And Game Design Foundations
Current phase: PHASE 2 — Vertical Slice
Patch 980: Castle Vertical Slice — done
Patch 981: Castle Tuning/Readability — done
Patch 982: Castle UI Cohesion Pass — partially successful
Current patch: 983 — Castle Runtime Layout Rebuild
Goal: fix Castle UI architecture before extracting template 990
```

---

## Context

PATCH 982 made progress:
- Castle Game Over now uses a Castle background.
- Castle Clear uses a Castle background.
- Castle Intro is better structured.
- Runtime text is not baked into result images.

But screenshots after PATCH 982 show that Castle is still not ready to become the template.

Current issues:

1. **Gameplay HUD still shows old baked HUD artifacts**
   - Old score numbers and decorative bars remain visible.
   - `CASTLE / STAGE 1 / MAGIC 0/10` is readable but not clean.
   - The old full-frame image is still visually contaminating the HUD area.

2. **HUD height is too small**
   - `HUDRenderer.ts` hardcodes `hudH = 34`.
   - `GameScene.ts` passes `34` to `computeGridLayout`.
   - This is not enough to cover the old frame header and not enough for comfortable mobile reading.

3. **Full-frame artwork is being used as if it were a clean gameplay frame**
   - `UniverseFrameRenderer.ts` maps a full-frame image onto the grid using `FULL_FRAME_INNER_RECT`.
   - Castle frame asset contains baked top HUD/decorative content.
   - Result: old UI bleeds into runtime HUD.

4. **Result screens are improved but still scene-specific**
   - `GameOverScene.ts` and `ClearScene.ts` duplicate their own percentage-based layout.
   - This creates drift.
   - Future universes will repeat the same problems unless a small reusable result layout exists.

5. **Level Intro is acceptable but still cramped**
   - It is no longer the biggest problem, but spacing can be improved after HUD/result rules are stabilized.

6. **Title screen is still generic**
   - This is visible in the screenshots.
   - Do not fix it in this patch; note it as a later global shell issue.

---

# Goal

Create a reliable Castle runtime UI foundation.

After this patch:
- Castle gameplay HUD must be clean.
- No old baked HUD artifacts should be visible.
- Castle result screens must use shared runtime layout slots.
- Castle intro must remain readable and consistent.
- Castle can finally be used as the basis for template extraction.

---

# Required work

## 1. Introduce a small runtime layout contract

Create a small central layout config or helper.

Suggested file names:

```txt
src/ui/RuntimeUILayout.ts
src/ui/ResultScreenLayout.ts
src/ui/CastleUILayout.ts
```

Use whatever naming fits the repo.

The goal is not to build a framework.

The goal is to centralize:

```txt
HUD height
HUD safe area
result title/subtitle/button positions
button sizes
intro text zones
```

Acceptance criteria:

- [ ] HUD height is not hardcoded independently in both `GameScene` and `HUDRenderer`.
- [ ] Result screen coordinates are not duplicated differently between `GameOverScene` and `ClearScene`.
- [ ] Castle-specific style values are centralized or passed through a small config.
- [ ] Code remains simple and understandable.

---

## 2. Rebuild Castle gameplay HUD properly

Do not rely on the old frame image to be clean.

The HUD must be runtime-owned.

Required behavior:

```txt
A clean, opaque/semi-opaque HUD strip covers the full top gameplay UI area.
No old frame score/bars/numbers visible behind it.
```

Specific requirements:
- Increase HUD height from 34 to roughly 52–60 px, tuned for mobile.
- Use opacity 1.0 or near 1.0 for the HUD background.
- Add a top/bottom accent line.
- Use clear left/center/right labels.
- Ensure `computeGridLayout` uses the same HUD height so grid starts below it.
- Add an additional Castle HUD scrim/mask if the full-frame asset still bleeds behind.

Acceptance criteria:

- [ ] No ghosted `012345`, `098765`, bars, hearts, or old frame HUD visible behind runtime text.
- [ ] `CASTLE` readable.
- [ ] `STAGE 1` readable.
- [ ] `MAGIC 0/10` readable.
- [ ] HUD looks intentional, not patched over.
- [ ] Grid does not overlap HUD.
- [ ] Snake gameplay remains visible.

---

## 3. Stop treating full-frame art as HUD-safe

For Castle gameplay, either:

### Option A — mask the top frame header
Add an opaque runtime mask/scrim above the grid and behind the clean HUD.

or:

### Option B — use a simplified runtime frame for Castle gameplay
Disable the full-frame top/header portion and draw only:
- grid border,
- side/bottom castle decoration,
- runtime HUD.

or:

### Option C — crop full-frame artwork safely
If cropping is easy and robust, crop out the baked top HUD from the frame asset.

Choose the simplest reliable option.

Acceptance criteria:

- [ ] Old baked HUD artifacts are not visible.
- [ ] Castle frame still feels present.
- [ ] The fix does not break other universes.
- [ ] The fix is documented in code or docs.

---

## 4. Create a shared result screen renderer/helper

Avoid continuing with separate ad-hoc layouts in `GameOverScene` and `ClearScene`.

Create a small helper if reasonable:

```txt
renderResultScreen(scene, config)
```

or similar.

It should support:
- background image key,
- title,
- subtitle,
- optional level name,
- primary button,
- secondary button,
- theme colors.

Do not overengineer.

Acceptance criteria:

- [ ] GameOver and Clear use the same layout contract for Castle.
- [ ] Castle result screen text positions are consistent.
- [ ] Primary/secondary buttons align consistently.
- [ ] Runtime text remains editable.
- [ ] Non-Castle fallback still works.

---

## 5. Refine Castle result screens after layout rebuild

Game Over screenshot is now coherent but still needs final alignment validation.

Targets:
- title should sit in the intended title area;
- subtitle should not float too far from title;
- level name should be optional and less dominant;
- buttons should align with visible template slots;
- no UI should be hidden by mobile browser bottom controls.

Acceptance criteria:

- [ ] `PERDU` has strong hierarchy.
- [ ] `L’illusion t’a piégé` is readable.
- [ ] `REJOUER` is clearly primary.
- [ ] `CARTE` is secondary.
- [ ] Stage Clear / Boss Clear share the same layout.
- [ ] Controls are not too low for mobile.

---

## 6. Keep Level Intro stable, with minor polish only

Do not redesign Level Intro again.

Allowed:
- small spacing improvements,
- slightly clearer OBJECTIF/DANGER hierarchy,
- ensure buttons align with Castle button rules.

Acceptance criteria:

- [ ] Intro remains readable.
- [ ] `JOUER` remains dominant.
- [ ] `CARTE` remains secondary.
- [ ] No big new visual experiment.

---

## 7. Add screenshot validation checklist

Add/update a doc checklist for the four mandatory captures:

```txt
Castle Intro
Castle Gameplay HUD
Castle Game Over
Castle Stage Clear / Boss Clear
```

Acceptance criteria:

- [ ] Checklist exists.
- [ ] It says exactly what to verify.
- [ ] It blocks template extraction if HUD artifacts remain.

---

# Files likely to modify

Search actual repo paths.

Likely:

```txt
src/render/HUDRenderer.ts
src/render/UniverseFrameRenderer.ts
src/render/GridRenderer.ts
src/scenes/GameScene.ts
src/scenes/GameOverScene.ts
src/scenes/ClearScene.ts
src/scenes/LevelIntroScene.ts
src/config/constants.ts
src/ui/*
docs/*
```

---

# Files allowed to create

Allowed if useful:

```txt
src/ui/RuntimeUILayout.ts
src/ui/ResultScreenRenderer.ts
src/ui/CastleUITheme.ts
docs/983_CASTLE_SCREENSHOT_VALIDATION.md
```

Keep helpers small.

---

# Files forbidden to modify

Do not modify unless necessary:

```txt
package.json
vite.config.*
tsconfig.*
public/assets/*
src/assets/*
```

Do not regenerate images.

Do not add dependencies.

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
- world map visual redesign,
- new gameplay,
- new level/boss content,
- audio,
- economy,
- achievements,
- localization,
- template extraction 990.

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

Manual test:
1. Launch Castle Stage 1 intro.
2. Confirm intro still readable.
3. Start gameplay.
4. Confirm no old HUD artifacts are visible.
5. Confirm HUD is clean and readable.
6. Lose level.
7. Confirm Game Over layout is aligned and Castle-themed.
8. Retry works.
9. Clear Stage 1.
10. Confirm Stage Clear uses same result layout.
11. Clear boss if possible.
12. Confirm Boss Clear layout.
13. Confirm title screen was not changed.

---

# Definition of done

- [ ] Build passes.
- [ ] Castle gameplay HUD has no old/baked artifacts visible.
- [ ] HUD height/layout is centralized.
- [ ] GameOver and Clear share result layout logic or config.
- [ ] Castle result screens align with templates.
- [ ] Level Intro remains readable.
- [ ] No new worlds or gameplay added.
- [ ] Screenshot checklist exists.
- [ ] Castle can move to PATCH 990 only after screenshots validate this patch.
