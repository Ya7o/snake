# 971 — Expected Behavior

## Fresh save

Expected:

```txt
Unlocked: node_1
Cleared: none
Selected: node_1 or first available node
```

Not expected:

```txt
Unlocked: all nodes
```

---

## Node selection

When the player taps a node:

```txt
Selected node changes.
Footer/panel updates.
```

If unlocked:

```txt
Button: JOUER
Enabled: yes
```

If locked:

```txt
Button: VERROUILLÉ
Enabled: no
```

---

## Level clear

When the player clears a level:

```txt
current node → cleared
next declared node → unlocked
return/continue to World Map
```

Only the next declared node should unlock.

---

## Danger collision

If an active hazard occupies cell `(x, y)` and the snake head moves into `(x, y)`:

```txt
Game Over immediately
```

If the hazard is inactive or decorative:

```txt
No death
```

---

## Boss HP

If a boss level has:

```ts
bossHp: 5
```

Then:
- boss starts at 5 HP;
- HUD displays 5 or equivalent;
- each valid hit reduces HP;
- at 0 HP the level clears.

If omitted:

```txt
fallback = 3
```

---

## QA

QA should catch:
- invalid progression graph,
- missing levels,
- invalid boss HP,
- danger cells out of bounds,
- missing boss factory entries.
