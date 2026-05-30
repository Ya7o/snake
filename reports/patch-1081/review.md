# Review — PATCH 1081

## Objectif

**Phase 1 (audit) :** Comprendre pourquoi le score varie peu sur Castle / Illusion.
**Phase 2 (implémentation) :** Activer le bonus temps déjà prévu par la constante `TIME_SECOND`.

---

## Résultat

### Phase 1 — Audit

Cause confirmée : le score était entièrement déterministe pour 7 niveaux sur 8.

`TIME_SECOND = 10` était défini dans `SCORE_VALUES` (constants.ts:31) mais jamais
appliqué — constante orpheline. Le `tickCount` était bien incrémenté mais jamais
transformé en bonus score.

Formule réelle pour Castle Illusion (avant ce patch) :
```
10 × 100 + 500 = 1500 (toujours)
```

### Phase 2 — Implémentation bonus temps

Le bonus temps est maintenant actif sur tous les niveaux normaux (pas les boss).

```
timeBonus = floor(tickCount × speedMs / 1000) × TIME_SECOND
          = secondes_de_jeu × 10
```

Nouvelle fourchette de score pour Castle Illusion :
- Run rapide (~15s) : 1500 + 150 = **1650**
- Run moyen (~35s) : 1500 + 350 = **1850**
- Run long (~60s) : 1500 + 600 = **2100**

Le score affiché en ClearScene décompose maintenant :
```
SCORE : 1850
+350 TEMPS
BEST : 1850
```

---

## Fichiers modifiés

| Fichier | Modification |
|---|---|
| `src/scenes/GameScene.ts` | `triggerClear()` : calcul `timeBonus`, ajout à `runtimeScore`, passage à ClearScene |
| `src/scenes/ClearScene.ts` | `ClearData` : champ `timeBonus?` ; panneau score : affichage `+X TEMPS` avec layout dynamique |
| `reports/patch-1081/docs/score-variability-audit.md` | Audit source |
| `reports/patch-1081/logs/score-runs.json` | Runs simulés |
| `reports/patch-1081/logs/score-formula-notes.txt` | Notes formule |

---

## Tests / vérifications

```
npm run check (phase 1 — audit only)
→ 0 erreur TypeScript, 60 modules, build en 23.72s

npm run check (phase 2 — implémentation)
→ 0 erreur TypeScript, 60 modules, build en 9.80s
→ Warning chunk > 500kB : attendu, non bloquant
```

---

## Captures

Aucune capture visuelle commitée (tâche non visuelle au sens asset).
Le bonus `+X TEMPS` s'affiche en ClearScene dans la couleur accent de l'univers.

---

## Documents

- `docs/score-variability-audit.md` — audit complet : formules, runs simulés,
  diagnostic, options d'amélioration.
- `logs/score-runs.json` — 8 runs calculés par analyse statique.
- `logs/score-formula-notes.txt` — notes brutes sur les deux compteurs
  (`this.score` vs `this.runtimeScore`) et la dead constant TIME_SECOND.

---

## Limites / risques

- Le bonus temps récompense la survie longue (plus de ticks = plus de bonus),
  pas la rapidité. C'est un choix assumé : il crée de la variabilité sans pénaliser
  le joueur lent, ce qui correspond à la priorité "ne pas durcir le jeu".
- Les boss ne reçoivent pas de bonus temps (`timeBonus = 0` si `isBoss`). Les boss
  sont déjà variables via `BOSS_HIT × nombre de phases`.
- `TIME_SECOND = 10` est petit — sur un run de 60s, le bonus est +600 pts sur une
  base de 1500. L'ordre de grandeur reste cohérent. Si le bonus semble trop faible
  ou trop fort après tests réels, ajuster uniquement la constante `TIME_SECOND`.

---

## Diagnostic en bref (rappel audit)

| Cause | Statut après patch |
|---|---|
| TIME_SECOND mort | Résolu — appliqué dans triggerClear() |
| Quota exact = fin de partie | Inchangé (pas dans scope) |
| Mécaniques ≠ runtimeScore | Inchangé (pas dans scope) |
| Pas de bonus temps | Résolu — actif sur niveaux normaux |
| Pas de bonus longueur | Inchangé (option future) |

---

## Liens GitHub

Commit : à compléter après push.
