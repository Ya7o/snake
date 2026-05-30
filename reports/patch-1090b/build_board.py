#!/usr/bin/env python3
# Build script for icon-candidate-selection-board.html
# Run from WSL: python3 /home/kali/apps/snake/reports/patch-1090b/build_board.py

import os

OUT = "/home/kali/apps/snake/reports/patch-1090b/icon-candidate-selection-board.html"

LEVELS = [
  ("castle_normal", "Jardin d'Illusion", "normal", "castle", "castleIllusion", 175, "quota 10", [
    ("pickup", "Éclat magique (star)", "procedural",
     "PickupRenderer.drawShape() shape='star', couleur palette.primary",
     [
       ("1", "1F31F", "glowing star", "éclat brillant magique", "fort", "faible"),
       ("2", "2728", "sparkles", "étincelles multiples", "fort", "faible"),
       ("3", "1F48E", "gem stone", "gemme cristal", "moyen", "faible"),
       ("4", "2747", "sparkle", "étincelle simple", "moyen", "petit à 72px"),
       ("5", "1F4AB", "dizzy", "étoiles tourbillonnantes", "moyen", "sens ambigu"),
     ]),
    ("obstacle_blinkWall", "Mur clignotant 3 états (rect)", "procedural",
     "ObstacleRenderer.drawEntity() case 'blinkWall' — ghost/warning/active",
     [
       ("1", "1F9F1", "brick", "brique mur qui apparaît", "fort", "faible"),
       ("2", "1F47B", "ghost", "mur fantôme état ghost", "fort", "faible"),
       ("3", "1F3F0", "castle", "univers château", "moyen", "trop grand"),
       ("4", "26A0", "warning", "danger imminent", "moyen", "générique"),
       ("5", "1F6D1", "stop sign", "barrière arrêt", "moyen", "couleur forte"),
     ]),
  ]),
  ("castle_boss", "La Sorcière au Miroir", "boss", "castle", "witchMirror", 180, "bossHp 3", [
    ("boss_witchMirror", "RoundedRect + symboles miroir dessinés", "procedural",
     "ObstacleRenderer.drawEntity() cases 'witchMirror' + witchMirrorSymbol()",
     [
       ("1", "1FA9E", "mirror", "miroir exact mechanic witchMirror", "fort", "faible"),
       ("2", "1FAA9", "mirror ball", "boule miroir magique", "fort", "faible"),
       ("3", "1F9D9-200D-2640-FE0F", "woman mage", "sorcière correspondance directe", "fort", "skin tone"),
       ("4", "1F52E", "crystal ball", "boule cristal sorcière", "fort", "faible"),
       ("5", "1FA84", "magic wand", "baguette magique", "moyen", "faible"),
     ]),
    ("pickup_weakpoint", "Éclat magique (star) — weakpoint à atteindre", "procedural",
     "PickupRenderer.drawShape() shape='star' — même asset que castle_normal pickup",
     [
       ("1", "1F31F", "glowing star", "éclat brillant magique", "fort", "faible"),
       ("2", "2728", "sparkles", "étincelles multiples", "fort", "faible"),
       ("3", "1F48E", "gem stone", "gemme cristal", "moyen", "faible"),
       ("4", "2747", "sparkle", "étincelle simple", "moyen", "petit à 72px"),
       ("5", "1F4AB", "dizzy", "étoiles tourbillonnantes", "moyen", "sens ambigu"),
     ]),
  ]),
  ("sonic_normal", "Zone des Anneaux", "normal", "sonic", "ringChains", 135, "quota 15", [
    ("pickup_ring", "Anneau doré (ring procedurale)", "runtime",
     "PickupRenderer — rt_sonic_pickup → assets/runtime/universes/sonic/pickup_ring.png",
     [
       ("1", "1F48D", "ring", "anneau doré Sonic iconique", "fort", "faible"),
       ("2", "1FA99", "coin", "pièce ronde brillante", "fort", "faible"),
       ("3", "1F7E1", "yellow circle", "cercle jaune simple", "moyen", "trop simple"),
       ("4", "1F7E0", "orange circle", "cercle orange variante", "moyen", "trop simple"),
       ("5", "26AA", "white circle", "cercle blanc neutre", "faible", "faible contraste fond sombre"),
     ]),
    ("obstacle_chainRing", "Anneau gris inactif (ring procedurale)", "procedural",
     "ObstacleRenderer.drawChainRing() — type='chainRing', state='active'/'inactive'",
     [
       ("1", "26D4", "no entry", "cercle barré passage interdit", "moyen", "rouge très fort"),
       ("2", "26AA", "white circle", "anneau inactif gris", "faible", "trop similaire pickup"),
       ("3", "26A0", "warning", "danger obstacle", "moyen", "générique"),
       ("4", "1F4A3", "bomb", "danger explosion", "moyen", "sémantique létal"),
       ("5", "1F6AB", "prohibited", "interdit passage", "moyen", "faible"),
     ]),
  ]),
  ("sonic_boss", "Serpent en Boucle", "boss", "sonic", "loopSerpent", 145, "bossHp 3", [
    ("boss_loopSerpent", "Cercle brillant orb + cercle body", "runtime",
     "ObstacleRenderer.drawEntity() case 'loopSerpent' — orb=0x00ff88, body=0x00aa55; rt_sonic_boss → boss_loop_serpent.png",
     [
       ("1", "1F40D", "snake", "serpent exact mechanic loopSerpent", "fort", "faible"),
       ("2", "27B0", "curly loop", "boucle courbe trajectoire boss", "fort", "faible"),
       ("3", "27BF", "double curly loop", "double boucle plus complexe", "fort", "faible"),
       ("4", "1F300", "cyclone", "spirale tourbillon", "moyen", "faible"),
       ("5", "26CE", "Ophiuchus", "signe serpent ophiuchus", "faible", "sens astrologique"),
     ]),
    ("pickup_ring", "Anneau doré (ring procedurale)", "runtime",
     "PickupRenderer — rt_sonic_pickup → pickup_ring.png (même asset que sonic_normal)",
     [
       ("1", "1F48D", "ring", "anneau doré Sonic iconique", "fort", "faible"),
       ("2", "1FA99", "coin", "pièce ronde brillante", "fort", "faible"),
       ("3", "1F7E1", "yellow circle", "cercle jaune simple", "moyen", "trop simple"),
       ("4", "1F7E0", "orange circle", "cercle orange variante", "moyen", "trop simple"),
       ("5", "26AA", "white circle", "cercle blanc neutre", "faible", "faible contraste fond sombre"),
     ]),
  ]),
  ("streets_normal", "Bagarre en Ruelle", "normal", "streets", "crowdBlockers", 155, "quota 10", [
    ("pickup_bonus", "Diamant (diamond procedurale)", "runtime",
     "PickupRenderer — rt_streets_pickup → assets/runtime/universes/streets/pickup_street_bonus.png",
     [
       ("1", "1F48E", "gem stone", "gemme bonus rue", "fort", "faible"),
       ("2", "2666", "diamond suit", "diamant carte playing card", "fort", "faible"),
       ("3", "1F536", "large orange diamond", "grand diamant orange", "moyen", "couleur chaude"),
       ("4", "1F537", "large blue diamond", "grand diamant bleu variante", "moyen", "faible"),
       ("5", "1FA99", "coin", "pièce bonus monétaire", "moyen", "faible"),
     ]),
    ("obstacle_crowdBlocker", "Rectangle foule 4 états", "runtime",
     "ObstacleRenderer — rt_streets_obstacle → obstacle_crowd.png; états: static/moving/warning/charging/danger",
     [
       ("1", "1F6B6", "person walking", "piéton qui marche bloqueur", "fort", "faible"),
       ("2", "1F3C3", "person running", "passant qui court chargé", "fort", "faible"),
       ("3", "1F9D1", "person", "personne neutre foule", "moyen", "trop générique"),
       ("4", "1F9DF", "zombie", "zombie foule dangereuse", "moyen", "univers horror"),
       ("5", "1F46A", "family", "famille groupe obstruction", "faible", "trop friendly"),
     ]),
  ]),
  ("streets_boss", "Seigneur du Crime", "boss", "streets", "crimeLord", 165, "bossHp 3", [
    ("boss_crimeLord", "RoundedRect + pressureZone rouge", "runtime",
     "ObstacleRenderer — rt_streets_boss → boss_crime_lord.png; états: pressure/vulnerable; pressureZone 0xc0392b",
     [
       ("1", "1F574", "person in suit levitating", "personnage costume boss criminel", "fort", "icône obscure"),
       ("2", "1F454", "necktie", "cravate boss syndical", "moyen", "pas humain"),
       ("3", "1F576", "sunglasses", "lunettes noires gangster", "moyen", "faible"),
       ("4", "1F0CF", "joker", "joker carte crime", "moyen", "couleur noire dominante"),
       ("5", "1F5E1", "dagger", "poignard menace criminelle", "moyen", "faible"),
     ]),
    ("pickup_bonus", "Diamant (diamond procedurale)", "runtime",
     "PickupRenderer — rt_streets_pickup → pickup_street_bonus.png",
     [
       ("1", "1F48E", "gem stone", "gemme bonus rue", "fort", "faible"),
       ("2", "2666", "diamond suit", "diamant carte playing card", "fort", "faible"),
       ("3", "1F536", "large orange diamond", "grand diamant orange", "moyen", "couleur chaude"),
       ("4", "1F537", "large blue diamond", "grand diamant bleu variante", "moyen", "faible"),
       ("5", "1FA99", "coin", "pièce bonus monétaire", "moyen", "faible"),
     ]),
  ]),
  ("fighter_normal", "Dojo des Guerriers", "normal", "fighter", "chargeMove", 165, "quota 8", [
    ("pickup_energy", "Éclair (lightning procedurale)", "runtime",
     "PickupRenderer — rt_fighter_pickup → assets/runtime/universes/fighter/pickup_energy.png",
     [
       ("1", "26A1", "high voltage", "éclair énergie de charge", "fort", "faible"),
       ("2", "1F525", "fire", "feu puissance énergie", "fort", "doublon kombat"),
       ("3", "1F31F", "glowing star", "étoile énergie brillant", "moyen", "doublon castle"),
       ("4", "E2CD", "solar energy", "énergie solaire charge", "moyen", "OpenMoji custom"),
       ("5", "1FAAB", "low battery", "batterie vide sémantique inverse", "faible", "sémantique inverse"),
     ]),
    ("obstacle_sparZone", "Cercle de combat (fist OpenMoji)", "runtime",
     "ObstacleRenderer — FIGHTER_OPENMOJI_ICONS.sparZone → assets/openmoji/obstacles/fist.svg; fallback rt_fighter_obstacle → obstacle_charge_marker.png",
     [
       ("1", "270A", "raised fist", "poing zone de combat", "fort", "skin tone neutral"),
       ("2", "1F44A", "oncoming fist", "poing qui frappe spar", "fort", "faible"),
       ("3", "1F94B", "martial arts uniform", "kimono dojo combat", "fort", "faible"),
       ("4", "1F9B5", "leg", "jambe coup de pied", "moyen", "ambigu"),
       ("5", "1F93A", "person fencing", "escrimeur combat", "moyen", "doublon boss"),
     ]),
    ("indicator_chargeGlow", "Anneau de charge jaune (procedurale)", "procedural",
     "ObstacleRenderer.drawEntity() case 'chargeGlow' — strokeCircle x2, couleur 0xf39c12; non-collectible, indicateur visuel",
     [
       ("1", "26A1", "high voltage", "éclair charge indicateur", "fort", "partagé pickup"),
       ("2", "1F525", "fire", "feu charge puissance", "fort", "doublon kombat"),
       ("3", "1F31F", "glowing star", "étoile brillance prête", "moyen", "doublon castle"),
       ("4", "E2CD", "solar energy", "énergie solaire prête", "moyen", "OpenMoji custom"),
       ("5", "1FAAB", "low battery", "batterie inverse", "faible", "sémantique inverse"),
     ]),
  ]),
  ("fighter_boss", "Ultime Challenger", "boss", "fighter", "finalChallenger", 175, "bossHp 3", [
    ("boss_finalChallenger", "RoundedRect + counterZone rouge", "runtime",
     "ObstacleRenderer — rt_fighter_boss → boss_final_challenger.png; états: idle/attack_window/counter; counterZone 0xe74c3c",
     [
       ("1", "1F93A", "person fencing", "escrimeur challenger duel final", "fort", "faible"),
       ("2", "2694", "crossed swords", "épées croisées combat", "fort", "faible"),
       ("3", "1FA96", "military helmet", "casque militaire challenger", "fort", "faible"),
       ("4", "1F3C6", "trophy", "trophée champion ultime", "fort", "faible"),
       ("5", "1F94B", "martial arts uniform", "kimono ultime challenger", "moyen", "faible"),
     ]),
    ("pickup_energy", "Éclair (lightning procedurale)", "runtime",
     "PickupRenderer — rt_fighter_pickup → pickup_energy.png",
     [
       ("1", "26A1", "high voltage", "éclair énergie de charge", "fort", "faible"),
       ("2", "1F525", "fire", "feu puissance énergie", "fort", "doublon kombat"),
       ("3", "1F31F", "glowing star", "étoile énergie brillant", "moyen", "doublon castle"),
       ("4", "E2CD", "solar energy", "énergie solaire charge", "moyen", "OpenMoji custom"),
       ("5", "1FAAB", "low battery", "batterie vide sémantique inverse", "faible", "sémantique inverse"),
     ]),
  ]),
  ("outrun_normal", "Autoroute du Soleil", "normal", "outrun", "laneDrift", 130, "quota 10", [
    ("pickup_checkpoint", "Triangle balise (triangle procedurale)", "runtime",
     "PickupRenderer — OUTRUN_OPENMOJI_ICONS.checkpoint → assets/openmoji/pickups/trophy.svg (OpenMoji inline, priorité); rt_outrun_pickup → pickup_checkpoint.png en fallback",
     [
       ("1", "1F3C1", "chequered flag", "drapeau damiers checkpoint racing", "fort", "faible"),
       ("2", "1F6A9", "triangular flag", "drapeau triangulaire balise", "fort", "faible"),
       ("3", "26F3", "flag in hole", "drapeau trou golf", "moyen", "contexte golf"),
       ("4", "1F4CD", "round pushpin", "pin repère position", "moyen", "faible"),
       ("5", "1F3CE", "racing car", "voiture course objectif", "moyen", "doublon boss"),
     ]),
    ("obstacle_trafficBlock", "Rectangle rose voiture défilante", "runtime",
     "ObstacleRenderer — rt_outrun_obstacle → obstacle_car.png; type 'trafficBlock' 3 voies, couleur 0xff6b9d",
     [
       ("1", "1F698", "oncoming automobile", "voiture sens inverse trafic hostile", "fort", "faible"),
       ("2", "1F699", "sport utility vehicle", "SUV gros véhicule bloquant", "fort", "faible"),
       ("3", "1F697", "automobile", "voiture standard trafic", "fort", "faible"),
       ("4", "1F69B", "articulated lorry", "camion semi obstacle majeur", "moyen", "trop grand"),
       ("5", "1F6A7", "construction", "chantier route bloquée", "moyen", "faible"),
     ]),
  ]),
  ("outrun_boss", "Rival Turbo", "boss", "outrun", "turboRival", 140, "bossHp 3", [
    ("boss_turboRival", "RoundedRect mobile rose", "runtime",
     "ObstacleRenderer — rt_outrun_boss → boss_turbo_rival.png; type 'turboRival' couleur 0xff6b9d",
     [
       ("1", "1F3CE", "racing car", "voiture course rival turbo", "fort", "faible"),
       ("2", "1F4A8", "dashing away", "nuage vitesse turbo speed", "fort", "faible"),
       ("3", "1F6A8", "police car light", "gyrophare poursuivant rival", "moyen", "faible"),
       ("4", "1F699", "sport utility vehicle", "SUV rival imposant", "moyen", "faible"),
       ("5", "1F698", "oncoming automobile", "voiture rival en face", "moyen", "doublon obstacle"),
     ]),
    ("special_turboZone", "Flèche animée + cercles vectoriels (procedurale custom)", "procedural",
     "ObstacleRenderer.drawTurboZone() — dessin custom: fillCircle+fillRoundedRect+strokeCircle+lineBetween; couleur 0xffd32a/0x18f7ff; NON remplaçable par SVG statique",
     [
       ("1", "1F3CE", "racing car", "voiture associée turbo", "moyen", "partagé boss"),
       ("2", "1F4A8", "dashing away", "nuage vitesse turbo", "moyen", "partagé boss"),
       ("3", "26A1", "high voltage", "énergie boost turbo", "moyen", "générique"),
       ("4", "1F699", "sport utility vehicle", "SUV zone turbo", "faible", "peu lisible"),
       ("5", "1F6A8", "police car light", "gyrophare zone rapide", "faible", "générique"),
     ]),
    ("pickup_checkpoint", "Triangle balise (triangle procedurale)", "runtime",
     "PickupRenderer — OUTRUN_OPENMOJI_ICONS.checkpoint → trophy.svg",
     [
       ("1", "1F3C1", "chequered flag", "drapeau damiers checkpoint racing", "fort", "faible"),
       ("2", "1F6A9", "triangular flag", "drapeau triangulaire balise", "fort", "faible"),
       ("3", "26F3", "flag in hole", "drapeau trou golf", "moyen", "contexte golf"),
       ("4", "1F4CD", "round pushpin", "pin repère position", "moyen", "faible"),
       ("5", "1F3CE", "racing car", "voiture course objectif", "moyen", "doublon boss"),
     ]),
  ]),
  ("shinobi_normal", "Temple des Neiges", "normal", "shinobi", "focusMode", 160, "quota 8", [
    ("pickup_shuriken", "Croix shuriken (cross procedurale)", "runtime",
     "PickupRenderer — rt_shinobi_pickup → assets/runtime/universes/shinobi/pickup_shuriken.png",
     [
       ("1", "2605", "black star", "étoile noire shuriken 5 branches", "fort", "faible"),
       ("2", "2B50", "star", "étoile standard jaune", "fort", "faible"),
       ("3", "1F4AB", "dizzy", "étoiles tourbillonnement shuriken", "moyen", "faible"),
       ("4", "2747", "sparkle", "étincelle étoile", "moyen", "petit à 72px"),
       ("5", "1F31F", "glowing star", "étoile brillante cible réelle", "moyen", "doublon castle"),
     ]),
    ("obstacle_focusDecoy", "Diamant gris leurre (diamond procedurale)", "runtime",
     "ObstacleRenderer — type 'focusTarget' state='decoy' alpha 0.5; rt_shinobi_obstacle → obstacle_decoy.png",
     [
       ("1", "1FAE5", "dotted line face", "visage pointillé leurre fantôme", "moyen", "peu lisible"),
       ("2", "1F47B", "ghost", "fantôme leurre illusion", "fort", "faible"),
       ("3", "1F441", "eye", "oeil fausse cible piège", "moyen", "faible"),
       ("4", "1F3AF", "bullseye", "cible fausse fléchette", "moyen", "ressemble pickup"),
       ("5", "1F4CD", "round pushpin", "marqueur fausse position", "faible", "trop générique"),
     ]),
  ]),
  ("shinobi_boss", "Ninja de l'Ombre", "boss", "shinobi", "shadowNinja", 160, "bossHp 3", [
    ("boss_shadowNinja", "RoundedRect bleu/sombre real+shadow", "runtime",
     "ObstacleRenderer — rt_shinobi_boss → boss_shadow_ninja.png; type 'shadowNinja' real=0x00b4d8, shadow=0x333355",
     [
       ("1", "1F977", "ninja", "ninja exact mechanic shadowNinja", "fort", "skin tone neutral"),
       ("2", "1F47B", "ghost", "ombre fantôme shadow", "fort", "faible"),
       ("3", "1F441", "eye", "oeil qui observe ombre ninja", "moyen", "faible"),
       ("4", "1F576", "sunglasses", "lunettes noires ninja discret", "moyen", "faible"),
       ("5", "1F5E3", "speaking head", "silhouette tête fantôme", "faible", "ambigu"),
     ]),
    ("pickup_shuriken", "Croix shuriken (cross procedurale)", "runtime",
     "PickupRenderer — rt_shinobi_pickup → pickup_shuriken.png",
     [
       ("1", "2605", "black star", "étoile noire shuriken 5 branches", "fort", "faible"),
       ("2", "2B50", "star", "étoile standard jaune", "fort", "faible"),
       ("3", "1F4AB", "dizzy", "étoiles tourbillonnement shuriken", "moyen", "faible"),
       ("4", "2747", "sparkle", "étincelle étoile", "moyen", "petit à 72px"),
       ("5", "1F31F", "glowing star", "étoile brillante cible réelle", "moyen", "doublon castle"),
     ]),
  ]),
  ("kombat_normal", "Arène des Enfers", "normal", "kombat", "fatalZones", 160, "quota 10", [
    ("pickup_finishToken", "Flamme 7-pts (flame procedurale)", "runtime",
     "PickupRenderer — rt_kombat_pickup → assets/runtime/universes/kombat/pickup_finish_token.png",
     [
       ("1", "1F3C5", "sports medal", "médaille token victoire kombat", "fort", "faible"),
       ("2", "1F396", "military medal", "médaille militaire combat", "fort", "faible"),
       ("3", "1FA99", "coin", "pièce token finish", "moyen", "faible"),
       ("4", "1F480", "skull", "crâne trophée kombat fatality", "moyen", "ambigu vs obstacle"),
       ("5", "1F93A", "person fencing", "combat finish token", "faible", "doublon fighter boss"),
     ]),
    ("obstacle_fatalZone", "Cluster de danger warning/active", "runtime",
     "ObstacleRenderer — rt_kombat_obstacle → obstacle_fatal_zone.png; états: warning/active; 2 zones max, radius 2.0-2.5",
     [
       ("1", "1F525", "fire", "feu lava zone fatale", "fort", "doublon fighter pickup"),
       ("2", "1F4A5", "collision", "explosion impact zone", "fort", "faible"),
       ("3", "1F47A", "goblin", "goblin démon arène", "moyen", "univers fantaisie"),
       ("4", "2620", "skull and crossbones", "danger mortel zone fatale", "moyen", "fort sémantique mort"),
       ("5", "26D4", "no entry", "interdit zone bloquée", "moyen", "faible"),
     ]),
  ]),
  ("kombat_boss", "Porte du Dragon", "boss", "kombat", "dragonGate", 170, "bossHp 3", [
    ("boss_dragonGate", "RoundedRect + dangerZone rouge", "runtime",
     "ObstacleRenderer — rt_kombat_boss → boss_dragon_gate.png; états: closed/opening/vulnerable/danger; dangerZone 0xc0392b",
     [
       ("1", "1F409", "dragon", "dragon complet porte du dragon", "fort", "faible"),
       ("2", "1F432", "dragon face", "tête dragon boss", "fort", "faible"),
       ("3", "1F004", "mahjong red dragon", "dragon mahjong rouge", "moyen", "contexte mahjong"),
       ("4", "1F525", "fire", "feu dragon souffle", "moyen", "générique"),
       ("5", "2694", "crossed swords", "combat porte gardée", "faible", "trop générique"),
     ]),
    ("pickup_finishToken", "Flamme 7-pts (flame procedurale)", "runtime",
     "PickupRenderer — rt_kombat_pickup → pickup_finish_token.png",
     [
       ("1", "1F3C5", "sports medal", "médaille token victoire kombat", "fort", "faible"),
       ("2", "1F396", "military medal", "médaille militaire combat", "fort", "faible"),
       ("3", "1FA99", "coin", "pièce token finish", "moyen", "faible"),
       ("4", "1F480", "skull", "crâne trophée kombat fatality", "moyen", "ambigu vs obstacle"),
       ("5", "1F93A", "person fencing", "combat finish token", "faible", "doublon fighter boss"),
     ]),
  ]),
  ("paperboy_normal", "Tournée du Matin", "normal", "paperboy", "deliveryTargets", 110, "quota 8", [
    ("pickup_newspaper", "Cercle journal (circle procedurale)", "runtime",
     "PickupRenderer — PAPERBOY_OPENMOJI_ICONS.newspaper → assets/openmoji/pickups/newspaper.svg (OpenMoji inline, priorité); rt_paperboy_pickup → pickup_newspaper.png en fallback",
     [
       ("1", "1F4F0", "newspaper", "journal pickup Paperboy iconique", "fort", "faible"),
       ("2", "1F5DE", "rolled-up newspaper", "journal roulé à lancer", "fort", "faible"),
       ("3", "1F4C3", "page with curl", "page livraison document", "moyen", "faible"),
       ("4", "1F4DC", "scroll", "parchemin livraison", "faible", "anachronique"),
       ("5", "1F3EE", "red paper lantern", "lanterne papier clin d'oeil", "faible", "univers japonais"),
     ]),
    ("target_deliveryTarget", "Rectangle jaune/vert cible livraison", "procedural",
     "ObstacleRenderer — PAPERBOY_OPENMOJI_ICONS.deliveryTarget → assets/openmoji/obstacles/mailbox.svg (OpenMoji inline); fallback rect jaune 0xf1c40f/0x27ae60",
     [
       ("1", "1F4EB", "closed mailbox with raised flag", "boîte aux lettres cible livraison", "fort", "faible"),
       ("2", "1F4EC", "open mailbox with raised flag", "boîte ouverte livraison effectuée", "fort", "faible"),
       ("3", "1F4EA", "closed mailbox with lowered flag", "boîte vide pas de livraison", "moyen", "sémantique négatif"),
       ("4", "1F3E0", "house", "maison destination livraison", "moyen", "faible"),
       ("5", "1F4E6", "package", "colis livraison alternative", "moyen", "faible"),
     ]),
    ("obstacle_routeObstacle", "Rectangle gris statique (3 obstacles)", "procedural",
     "ObstacleRenderer — PAPERBOY_OPENMOJI_ICONS.routeObstacle → assets/openmoji/obstacles/roadblock.svg (OpenMoji inline); fallback rect gris 0x666666; 3 obstacles statiques",
     [
       ("1", "1F4EB", "closed mailbox with raised flag", "boîte sur route obstacle", "moyen", "doublon target"),
       ("2", "1F4EC", "open mailbox with raised flag", "boîte ouverte route", "moyen", "doublon target"),
       ("3", "1F4EA", "closed mailbox with lowered flag", "boîte vide route", "moyen", "doublon target"),
       ("4", "1F3E0", "house", "maison route bloquée", "moyen", "faible"),
       ("5", "1F4E6", "package", "colis route obstacle", "moyen", "faible"),
     ]),
  ]),
  ("paperboy_boss", "Chaos du Quartier", "boss", "paperboy", "neighborhoodChaos", 155, "bossHp 3", [
    ("boss_chaosObstacle", "Rectangle orange mobile", "runtime",
     "ObstacleRenderer — rt_paperboy_boss → boss_neighborhood_chaos.png; type 'chaosObstacle' couleur 0xe67e22",
     [
       ("1", "1F477", "construction worker", "ouvrier chaos quartier", "fort", "faible"),
       ("2", "1F6A7", "construction", "chantier barrage chaos", "fort", "faible"),
       ("3", "1F4A5", "collision", "collision explosion chaos", "moyen", "faible"),
       ("4", "26A0", "warning", "danger avertissement", "moyen", "générique"),
       ("5", "1F6D1", "stop sign", "stop signe blocage chaos", "moyen", "faible"),
     ]),
    ("target_bossTarget", "Rectangle jaune/vert cible livraison (boss)", "procedural",
     "ObstacleRenderer — PAPERBOY_OPENMOJI_ICONS.deliveryTarget → mailbox.svg; bossTarget = même rendu que deliveryTarget en mode boss",
     [
       ("1", "1F4EB", "closed mailbox with raised flag", "boîte aux lettres cible livraison", "fort", "faible"),
       ("2", "1F4EC", "open mailbox with raised flag", "boîte ouverte livraison effectuée", "fort", "faible"),
       ("3", "1F4EA", "closed mailbox with lowered flag", "boîte vide pas de livraison", "moyen", "sémantique négatif"),
       ("4", "1F3E0", "house", "maison destination livraison", "moyen", "faible"),
       ("5", "1F4E6", "package", "colis livraison alternative", "moyen", "faible"),
     ]),
    ("pickup_newspaper", "Cercle journal (circle procedurale)", "runtime",
     "PickupRenderer — PAPERBOY_OPENMOJI_ICONS.newspaper → newspaper.svg",
     [
       ("1", "1F4F0", "newspaper", "journal pickup Paperboy iconique", "fort", "faible"),
       ("2", "1F5DE", "rolled-up newspaper", "journal roulé à lancer", "fort", "faible"),
       ("3", "1F4C3", "page with curl", "page livraison document", "moyen", "faible"),
       ("4", "1F4DC", "scroll", "parchemin livraison", "faible", "anachronique"),
       ("5", "1F3EE", "red paper lantern", "lanterne papier clin d'oeil", "faible", "univers japonais"),
     ]),
  ]),
]

