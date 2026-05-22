# 986_PATCH_CASTLE_RUNTIME_LAYER_FINALIZATION

## Roadmap status

```txt
Snake Drive Audit And Game Design Foundations
Current phase: PHASE 2 — Castle Vertical Slice
Current patch: 986 — Castle Runtime Layer Finalization
Goal: finalize Castle runtime layers and stop the repeated UI cleanup loop
Next patch if validated: 990 — Vertical Slice Template Extraction
```

---

## Context

The Castle UI has gone through several iterations.

Important conclusions:

1. **The images are no longer the problem.**
   The 984 background set is good:
   - `castle_system_bg.png`
   - `castle_gameplay_bg.png`
   - `castle_game_over_bg.png`
   - `castle_clear_bg.png`

2. **PATCH 985 improved the situation but did not fully solve it.**
   The gameplay screen is cleaner, but legacy layers still appear or the layer stack is still ambiguous.

3. **We are turning in circles because previous patches allowed partial fixes.**
   This patch must be stricter.

The runtime must own the UI. Castle gameplay must not render any legacy frame/header/HUD layer.

---

# Current visible bugs

## Gameplay

Post-985 screenshot shows:
- runtime HUD is readable;
- grid is readable;
- background is correct;
- but old or ambiguous frame/decorative layer still appears around/behind the grid;
- the separation between HUD, grid, and background is not clean enough.

The Castle gameplay composition must be deterministic and simple.

## Game Over

Game Over is mostly valid, but there is still a heavy lower container feel.

Do not overwork it unless the same result layout produces unused containers.

## Intro

Intro is acceptable. Do not redesign.

---

# Goal

After this patch, Castle must have one clear runtime layer contract:

```txt
background
board panel
grid
gameplay objects
HUD
result UI
```

No legacy HUD.
No legacy frame with header.
No unused slots.
No mystery layer.

---

# Required changes

## 1. Disable all legacy Castle gameplay frame/header rendering

For Castle gameplay, `UniverseFrameRenderer` or any equivalent legacy frame renderer must not draw:
- old top header,
- old HUD art,
- old red/blue bars,
- old score zones,
- old decorative full-frame around grid if it contains UI baggage.

Preferred implementation:

```txt
if theme/world id is Castle:
  skip legacy frame renderer entirely
  draw runtime board panel + runtime grid border instead
```

Acceptance criteria:

- [ ] `UniverseFrameRenderer` or equivalent does not draw legacy Castle frame in gameplay.
- [ ] No old header artifacts remain.
- [ ] No red/blue old bars remain.
- [ ] No old score/HUD fragments remain.
- [ ] Castle still has visual identity through `castle_gameplay_bg` and runtime border.

---

## 2. Define exact Castle gameplay layer order

Use an explicit order.

Recommended conceptual depths:

```txt
0   castle_gameplay_bg
10  board shadow / board panel
20  grid background
30  grid lines
40  pickups / hazards / snake / boss objects
70  gameplay FX
80  HUD strip
90  HUD text
```

Adapt exact numbers to project conventions, but the order must be explicit.

Acceptance criteria:

- [ ] Background is behind everything.
- [ ] Board panel is behind the grid.
- [ ] Grid objects are above grid.
- [ ] HUD is above board/gameplay.
- [ ] No background or frame draws above HUD.
- [ ] No legacy frame draws between HUD and grid.

---

## 3. Add a runtime board panel for Castle

The grid needs a dedicated runtime container.

Draw:
- dark rectangle behind grid;
- purple/gold border;
- optional subtle shadow;
- padding consistent with layout.

Do not depend on image frame.

Acceptance criteria:

- [ ] Grid has a clean dark board panel.
- [ ] Border is runtime-drawn.
- [ ] The background does not interfere with grid readability.
- [ ] Board panel is responsive to screen size/layout.

---

## 4. Finalize HUD

HUD must be runtime only.

Required:
- opaque or near-opaque strip;
- height shared with layout;
- left/center/right labels;
- top/bottom accent lines if useful.

Normal:

```txt
CASTLE      STAGE 1      MAGIC 0/10
```

Boss:

```txt
CASTLE BOSS      HP 2/3
```

Acceptance criteria:

- [ ] HUD height has one source of truth.
- [ ] HUD uses same reserved height as grid layout.
- [ ] Text is readable on mobile.
- [ ] No layer crosses into the HUD area.

---

## 5. Finalize result screen layout

Game Over, Stage Clear, and Boss Clear must use one clean result layout.

There must be exactly:
- one primary button;
- one secondary button.

No empty third slot.
No extra bottom container.
No unused panel drawn for missing actions.

Acceptance criteria:

- [ ] Game Over has no unused slot.
- [ ] Stage Clear has no unused slot.
- [ ] Boss Clear has no unused slot.
- [ ] Primary and secondary buttons align consistently.
- [ ] Runtime text/buttons remain editable.

---

## 6. Add runtime layer debug switch

Add a very small optional debug aid if useful.

Example:
- `?debugLayers=1`
- logs active Castle render layers;
- or draws small labels in console only.

Do not build a debug UI.

Acceptance criteria:

- [ ] Developer can confirm whether legacy frame is rendered.
- [ ] Debug path does not affect normal gameplay.
- [ ] No dependency added.

---

## 7. Document final Castle render path

Add or update documentation:

```txt
docs/986_CASTLE_FINAL_RENDER_PATH.md
```

or equivalent.

It must say:
- which background is used where;
- which renderer owns HUD;
- whether `UniverseFrameRenderer` is skipped for Castle;
- how result screens are composed.

Acceptance criteria:

- [ ] Final render path documented.
- [ ] Future template extraction can reference it.

---

# Files likely to modify

Search current repo structure.

Likely:

```txt
src/scenes/GameScene.ts
src/scenes/GameOverScene.ts
src/scenes/ClearScene.ts
src/render/UniverseFrameRenderer.ts
src/render/HUDRenderer.ts
src/render/GridRenderer.ts
src/ui/RuntimeUILayout.ts
src/ui/ResultScreenRenderer.ts
src/data/themes.ts
src/data/worlds.ts
docs/*
```

---

# Files allowed to create

Only if useful:

```txt
src/ui/CastleRuntimeLayering.ts
src/ui/RuntimeUILayout.ts
src/ui/ResultScreenRenderer.ts
docs/986_CASTLE_FINAL_RENDER_PATH.md
```

Keep helpers small.

---

# Files forbidden to modify

Do not modify unless necessary:

```txt
package.json
vite.config.*
tsconfig.*
```

Do not add dependencies.
Do not add new image files.
Do not regenerate assets.

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
- title screen redesign,
- new gameplay,
- new mechanics,
- audio,
- achievements,
- shop,
- localization,
- 990 template extraction.

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

Manual screenshots required:
1. Castle Gameplay.
2. Castle Game Over.
3. Castle Stage Clear.
4. Castle Intro optional.

---

# Definition of done

- [ ] Build passes.
- [ ] Castle gameplay has no legacy frame/header/HUD layer.
- [ ] Runtime board panel owns the grid container.
- [ ] Runtime HUD owns the HUD area.
- [ ] Result screens have no empty/unused slots.
- [ ] Final render path documented.
- [ ] No new assets added.
- [ ] No other universes modified.
- [ ] Ready for screenshot audit before PATCH 990.
