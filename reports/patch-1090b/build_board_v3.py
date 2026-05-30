#!/usr/bin/env python3
# Build script v3 — 10 candidates + multi-state icon handling
# Run from WSL: python3 /home/kali/apps/snake/reports/patch-1090b/build_board_v3.py

import os
import shutil
import csv

SRC_EMOJI = "/home/kali/apps/snake/design_boards/openemoji/color/svg"
PREVIEW_DIR = "/home/kali/apps/snake/reports/patch-1090b/preview-assets"
OUT_HTML = "/home/kali/apps/snake/reports/patch-1090b/icon-candidate-selection-board.html"
OUT_CSV = "/home/kali/apps/snake/reports/patch-1090b/logs/icon-selection-options.csv"

# ─── ICON CATALOG ───────────────────────────────────────────────────────────
# Format: (icon_type, current_desc, current_source, current_code, multi_states, states_desc, candidates)
# candidates: list of (rank, svg_id, name, reason, relevance, risk, pair_with_rank)
# pair_with_rank: None or rank number of the pair partner (for multi-state pairs)

LEVELS = [

  # ── CASTLE NORMAL ──────────────────────────────────────────────────────────
  ("castle_normal", "Jardin d'Illusion", "normal", "castle", [

    ("pickup", "Étoile 5 branches (star)", "procedural",
     "PickupRenderer.drawShape() shape='star', couleur palette.primary",
     False, [],
     [
       ("1", "1F31F", "glowing star", "éclat brillant magique — forme star directe", "fort", "faible", None),
       ("2", "2728", "sparkles", "étincelles multiples — magic scatter", "fort", "faible", None),
       ("3", "1F48E", "gem stone", "gemme cristal taillée — collectible précieux", "fort", "faible", None),
       ("4", "2B50", "star", "étoile classique — universel pickup", "fort", "faible", None),
       ("5", "2605", "white star", "étoile blanche — variante minimaliste", "moyen", "contraste fond sombre", None),
       ("6", "1FA84", "magic wand", "baguette magique — univers château/magie", "moyen", "faible", None),
       ("7", "2747", "sparkle", "étincelle unique — discret mais lisible", "moyen", "petit à 72px", None),
       ("8", "1F4AB", "dizzy stars", "étoiles tourbillonnantes — collecte dynamique", "moyen", "sens ambigu", None),
       ("9", "1F380", "ribbon", "ruban cadeau — bonus précieux", "faible", "pas assez action", None),
       ("10", "1F525", "fire", "flamme — pickup énergétique, univers magique", "faible", "confondu obstacle", None),
     ]),

    ("obstacle_blinkWall", "Rectangle 3 états (ghost/warning/active)", "procedural",
     "ObstacleRenderer.drawEntity() case 'blinkWall' — couleurs ghost:0x4a235a warning:0xf39c12 active:0xe74c3c",
     True,
     [
       ("ghost", "rect violet semi-transparent (#4a235a, alpha 0.24) — mur fantôme invisible"),
       ("warning", "rect orange vif (#f39c12, alpha 0.62) + croix blanche — apparition imminente"),
       ("active", "rect rouge (#e74c3c, alpha 1.0) + X rouge — collision létale"),
     ],
     [
       ("1", "1F9F1", "brick", "brique — mur solide, direct pour état active", "fort", "faible", None),
       ("2", "1F47B", "ghost", "fantôme — parfait pour état ghost translucide", "fort", "faible", None),
       ("3", "1F512", "locked", "cadenas fermé — mur verrouillé, état active/bloquant", "fort", "faible", "4"),
       ("4", "1F513", "unlocked", "cadenas ouvert — état ghost/inactif, paire avec locked", "fort", "faible", "3"),
       ("5", "1F6E1", "shield", "bouclier — obstacle protecteur bloquant", "moyen", "faible", None),
       ("6", "1F3F0", "castle", "château — thème univers castle, trop global", "moyen", "trop grand", None),
       ("7", "26A0", "warning", "triangle danger — état warning parfait", "moyen", "générique", None),
       ("8", "1F6D1", "stop sign", "stop — barrière arrêt, état active", "moyen", "couleur forte", None),
       ("9", "26AB", "black circle", "cercle noir — obstacle minimal discret", "faible", "trop générique", None),
       ("10", "1F4A5", "collision", "collision — impact visuel fort état active", "moyen", "confondu effet", None),
     ]),
  ]),

  # ── CASTLE BOSS ────────────────────────────────────────────────────────────
  ("castle_boss", "La Sorcière au Miroir", "boss", "castle", [

    ("boss_witchMirror", "RoundedRect + symboles miroir dessinés par état", "procedural",
     "ObstacleRenderer — couleurs idle:0x6c5ce7 warning:0xf39c12 attacking:0xe74c3c vulnerable:0xf1c40f hit:0xffffff defeated:0x7cff9d",
     True,
     [
       ("idle", "rect arrondi violet (#6c5ce7, alpha 0.28) — miroir dormant"),
       ("warning", "rect arrondi orange (#f39c12, alpha 0.72) + diagonales — activation imminente"),
       ("attacking", "rect arrondi rouge (#e74c3c, alpha 0.95) + X rouge — attaque en cours"),
       ("vulnerable", "rect arrondi jaune (#f1c40f, alpha 1.0) + diamant blanc — point faible exposé"),
       ("hit", "rect arrondi blanc (#ffffff, alpha 1.0) — touché / flash"),
       ("defeated", "disparu du rendu — boss vaincu"),
     ],
     [
       ("1", "1FA9E", "mirror", "miroir — correspondance exacte mechanic witchMirror", "fort", "faible", None),
       ("2", "1FAA9", "mirror ball", "boule miroir — variante disco magique", "fort", "faible", None),
       ("3", "1F9D9-200D-2640-FE0F", "woman mage", "sorcière — correspondance directe thème boss", "fort", "skin tone", None),
       ("4", "1F52E", "crystal ball", "boule cristal — divination sorcière", "fort", "faible", None),
       ("5", "1F300", "cyclone", "cyclone — attaque tourbillonnante sorcière", "moyen", "faible", None),
       ("6", "1F47C", "baby angel", "ange — fausse apparence innocente miroir", "moyen", "sens trompeur", None),
       ("7", "1F52A", "dagger", "dague — menace directe, état attacking", "moyen", "générique danger", None),
       ("8", "1F31E", "sun", "soleil — lumière / miroir qui reflète", "moyen", "trop positif", None),
       ("9", "1F512", "locked", "cadenas fermé — état idle miroir fermé", "moyen", "faible", None),
       ("10", "2728", "sparkles", "étincelles — magie miroir scintillant", "moyen", "confondu pickup", None),
     ]),

    ("pickup_weakpoint", "Étoile 5 branches (star) — weakpoint boss castle", "procedural",
     "PickupRenderer.drawShape() shape='star' — même asset castle pickup",
     False, [],
     [
       ("1", "1F31F", "glowing star", "éclat brillant magique — weakpoint lumineux", "fort", "faible", None),
       ("2", "2728", "sparkles", "étincelles — point faible scintillant", "fort", "faible", None),
       ("3", "1F48E", "gem stone", "gemme cristal — weakpoint précieux à toucher", "fort", "faible", None),
       ("4", "2B50", "star", "étoile — weakpoint universel", "fort", "faible", None),
       ("5", "2605", "white star", "étoile blanche — variante claire", "moyen", "contraste", None),
       ("6", "1FA84", "magic wand", "baguette — taper le miroir avec la baguette", "moyen", "faible", None),
       ("7", "1F4AB", "dizzy", "étoiles tourbillonnantes — effet hit", "moyen", "sens ambigu", None),
       ("8", "1F536", "large orange diamond", "diamant orange — cible boss brillante", "moyen", "faible", None),
       ("9", "1F537", "large blue diamond", "diamant bleu — variante bleue weakpoint", "moyen", "faible", None),
       ("10", "2747", "sparkle", "étincelle — weakpoint discret", "faible", "trop petit", None),
     ]),
  ]),

  # ── SONIC NORMAL ───────────────────────────────────────────────────────────
  ("sonic_normal", "Zone des Anneaux", "normal", "sonic", [

    ("pickup_ring", "Anneau vide avec reflet (ring shape)", "procedural",
     "PickupRenderer.drawShape() shape='ring', couleur palette.primary — stroke circle + reflet arc",
     False, [],
     [
       ("1", "1F48D", "ring", "anneau doré — iconique Sonic", "fort", "faible", None),
       ("2", "1FA99", "coin", "pièce ronde brillante — collectible circulaire", "fort", "faible", None),
       ("3", "1F7E1", "yellow circle", "cercle jaune — anneau simplifié", "moyen", "trop simple", None),
       ("4", "1F7E0", "orange circle", "cercle orange — variante chaude", "moyen", "trop simple", None),
       ("5", "1F534", "red circle", "cercle rouge — contraste élevé", "faible", "couleur danger", None),
       ("6", "2B55", "red circle large", "grand cercle — bague épurée", "moyen", "confondu obstacle", None),
       ("7", "26AA", "white circle", "cercle blanc — anneau neutre", "faible", "faible contraste", None),
       ("8", "1F440", "eyes", "yeux — anneaux style cartoon eyes", "faible", "sens incohérent", None),
       ("9", "1F300", "cyclone", "spirale anneau — mouvement circulaire", "moyen", "trop complexe", None),
       ("10", "1F380", "ribbon", "ruban — forme anneau fermé", "faible", "trop décoratif", None),
     ]),

    ("obstacle_chainRing", "Anneau chaîne 2 états (active/inactive)", "procedural",
     "ObstacleRenderer.drawChainRing() — active:0xf9ca24 gros ring+glow / inactive:0x5d4e00 petit ring semi-transparent",
     True,
     [
       ("active", "grand anneau jaune (#f9ca24, épaisseur 4, alpha 1.0) + cercle intérieur blanc — anneau actif à collecter"),
       ("inactive", "petit anneau brun (#5d4e00, épaisseur 2, alpha 0.72) — anneau inactif, pas encore actif"),
     ],
     [
       ("1", "1F48D", "ring", "anneau — état active doré, inactive terne", "fort", "faible", None),
       ("2", "1FA99", "coin", "pièce — actif brillant, inactif mat", "fort", "faible", None),
       ("3", "26AA", "white circle", "cercle — anneau inactif neutre, paire avec 1FA99", "moyen", "faible contraste", "2"),
       ("4", "1F7E1", "yellow circle", "jaune — active lumineux", "moyen", "trop simple", None),
       ("5", "1F534", "red circle", "rouge — état danger dans chaîne", "faible", "sens danger", None),
       ("6", "27B0", "curly loop", "boucle — forme anneau décoratif", "moyen", "trop stylisé", None),
       ("7", "1F300", "cyclone", "spirale — anneaux tournants", "moyen", "trop complexe", None),
       ("8", "2B55", "hollow circle", "cercle vide — inactive évident", "moyen", "confus", None),
       ("9", "1F9E8", "firecracker", "pétard — anneau qui explose si mal collecté", "faible", "hors thème", None),
       ("10", "1F536", "orange diamond", "diamant — variante forme alternative", "faible", "forme erronée", None),
     ]),
  ]),

  # ── SONIC BOSS ─────────────────────────────────────────────────────────────
  ("sonic_boss", "Le Serpent des Boucles", "boss", "sonic", [

    ("boss_loopSerpent", "Cercle orbe/corps 2 états", "procedural",
     "ObstacleRenderer.drawEntity() case 'loopSerpent' — orb:0x00ff88 cercle 0.4+ring / body:0x00aa55 cercle 0.3",
     True,
     [
       ("orb", "grand cercle vert vif (#00ff88, radius 0.4) + anneau blanc — orbe vulnérable en queue"),
       ("body", "petit cercle vert foncé (#00aa55, radius 0.3, alpha 0.7) — segment de corps du serpent"),
     ],
     [
       ("1", "1F40D", "snake", "serpent — thème direct loopSerpent", "fort", "faible", None),
       ("2", "1F409", "dragon", "dragon — serpent boss puissant", "fort", "faible", None),
       ("3", "1F432", "dragon face", "tête dragon — face boss serpent", "fort", "faible", None),
       ("4", "27B0", "curly loop", "boucle — mécanique loop du serpent", "fort", "faible", None),
       ("5", "1F98E", "lizard", "lézard — reptile serpent", "moyen", "trop petit", None),
       ("6", "1F41A", "spiral shell", "coquillage spirale — boucle en spirale", "moyen", "faible", None),
       ("7", "1F420", "tropical fish", "poisson — mouvement ondulant comme serpent", "faible", "hors thème", None),
       ("8", "1F9F8", "teddy bear", "ours — corps serpent peluche", "faible", "incohérent", None),
       ("9", "1F500", "shuffle", "shuffle — trajectoire aléatoire loop", "moyen", "trop abstrait", None),
       ("10", "1F9DF", "zombie", "zombie — boss résistant", "faible", "hors thème", None),
     ]),

    ("pickup_ring", "Anneau doré (ring shape) — weakpoint queue serpent", "procedural",
     "PickupRenderer.drawShape() shape='ring' — partagé avec sonic_normal pickup",
     False, [],
     [
       ("1", "1F48D", "ring", "anneau doré — weakpoint queue serpent", "fort", "faible", None),
       ("2", "1FA99", "coin", "pièce — collectible orbe queue", "fort", "faible", None),
       ("3", "1F7E1", "yellow circle", "cercle jaune — orbe simple", "moyen", "trop simple", None),
       ("4", "2B55", "hollow red circle", "cercle creux — cible orbe", "moyen", "couleur danger", None),
       ("5", "26AA", "white circle", "cercle blanc — orbe neutre", "faible", "faible contraste", None),
       ("6", "1F300", "cyclone", "cyclone — orbe tourbillonnant", "moyen", "trop complexe", None),
       ("7", "27B0", "curly loop", "boucle — queue du serpent", "moyen", "forme anneau", None),
       ("8", "1F536", "orange diamond", "diamant orange — orbe alternatif", "faible", "forme erronée", None),
       ("9", "1F7E0", "orange circle", "cercle orange — orbe chaud", "moyen", "trop simple", None),
       ("10", "1F534", "red circle", "cercle rouge — orbe danger", "faible", "sens danger", None),
     ]),
  ]),

  # ── STREETS NORMAL ─────────────────────────────────────────────────────────
  ("streets_normal", "La Rue des Combos", "normal", "streets", [

    ("pickup_bonus", "Diamant (diamond shape)", "procedural",
     "PickupRenderer.drawShape() shape='diamond', couleur palette.primary",
     False, [],
     [
       ("1", "1F48E", "gem stone", "gemme taillée — diamant iconique bonus", "fort", "faible", None),
       ("2", "1F536", "large orange diamond", "diamant orange — forme directe", "fort", "faible", None),
       ("3", "1F537", "large blue diamond", "diamant bleu — variante froide", "fort", "faible", None),
       ("4", "2666", "diamond suit", "carreau — diamant stylisé jeu de cartes", "fort", "faible", None),
       ("5", "1FA99", "coin", "pièce — bonus monétaire rue", "moyen", "forme circulaire", None),
       ("6", "1F4A5", "collision", "collision — bonus de combo impact", "moyen", "confondu obstacle", None),
       ("7", "1F525", "fire", "flamme — pickup combo chaud", "moyen", "confondu obstacle", None),
       ("8", "2B50", "star", "étoile — bonus universel", "moyen", "générique", None),
       ("9", "1F31F", "glowing star", "étoile brillante — bonus premium", "moyen", "générique", None),
       ("10", "1F4AB", "dizzy", "étoiles tourbillonnantes — combo chain daze", "moyen", "sens ambigu", None),
     ]),

    ("obstacle_crowdBlocker", "Rect mobile 4 états (static/moving/warning/charging/danger)", "procedural",
     "ObstacleRenderer ENTITY_COLORS — static:0xe67e22 moving:0xff6b35 warning:0xf39c12 charging:0xe74c3c danger:0xc0392b",
     True,
     [
       ("static", "rect orange (#e67e22) — badaud statique sur la route"),
       ("moving", "rect orange vif (#ff6b35) — badaud qui marche"),
       ("warning", "rect orange warning (#f39c12) + trajectory danger cells — prépare à charger"),
       ("charging", "rect rouge (#e74c3c) — charge en ligne droite, létal"),
       ("danger", "rect bordeaux (#c0392b) — cellule trajectoire danger"),
     ],
     [
       ("1", "1F46A", "family", "famille — foule civile bloquante rue", "fort", "faible", None),
       ("2", "1F6B6", "person walking", "piéton — badaud mobile dans rue", "fort", "faible", None),
       ("3", "1F3C3", "person running", "coureur — charging state sprint dangereux", "fort", "faible", "2"),
       ("4", "1F477", "construction worker", "travailleur — bloqueur de chantier", "fort", "faible", None),
       ("5", "1F4A8", "dashing away", "rush — effet de charge dangerous", "moyen", "faible", None),
       ("6", "1F4A2", "anger", "colère — badaud énervé charging", "moyen", "trop abstrait", None),
       ("7", "1F9D1", "person", "personne — générique foule", "moyen", "générique", None),
       ("8", "1F9DF", "zombie", "zombie — foule hostile", "faible", "hors thème", None),
       ("9", "1F939", "juggler", "jongleur — obstacle spectacle rue", "faible", "trop spécifique", None),
       ("10", "1F5E3", "speaking head", "foule parlante — bruit ambiance", "faible", "incohérent gameplay", None),
     ]),
  ]),

  # ── STREETS BOSS ───────────────────────────────────────────────────────────
  ("streets_boss", "Le Parrain des Rues", "boss", "streets", [

    ("boss_crimeLord", "RoundedRect 2 phases (pressure/vulnerable)", "procedural",
     "ObstacleRenderer — pressure:0xe74c3c / vulnerable:0xf1c40f — alpha 0.5+0.5*(hp/maxHp)",
     True,
     [
       ("pressure", "rect arrondi rouge (#e74c3c) — boss en mode pression/attaque"),
       ("vulnerable", "rect arrondi jaune (#f1c40f) + weakpoint exposé — boss vulnérable"),
     ],
     [
       ("1", "1F574", "man in suit", "homme costume — parrain des rues direct", "fort", "faible", None),
       ("2", "1F477", "worker", "ouvrier casqué — chef de chantier autoritaire", "moyen", "faible", None),
       ("3", "1F5E3", "megaphone", "mégaphone — boss qui commande la foule", "moyen", "faible", None),
       ("4", "1F939", "juggler", "jongleur — boss spectacle de rue retors", "moyen", "trop joyeux", None),
       ("5", "1F4A3", "bomb", "bombe — boss dangereux explosion", "fort", "générique danger", None),
       ("6", "1F4BA", "office chair", "fauteuil — parrain assis qui dirige", "moyen", "trop statique", None),
       ("7", "1FA83", "boomerang", "boomerang — attaque qui revient", "moyen", "faible", None),
       ("8", "1F9E5", "lab coat", "blouse — boss scientifique", "faible", "hors thème", None),
       ("9", "1F97D", "goggles", "lunettes — boss masqué", "faible", "trop accessoire", None),
       ("10", "1F47A", "goblin", "gobelin — boss mauvais comploteur", "moyen", "hors univers", None),
     ]),

    ("pickup_bonus", "Diamant (diamond shape) — boss streets", "procedural",
     "PickupRenderer.drawShape() shape='diamond' — partagé avec streets_normal",
     False, [],
     [
       ("1", "1F48E", "gem stone", "gemme — bonus boss précieux", "fort", "faible", None),
       ("2", "1F536", "orange diamond", "diamant orange — bonus chaud boss", "fort", "faible", None),
       ("3", "1F537", "blue diamond", "diamant bleu — bonus froid", "fort", "faible", None),
       ("4", "2666", "diamond suit", "carreau — diamant cartes", "fort", "faible", None),
       ("5", "1FA99", "coin", "pièce — récompense boss", "moyen", "forme circulaire", None),
       ("6", "2B50", "star", "étoile — bonus général", "moyen", "générique", None),
       ("7", "1F31F", "glowing star", "étoile brillante — bonus premium", "moyen", "générique", None),
       ("8", "1F4AB", "dizzy", "étoiles — impact combo", "moyen", "ambigu", None),
       ("9", "1F525", "fire", "flamme — pickup combo chaud", "moyen", "confondu obstacle", None),
       ("10", "1F4A5", "collision", "collision — bonus impact", "moyen", "confondu", None),
     ]),
  ]),

  # ── FIGHTER NORMAL ─────────────────────────────────────────────────────────
  ("fighter_normal", "L'Arène du Guerrier", "normal", "fighter", [

    ("pickup_energy", "Éclair (lightning shape)", "procedural",
     "PickupRenderer.drawShape() shape='lightning', couleur palette.primary — bolt path",
     False, [],
     [
       ("1", "26A1", "lightning", "éclair — énergie directe fighter", "fort", "faible", None),
       ("2", "1F9E8", "firecracker", "pétard — énergie explosive fighter", "fort", "faible", None),
       ("3", "1F525", "fire", "flamme — énergie combative", "fort", "faible", None),
       ("4", "1F4A5", "collision", "collision — impact énergie", "fort", "confondu effet vfx", None),
       ("5", "1F44A", "oncoming fist", "poing — energy punch fighter", "fort", "skin tone", None),
       ("6", "1F94B", "martial arts uniform", "karatégi — uniforme energy fighter", "moyen", "faible", None),
       ("7", "1F93A", "fencer", "escrimeur — fighter energy épée", "moyen", "faible", None),
       ("8", "1F4AA", "flexed bicep", "biceps — énergie musculaire", "moyen", "skin tone", None),
       ("9", "1F9B5", "leg", "jambe — energy kick", "faible", "trop littéral", None),
       ("10", "1F454", "necktie", "cravate — dressed to fight", "faible", "hors thème", None),
     ]),

    ("obstacle_sparZone", "Cercle étincelles (static)", "procedural",
     "ObstacleRenderer.drawEntity() default rect — sparZone state:'static' couleur 0xc0392b",
     False, [],
     [
       ("1", "26A1", "lightning", "éclair — zone électrique sparring", "fort", "faible", None),
       ("2", "1F9E8", "firecracker", "pétard — zone explosion sparring", "fort", "faible", None),
       ("3", "1F525", "fire", "flamme — zone feu danger", "fort", "confondu pickup", None),
       ("4", "1F94B", "martial arts", "karatégi — zone combat", "fort", "faible", None),
       ("5", "1F93A", "fencer", "escrimeur — zone escrime", "moyen", "faible", None),
       ("6", "2694", "crossed swords", "épées croisées — zone combat danger", "fort", "faible", None),
       ("7", "1FA96", "military helmet", "casque — zone combative", "moyen", "faible", None),
       ("8", "1F4A5", "collision", "collision — zone impact", "moyen", "confondu effect", None),
       ("9", "1F576", "sunglasses", "lunettes — zone cool fighter", "faible", "incohérent", None),
       ("10", "1F5E1", "dagger", "dague — zone tranchante", "moyen", "faible", None),
     ]),

    ("indicator_chargeGlow", "Anneau lumineux autour tête snake (ready only)", "procedural",
     "ObstacleRenderer.drawEntity() case 'chargeGlow' — state='ready' couleur 0xf39c12 strokeCircle x2",
     False, [],
     [
       ("1", "26A1", "lightning", "éclair — charge prête electrique", "fort", "faible", None),
       ("2", "1F31F", "glowing star", "étoile brillante — charge prête lumineux", "fort", "faible", None),
       ("3", "1F525", "fire", "flamme — charge prête combustion", "fort", "confondu danger", None),
       ("4", "1F536", "orange diamond", "diamant orange — indicator de charge", "moyen", "faible", None),
       ("5", "1F9E8", "firecracker", "pétard — charge explosive prête", "moyen", "faible", None),
       ("6", "2728", "sparkles", "étincelles — charge scintillante", "moyen", "confondu pickup", None),
       ("7", "1F4AB", "dizzy", "étoiles tourbillonnantes — indicator charge", "moyen", "confondu pickup", None),
       ("8", "1F53A", "red triangle up", "triangle rouge haut — charge direction", "faible", "trop directionnel", None),
       ("9", "1F7E1", "yellow circle", "cercle jaune — glow ready simplifié", "faible", "trop basique", None),
       ("10", "1FA87", "maracas", "maracas — charge sonore", "faible", "incohérent", None),
     ]),
  ]),

  # ── FIGHTER BOSS ───────────────────────────────────────────────────────────
  ("fighter_boss", "Le Challenger Final", "boss", "fighter", [

    ("boss_finalChallenger", "RoundedRect 3 phases (idle/attack_window/counter)", "procedural",
     "ObstacleRenderer — idle:0xaaaaaa / attack_window:0xf1c40f / counter:0xe74c3c",
     True,
     [
       ("idle", "rect arrondi gris (#aaaaaa) — boss en attente entre les rounds"),
       ("attack_window", "rect arrondi jaune (#f1c40f) — fenêtre d'attaque ouverte, frapper maintenant"),
       ("counter", "rect arrondi rouge (#e74c3c) + counterZones — contre-attaque boss"),
     ],
     [
       ("1", "1F44A", "fist", "poing — challenger direct final fight", "fort", "skin tone", None),
       ("2", "1F94B", "martial arts", "karatégi — challenger arts martiaux", "fort", "faible", None),
       ("3", "1F93A", "fencer", "escrimeur — challenger épée final", "fort", "faible", None),
       ("4", "1F3C6", "trophy", "trophée — champion ultime", "fort", "faible", None),
       ("5", "1F947", "gold medal", "médaille or — finaliste meilleur", "fort", "faible", None),
       ("6", "1F4AA", "muscle", "biceps — force challenger", "moyen", "skin tone", None),
       ("7", "270A", "raised fist", "poing levé — combat boss", "moyen", "skin tone", None),
       ("8", "1F396", "medal", "médaille militaire — champion éprouvé", "moyen", "faible", None),
       ("9", "1FA96", "military helmet", "casque — combat final", "moyen", "faible", None),
       ("10", "1F45A", "running shirt", "maillot — sportif final challenger", "faible", "trop générique", None),
     ]),

    ("pickup_energy", "Éclair (lightning shape) — boss fighter", "procedural",
     "PickupRenderer.drawShape() shape='lightning' — partagé avec fighter_normal",
     False, [],
     [
       ("1", "26A1", "lightning", "éclair — énergie boss fighter", "fort", "faible", None),
       ("2", "1F9E8", "firecracker", "pétard — énergie explosive", "fort", "faible", None),
       ("3", "1F525", "fire", "flamme — énergie combative", "fort", "faible", None),
       ("4", "1F4A5", "collision", "collision — énergie impact", "fort", "confondu", None),
       ("5", "1F44A", "fist", "poing — énergie punch", "fort", "skin tone", None),
       ("6", "1F94B", "martial arts", "karatégi — énergie fighter", "moyen", "faible", None),
       ("7", "1F93A", "fencer", "escrimeur — énergie épée", "moyen", "faible", None),
       ("8", "1F4AA", "bicep", "biceps — énergie musculaire", "moyen", "skin tone", None),
       ("9", "2694", "crossed swords", "épées — énergie combat", "moyen", "faible", None),
       ("10", "1FA96", "helmet", "casque — énergie défense", "moyen", "faible", None),
     ]),
  ]),

  # ── OUTRUN NORMAL ──────────────────────────────────────────────────────────
  ("outrun_normal", "L'Autoroute des As", "normal", "outrun", [

    ("pickup_checkpoint", "Triangle (triangle shape)", "procedural",
     "PickupRenderer.drawShape() shape='triangle', couleur palette.primary",
     False, [],
     [
       ("1", "1F6A9", "triangular flag", "fanion triangulaire — checkpoint balise", "fort", "faible", None),
       ("2", "1F3C1", "chequered flag", "drapeau damier — arrivée course", "fort", "faible", None),
       ("3", "1F4CD", "round pushpin", "épingle — marqueur checkpoint carte", "fort", "faible", None),
       ("4", "1F3CE", "racing car", "voiture course — thème outrun direct", "moyen", "trop entier", None),
       ("5", "1F6A8", "police light", "gyrophare — balise d'urgence route", "moyen", "faible", None),
       ("6", "26F3", "golf hole flag", "drapeau golf — cible à atteindre", "faible", "hors thème", None),
       ("7", "1F50B", "battery", "batterie — energy checkpoint recharge", "moyen", "faible", None),
       ("8", "1F698", "oncoming car", "voiture frontale — checkpoint voiture", "moyen", "trop entier", None),
       ("9", "1F697", "car", "voiture — thème outrun", "moyen", "trop entier", None),
       ("10", "1FA87", "maracas", "maracas — bruit passage checkpoint", "faible", "incohérent", None),
     ]),

    ("obstacle_trafficBlock", "Rect mobile (moving)", "procedural",
     "ObstacleRenderer.drawEntity() default rect — trafficBlock state:'moving' couleur 0xff6b9d",
     False, [],
     [
       ("1", "1F698", "oncoming car", "voiture frontale — traffic bloc direct", "fort", "faible", None),
       ("2", "1F697", "car", "voiture — bloc circulation", "fort", "faible", None),
       ("3", "1F699", "SUV", "SUV — gros véhicule bloquant", "fort", "faible", None),
       ("4", "1F6A7", "construction sign", "panneaux chantier — route barrée", "fort", "faible", None),
       ("5", "1F6D1", "stop sign", "stop — bloc arrêt total", "fort", "faible", None),
       ("6", "1F69B", "truck", "camion — grand véhicule bloquant", "fort", "faible", None),
       ("7", "1F6A8", "police light", "gyrophare — véhicule urgence bloquant", "moyen", "faible", None),
       ("8", "1F50B", "battery", "batterie — recharge vs crash", "faible", "incohérent", None),
       ("9", "1FA96", "helmet", "casque moto — conducteur de bloc", "faible", "trop accessoire", None),
       ("10", "1F306", "cityscape at dusk", "ville crépuscule — route urbaine", "faible", "trop contexte", None),
     ]),
  ]),

  # ── OUTRUN BOSS ────────────────────────────────────────────────────────────
  ("outrun_boss", "Le Rival Turbo", "boss", "outrun", [

    ("boss_turboRival", "Rect mobile (moving) + zones turbo", "procedural",
     "ObstacleRenderer — turboRival:0xff6b9d / turboZone:0xffd32a drawTurboZone()",
     True,
     [
       ("moving", "rect rose vif (#ff6b9d) — rival turbo qui dérive sur les voies"),
       ("turboZone", "zone turbo spéciale (#ffd32a) avec flèches — fenêtre d'attaque"),
     ],
     [
       ("1", "1F3CE", "racing car", "voiture course — rival turbo iconique", "fort", "faible", None),
       ("2", "1F697", "car", "voiture — rival voiture rival outrun", "fort", "faible", None),
       ("3", "1F698", "oncoming car", "voiture frontale — rival en face", "fort", "faible", None),
       ("4", "1F6A8", "police light", "gyrophare — rival poursuite police", "moyen", "faible", None),
       ("5", "1F4A8", "dashing", "speed lines — turbo vitesse pure", "moyen", "faible", None),
       ("6", "1FA87", "maracas", "maracas — speed vibration rival", "faible", "incohérent", None),
       ("7", "1F699", "SUV", "SUV — gros rival bloquant", "moyen", "faible", None),
       ("8", "1F9F8", "teddy", "ours peluche — mascotte rival", "faible", "incohérent", None),
       ("9", "26A1", "lightning", "éclair — turbo speed électrique", "moyen", "confondu fighter", None),
       ("10", "1F50B", "battery", "batterie — énergie turbo rival", "faible", "incohérent", None),
     ]),

    ("special_turboZone", "Zone spéciale avec flèches et anneaux (turboZone unique)", "procedural",
     "ObstacleRenderer.drawTurboZone() — fond cyan+jaune, flèches blanches, pulse animé",
     False, [],
     [
       ("1", "26A1", "lightning", "éclair — turbo zone électrique", "fort", "faible", None),
       ("2", "1F4A8", "dashing", "speed lines — zone vitesse turbo", "fort", "faible", None),
       ("3", "1F3CE", "racing car", "voiture course — zone course turbo", "moyen", "trop entier", None),
       ("4", "1F6A8", "police light", "gyrophare — zone d'alerte turbo", "moyen", "faible", None),
       ("5", "1FA87", "maracas", "maracas — vibration speed", "faible", "incohérent", None),
       ("6", "1F697", "car", "voiture — zone passage voiture", "faible", "confondu obstacle", None),
       ("7", "1F50B", "battery", "batterie — recharge turbo", "moyen", "faible", None),
       ("8", "1F525", "fire", "flamme — turbo zone brûlante", "moyen", "confondu danger", None),
       ("9", "27A1", "right arrow", "flèche droite — direction turbo", "moyen", "trop simple", None),
       ("10", "1F9E8", "firecracker", "pétard — boost explosif", "moyen", "faible", None),
     ]),

    ("pickup_checkpoint", "Triangle (triangle shape) — boss outrun", "procedural",
     "PickupRenderer.drawShape() shape='triangle' — partagé avec outrun_normal",
     False, [],
     [
       ("1", "1F6A9", "triangular flag", "fanion — checkpoint boss", "fort", "faible", None),
       ("2", "1F3C1", "chequered flag", "drapeau damier — arrivée boss", "fort", "faible", None),
       ("3", "1F4CD", "pushpin", "épingle — marqueur boss", "fort", "faible", None),
       ("4", "1F3CE", "racing car", "voiture — checkpoint boss course", "moyen", "trop entier", None),
       ("5", "1F6A8", "police light", "gyrophare — balise boss", "moyen", "faible", None),
       ("6", "1F50B", "battery", "batterie — recharge checkpoint boss", "moyen", "faible", None),
       ("7", "1F698", "car", "voiture — checkpoint voiture", "moyen", "trop entier", None),
       ("8", "26A1", "lightning", "éclair — checkpoint electrique", "moyen", "confondu fighter", None),
       ("9", "1F697", "car side", "voiture profil — checkpoint", "moyen", "trop entier", None),
       ("10", "1FA87", "maracas", "maracas — vibration finish", "faible", "incohérent", None),
     ]),
  ]),

  # ── SHINOBI NORMAL ─────────────────────────────────────────────────────────
  ("shinobi_normal", "La Voie du Ninja", "normal", "shinobi", [

    ("pickup_shuriken", "Croix (cross/shuriken shape)", "procedural",
     "PickupRenderer.drawShape() shape='cross' — fillRect x2 perpendiculaires + cercle central",
     False, [],
     [
       ("1", "1F977", "ninja", "ninja — thème shinobi direct pickup", "fort", "skin tone", None),
       ("2", "2694", "crossed swords", "épées croisées — shuriken croisé", "fort", "faible", None),
       ("3", "1F945", "goal net", "filet de but — forme croix réseau", "moyen", "hors thème", None),
       ("4", "1F5E1", "dagger", "dague — arme ninja tranchante", "fort", "faible", None),
       ("5", "27B0", "curly loop", "boucle — trajectoire shuriken", "moyen", "trop stylisé", None),
       ("6", "1F3AF", "bullseye", "cible — shuriken vise la cible", "fort", "faible", None),
       ("7", "1F47F", "angry face horns", "diable — ninja masqué menaçant", "faible", "hors thème", None),
       ("8", "1F441", "eye", "oeil — regard ninja espionnage", "moyen", "faible", None),
       ("9", "1F300", "cyclone", "cyclone — shuriken tournoyant", "moyen", "trop complexe", None),
       ("10", "1FAF6", "hand pointing", "main pointant — ninja désigne", "faible", "incohérent", None),
     ]),

    ("obstacle_focusDecoy", "Diamant 2 états (real/decoy)", "procedural",
     "ObstacleRenderer.drawEntity() case 'focusTarget' — real:0x00b4d8 alpha 1.0 + contour / decoy:0x666666 alpha 0.5",
     True,
     [
       ("real", "diamant bleu vif (#00b4d8, alpha 1.0) + contour blanc — vraie cible à toucher"),
       ("decoy", "diamant gris (#666666, alpha 0.5) — leurre à éviter, orbite autour cible"),
     ],
     [
       ("1", "1F977", "ninja", "ninja — vraie cible ninja visible", "fort", "skin tone", "2"),
       ("2", "1F441", "eye", "oeil — decoy/leurre regard trompeur", "fort", "faible", "1"),
       ("3", "1F3AF", "bullseye", "cible — real target direct", "fort", "faible", None),
       ("4", "1F300", "cyclone", "cyclone — decoy tourbillonnant", "moyen", "ambigu", None),
       ("5", "1F5E1", "dagger", "dague — cible arme shinobi", "moyen", "faible", None),
       ("6", "2694", "crossed swords", "épées — cible combat", "moyen", "faible", None),
       ("7", "1F4AB", "dizzy", "étoiles — decoy confusion", "moyen", "confondu pickup", None),
       ("8", "1F47F", "devil", "diable — decoy trompeur", "faible", "hors thème", None),
       ("9", "27B0", "loop", "boucle — decoy orbite", "moyen", "abstrait", None),
       ("10", "1F31F", "glowing star", "étoile — cible brillante", "moyen", "confondu pickup", None),
     ]),
  ]),

  # ── SHINOBI BOSS ───────────────────────────────────────────────────────────
  ("shinobi_boss", "L'Ombre du Ninja Suprême", "boss", "shinobi", [

    ("boss_shadowNinja", "Cercle/ombre 2 états (real revealed / shadow)", "procedural",
     "ObstacleRenderer — real:0x00b4d8 / shadow:0x333355 — revealed brièvement, shadow permanent",
     True,
     [
       ("real", "rect bleu vif (#00b4d8) — ninja réel révélé brièvement, point faible"),
       ("shadow", "rect bleu très foncé (#333355) — clone fantôme, leurre dangereux"),
     ],
     [
       ("1", "1F977", "ninja", "ninja — boss shinobi direct", "fort", "skin tone", None),
       ("2", "1F441", "eye", "oeil — ninja qui observe, shadow/real", "fort", "faible", "1"),
       ("3", "2694", "crossed swords", "épées — boss ninja combat", "fort", "faible", None),
       ("4", "1F5E1", "dagger", "dague — attaque ninja silencieuse", "fort", "faible", None),
       ("5", "1FAF6", "hand point", "main — ninja désigne direction", "faible", "incohérent", None),
       ("6", "1F300", "cyclone", "cyclone — shadow tourbillonnant", "moyen", "faible", None),
       ("7", "26AB", "black circle", "cercle noir — shadow sombre minimal", "moyen", "trop générique", None),
       ("8", "1F47F", "devil horns", "diable — boss mauvais ninja", "moyen", "hors thème", None),
       ("9", "1F3AF", "bullseye", "cible — trouver le vrai ninja", "moyen", "confondu obstacle", None),
       ("10", "1F9DF", "zombie", "zombie — clone mort-vivant", "faible", "hors thème", None),
     ]),

    ("pickup_shuriken", "Croix (cross) — boss shinobi", "procedural",
     "PickupRenderer.drawShape() shape='cross' — partagé avec shinobi_normal",
     False, [],
     [
       ("1", "1F977", "ninja", "ninja — pickup boss shinobi", "fort", "skin tone", None),
       ("2", "2694", "crossed swords", "épées — shuriken boss", "fort", "faible", None),
       ("3", "1F5E1", "dagger", "dague — arme shinobi boss", "fort", "faible", None),
       ("4", "1F3AF", "bullseye", "cible — atteindre ninja boss", "fort", "faible", None),
       ("5", "27B0", "loop", "boucle — trajectoire shuriken", "moyen", "abstrait", None),
       ("6", "1F945", "goal net", "filet — forme croix", "faible", "hors thème", None),
       ("7", "1F47F", "devil", "diable — arme diabolique", "faible", "hors thème", None),
       ("8", "1F441", "eye", "oeil — vision ninja", "moyen", "faible", None),
       ("9", "1F300", "cyclone", "cyclone — shuriken tournoyant", "moyen", "trop complexe", None),
       ("10", "1FAF6", "point", "pointage — cible ninja", "faible", "incohérent", None),
     ]),
  ]),

  # ── KOMBAT NORMAL ──────────────────────────────────────────────────────────
  ("kombat_normal", "L'Arène du Destin", "normal", "kombat", [

    ("pickup_finishToken", "Flamme/polygone 7pts (flame shape)", "procedural",
     "PickupRenderer.drawShape() shape='flame' — polygon 7pts alternant r*1.1/r*0.65",
     False, [],
     [
       ("1", "1F409", "dragon", "dragon — finish him! kombat iconique", "fort", "faible", None),
       ("2", "1F432", "dragon face", "tête dragon — finish token dragon", "fort", "faible", None),
       ("3", "2620", "skull crossbones", "tête de mort — finish token mortel", "fort", "faible", None),
       ("4", "2666", "diamond suit", "carreau — token jeu kombat", "moyen", "faible", None),
       ("5", "1F525", "fire", "flamme — finish en flammes", "fort", "confondu obstacle", None),
       ("6", "1F93A", "fencer", "escrimeur — combat finish épée", "moyen", "faible", None),
       ("7", "1F396", "medal", "médaille — finish récompense", "moyen", "faible", None),
       ("8", "26CE", "ophiuchus", "ophiuchus — symbole mystique kombat", "moyen", "très spécifique", None),
       ("9", "1F004", "mahjong", "mahjong rouge — token jeu asiatique", "moyen", "culturel", None),
       ("10", "1F3EE", "lantern", "lanterne rouge — ambiance kombat asiatique", "moyen", "faible", None),
     ]),

    ("obstacle_fatalZone", "Cluster cellules 2 états (warning/active)", "procedural",
     "ObstacleRenderer.drawEntity() default rect — warning:0xf39c12 active:0xe74c3c clusters de 8-20 cells",
     True,
     [
       ("warning", "cluster de cellules orange (#f39c12) — zone lave avertissement, 8 ticks"),
       ("active", "cluster de cellules rouge (#e74c3c) — zone lave létale active, 4 ticks"),
     ],
     [
       ("1", "1F525", "fire", "flamme — zone lave active directe", "fort", "confondu pickup", "2"),
       ("2", "26A0", "warning", "danger — zone warning lave", "fort", "faible", "1"),
       ("3", "2620", "skull", "tête de mort — zone fatale directe", "fort", "faible", None),
       ("4", "1F480", "skull", "crâne simple — zone mort", "fort", "faible", None),
       ("5", "26D4", "no entry", "interdit — zone bloquée fatale", "moyen", "faible", None),
       ("6", "1F6D1", "stop sign", "stop — zone interdite", "moyen", "couleur forte", None),
       ("7", "1F4A3", "bomb", "bombe — zone explosive", "fort", "générique danger", None),
       ("8", "1FA96", "military helmet", "casque — zone combat mortel", "moyen", "faible", None),
       ("9", "1F47F", "devil", "diable — zone diabolique fatale", "moyen", "trop cartoon", None),
       ("10", "1F47A", "goblin", "gobelin — zone monstre", "faible", "incohérent", None),
     ]),
  ]),

  # ── KOMBAT BOSS ────────────────────────────────────────────────────────────
  ("kombat_boss", "La Porte du Dragon", "boss", "kombat", [

    ("boss_dragonGate", "Rect 4 phases (closed/opening/danger/vulnerable)", "procedural",
     "ObstacleRenderer — closed:0x444444 / opening:0xf39c12 / vulnerable:0xf1c40f / danger:0xe74c3c",
     True,
     [
       ("closed", "rect arrondi gris sombre (#444444) — porte fermée, passage impossible"),
       ("opening", "rect arrondi orange (#f39c12) — porte qui s'ouvre, avertissement"),
       ("danger", "rect arrondi rouge (#e74c3c) + dangerZones circulaires — porte ouverte, attaque"),
       ("vulnerable", "rect arrondi jaune (#f1c40f) — porte vulnérable, frapper maintenant"),
     ],
     [
       ("1", "1F409", "dragon", "dragon — boss dragon gate direct", "fort", "faible", None),
       ("2", "1F432", "dragon face", "tête dragon — face boss combat", "fort", "faible", None),
       ("3", "1F6AA", "door", "porte — dragon GATE — correspondance directe", "fort", "faible", None),
       ("4", "1F3EE", "red lantern", "lanterne rouge — ambiance asiatique porte", "fort", "faible", None),
       ("5", "26CE", "ophiuchus", "ophiuchus — symbole puissance dragon", "moyen", "très spécifique", None),
       ("6", "1F004", "mahjong red dragon", "dragon mahjong — thème dragon boss", "moyen", "culturel", None),
       ("7", "2620", "skull", "tête de mort — boss mortel gate", "moyen", "générique", None),
       ("8", "1F534", "red circle", "cercle rouge — danger gate ouvert", "moyen", "trop simple", None),
       ("9", "1FAA9", "mirror ball", "boule disco — gate ouvert brillant", "faible", "hors thème", None),
       ("10", "1F525", "fire", "flamme — gate de feu dragon", "moyen", "confondu zone danger", None),
     ]),

    ("pickup_finishToken", "Flamme/polygone (flame) — boss kombat", "procedural",
     "PickupRenderer.drawShape() shape='flame' — partagé avec kombat_normal",
     False, [],
     [
       ("1", "1F409", "dragon", "dragon — finish token boss dragon", "fort", "faible", None),
       ("2", "1F432", "dragon face", "tête dragon — token boss", "fort", "faible", None),
       ("3", "2620", "skull", "crâne — finish token mortel boss", "fort", "faible", None),
       ("4", "2666", "diamond", "carreau — token boss jeu", "moyen", "faible", None),
       ("5", "1F525", "fire", "flamme — finish en flammes", "fort", "confondu obstacle", None),
       ("6", "1F3EE", "lantern", "lanterne — token asiatique boss", "moyen", "faible", None),
       ("7", "1F396", "medal", "médaille — récompense finish boss", "moyen", "faible", None),
       ("8", "26CE", "ophiuchus", "ophiuchus — symbole boss puissant", "moyen", "trop spécifique", None),
       ("9", "1F004", "mahjong", "mahjong — token culturel boss", "moyen", "culturel", None),
       ("10", "1F93A", "fencer", "escrimeur — combat finish boss", "moyen", "faible", None),
     ]),
  ]),

  # ── PAPERBOY NORMAL ────────────────────────────────────────────────────────
  ("paperboy_normal", "La Tournée du Livreur", "normal", "paperboy", [

    ("pickup_newspaper", "Cercle (circle shape)", "procedural",
     "PickupRenderer.drawShape() shape='circle', couleur palette.primary — fillCircle + shine",
     False, [],
     [
       ("1", "1F4F0", "newspaper", "journal — pickup newspaper direct", "fort", "faible", None),
       ("2", "1F5DE", "rolled newspaper", "journal roulé — objet à lancer paperboy", "fort", "faible", None),
       ("3", "1F4C3", "page document", "page — feuille journal", "fort", "faible", None),
       ("4", "1F4DC", "scroll", "parchemin — journal ancien livraison", "moyen", "faible", None),
       ("5", "1F4E6", "package", "colis — livraison journal paquet", "moyen", "faible", None),
       ("6", "1F4EA", "closed mailbox", "boîte aux lettres fermée — destination journal", "moyen", "faible", None),
       ("7", "1F4EC", "open mailbox raised", "boîte aux lettres ouverte — livraison faite", "moyen", "faible", None),
       ("8", "2709", "envelope", "enveloppe — courrier livraison", "moyen", "faible", None),
       ("9", "1F48C", "love letter", "lettre — message livré", "faible", "hors thème", None),
       ("10", "1F6D2", "shopping cart", "chariot — livraison mobile", "faible", "incohérent", None),
     ]),

    ("target_deliveryTarget", "Carré 2 états (highlighted/idle)", "procedural",
     "ObstacleRenderer.drawEntity() case 'deliveryTarget' — highlighted:0xf1c40f / idle:0x27ae60 fillRect+stroke",
     True,
     [
       ("highlighted", "carré jaune (#f1c40f, alpha 0.8) + contour blanc — cible de livraison active (porteur du journal)"),
       ("idle", "carré vert (#27ae60, alpha 0.8) + contour blanc — cible en attente"),
     ],
     [
       ("1", "1F3E0", "house", "maison — destination livraison directe", "fort", "faible", None),
       ("2", "1F4EA", "closed mailbox", "boîte aux lettres fermée — livraison idle", "fort", "faible", "3"),
       ("3", "1F4EC", "open mailbox", "boîte ouverte — livraison highlighted active", "fort", "faible", "2"),
       ("4", "1F4CD", "pushpin", "épingle — marqueur destination", "fort", "faible", None),
       ("5", "1F6AA", "door", "porte — entrée maison livraison", "moyen", "faible", None),
       ("6", "1F4E6", "package", "colis — livraison reçue highlighted", "moyen", "faible", None),
       ("7", "1F4EB", "mailbox with mail", "boîte avec courrier — livraison en attente", "moyen", "faible", None),
       ("8", "2709", "envelope", "enveloppe — courrier livraison cible", "moyen", "faible", None),
       ("9", "1F69A", "delivery truck", "camion livraison — cible pro", "faible", "trop grand", None),
       ("10", "1F3AF", "bullseye", "cible — target livraison", "moyen", "générique", None),
     ]),

    ("obstacle_routeObstacle", "Rect (static)", "procedural",
     "ObstacleRenderer.drawEntity() default rect — routeObstacle state:'static' couleur 0x666666",
     False, [],
     [
       ("1", "1F6A7", "construction sign", "panneaux chantier — route barrée obstacle", "fort", "faible", None),
       ("2", "1F9F1", "brick", "brique — mur obstacle route", "fort", "faible", None),
       ("3", "1F6D1", "stop sign", "stop — obstacle arrêt", "fort", "faible", None),
       ("4", "26A0", "warning", "danger — obstacle signalé", "fort", "faible", None),
       ("5", "1F698", "car", "voiture garée — obstacle route", "moyen", "confondu traffic", None),
       ("6", "1F69B", "truck", "camion livraison garée — obstacle lourd", "moyen", "faible", None),
       ("7", "1FA96", "military helmet", "casque — obstacle combatif", "faible", "hors thème", None),
       ("8", "26AB", "black circle", "cercle noir — obstacle simple", "faible", "trop générique", None),
       ("9", "1F6A8", "police light", "gyrophare — zone barrée police", "moyen", "faible", None),
       ("10", "1F306", "city dusk", "paysage urbain — contexte route", "faible", "trop contextuel", None),
     ]),
  ]),

  # ── PAPERBOY BOSS ──────────────────────────────────────────────────────────
  ("paperboy_boss", "Le Chaos du Quartier", "boss", "paperboy", [

    ("boss_chaosObstacle", "Rect mobile (moving)", "procedural",
     "ObstacleRenderer.drawEntity() default rect — chaosObstacle state:'moving' couleur 0xe67e22",
     False, [],
     [
       ("1", "1F47A", "goblin", "gobelin — chaos obstacle comique mobile", "fort", "faible", None),
       ("2", "1F9DF", "zombie", "zombie — obstacle chaotique errant", "fort", "faible", None),
       ("3", "1F4A8", "dashing", "rush — mouvement rapide chaos", "fort", "faible", None),
       ("4", "1F4A5", "collision", "collision — impact chaos direct", "fort", "confondu vfx", None),
       ("5", "1F6A7", "construction", "chantier — chaos urbain obstacles", "moyen", "faible", None),
       ("6", "1FA96", "helmet", "casque — ouvrier chaos chantier", "moyen", "faible", None),
       ("7", "1F9F1", "brick", "brique volante — chaos construction", "moyen", "faible", None),
       ("8", "26A0", "warning", "danger — obstacle chaos signalé", "moyen", "faible", None),
       ("9", "1F47B", "ghost", "fantôme — chaos fantomatique", "faible", "hors thème", None),
       ("10", "1F525", "fire", "flamme — chaos enflammé", "moyen", "confondu danger", None),
     ]),

    ("target_bossTarget", "Carré 2 états (highlighted/idle) — boss paperboy", "procedural",
     "ObstacleRenderer.drawEntity() case 'bossTarget' — highlighted:0xf1c40f / idle:0x27ae60",
     True,
     [
       ("highlighted", "carré jaune (#f1c40f, alpha 0.8) + contour blanc — cible boss active, livraison possible"),
       ("idle", "carré vert (#27ae60, alpha 0.8) + contour blanc — cible boss en attente"),
     ],
     [
       ("1", "1F3E0", "house", "maison — cible boss livraison", "fort", "faible", None),
       ("2", "1F4EA", "mailbox closed", "boîte fermée — boss idle", "fort", "faible", "3"),
       ("3", "1F4EC", "mailbox open", "boîte ouverte — boss highlighted", "fort", "faible", "2"),
       ("4", "1F4CD", "pushpin", "épingle — marqueur cible boss", "fort", "faible", None),
       ("5", "1F6AA", "door", "porte — entrée cible boss", "moyen", "faible", None),
       ("6", "1F4E6", "package", "colis — livraison boss reçue", "moyen", "faible", None),
       ("7", "1F4EB", "mailbox flag up", "boîte avec courrier — cible boss", "moyen", "faible", None),
       ("8", "2709", "envelope", "enveloppe — livraison boss", "moyen", "faible", None),
       ("9", "1F3AF", "bullseye", "cible — boss target générique", "moyen", "générique", None),
       ("10", "1F69A", "truck", "camion — livraison boss massive", "faible", "trop grand", None),
     ]),

    ("pickup_newspaper", "Cercle (circle shape) — boss paperboy", "procedural",
     "PickupRenderer.drawShape() shape='circle' — partagé avec paperboy_normal",
     False, [],
     [
       ("1", "1F4F0", "newspaper", "journal — pickup boss paperboy", "fort", "faible", None),
       ("2", "1F5DE", "rolled newspaper", "journal roulé — objet boss", "fort", "faible", None),
       ("3", "1F4C3", "page", "page — feuille journal boss", "fort", "faible", None),
       ("4", "1F4DC", "scroll", "parchemin — journal boss", "moyen", "faible", None),
       ("5", "1F4E6", "package", "colis — livraison boss", "moyen", "faible", None),
       ("6", "1F4EA", "mailbox", "boîte — destination boss", "moyen", "faible", None),
       ("7", "1F4EC", "open mailbox", "boîte ouverte — livraison boss faite", "moyen", "faible", None),
       ("8", "2709", "envelope", "enveloppe — courrier boss", "moyen", "faible", None),
       ("9", "1F48C", "love letter", "lettre — message boss", "faible", "hors thème", None),
       ("10", "1F6D2", "cart", "chariot — livraison boss mobile", "faible", "incohérent", None),
     ]),
  ]),
]

