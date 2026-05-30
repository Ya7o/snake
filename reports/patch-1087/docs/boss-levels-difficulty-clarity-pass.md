# Boss Levels — Difficulty & Clarity Pass — PATCH 1087

## 1. Castle boss — WitchMirrorBoss — Plus de miroirs

**Fichier :** `src/mechanics/bosses/WitchMirrorBoss.ts`

| Paramètre | Avant | Après |
|---|---|---|
| `count = N + phase` | `2 + phase` (2/3/4) | `3 + phase` (3/4/5) |
| `warningTicks` | 10 | 8 |
| `attackingTicks` | 10 | 8 |
| `vulnerableTicks` | 18 | 16 |

Plus de miroirs simultanés dès le début ; le joueur doit être plus attentif. La fenêtre de frappe est légèrement raccourcie mais reste lisible.

---

## 2. Sonic boss — LoopSerpentBoss — Corps plus long, plus rapide, HUD clair

**Fichier :** `src/mechanics/bosses/LoopSerpentBoss.ts`

| Paramètre | Avant | Après |
|---|---|---|
| `moveInterval` | 4 | 3 (~25 % plus rapide) |
| Corps (`bossBody` max) | 3 | 5 |
| `getHudExtra()` | `'FRAPPE'` | `'FRAPPE LA QUEUE'` |

Le serpent circule plus vite avec 5 segments (3 dangereux + 1 orbe = cible). L'objectif est maintenant explicite dans le HUD.

---

## 3. Streets boss — CrimeLordBoss — 2 étaux simultanés

**Fichier :** `src/mechanics/bosses/CrimeLordBoss.ts`

Avant : 1 ligne de danger à ~60 % de largeur.
Après : 2 lignes simultanées, chacune à ~45 % de largeur, dans les deux moitiés de la grille (haut et bas). Le joueur doit traverser deux zones de danger, mais des gaps restent disponibles dans chaque rangée.

---

## 4. Street Fighter boss — FinalChallengerBoss — Attaque rapide, contre-zones HP

**Fichier :** `src/mechanics/bosses/FinalChallengerBoss.ts`

| Paramètre | Avant | Après |
|---|---|---|
| `idleTimer > 20` | 20 ticks d'attente | 10 ticks — attaque plus tôt |
| Counter zones | 4 fixes | [5, 7, 10] selon `this.phase` |
| Zone TTL | 8 ticks | 10 ticks |

Le boss attaque avant d'être tué facilement. Plus le boss est bas en PV, plus les zones de contre-attaque sont nombreuses.

---

## 5. OutRun boss — TurboRivalBoss — Mouvement vertical, fenêtre plus longue, HUD clair

**Fichier :** `src/mechanics/bosses/TurboRivalBoss.ts`

| Paramètre | Avant | Après |
|---|---|---|
| Mouvement latéral | Toutes les 8 ticks | Toutes les 6 ticks |
| Mouvement vertical | Fixé à row=2 | Dérive entre row=2 et ~60 % de la grille |
| TurboZone position | row rival - 1 | Position actuelle du rival |
| TurboZone TTL | 12 | 18 (+50 % de temps) |
| TurboZone interval | 25 ticks | 20 ticks |
| `getHudExtra()` normal | `'ÉVITE'` | `'RATTRAPE LE RIVAL'` |
| `getHudExtra()` frappe | `'FRAPPE MAINTENANT !'` | `'FRAPPE !'` |

Le rival se déplace maintenant dans les deux axes. Le joueur sait quoi faire grâce au HUD. La zone de turbo apparaît là où est le rival, ce qui donne un objectif spatial clair.

---

## 6. Mortal Kombat boss — DragonGateBoss — Zone danger massive par HP

**Fichier :** `src/mechanics/bosses/DragonGateBoss.ts`

| Phase (maxHp - hp) | Rayon avant | Rayon après | Cellules approx. |
|---|---|---|---|
| 0 (HP plein) | 1 (8 cases) | 2 (~13 cases) | ×1.6 |
| 1 (1 touche) | 1 (8 cases) | 3 (~29 cases) | ×3.6 |
| 2 (2 touches) | 1 (8 cases) | 4 (~49 cases) | ×6 |
| Zone TTL | 8 | 10 | |

La zone autour du boss est maintenant un vrai cluster circulaire. À 1 PV, la zone couvre ~49 cellules, soit environ 15 % de la grille entière (16×20). Le joueur doit s'éloigner rapidement.

---

## 7. Paperboy boss — NeighborhoodChaosBoss — Plus de chiens, escalade après livraison

**Fichier :** `src/mechanics/bosses/NeighborhoodChaosBoss.ts`

| Paramètre | Avant | Après |
|---|---|---|
| `waveObstacles` | `2 + wave` (2/3/4) | `3 + wave * 2` (3/5/7) |
| Après 1ère livraison | Rien | +1 obstacle spawné |
| Boucle | journal→mailbox | Confirmée, inchangée |

Dès la première livraison, un chien supplémentaire est ajouté au terrain. La pression augmente avec chaque vague. La boucle papier→mailbox est correctement implémentée.

---

## 8. Shinobi boss — ShadowNinjaBoss
Non modifié (hors scope PATCH 1087).

---

## Risques

- **WitchMirror** : 5 miroirs au dernier PV — le joueur peut se trouver cerné. La lisibilité du miroir réel (état vulnerable) est maintenue.
- **FinalChallenger** : idle 10 ticks à 165 ms/tick = 1.65 s avant première attaque. C'est nettement moins qu'avant (3.3 s). Risque de surprise.
- **DragonGate** : zone de rayon 4 couvre ~49 cellules. Si le gate se téléporte très loin au dernier PV et la zone couvre presque tout un côté de la grille, le joueur peut être piégé. TTL=10 laisse 1.7 s pour sortir — suffisant.
- **TurboRival** : mouvement vertical — la zone de turbo peut apparaître n'importe où dans les 60 % supérieurs. C'est intentionnel mais peut surprendre les habitués de la version précédente.
