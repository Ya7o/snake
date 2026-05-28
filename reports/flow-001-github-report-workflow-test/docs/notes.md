# Notes — FLOW-001

## Contexte d'exécution

- Date : 2026-05-28
- Repo local : `C:\Users\Boris\snake`
- Repo GitHub : https://github.com/Ya7o/snake
- Branche : `main`
- Environnement : Windows 10, PowerShell, Claude Code (Sonnet 4.6)

## Observations

1. `node_modules/` était absent au lancement → `npm install` nécessaire avant `npm run check`.
2. Build Vite émet un avertissement chunk size (bundle JS > 500 kB) — non bloquant, connu.
3. Le flux ChatGPT → Claude Code → GitHub fonctionne sans modification du code source.

## Recommandation

Inclure `npm install` comme étape préalable dans la documentation du workflow pour les environnements sans `node_modules/`.
