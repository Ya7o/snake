# PATCH 1009 — Streets Pressure Zone Readability

## Objectif
Rendre la phase pressure du boss Streets (Crime Lord) plus lisible et moins injuste sur mobile portrait.

## Problème
Avant ce patch, la phase pressure couvrait une rangée entière de la grille (largeur = gridCols, soit 100 % de la largeur). Sur mobile portrait, cela laissait **zéro voie d'évitement**, rendant la phase potentiellement injuste et illisible.

## Changements

| Élément | Avant | Après |
|---|---|---|
| **Fichier modifié** | `src/mechanics/bosses/CrimeLordBoss.ts` | `src/mechanics/bosses/CrimeLordBoss.ts` |
| **Méthode modifiée** | `spawnPressure()` | `spawnPressure()` |
| **Largeur danger** | `gridCols` (100 %) | `max(4, floor(gridCols × 0.6))` (~60 %) |
| **Position start** | toujours col 0 | random dans `[0, gridCols - dangerWidth]` |
| **Voie d'évitement** | aucune | au moins ~40 % de la largeur libre |

### Code avant
```typescript
private spawnPressure(): void {
  this.pressureZones = [];
  const row = Math.floor(Math.random() * this.ctx.grid.rows);
  for (let c = 0; c < this.ctx.grid.cols; c++) {
    this.pressureZones.push({ col: c, row });
  }
}
```

### Code après
```typescript
private spawnPressure(): void {
  this.pressureZones = [];
  const row = Math.floor(Math.random() * this.ctx.grid.rows);
  // Partial-width pressure zone (~60%) to leave at least one escape lane
  const dangerWidth = Math.max(4, Math.floor(this.ctx.grid.cols * 0.6));
  const startCol = Math.floor(Math.random() * (this.ctx.grid.cols - dangerWidth + 1));
  for (let c = startCol; c < startCol + dangerWidth; c++) {
    this.pressureZones.push({ col: c, row });
  }
}
```

## Règles conservées
- pas de nouvelle mécanique
- pas de changement HP boss
- pas de changement niveau
- pas de changement asset
- pas de changement audio
- pas de changement GameScene
- autres boss inchangés
- hints HUD conservés (`DANGER` / `FENÊTRE`)

## Critères d'acceptation
- [x] `npm run build` OK
- [x] pressure zone ne couvre plus toute la largeur (~60 % seulement)
- [x] au moins une voie d'évitement existe (~40 % de la grille libre)
- [x] position de la zone est aléatoire pour varier le challenge
- [x] phase vulnerable reste inchangée
- [x] hints HUD conservés (`DANGER` pendant pressure, `FENÊTRE` pendant vulnerable)
- [x] aucun autre boss modifié
- [x] `gridCols < 7` → dangerWidth minimum 4 (plancher de sécurité)
