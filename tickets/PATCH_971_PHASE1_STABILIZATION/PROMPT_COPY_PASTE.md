# PROMPT COPY/PASTE — PATCH 971 PHASE 1 STABILIZATION

You are working on the Snake Drive V4 repository.

Apply the patch described in:

```txt
tickets/971_PATCH_PHASE1_STABILIZATION.md
docs/971_STABILIZATION_DIRECTIVES.md
docs/971_EXPECTED_BEHAVIOR.md
docs/971_QA_TEST_PLAN.md
docs/971_IMPLEMENTATION_NOTES.md
```

## Mission

Stabilize the Phase 1 gameplay foundation before Phase 2.

Do not add new content.
Do not add new assets.
Do not redesign the UI.
Do not refactor the whole engine.

Fix only what is required:

1. Real World Map progression.
2. Reliable active danger collision after snake movement.
3. Clean public `BaseMechanic` context sync API.
4. Visible World Map selected-node `JOUER` button.
5. Data-driven boss HP.
6. Stronger lightweight QA checks.

## Hard constraints

- Keep the existing architecture.
- No large folder reorganization.
- No new dependencies unless absolutely necessary.
- No new art.
- No audio work.
- No shop/economy/achievements.
- No Phase 2 features.
- Build must pass.

## Required execution

1. Inspect current repo structure.
2. Locate relevant files.
3. Implement the six stabilization items.
4. Run:

```bash
npm ci
npm run build
```

5. Run available QA/test commands if present:

```bash
npm run test
npm run qa
npm run lint
```

6. Provide a concise implementation report listing:
   - files changed,
   - behavior fixed,
   - tests run,
   - any remaining risks.

## Definition of done

- Fresh save unlocks only first node.
- Clearing a node unlocks only the next declared node.
- Locked nodes cannot launch.
- World Map has visible selected-node Play button.
- Snake dies immediately when entering active danger cells.
- Decorative extra entities do not kill unless exposed as danger cells.
- GameScene no longer accesses mechanic `ctx` via unsafe casting.
- Boss HP comes from level data with safe fallback.
- QA checks cover progression, danger cells, and boss config.
- `npm run build` passes.
