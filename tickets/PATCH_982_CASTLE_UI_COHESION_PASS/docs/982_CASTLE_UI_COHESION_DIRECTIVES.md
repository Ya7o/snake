# 982 — Castle UI Cohesion Directives

## Roadmap status

```txt
Phase 2 — Vertical Slice
Current issue: Castle is technically playable but not visually cohesive enough
Current patch: 982 — Castle UI Cohesion Pass
Next: 990 — Template Extraction, only after Castle is visually locked
```

---

# Product intent

Castle must become the reference standard for future worlds.

Not perfect.
But coherent.

A tester should not feel that:
- Intro is premium,
- Gameplay is old HUD,
- Game Over is generic prototype.

All Castle screens must look like the same product.

---

# Main rule

The UI must say:

```txt
I am still in Castle.
```

on every state:
- intro,
- gameplay,
- loss,
- clear,
- boss clear.

---

# What to fix first

Priority order:

1. Gameplay HUD clarity.
2. Castle Game Over template.
3. Castle Clear template.
4. Intro spacing.
5. Button language.

Do not spend time on other worlds.

---

# What not to do

Do not solve this by baking text into images.

The backgrounds are visual templates.
The code owns:
- title,
- subtitle,
- buttons,
- dynamic messages.

---

# Visual language

Castle primary:
```txt
gold / warm magic
```

Castle secondary:
```txt
dark violet / muted panel
```

Castle danger:
```txt
red accent only
```

Castle frame:
```txt
violet + gold + stone / fantasy
```

---

# Code principle

Prefer theme-driven values.

Good:

```ts
theme.resultScreens.gameOverBg
theme.resultScreens.clearBg
theme.colors.primaryButton
```

Acceptable short-term:

```ts
if (worldId === 'castle') use castle background
```

Bad:

```ts
duplicate the full GameOver scene for Castle
```

Keep it simple, but not messy.
