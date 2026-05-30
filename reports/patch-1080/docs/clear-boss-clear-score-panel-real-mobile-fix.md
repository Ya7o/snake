# Clear/Boss Clear Score Panel Real Mobile Fix

## Problème

### 1. Panneau score trop petit et texte débordant

`scorePanelH` était fixé à `isNewRecord ? 62 : 46` pixels. Avec le texte NOUVEAU RECORD positionné à `scoreY + 29` et une hauteur de rendu ~16px, le bas du texte dépassait le bas du panneau de ~6px sur tous les mobiles.

De plus, `scoreY` était à `H * 0.405`, ce qui plaçait le haut du panneau (`scoreY - 31 = H*0.405 - 31`) dans la zone du badge boss (`H*0.36 ± 11`), créant un chevauchement visuel sur tout écran H < 1222px.

### 2. PROCHAIN au milieu de l'écran

Le texte `PROCHAIN : ...` était rendu à `actionTextY = H * 0.555`, c'est-à-dire entre le panneau score et le bouton CONTINUER. L'utilisateur souhaitait qu'il soit positionné sous CONTINUER, lié visuellement à l'action.

## Changement

| Fichier | Changement | Raison |
|---|---|---|
| `src/scenes/ClearScene.ts` | `scorePanelH` : 62/46 → 88/62 | Contenir les 3 lignes sans débordement |
| `src/scenes/ClearScene.ts` | `scoreY` : H×0.405 → H×0.49 | Éviter chevauchement avec badge boss |
| `src/scenes/ClearScene.ts` | Positions texte score : -12/+9/+29 → -20/+4/+30 | Centrage propre dans le nouveau panel |
| `src/scenes/ClearScene.ts` | `actionTextY` : H×0.555 → H×0.62 | Repositionner "TOUS LES MONDES" en cas de fin de jeu |
| `src/scenes/ClearScene.ts` | `continueButtonY` : H×0.635 → H×0.63 | Légère remontée pour libérer espace PROCHAIN |
| `src/scenes/ClearScene.ts` | `replayButtonY` : H×0.725 → H×0.76 | Descente pour accueillir PROCHAIN sous CONTINUER |
| `src/scenes/ClearScene.ts` | `mapButtonY` : H×0.815 → H×0.85 | Idem, cohérence espacement |
| `src/scenes/ClearScene.ts` | `PROCHAIN` : déplacé de actionTextY → `continueButtonY + primaryButtonH/2 + 18` | Sous CONTINUER comme demandé |
| `src/scenes/ClearScene.ts` | Séparateur : H×0.68 → H×0.71 | Aligné sur le nouvel espacement boutons |

## Layout final

```
[H * 0.24]  Titre (BOSS VAINCU / NIVEAU REUSSI) — pulsant
[H * 0.36]  Sous-titre / badge boss
[H * 0.49]  Panneau score (centre)
               ├─ [H*0.49 - 20]  SCORE : xxxx
               ├─ [H*0.49 + 4 ]  BEST  : xxxx
               └─ [H*0.49 + 30]  NOUVEAU RECORD  (si applicable)
[H * 0.63]  Bouton CONTINUER
[cont + 43]  PROCHAIN : [nom niveau suivant]
[H * 0.71]  ─── séparateur ───
[H * 0.76]  Bouton REJOUER
[H * 0.85]  Bouton CARTE
```

Pour `isShortPortrait` (H < 700) : scoreY = H×0.47, continueButtonY = H×0.64.

## Vérifications

- **Sonic Boss Clear (390×844)** : SCORE/BEST/NOUVEAU RECORD entièrement dans le panneau, PROCHAIN sous CONTINUER ✓
- **Castle Clear (390×844)** : Layout clean, BOSS DU CHÂTEAU DÉBLOQUÉ + score + CONTINUER + PROCHAIN ✓
- **Castle Boss Clear (390×844)** : MONDE 1 TERMINÉ, NOUVEAU RECORD contenu, boutons lisibles ✓
- **Nouveau record (Sonic Normal, 390×844)** : 3 lignes score sans débordement ✓
- **Desktop (1280×720)** : Adaptation correcte au viewport large ✓
- **mobile (412×915)** : Capturé et validé ✓

## Risques

- **Petits viewports (H < 600)** : Le gap entre badge boss et panneau score peut descendre à ~5px (no record) ou être très juste pour record + isShortPortrait. Cas rare (vieilles tablettes).
- **Textes longs** : `addFittedText` réduit automatiquement la fonte jusqu'à 10px si le texte dépasse `scoreMaxTextW`. Noms de niveaux très longs peuvent être tronqués par la fonte min.
- **Dernier niveau (sans next)** : Le bloc "TOUS LES MONDES TERMINÉS" est à H×0.62, entre panneau score et REJOUER — testé visuellement OK.
