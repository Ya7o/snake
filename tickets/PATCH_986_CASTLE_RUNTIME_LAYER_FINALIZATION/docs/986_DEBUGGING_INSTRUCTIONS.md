# 986 — Debugging Instructions

## Goal

Make it impossible to miss which legacy layer is still drawn.

---

# Search terms

Search for:

```txt
UniverseFrameRenderer
full_frame
frame
hud_panel
castle
Castle
red
blue
score
bar
clear
button
secondary
third
```

---

# Temporary debug logging

If useful, add temporary console logs behind a query flag:

```txt
?debugLayers=1
```

Possible log:

```ts
console.log('[Castle Layers]', {
  background: 'castle_gameplay_bg',
  legacyFrameSkipped: true,
  boardPanel: true,
  hud: true,
});
```

Do not leave noisy logs always enabled.

---

# Visual debugging

Temporarily tint layer rectangles if necessary during development, but remove debug tint before final.

---

# Important

If disabling `UniverseFrameRenderer` fixes Castle, do not keep it enabled and hide it.

The correct fix is the simpler render path.