# ─── SVG COPY ─────────────────────────────────────────────────────────────────
def collect_all_svgs(levels):
    """Collect unique SVG ids needed."""
    needed = set()
    for level in levels:
        level_id, level_name, level_type, universe, icon_list = level
        for icon in icon_list:
            icon_type, *_, candidates = icon
            for c in candidates:
                rank, svg_id, *_ = c
                needed.add(svg_id)
    return needed

def copy_svgs(needed_ids):
    # Remove old non-current SVGs
    for fname in os.listdir(PREVIEW_DIR):
        if fname.startswith("current_"):
            continue
        if fname.endswith(".svg"):
            fpath = os.path.join(PREVIEW_DIR, fname)
            os.remove(fpath)

    copied = 0
    missing = []
    for svg_id in needed_ids:
        src = os.path.join(SRC_EMOJI, f"{svg_id}.svg")
        dst = os.path.join(PREVIEW_DIR, f"{svg_id}.svg")
        if os.path.exists(src):
            shutil.copy2(src, dst)
            copied += 1
        else:
            missing.append(svg_id)
    return copied, missing

# ─── CSV GENERATION ───────────────────────────────────────────────────────────
def write_csv(levels):
    rows = []
    for level in levels:
        level_id, level_name, level_type, universe, icon_list = level
        for icon in icon_list:
            if len(icon) == 9:
                icon_type, current_desc, current_source, current_code, has_multi, states_list, candidates = icon
            else:
                icon_type, current_desc, current_source, current_code, has_multi, states_list, candidates = icon
            states_str = "|".join([s[0] for s in states_list]) if has_multi else ""
            for c in candidates:
                rank, svg_id, name, reason, relevance, risk, pair = c
                pair_str = f"c{pair}" if pair else ""
                sel_id = f"{level_id}.{icon_type}.c{rank}"
                rows.append({
                    "selection_id": sel_id,
                    "level_id": level_id,
                    "level_name": level_name,
                    "level_type": level_type,
                    "icon_type": icon_type,
                    "has_multiple_states": "oui" if has_multi else "non",
                    "states_list": states_str,
                    "candidate_rank": rank,
                    "candidate_name": f"{svg_id} {name}",
                    "candidate_path": f"/home/kali/apps/snake/design_boards/openemoji/color/svg/{svg_id}.svg",
                    "preview_path": f"preview-assets/{svg_id}.svg",
                    "reason": reason,
                    "relevance": relevance,
                    "risk": risk,
                    "pair_recommendation": pair_str,
                })
    with open(OUT_CSV, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=[
            "selection_id","level_id","level_name","level_type","icon_type",
            "has_multiple_states","states_list","candidate_rank","candidate_name",
            "candidate_path","preview_path","reason","relevance","risk","pair_recommendation"
        ])
        writer.writeheader()
        writer.writerows(rows)
    return len(rows)

