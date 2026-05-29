# Static Deploy Readiness Audit

## Objectif

Preparer Snake Drive V4 pour GitHub Pages.

## Build

| Test | Resultat | Notes |
|---|---|---|
| npm run check | OK | Execute `tsc && vite build` via le script `npm run build`. |
| npm run build | OK via npm run check | Non relance separement, car `npm run check` appelle deja `npm run build`. |
| dist genere | Oui | `dist/` present, environ 141M, 257 fichiers. |

Warning observe :

- Rollup/Vite signale un chunk superieur a 500 kB.
- `dist/assets/index-Bdf8i75G.js` pese 1,608.64 kB minifie, 376.14 kB gzip.
- Warning non bloquant pour le build, mais utile pour un futur travail de code-splitting.

## GitHub Pages target

URL cible probable :

https://ya7o.github.io/snake/

## Vite base path

- base actuelle : non configuree dans `vite.config.ts`, donc Vite utilise `/`.
- risque : le build genere des URLs root-absolute dans `dist/index.html`, notamment `/assets/index-Bdf8i75G.js`, `/favicon.svg` et `/site.webmanifest`.
- impact : sous `https://ya7o.github.io/snake/`, ces chemins pointent vers `https://ya7o.github.io/assets/...` au lieu de `https://ya7o.github.io/snake/assets/...`.
- recommandation : pour PATCH 1037, ajouter `base: '/snake/'` dans la config Vite si la cible reste le repo GitHub Pages `Ya7o/snake`.
- alternative : `base: './'` rend le build plus portable, mais doit etre teste avec Phaser et tous les chargements d'assets avant adoption.

## Assets

| Categorie | Risque GitHub Pages | Notes |
|---|---|---|
| public/assets/ui | Moyen | Les chemins source sont majoritairement relatifs (`assets/ui/...`) et sont copies dans `dist/assets/ui`; OK si le JS charge depuis `/snake/`. |
| public/assets/audio | Moyen | Les chemins existants sont relatifs et copies, mais `game_over.wav`, `boss_hit.wav`, `boss_clear.wav` sont references et absents. Fallback tonal prevu, mais 404 possibles. |
| public/assets/openmoji | Faible a moyen | Chemins relatifs (`assets/openmoji/...`) et fichiers copies dans `dist/assets/openmoji`; depend du bon chargement du JS sous `/snake/`. |
| runtime assets | Eleve | `src/assets/runtimeUniverseAssets.ts` utilise des chemins root-absolute `/assets/runtime/universes/...`, qui casseront sous `/snake/`. |

Constats supplementaires :

- `public/assets` est bien copie dans `dist/assets`.
- `dist/assets/runtime/universes` contient 21 fichiers runtime.
- `dist/assets` pese environ 141M, dont environ 85M pour `assets/ui`.
- GitHub Pages peut servir ces fichiers statiques, mais le poids image est un risque de performance mobile.

## Query params

| Parametre | Usage | Risque |
|---|---|---|
| ?unlockAll=1 | Debloque toute la progression pour la session via `SaveSystem`. | Compatible GitHub Pages; query string conservee par le navigateur. |
| ?debugUnlockAll=1 | Alias debug de `unlockAll`. | Compatible GitHub Pages; meme logique session-only. |
| ?resetProgress=1 | Supprime la sauvegarde locale `snakeDriveV4_save` au chargement. | Compatible GitHub Pages; localStorage sera separe du domaine/local dev. |

## Recommandation

- pret pour GitHub Pages : non, pas en l'etat pour `https://ya7o.github.io/snake/`.
- config necessaire dans PATCH 1037 : oui.
- workflow Actions recommande : oui, pour produire et publier `dist/` proprement sans le committer.
- base recommandee : `base: '/snake/'` pour la cible GitHub Pages probable.

Avant publication publique, PATCH 1037 devrait :

- configurer le `base` Vite pour `/snake/`;
- corriger ou rendre base-aware les assets root-absolute dans `runtimeUniverseAssets.ts`;
- verifier les chemins du manifest et favicon sous `/snake/`;
- garder `dist/` hors commit;
- ajouter un workflow GitHub Actions de build/deploy si GitHub Pages doit etre automatise.

## Risques

- page blanche si la base Vite reste `/`;
- assets runtime 404 a cause des chemins `/assets/runtime/...`;
- favicon/manifest 404 sous `/snake/`;
- images lourdes, notamment `assets/ui`, pouvant ralentir le premier chargement mobile;
- audio bloque avant interaction selon les politiques navigateur, comportement deja attendu pour Web Audio;
- fichiers audio references mais absents pour game over/boss;
- localStorage du domaine public separe de la progression locale de developpement.

## PATCH suivant

PATCH 1037 - GitHub Pages Deploy Setup
