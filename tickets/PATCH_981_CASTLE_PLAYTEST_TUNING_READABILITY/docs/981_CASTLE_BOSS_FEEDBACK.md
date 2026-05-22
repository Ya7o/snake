# 981 — Castle Boss Feedback

## Roadmap status

```txt
Phase 2 — Castle Vertical Slice
Current focus: boss comprehension and feedback
```

---

# Boss player story

The player must understand:

```txt
avoid magic danger
wait for mirror shard / weak point
touch weak point
boss loses HP
repeat
```

---

# Required clarity

## Danger

Boss danger cells should be:
- visible,
- high contrast,
- consistent with `getDangerCells()`.

## Weak point

Weak point should be:
- brighter,
- clearly different,
- only highlighted when hittable,
- consistent with `getWeakPoints()`.

---

# Hit feedback

On successful weak-point hit:

Recommended:
- boss flash,
- weak point burst,
- HP decrease animation or clear update,
- small screen shake if already available.

No need for new audio engine.

If audio is not implemented, add a TODO comment such as:

```ts
// TODO audio: play boss-hit cue when audio system exists.
```

Do not implement audio in this patch.

---

# Boss fail states to avoid

Bad:
- player touches weak point but nothing obvious happens;
- weak point and danger look similar;
- boss HP changes too subtly;
- player does not know when boss is vulnerable;
- boss can be hit accidentally without understanding.

Good:
- player says “I get it, hit the glowing thing.”
