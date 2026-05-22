# 988 — Implementation Notes

## Suggested implementation sequence

### 1. Asset placement

If project uses import-based assets, keep:

```txt
src/assets/ui/title/
```

If project uses public paths, copy to:

```txt
public/assets/ui/title/
```

Use semantic names.

---

### 2. Preload assets

Add preload entries for:
- title background;
- 8 tokens.

---

### 3. Replace title scene background

Replace current generic neon/grid background with `title_hub_bg`.

Use cover scaling, not distortion.

---

### 4. Runtime logo

Draw:
```txt
SNAKE DRIVE
```

Remove or demote `V4`.

---

### 5. Runtime stats

Draw:
```txt
8 MONDES · 16 NIVEAUX
8 BOSS À DÉBLOQUER
```

---

### 6. Runtime CTA

Create capsule button:
```txt
TOUCHER POUR JOUER
```

Keep existing tap behavior.

---

### 7. Token strip

Place 8 tokens at bottom.

If one row is cramped:
- use 4 + 4 layout.

Do not make tokens interactive unless world selection is ready.

---

### 8. Animation

Add subtle CTA pulse only.
Add token/background animation only if safe.

---

### 9. Test mobile viewport

Ensure not hidden by browser UI or Android navigation.
