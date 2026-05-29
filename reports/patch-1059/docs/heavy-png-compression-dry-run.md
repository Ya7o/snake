# Heavy PNG Compression Dry Run

PATCH 1059 — 2026-05-29

## Objectif

Estimer les gains de compression réels sur 10 gros PNG candidats (P0 et top P1),
sans modifier les assets originaux dans public/assets/.

Les résultats serviront de base de décision pour PATCH 1061.

## Méthode

**Outil principal** : Pillow 12.2.0 (Python 3.14.4, WSL Ubuntu)

Deux passes sur chaque fichier :

1. **PNG optimisé** — optimize=True, compress_level=9 (lossless, zlib deflate niveau 9)
2. **WebP lossy** — quality=85, method=4 (lossy, facteur qualité standard)

Les copies compressées ont été générées dans /tmp/snake-compression-test/ (non committées sauf un mini-échantillon WebP).

Un échantillon WebP est conservé dans eports/patch-1059/samples/shinobi_boss_system_bg_sample.webp (261 KB vs 2503 KB original).

**Candidats sélectionnés** : 5 fichiers P0 (≥ 2.5 MB) + 5 fichiers P1 (top par taille, 2.4–2.5 MB)
Source : eports/patch-1052/logs/top-heavy-png.txt

## Résultats

| Fichier | Priorité | Original | PNG optimisé | WebP q85 | Gain PNG | Gain WebP | Risque |
|---|:---:|---:|---:|---:|---:|---:|---|
| universes/outrun/board_preview.png | P0 | 2952 KB | 2151 KB | 253 KB | +27.1% | +91.4% | Low (alpha) |
| ui/paperboy/paperboy_boss_system_bg.png | P0 | 2847 KB | 2788 KB | 360 KB | +2.1% | +87.4% | Low |
| ui/worldmap/world_map_minimap_16_9.png | P0 | 2827 KB | 2788 KB | 417 KB | +1.4% | +85.2% | Low |
| map/world_map.png | P0 | 2807 KB | 2768 KB | 433 KB | +1.4% | +84.6% | Low |
| ui/outrun/outrun_boss_system_bg.png | P0 | 2605 KB | 2546 KB | 320 KB | +2.2% | +87.7% | Low |
| ui/fighter/fighter_boss_system_bg.png | P1 | 2535 KB | 2483 KB | 271 KB | +2.1% | +89.3% | Low |
| ui/shinobi/shinobi_boss_system_bg.png | P1 | 2503 KB | 2441 KB | 262 KB | +2.5% | +89.5% | Low |
| ui/streets/streets_clear_bg.png | P1 | 2478 KB | 2422 KB | 300 KB | +2.3% | +87.9% | Low |
| ui/streets/streets_system_bg.png | P1 | 2477 KB | 2432 KB | 262 KB | +1.8% | +89.4% | Low |
| level-intros/paperboy/intro.png | P1 | 2459 KB | 2409 KB | 322 KB | +2.0% | +86.9% | Low |
| **TOTAL (10 fichiers)** | | **25.9 MB** | **24.6 MB** | **3.1 MB** | **+4.8%** | **+88.0%** | |

### Observations

- **PNG lossless** : gain marginal (~1.4–2.5%) pour 9 fichiers sur 10 — les fichiers étaient déjà bien compressés en PNG.
  - Exception : oard_preview.png — +27.1%, stocké avec une compression PNG sous-optimale.
- **WebP lossy q85** : gain massif (~84.6–91.4%) sur tous les fichiers — les PNG stockent des données photo-réalistes qui bénéficient énormément de la compression lossy.
- **Alpha** : oard_preview.png est le seul fichier avec canal alpha parmi les 10 testés. WebP supporte l'alpha nativement — pas de risque.
- **Dimensions** : la majorité des fichiers est en 941×1672 (portrait mobile). Aucun redimensionnement n'est nécessaire.

### Extrapolation sur le dataset complet (PATCH 1052 : 137.5 MB)

En appliquant un taux conservateur de 80% de gain WebP (vs 88% sur les P0/P1) :

| Scope | PNG total | WebP estimé | Gain |
|---|---:|---:|---:|
| 5 fichiers P0 | 14.0 MB | ~1.8 MB | ~87% |
| Top P1 (60 fichiers) | ~118 MB | ~24 MB | ~80% |
| P2 + others (31 fichiers) | ~5.3 MB | ~2.1 MB | ~60% |
| **Total estimé** | **137.5 MB** | **~28 MB** | **~80%** |

Gain potentiel total : **~109 MB** (de 137.5 MB vers ~28 MB).

## Recommandation

| Type de fichier | Recommandation |
|---|---|
| Backgrounds UI (boss_system_bg, clear_bg, system_bg) | **Convertir en WebP** (quality 85) |
| Level intros (intro.png) | **Convertir en WebP** (quality 85) |
| board_preview (avec alpha) | **Convertir en WebP** (quality 85, alpha natif) |
| world_map, minimap | **Convertir en WebP** (quality 90 si détail requis) |
| Sprites avec transparence exacte | **PNG oxipng** (lossless) ou **WebP lossless** |
| Audio / non-PNG | Ne pas toucher |

**Outil recommandé pour PATCH 1061** :
- cwebp -q 85 (apt : package webp) ou Pillow si cwebp indisponible
- oxipng --opt 2 pour les fichiers avec alpha critique (board_preview)
- Pillow WebP quality=85 validé par ce dry run — utilisable en fallback

**Vérification visuelle** recommandée avant remplacement en production :
- Comparer les échantillons WebP générés avec les originaux (eye-test)
- Prioriser board_preview (alpha) et world_map (détail cartographique)

## Verdict

- **PATCH compression recommandé : OUI**
- **Stratégie** : conversion WebP lossy q85 sur tous les P0 et P1 backgrounds/intros
- **Gain estimé** : ~80–88% sur les 65 fichiers P0+P1 les plus lourds (~120+ MB économisés sur 137.5 MB)
- **Risques** :
  - Faible pour backgrounds et intros (pas de pixel-perfect requis)
  - Moyen pour board_preview (alpha) — à tester visuellement
  - Nécessite mise à jour du loader de ressources si le code charge .png par chemin explicite
  - Compatibilité WebP : tous les navigateurs modernes supportent WebP (Chrome, Safari 14+, Firefox 65+)

## PATCH suivant possible

**PATCH 1061 — Compress Selected Heavy PNG Candidates**

Scope suggéré :
- 5 fichiers P0 (confirmés dans ce dry run)
- Top 20 P1 backgrounds et level intros
- Outil : cwebp -q 85 (ou Pillow fallback)
- Vérification visuelle requise sur board_preview (alpha)
- Mise à jour loader si chemins codés en dur
