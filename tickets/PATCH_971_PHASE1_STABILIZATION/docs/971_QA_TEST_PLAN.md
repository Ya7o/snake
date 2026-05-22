# 971 — QA Test Plan

## Automated checks

Run:

```bash
npm ci
npm run build
```

Then run any available project QA commands:

```bash
npm run test
npm run qa
npm run lint
```

If these scripts do not exist, do not add heavy tooling just for this patch.
Add lightweight dev checks only if they fit the existing project style.

---

## Manual test 1 — fresh progression

1. Clear local storage/save data.
2. Launch the game.
3. Open World Map.
4. Verify only the first node is unlocked.
5. Verify other nodes are visibly locked.
6. Try launching a locked node.
7. It must not launch.

Pass criteria:

```txt
Only first node starts unlocked.
Locked nodes are blocked.
```

---

## Manual test 2 — unlock next node

1. Launch node 1.
2. Clear the level.
3. Return to World Map.
4. Verify node 1 is cleared.
5. Verify node 2 is unlocked.
6. Verify node 3 is still locked.

Pass criteria:

```txt
Clear unlocks only next declared node.
```

---

## Manual test 3 — selected Play button

1. Tap an unlocked node.
2. Verify selected info panel updates.
3. Tap `JOUER`.
4. Level Intro opens.
5. Tap a locked node.
6. Verify button is disabled or reads `VERROUILLÉ`.

Pass criteria:

```txt
A visible button path exists.
```

---

## Manual test 4 — hazard collision

Use any level with an active hazard.

1. Wait for hazard to become active.
2. Move snake into the active hazard.
3. Confirm death happens immediately.
4. Repeat when hazard is inactive.
5. Confirm inactive hazard does not kill.

Pass criteria:

```txt
Visual hazard state matches collision state.
```

---

## Manual test 5 — boss HP

1. Launch a boss level.
2. Confirm boss HP appears.
3. Damage boss.
4. Confirm HP decreases.
5. Reach 0 HP.
6. Confirm stage clear.

Pass criteria:

```txt
Boss HP is data-driven and clear triggers correctly.
```

---

## Regression checks

Verify:
- Title screen still opens.
- World Map still renders.
- Level Intro still renders.
- Normal level starts.
- Boss level starts.
- Game Over still works.
- Stage Clear still works.
- Mobile controls still work.
- Build still passes.
