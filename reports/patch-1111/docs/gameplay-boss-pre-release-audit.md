# Gameplay + Boss Pre-Release Audit

## Résumé
**Verdict global : PASS avec réserve**

Les 16 niveaux sont structurellement corrects. Aucun crash, aucune progression bloquée. Trois points P1 à corriger avant release : vitesse Paperboy normal (110ms = trop rapide pour cette mécanique complexe), anneaux inactifs Sonic confondus avec obstacles visuellement, et cœurs Unicode HP (`♥♡`) non garanti sur tous Android.

---

## Niveaux normaux

| Niveau | Objectif compris | Mécanique OK | Difficulté | Lisibilité | Verdict |
|---|---|---|---|---|---|
| Castle — Jardin d'Illusion | ✓ "Collecte 10 éclats" | ✓ blinkWall warning→active, glow pickup | Correct (175ms, quota 10) | ✓ OpenMoji crisp | PASS |
| Sonic — Zone des Anneaux | ✓ "Anneaux en ordre" | ⚠ anneau actif = pickup, inactifs = obstacles visuels confondants | Élevé (135ms, quota 15) | ⚠ inactifs couleur sombre difficile à lire | PASS avec réserve |
| Streets — Bagarre en Ruelle | ✓ "Foule mobile, attends couloir" | ✓ crowdBlocker colors warning/charging | Correct (155ms, quota 10) | ✓ diamond pickup visible | PASS |
| Fighter — Dojo des Guerriers | ✓ "Frappe quand CHARGE clignote" | ✓ sparZone + chargeGlow + HUD CHARGE | Correct (165ms, quota 8) | ✓ crossShape + textureKey distinct | PASS |
| OutRun — Autoroute du Soleil | ✓ "Change voie, passe balise" | ✓ laneDrift checkpoints | Rapide (130ms, quota 10) | ✓ triangle pickup | PASS avec réserve |
| Shinobi — Temple des Neiges | ✓ "Vraie cible, ignore leurres" | ✓ focusTarget real=cyan, decoy=gris | Correct (160ms, quota 8) | ⚠ dépend qualité PNG cibles | PASS avec réserve |
| Kombat — Arène des Enfers | ✓ "Zones s'allument, sors vite" | ✓ fatalZone warning→active, PATCH 1115b | Correct (160ms, quota 10) | ✓ LINEAR filter ok | PASS |
| Paperboy — Tournée du Matin | ✓ "Livre les bonnes maisons" | ✓ deliveryTarget highlighted/idle + glow | Très difficile (**110ms**, quota 8) | ✓ glow fort sur cible surlignée | **P1** |

---

## Boss

| Boss | Objectif compris | Attaques lisibles | HP/score OK | Difficulté | Verdict |
|---|---|---|---|---|---|
| Castle — Sorcière au Miroir | ✓ "Frappe l'éclat lumineux (vulnerable)" | ✓ idle→warning→attacking→vulnerable chain claire | ✓ HP capsule + popup +250 | 3 phases (18/24/30 miroirs) — correct | PASS |
| Sonic — Serpent en Boucle | ✓ "Coupe la trajectoire" | ✓ loopSerpent orb/body colors | ✓ | Correct (145ms) | PASS |
| Streets — Seigneur du Crime | ✓ "Évite l'étau, frappe ouverture" | ✓ crimeLord pressure/vulnerable states | ✓ | Correct (165ms) | PASS |
| Fighter — Ultime Challenger | ✓ "3 manches, évite le contre" | ✓ finalChallenger idle/attack_window/counter | ✓ boss texture idle/attack distinct | Correct (175ms) | PASS |
| OutRun — Rival Turbo | ✓ "Bonne ligne, bon moment" | ✓ turboRival moving/active + turboZone | ✓ | Correct (140ms) | PASS |
| Shinobi — Ninja de l'Ombre | ✓ "Suit l'ombre qui bouge" | ⚠ shadowNinja real=cyan/shadow=gris — dépend distinction visuelle PNG | ✓ | Correct (160ms) | PASS avec réserve |
| Kombat — Porte du Dragon | ✓ "Attends l'ouverture, frappe vite" | ✓ dragonGate closed/opening/vulnerable/danger | ✓ PATCH 1115b fix | Correct (170ms) | PASS |
| Paperboy — Chaos du Quartier | ✓ "Survis, puis livre" | ✓ chaosObstacle + bossTarget | ✓ | Acceptable (155ms) | PASS avec réserve |

