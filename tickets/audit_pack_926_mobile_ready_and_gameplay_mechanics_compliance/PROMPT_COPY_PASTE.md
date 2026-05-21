Tu dois appliquer ce package d’audit au projet Snake Drive V4.

# PACKAGE — Audit mobile-ready + conformité mécaniques

## Objectif 1 — Audit mobile-ready complet
Vérifie que le jeu est réellement prêt pour Android mobile :
- ergonomie tactile ;
- taille des boutons ;
- lisibilité des polices ;
- rendu modern-retro propre ;
- interactions tap/double tap/drag/swipe ;
- parcours utilisateur ;
- performance Android ;
- layout portrait ;
- fit des cadres ;
- priorité de la grille Snake.

Produit :
`docs/audits/926_MOBILE_READY_COMPLIANCE_AUDIT.md`

## Objectif 2 — Audit mécaniques univers + boss
Vérifie que chaque univers a une mécanique propre et que chaque boss a une mécanique distincte.

Mécaniques attendues :
1. Castle — murs clignotants / illusion ; boss Witch Mirror.
2. Sonic — chaînes d’anneaux ; boss Loop Serpent.
3. Streets — foule / bloqueurs ; boss Crime Lord.
4. Fighter — charge / rounds ; boss Final Challenger.
5. OutRun — dérive de voies / checkpoints ; boss Turbo Rival.
6. Shinobi — focus / leurres ; boss Shadow Ninja.
7. Kombat — zones fatales / finish window ; boss Dragon Gate.
8. Paperboy — livraisons / route mayhem ; boss Neighborhood Chaos.

Produit :
`docs/audits/927_GAMEPLAY_MECHANICS_COMPLIANCE_AUDIT.md`

## Règles
- Audit seulement, ne corrige pas dans ce package.
- Ne supprime aucun univers, niveau ou boss.
- Ne modifie pas le gameplay.
- Ne refais pas la WorldMap.
- Ne fais pas de refonte globale.
- Liste explicitement les doutes.

## Fichiers à inspecter
- `src/main.ts`
- `src/scenes/*`
- `src/ui/*`
- `src/input/*`
- `src/config/*`
- `src/data/*`
- `src/renderers/*`
- `src/systems/*`
- `src/mechanics/*`
- `src/entities/*`
- `package.json`
- `vite.config.*`

## Tests / commandes
```bash
npm run check
npm run build
npm run preview -- --host 0.0.0.0
```

Si certaines commandes échouent, expliquer pourquoi.

## Rapport final global obligatoire
À la fin, liste :
1. Fichiers audités.
2. Résultat mobile-ready global.
3. Résultat conformité mécaniques global.
4. P0 mobile.
5. P0 mécaniques.
6. Patchs recommandés dans l’ordre.
7. Questions / blocages.
