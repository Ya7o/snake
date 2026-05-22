# 988 — QA Test Plan

## Automated

```bash
npm ci
npm run build
```

If available:

```bash
npm run test
npm run lint
npm run qa
```

---

# Manual QA

## Title screen

- [ ] Background visible.
- [ ] `SNAKE DRIVE` readable.
- [ ] `V4` not used as main brand.
- [ ] Stats readable.
- [ ] CTA readable.
- [ ] CTA tappable.
- [ ] 8 tokens visible.
- [ ] Tokens not too small.
- [ ] No text baked into image.
- [ ] No huge opaque panel hiding background.

## Navigation

- [ ] Tap starts game or opens correct next screen.
- [ ] Back/refresh does not break title.

## Mobile

- [ ] Works in portrait.
- [ ] Nothing important is behind browser top bar.
- [ ] Nothing important is behind navigation bar.
- [ ] Text remains readable.

---

# Screenshot gate

Send:
```txt
1. Title screen initial state
2. Title screen after 2–3 seconds if animation exists
```

Pass if:
- it looks like a real title screen, not a placeholder;
- it communicates multi-world arcade identity.
