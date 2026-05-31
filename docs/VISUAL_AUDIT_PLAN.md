# VISUAL AUDIT — Snake Drive V4

> Date : 2026-05-31  
> Scope : audit complet du pipeline visuel — renderers, effets, filtres, couches, assets, scènes

---

## 1. Plan d'audit — 10 domaines

| # | Domaine | Quoi inspecter |
|---|---|---|
| A | **Moteur Phaser** | Config canvas, DPR, antialias, roundPixels |
| B | **Couches de profondeur** | GAMEPLAY_LAYERS, ordre de rendu, z-fighting |
| C | **Filtres texture** | LINEAR / NEAREST, cohérence, dead code |
| D | **Renderers gameplay** | Grid, Snake, Pickup, Obstacle, HUD |
| E | **Effets visuels (VFX)** | Halos, glows, tweens, flash, camera shake |
| F | **Assets images** | PNG sizes, downsampling ratio, marges transparentes |
| G | **SVG / OpenMoji** | Rasterisation, DPR, taille effective |
| H | **Backgrounds scènes** | Cover vs stretch, toutes scènes |
| I | **Blend modes** | Utilisation réelle vs setters non appelés |
| J | **Accumulation de code** | Dead code, couches dupliquées, effets cumulés |

---

## 2. Résultats par domaine

---

### A. Moteur Phaser (`src/main.ts`)

```ts
render: {
  antialias: true,       // → LINEAR filtering par défaut sur toutes les textures
  roundPixels: true,     // → positions Graphics arrondies au pixel → évite le blur sub-pixel
  powerPreference: 'high-performance',
}
scale: { mode: Phaser.Scale.RESIZE, autoCenter: CENTER_BOTH }
// Pas de resolution, pas de zoom, pas de pixelRatio
```

**Constats :**

| Point | État | Problème |
|---|---|---|
| antialias: true | ✅ | LINEAR filter par défaut |
| roundPixels: true | ✅ | Évite blur sub-pixel sur Graphics |
| Pas de `resolution` | ⚠️ | Canvas Phaser à 1× CSS pixel |
| Texte DPR-aware | ✅ | `resolution: Math.min(DPR,2)` sur chaque Text |
| Canvas non DPR | ⚠️ | Sur mobile 2× DPR, le canvas est upscalé par le browser → légère douceur sur tout le visuel |
| SVG DPR-aware | ✅ (post-patch) | `64 * min(DPR, 2)` → 128px sur 2× |

**Recommandation** : Ajouter `zoom: 1` + `resolution: Math.min(window.devicePixelRatio || 1, 2)` dans le config Phaser pour que les textures soient à la résolution native. Mais attention : doublement de la charge GPU, à tester.

---

### B. Couches de profondeur (`src/ui/RuntimeUILayout.ts`)

```
BACKGROUND_FILL   0   — rectangle couleur univers
BACKGROUND_IMAGE  1   — image PNG background univers
(overlay dark)    2   — rectangle noir α 0.14
BOARD_PANEL      10   — cadre Castle (CastleRuntimeBoardPanel)
GRID             30   — GridRenderer (background + lignes + bordure)
frame_tiles       1   — ⚠️ BUG (voir ci-dessous)
GAMEPLAY_OBJECTS 40   — ObstacleRenderer.gfx
obstacle images  41   — ObstacleRenderer images (depth+1)
deliveryGlow     39   — Paperboy delivery glow (GAMEPLAY_OBJECTS−1)
castlePickupGlow 41   — Castle pickup glow extra (GAMEPLAY_OBJECTS+1)
pickup gfx       42   — PickupRenderer.gfx (GAMEPLAY_OBJECTS+2)
pickup images    42   — PickupRenderer images (même depth)
snake            44   — SnakeRenderer (GAMEPLAY_OBJECTS+4)
GAMEPLAY_FX      70   — ⚠️ JAMAIS UTILISÉ
HUD_STRIP        80   — fond HUD (rectangle invisible, HUD.gfx à 81)
HUD_TEXT         90   — textes HUD
SCREEN_FX       110   — flashScreen
DEBUG           120   — overlay debug
```

**Bugs identifiés :**

1. **Frame tiles à depth = 1 (hardcodé)** dans `GridRenderer.setFrameTileKey` :
   ```ts
   const img = scene.add.image(px, py, key).setDisplaySize(tSize, tSize).setAlpha(0.65).setDepth(1);
   ```
   Depth 1 = même niveau que `BACKGROUND_IMAGE`. Les frame tiles se retrouvent SOUS la grille (depth 30) mais au même niveau que le background PNG → comportement imprévisible selon l'ordre d'ajout, et mélangées avec le fond.
   
   **Fix** : changer à `GAMEPLAY_LAYERS.BOARD_PANEL` (10) ou `GAMEPLAY_LAYERS.GRID - 1` (29).

