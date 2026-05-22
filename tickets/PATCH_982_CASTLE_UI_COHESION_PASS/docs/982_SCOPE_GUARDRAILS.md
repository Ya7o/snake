# 982 — Scope Guardrails

## Roadmap status

```txt
Current work: Castle UI Cohesion
Not yet: Template Extraction
```

---

# Do not expand to other worlds

Do not create:
- Sonic Game Over,
- OutRun Clear,
- all-world result templates.

That belongs after Castle is validated.

---

# Do not add gameplay

No:
- new mechanics,
- new stages,
- new boss patterns,
- new collectibles.

---

# Do not over-refactor

Allowed:
- small theme config addition;
- small result-screen renderer helper;
- small HUD cleanup;
- asset import/path update.

Forbidden:
- new UI framework;
- full scene architecture rewrite;
- full theme engine rewrite;
- localization system;
- animation engine.

---

# Do not bake text

Text must remain runtime-rendered.

If image has empty panels, use them.
Do not edit image to add words.

---

# Keep patch reviewable

This patch should mostly touch:
- Castle result screens,
- HUD rendering,
- Level Intro spacing,
- button styles,
- asset registration.

If many unrelated files change, the patch is drifting.
