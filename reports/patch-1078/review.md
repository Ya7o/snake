# Review

## Objectif

Harmoniser le HUD gameplay pour renforcer le cote template.

## Resultat

Le HUD gameplay utilise maintenant un seul template : la bande large opaque deja utilisee par les univers non-Castle. Castle n'utilise plus le template isole en trois capsules et conserve son identite via l'accent dore de palette, sa frame et son board panel.

Les informations HUD restent preservees : univers a gauche, regle/hint au centre, score/progression ou boss HP a droite.

## Fichiers modifies

- `src/render/HUDRenderer.ts`
- `src/scenes/GameScene.ts`
- `reports/patch-1078/docs/gameplay-hud-template-harmonization-fix.md`
- `reports/patch-1078/logs/hud-template-comparison.csv`
- `reports/patch-1078/logs/hud-runtime-inspection.json`
- `reports/patch-1078/screenshots/`

## Tests / verifications

Commandes lancees :

- `npm run check`
- Captures runtime Playwright mobile

Resultat :

- OK
- `npm run check` execute `npm run build`; pas de `npm run build` separe necessaire.
- Vite signale seulement l'avertissement habituel de chunk superieur a 500 kB.

Verifications fonctionnelles :

- HUD Castle harmonise : oui
- HUD autres univers conserve/coherent : oui
- couleurs univers preservees : oui
- frame gameplay inchangee : oui
- boss HUD non casse : oui
- mobile lisible : oui

## Captures

- `reports/patch-1078/screenshots/castle_hud_after.png`
- `reports/patch-1078/screenshots/sonic_hud_after.png`
- `reports/patch-1078/screenshots/outrun_hud_after.png`
- `reports/patch-1078/screenshots/paperboy_hud_after.png`
- `reports/patch-1078/screenshots/castle_boss_hud_after.png`
- `reports/patch-1078/screenshots/mobile_hud_after.png`

## Documents

- `reports/patch-1078/docs/gameplay-hud-template-harmonization-fix.md`

## Limites / risques

- Castle perd le langage visuel capsule, remplace par la bande large commune.
- Aucun `hud_panel.png` Castle n'a ete ajoute, conformement a la regle de ne pas modifier les assets.
- Validation mobile reelle recommandee pour l'equilibre couleur/contraste Castle.

## Liens GitHub

- Commit : a renseigner apres push
- PR : non creee
