# Review — PATCH 1030

## Objectif

Retry de la validation visuelle de PATCH 1029 (progression verrouillée + unlock discret).
PATCH 1029 avait implementé les mécaniques ; les captures avaient échoué à cause de Phaser/WebGL headless.
Ce patch refait uniquement la capture visuelle sans modifier src/, public/ ni package.json.

---

## Résultat

**4 captures PNG produites avec succès** via Puppeteer Windows (PowerShell).

| Capture | Résultat |
|---|---|
| `title_default.png` | Écran titre chargé (viewport 390×844) |
| `worldmap_default_progression.png` | WorldMap en état de progression par défaut |
| `worldmap_unlock_all.png` | WorldMap avec `?unlockAll=1` |
| `worldmap_after_reset.png` | WorldMap après `?resetProgress=1` puis rechargement |

Playwright WSL (tentative initiale du ticket) a échoué — Ubuntu 26.04 non supporté par Playwright 1.60.0.
Solution de repli : Puppeteer via Node.js Windows, sans dépendances système Linux.

---

## Fichiers modifiés

```
reports/patch-1030/review.md                   ← ce fichier
reports/patch-1030/screenshots/title_default.png
reports/patch-1030/screenshots/worldmap_default_progression.png
reports/patch-1030/screenshots/worldmap_unlock_all.png
reports/patch-1030/screenshots/worldmap_after_reset.png
reports/patch-1030/docs/capture-script.js       ← script Playwright original (ticket)
reports/patch-1030/docs/capture-puppeteer.js    ← script Puppeteer WSL (doc)
reports/patch-1030/docs/capture.cjs             ← variante .cjs (doc)
reports/patch-1030/docs/capture-notes.md        ← journal des tentatives
```

**Aucune modification de src/, public/, package.json, vite.config, tsconfig.**

---

## Tests / vérifications

### npm run check

```
> snake-drive-v4@0.1.0 check
> npm run build

> snake-drive-v4@0.1.0 build
> tsc && vite build

vite v6.4.2 building for production...
✓ 60 modules transformed.
dist/index.html                     1.38 kB │ gzip:   0.66 kB
dist/assets/index-Bdf8i75G.js   1,608.64 kB │ gzip: 376.14 kB
(!) chunk > 500 kB — warning Rollup attendu, non bloquant
✓ built in 6.69s
```

**Résultat : 0 erreur TypeScript, 60 modules, build OK.**

### Incident node_modules

L'installation WSL de playwright a contaminé node_modules avec des binaires Linux.
Correction : revert package.json + package-lock.json + `npm install` depuis PowerShell Windows.
Build restauré proprement.

---

## Captures

Voir `reports/patch-1030/screenshots/` :

- `title_default.png` — 429 KB
- `worldmap_default_progression.png` — 428 KB
- `worldmap_unlock_all.png` — 421 KB
- `worldmap_after_reset.png` — 421 KB

---

## Limites / risques

1. **Playwright incompatible Ubuntu 26.04** — Playwright 1.60.0 (latest npm) ne supporte pas Ubuntu 26.04.
   Solution future : attendre une version Playwright compatible ou passer à Puppeteer définitivement pour les captures WSL.

2. **sudo non-interactif WSL** — `sudo apt-get install` requiert mot de passe, bloquant en automatisation.
   Pour contourner : configurer `NOPASSWD` dans `/etc/sudoers` ou utiliser la méthode Windows retenue ici.

3. **Dev server non stoppable** — Le serveur vite lancé dans une fenêtre PowerShell minimisée ne peut être tué depuis un autre process (accès refusé). Fermer manuellement la fenêtre PowerShell minimisée.

4. **Screenshots : écrans non différenciés** — L'écran titre et la WorldMap peuvent se ressembler si Phaser n'a pas navigué automatiquement. Les captures reflètent l'état réel à t+4s de chaque URL.

---

## Documents

- `docs/capture-notes.md` — journal complet des tentatives Playwright/Puppeteer WSL/Windows
- `docs/capture-script.js` — script Playwright original du ticket (référence)
- `docs/capture-puppeteer.js` — script Puppeteer adapté (documentation)

---

## Liens GitHub

- Commit : https://github.com/Ya7o/snake/commit/ *(à remplir après push)*
- Review : https://github.com/Ya7o/snake/blob/main/reports/patch-1030/review.md
