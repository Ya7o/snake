# PATCH 1063 — Boss Mechanics Readability Audit

**Date :** 2026-05-30
**Type :** Audit QA / lisibilite gameplay
**Scope :** 8 boss (8 univers), mecaniques, objets collectables, lisibilite
**Contexte :** Question QA mobile — pourquoi des objets collectables apparaissent en boss ?

---

## Table principale — Mecaniques Boss

| Univers | Boss | Objectif joueur | Objets collectables | Effet reel | Condition victoire | Condition echec | Lisibilite | Probleme potentiel | Recommandation |
|---------|------|-----------------|---------------------|------------|-------------------|-----------------|------------|-------------------|----------------|
| Castle | La Sorciere au Miroir (WitchMirrorBoss) | Frapper le vrai miroir quand il est vulnerable (etat vulnerable) | Pickup generique (eclat magique OpenMoji) + miroirs boss (witchMirror) | Pickup : snake +1 seg, score +1 invisible. Miroir vulnerable = weakpoint -> boss hp-1 | 3 hits sur le vrai miroir vulnerable | Toucher miroir fake en etat attacking, mur, soi-meme | Moyen | Pickup eclat ressemble a l eclat de vulnerabilite — introHint dit eclat lumineux mais le pickup eclat existe aussi | P1 : differencer visuellement le pickup eclat du feedback de vulnerabilite |
| Sonic | Serpent en Boucle (LoopSerpentBoss) | Frapper l orbe (dernier segment du serpent boss) | Pickup generique (anneau) + orbe boss (loopSerpent state:orb) | Pickup : snake +1, score +1 invisible. Orbe = weakpoint -> boss hp-1 | 3 hits sur l orbe au bout du serpent | Toucher les 2 premiers segments body (letaux), mur, soi-meme | Faible | Orbe boss visuellement similaire a l anneau pickup — joueur peut confondre les deux | P0 : differencer visuellement orbe boss vs pickup anneau |
| Streets | Seigneur du Crime (CrimeLordBoss) | Frapper le boss pendant sa phase vulnerable (apres 20t de pression) | Pickup generique (objet streets) + zones de pression (pressureZone) | Pickup : snake +1, score +1 invisible. Boss vulnerable = weakpoint -> hp-1 | 3 hits sur le boss en phase vulnerable | Toucher pressureZone (danger ~60% cols), mur, soi-meme | Moyen | Pickup present mais role boss flou ; joueur peut ignorer ou chercher a collecter inutilement | P1 : supprimer le pickup generique en boss streets ou lui donner un role |
| Fighter | Ultime Challenger (FinalChallengerBoss) | Frapper le boss pendant la fenetre attack_window (12t), eviter le contre | Pickup generique (objet fighter) + zones de contre (counterZone) | Pickup : snake +1, score +1 invisible. Boss en attack_window = weakpoint -> hp-1 | 3 hits sur le boss en attack_window | Toucher counterZone (4 zones 8t), mur, soi-meme | OK | Pickup present, role flou en boss. HUD FRAPPE/EVITE lisible | P2 : supprimer pickup generique en boss fighter |
| OutRun | Rival Turbo (TurboRivalBoss) | Frapper la turboZone (devant le rival) quand elle apparait (toutes 25t) | Pickup generique (balise) + turboZone (weakpoint active) | Pickup : snake +1, score +1 invisible. TurboZone = weakpoint -> boss hp-1 | 3 hits sur turboZone | Toucher rivalCell (toujours lethal), mur, soi-meme | Faible | CONFUSION FORTE : 2 objets visuellement positifs (pickup + turboZone) avec roles opposes | P0 : differencer fortement turboZone vs pickup, ou supprimer pickup generique |
| Shinobi | Ninja de l Ombre (ShadowNinjaBoss) | Frapper le vrai ninja quand il est revele (6t/28t) | Pickup generique (objet shinobi) + clones shadowNinja (state:real ou shadow) | Pickup : snake +1, score +1 invisible. Real revele = weakpoint -> hp-1. Fakes (shadow) = danger | 3 hits sur le vrai ninja revele | Toucher clone fake (state shadow, letal), mur, soi-meme | Faible | 3 types visuels (shadow danger, real revele weakpoint, pickup inutile) + real cache indistinguable des fakes | P0 : supprimer pickup generique en boss shinobi ; P1 : differencer visuellement real cache vs fakes |
| Kombat | Porte du Dragon (DragonGateBoss) | Frapper la porte quand elle est open (12t), eviter les dangerZones | Pickup generique (objet kombat) + dangerZones (3x3-centre autour porte) | Pickup : snake +1, score +1 invisible. Gate open = weakpoint -> hp-1. DangerZones = letales ttl=8 | 3 hits sur la porte en etat open | Toucher dangerZone, mur, soi-meme | OK | Pickup present mais role flou. HUD ATTENTION/ATTAQUE!/DANGER lisible | P2 : supprimer pickup generique en boss kombat |
| Paperboy | Chaos du Quartier (NeighborhoodChaosBoss) | Collecter le journal, puis livrer aux 2 cibles par vague. 3 vagues = 3 hits boss | Pickup generique = LE JOURNAL (hasPaper) + bossTarget (cible livraison, highlighted) | Pickup intercepte par onPickupCollected : hasPaper=true -> cibles deviennent weakpoints highlighted | 3 hits (1 par vague, 2 livraisons par hit) | Toucher chaosObstacle (mobile, letal), mur, soi-meme | OK | Bien concu : pickup = journal, coherent avec le theme. HUD + glows guident | P2 : polish des glows sur mobile |

