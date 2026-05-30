# PATCH 1090 - Icon Candidate Selection Audit

## Objectif

Identifier pour chaque niveau du jeu (16 niveaux : 8 normaux + 8 boss, 8 univers) les types d'icones gameplay presentes dans le code source TypeScript/Phaser, leur icone actuelle et leur source, puis proposer 5 candidats OpenMoji disponibles localement.

OpenMoji local : **4 495 fichiers SVG** dans design_boards/openemoji/color/svg/

---

## Tableau principal

| Niveau | Type icone | Icone actuelle | Source actuelle | C1 | C2 | C3 | C4 | C5 | Recommandation |
|--------|-----------|----------------|-----------------|----|----|----|----|-----|----------------|
| castle_normal | pickup (eclat) | star procedurale | Procedural PickupRenderer | 1F31F glowing star | 2728 sparkles | 1F48E gem stone | 2747 sparkle | 1F4AB dizzy | **1F31F** fort |
| castle_normal | obstacle (blinkWall) | rect procedurale | Procedural ObstacleRenderer | 1F9F1 brick | 1F47B ghost | 1F3F0 castle | 26A0 warning | 1F6D1 stop sign | **1F9F1** fort |
| castle_boss | boss (witchMirror) | roundedRect procedurale | Procedural ObstacleRenderer | 1FA9E mirror | 1FAA9 mirror ball | 1F9D9-200D-2640-FE0F woman mage | 1F52E crystal ball | 1FA84 magic wand | **1FA9E** fort |
| sonic_normal | pickup (ring) | ring procedurale | Runtime pickup_ring.png | 1F48D ring | 1FA99 coin | 1F7E1 yellow circle | 1F7E0 orange circle | 26AA white circle | **1F48D** fort |
| sonic_normal | obstacle (chainRing) | ring procedurale gris | Procedural ObstacleRenderer | 26D4 no entry | 26AA white circle | 26A0 warning | 1F4A3 bomb | 1F6AB prohibited | **26D4** moyen |
| sonic_boss | boss (loopSerpent) | cercle procedurale | Runtime boss_loop_serpent.png | 1F40D snake | 27B0 curly loop | 27BF double curly loop | 1F300 cyclone | 26CE Ophiuchus | **1F40D** fort |
| streets_normal | pickup (bonus) | diamond procedurale | Runtime pickup_street_bonus.png | 1F48E gem stone | 2666 diamond suit | 1F536 large orange diamond | 1F537 large blue diamond | 1FA99 coin | **1F48E** fort |
| streets_normal | obstacle (crowdBlocker) | rect procedurale | Runtime obstacle_crowd.png | 1F6B6 person walking | 1F3C3 person running | 1F9D1 person | 1F9DF zombie | 1F46A family | **1F6B6** fort |
| streets_boss | boss (crimeLord) | roundedRect procedurale | Runtime boss_crime_lord.png | 1F574 suit levitating | 1F454 necktie | 1F576 sunglasses | 1F0CF joker | 1F5E1 dagger | **1F574** fort |
| fighter_normal | pickup (energy) | lightning procedurale | Runtime pickup_energy.png | 26A1 high voltage | 1F525 fire | 1F31F glowing star | E2CD solar energy | 1FAAB low battery | **26A1** fort |
| fighter_normal | obstacle (sparZone) | cercle procedurale | Runtime obstacle_charge_marker.png | 270A raised fist | 1F44A oncoming fist | 1F94B martial arts uniform | 1F9B5 leg | 1F93A person fencing | **270A** moyen |
| fighter_boss | boss (finalChallenger) | roundedRect procedurale | Runtime boss_final_challenger.png | 1F93A person fencing | 2694 crossed swords | 1FA96 military helmet | 1F3C6 trophy | 1F94B martial arts uniform | **1F93A** fort |
| outrun_normal | pickup (checkpoint) | triangle procedurale | Runtime pickup_checkpoint.png | 1F3C1 chequered flag | 1F6A9 triangular flag | 26F3 flag in hole | 1F4CD round pushpin | 1F3CE racing car | **1F3C1** fort |
| outrun_normal | obstacle (trafficBlock) | rect procedurale rose | Runtime obstacle_car.png | 1F698 oncoming automobile | 1F699 SUV | 1F697 automobile | 1F69B lorry | 1F6A7 construction | **1F698** fort |
| outrun_boss | boss (turboRival) | roundedRect procedurale | Runtime boss_turbo_rival.png | 1F3CE racing car | 1F4A8 dashing away | 1F6A8 police light | 1F699 SUV | 1F698 automobile | **1F3CE** fort |
| shinobi_normal | pickup (shuriken) | cross procedurale | Runtime pickup_shuriken.png | 2605 black star | 2B50 star | 1F4AB dizzy | 2747 sparkle | 1F31F glowing star | **2605** fort |
| shinobi_normal | obstacle (decoy) | diamond procedurale gris | Runtime obstacle_decoy.png | 1FAE5 dotted line face | 1F47B ghost | 1F441 eye | 1F3AF bullseye | 1F4CD round pushpin | **1FAE5** moyen |
| shinobi_boss | boss (shadowNinja) | roundedRect procedurale | Runtime boss_shadow_ninja.png | 1F977 ninja | 1F47B ghost | 1F441 eye | 1F576 sunglasses | 1F5E3 speaking head | **1F977** fort |
| kombat_normal | pickup (finish token) | flame procedurale | Runtime pickup_finish_token.png | 1F3C5 sports medal | 1F396 military medal | 1FA99 coin | 1F480 skull | 1F93A person fencing | **1F3C5** fort |
| kombat_normal | obstacle (fatalZone) | cluster procedurale | Runtime obstacle_fatal_zone.png | 1F525 fire | 1F4A5 collision | 1F47A goblin | 2620 skull crossbones | 26D4 no entry | **1F525** fort |
| kombat_boss | boss (dragonGate) | roundedRect procedurale | Runtime boss_dragon_gate.png | 1F409 dragon | 1F432 dragon face | 1F004 mahjong red dragon | 1F525 fire | 2694 crossed swords | **1F409** fort |
| paperboy_normal | pickup (newspaper) | circle procedurale | Runtime pickup_newspaper.png | 1F4F0 newspaper | 1F5DE rolled-up newspaper | 1F4C3 page with curl | 1F4DC scroll | 1F3EE red paper lantern | **1F4F0** fort |
| paperboy_normal | target (mailbox) | rect procedurale | Procedural ObstacleRenderer | 1F4EB mailbox raised flag | 1F4EC open mailbox raised | 1F4EA mailbox lowered flag | 1F3E0 house | 1F4E6 package | **1F4EB** fort |
| paperboy_boss | boss (chaosObstacle) | rect procedurale orange | Runtime boss_neighborhood_chaos.png | 1F477 construction worker | 1F6A7 construction | 1F4A5 collision | 26A0 warning | 1F6D1 stop sign | **1F477** fort |

