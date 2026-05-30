# PATCH 1071 - Gameplay Screen Frame Decision

**Date :** 2026-05-30  
**Type :** Audit produit / decision layout / coherence visuelle  
**Scope :** Documentation uniquement. Aucun code ou asset modifie.

## Question QA

En QA mobile reelle, la taille apparente de l'ecran de jeu varie selon les univers. Il faut decider si cette difference est :

- un choix voulu pour fitter l'arriere-plan ;
- une inconsistance a harmoniser strictement ;
- une variation artistique a garder ;
- un cas a encadrer par min/max safe area.

## Sources inspectees

- `src/scenes/GameScene.ts`
- `src/render/GridRenderer.ts`
- `src/render/UniverseFrameRenderer.ts`
- `src/config/levels.ts`
- `src/config/constants.ts`
- `src/ui/RuntimeUILayout.ts`
- captures runtime dans `reports/patch-1071/screenshots/`

## Constat technique

La taille de la zone jouable visible est determinee dans `GameScene` par :

- les dimensions de grille : `16x20` pour tous les univers sauf Castle ;
- Castle : `16x26`, donc 6 rangees supplementaires ;
- `FRAME_GRID_WIDTH`, qui limite la largeur utile de la grille par univers ;
- `FRAME_GRID_Y_BIAS`, qui positionne la grille plus haut ou plus bas dans l'espace disponible ;
- `computeGridLayout(...)`, qui calcule `cellSize`, `x`, `y`, largeur et hauteur.

Important : `UniverseFrameRenderer` et `UNIVERSE_FRAME_ASSETS` existent, mais `GameScene` ne les instancie pas. Les PNG dans `public/assets/frames/*/frame.png` ne sont donc pas l'autorite actuelle de la taille gameplay. La frame effective est la grille calculee, plus le fond gameplay full-screen.

## Parametres par univers

```ts
FRAME_GRID_WIDTH = {
  castle: 0.75,
  sonic: 0.94,
  streets: 0.94,
  fighter: 0.94,
  outrun: 0.78,
  shinobi: 0.94,
  kombat: 0.94,
  paperboy: 0.94,
}

FRAME_GRID_Y_BIAS = {
  castle: 0.38,
  sonic: 0.18,
  streets: 0.22,
  fighter: 0.22,
  outrun: 0.42,
  shinobi: 0.22,
  kombat: 0.22,
  paperboy: 0.22,
}
```

Simulation et captures : viewport mobile `390x844`, HUD `56px`, bottom reserve `24px`.

| Univers | Frame gameplay | Taille apparente | Fit background | Lisibilite | Probleme | Recommandation |
|---|---:|---:|---|---|---|---|
| Castle | `16x26`, width `0.75`, yBias `0.38`, cell `18px`, grille `288x468` | Moyenne, plus etroite mais haute | Bon fit : arche/portail central, decor vertical preserve | Correcte : cell plus petite, mais +6 rangees compensent la surface | Variation visible mais intentionnelle | Garder variation artistique |
| Sonic | `16x20`, width `0.94`, yBias `0.18`, cell `23px`, grille `368x460` | Grande, quasi pleine largeur | Bon fit : terrain lumineux, decor visible sous la grille | Tres bonne | Aucun | Reference standard haute |
| OutRun | `16x20`, width `0.78`, yBias `0.42`, cell `19px`, grille `304x380` | Plus petite et plus basse | Bon fit : horizon/route restent visibles, sensation de conduite preservee | Correcte sur `390px`, limite potentielle sous petits ecrans | Cas extreme : environ 68% de la surface standard | Garder, mais surveiller et encadrer par plancher |
| Paperboy | `16x20`, width `0.94`, yBias `0.22`, cell `23px`, grille `368x460` | Grande, standard | Bon fit : decor quartier lisible autour/sous la grille | Tres bonne | Aucun | Maintenir standard |
| Shinobi | `16x20`, width `0.94`, yBias `0.22`, cell `23px`, grille `368x460` | Grande, standard | Bon fit : decor lisible sans sacrifier la grille | Tres bonne | Aucun | Maintenir standard |

