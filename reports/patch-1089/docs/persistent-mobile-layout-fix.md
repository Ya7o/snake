# Persistent Mobile Layout Fix

## Problèmes
- GameOver layout mobile.
- Board size Castle vs Sonic/autres univers.

## Causes
GameOver utilisait encore des ancres verticales plus anciennes que Clear/Boss Clear. Le score et le nom du niveau occupaient la même zone médiane, avec une largeur de panneau trop courte pour des scores élevés.

Le gameplay gardait une liste de tailles par univers. Sonic, Streets, Fighter, Shinobi, Kombat et Paperboy répétaient la même valeur au lieu de passer par une règle commune, ce qui rendait l'intention de sizing fragile. Castle est un cas distinct car son plateau logique est en 16x26, tandis que les autres univers normaux restent en 16x20.

## Changements
| Fichier | Changement | Raison |
|---|---|---|
| `src/scenes/GameOverScene.ts` | Ajout d'ancres mobiles dédiées, texte ajusté, panneau score/best plus large, boutons repositionnés. | Aligner GameOver avec la logique visuelle des écrans de fin corrigés. |
| `src/scenes/GameScene.ts` | Règle commune `DEFAULT_FRAME_GRID_WIDTH = 0.98` et `DEFAULT_FRAME_GRID_Y_BIAS = 0.22`; exceptions Castle et OutRun seules dans les maps. | Harmoniser Sonic et les autres univers sans changer la grille logique ni les collisions. |
| `reports/patch-1089/capture-patch-1089.mjs` | Script ciblé de captures et CSV board. | Produire les preuves visuelles du patch. |

## GameOver layout final
- Titre : centré dans la partie haute.
- Cause : bande lisible sous le titre, avec texte ajusté.
- Score/best : panneau central large, deux lignes ajustées pour éviter le débordement.
- Niveau : sous le panneau score, centré et ajusté.
- Boutons : `REJOUER` puis séparateur puis `CARTE`, espacés en portrait mobile.

## Board sizing final
- Règle commune : tous les univers non exceptionnels utilisent 16x20 avec `widthFactor = 0.98` et `verticalBias = 0.22`.
- Exceptions : Castle garde 16x26 avec `widthFactor = 0.75`; OutRun garde `widthFactor = 0.78` et `verticalBias = 0.42` pour son cockpit.
- Impact Castle : inchangé en logique, toujours 288x468 sur 390x844.
- Impact Sonic : harmonisé avec les univers 16x20, 368x460 sur 390x844.
- Impact autres univers : Paperboy vérifié à 368x460; les autres non exceptionnels passent par la même règle.

## Vérifications
- GameOver mobile : capture `gameover_mobile_after.png`, score/best et boutons sans débordement.
- Castle board : capture `castle_board_mobile_after.png`, exception 16x26 documentée.
- Sonic board : capture `sonic_board_mobile_after.png`, sizing harmonisé.
- Autre univers : Paperboy capture `third_universe_board_after.png`, même sizing que Sonic.

## Limites / risques
- Petits viewports : les ancres ont une variante portrait court, mais une validation appareil réel reste utile.
- Backgrounds avec cadrage différent : OutRun reste volontairement une exception.
- Validation mobile réelle nécessaire après publication GitHub Pages.
