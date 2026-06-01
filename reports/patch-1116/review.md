# Review — PATCH 1116

## Objectif
Corriger les 7 problèmes identifiés dans l'audit PATCH 1110 (écrans + score) :
SCR-01 PROTOTYPE BUILD · SCR-02 typo RÉUSSI · SCR-03/04 breakdowns score · SCR-05 cause text GameOver · SCR-06 tap-anywhere debounce · SCR-07 badge boss doublon.

## Résultat
**7 corrections appliquées. 0 régression.**

| ID | Correction | Fichier |
|---|---|---|
| SCR-01 | Suppression footer "PROTOTYPE BUILD" | TitleScene.ts |
| SCR-02 | `NIVEAU REUSSI` → `NIVEAU RÉUSSI` | ClearScene.ts |
| SCR-03 | Ajout ligne `STAGE +500` dans breakdown score clear | ClearScene.ts |
| SCR-04 | Ajout ligne `VAINCU +1000` dans breakdown score boss | ClearScene.ts |
| SCR-05 | Textes GameOver par univers (FATALITY, CRASH!, K.O.!, etc.) | GameOverScene.ts |
| SCR-06 | Tap-anywhere LevelIntro enveloppé dans `delayedCall(500ms)` | LevelIntroScene.ts |
| SCR-07 | Badge "BOSS VAINCU !" remplacé par nom de l'univers (boss non-Castle) | ClearScene.ts |

## Fichiers modifiés
- `src/scenes/TitleScene.ts`
- `src/scenes/ClearScene.ts`
- `src/scenes/GameOverScene.ts`
- `src/scenes/LevelIntroScene.ts`

## Tests / vérifications
```
npm run check
✓ 0 erreurs TypeScript
✓ 61 modules transformés
⚠ chunk > 500 kB — warning connu non bloquant
✓ built in 10.96s
```

## Captures
Non produites — corrections de texte et de logique score, pas visuellement complexes.

## Détail SCR-03/04
`lineCount` incrémenté de 1 (toujours +1 désormais, ligne clearBonusLabel présente systématiquement).
Pour niveau normal : `STAGE +500` (couleur accentColor).
Pour niveau boss : `VAINCU +1000` (couleur CT.titleClear / accentColor).
La valeur est tirée de `SCORE_VALUES.STAGE_CLEAR` et `SCORE_VALUES.BOSS_CLEAR`.

## Détail SCR-07
Le bloc `badgeGfx` rouge avec "BOSS VAINCU !" supprimé.
Remplacé par `universe.name.toUpperCase()` avec style identique au slot universe non-boss.
Condition : `level?.type === 'boss' && !subTitle && universe && !isCastle`.

## Limites / risques
- Le layout du panneau score ClearScene avec +1 ligne peut serrer légèrement sur H < 700 — à valider en play-test.
- Le délai 500ms LevelIntro n'est pas perceptible à l'usage normal (la scène fade in sur 250ms).

## Liens GitHub
À compléter après push.