# ─── HTML GENERATION ──────────────────────────────────────────────────────────
BADGE_REL = {
    "fort": '<span class="badge badge-strong">fort</span>',
    "moyen": '<span class="badge badge-medium">moyen</span>',
    "faible": '<span class="badge badge-weak">faible</span>',
}

def relevance_badge(rel):
    return BADGE_REL.get(rel, f'<span class="badge">{rel}</span>')

def candidate_card(level_id, icon_type, c, all_pairs):
    rank, svg_id, name, reason, relevance, risk, pair = c
    sel_id = f"{level_id}.{icon_type}.c{rank}"
    pair_class = " pair-card" if pair else ""
    pair_label = f'<div class="pair-label">PAIRE REC. c{pair}</div>' if pair else ""
    return f"""
      <div class="candidate-card{pair_class}">
        {pair_label}
        <img src="preview-assets/{svg_id}.svg" alt="{name}" width="64" height="64" loading="lazy" onerror="this.style.opacity='0.2'">
        <div class="cand-id" onclick="navigator.clipboard&&navigator.clipboard.writeText('{sel_id}').then(()=>this.textContent='✓').catch(()=>0)" title="Copier ID">{sel_id}</div>
        <div class="cand-name">{svg_id} {name}</div>
        <div class="cand-reason">{reason}</div>
        <div class="cand-meta">{relevance_badge(relevance)} <span class="risk-label">{risk}</span></div>
      </div>"""

