# 988 — Animation Guidelines

## Keep it light

This is a title screen, not a loading benchmark.

Avoid heavy animation.

---

# Recommended animations

## CTA pulse

Animate:
- alpha,
- scale,
- or border brightness.

Timing:
```txt
1.2s to 1.6s loop
```

Subtle only.

---

## Background drift

Optional:
- very slow star/parallax movement;
- tiny shimmer over portal.

Do not move large islands aggressively.

---

## Token idle

Optional:
- slight staggered bob;
- very subtle glow pulse.

If implemented, keep it slow and minimal.

---

# Avoid

Do not add:
- particle storms;
- intense screen shake;
- fast flashing;
- heavy post-processing;
- large animated sprites.

---

# Performance

Must remain smooth on mobile.
If animation causes stutter, remove it.
