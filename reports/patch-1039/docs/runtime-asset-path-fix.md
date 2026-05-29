# Runtime Asset Path Fix

## Probleme

PATCH 1038 n'a pas atteint le jeu public : `https://ya7o.github.io/snake/` renvoyait une 404 GitHub Pages, avec le workflow bloque a l'etape `Configure Pages`.

Les logs 1038 ne prouvent donc pas encore des 404 runtime en navigation. Le risque critique restant etait statique et cible : `src/assets/runtimeUniverseAssets.ts` utilisait 21 chemins root-absolute du type `/assets/runtime/universes/...`, incompatibles avec une publication GitHub Pages sous `/snake/`.

## Cause

Sous GitHub Pages projet, l'application est servie depuis :

https://ya7o.github.io/snake/

Un chemin root-absolute comme `/assets/runtime/universes/sonic/pickup_ring.png` pointe vers :

https://ya7o.github.io/assets/runtime/universes/sonic/pickup_ring.png

au lieu de :

https://ya7o.github.io/snake/assets/runtime/universes/sonic/pickup_ring.png

## Changements

| Fichier | Avant | Apres | Raison |
|---|---|---|---|
| `src/assets/runtimeUniverseAssets.ts` | URLs runtime en `/assets/runtime/universes/...` | URLs construites avec `import.meta.env.BASE_URL` | Respecter le `base: '/snake/'` Vite en build GitHub Pages. |
| `src/assets/runtimeUniverseAssets.ts` | 21 chemins root-absolute | 21 chemins `publicAsset("assets/runtime/universes/...")` | Garder le catalogue runtime localise et eviter un refactor large. |

## Verifications

- `npm run check` : OK
- `npm run build` : OK
- `dist/index.html` inspecte : le script principal pointe vers `/snake/assets/index-Bz5uo7ki.js`
- inspection source : plus de chemin root-absolute `/assets/runtime/...` dans `src/assets`, `src/config`, `src/data`, `src/scenes`
- inspection bundle : les assets runtime sont compiles via une base `/snake/`
- test local `vite preview` sur `http://127.0.0.1:5173/snake/` : aucune requete HTTP >= 400 capturee

## Captures

Captures locales preview generees :

- `reports/patch-1039/screenshots/preview_title_after_fix.png`
- `reports/patch-1039/screenshots/preview_worldmap_after_fix.png`
- `reports/patch-1039/screenshots/preview_castle_system_after_fix.png`
- `reports/patch-1039/screenshots/preview_castle_gameplay_after_fix.png`

Limite : en environnement headless, Playwright a capture un rendu visuel degrade/noir avec des warnings WebGL (`Framebuffer Unsupported`, contexte WebGL perdu/restaure). Le log reseau local ne montre pas de 404.

## Risques restants

- L'URL publique reste dependante de l'activation GitHub Pages et du workflow Actions.
- PATCH 1038 indiquait un echec `Configure Pages`; ce patch ne modifie pas le workflow.
- Le manifest peut encore referencer une icone root-absolute `/favicon.svg`.
- Les autres chemins assets relatifs (`assets/ui/...`, `assets/openmoji/...`, `assets/audio/...`) restent non modifies.
- Audio autoplay selon navigateur.
- Cache GitHub Pages apres publication.
- Images lourdes dans `dist/assets`.
