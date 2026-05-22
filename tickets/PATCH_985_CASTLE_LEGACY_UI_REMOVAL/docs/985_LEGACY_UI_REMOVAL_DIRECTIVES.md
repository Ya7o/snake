# 985 — Legacy UI Removal Directives

## Main directive

Do not hide legacy UI.

Remove it from the Castle render path.

---

# What counts as legacy UI

Legacy UI includes:
- old score digits,
- old HUD bars,
- hearts,
- baked top headers,
- baked button slots,
- empty placeholder panels,
- old result-screen containers that are no longer needed.

---

# Correct Castle composition

## Gameplay

```txt
castle_gameplay_bg
runtime HUD
runtime grid panel
runtime grid border
runtime gameplay objects
```

Optional:
```txt
runtime bottom decoration
```

Forbidden:
```txt
old frame asset with HUD baked in
```

---

## Result screens

```txt
castle_game_over_bg or castle_clear_bg
runtime title
runtime subtitle
runtime context
runtime primary button
runtime secondary button
```

Forbidden:
```txt
unused third button slot
empty legacy panel
old template panel stack
```

---

# Do not overcorrect

Do not:
- redesign the title screen;
- regenerate images;
- retune gameplay;
- create all-world skins;
- rewrite the UI framework.

This patch is a cleanup pass.
