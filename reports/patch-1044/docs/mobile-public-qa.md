# Mobile Public QA

## URL testee

https://ya7o.github.io/snake/

## Environnement

- navigateur : Chromium headless via Playwright
- viewport principal : 390 x 844
- viewport secondaire : 412 x 915
- device reel ou emulation : emulation mobile tactile
- date/heure : 2026-05-29

## Resultats

| Test | Resultat | Notes |
|---|---|---|
| Title mobile | PASS | Title lisible, bouton Start visible, canvas centre. |
| WorldMap mobile | PASS | WorldMap lisible, hint `RETAPE POUR LANCER` visible, pas de debug public. |
| Progression normale | PASS | Apres reset, Castle accessible, autres noeuds visibles verrouilles. |
| Unlock all | PASS | `?unlockAll=1` affiche les noeuds comme debloques/valides, sans bouton debug public. |
| Reset progress | PASS | `?resetProgress=1` remet l'etat initial attendu. |
| Castle system | PASS | LevelIntro Castle lisible, boutons visibles. |
| Castle gameplay | PASS | HUD, grille, snake et pickup visibles en portrait. |
| Audio apres interaction | PASS avec reserve | Interactions tactiles effectuees, aucun 404 audio; audibilite impossible a confirmer en headless. |

## Problemes observes

- Aucun HTTP >= 400 ni request failed capture.
- Warnings WebGL `GPU stall due to ReadPixels` en environnement headless, non bloquants.
- Warnings AudioContext autoplay sur certains chargements, comportement navigateur attendu avant interaction utilisateur.

## Details QA

- 390 x 844 : `scrollW=390`, `clientW=390`, `scrollH=844`, `clientH=844`.
- 412 x 915 : `scrollW=412`, `clientW=412`, `scrollH=915`, `clientH=915`.
- Aucun scroll involontaire detecte par mesures DOM.
- Scene Title atteinte.
- Scene WorldMap atteinte.
- Scene LevelIntro Castle atteinte.
- Scene GameScene Castle atteinte.

## Verdict

PASS avec reserve

La reserve concerne uniquement l'audio audible sur appareil reel : Playwright headless peut verifier l'absence d'erreurs et de 404, mais pas l'experience sonore physique.

## Recommandation

Pret public mobile pour cette passe QA.

Recommandation supplementaire : effectuer un dernier test manuel sur un vrai telephone Android/iOS pour confirmer le rendu tactile et l'audio entendu apres interaction.
