# 985 — Implementation Notes

## Suggested implementation sequence

### 1. Find Castle gameplay legacy layer

Search for:
- `full_frame`,
- `frame`,
- `hud_panel`,
- `UniverseFrameRenderer`,
- `castle`,
- `Castle`,
- old frame asset keys.

Identify the layer that draws the old red/blue bars.

Disable it for Castle.

Do not disable runtime HUD.

---

### 2. Replace Castle frame with runtime border

If disabling old frame removes too much visual identity, draw a simple runtime border:

```txt
purple grid border
thin gold accent
optional bottom stone decoration only if clean
```

Do not reintroduce top HUD art.

---

### 3. Remove result empty slot

Search in `ClearScene` for:
- third button,
- disabled button,
- extra panel rectangle,
- placeholder panel,
- bottom background rectangle.

Remove or conditionally skip it.

There should be exactly two action buttons.

---

### 4. Share result layout

If not already done, add:

```ts
RESULT_SCREEN_LAYOUT
```

or a small helper.

Use it for:
- GameOver,
- Clear.

---

### 5. Keep intro unchanged

Only fix regressions.

---

### 6. Run build and capture screenshots

This patch is visual.

Build is necessary but not sufficient.
