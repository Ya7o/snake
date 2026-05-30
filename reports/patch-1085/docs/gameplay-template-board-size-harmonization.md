# Gameplay Template & Board Size Harmonization — PATCH 1085

## 1. Suppression du ruban HUD

### Avant
Le HUD gameplay affichait un bandeau pleine largeur opaque (`0x06020e, alpha=1.0`) de 56 px en haut de l'écran, sur lequel les capsules étaient posées. Ce bandeau masquait entièrement le fond d'écran dans la zone HUD.

### Modification appliquée
- Suppression du `Rectangle` `this.bg` dans `HUDRenderer.ts` (ligne 25–27 avant patch).
- Suppression de la ligne d'accent séparatrice (`lineBetween` à y=hudH) qui bordait le bandeau.
- Suppression du `this.bg.destroy()` dans la méthode `destroy()`.

### Après
Les capsules (left · center · right) flottent directement sur le fond d'écran sans couche opaque intermédiaire. Le fond reste visible dans l'espace autour et entre les capsules.

---

## 2. Layout capsules final

```
HUD_HEIGHT = 56 px
capY = floor((56 - 40) / 2) = 8 px   (top of capsule)
capH = 40 px                           (height of capsule)
```

Les capsules occupent donc y=8..48. L'espace y=48..56 est transparent (fond visible), puis le grid commence à y=56+topGap (≈110 px sur un 390×844).

### Opacités des capsules (inchangées — déjà suffisantes)
- Gauche (univers) : fond `0x060212` alpha=0.90 + tint accent alpha=0.09 + bordure accent alpha=0.88
- Centre (règle) : fond `0x0e0828` alpha=0.84 + bordure `0x2c2848` alpha=0.72
- Droite (score/HP) : même style que gauche

Ces valeurs assurent une lisibilité correcte sur tous les fonds testés (Castle sombre, Sonic jungle, OutRun coucher de soleil).

---

## 3. Règle de taille plateau

### Principes conservés
| Paramètre | Valeur de base | Calcul |
|---|---|---|
| `FRAME_GRID_WIDTH` | 0.94 | Fraction de la largeur écran utilisée par la grille |
| `FRAME_GRID_Y_BIAS` | 0.22 | Part de l'espace vertical restant allouée au gap haut |
| `GRID_COLS × GRID_ROWS` | 16 × 20 | Toutes les univers non-Castle |

### Harmonisation appliquée
- **Sonic** : Y-bias `0.18 → 0.22` pour aligner sur le groupe streets/fighter/shinobi/kombat/paperboy.
  - Effet concret sur 390×844 : grille décalée de +12 px vers le bas (topGap 54→66 px), plus centré visuellement.

---

## 4. Univers harmonisés

| Univers | Width | Y-bias | Grille | Statut |
|---|---|---|---|---|
| sonic | 0.94 | **0.22** (était 0.18) | 16×20 | Harmonisé |
| streets | 0.94 | 0.22 | 16×20 | Déjà conforme |
| fighter | 0.94 | 0.22 | 16×20 | Déjà conforme |
| shinobi | 0.94 | 0.22 | 16×20 | Déjà conforme |
| kombat | 0.94 | 0.22 | 16×20 | Déjà conforme |
| paperboy | 0.94 | 0.22 | 16×20 | Déjà conforme |

---

## 5. Exceptions documentées

### Castle — Exception intentionnelle
- **Width** : 0.75 (frame décorative Gothic impose une zone centrale plus étroite)
- **Y-bias** : 0.38 (frame positionne la grille plus bas)
- **Grille** : 16×26 (6 lignes supplémentaires pour les mécaniques blink wall / illusion tile)
- **Raison** : Design artistique Castle of Illusion, frame spécifique, mécanique différente.

### OutRun — Exception intentionnelle
- **Width** : 0.78 (frame cockpit/route impose une zone réduite)
- **Y-bias** : 0.42 (frame OutRun positionne le plateau dans la moitié basse, sous le dashboard)
- **Grille** : 16×20
- **Raison** : La frame OutRun simule un cockpit vue de dos, le plateau doit s'inscrire dans la "route" visible sous le capot.
- **Effet** : Grille commence à y≈217 px (vs ≈122 px pour les autres). Cet écart est voulu.

---

## 6. Risques

- **Lisibilité sur fonds clairs** : Sur un fond très clair (non présent actuellement), les capsules à 84–90% d'opacité resteraient lisibles grâce à leur fond sombre (`0x060212`). Aucun fond actuel n'est assez clair pour poser problème.
- **Castle** : Le fond Castle est sombre, les capsules violettes contrastent bien.
- **OutRun** : Le coucher de soleil rose/magenta est lumineux mais les capsules roses restent visibles grâce à leur fond opaque.
- **Régression potentielle** : Si un futur univers a un fond très sombre identique à la couleur capsule, augmenter légèrement l'opacité capsule (0.90 → 0.96) ou ajouter un ombre portée fine.
