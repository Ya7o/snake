# 983 — Scope Guardrails

## Do not expand

Do not work on:
- Sonic,
- Streets,
- Fighter,
- OutRun,
- Shinobi,
- Kombat,
- Paperboy.

Do not create all-world templates yet.

---

# Do not redesign title screen

The title screenshot is generic, but it is out of scope.

Title screen can be handled later as a global shell polish patch.

---

# Do not regenerate art

No new image generation.

Use existing:
- `castle_game_over_bg.png`,
- `castle_clear_bg.png`,
- existing Castle intro/gameplay assets.

---

# Do not add gameplay

No:
- mechanics,
- bosses,
- levels,
- economy,
- achievements,
- audio system.

---

# Keep helper small

Allowed:
- small layout constants file;
- small result screen helper;
- small HUD mask/scrim;
- minor intro spacing.

Forbidden:
- UI framework rewrite;
- large scene rewrite;
- new dependencies;
- cross-world template extraction.

---

# The goal

Fix Castle's runtime UI architecture enough to move to PATCH 990.

Nothing more.