SOURCE_BADGE = {
  "procedural": ("badge-procedural", "procédural"),
  "runtime": ("badge-runtime", "runtime PNG"),
  "asset": ("badge-asset", "asset"),
  "emoji": ("badge-emoji", "emoji inline"),
}
RELEVANCE_BADGE = {
  "fort": "badge-fort",
  "moyen": "badge-moyen",
  "faible": "badge-faible",
}
UNIVERSE_EMOJI = {
  "castle": "&#127984;", "sonic": "&#128142;", "streets": "&#129354;", "fighter": "&#9889;",
  "outrun": "&#128663;", "shinobi": "&#127769;", "kombat": "&#128293;", "paperboy": "&#128240;",
}

HTML_HEADER = '''<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Snake Drive V4 — PATCH 1090B v2 — Icon Candidate Selection Board</title>
<style>
* { box-sizing: border-box; margin: 0; padding: 0; }
body {
  background: #0d0d1a;
  color: #e0e0f0;
  font-family: 'Segoe UI', system-ui, sans-serif;
  font-size: 13px;
  line-height: 1.4;
  padding: 16px;
}
h1 {
  text-align: center;
  font-size: 22px;
  color: #a78bfa;
  margin-bottom: 6px;
  letter-spacing: 0.04em;
}
.subtitle {
  text-align: center;
  color: #6b7280;
  font-size: 12px;
  margin-bottom: 24px;
}
details {
  margin-bottom: 18px;
  border: 1px solid #2a2a4a;
  border-radius: 10px;
  overflow: hidden;
}
summary {
  cursor: pointer;
  background: #1a1a35;
  padding: 12px 16px;
  font-size: 15px;
  font-weight: 700;
  color: #c4b5fd;
  display: flex;
  align-items: center;
  gap: 10px;
  user-select: none;
  border-bottom: 1px solid #2a2a4a;
  list-style: none;
}
summary::-webkit-details-marker { display: none; }
summary::before {
  content: "&#9658;";
  font-size: 11px;
  transition: transform 0.2s;
  color: #6b7280;
}
details[open] summary::before { transform: rotate(90deg); }
.level-meta {
  background: #111128;
  padding: 8px 16px 10px;
  font-size: 11px;
  color: #6b7280;
  border-bottom: 1px solid #1e1e38;
  display: flex; gap: 16px; flex-wrap: wrap;
}
.level-meta strong { color: #c4b5fd; }
.icon-section { padding: 14px 14px 6px; }
.icon-type-label {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  color: #6b7280;
  letter-spacing: 0.08em;
  margin-bottom: 8px;
  margin-top: 10px;
  padding-left: 2px;
  border-left: 3px solid #2a2a4a;
  padding-left: 8px;
}
.icon-row {
  display: grid;
  grid-template-columns: minmax(140px, 170px) repeat(5, minmax(100px, 1fr));
  gap: 8px;
  margin-bottom: 14px;
  align-items: start;
}
.card {
  background: #161628;
  border: 1px solid #2a2a4a;
  border-radius: 8px;
  padding: 10px 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  min-height: 180px;
  transition: border-color 0.15s;
}
.card:hover { border-color: #4c3f8a; }
.card.current {
  border-color: #d97706;
  background: #1c1508;
  box-shadow: 0 0 0 1px rgba(217,119,6,0.25);
}
.card-title {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #6b7280;
  text-align: center;
}
.card.current .card-title { color: #d97706; }
.card-img {
  width: 64px;
  height: 64px;
  object-fit: contain;
}
.card-proc {
  font-size: 48px;
  color: #374151;
  text-align: center;
  padding: 4px;
  line-height: 1;
}
.card-proc.runtime { font-size: 42px; }
.card-name {
  font-size: 10px;
  font-weight: 700;
  color: #c4b5fd;
  text-align: center;
  word-break: break-all;
}
.card-desc { font-size: 10px; color: #d97706; text-align: center; font-weight: 600; }
.card-reason {
  font-size: 10px;
  color: #9ca3af;
  text-align: center;
  font-style: italic;
}
.card-code {
  font-size: 8px;
  color: #374151;
  text-align: center;
  word-break: break-all;
  font-family: monospace;
  max-height: 32px;
  overflow: hidden;
}
.badge {
  display: inline-block;
  border-radius: 4px;
  padding: 1px 5px;
  font-size: 9px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.badge-fort { background: #14532d; color: #86efac; }
.badge-moyen { background: #78350f; color: #fde68a; }
.badge-faible { background: #1f2937; color: #6b7280; }
.badge-current { background: #78350f; color: #fbbf24; border: 1px solid #d97706; }
.badge-emoji { background: #1e3a5f; color: #93c5fd; }
.badge-procedural { background: #2d1b4e; color: #c4b5fd; }
.badge-asset { background: #14432a; color: #6ee7b7; }
.badge-runtime { background: #1c3a5e; color: #7dd3fc; }
.badge-risk {
  display: inline-block;
  border-radius: 3px;
  padding: 1px 4px;
  font-size: 8px;
  color: #f87171;
  background: #3b0f0f;
  border: 1px solid #7f1d1d;
}
.sel-id {
  font-size: 8px;
  font-family: monospace;
  color: #6b7280;
  background: #0d0d1a;
  border: 1px solid #2a2a4a;
  border-radius: 3px;
  padding: 2px 4px;
  cursor: pointer;
  text-align: center;
  width: 100%;
  transition: background 0.1s;
}
.sel-id:hover { background: #1a1a35; color: #a78bfa; }
.badge-level-normal { background: #14432a; color: #6ee7b7; }
.badge-level-boss { background: #4a0f0f; color: #f87171; }
.toc {
  background: #111128;
  border: 1px solid #2a2a4a;
  border-radius: 10px;
  padding: 12px 16px;
  margin-bottom: 22px;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.toc a {
  font-size: 11px;
  color: #a78bfa;
  text-decoration: none;
  background: #1a1a35;
  border: 1px solid #2a2a4a;
  border-radius: 5px;
  padding: 3px 8px;
}
.toc a:hover { background: #2a2a4a; }
</style>
</head>
<body>
<h1>PATCH 1090B v2 &#8212; Icon Candidate Selection Board</h1>
<div class="subtitle">Snake Drive V4 &bull; 16 niveaux &bull; 27 types d&apos;ic&ocirc;nes r&eacute;els &bull; Candidats OpenMoji &bull; Ic&ocirc;ne actuelle affich&eacute;e</div>
<div class="toc">
  <a href="#castle_normal">Castle Normal</a>
  <a href="#castle_boss">Castle Boss</a>
  <a href="#sonic_normal">Sonic Normal</a>
  <a href="#sonic_boss">Sonic Boss</a>
  <a href="#streets_normal">Streets Normal</a>
  <a href="#streets_boss">Streets Boss</a>
  <a href="#fighter_normal">Fighter Normal</a>
  <a href="#fighter_boss">Fighter Boss</a>
  <a href="#outrun_normal">OutRun Normal</a>
  <a href="#outrun_boss">OutRun Boss</a>
  <a href="#shinobi_normal">Shinobi Normal</a>
  <a href="#shinobi_boss">Shinobi Boss</a>
  <a href="#kombat_normal">Kombat Normal</a>
  <a href="#kombat_boss">Kombat Boss</a>
  <a href="#paperboy_normal">Paperboy Normal</a>
  <a href="#paperboy_boss">Paperboy Boss</a>
</div>
'''

