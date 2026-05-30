# PATCH 1062 — Mobile Clear Screen Title Fit Fix

## Probleme observe

Sur mobile portrait (ex. 360x640), l'ecran de clear presentait deux anomalies :

1. **Debordement horizontal du titre** — Le texte du titre sortait du cadre.
2. **Rendu degrade du E accent** — La police pixel "Press Start 2P" ne contient pas de glyphes accentues ; le E dans NIVEAU REUSSI tombait en fallback systeme, produisant un rendu incoherent.

## Cause racine

Dans `ClearScene.ts`, le titre de clear utilisait :

```typescript
fontSize: `${titleFontSize}px`  // avant : Math.min(28, Math.floor(W * 0.08))
```

Sur un ecran de 360px de large : min(28, 28.8) = 28px.

La police "Press Start 2P" etant monospace, chaque glyphe occupe environ fontSize px en largeur.
"NIVEAU REUSSI" = 13 caracteres -> 13 x ~26px = ~338px, quasi egal a la largeur de l'ecran, sans marges.

Le strokeThickness: 3 (non-castle) aggravait le debordement apparent.

## Fix applique

**Fichier modifie :** `src/scenes/ClearScene.ts`

### 1. Variable partagee pour la taille du titre

```typescript
const titleFontSize = Math.min(22, Math.floor(W * 0.058));
```

Les deux occurrences (shadow + texte principal) utilisent cette variable.

Nouvelles valeurs sur mobile :

| Largeur | Avant | Apres |
|---------|-------|-------|
| 320px   | 25px  | 18px  |
| 360px   | 28px  | 20px  |
| 375px   | 28px  | 21px  |
| 768px   | 28px  | 22px  |

### 2. Suppression de l'accent non supporte

```
Avant : 'NIVEAU REUSSI' (avec E accent)
Apres : 'NIVEAU REUSSI' (sans accent)
```

"Press Start 2P" ne contient pas de E accent. Le retrait garantit un rendu coherent dans tous les univers.

## Ecrans couverts

La variable `title` est unique dans `ClearScene.create()` et s'applique a tous les univers (Sonic, Castle, autres). La correction est effective sur tous les clear screens.

Les textes accentues dans les subtitles (CHÂTEAU DEBLOQUES, TERMINE, etc.) utilisent UI_FONT (Arial) et n'ont pas de probleme de rendu.

## Tests

- `npm run check` (tsc + vite build) : **OK**
- Aucune regression dans d'autres scenes
