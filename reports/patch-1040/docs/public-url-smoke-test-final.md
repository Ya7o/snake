# Public URL Smoke Test Final

## URL testee

https://ya7o.github.io/snake/

## Statut GitHub Pages

- workflow : `Deploy GitHub Pages`
- dernier commit : `a10c40c`
- workflow status : completed / success
- URL accessible : oui, HTTP 200
- date/heure test : 2026-05-29T12:50:02+02:00

Note : l'endpoint public GitHub API `/repos/Ya7o/snake/pages` a encore renvoye `status: 404`, mais l'URL publique est servie correctement en HTTP 200.

## Resultats

| Test | Resultat | Notes |
|---|---|---|
| Title public | PASS | Title visible, fond charge, bouton `APPUYER POUR JOUER` visible. |
| WorldMap public | PASS | WorldMap visible apres clic start, Castle accessible en progression normale. |
| unlockAll public | PASS | `?unlockAll=1` affiche les noeuds comme debloques/valides, sans bouton debug public visible. |
| resetProgress public | PASS | `?resetProgress=1` puis retour URL normale affiche Castle accessible et progression normale. |
| Castle system | PASS | LevelIntro Castle charge publiquement avec fond, texte et boutons. |
| Castle gameplay | PASS | GameScene Castle charge publiquement avec HUD, grille, snake et pickup visibles. |

## Console / reseau

Console :

- Phaser charge en WebGL/Web Audio.
- Self-check QA interne : `All checks passed`.
- Warnings WebGL de performance `GPU stall due to ReadPixels`, non bloquants dans le test headless.
- Erreurs console liees aux 404 audio listés ci-dessous.

Reseau :

- Aucun 404 critique sur JS, CSS, images de gameplay, UI, OpenMoji ou runtime assets.
- 404 non bloquants sur trois fichiers audio references mais absents :
  - `https://ya7o.github.io/snake/assets/audio/game_over.wav`
  - `https://ya7o.github.io/snake/assets/audio/boss_hit.wav`
  - `https://ya7o.github.io/snake/assets/audio/boss_clear.wav`

Ces fichiers etaient deja identifies comme absents dans les audits precedents. Ils n'empechent pas le chargement du jeu, car l'AudioSystem prevoit des fallbacks tonaux.

## Verdict

PASS avec reserve

La publication GitHub Pages est fonctionnelle : le jeu charge, la WorldMap charge, les query params principaux fonctionnent, et Castle normal atteint bien le gameplay. La reserve concerne les 404 audio optionnels.

## PATCH suivant

PATCH 1041 - Optional Audio Asset Coverage Fix
