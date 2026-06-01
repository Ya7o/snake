# System Best Score Preview

## Problème
Le joueur ne voyait pas son record avant de lancer un niveau.
Il devait lancer, perdre, et constater le BEST sur l'écran GameOver/Clear.

## Décision
Afficher le best score en bas du panel info de `LevelIntroScene`,
ancré à `contentBottomY` (bas du panel) pour éviter tout débordement.

## Implémentation

**Fichier modifié :** `src/scenes/LevelIntroScene.ts`

**Ajout :**
```typescript
import { SaveSystem } from '../systems/SaveSystem';

// Dans create() :
const bestScore = SaveSystem.getBestScore(levelId);
const bestLabel = bestScore > 0 ? `BEST  ${bestScore}` : 'BEST  —';
this.add.text(centerX, contentBottomY, bestLabel, {
  fontFamily: UI_FONT,
  fontSize: ...,
  fontStyle: '700',
  color: bestScore > 0 ? '#ffd700' : '#555577',
  align: 'center',
}).setOrigin(0.5, 1).setDepth(10);
```

## Comportement

| Cas | Affichage |
|-----|-----------|
| Record existant | `BEST  2450` (jaune doré) |
| Aucun record | `BEST  —` (gris discret) |

## Non-régression
- `SaveSystem.getBestScore()` : lecture seule, ne modifie aucun stockage.
- Gameplay inchangé.
- Score calculation inchangée.
- HUD in-game inchangé.
- Clear / GameOver inchangés.
- Assets inchangés.

## Limites
- Score affiché sans formatage milliers (cohérent avec ClearScene).
- Pas de test physique device — ancre bottom garantit l'absence de débordement.
