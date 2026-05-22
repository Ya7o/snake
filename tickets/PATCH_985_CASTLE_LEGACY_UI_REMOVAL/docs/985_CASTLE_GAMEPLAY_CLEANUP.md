# 985 — Castle Gameplay Cleanup

## Main problem

The Castle gameplay screen still shows legacy header content under the runtime HUD.

Visible artifacts:
- red bar;
- blue bar;
- old frame/header;
- decorative arcade HUD fragments.

This must be removed.

---

# Required implementation

Search for Castle frame rendering.

Likely locations:
- `UniverseFrameRenderer.ts`
- `GameScene.ts`
- theme/world frame config
- asset keys such as `hud_panel`, `full_frame`, `castle-frame`, etc.

For Castle gameplay, disable any asset/layer that contains baked HUD.

---

# Acceptable solutions

## Option A — no legacy frame for Castle

Use only:

```txt
castle_gameplay_bg
runtime grid border
runtime bottom decoration if clean
```

This is the preferred solution if easiest.

## Option B — crop old frame to bottom-only

Only if the code already supports safe cropping.

Do not show top/header portion.

## Option C — runtime-drawn frame

Draw:
- grid border,
- bottom stone strip if needed,
- simple side accent.

Do not use baked HUD.

---

# Avoid

Do not solve by placing another rectangle over the old header if the old frame is still being drawn.

Masking is acceptable only as a temporary fallback if removing the layer is risky, but the preferred fix is disabling the old layer.

---

# Pass condition

A screenshot must show:

```txt
HUD bar
grid
background
no red/blue bars
no old score
no old hearts
no old header
```
