# Public URL Smoke Test

## URL testee

https://ya7o.github.io/snake/

## Statut GitHub Pages

- workflow : `Deploy GitHub Pages`
- dernier run observe : completed / failure
- commit teste par le workflow : `d4d3e14`
- etape en echec : `Configure Pages`
- URL accessible : non, HTTP 404 GitHub Pages
- date/heure test : 2026-05-29T12:25:21+02:00

## Resultats

| Test | Resultat | Notes |
|---|---|---|
| Title public | FAIL | L'URL publique affiche `Site not found - GitHub Pages`, pas le titre du jeu. |
| WorldMap public | FAIL | Impossible d'atteindre la WorldMap car la page publique est une 404. |
| unlockAll public | FAIL | `https://ya7o.github.io/snake/?unlockAll=1` renvoie aussi HTTP 404. |
| resetProgress public | FAIL | `https://ya7o.github.io/snake/?resetProgress=1` renvoie aussi HTTP 404. |
| Castle system | FAIL | Impossible de lancer Castle normal depuis l'URL publique. |
| Castle gameplay | FAIL | GameScene non atteinte. |

## Console / reseau

Erreurs reseau :

- HTTP 404 sur `https://ya7o.github.io/snake/`
- HTTP 404 sur `https://ya7o.github.io/snake/?unlockAll=1`
- HTTP 404 sur `https://ya7o.github.io/snake/?resetProgress=1`

Console :

- `Failed to load resource: the server responded with a status of 404`

Statut GitHub :

- API Actions : workflow trouve, statut `completed`, conclusion `failure`.
- Jobs : `build` en failure, `deploy` skipped.
- Etapes du job build : checkout, setup node, install dependencies et build passent; `Configure Pages` echoue.
- API Pages : reponse 404, pas de configuration Pages visible via l'endpoint public.

## Verdict

FAIL

Le build local reste OK, mais l'URL publique n'est pas encore publiee. Le smoke test ne peut donc pas valider le Title, la WorldMap, les query params ou le gameplay.

## PATCH suivant

PATCH 1039 - GitHub Pages activation / workflow failure fix
