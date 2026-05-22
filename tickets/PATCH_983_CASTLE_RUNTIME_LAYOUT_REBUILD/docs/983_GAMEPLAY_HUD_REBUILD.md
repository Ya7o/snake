# 983 — Gameplay HUD Rebuild

## Main blocker

The latest gameplay screenshot still shows old HUD artifacts.

This means PATCH 982 did not fully solve the problem.

---

# Required HUD behavior

The Castle gameplay HUD must be a runtime layer.

It must cover the entire top HUD area with a clean strip.

Recommended:

```txt
HUD height: 56 px
background: #07030f or black, alpha 0.96–1.0
top/bottom line: gold/violet accent
text: left/center/right
```

---

# Required text

Normal Castle stage:

```txt
CASTLE      STAGE 1      MAGIC 0/10
```

Boss Castle stage:

```txt
CASTLE BOSS      HP 2/3
```

or equivalent.

---

# Implementation direction

## Step 1

Move HUD height to shared constant:

```ts
export const GAMEPLAY_HUD = {
  HEIGHT: 56,
  PADDING_X: 10,
};
```

Do not keep `hudH = 34` only in `HUDRenderer`.

---

## Step 2

Use the same HUD height in `GameScene`:

```ts
computeGridLayout(..., GAMEPLAY_HUD.HEIGHT, ...)
```

or equivalent.

---

## Step 3

Make HUD background opaque enough.

```ts
alpha >= 0.96
```

If old art still bleeds, use `1.0`.

---

## Step 4

Mask old frame header if needed.

If Castle full-frame art still shows old HUD, draw a runtime rectangle from:

```txt
y = 0
height = layout.y - 4
```

at a depth above frame but below HUD text.

This is acceptable because runtime HUD owns that area.

---

## Step 5

Verify with screenshot.

Pass condition:

```txt
No old score/bars/hearts/numbers visible behind HUD.
```

If any are visible, patch fails.

---

# Important

Do not try to make the old baked HUD look better.

Remove it from the player's perception.

Runtime HUD wins.
