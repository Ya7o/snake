# Score Variability Audit

**PATCH 1081 — 2026-05-30**
Audit-only. Aucune modification de code.

---

## Problème

Le score affiché en ClearScene est trop constant d'un run à l'autre.
QA mobile : Castle / Illusion donne systématiquement ~1500 points.
Le score ne motive pas la rejouabilité.

---

## Formule actuelle

### Constantes (`src/config/constants.ts:26`)

| Constante      | Valeur | Statut           |
|----------------|--------|------------------|
| PICKUP         | 100    | Actif            |
| STAGE_CLEAR    | 500    | Actif            |
| BOSS_HIT       | 250    | Actif            |
| BOSS_CLEAR     | 1000   | Actif            |
| TIME_SECOND    | 10     | **MORT — jamais appliqué** |

### Deux compteurs distincts (`src/scenes/GameScene.ts`)

| Compteur          | Rôle                              | Ce qui l'incrémente             |
|-------------------|-----------------------------------|---------------------------------|
| `this.score`      | Progrès vers quota (HUD)          | mechanic `update.score`, pickup default (+1) |
| `this.runtimeScore` | Score affiché / sauvegardé      | Events explicites seulement     |

**Point critique :** les `update.score` retournés par les mécaniques vont vers
`this.score` (progrès), **pas** vers `this.runtimeScore` (score visible).

### Événements qui incrémentent `runtimeScore`

| Événement            | Points | Ligne source       |
|----------------------|--------|--------------------|
| Pickup mangé         | +100   | GameScene.ts:396   |
| Boss weak point hit  | +250   | GameScene.ts:527   |
| Stage clear (normal) | +500   | GameScene.ts:588   |
| Boss clear           | +1000  | GameScene.ts:588   |
| **Bonus temps**      | —      | **Absent**         |

---

## Scores par niveau (tous observés ou calculés)

| Niveau           | Quota | Pickups pour clear | Score min | Score max | Variabilité |
|------------------|-------|--------------------|-----------|-----------|-------------|
| castle_normal    | 10    | 10                 | 1500      | 1500      | Zéro        |
| sonic_normal     | 15    | 15                 | 2000      | 2000      | Zéro        |
| streets_normal   | 10    | 10                 | 1500      | 1500      | Zéro        |
| fighter_normal   | 8     | 4 (all charges) – 8 (no charge) | 900 | 1300 | Faible |
| outrun_normal    | 10    | 10                 | 1500      | 1500      | Zéro        |
| shinobi_normal   | 8     | 8                  | 1300      | 1300      | Zéro        |
| kombat_normal    | 10    | 10                 | 1500      | 1500      | Zéro        |
| paperboy_normal  | 8     | 8                  | 1300      | 1300      | Zéro        |
| Tous boss (3HP)  | —     | 0                  | 1750      | 1750      | Zéro        |

---

## Runs observés

| Run | Niveau          | Pickups | Clear | Boss hits | Score | Attendu |
|-----|-----------------|---------|-------|-----------|-------|---------|
| 1   | castle_normal   | 10      | Oui   | 0         | 1500  | 1500    |
| 2   | castle_normal   | 10      | Oui   | 0         | 1500  | 1500    |
| 3   | castle_normal   | 7       | Non   | 0         | 700   | 700     |
| 4   | sonic_normal    | 15      | Oui   | 0         | 2000  | 2000    |
| 5   | fighter_normal  | 4       | Oui   | 0         | 900   | 900     |
| 6   | fighter_normal  | 8       | Oui   | 0         | 1300  | 1300    |
| 7   | castle_boss     | 0       | Oui   | 3         | 1750  | 1750    |
| 8   | paperboy_normal | 8       | Oui   | 0         | 1300  | 1300    |

---

## Diagnostic

### Pourquoi Illusion donne toujours 1500 ?

Castle Illusion a un quota de **10 pickups**. Le jeu s'arrête exactement quand
`this.score >= 10`. Comme chaque pickup ajoute 1 à `this.score` et 100 à
`this.runtimeScore`, la formule est entièrement déterministe :

```
10 × 100 (pickups) + 500 (clear) = 1500
```

Peu importe la vitesse du joueur, le chemin emprunté, les dangers évités,
ou le temps passé : le score sera toujours 1500 si le niveau est clearé.

### Pourquoi le score est-il aussi constant ?

Trois causes structurelles :

1. **TIME_SECOND est une constante orpheline.** Elle est définie dans
   `SCORE_VALUES` mais n'est consommée nulle part dans le code runtime.
   `tickCount` est incrémenté et passé au contexte mécaniques, mais jamais
   multiplié par `TIME_SECOND` pour contribuer au score.

