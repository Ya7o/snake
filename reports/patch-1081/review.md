# Review — PATCH 1081

## Objectif

Audit du système de scoring pour comprendre pourquoi le score varie peu,
notamment sur Castle / Illusion où plusieurs runs donnent systématiquement 1500 points.
**Aucune modification de code dans ce patch.**

---

## Résultat

Cause confirmée et documentée. Le score est entièrement déterministe
pour 7 niveaux sur 8 (hors Fighter partiel).

**Trouvaille principale :** `TIME_SECOND = 10` est défini dans `SCORE_VALUES`
(constants.ts:31) mais n'est **jamais appliqué** dans le code runtime.
C'est une constante orpheline. Le tickCount est bien incrémenté mais jamais
multiplié par TIME_SECOND pour contribuer à `runtimeScore`.

**Formule réelle pour Castle Illusion :**
```
10 pickups × 100 + STAGE_CLEAR 500 = 1500 (toujours)
```

---

## Fichiers modifiés

Aucun fichier source modifié. Audit uniquement.

**Fichiers créés :**
- `reports/patch-1081/review.md`
- `reports/patch-1081/docs/score-variability-audit.md`
- `reports/patch-1081/logs/score-runs.json`
- `reports/patch-1081/logs/score-formula-notes.txt`

---

## Tests / vérifications

```
npm run check
→ 0 erreur TypeScript
→ 60 modules transformés
→ Build en 23.72s
→ Warning chunk > 500kB : attendu, non bloquant
```

---

## Captures

Aucune capture visuelle (audit pur code + formules).

---

## Documents

- `docs/score-variability-audit.md` — audit complet avec formules, table des runs,
  diagnostic et options d'amélioration priorisées.
- `logs/score-runs.json` — 8 runs simulés/calculés : castle ×3, sonic ×1,
  fighter ×2 (avec et sans charge), castle_boss ×1, paperboy ×1.
- `logs/score-formula-notes.txt` — notes brutes sur les deux compteurs
  (this.score vs this.runtimeScore) et les dead constants.

---

## Limites / risques

- Les runs `score-runs.json` sont calculés par analyse statique du code,
  pas par exécution automatisée (pas de Playwright requis pour un audit no-code).
  Les formules sont vérifiables ligne par ligne dans le code source.
- La variabilité du Fighter (900–1300) dépend de la fréquence réelle d'activation
  de la charge — estimée mais non mesurée sur partie réelle.
- Le mécanisme Sonic (ringChains) pourrait avoir une pénalité chaîne qui affecte
  `this.score` (progrès) mais pas `runtimeScore` — à vérifier si un ticket
  de correction de score Sonic est planifié.

---

## Diagnostic en bref

| Cause | Détail |
|---|---|
| TIME_SECOND mort | Constante jamais appliquée au runtime |
| Quota exact = fin de partie | Impossible de collecter plus de pickups que le quota |
| Mécaniques ≠ runtimeScore | Les `update.score` vont au progrès, pas au score visible |
| Pas de bonus temps | tickCount existe mais n'est pas passé à ClearScene |
| Pas de bonus longueur | Longueur serpent non utilisée en scoring |

---

## Options recommandées (court terme)

1. **Bonus temps** — passer `tickCount` à `triggerClear()`, appliquer `TIME_SECOND`.
   Effort faible, impact élevé. TIME_SECOND est déjà prêt.
2. **Bonus longueur serpent** — `(snakeLength - 5) × 50`.
   Effort minimal, pas de refactor.
3. **Détail score ClearScene** — afficher la décomposition.
   Quick win UI sans toucher au calcul.

---

## Liens GitHub

À compléter après push.