---

## Objets / pickups ambigus en boss

| Univers | Objet | Vu comme pickup ? | Effet reel | Probleme | A corriger ? |
|---------|-------|------------------|------------|----------|--------------|
| Castle | Pickup generique (eclat magique) | Oui — ressemble a un eclat collectable | snake +1, score invisible | Confusion avec le vrai miroir vulnerable (appele eclat lumineux dans introHint) | P1 — ajouter feedback visuel distinct ou label |
| Sonic | Pickup generique (anneau) | Oui — ressemble a anneau sonic | snake +1, score invisible | Confusion directe avec orbe boss (aussi anneau-like) — joueur ne sait pas lequel frapper | P0 — differencer orbe boss vs anneau pickup |
| Sonic | Orbe boss (loopSerpent state:orb) | Possible — visuellement similaire a anneau | boss hp-1 si touche | Joueur peut croire que l orbe est un pickup et pas un weakpoint boss | P0 — differencer visuellement |
| Streets | Pickup generique | Oui | snake +1, score invisible | Role inutile dans le boss, distraction | P1 — a retirer ou a integrer |
| Fighter | Pickup generique | Oui | snake +1, score invisible | Role inutile dans le boss | P2 — a retirer |
| OutRun | Pickup generique (balise) | Oui | snake +1, score invisible | Confondu avec turboZone qui est aussi un objet a frapper | P0 — differencer ou retirer pickup |
| OutRun | TurboZone (state:active) | Oui — objet positif a frapper | boss hp-1 si touche | Si pickup ressemble a turboZone, le joueur ne sait pas lequel est le vrai weakpoint | P0 — signal visuel fort distinctif |
| Shinobi | Pickup generique | Oui | snake +1, score invisible | 3eme type visuel superflu, surcharge | P0 — a retirer en boss shinobi |
| Shinobi | Clone real non-revele (state:shadow) | Non — meme que les fakes | Pas de danger (getDangerCells filtre non-real) | Indistinguable visuellement des fakes (meme state shadow) | P1 — feedback subtil pour memoriser le vrai |
| Kombat | Pickup generique | Oui | snake +1, score invisible | Role flou dans le boss | P2 — a retirer |
| Paperboy | Pickup generique (journal) | Oui | hasPaper=true -> active cibles | Bien integre : role explicite, HUD LIVRE, glows | Non — bien concu |
| Paperboy | BossTarget idle (pas encore highlighted) | Peut-etre — objet sur la grille | Rien (pas hasPaper) | Joueur peut tenter de livrer sans avoir le journal | P2 — idle state assez neutre |

---

## Classement lisibilite boss

| Boss | Clarte objectif | Clarte objets | Feedback hit | Risque confusion | Priorite correction |
|------|----------------|--------------|--------------|-----------------|-------------------|
| Ultime Challenger (Fighter) | OK | OK | OK (flash + HUD FRAPPE/EVITE) | Faible — HUD clair, pickup discret | P2 |
| Porte du Dragon (Kombat) | OK | OK | OK (flash + HUD ATTENTION/ATTAQUE!) | Faible — cycle bien signale | P2 |
| Chaos du Quartier (Paperboy) | OK | OK | OK (flash + HUD LIVRE + glows) | Faible — le pickup A un role | P2 |
| Seigneur du Crime (Streets) | OK | Moyen | OK (flash + HUD ATTAQUE!/DANGER) | Moyen — pickup sans role mais peu visible | P1 |
| Sorciere au Miroir (Castle) | Moyen | Moyen | OK (flash + HUD) | Moyen — eclat pickup vs eclat vulnerable | P1 |
| Ninja de l Ombre (Shinobi) | Moyen | Faible | OK (flash + HUD FRAPPE/OBSERVE) | Eleve — 3 types visuels + real cache indistinguable | P0 |
| Serpent en Boucle (Sonic) | OK | Faible | OK (flash + HUD FRAPPE) | Eleve — pickup anneau vs orbe anneau | P0 |
| Rival Turbo (OutRun) | OK | Faible | OK (flash + HUD FRAPPE MAINTENANT!) | Eleve — pickup balise vs turboZone weakpoint | P0 |

Echelle : OK (clair) / Moyen (acceptable) / Faible (problematique)

---

## Recommandations P0/P1/P2

### P0 — Incomprehensible (avant nouvelle publication)

