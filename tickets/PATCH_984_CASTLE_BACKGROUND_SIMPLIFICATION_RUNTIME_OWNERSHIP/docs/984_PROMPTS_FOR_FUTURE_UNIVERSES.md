# 984 — Prompts For Future Universes

## Goal

This document preserves the generation method used for Castle so that the same production model can be applied to future universes.

Use this 4-image model:

```txt
{universe}_system_bg.png
{universe}_gameplay_bg.png
{universe}_game_over_bg.png
{universe}_clear_bg.png
```

---

# Global rules for all future prompts

Always include:

```txt
vertical 9:16
mobile game background
pixel-inspired 16/32-bit
no text
no buttons
no HUD
no score
no panels
no fixed UI layout
runtime UI will be drawn by code
readable on phone
```

Never generate:
- full UI screens,
- button slots,
- panels that must align,
- fake labels,
- logos,
- official characters.

---

# Prompt template — system background

```txt
Crée un background vertical 9:16 pour un jeu mobile rétro inspiré de [UNIVERS].
Usage : écran système / intro / menu d’univers.

Image de fond uniquement, sans texte, sans boutons, sans HUD, sans score, sans panneaux UI.
L’ambiance doit montrer [ELEMENTS PRINCIPAUX DE L’UNIVERS].
Le centre doit rester assez calme et lisible pour accueillir un panel runtime avec texte et boutons.
Style pixel-inspired 16/32-bit, nostalgique, lisible sur téléphone.
Ne copie aucun logo, personnage ou élément officiel.
```

---

# Prompt template — gameplay background

```txt
Crée un background vertical 9:16 pour un écran de gameplay Snake mobile rétro inspiré de [UNIVERS].

Image de décor uniquement, sans texte, sans boutons, sans HUD, sans score, sans cadre UI.
Le centre doit rester très sobre et peu détaillé pour accueillir une grille de gameplay Snake.
Le décor doit se concentrer surtout sur les bords et le bas : [ELEMENTS DE DECOR PERIPHERIQUES].
Style pixel-inspired 16/32-bit, très lisible sur téléphone.
Ne copie aucun logo, personnage ou élément officiel.
```

---

# Prompt template — game over background

```txt
Crée un background vertical 9:16 pour un écran Game Over dans un univers rétro inspiré de [UNIVERS].

Image de fond uniquement, sans texte, sans boutons, sans HUD, sans score.
Ambiance plus sombre, plus silencieuse, plus inquiétante : [ELEMENTS DE DANGER / ECHEC].
Le centre doit rester exploitable pour poser un message de défaite et des boutons runtime.
Style pixel-inspired 16/32-bit, lisible sur téléphone.
Ne copie aucun logo, personnage ou élément officiel.
```

---

# Prompt template — clear background

```txt
Crée un background vertical 9:16 pour un écran de victoire / stage clear dans un univers rétro inspiré de [UNIVERS].

Image de fond uniquement, sans texte, sans boutons, sans HUD, sans score.
Ambiance lumineuse, gratifiante, positive : [ELEMENTS DE VICTOIRE / RECOMPENSE].
Le centre doit rester assez lisible pour accueillir un message de succès et des boutons runtime.
Style pixel-inspired 16/32-bit, nostalgique et lisible sur téléphone.
Ne copie aucun logo, personnage ou élément officiel.
```

---

# How to adapt to another universe

For Sonic-like world:
- replace Castle elements with tropical hills, loops, rings, checker patterns;
- no official characters;
- no Sonic logos.

For Streets-like world:
- neon alley, brick, graffiti, barrels, wet asphalt;
- no official characters.

For OutRun-like world:
- sunset highway, palm trees, dashboard mood;
- no recognizable car model or logos.

For Shinobi-like world:
- temple, snow, moon, lanterns, bamboo, silhouettes;
- no official characters.

Keep the same 4-background model.
