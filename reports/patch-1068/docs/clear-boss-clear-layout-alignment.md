# PATCH 1068 — Clear and Boss Clear Layout Alignment

## Problème observé (QA mobile)

Sur mobile portrait (360×640 et similaires), l'écran de victoire (Clear/Boss Vaincu) présentait un **texte d'annonce mal positionné** pour les niveaux boss hors-Castle (ex. `sonic_boss`, `shinobi_boss`, etc.).

Deux anomalies constatées :

1. **Overlap visuel** — La `universe name` était affichée centrée à `H × subtitleY` (0.36), et le badge BOSS VAINCU ! démarrait à `H × subtitleY + 8px` (rect) et `H × subtitleY + 19px` (texte). Sur 640px : universe name à 230px, badge rect à 238px. Gap de 2–8px entre les deux éléments ; visuellement écrasés.

2. **Badge non centré sur son axe Y déclaré** — La rect (`fillRoundedRect`) démarrait à `subtitleY + 8` au lieu d'être centrée sur `subtitleY`, cassant l'alignement avec les autres éléments du layout.

## Cause racine

Dans `src/scenes/ClearScene.ts`, le bloc `universe name` utilisait la condition `if (universe && !isCastle)`, s'activant donc pour **tous** les niveaux non-Castle, y compris les boss. Or le bloc `boss badge` ciblait exactement le même slot Y (`H * L.subtitleY`), avec un offset pixel non responsive. Les deux éléments coexistaient et se chevauchaient.

## Changements appliqués

**Fichier modifié : `src/scenes/ClearScene.ts`**

### 1. Universe name — exclusion des boss clears

Condition modifiée : `if (universe && !isCastle && level?.type !== 'boss')`

Pour un boss non-Castle, la `universe name` n'est plus affichée. Le badge seul occupe le slot `subtitleY`.

### 2. Badge centré sur subtitleY

Rect rect de `H * L.subtitleY + 8` → `H * L.subtitleY - 11` (centre sur l'axe).
Texte de `H * L.subtitleY + 19` → `H * L.subtitleY` (origine 0.5 centrée).

## Layouts couverts

| Écran / Cas | Avant | Après |
|---|---|---|
| Non-Castle boss (mobile portrait) | Universe name + badge overlap | Badge seul, centré |
| Non-Castle boss (desktop) | Overlap moins visible mais présent | Badge seul, centré |
| Non-Castle normal (tous) | Universe name seul — inchangé | Inchangé |
| Castle normal | SubTitle inchangé | Inchangé |
| Castle boss | SubTitle inchangé | Inchangé |

## Captures

Captures runtime non disponibles en environnement CI/WSL headless. À compléter avec un device si besoin.

## Limites

- Captures screenshots à générer depuis un device ou émulateur
- RESULT_SCREEN_LAYOUT non modifié (ratios Y conservés)
- Aucune modification gameplay, progression, audio, assets
