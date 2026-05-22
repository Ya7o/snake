# 981 — Scope Guardrails

## Roadmap status

```txt
Phase 2 — Vertical Slice
Current work: improve Castle readability only
```

---

# Do not expand

Do not work on:
- Sonic,
- Streets,
- Fighter,
- OutRun,
- Shinobi,
- Kombat,
- Paperboy,

unless a shared bug blocks Castle.

---

# Do not add content

No:
- new levels,
- new bosses,
- new world map structure,
- new campaign system,
- new assets,
- new audio system.

---

# Do not refactor broadly

Allowed:
- small helper,
- small FX helper,
- small QA helper,
- small rendering tweak.

Forbidden:
- engine rewrite,
- new UI framework,
- full state machine rewrite,
- ECS,
- new dependency.

---

# Keep changes easy to review

This patch should be small.

If implementation starts touching many unrelated files, stop and reassess.

The goal is tuning and readability, not architecture.
