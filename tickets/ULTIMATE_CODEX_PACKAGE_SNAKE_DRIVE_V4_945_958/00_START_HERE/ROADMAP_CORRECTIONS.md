# ROADMAP CORRECTIONS CODEX — Snake Drive V4

## Lot A — Textes français visibles
Objectif :
- corriger anglais visible ;
- raccourcir microcopy mobile ;
- uniformiser boutons.

Fichiers probables :
- `src/scenes/TitleScene.ts`
- `src/scenes/WorldMapScene.ts`
- `src/scenes/LevelIntroScene.ts`
- `src/scenes/ClearScene.ts`
- `src/scenes/GameOverScene.ts`

Tests :
```bash
npm run check
npm run build
```

## Lot B — Robustesse edge cases
Objectif :
- refresh pendant niveau ;
- localStorage vide/corrompu ;
- asset manquant ;
- retour onglet ;
- resize.

Fichiers probables :
- `src/scenes/GameScene.ts`
- `src/scenes/WorldMapScene.ts`
- systèmes de progression/sauvegarde.

## Lot C — QA GameScene assets runtime
Objectif :
- vérifier que pickup / obstacle / boss s’affichent en jeu ;
- tailles cellule :
  - pickup : 0.65–0.75 ;
  - obstacle : 0.75–0.90 ;
  - boss : 1.0–1.15.

Fichiers probables :
- `src/scenes/GameScene.ts`
- `src/systems/RuntimeAssetResolver.ts`
- `src/assets/runtimeUniverseAssets.ts`

## Lot D — Gameplay balance
Objectif :
- tester difficulté 16 niveaux ;
- ajuster vitesse, objectifs, obstacles ;
- éviter morts injustes.

## Lot E — Mécaniques par univers
Objectif :
- chaque univers doit se jouer différemment ;
- renforcer feedback si la mécanique est trop discrète.

## Lot F — Progression / sauvegarde / WorldMap
Objectif :
- unlock clair ;
- progression persistante ;
- save robuste ;
- retour WorldMap clair.

## Lot G — Nettoyage assets résiduels
Objectif :
Supprimer ou archiver hors runtime :
```txt
public/assets/external/_audit
public/assets/external/_sources
public/assets/external/_licenses
```

## Lot H — Packaging web / release candidate
Objectif :
- dist propre ;
- favicon / metadata ;
- cache ;
- release candidate uniquement après QA Android réelle.
