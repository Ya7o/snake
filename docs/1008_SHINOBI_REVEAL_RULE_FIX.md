# PATCH 1008 — Shinobi Reveal Rule Fix

## Objectif

Rendre le vrai clone Shinobi hittable uniquement pendant sa fenêtre de reveal.

## Problème

Avant ce patch, `getWeakPoints()` retournait le vrai clone dès qu'il existait (`cl.real`), sans vérifier s'il était visuellement révélé (`cl.revealed`). La révélation était donc purement cosmétique : le joueur pouvait toucher le vrai ninja à tout moment, vidant la tension de la mécanique.

## Changements

**Fichier modifié :** `src/mechanics/bosses/ShadowNinjaBoss.ts`

### `getWeakPoints()` — lignes 65–67

**Avant :**
```typescript
getWeakPoints(): Cell[] {
  return this.clones.filter(cl => cl.real).map(cl => cl.cell);
}
```

**Après :**
```typescript
getWeakPoints(): Cell[] {
  return this.clones.filter(cl => cl.real && cl.revealed).map(cl => cl.cell);
}
```

### `onWeakPointHit()` — ligne 70 (garde défensive)

**Avant :**
```typescript
const clone = this.clones.find(cl => cl.real && cl.cell.col === cell.col && cl.cell.row === cell.row);
```

**Après :**
```typescript
const clone = this.clones.find(cl => cl.real && cl.revealed && cl.cell.col === cell.col && cl.cell.row === cell.row);
```

La garde dans `onWeakPointHit` est redondante avec `getWeakPoints` mais protège contre tout appel direct hors cycle normal.

## Cycle résultant

| État | Faux clones | Vrai clone (weakpoint) | HUD |
|------|------------|------------------------|-----|
| reveal = false | DANGER | — non hittable | OBSERVE |
| reveal = true (6 ticks) | DANGER | ✓ hittable | FRAPPE |

Le reveal se déclenche toutes les 28 ticks (`revealInterval`), dure 6 ticks (`revealTicks`). Fenêtre ≈ 21 % du cycle.

## Règles conservées

- pas de nouvelle mécanique
- pas de changement HP (toujours 3)
- pas de changement nombre de clones (2 + phase)
- pas de changement revealInterval (28 ticks) ni revealTicks (6 ticks)
- pas de changement d'asset
- pas de changement audio
- GameScene.ts non modifié
- aucun autre boss modifié

## Critères d'acceptation

- [x] npm run build OK (0 erreur TypeScript)
- [x] `getWeakPoints()` retourne `[]` hors reveal
- [x] `getWeakPoints()` retourne le vrai clone pendant reveal
- [x] faux clones restent dangereux (getDangerCells inchangé)
- [x] HUD OBSERVE / FRAPPE cohérent (getHudExtra inchangé, dépend de `cl.revealed`)
- [x] aucun autre boss modifié