2. **Le jeu se termine au quota exact.** `checkClear()` retourne true dès
   `this.score >= quota`. Il n'y a aucun mécanisme pour collecter plus que
   le quota et gagner des points supplémentaires.

3. **Les bonus mécaniques n'affectent pas le score visible.** Les `update.score`
   retournés par `FighterChargeMechanic` (+2) ou `PaperboyDeliveryMechanic` (+1)
   s'additionnent à `this.score` (progrès), pas à `this.runtimeScore` (affiché).
   Le bonus charge du Fighter réduit le nombre de pickups requis — ce qui réduit
   en fait le runtimeScore (900 au lieu de 1300) sans que ce soit intentionnel.

### Le score est-il trop constant ?

Oui. Pour 7 niveaux sur 8 (hors Fighter), le score de clear est parfaitement
déterministe. Le seul "aléa" vient du game over partiel (score < quota × 100),
qui n'est pas un succès. Le score ne récompense ni la rapidité, ni l'habileté,
ni le risque pris.

---

## Options d'amélioration

| Option | Impact rejouabilité | Risque | Effort | Recommandation |
|---|---|---|---|---|
| **Bonus temps** | Élevé — score différent à chaque run | Nécessite passer tickCount à ClearScene | Faible | **Court terme prioritaire** |
| **Bonus pickup complet** | Moyen — +X% si tous pickups quota pris sans mourir | Trivial (déjà le cas si clear) | Minimal | Peu utile seul, utile combiné |
| **Pickups supplémentaires post-quota** | Élevé — permet de "farmer" après quota | Peut inciter le farm passif | Moyen | Utile mais nécessite UI claire |
| **Bonus longueur serpent** | Moyen — récompense le risque | Peut encourager farm passif | Faible | Court terme si timer pas disponible |
| **Pénalité collision** | Nul sur variabilité | Frustration joueur mobile | Élevé | **À éviter** |
| **Combo pickup** | Élevé — score exponentiel, addictif | Complexité mécanique | Moyen-élevé | Moyen terme |
| **Détail score en ClearScene** | Moyen — rend lisible sans changer les valeurs | Nul | Faible | **Quick win UI** |

---

## Recommandation

### Court terme (ticket suivant)

**Option 1 — Bonus temps (prioritaire)**

`TIME_SECOND = 10` est déjà défini. Il suffit de :
- Passer `tickCount` à `triggerClear()` ;
- Dans `triggerClear()`, calculer `timeBonus = Math.floor(tickCount * speedMs / 1000) * TIME_SECOND` ; 
  ou plus simplement : `timeBonus = tickCount * TIME_SECOND` (ticks × 10).
- Ajouter `timeBonus` à `runtimeScore` avant de lancer ClearScene.
- Passer `timeBonus` aux données ClearScene pour l'afficher.

Impact : score varie entre 1500 (run lent) et ~2500+ (run rapide sur castle_normal).
Risque faible : TIME_SECOND est petit (10 pts/tick), ne casse pas l'équilibre.
ClearScene n'a pas besoin d'afficher le timer brut — juste le total final.

**Option 2 — Bonus longueur serpent**

À la fin du run : `lengthBonus = (snakeLength - initialLength) * 50`.
Simple à implémenter. Récompense le joueur qui ne meurt pas et grandit.

**Option 3 — Détail score ClearScene (quick win)**

Afficher la décomposition : "Pickups × 100 = X / Clear = 500".
Ne change pas les valeurs, mais rend le système transparent.
Le joueur comprend pourquoi le score ne varie pas — ce qui incite à réclamer
un vrai bonus variable.

### Ne pas faire

- Ne pas durcir le jeu.
- Ne pas ajouter de pénalité de temps.
- Ne pas supprimer STAGE_CLEAR (référence ancrée chez les joueurs).
- Ne pas rendre le quota variable sans UI claire.

---

## Fichiers source auditoyés

| Fichier | Rôle audit |
|---|---|
| `src/config/constants.ts:26-32` | Constantes score |
| `src/scenes/GameScene.ts:68-69,279-280,396,487-500,527,566-613` | Logique score runtime |
| `src/scenes/ClearScene.ts:190-221` | Affichage score |
| `src/scenes/GameOverScene.ts` | Affichage score game over |
| `src/systems/SaveSystem.ts:154-165` | Persistence best score |
| `src/config/levels.ts` | Quotas et speedMs par niveau |
| `src/mechanics/FighterChargeMechanic.ts:43-50` | Seul mécanisme avec update.score > 1 |
| `src/mechanics/PaperboyDeliveryMechanic.ts:53-63` | update.score livraison |
