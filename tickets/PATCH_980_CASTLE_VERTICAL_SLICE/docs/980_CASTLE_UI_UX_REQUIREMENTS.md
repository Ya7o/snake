# 980 — Castle UI/UX Requirements

## Roadmap status

```txt
Phase 2 — Castle Vertical Slice
Focus: readable first polished world
```

---

# HUD

## Normal stage

Show only:

```txt
MAGIC 4/10
STAGE 1
```

Optional short hint:

```txt
WATCH THE WALLS
```

Do not show debug data.

---

## Boss stage

Show:

```txt
BOSS HP 2/3
MAGIC or SCORE if needed
```

Do not show normal objective if irrelevant.

---

# Warning language

Use short labels if needed:

```txt
DANGER
READY
CLEAR
```

Avoid long text during gameplay.

---

# Level Intro

## Normal

Must answer:

```txt
What do I collect?
What can kill me?
What is special here?
How do I start?
```

Example copy:

```txt
Jardin d'illusion
Collecte 10 éclats magiques.
Les murs brillent avant d'apparaître.
Attends le bon moment.
```

Keep short.

---

## Boss

Example copy:

```txt
Miroir de la Sorcière
Évite les reflets maudits.
Frappe l'éclat lumineux quand il apparaît.
```

---

# Clear screen

After Castle Stage 1:

```txt
STAGE CLEAR
CASTLE BOSS UNLOCKED
```

After Castle Boss:

```txt
BOSS CLEAR
WORLD 1 COMPLETE
```

---

# Fail screen

Must allow:

```txt
RETRY
MAP
```

No dead end.

---

# Mobile layout

Buttons:
- large enough,
- bottom safe area,
- no overlap with gameplay.

Text:
- readable,
- high contrast,
- no tiny pixel font for paragraphs.

---

# FX and readability

FX must support gameplay:

Good:
- pulse warning walls,
- sparkle weak point,
- flash on hit.

Bad:
- particles covering grid,
- glow hiding danger boundaries,
- long animations blocking retry.