2. **GAMEPLAY_FX = 70 inutilisé** : couche réservée mais aucun renderer ne l'utilise.

3. **castlePickupGlow (41) et PickupRenderer.gfx (42)** : l'ordre fait que le glow Castle (41) est sous les halos du PickupRenderer (42) → accumulation de deux couches de halos superposées.

---

### C. Filtres texture

| Asset / Chemin | Filter | Où appliqué |
|---|---|---|
| Toutes textures par défaut | LINEAR | Phaser `antialias: true` |
| Pickup images | LINEAR explicite | `PickupRenderer.fitImageInCell` via `filteredKeys` |
| Obstacle / Boss images | LINEAR explicite | `ObstacleRenderer.fitImageInCell` via `filteredKeys` |
| WorldMap | LINEAR explicite | `WorldMapScene` |
| Backgrounds (all scenes) | LINEAR implicite | Phaser défaut — pas de setter explicite |
| Backgrounds TitleScene | LINEAR implicite | idem |
| `setCrispPixelArt(scene, key)` | NEAREST opt-in | ⚠️ **JAMAIS APPELÉE** — dead code |

**Constats :**
- LINEAR partout → cohérent pour des PNGs et SVGs downscalés
- `setCrispPixelArt` inutilisée : si aucun asset n'est intentionnellement pixel art, supprimer ou documenter
- Les backgrounds de scènes résultantes (GameOver, Clear, LevelIntro) n'ont pas de filter explicite mais bénéficient du défaut LINEAR

---

### D. Renderers gameplay

#### D1. GridRenderer
- Dessine 1× par `create()` (dirty flag) — pas de redraw en update → ✅ efficace
- `cellWidth ≠ cellHeight` pour non-Castle (cells rectangulaires 1.0 × 1.3) : conséquence du layout Castle comme référence
- Lignes grille : alpha 0.2 → très subtiles (voulu)
- `setFrameTileKey` : depth bug (voir B1 ci-dessus)

#### D2. SnakeRenderer
- 100% procédural (Graphics) — pas d'image → pas de problème de filtre
- Gradient queue-à-tête via `alpha = 0.35 + 0.55 * t` → bon effet de profondeur
- Connecteurs entre segments via `fillRect` → ✅

#### D3. PickupRenderer
**Couches pour une pickup avec image :**
```
1. PickupRenderer.gfx :
   - outer bloom (fillCircle cs*0.64, α 0.10–0.15)
   - inner glow  (fillCircle cs*0.45, α 0.22–0.30)
   - white ring  (strokeCircle cs*0.46, α 0.28–0.36)
2. img (fitImageInCell, maxSize = cs * profile.maxSizeScale)
   - alpha 0.88 + 0.12 * pulse (animation)
```
**Pour Castle spécifiquement, s'ajoute :**
```
3. castlePickupGlow (GameScene) :
   - outer bloom (fillCircle cs*0.98, α 0.20–0.28)   ← plus grand que #1
   - inner glow  (fillCircle cs*0.68, α 0.14–0.19)   ← s'ajoute à #1
   - white ring  (strokeCircle cs*0.52, α 0.32–0.40) ← s'ajoute à #1
```
**⚠️ DOUBLE HALO pour Castle** : les halos sont dessinés DEUX FOIS (PickupRenderer + castlePickupGlow). Résultat visuellement acceptable mais inutilement chargé.

#### D4. ObstacleRenderer

**3 paths de rendu, par priorité :**

1. **entityTexture path** (Castle OpenMoji, Fighter fist, Paperboy mailbox) :
   - Pas de glow background
   - fitImageInCell(cs × 3.0) ← post-patch
   - ✅ ratio preservé (post-patch)

2. **bossTexture path** (boss runtime PNG) :
   - Glow telegraph (drawBossTelegraph) + image fitImageInCell
   - Échelle 2.2–2.5× cell

3. **obstacleImage path** (obstacle runtime PNG) :
   - Glow circle (cs × 0.43) + image fitImageInCell
   - ⚠️ Glow circle très petit (0.86 cells diameter) vs image (2.2–3.0× cell) → le glow ne sert visuellement qu'à indiquer une présence, l'image dépasse largement

4. **Procédural fallback** : formes géométriques par univers → ✅

#### D5. HUDRenderer
- 3 capsules (universe | rule | score)
- Dessiné 1× dans le constructeur → pas de redraw loop — ✅ efficace
- Mise à jour textes uniquement si changement (dirty check) → ✅

---

### E. Effets visuels (VFX)

