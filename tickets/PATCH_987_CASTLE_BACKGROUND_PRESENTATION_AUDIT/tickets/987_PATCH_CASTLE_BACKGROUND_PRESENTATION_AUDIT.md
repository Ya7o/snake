# 987_PATCH_CASTLE_BACKGROUND_PRESENTATION_AUDIT

## Roadmap status

```txt
Snake Drive Audit And Game Design Foundations
Current phase: PHASE 2 — Castle Vertical Slice
Current patch: 987 — Castle Background Presentation Audit
Goal: stabilize background composition, gameplay framing, HUD readability, and typography for Castle
Next patch if accepted: 988 — Castle HUD and Background Layout Pass
```

## Context

Castle now has stronger backgrounds than before, but the runtime presentation still wastes them.

Observed issues:
1. Backgrounds are not always fully enjoyed.
2. Gameplay grid is too large for the visual framing goal.
3. The top HUD is visually poor.
4. Typography / sprite presentation is not yet normalized.

## Objective

Prepare and implement a Castle-specific presentation pass that ensures:
- backgrounds remain visible and are not wasted;
- gameplay leaves space for the environment art;
- the top HUD is replaced by a more elegant presentation strategy;
- font, sprite, and text rules are documented and applied consistently.

## Main required outputs

### 1. Background design audit
For each Castle screen type:
- intro / stage card,
- gameplay,
- game over,
- stage clear / boss clear,

document how much of the background must remain visible and which area must stay clear for runtime UI.

Acceptance criteria:
- [ ] Each Castle screen type has a stated “protected art zone”.
- [ ] Each Castle screen type has a stated “runtime-safe zone”.
- [ ] The code/layout can preserve the image composition instead of burying it.

### 2. Gameplay board resize brief
Required direction:

```txt
Cases slightly smaller
Grid larger in cell count feel
Visible side margins
Visible bottom decoration
Cleaner separation from top interface
```

Acceptance criteria:
- [ ] New target grid container width ratio documented.
- [ ] New target grid container height ratio documented.
- [ ] Margin recommendations given for left/right/bottom/top.
- [ ] Codex can implement without ambiguity.

### 3. HUD redesign audit
Audit and recommend the best way to replace the current top strip.

Required options:
- Option A — Compact top capsule row
- Option B — Bottom secondary info panel
- Option C — Corner anchors

Acceptance criteria:
- [ ] At least 3 HUD approaches audited.
- [ ] One recommended approach selected.
- [ ] Rationale given in terms of visuals, readability, implementation cost, and reusability across universes.

### 4. Font / sprite / text audit
Acceptance criteria:
- [ ] Display/title font style documented.
- [ ] Runtime UI font style documented.
- [ ] Recommended size scale documented.
- [ ] Outline/shadow usage documented.
- [ ] Sprite readability issues identified if any.

## Files likely to inspect/modify next patch

```txt
src/scenes/IntroScene.*
src/scenes/GameScene.*
src/scenes/GameOverScene.*
src/scenes/ClearScene.*
src/render/HUDRenderer.*
src/render/GridRenderer.*
src/ui/*
src/data/themes.*
docs/*
```

## Files forbidden to modify in this patch

Do not:
- regenerate art,
- create new png files,
- add dependencies,
- redesign other universes.

## Deliverables

- [ ] Visual audit docs complete.
- [ ] Clear recommendation for gameplay board framing.
- [ ] Clear recommendation for Castle HUD replacement.
- [ ] Font / sprite audit documented.
- [ ] Implementation checklist ready for the next code patch.