HTML_FOOTER = '''<script>
document.querySelectorAll('.sel-id').forEach(function(el) {
  el.addEventListener('click', function() {
    var t = el.getAttribute('data-id');
    if (navigator.clipboard) { navigator.clipboard.writeText(t).catch(function(){}); }
    el.textContent = 'copie!';
    setTimeout(function(){ el.textContent = t; }, 1400);
  });
});
</script>
</body>
</html>
'''

def source_badge_html(src):
    cls, label = SOURCE_BADGE.get(src, ("badge-procedural", src))
    return '<span class="badge {}">{}</span>'.format(cls, label)

def rel_badge_html(rel):
    cls = RELEVANCE_BADGE.get(rel, "badge-faible")
    return '<span class="badge {}">{}</span>'.format(cls, rel)

def card_candidate_html(level_id, icon_type, rank, svg_id, name, reason, relevance, risk):
    img_path = "preview-assets/{}.svg".format(svg_id)
    rel_b = rel_badge_html(relevance)
    risk_html = '<span class="badge-risk">{}</span>'.format(risk) if risk and risk != "faible" else ""
    sel_id = "{}.{}.c{}".format(level_id, icon_type, rank)
    return '''<div class="card">
  <div class="card-title">C{rank}</div>
  <img class="card-img" src="{img}" alt="{name}" loading="lazy" onerror="this.style.opacity='0.2'">
  <div class="card-name">{svg_id}</div>
  <div class="card-reason">{name}</div>
  <div class="card-reason">{reason}</div>
  {rel_b}
  {risk_html}
  <div class="sel-id" data-id="{sel_id}">{sel_id}</div>
</div>'''.format(rank=rank, img=img_path, name=name, svg_id=svg_id,
                 reason=reason, rel_b=rel_b, risk_html=risk_html, sel_id=sel_id)

