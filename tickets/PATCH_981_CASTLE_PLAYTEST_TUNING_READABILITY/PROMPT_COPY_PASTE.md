# PROMPT COPY/PASTE — PATCH 981 CASTLE PLAYTEST TUNING & READABILITY

You are working on the Snake Drive V4 repository.

Apply the patch described in:

```txt
tickets/981_PATCH_CASTLE_PLAYTEST_TUNING_READABILITY.md
docs/981_CASTLE_PLAYTEST_DIRECTIVES.md
docs/981_CASTLE_TUNING_TARGETS.md
docs/981_CASTLE_READABILITY_RULES.md
docs/981_CASTLE_BOSS_FEEDBACK.md
docs/981_CASTLE_PLAYTEST_CHECKLIST.md
docs/981_QA_TEST_PLAN.md
docs/981_SCOPE_GUARDRAILS.md
```

## Roadmap position

```txt
Snake Drive Audit And Game Design Foundations
Phase 2 — Vertical Slice
Patch 980 — Castle Vertical Slice: done
Patch 981 — Castle Playtest Tuning & Readability: current
```

## Mission

Improve Castle readability and feel after the first vertical slice.

Do not add new content.
Do not polish all worlds.
Do not add new assets.
Do not refactor the engine.

Focus only on:

1. Castle illusion wall timing.
2. Warning vs active visual clarity.
3. Castle boss weak-point clarity.
4. Boss hit feedback.
5. Death and clear micro-feedback.
6. Castle playtest checklist.
7. Castle readability QA.

## Required behavior

Castle Stage 1:
- warning walls are clearly visible;
- warning walls do not kill;
- active walls are unmistakably dangerous;
- active walls kill immediately through danger cells;
- stage feels fair for World 1.

Castle Boss:
- weak point is visually obvious when hittable;
- weak point differs from danger;
- boss hit feedback is immediate;
- boss HP decrease is noticeable;
- boss defeat feedback is clear.

## Hard constraints

- No new dependencies.
- No generated images.
- No new worlds.
- No new levels.
- No audio system.
- No shop/economy/achievements.
- No branching progression.
- No broad refactor.
- Keep the patch small and reviewable.

## Commands to run

```bash
npm ci
npm run build
```

If available:

```bash
npm run test
npm run qa
npm run lint
```

## Report back with

- files changed,
- timing values adjusted,
- visual feedback changes,
- boss feedback changes,
- QA/checklist additions,
- commands run,
- remaining risks.

## Definition of done

- Castle warning/active states are easier to read.
- Castle boss weak point is easier to understand.
- Boss hit/death/clear feedback is more noticeable.
- Playtest checklist exists.
- QA includes Castle readability/tuning checks.
- Build passes.
- No new scope added.
