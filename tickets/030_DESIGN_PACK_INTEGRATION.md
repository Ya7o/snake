# Ticket 030 — Intégrer le design pack

## Objectif
Utiliser les 8 planches pour donner une identité aux 8 univers.

## Prérequis
- `tickets/029_MAP_DESIGN_BOARDS_TO_UNIVERSES.md`

## Fichiers à créer
- assets propres dans `public/assets/universes/[univers]/`

## Fichiers à modifier
- `src/config/universes.ts`
- `src/render/RenderHud.ts`
- `src/render/RenderFrame.ts`
- `src/render/RenderPickups.ts`
- `src/render/RenderObstacles.ts`
- `src/render/RenderBoss.ts`
- `src/render/RenderTransitions.ts`

## Contraintes
- Jamais de planche brute dans gameplay.
- Fallback procédural si extraction incertaine.
- Grille sobre.
- Identité univers visible.

## Tests
```bash
npm run check
```
Manuel : vérifier chaque univers visuellement.
