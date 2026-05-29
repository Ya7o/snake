# Snake Drive V4

Prototype amateur jouable — Snake web mobile modern-retro avec Phaser 3, Vite et TypeScript.

## Statut

Prototype stabilisé. Non publié.

## Contenu

- 8 univers (Castle, Sonic, Streets, Fighter, OutRun, Shinobi, Kombat, Paperboy)
- 16 niveaux (2 par univers : normal + boss)
- 8 boss avec mécaniques différenciées
- TitleScene, WorldMap, LevelIntro, GameScene, Clear, GameOver
- Progression locale (localStorage)
- Unlock all discret (debug/démo uniquement)

## Prérequis

- Node.js (WSL recommandé)
- npm

## Installation

```bash
npm install
```

## Développement

```bash
npm run dev
# → http://localhost:5173
```

## Build / vérification TypeScript

```bash
npm run check
```

## Progression

Par défaut le jeu démarre avec Castle accessible. Les autres univers se débloquent au fur et à mesure de la progression.

## Unlock all discret (debug/démo)

```
http://localhost:5173/?unlockAll=1
```

Active tous les mondes pour la session uniquement. Ne modifie pas la sauvegarde normale.

## Reset progression

```
http://localhost:5173/?resetProgress=1
```

Efface le localStorage et repart de zéro.

## Structure

```
src/           — code source TypeScript
public/assets/ — assets runtime
docs/          — documentation projet
reports/       — rapports de patches
scripts/       — scripts utilitaires
```

## Limites connues

- Prototype non optimisé pour production
- Certaines mécaniques boss simplifiées
- Assets partiellement procéduraux
- Pas de backend — progression 100% localStorage

## Stack technique

- Phaser 3
- Vite
- TypeScript strict
- Playwright (tests)

## Credits

Selected emoji/icon assets by OpenMoji, the open-source emoji and icon project.
License: CC BY-SA 4.0.
https://openmoji.org/
