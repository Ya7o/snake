# PATCH 1066 — Triage Mobile QA Feedback

**Date :** 2026-05-30
**Type :** Audit / Triage / Product QA
**Source :** QA mobile reelle — 9 retours observes
**Branche :** main

Aucune modification du code dans ce patch. Document de triage uniquement.

---

## 1) Table des retours

| ID  | Sujet                                 | Type         | Impact joueur                                              | Risque           | Priorite | Patch recommande |
|-----|---------------------------------------|--------------|------------------------------------------------------------|------------------|----------|------------------|
| QA1 | Pickup OutRun : rendu insatisfaisant  | Visuel       | Le pickup ne correspond pas au style de l univers OutRun   | Confusion visuelle / immersion cassee | P0 | 1067 |
| QA2 | Pickup Shinobi : decalage emoji / rendu insatisfaisant | Visuel | L emoji est mal positionne, rendu degradee | Confusion visuelle / immersion cassee | P0 | 1067 |
| QA3 | Ecran Clear / Boss vaincu : texte mal place | Layout UI | L annonce de victoire est difficile a lire | UX degradee a un moment cle | P0 | 1068 |
| QA4 | Taille icones runtime : icones Paperboy (chiens) trop petits vs boites aux lettres | Visuel / Coherence | Incoherence visuelle d un pickup a l autre dans Paperboy | Lisibilite, perception de qualite | P1 | 1069 |
| QA5 | HUD gameplay : Castle utilise 3 capsules, autres utilisent ecran large | Template HUD | Le HUD varie selon les mondes sans logique claire | Incoherence, confusion sur les regles | P1 | 1070 |
| QA6 | Frame gameplay : tailles differentes selon univers | Viewport / Layout | Certains univers semblent plus grands ou plus petits | Perception d inegalite / incoherence | P1 | 1071 |
| QA7 | Le jeu semble trop facile | Design gameplay | Pas de defi suffisant, retention faible | Addictivite / progression compromises | P2 | 1072 |
| QA8 | Ajouter un systeme de score | Feature gameplay | Pas de feedback de performance pour le joueur | Manque de motivation / replayability | P2 | 1072 |
| QA9 | Comment rendre le jeu plus addictif | Design / Product | Experience globale moins engageante | Retention long terme | P2 | 1072 |

---

## 2) Classement par priorite

### P0 — Critique (cassé visuellement ou UX clé dégradée)

- **QA1** — Pickup OutRun : rendu pas satisfaisant
  - Symptome : le pickup ne colle pas au style OutRun (neon, vitesse, voiture)
  - Impact : immersion cassee dans un univers fort
  - Condition P0 : si visuellement casse ou manifestement hors-style

- **QA2** — Pickup Shinobi : decalage emoji
  - Symptome : l emoji est decale ou mal rendu, rendu pas satisfaisant
  - Impact : pickup difficile a lire, confusion sur ce que le joueur collecte
  - Condition P0 : si l emoji est visuellement casse (offset, clipping, mauvais glyph)

- **QA3** — Ecran Clear / Boss vaincu : texte mal place
  - Symptome : le texte d annonce (victoire, boss vaincu) n est pas centre ou est hors frame
  - Impact : moment de victoire degrade — c est un moment cle de la boucle de jeu
  - Condition P0 : toujours (texte illisible ou mal place = UX cassee sur chemin principal)

### P1 — Important (incoherence perceptible, decision requise)

- **QA4** — Taille icones runtime : chiens Paperboy trop petits vs boites aux lettres
  - Reference : les boites aux lettres Paperboy sont la reference de taille correcte
  - Action requise : audit de toutes les icones runtime par monde, harmonisation a la reference

- **QA5** — HUD gameplay : Castle = 3 capsules vs autres = ecran large
  - Ce retour necessite une decision de design avant tout correctif
  - Question : quel template HUD garder comme standard ?
  - Risk : harmoniser sans decision = regression possible sur l univers Castle

- **QA6** — Frame gameplay : tailles differentes selon univers
  - A verifier : est-ce volontaire (chaque monde a son ambiance) ou un bug de layout ?
  - Si volontaire : documenter la decision
  - Si involontaire : corriger les cas hors-spec

### P2 — Backlog design (require conception avant implementation)

- **QA7** — Jeu trop facile
  - Necessite une analyse de la courbe de difficulte actuelle
  - Pas de hausse brutale sans design (risque de frustration)

- **QA8** — Systeme de score
  - Feature absente, necessiterait un design complet (UI, persistance, integration HUD)
  - Pas d implementation sans spec validee

- **QA9** — Rendre le jeu plus addictif
  - Question ouverte de product design
  - Dependances : score (QA8), difficulte (QA7), progression, feedback sonore/visuel

---

## 3) Sequence recommandee

| # | Patch | Sujet | Priorite | Type |
|---|-------|-------|----------|------|
| 1 | 1067 | Pickup Icon Readability Fix | P0 | Correctif visuel — OutRun + Shinobi |
| 2 | 1068 | Clear/Boss Clear Layout Alignment | P0 | Correctif layout — ecran victoire |
| 3 | 1069 | Runtime Icon Size Harmonization Audit | P1 | Audit + harmonisation icones |
| 4 | 1070 | Gameplay HUD Template Decision | P1 | Decision design — template HUD |
| 5 | 1071 | Gameplay Screen Frame Decision | P1 | Decision / audit — viewport par monde |
| 6 | 1072 | Difficulty Score Addiction Design Decision | P2 | Design decision — difficulte / score / retention |

### Rationale de la sequence

- 1067 et 1068 en premier : P0, correctifs visuels isoles, aucune dependance
- 1069 apres : depend d une reference visuelle stable (d ou la correction des pickups en premier)
- 1070 et 1071 : decisions d architecture UI avant toute harmonisation
- 1072 en dernier : le plus large, le plus incertain, necessite design

---

## 4) Ne pas faire maintenant

| Sujet | Raison |
|-------|--------|
| Implementer un systeme de score | Pas de spec, pas de design HUD, dependance avec difficulte |
| Augmenter la difficulte brutalement | Risque de frustration sans courbe pensee |
| Harmoniser le HUD avant decision template | Risque de regression sur Castle ou autres mondes |
| Modifier des assets a l aveugle | Sans audit prealable (1069), risque de casser des pickups qui fonctionnent |
| Fusionner QA7/QA8/QA9 en un seul patch | Ce sont trois problemes distincts qui meritent des decisions separees |

---

## Notes supplementaires

### Sur QA1 et QA2 — Pickup icons
Les pickups OutRun et Shinobi ont ete notes comme visuellement insatisfaisants.
Avant de corriger, verifier dans le code si :
- l icone est un emoji Unicode (risque de rendu variable selon OS/navigateur)
- l icone est un asset image (PNG/SVG) — dans ce cas verifier taille, padding, z-index
- le probleme est de positionnement CSS ou de valeur de caractere

### Sur QA5 — HUD Castle
Le monde Castle utilise 3 capsules comme indicateur de vie/etat. Les autres mondes
utilisent un layout ecran large. Avant de decider quel template est la reference,
documenter pourquoi Castle a diverge : decision artistique, contrainte technique,
ou bug non corrige.

### Sur QA9 — Addictivite
La question de l addictivite est une question de product design, pas une question
technique. Les leviers classiques (boucle de progression, feedback immediat, score,
classement, defi calibre) doivent etre priorises et arbitres par le product owner
avant toute implementation.
