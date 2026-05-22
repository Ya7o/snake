# 986 — Audit Findings

## Roadmap status

```txt
Phase 2 — Castle Vertical Slice
Patch 985 improved legacy removal but did not fully finalize runtime layers.
```

---

# Gameplay screenshot

What improved:
- old red/blue bars are mostly gone;
- runtime HUD is readable;
- background is more appropriate;
- grid is readable.

What remains wrong:
- the layer stack is still visually ambiguous;
- decorative/legacy frame remnants still appear around or near the grid;
- there is no clean runtime-owned board container;
- the grid feels placed into a mixture of background/frame rather than a deliberate board.

Conclusion:

```txt
Gameplay must be rebuilt as a deterministic layer stack.
```

---

# Game Over screenshot

What improved:
- Castle background works;
- title and buttons are readable;
- no major functional issue.

What remains weak:
- lower container feels heavy/legacy;
- should be governed by the final result layout.

Conclusion:

```txt
Valid enough, but align with final result layout.
```

---

# Intro screenshot

What improved:
- new system background works;
- panel is readable;
- buttons are clear.

What remains:
- not perfect, but not a blocker.

Conclusion:

```txt
Do not redesign intro in this patch.
```

---

# Root cause

The remaining bug is not art.

The remaining bug is render order and render path.

Correct fix:

```txt
For Castle gameplay, remove legacy frame renderer entirely.
Draw board, grid, HUD in runtime layers.
```

If `UniverseFrameRenderer` or equivalent remains active for Castle gameplay, the patch has failed.
