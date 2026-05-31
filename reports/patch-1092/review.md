# Review

## Objectif

Faire un audit complet du rendu visuel de l'application avant corrections.

Audit uniquement : aucune modification du code, des assets, du gameplay, des mécaniques, du HUD ou des icônes.

---

## Résultat

**3 problèmes P0** (visuels cassés / illisibles) :
1. **Kombat normal** — Le pickup `finish_token.png` est invisible sur le fond rouge sang du board. Le joueur ne peut pas voir ce qu'il doit collecter.
2. **Kombat boss** — Le board est quasi-entièrement noir. Toutes les entités (boss, hazards) sont indiscernables.
3. **Shinobi boss** — La capture est entièrement noire : possible échec de chargement du background ou timing insuffisant. À investiguer en priorité.

**7 problèmes P1** (rendu faible mais jouable) :
- `pickup_secondary.png` 32×32 dans tous les univers → flou à l'upscale (LINEAR filter)
- Shuriken shinobi faible contraste sur fond sombre
- Obstacles castle SVG quasi-invisibles en état ghost
- Fighter boss trop petit et même teinte que le fond
- Streets boss perdu dans la foule dense
- Sprites boss sonic flous (1254px → 50px, downscale ×24)
- `antialias:true` + `LinearFilter` global — tout le pixel art est lissé

**5 problèmes P2** (polish) : snake trop petit, HUD Paperboy tronqué, board castle boss surchargé, worldmap légèrement doux, style-mismatch fond AI-art vs sprites pixel.

**Meilleurs univers** : OutRun (voitures pixel art, retrowave thématique ✅), Paperboy (fond lumineux, obstacles lisibles ✅).  
**Univers en danger** : Kombat (P0 × 2), Shinobi (P0 + P1).

---

## Fichiers modifiés

- `reports/patch-1092/review.md` ← ce fichier
- `reports/patch-1092/docs/full-visual-rendering-audit.md`
- `reports/patch-1092/docs/full-visual-quality-audit.md`
- `reports/patch-1092/logs/rendering-config-audit.txt`
- `reports/patch-1092/logs/asset-quality-inventory.csv`
- `reports/patch-1092/logs/visual-issues.csv`
- `reports/patch-1092/logs/visual-audit-observations.csv`
- `reports/patch-1092/logs/asset-rendering-notes.txt`
- `reports/patch-1092/screenshots/` — 20+ captures plein écran
- `reports/patch-1092/screenshots/crops/` — 40+ crops ciblés

---

## Tests / vérifications

```
npm run check
```

**Résultat** : ✅ OK — 0 erreur TypeScript, 60 modules transformés.  
Warning attendu : `chunk > 500 kB` (Rollup) — non bloquant.

---

## Captures

### Écrans système
| Capture | Statut |
|---|---|
| `title_screen.png` | ✅ |
| `worldmap.png` | ✅ |
| `level_intro_castle.png` | ✅ |
| `clear_screen.png` | ✅ |
| `gameover_screen.png` | ✅ |

### Gameplay normal (plein écran)
| Capture | Statut |
|---|---|
| `castle_gameplay.png` | ✅ |
| `sonic_gameplay.png` | ✅ |
| `streets_gameplay.png` | ✅ |
| `fighter_gameplay.png` | ✅ |
| `outrun_gameplay.png` | ✅ |
| `shinobi_gameplay.png` | ✅ |
| `kombat_gameplay.png` | ✅ |
| `paperboy_gameplay.png` | ✅ |

### Boss (plein écran)
| Capture | Statut |
|---|---|
| `castle_boss.png` | ✅ |
| `sonic_boss.png` | ✅ |
| `streets_boss.png` | ✅ |
| `fighter_boss.png` | ✅ |
| `outrun_boss.png` | ✅ |
| `shinobi_boss.png` | ⚠️ Capture noire — à investiguer |
| `kombat_boss.png` | ⚠️ Board quasi-noir |
| `paperboy_boss.png` | ✅ |

### Crops ciblés (dossier `crops/`)
- HUD crops × 8 univers
- Grid crops × 8 univers  
- Pickup detail crops × 8 univers
- Boss grid crops × 6 boss
- Snake detail crops × 8 univers

---

## Documents

- `reports/patch-1092/docs/full-visual-rendering-audit.md` — livrable canonique demandé
- `reports/patch-1092/docs/full-visual-quality-audit.md` — audit complet avec tableaux, VQA-001 à VQA-014
- `reports/patch-1092/logs/rendering-config-audit.txt` — config Phaser/CSS/DPR/scaling/filtering
- `reports/patch-1092/logs/asset-quality-inventory.csv` — inventaire représentatif des assets critiques
- `reports/patch-1092/logs/visual-issues.csv` — problèmes/priorités/patchs recommandés
- `reports/patch-1092/logs/visual-audit-observations.csv` — 15 observations CSV
- `reports/patch-1092/logs/asset-rendering-notes.txt` — notes sur filtres Phaser, tailles d'assets, calculs de scaling

---

## Limites / risques

- Audit réalisé en headless Chromium (WSL) — le rendu Android réel peut différer légèrement (GPU, DPR réel, memory pressure)
- Le snake bouge en jeu : certains crops initiaux ont capturé des écrans de GameOver au lieu du gameplay (corrigé par recrop PIL depuis screenshots full)
- La capture `shinobi_boss.png` est entièrement noire — l'investigation réelle de ce bug nécessite un patch séparé
- Aucun test en landscape, aucun test à DPR=1 (vieux Android)
- Scènes non testées en direct : LevelIntro des 7 autres univers, animations/transitions

---

## Liens GitHub

- Commit : *(à compléter après push)*
- PR : *(non applicable — audit only)*
