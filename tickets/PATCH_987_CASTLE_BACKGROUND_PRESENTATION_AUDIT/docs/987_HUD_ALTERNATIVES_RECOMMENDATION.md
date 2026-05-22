# 987 — HUD Alternatives Recommendation

## Problem

The current full-width top HUD strip is visually the weakest element on the Castle gameplay screen.

## Option A — Compact capsule row

Example:
```txt
[ CASTLE ]   [ STAGE 1 ]   [ MAGIC 0/10 ]
```

Pros:
- elegant;
- lightweight;
- easy to theme for other universes;
- preserves more background.

Verdict:
```txt
Strong candidate.
```

## Option B — Corner anchors

Example:
```txt
CASTLE          STAGE 1          MAGIC 0/10
```

Verdict:
```txt
Good fallback, but not best.
```

## Option C — Split HUD
- top-left small world badge,
- top-center stage badge,
- top-right progress badge,
- heart/life row near board edge.

Verdict:
```txt
Promising, but riskier for an amateur project.
```

## Option D — Bottom framed info band
Verdict:
```txt
Not recommended for Castle.
```

## Recommended choice

### Recommendation: Option A — Compact capsule row

Normal stage:
```txt
[ CASTLE ] [ STAGE 1 ] [ MAGIC 0/10 ]
```

Boss stage:
```txt
[ CASTLE BOSS ] [ HP 2/3 ] [ MAGIC 7/10 ]
```

### Styling
- fill: deep purple / near-black,
- border: gold with subtle violet glow,
- text: pale gold or warm white.
