# Review — PATCH 1025 — Product Backlog vNext

## Objectif

Créer un backlog produit structuré pour décider des prochaines étapes après la stabilisation de Snake Drive V4.
Aucune modification de code, d'assets ou de configuration.

## Résultat

Backlog créé dans `reports/patch-1025/docs/product-backlog-vnext.md`.

Le document est basé sur une lecture réelle du code source (`src/config/`, `src/mechanics/`, `src/systems/`, `src/scenes/`, `src/data/audioRegistry.ts`, `public/assets/audio/`, `tickets/`).

**Principaux constats factuels identifiés :**

- 3 fichiers WAV manquants confirmés : `game_over.wav`, `boss_hit.wav`, `boss_clear.wav` (absents de `public/assets/audio/`)
- `DEV_UNLOCK_ALL = true` dans `src/config/constants.ts` — bloquant pour toute release
- 2 console.warn WorldMap au boot (fallback procédural actif)
- Issues mobile layout (OutRun scale, Shinobi/Kombat level intro) documentées dans tickets PATCH 960/961

## Fichiers modifiés

| Fichier | Action |
|---------|--------|
| `reports/patch-1025/docs/product-backlog-vnext.md` | Créé |
| `reports/patch-1025/review.md` | Créé |

Aucun fichier de code, d'asset ou de configuration touché.

## Tests / vérifications

```
> npm run check
> tsc && vite build

✓ 60 modules transformed.
✓ built in 8.74s
0 erreur TypeScript

Avertissement (non bloquant) :
Some chunks are larger than 500 kB after minification.
→ Attendu pour un projet Phaser 3 (bundle JS ~1.6 MB). Pas lié à ce patch.
```

## Captures

Aucune — tâche documentation uniquement.

## Documents

- [`reports/patch-1025/docs/product-backlog-vnext.md`](docs/product-backlog-vnext.md) — Backlog produit complet

## Limites / risques

- Les issues de tickets PATCH 960 et 961 (OutRun scale, Shinobi/Kombat level intro) sont listées comme bugs non bloquants. Leur statut exact (résolu ou encore ouvert) nécessite un test visuel sur device — non vérifiable sans lancer le jeu.
- Le backlog est un point de départ : il devra être actualisé après chaque cycle de patch majeur.
- Les estimations de priorité sont subjectives — à valider avec le product owner avant exécution.

## Liens GitHub

À compléter après push :

- Commit : https://github.com/Ya7o/snake/commit/14a0bac
- Review : https://github.com/Ya7o/snake/blob/main/reports/patch-1025/review.md
- Backlog : https://github.com/Ya7o/snake/blob/main/reports/patch-1025/docs/product-backlog-vnext.md
