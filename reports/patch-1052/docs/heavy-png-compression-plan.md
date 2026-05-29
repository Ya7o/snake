# Heavy PNG Compression Plan — PATCH 1052

## Résumé exécutif

| Métrique | Valeur |
|---|---|
| Fichiers PNG | 152 |
| Taille totale | 137.5 MB |
| Dossier le plus lourd | ui/ (84 MB) |
| Candidats P0 (≥ 2.5 MB) | 5 fichiers — 13.7 MB |
| Candidats P1 (1.5–2.5 MB) | 60 fichiers — 118.4 MB |
| Candidats P2 (50 KB–1.5 MB) | 31 fichiers — 5.3 MB |
| No-touch | 56 fichiers |
| **Gain estimé** | **~63 MB (46%)** |
| **Taille finale estimée** | **~74 MB** |

---

## Distribution par dossier

| Dossier | Taille | % total |
|---|---|---|
| ui | 84.0 MB | 61.1% |
| level-intros | 18.0 MB | 13.1% |
| universes | 17.4 MB | 12.7% |
| frames | 13.5 MB | 9.8% |
| map | 2.7 MB | 2.0% |
| runtime | 1.8 MB | 1.3% |

---

## Top 20 candidats P0 (≥ 2.5 MB — action prioritaire)

| # | Fichier | Taille MB | Dimensions | Catégorie | Recommandation |
|---|---|---|---|---|---|
| 1 | `universes/outrun/board_preview.png` | 2.883 | 1024x1536 | board_preview | WebP conversion (lossy 85%) — save 60-70% |
| 2 | `ui/paperboy/paperboy_boss_system_bg.png` | 2.780 | 941x1672 | background_ui | WebP conversion (lossy 85%) — save 60-70% |
| 3 | `ui/worldmap/world_map_minimap_16_9.png` | 2.761 | 1672x941 | worldmap_ui | WebP conversion (lossy 85%) — save 60-70% |
| 4 | `map/world_map.png` | 2.741 | 1448x1086 | worldmap_bg | WebP conversion (lossy 85%) — save 60-70% |
| 5 | `ui/outrun/outrun_boss_system_bg.png` | 2.544 | 941x1672 | background_ui | WebP conversion (lossy 85%) — save 60-70% |

---

## Stratégie recommandée

### Phase 1 — WebP conversion des backgrounds (P0)

**Cibles :** tous les `*_bg.png`, `*_system_bg.png`, `*_clear_bg.png`, `*_game_over_bg.png`,
`board_preview.png`, `intro.png`, `frame.png`, `world_map*.png`.

**Outil recommandé :** `cwebp -q 85` (libwebp)

```bash
# Exemple — conversion d'un background
cwebp -q 85 public/assets/ui/paperboy/paperboy_boss_system_bg.png \
            -o public/assets/ui/paperboy/paperboy_boss_system_bg.webp
```

**Gain estimé P0 :** ~65% par fichier → économie de ~9 MB

**Code Phaser requis :** remplacer `.png` par `.webp` dans les clés de chargement
(ou utiliser `this.load.image` avec `.webp` — Phaser supporte WebP nativement).

**Fallback PNG :** conserver le PNG original en `*.png.bak` le temps de valider.

### Phase 2 — oxipng lossless sur les frames et sprites (P1)

**Cibles :** `frames/*/frame.png`, `ui/*/gameplay_bg.png`

```bash
oxipng --opt 4 --strip all public/assets/frames/**/*.png
```

**Gain estimé P1 :** ~40-50% → économie de ~53 MB

### Phase 3 — oxipng lossless sprites runtime (P2)

**Cibles :** `runtime/universes/**/*.png` — sprites avec transparence alpha.

**Gain estimé P2 :** ~15% → économie de ~1 MB

### No-touch

- `universes/*/hud_panel.png` (< 400 B) — négligeable
- `universes/*/boss.png`, `pickup_01.png` etc. (< 500 B) — minuscules, qualité critique
- `openmoji/` — taille raisonnable, qualité emoji sensible

---

## Risques

| Risque | Mitigation |
|---|---|
| WebP non supporté navigateur ancien | Phaser supporte WebP — vérifier cible mobile |
| Dégradation visuelle lossy | Valider visuellement à 85% avant commit |
| Phaser cache texture key collision | Conserver même `key` dans `this.load.image` |
| Regression alpha sur sprites | Phase 3 en lossless uniquement — pas de WebP |
| Frames plein écran banding | Tester sur mobile réel (compression artifacts) |

---

## Plan d'exécution (patches suivants)

| Patch | Scope | Outil | Gain attendu |
|---|---|---|---|
| PATCH 1053 | ui/ backgrounds P0 → WebP | cwebp -q 85 | ~55 MB |
| PATCH 1054 | level-intros/ + frames/ → WebP | cwebp -q 85 | ~22 MB |
| PATCH 1055 | universes/ board_preview → WebP | cwebp -q 85 | ~10 MB |
| PATCH 1056 | runtime/ sprites → oxipng | oxipng --opt 4 | ~0.3 MB |

> Gain total estimé après les 4 patches : **~87 MB** (~63% de réduction).
> Taille cible : **~50 MB** (vs 137 MB actuels).