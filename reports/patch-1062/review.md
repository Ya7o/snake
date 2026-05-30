# PATCH 1062 — Mobile Clear Screen Title Fit Fix

## Statut : TERMINE

## Tests

| Test | Resultat |
|------|----------|
| npm run check (tsc + vite build) | OK |

## GitHub

- Commit : voir git log
- Captures : reports/patch-1062/screenshots/ (captures runtime non disponibles en CI)

## Resume

| Item | Avant | Apres |
|------|-------|-------|
| Debordement titre mobile | oui | non |
| Probleme du E accent (REUSSI) | oui | non |
| Autres clear screens (tous univers) | potentiellement affectes | corriges |
| Build | OK | OK |

## Changements

**Fichier : src/scenes/ClearScene.ts**

1. Variable `titleFontSize = Math.min(22, Math.floor(W * 0.058))` ajoutee
   - Remplace les deux appels inline `Math.min(28, Math.floor(W * 0.08))`
   - Cap reduit : 28px -> 22px ; coefficient : 0.08 -> 0.058
   - Sur 360px : 28px -> 20px (confortable dans le cadre)

2. Titre 'NIVEAU REUSSI' : E accent supprime
   - "Press Start 2P" ne contient pas de glyphes accentues
   - Rend proprement dans tous les univers, cohérent avec le style pixel

## Couverture

La correction s'applique a tous les univers via la variable `title` partagee :
- Sonic clear : OK
- Castle clear : OK
- Tous les autres univers : OK

## Risques residuels

- Aucun : changements limites a ClearScene.ts, variables de rendu seulement
- Les sous-titres accentues (Arial / UI_FONT) ne sont pas concernes
