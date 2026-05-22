# 980 — Scope Guardrails

## Roadmap status

```txt
Phase 2 — Vertical Slice
Rule: one world first
```

---

# Do not expand horizontally

Do not polish all 8 worlds.

That is the classic amateur trap:

```txt
many unfinished worlds
instead of one convincing world
```

---

# Work only on Castle unless required by shared systems

Allowed shared changes:
- HUD helper,
- FX helper,
- QA helper,
- small boss API improvement,
- small mechanic readability helper.

Forbidden shared changes:
- full UI framework rewrite,
- new campaign architecture,
- all-world rebalancing,
- full visual redesign,
- asset pipeline rewrite.

---

# Do not add new production risks

Avoid:
- new dependencies,
- complex shaders,
- big particle engine,
- async animation framework,
- state machine library,
- external asset tools.

---

# Keep amateur-friendly

The code should remain understandable.

Good:
```txt
small helper
clear function
data-driven values
comments for rules
```

Bad:
```txt
large abstraction
generic engine rewrite
premature architecture
```

---

# Phase 2 success definition

Success is not:

```txt
all worlds look polished
```

Success is:

```txt
one world proves the full game loop
```

Once Castle works, the rest of the game has a template.
