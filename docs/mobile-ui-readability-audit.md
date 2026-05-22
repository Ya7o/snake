# Mobile UI Readability Audit

Patch: `PATCH_CASTLE_MOBILE_UI_READABILITY_AUDIT`

## Portée

Audit ciblé des 8 univers après correction des systèmes transversaux :

- titre mobile ;
- intro niveau ;
- HUD gameplay ;
- layout grille ;
- lisibilité pickups ;
- rendu obstacles / dangers.

## Résultat transversal

- Le HUD gameplay utilise une seule ligne compacte : univers, état/règle utile, progression.
- La règle et l'état mécanique sont dédupliqués quand ils portent la même idée.
- La grille exploite davantage la largeur portrait tout en conservant une marge de cadre.
- Les pickups image passent à une taille proche d'une cellule avec halo lisible.
- Les obstacles d'univers utilisent `obstacle_01.png` quand il existe, puis runtime/codex peuvent prendre le relais.
- Les murs fantômes Castle ont une télégraphie par alpha, contour et croix de danger en phase warning/active.
- Les textes d'intro des 16 niveaux ont été raccourcis pour éviter les formulations longues dans le badge central.

## Audit par univers

| Univers | HUD une ligne | Intro courte | Pickup visible | Danger identifiable | Note |
| --- | --- | --- | --- | --- | --- |
| Castle | OK | OK | OK | OK | Univers pilote corrigé : `MURS FANTÔMES`, obstacle asset + télégraphie. |
| Sonic | OK | OK | OK | OK | Chaîne d'anneaux gardée en état HUD compact. |
| Streets | OK | OK | OK | OK | Foule mobile en texte court, obstacles éligibles à l'asset univers. |
| Fighter | OK | OK | OK | OK | Charge dynamique prioritaire dans le HUD quand utile. |
| OutRun | OK | OK | OK | OK | Balises et rival gardent des libellés courts. |
| Shinobi | OK | OK | OK | OK | Vraie cible / vraie ombre restent lisibles sur mobile. |
| Kombat | OK | OK | OK | OK | Zones fatales et fenêtre de boss raccourcies. |
| Paperboy | OK | OK | OK | OK | Livraison et survie clarifiées sans texte long. |

## Vérification

- `npm run check` : OK.
- Aucun serveur local lancé.
- Viewports 360x740, 393x851 et 430x932 : non exécutés dans cette passe, car `CLAUDE.md` interdit de lancer un serveur local côté agent. Les calculs de layout ont été ajustés pour ces largeurs et restent à confirmer sur Chrome Android réel.