def card_current_html(icon_type, icon_desc, source, value):
    src_b = source_badge_html(source)
    if source == "procedural":
        visual = '<div class="card-proc">&#9109;</div>'
    elif source == "runtime":
        visual = '<div class="card-proc runtime">&#128247;</div>'
    else:
        visual = '<div class="card-proc">&#128196;</div>'
    short_desc = icon_desc[:50] + "..." if len(icon_desc) > 50 else icon_desc
    short_val = value[:70] + "..." if len(value) > 70 else value
    return '''<div class="card current">
  <div class="card-title">ACTUEL</div>
  {visual}
  <div class="card-desc">{icon_type}</div>
  <div class="card-reason">{desc}</div>
  {src_b}
  <span class="badge badge-current">actuel</span>
  <div class="card-code">{val}</div>
</div>'''.format(visual=visual, icon_type=icon_type, desc=short_desc, src_b=src_b, val=short_val)

parts = [HTML_HEADER]

for (level_id, level_name, level_type, universe, mechanic, speed, quota, icon_types) in LEVELS:
    univ_e = UNIVERSE_EMOJI.get(universe, "")
    type_cls = "badge-level-boss" if level_type == "boss" else "badge-level-normal"
    type_lbl = "BOSS" if level_type == "boss" else "NORMAL"

    parts.append('<details id="{}" open>'.format(level_id))
    parts.append('<summary>{} {} &nbsp;<span class="badge {}">{}</span> &nbsp;<span style="color:#6b7280;font-size:11px;font-weight:400">{} &mdash; {}</span></summary>'.format(
        univ_e, level_name, type_cls, type_lbl, universe, level_id))
    parts.append('<div class="level-meta"><span>M&eacute;canique: <strong>{}</strong></span><span>Vitesse: <strong>{}ms</strong></span><span>Objectif: <strong>{}</strong></span></div>'.format(mechanic, speed, quota))
    parts.append('<div class="icon-section">')

    for (icon_type, icon_desc, source, value, candidates) in icon_types:
        parts.append('<div class="icon-type-label">{}</div>'.format(icon_type))
        parts.append('<div class="icon-row">')
        parts.append(card_current_html(icon_type, icon_desc, source, value))
        for (rank, svg_id, name, reason, relevance, risk) in candidates:
            parts.append(card_candidate_html(level_id, icon_type, rank, svg_id, name, reason, relevance, risk))
        parts.append('</div>')

    parts.append('</div>')
    parts.append('</details>')

parts.append(HTML_FOOTER)

content = '\n'.join(parts)
with open(OUT, 'w', encoding='utf-8') as f:
    f.write(content)

total_types = sum(len(ico) for (_, _, _, _, _, _, _, ico) in LEVELS)
print("HTML written to: {}".format(OUT))
print("Total levels: {}".format(len(LEVELS)))
print("Total icon types: {}".format(total_types))
print("File size: {} KB".format(len(content) // 1024))
