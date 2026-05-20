# 14 — Universe Implementation Spec

Ce fichier verrouille les mécaniques. Il évite que les univers soient uniquement des couleurs différentes.

## Standard commun

Chaque univers normal doit définir :

- objectif ;
- règle affichée ;
- comportement mécanique ;
- pattern de spawn ;
- danger ;
- condition de clear ;
- feedback visuel ;
- test manuel.

Chaque boss doit définir :

- objectif ;
- HP ou phases ;
- attaque ;
- fenêtre de vulnérabilité ;
- feedback hit ;
- condition de clear ;
- test manuel.

---

# 1. Castle of Illusion

## Normal — Enchanted Garden

- Mechanic ID : `castleIllusion`
- Règle HUD : `BLINK WALLS = DANGER`
- Objectif : collecter 10 étoiles/orbes.
- Comportement :
  - des murs illusion apparaissent sur la grille ;
  - état 1 : ghost/inactif ;
  - état 2 : warning halo violet ;
  - état 3 : actif danger.
- Danger :
  - collision avec mur actif = Game Over.
- Spawn :
  - blink walls hors Snake et hors pickup ;
  - pas d’activation injuste sous la tête sans warning.
- Clear :
  - quota atteint.
- Test :
  - voir les 3 états ;
  - éviter un mur actif ;
  - collecter quota.

## Boss — Witch Mirror

- Mechanic ID : `witchMirror`
- Règle HUD : `HIT TRUE MIRROR`
- Objectif : toucher le vrai miroir 3 fois.
- Boss HP : 3.
- Comportement :
  - plusieurs miroirs apparaissent ;
  - un vrai, des faux ;
  - les faux peuvent être dangereux ou faire perdre du temps.
- Vulnérabilité :
  - vrai miroir identifiable brièvement.
- Clear :
  - HP à 0.
- Test :
  - toucher vrai miroir ;
  - voir HP baisser ;
  - faux miroir compréhensible.

---

# 2. Sonic

## Normal — Ring Rush Zone

- Mechanic ID : `ringChains`
- Règle HUD : `CHAIN RINGS`
- Objectif : collecter des rings en chaîne.
- Comportement :
  - les rings apparaissent par petites chaînes ;
  - collecter dans l’ordre donne bonus/progression ;
  - casser la chaîne la réinitialise ou réduit le bonus.
- Danger :
  - vitesse légèrement plus haute mais lisible.
- Clear :
  - quota de rings.
- Test :
  - collecter une chaîne visible.

## Boss — Loop Serpent

- Mechanic ID : `loopSerpent`
- Règle HUD : `CATCH THE LOOP`
- Objectif : toucher le point vulnérable du serpent en orbite.
- Boss HP : 3.
- Comportement :
  - boss se déplace selon une boucle ;
  - fenêtre de hit sur anneau/orbe lumineux.
- Test :
  - prédire la boucle ;
  - hit x3.

---

# 3. Streets

## Normal — Back Alley Brawl

- Mechanic ID : `crowdBlockers`
- Règle HUD : `CROWDS MOVE`
- Objectif : collecter nourriture/bonus en évitant foules.
- Comportement :
  - blockers temporaires apparaissent/disparaissent ;
  - certains se déplacent lentement.
- Danger :
  - collision blocker = Game Over.
- Clear :
  - quota.
- Test :
  - un blocker bouge ou change d’état.

## Boss — Crime Lord

- Mechanic ID : `crimeLord`
- Règle HUD : `AVOID PRESSURE`
- Objectif : hit boss pendant fenêtre sûre.
- Boss HP : 3.
- Comportement :
  - zones de pression apparaissent en ligne/zone ;
  - boss vulnérable après attaque.
- Test :
  - éviter zone ;
  - hit boss.

---

# 4. Fighter

## Normal — World Warrior Dojo

