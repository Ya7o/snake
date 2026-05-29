# Review — Migration WSL

## Objectif

Migrer le repo Snake Drive V4 de `C:\Users\Boris\apps_ai\snake` vers `~/apps/snake` dans WSL.
Désinstaller Node.js Windows — tout npm/build/Playwright se fait depuis WSL désormais.

## Résultat

- rsync : OK (882 MB transférés, node_modules/dist/.vite exclus)
- npm install : OK (19 packages, 0 vulnérabilités)
- npm run check : OK (0 erreur TypeScript, 60 modules, build en 6.58s)
- git remote intact : oui (git@github.com:Ya7o/snake.git)
- CLAUDE.md mis à jour : oui
- alias WSL mis à jour : oui (`alias snake='cd ~/apps/snake'`)

## Fichiers modifiés

- `CLAUDE.md` — section 5 environnement reécrite (WSL only), section 4 npm depuis WSL, état dev 2026-05-29

## Tests / vérifications

```
npm run check
> tsc && vite build
✓ 60 modules transformed.
dist/assets/index-Bdf8i75G.js  1,608.64 kB │ gzip: 376.14 kB
✓ built in 6.58s
```
Warning `chunk > 500 kB` : attendu, non bloquant.

## Captures

Tâche non visuelle — pas de captures.

## Documents

Aucun document complémentaire.

## Limites / risques

- L'ancien dossier `C:\Users\Boris\apps_ai\snake` est à supprimer manuellement depuis l'Explorateur Windows ou PowerShell (`Remove-Item -Recurse -Force "C:\Users\Boris\apps_ai\snake"`)
- Node.js Windows à désinstaller manuellement via Paramètres Windows → Applications
- Cowork ne peut pas monter `~/apps/snake` directement (filesystem WSL inaccessible depuis l'hôte Windows via chemin UNC standard) — utiliser `/mnt/c/...` ou le chemin Windows `\\wsl$\Ubuntu\home\<user>\apps\snake` si nécessaire
- Claude Code tourne toujours depuis Windows pour l'instant ; les prochaines sessions devront être lancées depuis WSL ou pointer vers le chemin WSL

## Liens GitHub

- Commit : https://github.com/Ya7o/snake/commit/13672ff