def states_block(states_list):
    if not states_list:
        return ""
    rows = "".join(
        f'<div class="state-row"><span class="state-name">{s[0]}</span><span class="state-desc">{s[1]}</span></div>'
        for s in states_list
    )
    return f'<div class="states-block"><div class="states-title">États actuels :</div>{rows}</div>'

def icon_section(level_id, icon):
    icon_type, current_desc, current_source, current_code, has_multi, states_list, candidates = icon

    multi_badge = '<span class="badge-multi">MULTI-ÉTATS</span>' if has_multi else ""
    states_html = states_block(states_list)

    cards = "".join(candidate_card(level_id, icon_type, c, []) for c in candidates)

    return f"""
    <div class="icon-section">
      <div class="icon-header">
        <span class="icon-type-label">{icon_type}</span>{multi_badge}
      </div>
      <div class="current-col">
        <span class="badge-current">ACTUEL</span>
        <div class="current-desc">{current_desc}</div>
        <div class="current-source">Source : <em>{current_source}</em></div>
        <div class="current-code">{current_code}</div>
      </div>
      {states_html}
      <div class="candidates-grid">
        {cards}
      </div>
    </div>"""

def level_section(level, index):
    level_id, level_name, level_type, universe, icon_list = level
    level_badge = "BOSS" if level_type == "boss" else "NORMAL"
    icons_html = "".join(icon_section(level_id, icon) for icon in icon_list)
    return f"""
  <details id="{level_id}" class="level-details" open>
    <summary class="level-summary">
      <span class="level-num">{index:02d}</span>
      <span class="level-id">{level_id}</span>
      <span class="level-name">{level_name}</span>
      <span class="level-badge level-badge-{level_type}">{level_badge}</span>
      <span class="level-universe">{universe}</span>
    </summary>
    <div class="level-content">
      {icons_html}
    </div>
  </details>"""

