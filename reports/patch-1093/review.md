# Review

## Objectif

Classer les problemes visuels signales par PATCH 1092 en separant :

- problemes de renderer/scaling/code ;
- assets source a regenerer ou remplacer ;
- assets legacy inutilises ou suspects ;
- assets encore utilises mais fragiles ;
- effets proceduraux a corriger.

Audit uniquement : aucune modification de code, aucun asset modifie, aucune suppression.

## Resultat

Classification terminee.

Constats principaux :

- Les P0 Kombat et Shinobi ne doivent pas etre traites comme un simple probleme de taille d'asset. Kombat normal est surtout un probleme de contraste asset/fond, Kombat boss un probleme de scene trop sombre, et Shinobi boss un possible probleme runtime/fallback a confirmer.
- Les `pickup_secondary.png` ne sont pas de simples fichiers morts : ils sont declares dans `RUNTIME_UNIVERSE_ASSETS`, precharges, puis branches dans `PickupRenderer`.
- Leur usage visible est toutefois limite. Paperboy peut les afficher en phase livraison avec plusieurs pickups actifs; les autres univers sont wired mais legacy-suspects parce que les mecaniques actuelles exposent generalement un seul pickup actif.
- Les SVG Castle/OpenMoji ne sont pas la cause source des obstacles ghost peu lisibles; le probleme est surtout alpha/telegraph procedurals.
- Les gros PNG 1254x1254 sont des assets utilises, mais fragiles au downscale avec `FilterMode.LINEAR`.

## Fichiers modifies

- `reports/patch-1093/review.md`
- `reports/patch-1093/docs/asset-quality-legacy-usage-classification.md`
- `reports/patch-1093/logs/asset-classification.csv`
- `reports/patch-1093/logs/secondary-assets-usage.json`

## Tests / verifications

Commande demandee :

```bash
npm run check
```

Resultat : OK.

Notes :

- `tsc` OK.
- `vite build` OK, 60 modules transformes.
- Warning non bloquant : chunk JS superieur a 500 kB apres minification.

Verifications documentaires :

- Lecture des livrables PATCH 1092 demandes.
- Recherche de references dans `src/`.
- Inventaire des fichiers `*secondary*` sous `public/assets/runtime/`.
- Verification dimensions/taille via `file` et `du -b`.

## Captures

Aucune capture. PATCH 1093 est un audit documentaire et technique.

## Documents

- `reports/patch-1093/docs/asset-quality-legacy-usage-classification.md`
- `reports/patch-1093/logs/asset-classification.csv`
- `reports/patch-1093/logs/secondary-assets-usage.json`

## Limites / risques

- Pas de nouvelles captures ni de test sur appareil reel.
- L'usage "visible" des secondary est infere statiquement depuis les mecaniques et `getActivePickups()`, sans instrumentation runtime.
- Shinobi boss noir reste a confirmer en patch correctif dedie.
- Les fichiers suspects n'ont pas ete supprimes, conformement au scope.

## Liens GitHub

- Commit : https://github.com/Ya7o/snake/commits/main
- PR : non applicable