| Effet | Trigger | Fréquence | Notes |
|---|---|---|---|
| Pickup halo pulse | every frame | 60 fps | `sin(time/400)` |
| Castle pickup glow | every frame | 60 fps | `sin(time/360)` — en double avec PickupRenderer halo |
| Paperboy target glow | every frame | 60 fps | `sin(time/350)` |
| TurboZone pulse | every frame | 60 fps | `sin(time/120)` |
| Camera shake | game over / boss hit | ponctuel | ✅ |
| flashScreen | boss hit / clear / game over | ponctuel | tween alpha 0→0 sur rectangle |
| Camera fadeIn / fadeOut | transition scène | ponctuel | ✅ |
| Floating particles (intro) | LevelIntroScene | décoration | tweens loop |

**Constats :**
- Plusieurs `sin(time/X)` calculés indépendamment → légères désynchronisations entre halos → visuellement acceptable
- `castlePickupGlow` + `PickupRenderer halo` = 2 couches de halos animés sur la même pickup Castle → surcharge visuelle

---

### F. Assets images — problèmes

#### F1. PNGs runtime 1254×1254

Ratio downsampling : 1254px → ~55px affichés (2.2× cell à cs=25) = ratio 23×

| Asset | Fill visible | Problème visuel |
|---|---|---|
| `outrun/obstacle_car.png` | 91%w × **49%h** | Voiture très basse dans son cadre carré |
| `outrun/boss_idle.png` | 97%w × **50%h** | Idem |
| `streets/boss_idle.png` | **42%w** × 93%h | Silhouette étroite |
| `kombat/obstacle_fatal_zone.png` | 235×256 (non-carré) | ✅ ratio < 1, fitImageInCell gère |
| Autres | 75–99% | Acceptables |

**Problème principal** : le downsampling 23× sans mipmapping produit un léger flou. Ce n'est pas corrigeable sans changer les assets source (générer des versions 256×256 ou 128×128).

#### F2. PNGs secondaires 32×32

`pickup_secondary.png` de tous les univers = 32×32. Affiché à cs*2.5 ≈ 55px → UPSCALING × 1.7. Avec LINEAR filter → doux/flou par nature. Acceptable visuellement car ce sont des pickups secondaires.

#### F3. Sonic pickup_ring.png : 450×450

Cas intermédiaire — downsampling 8× vers 55px. Qualité acceptable.

---

### G. SVG / OpenMoji

| Asset | ViewBox | Rasterisé à | Affiché à (cs=25) |
|---|---|---|---|
| Tous OpenMoji | 72×72 | 64px (1×) ou 128px (2×) | castle pickup: 2.5×25=62px, entity: 3.0×25=75px |

**Post-patch** : DPR-aware ✅  
**Contenu fill** : OpenMoji ~ 78% fill dans le viewBox (padding ~11%)  
**Taille visible** : 62px × 0.78 ≈ 48px (pickup) — visible et confortable

---

### H. Backgrounds scènes

| Scène | Méthode | Comportement |
|---|---|---|
| GameScene | `setScale(Math.max(W/w, H/h))` | ✅ cover, centré, crop OK |
| LevelIntroScene | `setScale(Math.max(W/w, H/h))` | ✅ idem |
| ClearScene | `setScale(Math.max(W/w, H/h))` | ✅ idem |
| GameOverScene | `setScale(Math.max(W/w, H/h))` | ✅ idem |
| **TitleScene** | `setDisplaySize(W, H)` | **⚠️ BUG STRETCH** |
| WorldMapScene | `setScale(coverScale)` calculé | ✅ |

**Bug TitleScene** : `setDisplaySize(W, H)` force l'image exactement à la taille canvas sans préserver le ratio. L'image `title_hub_bg.png` est 941×1672 (ratio 0.563). Sur un écran 390×844 (ratio 0.462), l'image est compressée horizontalement.

**Fix** :
```ts
// Remplacer :
.setDisplaySize(W, H)
// Par :
.setScale(Math.max(W / bg.width, H / bg.height))
```

---

### I. Blend modes

**Setters disponibles mais jamais appelés depuis GameScene :**
- `PickupRenderer.setImageBlendMode(mode)` 
- `ObstacleRenderer.setBossBlendMode(mode)`
- `ObstacleRenderer.setObstacleBlendMode(mode)`

**État actuel** : tout à `Phaser.BlendModes.NORMAL`  
**Diagnostic** : code prévu pour des effets ADD/SCREEN sur des univers spécifiques (ex. Sonic rings en ADD) mais jamais activé.  
**Recommandation** : soit activer (ex. `ADD` pour Sonic rings, `SCREEN` pour Kombat), soit documenter comme réservé.

---

### J. Accumulation de code — dead code & redondances

