# PROMPT COPY/PASTE — PATCH 972 GAMEPLAY CONSISTENCY CLEANUP

You are working on the Snake Drive V4 repository.

Apply the patch described in:

```txt
tickets/972_PATCH_GAMEPLAY_CONSISTENCY_CLEANUP.md
docs/972_COLLISION_AUTHORITY_RULES.md
docs/972_EXPECTED_BEHAVIOR.md
docs/972_QA_TEST_PLAN.md
docs/972_IMPLEMENTATION_NOTES.md
docs/972_PHASE2_GATE.md
```

## Mission

Perform a small, surgical cleanup after PATCH 971.

The goal is to make gameplay interactions consistent before Phase 2.

Do not add content.
Do not add assets.
Do not redesign menus.
Do not refactor the entire engine.

## Required work

1. Make `GameScene` the clear authority for:
   - death,
   - danger collision,
   - boss weak-point collision,
   - pickup collision,
   - clear/fail priority.

2. Ensure mechanics:
   - update state in `tick()`;
   - expose lethal cells through `getDangerCells()`;
   - do not duplicate normal death checks inside `tick()` unless explicitly justified.

3. Ensure bosses:
   - expose lethal cells;
   - expose weak points or equivalent hit zones;
   - can be damaged reliably after snake movement;
   - still clear the level at 0 HP.

4. Keep rendering separate from collision:
   - `getExtraEntities()` is visual;
   - `getDangerCells()` is lethal;
   - boss weak points are gameplay.

5. Strengthen lightweight QA:
   - progression references;
   - boss HP/factory;
   - danger API;
   - linear progression debt note.

6. Document accepted debt:
   - progression is currently linear by `MAP_NODES` order;
   - do not implement branching progression yet.

## Hard constraints

- No new dependencies.
- No new assets.
- No large architecture rewrite.
- No ECS.
- No Redux.
- No event-bus rewrite.
- No Phase 2 features.
- Keep it understandable for an amateur developer.

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

- files changed;
- summary of collision authority changes;
- boss interaction changes;
- QA additions;
- tests run;
- remaining risks.

## Definition of done

- Build passes.
- Hazards kill after movement.
- Decorative visuals do not kill.
- Boss weak-point hits work after movement.
- Game Over has priority over pickups/clear.
- Mechanics no longer duplicate normal collision deaths in `tick()` unless justified.
- Linear progression debt is documented.
- No new content or assets added.