---

## Detail par univers

### CASTLE (nodes 1-2)

**castle_normal - Jardin d'Illusion** (castleIllusion, quota 10, 175ms)
- pickup (eclat magique) : forme star procedurale, PickupRenderer, couleur palette.primary
- obstacle (blinkWall) : rect 3 etats ghost/warning/active, ObstacleRenderer
- Note : Castle sans runtime PNG override intentionnellement (runtimeUniverseAssets.ts explique : "castle uses db_ assets")

**castle_boss - La Sorciere au Miroir** (witchMirror, bossHp 3, 180ms)
- boss entity (witchMirror) : roundedRect + symboles miroir dessines (croix, diamant)
- pickup (eclat = weakpoint) : forme star procedurale
- count=(3+phase)*3 miroirs, realIndex aleatoire

### SONIC (nodes 3-4)

**sonic_normal - Zone des Anneaux** (ringChains, quota 15, 135ms)
- pickup (ring actif) : ring procedurale + runtime pickup_ring.png
- obstacle (chainRing inactif) : ring procedurale gris, alpha reduit

**sonic_boss - Serpent en Boucle** (loopSerpent, bossHp 3, 145ms)
- boss body (loopSerpent body) : cercle procedurale vert 0x00aa55
- boss orb/weakpoint (loopSerpent orb) : cercle brillant 0x00ff88
- Runtime boss : boss_loop_serpent.png

### STREETS (nodes 5-6)

**streets_normal - Bagarre en Ruelle** (crowdBlockers, quota 10, 155ms)
- pickup (bonus) : diamond procedurale + runtime pickup_street_bonus.png
- obstacle (crowdBlocker) : rect 4 etats, couleurs 0xe67e22/0xff6b35

**streets_boss - Seigneur du Crime** (crimeLord, bossHp 3, 165ms)
- boss entity (crimeLord) : roundedRect procedurale + pressureZone 0xc0392b
- Runtime boss : boss_crime_lord.png

### FIGHTER (nodes 7-8)

**fighter_normal - Dojo des Guerriers** (chargeMove, quota 8, 165ms)
- pickup (energy) : lightning procedurale + runtime pickup_energy.png
- obstacle (sparZone) : cercle procedurale, SPAR_COUNT=30, respawn 18 ticks
- indicator (chargeGlow) : anneau non-collectible jaune 0xf39c12

**fighter_boss - Ultime Challenger** (finalChallenger, bossHp 3, 175ms)
- boss entity (finalChallenger) : roundedRect etats idle/attack_window/counter + counterZone
- Runtime boss : boss_final_challenger.png

### OUTRUN (nodes 9-10)

**outrun_normal - Autoroute du Soleil** (laneDrift, quota 10, 130ms)
- pickup (checkpoint) : triangle procedurale + runtime pickup_checkpoint.png
- obstacle (trafficBlock) : rect rose 0xff6b9d, 3 voies defilantes

