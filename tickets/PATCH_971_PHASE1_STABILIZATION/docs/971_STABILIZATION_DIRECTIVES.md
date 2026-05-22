# 971 — Stabilization Directives

## Product intent

This patch must make the game foundation reliable.

The goal is not to add content.
The goal is not to make the game prettier.
The goal is to make the existing Phase 1 loop trustworthy.

The game should now behave like a small but coherent mobile arcade game.

---

## Priority order

If time is limited, apply fixes in this order:

1. World Map progression.
2. Danger collision after movement.
3. Clean mechanic context sync.
4. World Map Play button.
5. Boss HP data-driven.
6. QA checks.

Progression and danger collision are the most important.

---

## Design principle

Use this rule:

```txt
Visual entities are not gameplay entities.
```

A thing can be rendered without being dangerous.

A dangerous thing must be exposed through collision logic, not only through drawing logic.

---

## Progression principle

Use this rule:

```txt
A locked node cannot be launched.
A cleared node unlocks only declared next nodes.
```

Do not make convenience shortcuts that unlock everything during sanitize.

Sanitize should repair corrupt saves, not bypass progression.

---

## Boss principle

Bosses should remain simple.

A boss is not a separate game mode yet.

Boss stage loop:

```txt
survive → collect/hit → reduce boss HP → clear
```

Do not add complex AI.

---

## Mobile UX principle

No critical action should depend on an invisible gesture.

Double tap is acceptable as a shortcut.
A visible `JOUER` button is required.
