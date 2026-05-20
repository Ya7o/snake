Tu dois appliquer le patch suivant au projet Snake Drive V4.

# PATCH — Français + écran d’introduction niveau avec consignes

## Problèmes
Le jeu doit être en français, mais plusieurs textes visibles sont encore en anglais. En plus, le joueur comprend difficilement la mécanique spéciale de chaque niveau ou boss après avoir choisi un niveau.

## Objectif
1. Traduire les textes visibles du jeu en français.
2. Ajouter un écran d’introduction concis avant chaque niveau/boss.
3. Expliquer clairement l’objectif, la mécanique spéciale et une astuce courte.
4. Garder une UX mobile-first : pas de tutoriel long, pas de texte illisible.

## Fichiers à inspecter en priorité
- `src/data/levels.ts`
- `src/data/worlds.ts`
- `src/data/universes.ts`
- `src/scenes/WorldMapScene.ts`
- `src/scenes/GameScene.ts`
- `src/scenes/ClearScene.ts`
- `src/scenes/GameOverScene.ts`
- `src/scenes/TitleScene.ts`
- `src/scenes/MenuScene.ts`
- `src/ui/*`
- `src/config/*`

## À faire
- Centraliser les textes français autant que possible.
- Créer `LevelIntroScene` si elle n’existe pas.
- Après sélection d’un niveau depuis la WorldMap, afficher l’intro avant le gameplay.
- L’intro doit afficher :
  - nom du niveau / univers ;
  - badge `NIVEAU` ou `BOSS` ;
  - objectif ;
  - mécanique spéciale ;
  - astuce courte ;
  - bouton principal `JOUER` ;
  - bouton secondaire `CARTE` si utile.
- Les textes doivent être courts et lisibles sur Android.
- Les boutons doivent être gros et faciles à taper.
- Traduire les boutons principaux :
  - `START` → `JOUER`
  - `NEXT LEVEL` → `NIVEAU SUIVANT`
  - `RETRY` → `REJOUER`
  - `WORLD MAP` → `CARTE`
  - `BACK` → `RETOUR`
  - `LOCKED` → `VERROUILLÉ`
  - `LEVEL COMPLETE` → `NIVEAU TERMINÉ`
  - `GAME OVER` → `PERDU`
  - `BOSS` peut rester `BOSS`

## Textes recommandés
Utilise les textes du ticket `922_PATCH_FRENCH_INTRO_INSTRUCTIONS_BY_LEVEL.md`.

## Contraintes
- Ne supprime aucun univers, niveau ou boss.
- Ne modifie pas le gameplay Snake.
- Ne refais pas la WorldMap.
- Ne crée pas de HTML monofichier.
- N’ajoute pas de dépendance.
- Mobile Android prioritaire.
- Typographie fonctionnelle nette.
- Texte concis : 2 à 4 lignes utiles maximum.

## Tests à faire
```bash
npm run check
npm run build
npm run preview -- --host 0.0.0.0
```

Vérifie manuellement :
- tous les boutons principaux sont en français ;
- WorldMap → niveau ouvre l’intro ;
- intro → `JOUER` lance le bon niveau ;
- intro boss affiche une consigne boss ;
- `CARTE` revient à la WorldMap ;
- les textes tiennent sur écran Android portrait ;
- aucun texte anglais évident ne reste sur les scènes principales.

## Rapport final obligatoire
Liste :
1. Fichiers modifiés.
2. Où sont stockés les textes français.
3. Comment fonctionne `LevelIntroScene`.
4. Règle WorldMap → intro → gameplay.
5. Textes boss ajoutés.
6. Tests effectués.
7. Questions / blocages.
