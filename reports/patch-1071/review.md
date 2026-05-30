# PATCH 1071 - Review

**Date :** 2026-05-30  
**Sujet :** Gameplay Screen Frame Decision  
**Type :** Audit produit / layout / coherence visuelle  
**Code :** non modifie

## Resultat

Audit termine. La difference de taille apparente entre univers est confirmee, mais elle n'est pas un bug global de viewport.

Decision retenue : **garder les variations artistiques et imposer une safe area documentaire**.

## Synthese

Le standard actuel est `16x20`, `FRAME_GRID_WIDTH = 0.94`, cell `23px` sur viewport `390x844`. Sonic, Streets, Fighter, Shinobi, Kombat et Paperboy partagent ce comportement.

Castle et OutRun sont des exceptions intentionnelles :

- Castle : `16x26`, width `0.75`, cell `18px`, grille plus etroite mais plus haute pour fitter le cadre/chateau.
- OutRun : `16x20`, width `0.78`, cell `19px`, grille plus compacte et plus basse pour laisser l'horizon/route visible.

## Tableau decisionnel

| Univers | Frame gameplay | Taille apparente | Fit background | Lisibilite | Probleme | Recommandation |
|---|---:|---:|---|---|---|---|
| Castle | `16x26`, `0.75`, cell `18px`, `288x468` | Moyenne, etroite/haute | Bon fit portail/chateau | Correcte | Variation visible mais compensee | Garder |
| Sonic | `16x20`, `0.94`, cell `23px`, `368x460` | Grande | Bon fit decor lumineux | Tres bonne | Aucun | Standard |
| OutRun | `16x20`, `0.78`, cell `19px`, `304x380` | Plus petite/basse | Bon fit route/horizon | Correcte sur `390px` | Cas extreme, 68% du standard | Garder + surveiller |
| Paperboy | `16x20`, `0.94`, cell `23px`, `368x460` | Grande | Bon fit quartier | Tres bonne | Aucun | Standard |
| Shinobi | `16x20`, `0.94`, cell `23px`, `368x460` | Grande | Bon fit decor | Tres bonne | Aucun | Standard |

## Captures

Captures creees dans `reports/patch-1071/screenshots/` :

- `castle_gameplay_390x844.png`
- `sonic_gameplay_390x844.png`
- `outrun_gameplay_390x844.png`
- `paperboy_gameplay_390x844.png`
- `shinobi_gameplay_390x844.png`

## Notes techniques

- `GameScene` calcule la frame gameplay via `FRAME_GRID_WIDTH`, `FRAME_GRID_Y_BIAS` et `computeGridLayout`.
- `UniverseFrameRenderer` existe mais n'est pas branche dans `GameScene`; les PNG `public/assets/frames/*/frame.png` ne pilotent pas la taille jouable actuelle.
- Aucune modification de code ou d'asset n'a ete faite.

## Verification

`npm run check` : PASS.

Build OK avec le warning Vite habituel de chunk > 500 kB (`dist/assets/index-*.js` environ 1.61 MB), non bloquant pour ce patch documentaire.

## Livrables

- `reports/patch-1071/docs/gameplay-screen-frame-decision.md`
- `reports/patch-1071/review.md`
- `reports/patch-1071/screenshots/*.png`