def toc(levels):
    items = "".join(
        f'<li><a href="#{lvl[0]}">{lvl[0]} — {lvl[1]}</a></li>'
        for lvl in levels
    )
    return f'<nav class="toc"><h2>Table des matières</h2><ul>{items}</ul></nav>'

def write_html(levels, n_svg, n_csv_rows):
    # Counts
    n_levels = len(levels)
    n_types = sum(len(lvl[4]) for lvl in levels)
    n_candidates = n_csv_rows

    css = """
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #0f0f1a; color: #e0e0e0; font-family: 'Segoe UI', system-ui, sans-serif; font-size: 14px; line-height: 1.5; }
    a { color: #a78bfa; }
    h1 { font-size: 1.6rem; padding: 24px; color: #e2e8f0; border-bottom: 1px solid #2d2d44; }
    .meta-bar { display: flex; gap: 24px; padding: 12px 24px; background: #1a1a2e; font-size: 0.85rem; color: #94a3b8; flex-wrap: wrap; align-items: center; }
    .meta-bar strong { color: #e2e8f0; }
    .btn { cursor: pointer; background: #4c1d95; color: #ddd6fe; border: none; border-radius: 6px; padding: 6px 16px; font-size: 0.82rem; }
    .btn:hover { background: #5b21b6; }
    .toc { margin: 16px 24px; background: #1a1a2e; border-radius: 8px; padding: 16px; }
    .toc h2 { font-size: 0.95rem; color: #94a3b8; margin-bottom: 8px; }
    .toc ul { columns: 2; list-style: none; }
    .toc li { margin: 2px 0; font-size: 0.82rem; }
    .levels-container { padding: 0 16px 32px; }
    .level-details { background: #1a1a2e; border-left: 4px solid #6c63ff; border-radius: 8px; margin: 12px 0; }
    .level-summary { cursor: pointer; padding: 12px 16px; display: flex; gap: 10px; align-items: center; flex-wrap: wrap; list-style: none; }
    .level-summary::-webkit-details-marker { display: none; }
    .level-num { color: #6c63ff; font-weight: bold; font-size: 0.85rem; min-width: 28px; }
    .level-id { font-family: monospace; color: #a78bfa; font-size: 0.85rem; }
    .level-name { color: #e2e8f0; font-weight: 600; }
    .level-badge { padding: 2px 8px; border-radius: 12px; font-size: 0.72rem; font-weight: bold; }
    .level-badge-normal { background: #064e3b; color: #6ee7b7; }
    .level-badge-boss { background: #7f1d1d; color: #fca5a5; }
    .level-universe { color: #64748b; font-size: 0.8rem; margin-left: auto; }
    .level-content { padding: 8px 16px 16px; }
    .icon-section { margin: 16px 0; border: 1px solid #2d2d44; border-radius: 8px; overflow: hidden; }
    .icon-header { background: #16213e; padding: 8px 14px; display: flex; gap: 8px; align-items: center; }
    .icon-type-label { font-family: monospace; color: #7dd3fc; font-weight: 600; font-size: 0.9rem; }
    .badge-multi { background: #7f1d1d; color: #fca5a5; padding: 2px 8px; border-radius: 12px; font-size: 0.72rem; font-weight: bold; }
    .current-col { background: #2a1f00; border: 1px solid #f59e0b; margin: 10px; border-radius: 6px; padding: 10px 14px; }
    .badge-current { background: #78350f; color: #fcd34d; padding: 2px 8px; border-radius: 12px; font-size: 0.72rem; font-weight: bold; display: inline-block; margin-bottom: 4px; }
    .current-desc { font-weight: 600; color: #fcd34d; margin: 4px 0; }
    .current-source { color: #94a3b8; font-size: 0.82rem; }
    .current-code { font-family: monospace; font-size: 0.78rem; color: #a5f3fc; background: #0f172a; padding: 4px 8px; border-radius: 4px; margin-top: 4px; word-break: break-all; }
    .states-block { background: #0f1629; border-left: 3px solid #8b5cf6; margin: 0 10px 10px; padding: 10px 14px; border-radius: 0 6px 6px 0; }
    .states-title { color: #c4b5fd; font-size: 0.82rem; font-weight: 600; margin-bottom: 6px; }
    .state-row { display: flex; gap: 8px; margin: 3px 0; font-size: 0.8rem; }
    .state-name { color: #8b5cf6; font-family: monospace; min-width: 80px; font-weight: 600; }
    .state-desc { color: #94a3b8; }
    .candidates-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 8px; padding: 10px; }
    .candidate-card { background: #0f172a; border: 1px solid #2d2d44; border-radius: 8px; padding: 10px 8px; text-align: center; position: relative; }
    .candidate-card.pair-card { border: 2px solid #8b5cf6; }
    .pair-label { position: absolute; top: 4px; right: 4px; background: #4c1d95; color: #ddd6fe; font-size: 0.6rem; padding: 1px 5px; border-radius: 8px; }
    .candidate-card img { display: block; margin: 0 auto 6px; }
    .cand-id { font-family: monospace; font-size: 0.62rem; color: #6366f1; cursor: pointer; margin-bottom: 4px; word-break: break-all; }
    .cand-id:hover { color: #a5b4fc; }
    .cand-name { font-size: 0.75rem; color: #e2e8f0; font-weight: 500; margin-bottom: 2px; }
    .cand-reason { font-size: 0.72rem; color: #94a3b8; margin-bottom: 4px; }
    .cand-meta { display: flex; gap: 4px; justify-content: center; flex-wrap: wrap; }
    .badge { padding: 1px 6px; border-radius: 10px; font-size: 0.65rem; font-weight: bold; }
    .badge-strong { background: #166534; color: #86efac; }
    .badge-medium { background: #92400e; color: #fcd34d; }
    .badge-weak { background: #374151; color: #9ca3af; }
    .risk-label { font-size: 0.65rem; color: #64748b; }
    """

    js = """
    function toggleAll(open) {
      document.querySelectorAll('details').forEach(d => d.open = open);
    }
    """

    toc_html = toc(levels)
    sections = "".join(level_section(lvl, i+1) for i, lvl in enumerate(levels))

    html = f"""<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Snake Drive V4 — Icon Candidate Selection Board v3</title>
  <style>{css}</style>
</head>
<body>
  <h1>Snake Drive V4 — Icon Candidate Selection Board <span style="color:#8b5cf6">v3</span></h1>
  <div class="meta-bar">
    <span><strong>{n_levels}</strong> niveaux</span>
    <span><strong>{n_types}</strong> types d'icônes</span>
    <span><strong>{n_candidates}</strong> candidats (10 par type)</span>
    <span><strong>{n_svg}</strong> SVG copiés</span>
    <button class="btn" onclick="toggleAll(true)">Tout déplier</button>
    <button class="btn" onclick="toggleAll(false)">Tout replier</button>
  </div>
  {toc_html}
  <div class="levels-container">
    {sections}
  </div>
  <script>{js}</script>
</body>
</html>"""

    with open(OUT_HTML, "w", encoding="utf-8") as f:
        f.write(html)

# ─── MAIN ─────────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    os.makedirs(PREVIEW_DIR, exist_ok=True)
    print("Collecting SVG IDs...")
    needed = collect_all_svgs(LEVELS)
    print(f"  {len(needed)} unique SVGs needed")

    print("Copying SVGs...")
    copied, missing = copy_svgs(needed)
    print(f"  {copied} copied, {len(missing)} missing")
    if missing:
        print(f"  Missing: {missing}")

    print("Writing CSV...")
    n_rows = write_csv(LEVELS)
    print(f"  {n_rows} rows written")

    print("Writing HTML...")
    write_html(LEVELS, copied, n_rows)
    print(f"  Done: {OUT_HTML}")

    print(f"\nSummary: {len(LEVELS)} levels, {sum(len(l[4]) for l in LEVELS)} icon types, {n_rows} candidates, {copied} SVGs")
