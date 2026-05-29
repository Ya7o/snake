# Public Runtime Smoke Test Light

## URL

https://ya7o.github.io/snake/

## Environnement

- navigateur : Chromium 120 (Playwright headless v1.61.0-alpha)
- viewport : 1280x720
- date/heure : 2026-05-29
- mode : Playwright headless (WSL / Kali Linux)

## Résultats

| Test | Résultat | Notes |
|---|---|---|
| npm run check | PASS | Build OK 7.75s, warning chunk size non critique |
| Public URL | PASS | HTTP 200, accessible |
| Title | PASS | "Snake Drive V4" |
| WorldMap normal | PASS | Castle accessible, 0 bouton debug public |
| unlockAll | PASS | ?unlockAll=1 traité, WorldMap accessible |
| resetProgress | PASS | ?resetProgress=1 traité, retour état initial |
| Castle system | PASS | LevelIntro Castle charge |
| Castle gameplay | PASS | GameScene Castle visible, HUD présent |
| Réseau / 404 | PASS | 0 404, 0 FAILED (59 requêtes : 44x200 + 15x206) |

## Résultats détaillés

### npm run check
- tsc + vite build OK
- 60 modules transformés
- 1 warning : bundle JS 1.61 MB > 500 kB limite (non bloquant)
- durée : 7.75s

### URL publique
- HTTP 200
- Title : Snake Drive V4
- Canvas Phaser : 1 (WebGL)
- Phaser v3.90.0 (WebGL | Web Audio)
- Boot : BootScene -> TitleScene OK

### QA Self-Check interne (console)
Le jeu exécute 24 vérifications automatiques au démarrage, toutes passées :
16 niveaux définis, 16 nœuds map, 8 univers, méchaniques OK,
Castle Stage 1 vertical-slice validé.

### WorldMap normal
- localStorage vidé avant test
- Pas de bouton debug public visible
- Castle accessible

### unlockAll
- URL : https://ya7o.github.io/snake/?unlockAll=1
- WorldMap accessible, param traité

### resetProgress
- URL : https://ya7o.github.io/snake/?resetProgress=1
- Retour état initial confirmé

### Castle gameplay
- Chargement LevelIntro + GameScene OK
- HUD visible
- Aucune erreur runtime

### Console
- 0 erreur
- 4 warnings GPU stall ReadPixels (headless WebGL — non critique)

### Réseau
- 0 × 404
- 0 × FAILED
- 44 × 200, 15 × 206 (audio range requests — normal)

## Problèmes observés

Aucun problème bloquant.

1. Warning chunk size (npm build) : bundle JS 1.61 MB — non bloquant, connu.
2. GPU stall ReadPixels (4×) : artefact headless WebGL — absent en navigateur réel.

## Verdict

**PASS**

## Recommandation

Flux et runtime public OK. Aucun patch correctif nécessaire pour ce smoke test.
