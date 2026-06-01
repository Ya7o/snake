# Review — PATCH 1105

## Objectif
Créer une capsule HUD dédiée au score pendant le gameplay, distincte de HP/progression.
Avant : `HP 2/3·1200` dans une seule capsule droite.
Après : `HP 2/3` dans une capsule progression + `1200` dans une capsule score séparée.

## Résultat
HUD passe de 3 capsules à 4 capsules :
- Capsule univers (gauche)
- Capsule règle (centre)
- Capsule progression/HP (nouveau, à droite du centre)
- Capsule score runtime (extrême droite, texte doré)

## Fichiers modifiés
- `src/render/HUDRenderer.ts` — refactoring 4-capsule layout

## Tests / vérifications

### npm run check
```
✓ 61 modules transformed.
✓ built in 11.56s
0 erreur TypeScript
Warning chunk > 500 kB : attendu, non bloquant.
```

### Non-régression
- `GameScene.ts` non modifié — signature `update()` identique.
- Score calculation inchangée.
- Best score storage inchangé.
- Clear / GameOver inchangés.
- System screen inchangé.
- Assets inchangés.

### Cas testés (structurel)
| Cas | Résultat |
|-----|----------|
| Niveau normal quota=10 | `4/10` · `1200` |
| Boss HP 2/3 | `HP 2/3` · `750` |
| Score 0 | `4/10` · `0` |
| Score 4 chiffres | `4/10` · `1200` |
| Score 5 chiffres | auto-shrink font si overflow |

## Captures
Captures Playwright non disponibles sans serveur actif.

## Documents
- `docs/dedicated-score-hud-capsule.md`

## Limites / risques
- Test sur device physique non effectué.
- Capsule centre légèrement réduite (~134px à w=390 au lieu de ~176px) — les règles longues
  bénéficient du `fitCenter()` auto-shrink déjà présent.
- Scores > 9999 auto-shrinkent à CAPTION_MIN (11px) par le guard `progressTxt.width`.

## Liens GitHub
À compléter après push.
