# PATCH 1069 — Runtime Icon Size Harmonization Audit
## Review

**Date** : 2026-05-30
**Status** : AUDIT COMPLET — aucune modification de code
**Scope** : Tous univers (castle, sonic, streets, fighter, outrun, shinobi, kombat, paperboy)
**QA context** : Retours mobiles réels — icônes runtime non homogènes

---

## Synthèse exécutive

L'audit confirme et quantifie le problème QA signalé. La cause racine est une **incohérence de facteur d'échelle dans ObstacleRenderer.ts** :

- Icônes OpenMoji (mailbox, roadblock, éléments castle) : `cs × 1.9` → **~44px** → lisibles ✓
- Assets PNG runtime **obstacles** : `cs × 0.74` → **~17px** → illisibles ✗
- Assets PNG runtime **boss** : `fitImageInCell ~cs` → **~22px** → trop petits ✗

La **mailbox Paperboy** (~44px) est confirmée comme référence positive exactement parce qu'elle utilise le path `cs × 1.9` via `entityTextureResolver` et non le path `cs × 0.74` des obstacles PNG.

---

## Problèmes détectés

### CRITIQUE

| # | Univers | Objet | Taille actuelle | Impact |
|---|---------|-------|-----------------|--------|
| C1 | OutRun | Obstacle car | ~14×14px | 68% sous référence + aspect ratio 1.6:1 aplati |
| C2 | OutRun | Boss turbo rival | ~22×14px | 68% sous référence + aspect 1.55:1 très aplati |

### TROP PETIT

| # | Univers | Objet | Taille actuelle | Ecart |
|---|---------|-------|-----------------|-------|
| P1 | Sonic | Obstacle bumper | ~17px | −61% |
| P2 | Streets | Obstacle crowd | ~17px | −61% |
| P3 | Fighter | Obstacle charge marker | ~17px | −61% |
| P4 | Shinobi | Obstacle decoy | ~17px | −61% |
| P5 | Kombat | Obstacle fatal zone | ~17px | −61% |
| P6 | Sonic | Boss loop serpent | ~22px | −50% |
| P7 | Streets | Boss crime lord | ~16×22px | −50% + portrait 0.73:1 |
| P8 | Fighter | Boss final challenger | ~18×22px | −50% |
| P9 | Shinobi | Boss shadow ninja | ~22px | −50% |
| P10 | Kombat | Boss dragon gate | ~22px | −50% |
| P11 | Paperboy | Boss neighborhood chaos image | ~22px | −50% |

### ASSET MORT

| # | Univers | Objet | Problème |
|---|---------|-------|---------|
| A1 | Paperboy | obstacle_dog.png | Jamais affiché : entityTextureResolver intercepte `routeObstacle` avec roadblock.svg. Le chien n'apparaît que si le SVG échoue à charger, à ~17px — illisible. C'est la source du rapport "chiens trop petits". |

### MAL ALIGNÉ

| # | Univers | Objet | Taille | Problème |
|---|---------|-------|--------|---------|
| M1 | OutRun | Pickup checkpoint | ~22×36px | Portrait 0.625:1 dans cell carrée — asymétrique |
| M2 | Streets | Boss crime lord | ~16×22px | Portrait 0.73:1 rétréci en largeur par fitImageInCell |

---

## Fichier audit détaillé

`reports/patch-1069/docs/runtime-icon-size-harmonization-audit.md`

Contient :
- Tableau complet 28 objets avec formules exactes
- Analyse routing chien Paperboy (§3)
- 5 recommandations prioritaires avec localisation code
- Résumé chiffré

---

## Recommandations (résumé)

| Priorité | Action | Fichier | Ligne |
|----------|--------|---------|-------|
| P1 | Obstacles PNG : 0.74× → 1.2× | ObstacleRenderer.ts | :112 |
| P2 | Boss PNG : ~1× → 1.5× | ObstacleRenderer.ts | :105 |
| P3 | Paperboy dog : définir le routing clair (option A/B/C) | GameScene.ts | :196 |
| P4 | OutRun car + turbo_rival : recadrer assets en 1:1 | assets PNGs | — |
| P5 | OutRun checkpoint : recadrer asset en 1:1 | assets PNGs | — |

---

## npm run check

```
OK — aucune modification de code effectuée, check non applicable.
Audit read-only conforme aux règles PATCH 1069.
```

---

## Conformité règles PATCH 1069

- [x] Aucune modification de code source
- [x] Aucune modification d'assets
- [x] Fichiers produits uniquement dans `reports/patch-1069/`
- [x] Tableau complet avec référence mailbox
- [x] Problème chien Paperboy analysé et documenté
- [x] `reports/patch-1069/docs/runtime-icon-size-harmonization-audit.md` créé
- [x] `reports/patch-1069/logs/audit-trace.md` créé
