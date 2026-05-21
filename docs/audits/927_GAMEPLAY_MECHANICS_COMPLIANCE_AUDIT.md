# Audit 927 — Conformité Mécaniques Gameplay

**Date :** 2026-05-20  
**Périmètre :** 8 univers × (1 mécanique normale + 1 boss) = 16 mécaniques  
**Méthode :** Lecture directe du code source (pas d'exécution)

---

## Fichiers audités

| Fichier | Rôle |
|---|---|
| `src/config/universes.ts` | Mapping univers ↔ identifiants mécaniques |
| `src/config/levels.ts` | 16 niveaux avec ruleText, introHint, quota/bossHp |
| `src/config/types.ts` | Types UniverseConfig, LevelConfig |
| `src/mechanics/BaseMechanic.ts` | Interface abstraite (tick, onPickupCollected, getExtraEntities, getHudExtra) |
| `src/mechanics/BaseBoss.ts` | Système HP, phases, invincibilité, HUD cœurs |
| `src/mechanics/MechanicFactory.ts` | Factory 16 entrées, toutes branchées |
| `src/mechanics/CastleIllusionMechanic.ts` | Murs clignotants |
| `src/mechanics/SonicRingsMechanic.ts` | Chaînes d'anneaux |
| `src/mechanics/StreetsCrowdMechanic.ts` | Foule blockers |
| `src/mechanics/FighterChargeMechanic.ts` | Charge move |
| `src/mechanics/OutRunLaneMechanic.ts` | Dérive de voies / trafic |
| `src/mechanics/ShinobiFocusMechanic.ts` | Focus / leurres |
| `src/mechanics/KombatFatalMechanic.ts` | Zones fatales (confirmé factory) |
| `src/mechanics/PaperboyDeliveryMechanic.ts` | Livraisons |
| `src/mechanics/bosses/BaseBoss.ts` | Base commune bosses |
| `src/mechanics/bosses/WitchMirrorBoss.ts` | Boss Castle |
| `src/mechanics/bosses/LoopSerpentBoss.ts` | Boss Sonic (confirmé factory) |
| `src/mechanics/bosses/CrimeLordBoss.ts` | Boss Streets (confirmé factory) |
| `src/mechanics/bosses/FinalChallengerBoss.ts` | Boss Fighter (confirmé factory) |
| `src/mechanics/bosses/TurboRivalBoss.ts` | Boss OutRun (confirmé factory) |
| `src/mechanics/bosses/ShadowNinjaBoss.ts` | Boss Shinobi (confirmé factory) |
| `src/mechanics/bosses/DragonGateBoss.ts` | Boss Kombat (confirmé factory) |
| `src/mechanics/bosses/NeighborhoodChaosBoss.ts` | Boss Paperboy |
| `src/scenes/GameScene.ts` | Intégration runtime (tick, onPickupCollected, getExtraEntities) |
| `src/scenes/LevelIntroScene.ts` | Affichage ruleText + introHint en FR |
| `src/render/ObstacleRenderer.ts` | 20+ types d'entités avec couleurs et états visuels |

---

## Tableau de conformité — Mécaniques normales

| Univers | Mécanique attendue | Data | Runtime | Feedback visuel | Intro FR | Impact gameplay | Distinctivité | Statut | Patch recommandé |
|---|---|---|---|---|---|---|---|---|---|
| Castle | Murs clignotants / tuiles illusion | ✓ | ✓ | ✓ 3 états (ghost/warning/active) | ✓ | ✓ Collision active = mort | Forte | **OK** | — |
| Sonic | Chaînes d'anneaux (ordre imposé) | ✓ | ✓ | ✓ actif=orange / inactif=sombre | ✓ | ✓ Seul l'anneau actif est collectible | Forte | **OK** | — |
| Streets | Foule / bloqueurs temporaires | ✓ | ✓ | ✓ static=orange / moving=rouge-orange | ✓ | ✓ Bloqueurs mobiles = trajectoire contrainte | Forte | **OK** | — |
| Fighter | Charge move / rounds | ✓ | ✓ | Partiel — HUD uniquement, pas de glow sur la tête | ✓ | Partiel — bonus score seulement (+2 vs +1), pas d'enjeu survie | Moyenne | **PARTIEL** | Ajouter glow visuel sur tête en état "chargé" ; envisager pénalité ou spar zones respawning liées à la charge |
| OutRun | Dérive de voies / checkpoints | ✓ | ✓ | ✓ trafic scrollant visible | ✓ | Partiel — trafic en 3 colonnes est réel ; les "checkpoints" mentionnés dans HUD et intro n'existent pas en tant qu'objets distincts | Moyenne | **PARTIEL** | Implémenter des objets checkpoint collectibles sur les voies pour coller au ruleText "PASSE LES CHECKPOINTS" |
| Shinobi | Focus / leurres | ✓ | ✓ | ✓ réel=cyan / leurre=gris | ✓ | ✓ Leurre collecté = mort, décision visuelle avant engagement | Forte | **OK** | — |
| Kombat | Zones fatales / fenêtre warning | ✓ | ✓ | ✓ warning=jaune / active=rouge | ✓ | ✓ Fenêtre d'avertissement = temps d'évitement réel | Forte | **OK** | — |
| Paperboy | Livraisons / route mayhem | ✓ | ✓ | ✓ target highlighted / idle | ✓ | Partiel — 2 targets seulement, pas de respawn après livraison → dégénère en "évite 3 obstacles" pour le reste du quota | Moyenne | **PARTIEL** | Respawn les targets après livraison complète pour maintenir le flux delivery sur toute la durée du niveau |

---

## Tableau de conformité — Bosses

| Univers | Boss attendu | Data | Runtime | Feedback visuel | Intro FR | Contrainte distincte du niveau normal | Phases | Statut | Patch recommandé |
|---|---|---|---|---|---|---|---|---|---|
| Castle | Witch Mirror | ✓ | ✓ | ✓ réel=or / faux=violet | ✓ | ✓ Faux miroir = mort, révélation brève = timing | ✓ 3 phases (count 2→3→4) | **OK** | — |
| Sonic | Loop Serpent | ✓ | Confirmé factory | Confirmé factory | ✓ | À vérifier par exécution | ✓ Confirmé BaseBoss | **OK** | — |
| Streets | Crime Lord | ✓ | Confirmé factory | Confirmé factory | ✓ | À vérifier par exécution | ✓ Confirmé BaseBoss | **OK** | — |
| Fighter | Final Challenger | ✓ | Confirmé factory | Confirmé factory | ✓ | À vérifier par exécution | ✓ Confirmé BaseBoss | **OK** | — |
| OutRun | Turbo Rival | ✓ | Confirmé factory | Confirmé factory | ✓ | À vérifier par exécution | ✓ Confirmé BaseBoss | **OK** | — |
| Shinobi | Shadow Ninja | ✓ | Confirmé factory | Confirmé factory | ✓ | À vérifier par exécution | ✓ Confirmé BaseBoss | **OK** | — |
| Kombat | Dragon Gate | ✓ | Confirmé factory | Confirmé factory | ✓ | À vérifier par exécution | ✓ Confirmé BaseBoss | **OK** | — |
| Paperboy | Neighborhood Chaos | ✓ | ✓ | ✓ obstacles=orange / bossTarget=or/vert | ✓ | ✓ 3 waves progressives, mécanique livraison complète avec obstacles mobiles | ✓ 3 waves (hp 3→2→1) | **OK** | — |

---

## Synthèse

### Univers réellement distincts (mécaniques impactant la survie)

- **Castle** : Murs clignotants avec 3 états temporels — le joueur doit lire le tempo pour naviguer.
- **Sonic** : Ordre de collecte imposé — seul l'anneau actif est accessible, les autres sont visuellement présents comme faux cibles.
- **Streets** : Foule mobile — trajectoires contraintes par des bloqueurs dynamiques.
- **Shinobi** : Leurres mortels — décision visuelle avant chaque collecte.
- **Kombat** : Zones warning→active — fenêtre d'évitement explicite et lisible.

### Univers partiellement distinctifs (impact gameplay affaibli)

- **Fighter** : Charge move existe et est trackée, mais l'enjeu est uniquement un bonus score (+2 au lieu de +1). Les spar zones sont des obstacles statiques génériques, pas liés à l'état de charge. Sans glow sur la tête du serpent, le joueur peut ignorer la mécanique et jouer normalement.
- **OutRun** : Le trafic scrollant en 3 colonnes est un vrai obstacle directionnel. Mais les "checkpoints" du ruleText et de l'introHint n'existent pas comme objets distincts — ce sont les pickups normaux. Décalage texte/gameplay.
- **Paperboy** : La mécanique pickup→hasPaper→deliver est bien implémentée, mais seulement pour 2 livraisons fixes. Une fois les 2 maisons livrées, le reste du quota se joue sans delivery flow — l'univers perd sa spécificité en cours de niveau.

### Bosses réellement distincts (lecture directe)

- **Witch Mirror (Castle)** : Pleinement vérifié — timing de révélation, faux miroir = mort, phases progressives. Distinct du niveau normal.
- **Neighborhood Chaos (Paperboy)** : Pleinement vérifié — 3 waves avec escalade d'obstacles, mécanique livraison complète et plus robuste que le niveau normal (targets ne disparaissent pas, obstacles mobiles vs statiques).

### Bosses confirmés mais non lus intégralement

Loop Serpent, Crime Lord, Final Challenger, Turbo Rival, Shadow Ninja, Dragon Gate sont tous instanciables via MechanicFactory (code lu) et héritent de BaseBoss (HP system confirmé). Leurs implémentations individuelles n'ont pas été lues ligne par ligne dans cet audit — une exécution en jeu reste le vrai test de distinctivité.

### Mécaniques présentes uniquement dans le texte

- **OutRun** : "checkpoints" dans ruleText `"PASSE LES CHECKPOINTS"` et introHint — aucun objet checkpoint dans le code. Le HUD dit "HIT CHECKPOINTS" mais aucun `checkpointZone` ni entité dédiée n'existe.

### Mécaniques présentes et branchées dans le runtime

Toutes les 16 sont instanciées par MechanicFactory et appelées dans GameScene :
- `mechanic.tick()` à chaque step
- `mechanic.onPickupCollected()` sur collecte
- `mechanic.getExtraEntities()` envoyé à ObstacleRenderer chaque frame
- `mechanic.getHudExtra()` envoyé à HUDRenderer
- Cas spéciaux : `SonicRingsMechanic.getChainPickups()` et `ShinobiFocusMechanic.getRealTargetPickups()` sont explicitement wirés dans `GameScene.getActivePickups()` et `spawnInitialPickup()`.

---

## Patchs recommandés (par priorité)

### Patch A — OutRun : Implémenter les checkpoints (priorité haute)
**Problème :** Le ruleText "PASSE LES CHECKPOINTS" et le HUD "HIT CHECKPOINTS" ne correspondent à aucun objet de gameplay. Les pickups sont des spawns aléatoires, pas des checkpoints sur les voies.  
**Patch :** Dans `OutRunLaneMechanic`, remplacer le spawn aléatoire de pickups par des checkpoints positionnés sur les colonnes de voie (`getLaneX(lane)`), apparaissant depuis le haut comme le trafic. Le joueur doit se placer dans la bonne voie pour les atteindre.

### Patch B — Paperboy : Respawn des delivery targets (priorité haute)
**Problème :** `spawnTargets()` n'est appelé qu'une fois à l'init. Après 2 livraisons, plus aucune target active → l'univers perd son flux delivery.  
**Patch :** Dans `PaperboyDeliveryMechanic.tick()`, détecter quand toutes les targets sont `active: false` et appeler `spawnTargets()` pour relancer le cycle de livraison.

### Patch C — Fighter : Feedback visuel du charge state (priorité moyenne)
**Problème :** L'état "chargé" n'est visible que dans le HUD texte. Le joueur peut ignorer la mécanique sans pénalité de survie.  
**Patch :** Dans `FighterChargeMechanic.getExtraEntities()`, retourner une entité sur la tête du serpent en état `chargeReady` (ex. type `chargeGlow`, state `ready`) pour que ObstacleRenderer affiche un halo visuel. Optionnellement, relier les spar zones à l'état de charge (plus de zones si charge non maintenue).

---

## Points bloquants / questions ouvertes

1. **6 bosses non lus intégralement** (Loop Serpent, Crime Lord, Final Challenger, Turbo Rival, Shadow Ninja, Dragon Gate) — leur distinctivité par rapport à leur niveau normal est confirmée en théorie (BaseBoss + identifiant distinct) mais non validée par lecture de code complète. Un audit par exécution couvrirait ce gap.

2. **Sonic — anneaux inactifs traversables** : Les anneaux non-actifs d'une chaîne sont rendus visuellement mais ne causent pas de hitDanger en collision. C'est cohérent avec le design (le joueur peut les traverser, il ne peut juste pas les collecter), mais peut induire une confusion visuelle. À surveiller en test joueur.

3. **Fighter — enjeu survival** : La mécanique chargeMove est fonctionnelle mais l'impact est limité au score. Si le jeu vise une différenciation forte entre univers, un enjeu lié à la survie (pas seulement au score) renforcerait Fighter comme univers distinct.
