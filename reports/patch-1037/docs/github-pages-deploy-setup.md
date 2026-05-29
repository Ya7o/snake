# GitHub Pages Deploy Setup

## Objectif

Publier Snake Drive V4 sur GitHub Pages.

## URL cible

https://ya7o.github.io/snake/

## Changements

- `vite.config.ts` configure maintenant `base: '/snake/'`.
- `.github/workflows/deploy-pages.yml` ajoute un workflow GitHub Actions de build et deploy Pages.
- Le workflow se declenche sur push vers `main` et via `workflow_dispatch`.
- Le workflow utilise `npm ci`, `npm run build`, `actions/configure-pages`, `actions/upload-pages-artifact` et `actions/deploy-pages`.
- Aucun asset, niveau, boss, mecanique ou fichier `dist/` n'est modifie ou committe.

## Commandes testees

- `npm run check` : OK
- `npm run build` : OK

Les deux commandes produisent le warning Vite/Rollup connu sur le chunk superieur a 500 kB.

## Verifications

- `dist/index.html` inspecte apres build.
- Le script genere pointe vers `/snake/assets/index-Bdf8i75G.js`.
- Le favicon dans `dist/index.html` pointe vers `/snake/favicon.svg`.
- Le manifest dans `dist/index.html` pointe vers `/snake/site.webmanifest`.
- `dist/` existe localement apres build mais n'est pas stage.
- Les query params restent bases sur `window.location.search` :
  - `?unlockAll=1`
  - `?debugUnlockAll=1`
  - `?resetProgress=1`

## Activation GitHub Pages

Etapes cote GitHub si necessaire :

1. Aller dans repository Settings.
2. Ouvrir Pages.
3. Choisir Source: GitHub Actions.
4. Verifier que le workflow `Deploy GitHub Pages` se lance sur `main`.
5. Apres deploy, ouvrir https://ya7o.github.io/snake/.

## Risques restants

- `src/assets/runtimeUniverseAssets.ts` contient encore des chemins root-absolute `/assets/runtime/universes/...`; ils peuvent 404 sous `/snake/`.
- `public/site.webmanifest` contient encore un icon `src` root-absolute `/favicon.svg`; cela peut affecter l'icone PWA, pas le demarrage du jeu.
- Les images restent lourdes : `dist/` pese environ 141M apres build.
- Le warning chunk > 500 kB reste present.
- L'audio peut etre bloque avant interaction selon les politiques navigateur.
- Les fichiers audio `game_over.wav`, `boss_hit.wav` et `boss_clear.wav` sont references mais absents; fallback sonore attendu.
- `localStorage` sur GitHub Pages sera separe du local dev.
- Le premier deploy public doit etre controle dans le navigateur, car ce patch n'active pas manuellement les Settings GitHub Pages.

## PATCH suivant

PATCH 1038 - Public URL Smoke Test
