# Notes techniques — PATCH 1032 Behavioral Test

## Accès à l'objet Phaser

Le jeu expose son instance Phaser via :

```javascript
(window).__SNAKE_GAME__ = game;  // main.ts:55
```

Accès depuis Playwright `page.evaluate()` :

```javascript
const game = window.__SNAKE_GAME__;
const scene = game.scene.getScene('WorldMapScene');
```

Les propriétés TypeScript `private` (ex: `selectedLevelId`, `selectedNodeUnlocked`, `footerLevelTxt`, `nodeObjects`) restent accessibles en JavaScript — TypeScript `private` est une vérification compile-time uniquement.

## Architecture SaveSystem

`src/systems/SaveSystem.ts` initialise deux flags URL au chargement du module :

```javascript
const SESSION_UNLOCK_ALL = _p.get('unlockAll') === '1' || _p.get('debugUnlockAll') === '1';
if (_p.get('resetProgress') === '1') {
  localStorage.removeItem(SAVE_KEY);
}
```

- `?unlockAll=1` → `SESSION_UNLOCK_ALL = true` → `load()` retourne tous les niveaux/nodes débloqués
- `?resetProgress=1` → `localStorage.removeItem` exécuté à l'import → session repart de zéro
- `DEV_UNLOCK_ALL` dans `constants.ts` : `false` (jamais modifié, déverrouillage debug via URL uniquement)

## Comportement des nodes

Dans `WorldMapScene.create()` :

```javascript
const isUnlocked = saveData.unlockedNodes.includes(node.id);
// ...
if (!isUnlocked) {
  drawLockedNodeMarker(lockedGfx, r);  // marqueur visuel rouge/cadenas
}
nodeContainer.on('pointerup', () => this.handleNodeTap(node.levelId, node.id, isUnlocked));
```

Le paramètre `isUnlocked` est capturé dans la closure au moment de la création de la scène. Si `?unlockAll=1`, tous les nodes sont créés avec `isUnlocked=true`.

## Défaut de progression

Sans localStorage, `SaveSystem.load()` retourne :

```javascript
{ clearedLevels: [], unlockedNodes: ['node_1'] }
```

`node_1` = Castle of Illusion (premier node de `MAP_NODES`). Aucun autre node n'est accessible.

## Méthode Playwright

Les tests Playwright tournent en mode headless Chromium dans WSL, viewport 390×844 (portrait mobile). Le dev server Vite tourne en parallèle sur `localhost:5173` dans le même processus bash. La navigation Title→WorldMap utilise un `canvas.click()` (n'importe quelle position sur le canvas déclenche `startGame()`).