| Élément | Fichier | État | Action recommandée |
|---|---|---|---|
| `setCrispPixelArt()` | `VfxUtils.ts` | ⚠️ Jamais appelée | Supprimer ou utiliser sur des assets pixel art |
| `castlePickupGlow` | `GameScene.ts` | ⚠️ Double du halo PickupRenderer | Supprimer ou activer uniquement si halo PickupRenderer désactivé pour Castle |
| `GAMEPLAY_FX = 70` | `RuntimeUILayout.ts` | ⚠️ Jamais utilisé | Réserver pour future utilisation ou supprimer |
| `setImageBlendMode` | `PickupRenderer.ts` | ⚠️ Jamais appelé | Activer ou documenter |
| `setBossBlendMode` | `ObstacleRenderer.ts` | ⚠️ Jamais appelé | Activer ou documenter |
| `setObstacleBlendMode` | `ObstacleRenderer.ts` | ⚠️ Jamais appelé | Activer ou documenter |
| Frame tiles depth=1 | `GridRenderer.ts` | 🐛 Bug depth | Fixer à BOARD_PANEL (10) ou GRID-1 (29) |
| Pickup glow double Castle | `GameScene.ts` | ⚠️ Redondance | Voir ci-dessous |

---

## 3. Résumé des bugs prioritaires

### 🔴 CRITIQUE (rendu visible cassé)

| # | Problème | Fichier | Fix |
|---|---|---|---|
| 1 | TitleScene background STRETCH | `TitleScene.ts:49` | `setScale(Math.max(...))` |
| 2 | Frame tiles à depth=1 (sous la grille) | `GridRenderer.ts:114` | `setDepth(GAMEPLAY_LAYERS.BOARD_PANEL)` |

### 🟡 QUALITÉ (visuel dégradé mais pas cassé)

| # | Problème | Fichier | Fix |
|---|---|---|---|
| 3 | Double halo Castle pickup | `GameScene.ts:199` | Supprimer `castlePickupGlow` (redondant avec PickupRenderer halo) |
| 4 | Canvas 1× sur mobile 2× DPR | `main.ts` | Tester `zoom: devicePixelRatio` |
| 5 | PNG 1254px → 40px sans mipmap | assets source | Générer des versions 256×256 |
| 6 | Outrun car 49% hauteur utile | asset source | Rogner ou remplacer |

### 🔵 CODE (maintenance)

| # | Problème | Fichier | Fix |
|---|---|---|---|
| 7 | `setCrispPixelArt` jamais appelée | `VfxUtils.ts` | Supprimer ou utiliser |
| 8 | Blend modes setters jamais appelés | `GameScene.ts` | Activer ou doc |
| 9 | `GAMEPLAY_FX` inutilisé | `RuntimeUILayout.ts` | Réserver ou supprimer |

---

## 4. Architecture visuelle résumée

```
┌─ depth 0   ─ BACKGROUND_FILL (rectangle couleur palette)
├─ depth 1   ─ BACKGROUND_IMAGE (PNG univers, cover scale)
│              + overlay noir α 0.14
├─ depth 1   ─ ⚠️ frame_tiles (BUG: même depth que BG)
├─ depth 10  ─ BOARD_PANEL (cadre Castle uniquement)
├─ depth 30  ─ GRID (background grille + lignes + bordure)
├─ depth 39  ─ deliveryTargetGlow (Paperboy)
├─ depth 40  ─ ObstacleRenderer.gfx (halos procéduraux)
│           ↳ depth 41 — obstacle/boss images
├─ depth 41  ─ castlePickupGlow (⚠️ duplique le halo PickupRenderer)
├─ depth 42  ─ PickupRenderer.gfx (halo pickup)
│           ↳ depth 42 — pickup images
├─ depth 44  ─ SnakeRenderer (100% procédural)
├─ depth 70  ─ GAMEPLAY_FX (⚠️ non utilisé)
├─ depth 81  ─ HUDRenderer.gfx (capsules)
├─ depth 90  ─ HUD texts
└─ depth 110 ─ flashScreen / SCREEN_FX
```

---

## 5. Actions planifiées

Les corrections bugs (rouge/jaune) sont documentées ici.  
Elles seront appliquées dans des patches séparés ou groupées selon la priorité.

| Action | Priorité | Complexité | Impact visuel |
|---|---|---|---|
| Fix TitleScene stretch | 🔴 | faible | Fond titre non déformé |
| Fix frame tiles depth | 🔴 | faible | Décorations grille visibles |
| Supprimer castlePickupGlow | 🟡 | faible | Halo Castle moins chargé |
| Activer blend modes Sonic | 🟡 | moyen | Rings plus lumineux |
| Assets PNG 256×256 | 🟡 | élevé | Icônes plus nettes |
| Canvas DPR (test) | 🟡 | moyen | Tout plus net mobile |
