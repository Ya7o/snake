# PATCH 1005B — Boss Mechanics Prioritization

## Objectif

Prioriser les boss mechanics pour Phase 5 sans ajouter une complexité excessive.
Ce document est purement documentaire — aucun code, aucun asset modifié.

---

## État actuel des boss

| Univers | Boss level ID | Mechanic key | Statut actuel | Risque | Priorité |
|---|---|---|---|---|---|
| castle | `castle_boss` | `witchMirror` | Complet — machine d'états complète (idle→warning→attacking→vulnerable→hit→moving), HUD contextuel, rendu spécifique. Référence. | Faible | **P1** |
| kombat | `kombat_boss` | `dragonGate` | Fonctionnel — cycle clair (closed→opening→open→danger), zones de danger autour de la gate, gate se déplace après hit. Lisible. | Faible | **P2** |
| fighter | `fighter_boss` | `finalChallenger` | Fonctionnel — fenêtre d'attaque + contre-attaque si ratée, HUD "FRAPPE !". Mécanique bien télégraphiée. | Faible | **P3** |
| sonic | `sonic_boss` | `loopSerpent` | Fonctionnel — serpent en boucle circulaire (16 pts), corps danger, orb = weak point. Simple et lisible. Pas de fenêtre temporelle : l'orb est toujours hittable. | Faible | **P4** |
| shinobi | `shinobi_boss` | `shadowNinja` | Fonctionnel mais contrainte manquante — la révélation du vrai ninja est purement cosmétique : `getWeakPoints` retourne le vrai clone sans vérifier `revealed`, donc il est toujours hittable sans attendre la révélation. Fix minimal. | Faible–Moyen | **P5** |
| streets | `streets_boss` | `crimeLord` | Fonctionnel mais potentiellement frustrant — la phase pressure génère une rangée entière de cellules létales (toute la largeur), difficile à esquiver sur mobile. Pas de hint HUD pendant la phase vulnérable. | Moyen | **P6** |
| outrun | `outrun_boss` | `turboRival` | Partiellement fonctionnel — le rival se déplace aléatoirement (pas de lanes), la logique `getDangerCells` est confuse (le rival est danger seulement si aucune turboZone n'existe directement sous lui), le concept "dépassement sur la bonne ligne" n'est pas implémenté. | Moyen | **P7** |
| paperboy | `paperboy_boss` | `neighborhoodChaos` | Le plus complexe — 3 vagues d'obstacles mobiles + system de livraison (pickup → cible × 2 par vague). Fonctionnel mais cumule le plus de risques. | Élevé | **P8** |

---

## Détail par boss

### P1 — Castle / `witchMirrorBoss`

Machine d'états : `idle → warning → attacking → vulnerable → hit → moving → idle`

- Faux miroirs dangereux pendant `attacking`
- Vrai miroir exposed pendant `vulnerable`
- HUD : ATTENTION / DANGER / FRAPPE / TOUCHÉ
- Rendu dédié : `drawWitchMirrorSymbol`, alpha variable
- `phase` utilisé pour scaling (count de miroirs)

**Action Phase 5 :** Vérification jouabilité uniquement. Pas de code à écrire.

---

### P2 — Kombat / `dragonGateBoss`

Cycle timer : `closed (25t) → opening (8t) → open (12t) → danger (10t)`

- Pendant `open` : gate = weak point
- Pendant `danger` : 8 cellules autour de la gate deviennent létales (TTL 8 ticks)
- Après hit : gate téléportée aléatoirement, cycle repart
- Rendu : couleur par état (gris→orange→jaune→rouge)

**Action Phase 5 :** Vérification + HUD hint pendant `open` (actuellement aucun, contrairement à Castle et Fighter).

---

### P3 — Fighter / `finalChallengerBoss`

Cycle : `idle (20t) → attack_window (12t) → [si raté] counter (10t) → idle`

- Pendant `attack_window` : boss = weak point, HUD "FRAPPE !"
- Si raté : 4 zones aléatoires létales spawned (TTL 8 ticks)
- Après hit : boss téléporté, retour idle
- `phase` non utilisé (potentiel pour durcir progressivement)

**Action Phase 5 :** Fonctionnel. Vérifier que les `counterZones` sont bien visibles sur mobile.

---

### P4 — Sonic / `loopSerpentBoss`

Corps de 3 cellules suivant un chemin circulaire (16 points, rayon `3+phase`).

- Corps (body) : danger permanent
- Queue (orb) : weak point **toujours actif** — pas de fenêtre temporelle
- Rendu : body cercle α0.7, orb cercle plein + halo
- `buildLoop()` rappelé après hit, rayon augmenté par `phase`

**Manque :** tension. L'orb est toujours hittable — pas besoin d'attendre. Pour Phase 5, envisager une fenêtre d'exposition (orb revealed pendant N ticks après X tours de boucle).

**Action Phase 5 :** Amélioration optionnelle de la tension. Pas bloquant.

---

### P5 — Shinobi / `shadowNinjaBoss`

`2 + phase` clones spawned, dont un vrai.

- Faux clones : danger permanent
- Vrai clone : weak point **toujours retourné** par `getWeakPoints`, indépendamment de `revealed`
- Reveal toutes les 28 ticks (6 ticks d'exposition visuelle)
- La contrainte "attendre la révélation" n'est pas appliquée côté logique

**Fix minimal :** conditionner `getWeakPoints` à `cl.revealed === true`. Une ligne.

**Action Phase 5 :** Fix de la contrainte de reveal.

---

### P6 — Streets / `crimeLordBoss`

Deux phases timer : `pressure (20t) → vulnerable (15t) → pressure...`

- Pressure : rangée horizontale entière (toute la largeur) de cellules létales
- Vulnerable : boss cell seule exposed, pas de hint HUD
- Après hit : boss téléporté aléatoirement, nouvelle rangée pressure
- Rangée choisie aléatoirement parmi toutes les rows

**Problème mobile :** une rangée complète sur une grille étroite portrait laisse peu d'espace d'esquive.

**Action Phase 5 :** Réduire la largeur de la pressure zone (ex. : 60 % de la grille) + HUD hint "FENÊTRE" pendant vulnerable.

---

### P7 — OutRun / `turboRivalBoss`

- Rival se déplace aléatoirement gauche/droite (step random toutes les 5 ticks)
- TurboZone spawned à `rival+1 row` toutes les 25 ticks (TTL 10)
- `getDangerCells` : rival est danger seulement si aucune turboZone n'est à `rival.col, rival.row+1` → logique contre-intuitive
- `getWeakPoints` : les turboZones sont les weak points

**Problème conceptuel :** le concept "lanes" de OutRun n'est pas présent. Le rival ne se déplace pas en lane, la turboZone est difficile à anticiper.

**Action Phase 5 :** Clarifier la mécanique — soit lanes fixes (rival alterne entre 3 colonnes prédéfinies), soit conserver le mouvement aléatoire mais rendre le rival toujours danger et la turboZone clairement le seul safe hit. Aussi corriger la logique `getDangerCells`.

---

### P8 — Paperboy / `neighborhoodChaosBoss`

Système par vagues (3 vagues, 1 HP par vague) :

1. Pickup sur la grille → `hasPaper = true`
2. Livrer à 2 `bossTarget` actifs = `deliveredInWave >= 2` = 1 HP de boss
3. Vague suivante : +1 obstacle mobile, même pattern
- Obstacles mobiles rebondissants (direction inversée sur bord)
- HUD : wave counter `V1 / V2 / V3`
- `onPickupCollected` bien connecté via `GameScene:415`

**Complexité :** plus de systèmes actifs simultanément que tout autre boss. Risque de confusion joueur (pickup ordinaire vs pickup boss, targets vs obstacles).

**Action Phase 5 :** Traiter en dernier. S'assurer que la distinction pickup-boss / pickup-normal est visuellement claire.

---

## Critères de priorité appliqués

| Critère | Poids relatif |
|---|---|
| Déjà partiellement codé et fonctionnel | Élevé |
| Lisibilité immédiate sans explication | Élevé |
| Compatible mobile portrait | Élevé |
| Fix minimal (< 10 lignes) | Moyen |
| Réutilise systèmes existants | Moyen |
| Pas de nouveaux assets requis | Moyen |
| Risque de régression sur autres univers | Élevé (négatif) |

---

## Recommandation de priorité Phase 5

| Ordre | Univers | Boss | Action minimale |
|---|---|---|---|
| 1 | Castle | witchMirror | Vérification jouabilité — aucun code |
| 2 | Kombat | dragonGate | Ajouter HUD hint `"FENÊTRE"` pendant `open` |
| 3 | Fighter | finalChallenger | Vérifier visibilité counterZones sur mobile |
| 4 | Sonic | loopSerpent | Optionnel : exposer l'orb seulement N ticks par cycle |
| 5 | Shinobi | shadowNinja | Fix : conditionner `getWeakPoints` à `revealed` |
| 6 | Streets | crimeLord | Réduire largeur pressure + hint HUD vulnerable |
| 7 | OutRun | turboRival | Clarifier logique danger/weakpoint + concept lanes |
| 8 | Paperboy | neighborhoodChaos | En dernier, si Tier 1–7 stables |

---

## Boss depth minimal — définition Phase 5

Un boss est "Phase 5 ready" si et seulement si :

- [ ] HP visible dans le HUD (♥ / ♡) — déjà présent via `BaseBoss.getHudExtra()`
- [ ] Le danger est lisible avant d'être létal (couleur distincte, état `warning` ou équivalent)
- [ ] Il existe une fenêtre d'attaque claire, même brève
- [ ] Un hit sur le weak point déclenche un feedback visuel (couleur, alpha, HUD)
- [ ] La défaite déclenche `triggerClear()` — déjà connecté via `GameScene`
- [ ] Une seule mécanique spéciale active à la fois
- [ ] Pas de phase multiple (le `phase` du BaseBoss peut scaler la difficulté mais pas ajouter une nouvelle logique)

---

## Ce qu'on interdit en Phase 5

- Boss multi-phases (comportements distincts selon HP restants)
- Projectiles se déplaçant librement sur la grille
- IA de poursuite du snake
- Patterns bullet hell ou grille saturée
- Animations procédurales lourdes (plus de 4 entités extra simultanées)
- Assets additionnels obligatoires pour que le boss soit compréhensible
- Cutscenes, dialogues, écrans intermédiaires
- Nouveaux écrans de transition boss

---

## PATCH suivant recommandé

**PATCH 1006B — Kombat Dragon Gate Boss Pass**

Kombat est le meilleur second candidat après Castle car :
- Mécanique déjà complète et lisible
- Un seul ajout minimal : hint HUD pendant `open`
- Aucun fix logique requis
- Sert de deuxième référence pour valider le template boss

*(Si Castle révèle un problème de rendu ou de gameplay au test, remonter Kombat en P1 bis.)*

---

*Audit réalisé le 2026-05-27. Aucun code ni asset modifié.*
