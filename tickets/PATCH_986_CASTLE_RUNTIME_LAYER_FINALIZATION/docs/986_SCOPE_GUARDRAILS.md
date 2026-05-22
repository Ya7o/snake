# 986 — Scope Guardrails

## Do not touch assets

No:
- image generation,
- image editing,
- new PNG files.

Use the 984 assets.

---

# Do not touch other universes

No:
- Sonic,
- Streets,
- Fighter,
- OutRun,
- Shinobi,
- Kombat,
- Paperboy,

except safe fallback paths in shared helpers.

---

# Do not redesign title

Title screen is out of scope.

---

# Do not add gameplay

No:
- mechanics,
- levels,
- bosses,
- audio,
- economy,
- achievements.

---

# Do not overengineer

Allowed:
- small runtime layout helper;
- small result renderer;
- Castle branch to skip legacy frame;
- runtime board panel.

Forbidden:
- new UI framework;
- scene rewrite;
- ECS;
- dependencies.

---

# The purpose

End the Castle UI cleanup loop by finalizing render layer ownership.
