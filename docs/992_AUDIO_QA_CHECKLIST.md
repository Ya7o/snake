# 992 — Audio QA Checklist

## Build

- [ ] `npm ci` passes.
- [ ] `npm run build` passes.

If available:
- [ ] `npm run test` passes.
- [ ] `npm run lint` passes.

---

# Runtime checks

- [ ] Pickup sound plays once per pickup.
- [ ] Collision sound plays once on death.
- [ ] Stage clear sound plays once on completion.
- [ ] Button sound plays on menu/retry/continue taps.
- [ ] Danger sound plays once when danger appears, if implemented.
- [ ] No sound loops accidentally.
- [ ] No sound plays every frame.
- [ ] Game does not crash if audio fails to load.
- [ ] Mobile browser audio unlock is handled if needed.

---

# Report after integration

Send:

```txt
1. files changed
2. audio asset destination
3. audio registry path
4. event hooks added
5. build result
6. any sounds intentionally not connected
```
