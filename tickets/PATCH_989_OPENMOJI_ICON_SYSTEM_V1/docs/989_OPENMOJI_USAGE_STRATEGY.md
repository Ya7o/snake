# 989 — OpenMoji Usage Strategy

## Decision

Use OpenMoji for V1 small icons, not for primary art.

---

# Good uses

Use OpenMoji for:

```txt
world tokens
HUD icons
small pickup icons
menu icons
result screen symbols
debug/QA icon labels
```

Why:
- consistent style,
- fast integration,
- easy to replace later,
- readable if displayed at reasonable size.

---

# Bad uses

Do not use OpenMoji for:

```txt
backgrounds
gameplay frames
main Snake sprite
boss sprites
large decorative art
premium splash screens
```

Why:
- OpenMoji has a flat emoji/icon style;
- Snake Drive targets a retro pixel/arcade identity;
- replacing core art with emojis would make the game look like a generic emoji prototype.

---

# Size recommendation

For title/world tokens:
```txt
48–64 px minimum
```

For HUD:
```txt
18–28 px
```

For pickups:
```txt
cell size dependent, but test readability
```

Do not use detailed icons below 16 px unless simplified.

---

# Visual treatment

If OpenMoji icons feel too flat:
- place them inside runtime circular tokens;
- add palette-tinted ring/border;
- add drop shadow;
- optionally tint via runtime only if safe.

Do not manually edit source SVGs unless necessary.
