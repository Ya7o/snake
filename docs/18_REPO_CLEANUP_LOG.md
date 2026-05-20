# 18 — Repo Cleanup Log

## 2026-05-20

Nettoyage demandé après accumulation de tickets, prototypes et assets intermédiaires.

## Supprimé

- `dist/` : build généré par Vite.
- `design_boards/_incoming/` : doublons après tri des planches par univers.
- `tickets/1st build/` : archive de première build et prototypes dupliqués.
- anciens packs de tickets appliqués 909-921.
- `references/prototypes/` : prototypes HTML V3 monofichier obsolètes.
- `references/assets/` : ancien asset Castle non consommé.

## Conservé

- `src/` : code source.
- `public/assets/` : assets runtime chargés par Phaser.
- `design_boards/[univers]/` : sources design triées.
- `design_boards/minimap/` : source minimap.
- `references/screenshots/` : captures encore citées par la doc WorldMap.
- `tickets/patch_922_french_intro_instructions_by_level/` et `tickets/patch_923_mobile_fit_worldmap_intro_and_frame_cleanup/` : tickets non appliqués à date.

## Convention Future

Après application d'un ticket pack :

1. Copier les décisions utiles dans `docs/`.
2. Supprimer les screenshots/prompts du pack si le code est intégré.
3. Garder seulement les tickets non appliqués.
4. Laisser `dist/` hors repo.
