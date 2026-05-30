# Review

## Objectif

Auditer les bugs de layout Clear/Boss Clear apres ajout du score.

## Resultat

Audit visuel effectue sur Clear normal Castle, Boss Clear Sonic avec `?unlockAll=1`, GameOver Sonic, puis comparaison desktop.

Problemes observes :

- le debordement hors viewport/cadre n'a pas ete reproduit en 390x844 ;
- le bloc score est trop serre quand `NOUVEAU RECORD` est affiche ;
- l'annonce du niveau suivant est confirmee comme mal placee : elle apparait au centre, juste sous le bloc score, avec environ 5 px seulement entre `NOUVEAU RECORD` et le nom du prochain niveau ;
- le meme empilement compact existe en desktop 1280x720, donc la cause est le layout global plus qu'un bug strictement mobile.

Verdict audit : PASS avec reserve.

## Fichiers modifiés

- `reports/patch-1075/review.md`
- `reports/patch-1075/docs/clear-score-layout-audit.md`
- `reports/patch-1075/screenshots/`
- `reports/patch-1075/logs/`

## Tests / vérifications

Commandes lancees :

- `npm run check`
- runtime Playwright Chromium mobile 390x844 sur Clear/Boss Clear/GameOver
- runtime Playwright Chromium desktop 1280x720 sur Clear/Boss Clear

Resultat :

- `npm run check` : OK
- runtime Clear/Boss Clear mobile : PASS avec reserve

Verifications :

- Clear normal capture : oui
- Boss Clear capture : oui
- GameOver capture : oui
- bug texte qui depasse confirme : non, pas hors viewport dans les captures 390x844
- bug annonce niveau suivant confirme : oui

## Captures

- `reports/patch-1075/screenshots/clear_normal_mobile_score.png`
- `reports/patch-1075/screenshots/clear_normal_mobile_score_fullscreen.png`
- `reports/patch-1075/screenshots/boss_clear_mobile_score.png`
- `reports/patch-1075/screenshots/boss_clear_mobile_score_fullscreen.png`
- `reports/patch-1075/screenshots/gameover_mobile_score.png`
- `reports/patch-1075/screenshots/clear_desktop_score.png`
- `reports/patch-1075/screenshots/boss_clear_desktop_score.png`

## Documents

- `reports/patch-1075/docs/clear-score-layout-audit.md`
- `reports/patch-1075/logs/clear-layout-observations.txt`
- `reports/patch-1075/logs/console-summary.txt`
- `reports/patch-1075/logs/network-summary.txt`

## Limites / risques

- Captures effectuees en Chromium headless, pas sur mobile physique.
- Les scenes Clear/GameOver ont ete lancees via l'instance Phaser `window.__SNAKE_GAME__` avec rendu reel des scenes, sans rejouer manuellement tout le gameplay.
- La reproduction boss clear est partielle : etat Boss Clear rendu directement avec donnees de score, `?unlockAll=1` present.
- Correction volontairement reportee au patch suivant.

## Liens GitHub

- Commit :
- PR :