**P0-1 : OutRun / Rival Turbo — Confusion pickup vs turboZone**
- Probleme : turboZone (weakpoint a frapper -> boss hit) et pickup generique sont tous les deux des objets positifs a l ecran. Le joueur ne sait pas lequel est le vrai weakpoint.
- Solution sans nouveaux assets : supprimer le pickup generique en mode boss turboRival (ne pas appeler spawnInitialPickup pour ce boss) OU donner un signal visuel fort au turboZone distinct du pickup.
- Ne pas faire : refonte graphique complete.

**P0-2 : Sonic / Serpent en Boucle — Confusion orbe boss vs anneau pickup**
- Probleme : l orbe (dernier segment du serpent boss, le weakpoint) ressemble probablement a un anneau sonic, tout comme le pickup generique. Le joueur peut confondre le weakpoint avec un simple collectable.
- Solution : supprimer le pickup generique en boss loopSerpent, OU utiliser un asset pickup secondaire (pickup_02) clairement different de l orbe.
- Ne pas faire : modifier la trajectoire du serpent ou sa structure.

**P0-3 : Shinobi / Ninja de l Ombre — Surcharge visuelle + pickup orphelin**
- Probleme : 3 types visuels (shadow danger / real revele weakpoint / pickup inutile) dont 2 indistinguables (real cache = meme state shadow que les fakes).
- Solution : supprimer le pickup generique en boss shadowNinja. Separer est optionnel P1.
- Ne pas faire : nouveau tutoriel, nouvelles animations.

### P1 — Amelioration recommandee

**P1-1 : Castle / Sorciere au Miroir — Ambiguite eclat pickup vs eclat vulnerable**
- introHint dit eclat lumineux = vrai miroir. Mais le pickup magic shard (pickupPrimary) est aussi un eclat lumineux.
- Solution : utiliser un pickup secondaire (pickup_02) visuellement moins proche du feedback vulnerable OU ajouter une distinction HUD.

**P1-2 : Streets / Seigneur du Crime — Pickup sans role en boss**
- Le pickup generique est present mais n a aucun role dans le boss.
- Solution : supprimer le pickup en mode boss crimeLord.

**P1-3 : Shinobi / Ninja de l Ombre — Real cache indistinguable des fakes**
- getDangerCells() filtre correctement (real = pas danger), mais visuellement le joueur ne peut pas distinguer le real cache des fakes.
- Solution sans nouveaux assets : HUD count ou indice de position.

### P2 — Polish

**P2-1 : Fighter / Ultime Challenger — Pickup sans role en boss**
- Peu visible, conflit mineur. Supprimer le pickup en boss finalChallenger.

**P2-2 : Kombat / Porte du Dragon — Pickup sans role en boss**
- Supprimer le pickup en boss dragonGate.

**P2-3 : Paperboy / Chaos du Quartier — Polish glows mobile**
- drawPaperboyTargetGlow fonctionne bien mais verifier le rendu sur petits ecrans mobile (cellSize petits).

---

## Pourquoi y a-t-il des objets collectables dans les boss ?

### Reponse technique (source : GameScene.ts)

La fonction `spawnInitialPickup()` appelle `spawnPickup()` pour tous les niveaux, qu il s agisse d un niveau normal ou d un niveau boss. Le test d exception concerne seulement SonicRingsMechanic, ShinobiFocusMechanic et OutRunLaneMechanic (qui ont leurs propres pickups manages). Les boss mecaniques (BaseBoss) n ont pas de logique d exception dans spawnInitialPickup.

En resume : le pickup generique est la par heritage du systeme de niveaux normaux. Il n a pas ete desactive pour les boss.

### Cas par cas

| Univers | Objet | Statut | Detail |
|---------|-------|--------|--------|
| Castle | Pickup eclat magique | Ambigu | Pickup orphelin. Collision visuelle avec eclat vulnerabilite du boss. |
| Sonic | Pickup anneau | Ambigu | Pickup orphelin. Risque confusion avec orbe weakpoint du serpent. |
| Streets | Pickup objet streets | Decoratif | Pickup orphelin. Aucun role dans le boss, peu visible. |
| Fighter | Pickup objet fighter | Decoratif | Pickup orphelin. Aucun role, impact faible. |
| OutRun | Pickup balise | Potentiellement a retirer | Pickup orphelin CRITIQUE. Confondu avec turboZone weakpoint. |
| Shinobi | Pickup objet shinobi | A retirer | Pickup orphelin. Surcharge un boss deja visuellement charge. |
| Kombat | Pickup objet kombat | Decoratif | Pickup orphelin. Aucun role dans le boss, peu visible. |
| Paperboy | Pickup journal | Utile | SEUL cas ou le pickup a un role. onPickupCollected intercepte -> hasPaper=true -> mecanique livraison. |

### Conclusion

7 boss sur 8 ont un pickup generique sans role dans la victoire.
1 boss (Paperboy) utilise le pickup de maniere intentionnelle et bien concue.
La correction principale est de desactiver le spawn de pickup generique pour les boss qui n en ont pas besoin (OutRun, Shinobi en priorite P0, puis Streets, Fighter, Kombat en P1/P2).