---

## P0 / P1 / P2

| ID | Niveau | Problème | Priorité | Recommandation |
|---|---|---|---|---|
| GAM-01 | Paperboy normal | `speedMs: 110` est le plus rapide du jeu pour une mécanique à deux types d'objets (paper + cible) — difficulté probablement excessive pour nouveaux joueurs | **P1** | Augmenter à 140–150ms ; tester empiriquement |
| GAM-02 | Sonic normal | Anneaux inactifs rendus en couleur sombre (`0x5d4e00`) ressemblant à des obstacles mais **non létaux** — confusion garantie | **P1** | Ajouter indication visuelle claire (texte HUD "anneau inactif = passable" ou couleur plus douce) |
| GAM-03 | Tous bosses | HP HUD affiché avec `♥♡` Unicode — risque de rendu en carré sur certains Android < 10 | **P1** | Remplacer par `*` / `o` ASCII ou utiliser OpenMoji heart SVG |
| GAM-04 | OutRun normal | `speedMs: 130` 2e vitesse la plus rapide — peut dépasser le niveau de difficulté attendu pour le niveau 5 | P2 | Envisager 145ms si play-test le confirme |
| GAM-05 | Shinobi boss | `shadowNinja` : distinction real/fake shadow dépend de la qualité visuelle du PNG 64×64 — audit dans PATCH 1112 | P2 | Attendre audit 1112 ; fallback procédural cyan/gris solide si PNG insuffisant |
| GAM-06 | WitchMirror boss | Phase 3 spawn 30 miroirs sur 16×26 castle grid (416 cells) = 7,2% — acceptable mais dense | P2 | Surveiller en play-test ; réduire à 24 si confusion |

---

## Détail mécanique par niveau

### Castle normal — CastleIllusionMechanic
- `blinkWall` : states ghost→warning→active, délais configurés
- Pickup : OpenMoji SVG crystal, glow procédural doré (CastlePickupGlow)
- HUD : `MAGIC 4/10` prefix castle
- Fallback procédural : étoile dorée

### Sonic normal — SonicRingsMechanic
- Chain de 4 anneaux, seul l'actif est "mangeable"
- Anneaux inactifs : `ExtraEntity(chainRing, state: inactive)` → couleur `0x5d4e00` (olive sombre)
- **Anneau actif visible deux fois** : pickup image ET procédural jaune (depth overlap) — effet halo intentionnel
- Boost x0.55 vitesse sur fin de chain (BOOST_TICKS=60 ticks)
- Quota 15 : 3-4 chains complètes à valider

### Streets normal — StreetsCrowdMechanic
- `crowdBlocker` : colors static/moving/warning/charging/danger (5 états)
- Pickup diamond shape, visible sur fond sombre

### Fighter normal — FighterChargeMechanic
- `sparZone` obstacle (FIGHTER_OBSTACLE_NORMAL_KEY distinct)
- `chargeGlow` entity `ready` → HUD "CHARGE"
- Pickup cross shape, secondary lightning shape

### OutRun normal — OutRunLaneMechanic
- Checkpoints = pickups (triangle shape)
- `trafficBlock` : obstacle rose mobile
- `turboZone` : zone danger jaune

### Shinobi normal — ShinobiFocusMechanic
- `focusTarget` : real=`0x00b4d8` (cyan), decoy=`0x666666` (gris)
- Pickups retournent uniquement la vraie cible via `getRealTargetPickups()`
- Déco inactifs passables (idem Sonic)

### Kombat normal — KombatFatalMechanic
- `fatalZone` : warning→active (couleurs `0xf39c12` → `0xe74c3c`)
- LINEAR filter appliqué depuis PATCH 1115b
- Pickup flame shape

### Paperboy normal — PaperboyDeliveryMechanic
- Deux types d'objets : pickup (journal) + deliveryTarget (maison)
- `deliveryTarget highlighted` : glow fort jaune pulsant — très visible
- `routeObstacle` : gris passif
- **110ms/tick** : beaucoup trop rapide pour lire les deux types simultanément

### Boss — Base pattern
- `BaseBoss.registerHit()` : invincibilité 6 ticks après chaque hit
- `getHp()/getMaxHp()` : affiché `HP ♥♥♡`
- SCORE_VALUES.BOSS_HIT = +250 par hit, popup flottant
- SCORE_VALUES.BOSS_CLEAR = +1000 à la victoire (invisible dans breakdown — voir SCR-04 PATCH 1110)
