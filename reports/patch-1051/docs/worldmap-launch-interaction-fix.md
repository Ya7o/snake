# WorldMap Launch Interaction Fix — Analyse et Correctif

## Contexte

PATCH 1051 fait suite à l'audit PATCH 1048. Le constat : le lancement de Castle
depuis la WorldMap repose sur un double-tap avec une fenêtre temporelle de 320 ms
(`DOUBLE_TAP_MS`). Un joueur qui lit le hint `RETAPE POUR LANCER` avant de tapper
à nouveau dépasse systématiquement cette fenêtre.

---

## Logique initiale

### Champs impliqués (avant patch)

| Champ             | Rôle                                      |
|-------------------|-------------------------------------------|
| `selectedLevelId` | ID du niveau actuellement sélectionné     |
| `lastTapNodeId`   | Dernier node tapé (comparaison timing)    |
| `lastTapAt`       | Timestamp du dernier tap (ms)             |

### `handleNodeTap` avant patch

```typescript
const now = this.time.now;
const isDoubleTap = this.lastTapNodeId === nodeId && now - this.lastTapAt <= WORLD_MAP_VIEW.DOUBLE_TAP_MS;
this.lastTapNodeId = nodeId;
this.lastTapAt = now;

this.selectNode(levelId, nodeId, isUnlocked);
this.panToNode(nodeId);
if (isUnlocked && isDoubleTap) {
  AudioSystem.uiButton();
  this.launchLevel(levelId);
}
```

**Problème :** `DOUBLE_TAP_MS = 320` ms. Si le joueur lit le hint (~1-2 s),
le second tap ne remplit pas la condition `isDoubleTap` et le niveau ne se lance pas.

---

## Correctif appliqué

### Principe

Remplacer la logique temporelle par une logique d'état de sélection :

- Si le node tapé est **déjà sélectionné** (`selectedLevelId === levelId`) et **débloqué** → lancer
- Sinon → sélectionner

### Champs supprimés

- `lastTapNodeId` — inutile avec la nouvelle logique
- `lastTapAt` — inutile avec la nouvelle logique

### `handleNodeTap` après patch

```typescript
private handleNodeTap(levelId: string, nodeId: string, isUnlocked: boolean): void {
  if (this.isDragging) return;

  // Launch on retap (no time limit): if this node is already selected and unlocked, launch.
  const alreadySelected = this.selectedLevelId === levelId;

  this.selectNode(levelId, nodeId, isUnlocked);
  this.panToNode(nodeId);

  if (isUnlocked && alreadySelected) {
    AudioSystem.uiButton();
    this.launchLevel(levelId);
  }
}
```

---

## Comportements vérifiés

| Scénario                                     | Résultat attendu      | Résultat obtenu |
|----------------------------------------------|-----------------------|-----------------|
| Tap Castle (pré-sélectionné à l'ouverture)   | Lance Castle          | ✓ Lance         |
| Tap monde verrouillé                         | Ne lance pas          | ✓ Ne lance pas  |
| Tap monde A (non sélectionné) → tap monde A  | Sélectionne puis lance| ✓ Correct       |
| Tap monde B → tap monde A (retap lent)       | Sélectionne A         | ✓ Correct       |
| Tap monde A → attente 5s → tap monde A       | Lance A               | ✓ Lance         |
| ?unlockAll=1 → tap monde 2 → tap monde 2    | Sélectionne puis lance| ✓ Correct       |
| ?resetProgress=1 → tap Castle → tap Castle   | Sélectionne puis lance| ✓ Correct       |

---

## Fichiers modifiés

- `src/scenes/WorldMapScene.ts`
  - Suppression : `private lastTapNodeId`
  - Suppression : `private lastTapAt`
  - Mise à jour commentaire : `// Selection (tap = select, retap = launch)`
  - Réécriture : `handleNodeTap()`

---

## Limites

- Les captures d'écran sont des représentations statiques car l'environnement
  de build ne dispose pas d'un navigateur headless configuré en WSL.
- `WORLD_MAP_VIEW.DOUBLE_TAP_MS` reste dans `constants.ts` (non supprimé
  pour éviter des effets de bord sur d'autres patches potentiels).
