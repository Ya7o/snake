# 987 — QA Screenshot Gate

## Required captures after implementation patch

### 1. Castle intro
Pass if background is clearly visible and the UI does not smother the image.

### 2. Castle gameplay
Pass if side décor and bottom décor are visible, the board is clearly framed, and the HUD no longer looks like a generic ugly strip.

### 3. Castle game over
Pass if background is visible and there are only two buttons.

### 4. Castle stage clear
Pass if the reward image is visible and there is no extra empty panel.

## Fail conditions

- full-width ugly top bar remains;
- board still crushes the image;
- backgrounds remain hidden;
- fonts remain inconsistent;
- buttons/panels still feel oversized.
