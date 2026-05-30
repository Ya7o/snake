# Review

## Objectif

Corriger le layout Clear/Boss Clear avec score et ajouter le bouton REJOUER.

## Resultat

Le layout Clear/Boss Clear regroupe maintenant score, best score et nouveau record dans un bloc compact avec texte ajuste a la largeur disponible. L'annonce du prochain niveau est deplacee au-dessus des actions sous la forme `PROCHAIN : ...`, ce qui libere le centre de l'ecran.

Le bouton `REJOUER` est ajoute entre `CONTINUER` et `CARTE`. Il relance immediatement `SCENES.GAME` avec le meme `levelId`, sans toucher au best score ni a la progression deja acquise.

## Fichiers modifies

- `src/scenes/ClearScene.ts`
- `reports/patch-1076/docs/clear-boss-clear-layout-replay-fix.md`
- `reports/patch-1076/logs/clear-replay-assertions.json`
- `reports/patch-1076/screenshots/clear_normal_mobile_replay.png`
- `reports/patch-1076/screenshots/boss_clear_mobile_replay.png`
- `reports/patch-1076/screenshots/clear_new_record_mobile_replay.png`
- `reports/patch-1076/screenshots/clear_desktop_replay.png`
- `reports/patch-1076/screenshots/replay_same_level_after_tap.png`

## Tests / verifications

Commandes lancees :

- `npm run check`
- Test runtime Playwright local Clear/Boss Clear/replay

Resultat :

- OK
- `npm run check` execute `npm run build`; pas de `npm run build` separe necessaire.
- Vite signale seulement l'avertissement habituel de chunk superieur a 500 kB.

Verifications fonctionnelles :

- score ne deborde plus : oui
- annonce niveau suivant mieux placee : oui
- bouton REJOUER present : oui
- REJOUER relance le meme niveau : oui
- CONTINUER fonctionne : oui
- CARTE fonctionne : oui
- best score conserve : oui
- mobile portrait lisible : oui

## Captures

- `reports/patch-1076/screenshots/clear_normal_mobile_replay.png`
- `reports/patch-1076/screenshots/boss_clear_mobile_replay.png`
- `reports/patch-1076/screenshots/clear_new_record_mobile_replay.png`
- `reports/patch-1076/screenshots/clear_desktop_replay.png`
- `reports/patch-1076/screenshots/replay_same_level_after_tap.png`

## Documents

- `reports/patch-1076/docs/clear-boss-clear-layout-replay-fix.md`

## Limites / risques

- `CONTINUER` depend toujours du prochain element dans `MAP_NODES`.
- Les tests visuels automatises couvrent 390x844, 360x640 et 1280x720 ; les appareils encore plus bas restent a surveiller.
- Le replay repart bien avec un score runtime a zero car une nouvelle `GameScene` est lancee.

## Liens GitHub

- Commit : a renseigner apres push
- PR : non creee
