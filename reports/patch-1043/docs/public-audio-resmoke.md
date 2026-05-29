# Public Audio Re-Smoke Test

## URL testee

https://ya7o.github.io/snake/

## Audio URLs

| Fichier | Status | Verdict |
|---|---:|---|
| game_over.wav | 200 | PASS |
| boss_hit.wav | 200 | PASS |
| boss_clear.wav | 200 | PASS |

Details :

- `game_over.wav` : `content-type: audio/wav`, `content-length: 92654`
- `boss_hit.wav` : `content-type: audio/wav`, `content-length: 28268`
- `boss_clear.wav` : `content-type: audio/wav`, `content-length: 119114`

## Jeu public

| Test | Resultat | Notes |
|---|---|---|
| Title | PASS | HTTP 200, title `Snake Drive V4`, canvas present, scene active `TitleScene`. |
| WorldMap | PASS | Scene active `WorldMapScene` apres start. |
| Castle gameplay | PASS | Scene active `GameScene` atteinte apres lancement Castle. |
| Audio 404 | PASS | Aucun HTTP >= 400 ni request failed capture pendant le smoke test. |

## Console / reseau

- Console : Phaser charge correctement, self-check QA interne `All checks passed`.
- Warnings : messages WebGL `GPU stall due to ReadPixels`, non bloquants en headless.
- Reseau : aucun 404 capture.

## Verdict

PASS

Les trois 404 audio publics detectes en PATCH 1040 sont corriges.

## Risques restants

- Audio autoplay selon navigateur et interaction utilisateur.
- Cache GitHub Pages pendant les prochains deploys.
- Sons placeholder a remplacer par du sound design final si necessaire.
