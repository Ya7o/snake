# PATCH 1010 — OutRun Turbo Rival Clarification

## Objectif
Rendre le boss OutRun plus lisible : rival danger clair, turboZone weakpoint clair, lanes compréhensibles.

## Problème
Avant ce patch :
- Le rival se déplaçait de manière aléatoire colonne par colonne (`col ± 1` à chaque test), sans notion de lane.
- `getDangerCells()` retournait une liste **vide** lorsqu'une turboZone existait au row+1 du rival. Le rival devenait donc non-danger pendant la fenêtre d'attaque, ce qui était contre-intuitif et difficile à lire.
- La turboZone apparaissait en `row + 1` (sous le rival), rendant le rapport rival/zone visuellement ambigu.

## Changements

### Fichier modifié
`src/mechanics/bosses/TurboRivalBoss.ts`

### Méthode `onInit()`
**Avant :** `rivalCell` initialisé à `col = cols/2`, aucune structure de lane.  
**Après :** Calcul de 3 lanes fixes :
- Lane 0 (gauche)  : `col = Math.floor(cols / 4)`
- Lane 1 (centre)  : `col = Math.floor(cols / 2)`
- Lane 2 (droite)  : `col = Math.floor(3 * cols / 4)`

Le rival est placé en lane 1 (centre) au démarrage.

### Méthode `tick()`
**Avant :** `col ± 1` aléatoire toutes les 5 ticks — rival pouvait atteindre n'importe quelle colonne.  
**Après :** Changement de lane (`rivalLane ± 1`, clampé 0–2`) toutes les 8 ticks. Le rival ne se déplace que vers les 3 colonnes de lane définies.

**TurboZone :**  
**Avant :** Apparaissait à `row + 1` (sous le rival), TTL 10.  
**Après :** Apparaît à `row - 1` (devant / au-dessus du rival, dans la direction de déplacement du snake), TTL 12. Règle de même lane conservée (col == rivalCell.col).

### Méthode `getDangerCells()`
**Avant :**
```ts
const inTurbo = this.turboZones.some(tz => tz.cell.col === this.rivalCell.col && tz.cell.row === this.rivalCell.row + 1);
return inTurbo ? [] : [{ ...this.rivalCell, source: 'turboRival', lethal: true }];
```
Le rival n'était **pas** danger quand une turboZone existait — logique confuse.

**Après :**
```ts
return [{ ...this.rivalCell, source: 'turboRival', lethal: true }];
```
Le rival est **toujours** danger. Entrer sur sa cellule est toujours létal.

### Méthode `getWeakPoints()`
Inchangée — retourne les cellules turboZone actives.

### Règle danger
Le rival est toujours une cellule de danger létale, indépendamment de l'état des turboZones.

### Règle weakpoint
La turboZone est le seul weakpoint. Pour toucher le boss, le snake doit entrer sur une cellule turboZone active.

### Règle lanes
Le rival se déplace uniquement entre 3 colonnes prédéfinies (gauche / centre / droite), calculées depuis `grid.cols`. Aucune dépendance sur `OutRunLaneMechanic` — logique locale autonome.

### Méthode `getHudExtra()`
**Avant :** `'TURBO'` / `'ÉVITE'`  
**Après :** `'TURBO → FRAPPE'` quand turboZone active, `'ÉVITE'` sinon. Les 3 intentions (évite / turbo / frappe) sont conservées, condensées en 2 états HUD clairs.

## Règles conservées
- Pas de nouvelle mécanique lourde
- Pas de changement HP boss
- Pas de changement niveau
- Pas de changement asset
- Pas de changement audio
- Pas de changement GameScene
- Autres boss inchangés
- Pas de projectiles ajoutés
- Pas d'IA complexe ajoutée
- Pas de nouvelle dépendance

## Critères d'acceptation
- [x] `npm run build` OK — 0 erreur TypeScript, 60 modules
- [x] Rival se déplace sur 3 lanes compréhensibles (gauche / centre / droite)
- [x] Rival est danger de manière cohérente (toujours létal)
- [x] TurboZone est le weakpoint exclusif, positionnée devant le rival
- [x] HUD hint conservé (`ÉVITE` / `TURBO → FRAPPE`)
- [x] Aucun autre boss modifié
