# Progression State Assertion — Analyse Statique

## Source analysées

- `src/systems/SaveSystem.ts`
- `src/scenes/WorldMapScene.ts`
- `src/config/mapNodes.ts`
- `src/config/levels.ts`
- `src/config/constants.ts`

---

## Assertions statiques

### 1. Castle accessible par défaut : OUI

`SaveSystem.defaultSave()` retourne `{ clearedLevels: [], unlockedNodes: [firstNodeId()] }`.

`firstNodeId()` retourne `MAP_NODES[0]?.id` qui est `'node_1'`.

`MAP_NODES[0]` : `{ id: 'node_1', levelId: 'castle_normal', ... }`.

→ Castle level normal est toujours débloqué à l'état initial.

### 2. Tous les autres mondes verrouillés par défaut : OUI

`defaultSave()` ne met que `node_1` dans `unlockedNodes` et `[]` dans `clearedLevels`.

Les nodes 2–16 (sonic, streets, fighter, outrun, shinobi, kombat, paperboy + tous les boss) sont verrouillés.

`WorldMapScene.create()` lit `SaveSystem.load()` → `saveData.unlockedNodes` et affiche `drawLockedNodeMarker()` sur les nodes absents.

### 3. Unlock all via `?unlockAll=1` : OUI (session only)

Dans `SaveSystem.ts` (ligne 10) :
```ts
const SESSION_UNLOCK_ALL = _p.get('unlockAll') === '1' || _p.get('debugUnlockAll') === '1';
```

`SaveSystem.load()` retourne tous les levels + tous les nodes quand `SESSION_UNLOCK_ALL` est `true`.

`SaveSystem.save()` retourne **immédiatement** si `SESSION_UNLOCK_ALL` (ligne 72) — **aucune écriture localStorage**.

`markCleared()` retourne aussi immédiatement (ligne 81).

→ `?unlockAll=1` est entièrement session-only, sans pollution de localStorage.

### 4. Reset progress via `?resetProgress=1` : OUI

Ligne 11–13 de `SaveSystem.ts` (module-level) :
```ts
if (_p.get('resetProgress') === '1') {
  try { localStorage.removeItem(SAVE_KEY); } catch { /* noop */ }
}
```

S'exécute à l'import du module, avant tout rendu Phaser. La clé `snakeDriveV4_save` est supprimée du localStorage.

### 5. localStorage non pollué par unlock all : OUI

Voir point 3. Les trois méthodes `save()`, `markCleared()` et `load()` ont toutes une garde sur `SESSION_UNLOCK_ALL` qui empêche toute écriture quand le mode session est actif.

### 6. Aucun bouton public "unlock all" : OUI

`WorldMapScene.updateFooterButton()` (ligne 437–439) est un **no-op** explicite :
```ts
private updateFooterButton(_isUnlocked: boolean, _accent: string): void {
  // no button — launch via double-tap on node
}
```

Aucun autre élément interactif ne expose l'URL `?unlockAll=1` dans l'UI.

---

## Clé localStorage

`snakeDriveV4_save` — définie dans `SaveSystem.ts` ligne 4.

Structure : `{ clearedLevels: string[], unlockedNodes: string[] }`

## Notes

- `DEV_UNLOCK_ALL` dans `constants.ts` est `false` (valeur de prod).
- L'URL `?debugUnlockAll=1` est un alias de `?unlockAll=1`.
- La sanitization via `sanitizeSave()` filtre les IDs invalides pour éviter la corruption.
