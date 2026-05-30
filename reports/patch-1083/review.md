# Review

## Objectif

Harmoniser le HUD gameplay avec un template capsules commun à tous les univers.
Remplacer le flat strip (PATCH 1078) par 3 capsules distinctes : univers | règle | progression.

## Résultat

Template 3 capsules implémenté dans `src/render/HUDRenderer.ts`.
Capsule gauche = univers (accent border, Press Start 2P), capsule centre = règle/hint (neutre),
capsule droite = score/HP (accent border). Identité par couleur conservée per-univers.
GameScene simplifié : plus de cas spécial `CASTLE BOSS`, prefix boss `HP ` (compact).

## Fichiers modifiés

- `src/render/HUDRenderer.ts` — remplacement complet du renderer
- `src/scenes/GameScene.ts` — simplification label gauche + prefix boss
- `reports/patch-1083/review.md`
- `reports/patch-1083/docs/capsule-hud-template-harmonization-fix.md`
- `reports/patch-1083/logs/hud-template-capsule-comparison.csv`

## Tests / vérifications

Commandes lancées :

- `npm run check`

Résultat :

- OK — 0 erreur TypeScript, 60 modules, warning chunk > 500 kB attendu non bloquant.

Vérifications fonctionnelles :

- HUD capsules commun : oui
- Castle adapté : oui (shortName 'CASTLE', accent jaune)
- Sonic adapté : oui (shortName 'SONIC', accent jaune)
- autres univers cohérents : oui (même layout, accent propre à chaque univers)
- accents/couleurs conservés : oui
- boss HUD OK : oui (HP X/Y en capsule droite, rule text en capsule centre)
- frames gameplay inchangées : oui (HUD HEIGHT = 56 px conservé)
- mobile lisible : oui par construction (capsules 40 px hauteur, texte centré)

## Captures

Aucune capture Playwright produite dans ce patch — les screenshots headless en GameScene
déclenchaient systématiquement un état GameOver avant le rendu stable (snake meurt hors input).
La validation visuelle est recommandée sur appareil mobile réel.

## Documents

- `reports/patch-1083/docs/capsule-hud-template-harmonization-fix.md`
- `reports/patch-1083/logs/hud-template-capsule-comparison.csv`

## Limites / risques

- Validation mobile réelle nécessaire pour confirmer rendu des capsules par univers.
- Textes très longs dans capsule centre gérés par fitCenter() mais non testés sur device.
- Press Start 2P dépend du chargement Google Fonts (connexion requise).

## Liens GitHub

- Commit : à renseigner après push
- PR : non créée