- Mechanic ID : `chargeMove`
- Règle HUD : `CHARGE THEN STRIKE`
- Objectif : collecter après charge directionnelle.
- Comportement :
  - maintenir direction propre plusieurs cellules charge un hit ;
  - pickup spécial valide charge.
- Danger :
  - zones de sparring fixes.
- Clear :
  - quota.
- Test :
  - charge visible ;
  - validation.

## Boss — Final Challenger

- Mechanic ID : `finalChallenger`
- Règle HUD : `WIN 3 ROUNDS`
- Objectif : gagner 3 rounds/hits.
- Boss HP : 3 rounds.
- Comportement :
  - fenêtre d’attaque courte ;
  - si ratée, boss contre-attaque avec zone.
- Test :
  - round gagné ;
  - feedback round.

---

# 5. OutRun

## Normal — Sunset Highway

- Mechanic ID : `laneDrift`
- Règle HUD : `HIT CHECKPOINTS`
- Objectif : collecter checkpoints dans lanes.
- Comportement :
  - lanes verticales/horizontales ;
  - drift/bonus si changement de lane propre.
- Danger :
  - traffic blocks.
- Clear :
  - quota checkpoints.
- Test :
  - lane claire ;
  - checkpoint visible.

## Boss — Turbo Rival

- Mechanic ID : `turboRival`
- Règle HUD : `OVERTAKE`
- Objectif : dépasser/toucher rival en fenêtre turbo.
- Boss HP : 3.
- Comportement :
  - rival avance sur lanes ;
  - zones turbo apparaissent.
- Test :
  - turbo ;
  - hit rival.

---

# 6. Shinobi

## Normal — Snow Dojo

- Mechanic ID : `focusMode`
- Règle HUD : `FOCUS TARGET`
- Objectif : collecter cibles précises.
- Comportement :
  - une vraie cible, des decoys ;
  - focus indicator aide à reconnaître.
- Danger :
  - decoy mauvais = pénalité ou danger.
- Clear :
  - quota vraies cibles.
- Test :
  - différencier vrai/decoy.

## Boss — Shadow Ninja

- Mechanic ID : `shadowNinja`
- Règle HUD : `HIT REAL SHADOW`
- Objectif : hit vrai ninja 3 fois.
- Boss HP : 3.
- Comportement :
  - clones ;
  - vrai révélé brièvement.
- Test :
  - vrai clone identifiable.

---

# 7. Kombat

## Normal — Nether Arena

- Mechanic ID : `fatalZones`
- Règle HUD : `FATAL ZONES`
- Objectif : collecter reliques en évitant zones télégraphiées.
- Comportement :
  - zones danger préviennent avant activation ;
  - activation courte.
- Danger :
  - collision zone active = Game Over.
- Clear :
  - quota.
- Test :
  - warning puis active.

## Boss — Dragon Gate

- Mechanic ID : `dragonGate`
- Règle HUD : `FINISH WINDOW`
- Objectif : toucher pendant fenêtre finish.
- Boss HP : 3.
- Comportement :
  - dragon/gate ouvre fenêtre ;
  - hors fenêtre = danger.
- Test :
  - voir fenêtre ;
  - hit valide.

---

# 8. Paperboy

## Normal — Morning Route

- Mechanic ID : `deliveryTargets`
- Règle HUD : `DELIVER PAPERS`
- Objectif : livrer aux maisons/cibles.
- Comportement :
  - targets apparaissent en bord/lane ;
  - pickup papier doit être livré.
- Danger :
  - obstacles route.
- Clear :
  - quota livraisons.
- Test :
  - collecter papier ;
  - livrer cible.

## Boss — Neighborhood Chaos

- Mechanic ID : `neighborhoodChaos`
- Règle HUD : `SURVIVE ROUTE`
- Objectif : compléter livraisons pendant chaos.
- Boss HP/Phases : 3 vagues.
- Comportement :
  - obstacles mobiles ;
  - cibles de livraison ;
  - phase claire.
- Test :
  - vague 1/2/3 ;
  - livraison boss.
