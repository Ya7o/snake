# 987 — Castle Background Presentation Audit

## Status

Audit complet. Prêt pour implémentation patch 988.

---

## Validation code actuelle (2026-05-22)

Fichiers inspectés :
- `src/render/HUDRenderer.ts`
- `src/render/GridRenderer.ts`
- `src/scenes/GameScene.ts`
- `src/ui/RuntimeUILayout.ts`
- `src/config/constants.ts`

### HUD actuel

```ts
// HUDRenderer.ts ligne 27
this.bg = scene.add.rectangle(w / 2, hudH / 2, w, hudH, 0x07030f, 1.0)
// Hauteur : GAMEPLAY_HUD.HEIGHT = 56px
// Pleine largeur, opaque 1.0 — confirme le diagnostic du ticket
```

Verdict : **barre top pleine largeur opaque** → à remplacer par capsule row en patch 988.

### Board actuel (Castle)

```ts
// GameScene.ts ligne 39-46
CASTLE_GRID_COLS = GRID_COLS - 4  // = 12
CASTLE_GRID_ROWS = GRID_ROWS + 2  // = 22
FRAME_GRID_WIDTH.castle = 0.74    // 74% écran width
FRAME_GRID_Y_BIAS.castle = 0.5

// Appel computeGridLayout : hudH=56, bottomH=24
```

Verdict : largeur 74% — sous la cible recommandée (82%). bottomH 24px insuffisant pour révéler la décoration basse.

---

## Critères d'acceptation — audit validés

### 1. Background presentation guidelines

- [x] Intro / stage card : zone protégée (ciel/lune, colonnes, chemin bas) ; zone safe (tiers inférieur centre, bas boutons) ; ≥ 55–65% visible.
- [x] Gameplay : zone protégée (colonnes latérales, décoration bas, éléments focaux) ; zone safe (région centrale board, HUD compact) ; ≥ 25–35% visible.
- [x] Game Over : ≥ 60% visible.
- [x] Stage Clear / Boss Clear : ≥ 58–68% visible.

### 2. Gameplay board — cible documentée

- [x] Board width cible : **82%** de la largeur écran.
- [x] Board height cible : **63%** de la hauteur écran.
- [x] Zone HUD : 10% en haut.
- [x] Gap HUD-board : 2%.
- [x] Bottom reveal : 18%.
- [x] Réduction cell size : 8–14%.
- [x] Implémentation sans ambiguïté possible (paramètres `computeGridLayout`).

### 3. HUD alternatives auditées

- [x] Option A — compact capsule row → **recommandé**
- [x] Option B — corner anchors → fallback acceptable
- [x] Option C — split HUD → risqué
- [x] Option D — bottom band → non recommandé pour Castle

### 4. Font / sprite audit

- [x] Display/Title : pixel bold, uppercase, 26–34px, 1–2px outline.
- [x] UI labels (HUD) : 14–18px.
- [x] Buttons : 18–22px.
- [x] Body/helper : 14–16px.
- [x] Snake sprite : lisible, attention au downsizing.
- [x] Pickup sprite : doit rester plus brillant que la grille.
- [x] Grid lines : réduire légèrement le contraste si cellules réduites.

---

## Règles visuelles Castle

1. Background first, UI second.
2. Overlays légers — pas de panels surdimensionnés opaques.
3. Le board est une fenêtre cadrée — il doit laisser la place au monde autour.
4. Hiérarchie : atmosphère → headline → action primaire → action secondaire → texte support.
5. Typographie à rôles séparés : titre ≠ HUD ≠ body ≠ bouton.
6. Le HUD Castle doit être réutilisable sur les 7 autres univers.

---

## Brief implémentation — patch 988

### Board

```
board width factor : 0.82   (était 0.74)
hudH               : 56px   (inchangé côté HUDRenderer, réduit visuellement par capsule)
bottomH            : ~18% de screenH  (était 24px fixe)
cell size reduction : -10% approximatif via le widthFactor seul
```

Paramètres `computeGridLayout` à passer dans `GameScene.create()` pour Castle :

```ts
computeGridLayout(width, height, cols, rows,
  GAMEPLAY_HUD.HEIGHT,  // 56 — zone réservée top
  Math.floor(height * 0.18),  // bottomH dynamique ~18%
  0.82,   // widthFactor (était 0.74)
  12,     // minCellSize
  0.35,   // verticalBias — légèrement vers le haut
)
```

### HUD Castle

Remplacer le Rectangle pleine largeur opaque par 3 capsules alignées :

```
[ CASTLE OF ILLUSION ] [ STAGE 1 ] [ MAGIE 0/10 ]
```

Styling :
- fond : deep purple / near-black `#0d0518`, alpha 0.88
- bordure : gold `#f6c45c`, subtle glow violet
- texte : pale gold `#f6c45c` / warm white `#e6d8ff`

Variante boss :

```
[ CASTLE BOSS ] [ HP 2/3 ] [ MAGIE 7/10 ]
```

### Panels résultat

- Réduire ou supprimer les Rectangle opaques surdimensionnés dans `ClearScene` et `GameOverScene`.
- Laisser le background respirer (objectif ≥ 60%).

---

## QA gate patch 988

| Écran | Critère pass |
|-------|-------------|
| Intro Castle | Background visible, UI ne couvre pas l'image |
| Gameplay Castle | Décor côtés et bas visible, board cadré, HUD = capsules |
| Game Over | Background ≥ 60%, max 2 boutons |
| Stage Clear | Image reward visible, pas de panel vide |

Fail conditions : barre top laide pleine largeur, board écrase l'image, fonts incohérentes, boutons/panels surdimensionnés.
