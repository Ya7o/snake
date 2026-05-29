# Fresh Deploy Config Consistency Audit

## Objectif

Verifier que la configuration de deploiement GitHub Pages est coherente et reproductible.

## Resume

- Public actuel fonctionne : oui
- Build local fonctionne : oui
- Base Vite detectee : `/snake/`
- Risque prochain deploiement : faible sur la configuration base/workflow actuelle

## Vite config

`vite.config.ts` contient explicitement :

```ts
base: '/snake/',
```

La configuration contient aussi :

- `server.host: '0.0.0.0'`
- `server.port: 5173`
- `preview.host: '0.0.0.0'`
- `preview.port: 5173`

Conclusion : la base Vite est coherente avec l'URL GitHub Pages projet `https://ya7o.github.io/snake/`.

## Workflow GitHub Pages

`.github/workflows/deploy-pages.yml` existe et utilise :

- trigger `push` sur `main`
- trigger manuel `workflow_dispatch`
- `actions/checkout@v4`
- `actions/setup-node@v4` avec Node 22
- `npm ci`
- `npm run build`
- `actions/configure-pages@v5`
- `actions/upload-pages-artifact@v3` avec `path: dist`
- `actions/deploy-pages@v4`
- permissions `contents: read`, `pages: write`, `id-token: write`
- environment `github-pages`

Conclusion : le workflow est coherent avec un deploiement GitHub Pages via Actions.

## Dist local

`npm run check` : OK.

`npm run build` : OK.

`dist/index.html` genere :

- favicon : `/snake/favicon.svg`
- manifest : `/snake/site.webmanifest`
- script principal : `/snake/assets/index-Bz5uo7ki.js`

Aucun script root-absolute `/assets/...` n'a ete detecte dans `dist/index.html`.

Conclusion : le build local est aligne avec GitHub Pages sous `/snake/` et ne presente pas le risque de page blanche identifie avant PATCH 1037.

## URL publique

URL testee :

https://ya7o.github.io/snake/

Resultat :

- HTTP status : 200
- title detecte : `Snake Drive V4`
- canvas detecte : oui
- erreurs reseau critiques : aucune dans le test rapide
- self-check QA interne : `All checks passed`

Conclusion : l'URL publique correspond a un deploiement Vite fonctionnel sous `/snake/`.

## Explication probable

Le public fonctionne aujourd'hui parce que :

1. `vite.config.ts` contient bien `base: '/snake/'`.
2. Le workflow GitHub Pages construit `dist/` avec `npm run build`.
3. Le build local genere un `dist/index.html` dont l'entree JS pointe vers `/snake/assets/...`.
4. Le workflow Pages a fini par etre active cote GitHub Settings et a pu deployer l'artifact `dist`.
5. Les chemins runtime corriges en PATCH 1039 utilisent `import.meta.env.BASE_URL`, donc ils suivent la base Vite.

L'incoherence soupconnee semble venir d'une lecture d'un etat ancien ou d'une vue non rafraichie, pas de l'etat actuel de `main`.

## Risques

- Cache GitHub Pages pendant quelques minutes apres deploiement.
- L'endpoint public GitHub API Pages peut etre moins fiable que le test HTTP direct selon permissions/visibilite.
- Le chunk JS reste superieur a 500 kB.
- Les assets images restent lourds pour mobile.
- Le manifest interne peut encore contenir une reference d'icone root-absolute, mais `dist/index.html` pointe correctement vers `/snake/site.webmanifest` et `/snake/favicon.svg`.

## Recommandation

Aucune correction necessaire dans PATCH 1042.

Le deploiement est coherent et reproductible dans l'etat actuel. La suite recommandee est le smoke test public audio apres deploiement du PATCH 1041 :

PATCH 1043 - Public URL Audio Re-Smoke Test