Autres univers inspectes par code :

| Univers | Frame gameplay | Taille apparente | Fit background | Lisibilite | Probleme | Recommandation |
|---|---:|---:|---|---|---|---|
| Streets | `16x20`, width `0.94`, yBias `0.22`, cell `23px`, grille `368x460` | Grande, standard | Fit standard | Tres bonne | Aucun | Maintenir |
| Fighter | `16x20`, width `0.94`, yBias `0.22`, cell `23px`, grille `368x460` | Grande, standard | Fit standard | Tres bonne | Aucun | Maintenir |
| Kombat | `16x20`, width `0.94`, yBias `0.22`, cell `23px`, grille `368x460` | Grande, standard | Fit standard | Tres bonne | Aucun | Maintenir |

## Captures

Captures Playwright headless, viewport `390x844`, scene gameplay lancee directement :

- `reports/patch-1071/screenshots/castle_gameplay_390x844.png`
- `reports/patch-1071/screenshots/sonic_gameplay_390x844.png`
- `reports/patch-1071/screenshots/outrun_gameplay_390x844.png`
- `reports/patch-1071/screenshots/paperboy_gameplay_390x844.png`
- `reports/patch-1071/screenshots/shinobi_gameplay_390x844.png`

Les captures confirment la perception QA : Sonic/Paperboy/Shinobi remplissent presque toute la largeur ; Castle parait plus encadre et vertical ; OutRun parait plus compact et plus bas.

## Options evaluees

| Option | Description | Verdict |
|---|---|---|
| Harmoniser strictement | Mettre tous les univers en `16x20`, width `0.94`, yBias commun | Rejete : casserait Castle et OutRun, qui sont construits autour d'un cadrage specifique |
| Garder variations artistiques sans garde-fou | Ne rien changer et ne rien documenter | Rejete : laisse un risque de futurs univers trop petits |
| Imposer min/max safe area | Garder les variations, mais documenter une zone de lisibilite minimale | Retenu |
| Corriger seulement cas extremes | Modifier OutRun maintenant | Non retenu maintenant : OutRun reste lisible sur `390px`, mais c'est le cas a surveiller |

## Decision

**Decision PATCH 1071 : garder les variations artistiques et imposer une safe area documentaire.**

Il ne faut pas harmoniser strictement le viewport gameplay. Les differences sont voulues :

- Castle utilise une grille plus etroite pour rentrer dans un cadre de chateau/portail, avec `16x26` pour compenser la surface jouable.
- OutRun utilise une grille plus etroite et plus basse pour laisser respirer l'horizon et la route.
- Six univers sur huit utilisent deja le standard large `0.94`, donc la coherence globale existe.

## Garde-fous recommandes

Pour les prochains univers ou une future retouche :

- viser `cellSize >= 16px` sur mobile courant ;
- eviter une surface de grille sous environ 70% du standard sans justification artistique explicite ;
- documenter tout `FRAME_GRID_WIDTH < 0.80` comme choix artistique ;
- ne changer OutRun que si une QA sur appareil etroit confirme une perte de lisibilite.

Si OutRun devient un probleme reel sur appareils tres etroits, la correction minimale serait de relever seulement `FRAME_GRID_WIDTH.outrun` de `0.78` vers `0.84`, en gardant `FRAME_GRID_Y_BIAS.outrun = 0.42` pour conserver la composition route/horizon.

## Conclusion

La difference de taille constatee en QA n'est pas un bug generique de viewport. C'est un choix mixte layout/art direction : standard large pour la majorite des univers, frame specifique pour Castle et OutRun. La bonne decision est donc de conserver les variations, de documenter le plancher de lisibilite et de ne corriger que les cas extremes prouves par QA.