**outrun_boss - Rival Turbo** (turboRival, bossHp 3, 140ms)
- boss entity (turboRival) : roundedRect mobile + turboZone vectorielle custom
- turboZone : dessin fleche+cercles animes, non remplacable par OpenMoji statique
- Runtime boss : boss_turbo_rival.png

### SHINOBI (nodes 11-12)

**shinobi_normal - Temple des Neiges** (focusMode, quota 8, 160ms)
- pickup (shuriken = vraie cible) : cross procedurale + runtime pickup_shuriken.png
- obstacle (focusTarget decoy) : diamant gris 50% alpha, orbite ORBIT_SPEED=PI/12

**shinobi_boss - Ninja de l'Ombre** (shadowNinja, bossHp 3, 160ms)
- boss real : roundedRect bleu 0x00b4d8
- boss shadow/faux : roundedRect sombre 0x333355
- Runtime boss : boss_shadow_ninja.png

### KOMBAT (nodes 13-14)

**kombat_normal - Arena des Enfers** (fatalZones, quota 10, 160ms)
- pickup (finish token) : flame procedurale + runtime pickup_finish_token.png
- obstacle (fatalZone) : cluster warning->active, radius 2.0-2.5, max 2 zones

**kombat_boss - Porte du Dragon** (dragonGate, bossHp 3, 170ms)
- boss entity (dragonGate) : etats closed/opening/vulnerable/danger + dangerZone
- Runtime boss : boss_dragon_gate.png

### PAPERBOY (nodes 15-16)

**paperboy_normal - Tournee du Matin** (deliveryTargets, quota 8, 110ms)
- pickup (journal) : circle procedurale + runtime pickup_newspaper.png
- target (deliveryTarget) : rect jaune 0xf1c40f si porteur de journal
- obstacle (routeObstacle) : rect gris 0x666666 statique (3 obstacles)

**paperboy_boss - Chaos du Quartier** (neighborhoodChaos, bossHp 3, 155ms)
- boss (chaosObstacle) : rect orange 0xe67e22 mobile
- target (bossTarget) : rect jaune/vert, livraison a effectuer
- Runtime boss : boss_neighborhood_chaos.png

---

## Points d'attention

### Doublons entre niveaux
- 1F31F (glowing star) : candidat castle_pickup ET shinobi_pickup -- choisir 2605 (black star) pour shinobi
- 1F525 (fire) : candidat fighter_pickup ET kombat_obstacle -- preferer 26A1 (eclair) pour fighter
- 1F93A (person fencing) : candidat fighter_boss ET kombat_pickup -- a differencier par usage
- Variants skin-tone non recommandes pour icones gameplay (utiliser version neutre sans suffixe)

### Lisibilite et contraste
- 26AA (white circle) : faible contraste fond sombre, preferer 1F48D (ring dore)
- 2747 (sparkle) : peut etre tres petit a 72px, verifier rendu en jeu
- 1F0CF (joker) : couleur noire dominante, risque sur fond sombre
- 1FAE5 (dotted line face) : original mais peut etre peu lisible a petite taille

### Coherence thematique
- 1F574 (person in suit levitating) : visuellement frappant pour crime lord mais icone obscure
- 26CE (Ophiuchus) : signe astrologique peu lisible en icone gameplay, preferer 1F40D (snake)
- E2CD (solar energy) : icone OpenMoji custom non-standard, verifier compatibilite navigateur
- 1F004 (mahjong red dragon) : contexte mahjong japonais, preferer 1F409 (dragon)

### Cas sans candidat optimal (moins de 5 tres pertinents)
- sonic_obstacle_bumper : OpenMoji sans bumper flipper, meilleur proxy 26A0 (warning) ou 1F4A5 (collision)
- outrun_boss_turboZone : zone animee custom avec fleche+cercles, aucun SVG statique adapte
- fighter_obstacle_chargeGlow : indicateur de charge abstrait, 270A (poing) acceptable comme proxy

---

## Recommandation globale

- **24 types d'icones** couverts sur 16 niveaux (1 a 3 types par niveau)
- **5 candidats valides** disponibles en SVG pour **20 types** sur 24
- **4 types** avec candidats partiellement pertinents
- Priorite de mise en oeuvre :
  1. Boss entities correspondance directe : witchMirror->1FA9E, shadowNinja->1F977, dragonGate->1F409
  2. Pickups iconiques : ring->1F48D, newspaper->1F4F0, shuriken->2605
  3. Obstacles de foule : crowdBlocker->1F6B6, trafficBlock->1F698
- Les runtime PNG assets existants (patch 943/944) sont la source principale pour 7 univers sur 8
- Castle reste procedural intentionnellement selon runtimeUniverseAssets.ts
- Code/assets src/ non modifies pour cet audit documentaire
