# Mobile UI Regression Smoke Test

## Contexte

Smoke test mobile apres les patchs UI recents :

- Clear/Boss Clear layout + boutons `CONTINUER`, `REJOUER`, `CARTE`;
- harmonisation des tailles d'icones runtime;
- harmonisation du HUD gameplay.

Ce patch est un audit no-code. Le runtime local a ete utilise comme source de verite pour le commit courant. L'URL publique GitHub Pages a aussi ete chargee pour verifier la disponibilite publique.

## Environnement

- Viewport mobile principal : 390x844
- URL locale : `http://localhost:5174/snake/`
- URL publique : `https://ya7o.github.io/snake/`
- Build : `npm run check` OK

## Resultats

| Test | Resultat | Notes |
|---|---|---|
| Title | PASS | TitleScene charge en mobile, pas de texte hors viewport detecte. |
| WorldMap | PASS | WorldMapScene charge, footer lisible, pas de 404 critique. |
| Castle normal | PASS | Gameplay Castle charge, HUD large harmonise visible. |
| Sonic/OutRun/Paperboy | PASS | Smoke gameplay mobile OK sur les univers cibles. |
| Castle boss | PASS | HUD boss affiche `BOSS HP 3/3`. |
| HUD harmonise | PASS | Aucun HUD capsule detecte dans les scenes gameplay testees. |
| Icones lisibles | PASS | OutRun traffic car et Paperboy mailbox/roadblock visibles. |
| Clear score layout | PASS | Score, best, `NOUVEAU RECORD`, `CONTINUER`, `REJOUER`, `CARTE` visibles sans overflow detecte. |
| Boss Clear layout | PASS | Boss clear avec score et `REJOUER` visible sans overflow detecte. |
| Rejouer | PASS | Relance `GameScene` avec le meme `levelId` et score runtime a 0. |
| Continuer | PASS | Lance `LevelIntroScene` pour le niveau suivant. |
| Carte | PASS | Retourne a `WorldMapScene`. |
| Reseau/console | PASS avec note | Aucun HTTP >= 400 local. Console : warnings WebGL `ReadPixels` lies aux screenshots headless. |
| Public URL | PASS | `https://ya7o.github.io/snake/` repond et charge un jeu Phaser. |

## Captures

- `reports/patch-1079/screenshots/mobile_title.png`
- `reports/patch-1079/screenshots/mobile_worldmap.png`
- `reports/patch-1079/screenshots/mobile_castle_gameplay.png`
- `reports/patch-1079/screenshots/mobile_outrun_gameplay.png`
- `reports/patch-1079/screenshots/mobile_paperboy_gameplay.png`
- `reports/patch-1079/screenshots/mobile_clear_score_replay.png`
- `reports/patch-1079/screenshots/mobile_boss_clear_score_replay.png`

## Logs

- `reports/patch-1079/logs/ui-regression-results.json`
- `reports/patch-1079/logs/console-summary.txt`
- `reports/patch-1079/logs/network-summary.txt`

## Limites

- Test public limite au chargement de l'URL publique; le runtime local reste la source de verite pour le commit courant.
- OutRun traffic car a ete force dans l'etat runtime Playwright pour eviter l'aleatoire de spawn dans une capture courte.
- Les warnings console observes sont des warnings WebGL de capture headless, pas des erreurs applicatives.
