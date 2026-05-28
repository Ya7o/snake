# PATCH 1017B — French Copy & Objective Text Audit

## Objectif

Auditer tous les textes visibles joueur et proposer une version française plus naturelle, courte et adaptée au contexte arcade mobile.

---

## Règles de ton appliquées

- Court · naturel · arcade · clair mobile
- Pas de phrases explicatives lourdes dans le HUD
- Impératif ou substantif, jamais de formulation passive
- Pas de mélange anglais/français sur une même ligne fonctionnelle
- Majuscules cohérentes : pixel font = tout caps, UI font = casse naturelle ou tout caps selon usage

---

## Textes audités

### Noms de niveaux (`src/config/levels.ts`)

| Fichier | Contexte | Texte actuel | Problème | Proposition | Priorité |
|---|---|---|---|---|---|
| levels.ts | Nom niveau Castle boss | `Miroir Sorcière` | Pas d'article — nom coupé, peu naturel | `La Sorcière au Miroir` | Important |
| levels.ts | Nom niveau Fighter boss | `Challenger Final` | Anglicisme brut dans un contexte francophones | `Le Challenger Final` ou `Ultime Challenger` | Mineur |
| levels.ts | Nom niveau Shinobi normal | `Dojo des Neiges` | Doublon "Dojo" avec Fighter normal (`Dojo des Guerriers`) | `Temple des Neiges` | Mineur |

---

### ruleText (affiché dans LevelIntroScene — sous le nom de niveau)

| Fichier | Contexte | Texte actuel | Problème | Proposition | Priorité |
|---|---|---|---|---|---|
| levels.ts | Castle normal ruleText | `STAGE 1` | Anglais isolé dans interface française | `ÉTAGE 1` ou `NIVEAU 1` | Critique |
| levels.ts | Sonic normal ruleText | `CHAÎNE ANNEAUX` | Juxtaposition de mots sans lien grammatical | `EN CHAÎNE` ou `CHAÎNES` | Important |
| levels.ts | Sonic boss ruleText | `COUPE LA BOUCLE` | Correct mais légèrement littéral | `COUPE LA BOUCLE` ✓ | — |
| levels.ts | Streets normal ruleText | `FOULE MOBILE` | OK, cohérent avec HUD | `FOULE MOBILE` ✓ | — |
| levels.ts | Streets boss ruleText | `PRESSION` | Vague — ne dit pas ce qu'il faut faire | `ÉTAU` ou `SOUS PRESSION` | Mineur |
| levels.ts | OutRun boss ruleText | `DÉPASSEMENT` | Correct et arcade | `DÉPASSEMENT` ✓ | — |
| levels.ts | Kombat boss ruleText | `FENÊTRE` | Court mais opaque sans contexte | `FENÊTRE D'ATTAQUE` | Mineur |

---

### introHint (affiché dans LevelIntroScene — corps de la carte)

| Fichier | Contexte | Texte actuel | Problème | Proposition | Priorité |
|---|---|---|---|---|---|
| levels.ts | Castle normal hint | `Collecte 10 éclats. Les murs brillent avant d'apparaître. Attends la voie libre.` | Trop long, 3 phrases — HUD mobile max 2 lignes | `Collecte 10 éclats. Les murs brillent avant d'apparaître.` | Important |
| levels.ts | Sonic normal hint | `Ramasse les anneaux dans l'ordre et garde le rythme.` | "Ramasse" familier mais OK. "garde le rythme" flou | `Ramasse les anneaux en ordre. Ne casse pas la chaîne.` | Mineur |
| levels.ts | Streets normal hint | `Lis les déplacements avant de foncer dans la rue.` | "Lis les déplacements" très maladroit | `Attends un couloir libre, puis fonce.` | Important |
| levels.ts | Fighter normal hint | `Garde la direction, puis prends la cible quand l'élan est prêt.` | "l'élan est prêt" bizarre et long | `Garde le cap. Prends la cible quand la CHARGE clignote.` | Important |
| levels.ts | Fighter boss hint | `Touche proprement. Ne force pas l'échange.` | Court et bon — léger air de conseil de boxe | `Touche proprement. Évite le contre.` | Mineur |
| levels.ts | OutRun normal hint | `Change de voie avec douceur et garde l'axe.` | "garde l'axe" est jargon conduite — peu clair mobile | `Change de voie et passe chaque balise.` | Important |
| levels.ts | Shinobi normal hint | `Repère la vraie cible parmi les leurres avant d'avancer.` | Trop long pour 2 lignes mobile | `Repère la vraie cible. Ignore les leurres.` | Important |
| levels.ts | Shinobi boss hint | `Suis l'ombre qui trahit son mouvement.` | "qui trahit son mouvement" obscur — trahit quoi ? | `Suis l'ombre qui bouge. Ignore les fausses.` | Important |
| levels.ts | Kombat normal hint | `Les zones préviennent avant de frapper. Sors vite.` | "préviennent avant de frapper" doublon ("prévenient" = annoncent, mais c'est opaque) | `Les zones s'allument avant de frapper. Sors vite.` | Important |
| levels.ts | Kombat boss hint | `Attends l'ouverture, puis touche avant la fermeture.` | OK mais "la fermeture" impersonnel | `Attends l'ouverture. Frappe vite.` | Mineur |
| levels.ts | Paperboy normal hint | `Livre les bonnes maisons et garde une trajectoire propre.` | "trajectoire propre" = jargon pilotage, pas naturel | `Livre les bonnes maisons sans te crasher.` | Important |
| levels.ts | Paperboy boss hint | `Les pièges s'enchaînent. Survis avant de livrer.` | OK — court et direct | `Les pièges s'enchaînent. Survis avant de livrer.` ✓ | — |

---

### LevelIntroScene — textes codés en dur (`src/scenes/LevelIntroScene.ts`)

| Fichier | Contexte | Texte actuel | Problème | Proposition | Priorité |
|---|---|---|---|---|---|
| LevelIntroScene.ts:159 | Castle boss objectif panel | `Bats le miroir en 3 touches.` | "Bats le miroir" — on ne bat pas un miroir (on frappe / on touche) | `Touche le miroir 3 fois.` | Important |
| LevelIntroScene.ts:162 | Castle boss danger panel | `Évite les reflets maudits.` | Correct, arcade, court | `Évite les reflets maudits.` ✓ | — |
| LevelIntroScene.ts:163 | Castle normal danger panel | `Les murs brillent avant d'apparaître.` | OK mais redondant avec introHint | `Les murs brillent avant d'apparaître.` ✓ | — |
| LevelIntroScene.ts:199 | Non-Castle boss info | `PV BOSS : 3` | Mélange FR/EN sur une ligne fonctionnelle | `PV : 3` ou `VIE BOSS : 3` | Important |
| LevelIntroScene.ts:200 | Non-Castle normal info | `OBJECTIF : 10` | OK, court et clair | `OBJECTIF : 10` ✓ | — |
| LevelIntroScene.ts:267 | Bouton lancement | `JOUER` | OK — court et direct | `JOUER` ✓ | — |
| LevelIntroScene.ts:281 | Bouton retour carte | `CARTE` | OK | `CARTE` ✓ | — |

---

### ClearScene (`src/scenes/ClearScene.ts`)

| Fichier | Contexte | Texte actuel | Problème | Proposition | Priorité |
|---|---|---|---|---|---|
| ClearScene.ts:94 | Titre de victoire stage | `STAGE CLEAR` | Anglais brut — tous les autres textes sont français | `NIVEAU RÉUSSI` ou `STAGE CLEAR` (si on assume arcade anglais) | Critique |
| ClearScene.ts:94 | Titre de victoire boss | `BOSS CLEAR` | Idem — anglais dans interface française | `BOSS VAINCU` ou `BOSS CLEAR` (cohérence anglais/FR à décider) | Critique |
| ClearScene.ts:97 | Sous-titre Castle normal clear | `Castle Boss débloqué` | Mélange casse (minuscule/majuscule) + nom anglais "Boss" sans guillemets | `Boss du Château débloqué` ou `BOSS CASTLE DÉBLOQUÉ` | Important |
| ClearScene.ts:99 | Sous-titre Castle boss clear | `Monde 1 terminé` | Casse inconsistante (minuscule), alors que les autres textes sont en caps | `MONDE 1 TERMINÉ` | Important |
| ClearScene.ts:151 | Badge boss non-Castle | `BOSS VAINCU !` | Correct et percutant | `BOSS VAINCU !` ✓ | — |
| ClearScene.ts:182 | Bouton next Castle | `CONTINUER` | OK — ton correct | `CONTINUER` ✓ | — |
| ClearScene.ts:182 | Bouton next non-Castle | `SUIVANT` | OK | `SUIVANT` ✓ | — |
| ClearScene.ts:199 | Message fin de jeu | `TOUS LES NIVEAUX\nTERMINÉS !` | "Niveaux" confond avec les 16 niveaux — le joueur finit 8 mondes | `TOUS LES MONDES\nTERMINÉS !` | Important |

---

### GameOverScene (`src/scenes/GameOverScene.ts`)

| Fichier | Contexte | Texte actuel | Problème | Proposition | Priorité |
|---|---|---|---|---|---|
| GameOverScene.ts:70 | Titre défaite | `PERDU` | Court, arcade, OK — mais peut manquer de punch | `PERDU` ✓ ou `GAME OVER` si cohérence anglais | Mineur |
| GameOverScene.ts:81 | Sous-titre Castle | `L'illusion t'a piégé` | Apostrophe curieuse (`t'a` = tutoiement) — acceptable arcade mais maladroit mobile | `Pris dans l'illusion` | Important |
| GameOverScene.ts:81 | Sous-titre non-Castle | `REJOUE` | Confusion : ce mot est aussi le label du bouton `REJOUER`. Doublon visuel gênant | `ENCORE UNE FOIS` ou supprimer | Important |
| GameOverScene.ts:107 | Bouton retry | `REJOUER` | OK — impératif court | `REJOUER` ✓ | — |
| GameOverScene.ts:132 | Bouton carte | `CARTE` | OK | `CARTE` ✓ | — |

---

### WorldMapScene (`src/scenes/WorldMapScene.ts`)

| Fichier | Contexte | Texte actuel | Problème | Proposition | Priorité |
|---|---|---|---|---|---|
| WorldMapScene.ts:288 | Footer idle (aucun noeud sélectionné) | `CHOISIS UN NIVEAU` | OK mais un peu scolaire | `SÉLECTIONNE UN NIVEAU` ou `CHOISIS UN NIVEAU` ✓ | Mineur |
| WorldMapScene.ts:379 | Footer noeud verrouillé | `VERROUILLÉ` | Court et clair | `VERROUILLÉ` ✓ | — |
| WorldMapScene.ts:376 | Footer noeud débloqué | `[NOM] - NIVEAU` ou `[NOM] - BOSS` | Tiret simple — préférer em-dash ou `·` pour lisibilité | `[NOM] · NIVEAU` ou `[NOM] · BOSS` | Mineur |

---

### TitleScene (`src/scenes/TitleScene.ts`)

| Fichier | Contexte | Texte actuel | Problème | Proposition | Priorité |
|---|---|---|---|---|---|
| TitleScene.ts:99 | Stats titre | `8 MONDES · 16 NIVEAUX\n8 BOSS À DÉBLOQUER` | Correct et informatif | `8 MONDES · 16 NIVEAUX\n8 BOSS À DÉBLOQUER` ✓ | — |
| TitleScene.ts:118 | CTA tap | `TOUCHER POUR JOUER` | Légèrement littéral — "toucher" = infinitif impersonnel (correct sur iOS mais sonne robotique) | `APPUYER POUR JOUER` ou `TAPE POUR JOUER` | Mineur |
| TitleScene.ts:135 | Footer build marker | `PROTOTYPE BUILD` | Anglais — texte technique visible joueur | `BUILD PROTOTYPE` ou supprimer en prod | Mineur |

---

### HUD — mécaniques normales (src/mechanics/)

| Fichier | Contexte | Texte actuel | Problème | Proposition | Priorité |
|---|---|---|---|---|---|
| CastleIllusionMechanic.ts:88 | État mur actif | `DANGER` | Court, efficace | `DANGER` ✓ | — |
| CastleIllusionMechanic.ts:89 | État mur warning | `ATTENTION` | OK | `ATTENTION` ✓ | — |
| CastleIllusionMechanic.ts:90 | État calme | `MURS FANTÔMES` | Décrit l'objet pas l'action — peu informatif | `MURS CACHÉS` | Mineur |
| FighterChargeMechanic.ts:67 | Charge disponible | `CHARGE PRÊTE !` | OK — direct et arcade | `CHARGE PRÊTE !` ✓ | — |
| KombatFatalMechanic.ts:58 | HUD Kombat | `ZONES FATALES` | OK — cohérent avec ruleText | `ZONES FATALES` ✓ | — |
| OutRunLaneMechanic.ts:93 | HUD OutRun | `PASSE LES BALISES` | Impératif OK, mais "passe" peut signifier dépasser ou traverser — ambigu | `FRANCHIS LES BALISES` | Mineur |
| ShinobiFocusMechanic.ts:62 | HUD Shinobi | `VRAIE CIBLE` | OK — cohérent avec ruleText | `VRAIE CIBLE` ✓ | — |
| StreetsCrowdMechanic.ts:66 | HUD Streets | `FOULE MOBILE` | OK | `FOULE MOBILE` ✓ | — |
| SonicRingsMechanic.ts:80 | HUD Sonic | `ANNEAU 1/3` | Correct mais inconsistant avec ruleText `CHAÎNE ANNEAUX` | `ANNEAU 1/3` ✓ (corriger ruleText plutôt) | Mineur |
| PaperboyDeliveryMechanic.ts:86 | HUD Paperboy avec journal | `LIVRER !` | Infinitif tronqué comme exclamation — "Livrer" n'est pas un impératif | `LIVRE !` | Important |
| PaperboyDeliveryMechanic.ts:86 | HUD Paperboy sans journal | `PRENDS LE JOURNAL` | Trop long pour HUD — 4 mots | `PRENDS LE JOURNAL` ✓ ou `RAMASSE !` | Mineur |

---

### HUD — boss (`src/mechanics/bosses/`)

| Fichier | Contexte | Texte actuel | Problème | Proposition | Priorité |
|---|---|---|---|---|---|
| BaseBoss.ts:53 | HUD boss HP par défaut | `` PV ♥♥♡ `` | OK — visuel et lisible | `` PV ♥♥♡ `` ✓ | — |
| WitchMirrorBoss.ts:104 | Phase warning | `ATTENTION` | OK | `ATTENTION` ✓ | — |
| WitchMirrorBoss.ts:105 | Phase attaque | `DANGER` | OK | `DANGER` ✓ | — |
| WitchMirrorBoss.ts:106 | Phase vulnérable | `FRAPPE` | Court, arcade, correct | `FRAPPE` ✓ | — |
| WitchMirrorBoss.ts:107 | Phase touchée | `TOUCHÉ` | OK — mais peut manquer de punch | `TOUCHÉ !` | Mineur |
| WitchMirrorBoss.ts:108 | Phase par défaut | `BOSS HP` | Anglais brut — fallback visible joueur | `PV BOSS` | Critique |
| LoopSerpentBoss.ts:79 | HUD Sonic boss | `FRAPPE` | OK | `FRAPPE` ✓ | — |
| CrimeLordBoss.ts:95 | Phase vulnérable | `FENÊTRE` | Opaque sans contexte (fenêtre = ouverture temporelle ?) | `ATTAQUE !` | Important |
| CrimeLordBoss.ts:95 | Phase danger | `DANGER` | OK | `DANGER` ✓ | — |
| FinalChallengerBoss.ts:83 | Fenêtre d'attaque | `FRAPPE` | OK | `FRAPPE` ✓ | — |
| FinalChallengerBoss.ts:84 | Phase contre | `ÉVITE` | OK — court | `ÉVITE` ✓ | — |
| DragonGateBoss.ts:87 | Phase ouverture | `ATTENTION` | OK | `ATTENTION` ✓ | — |
| DragonGateBoss.ts:88 | Phase ouverte | `FENÊTRE` | Même problème que CrimeLord — opaque | `ATTAQUE !` | Important |
| DragonGateBoss.ts:89 | Phase danger | `DANGER` | OK | `DANGER` ✓ | — |
| ShadowNinjaBoss.ts:79 | Phase révélée | `FRAPPE` | OK | `FRAPPE` ✓ | — |
| ShadowNinjaBoss.ts:79 | Phase cachée | `OBSERVE` | OK — impératif court | `OBSERVE` ✓ | — |
| TurboRivalBoss.ts:83 | Phase turbo visible | `TURBO → FRAPPE` | Flèche symbole + mélange — difficile à lire sur mobile | `FRAPPE TURBO !` ou `MAINTENANT !` | Important |
| TurboRivalBoss.ts:84 | Phase attente | `ÉVITE` | OK | `ÉVITE` ✓ | — |
| NeighborhoodChaosBoss.ts:108 | Avec journal | `LIVRE` | Impératif court OK — cohérent | `LIVRE !` | Mineur |
| NeighborhoodChaosBoss.ts:109 | Compteur vague | `VAGUE 1/3` | OK — clair et court | `VAGUE 1/3` ✓ | — |

---

## Récapitulatif par priorité

### Critique (texte coupé / incompréhensible / anglais brut fonctionnel)

| # | Fichier | Texte actuel | Proposition |
|---|---|---|---|
| C1 | levels.ts | `STAGE 1` (ruleText) | `NIVEAU 1` |
| C2 | ClearScene.ts | `STAGE CLEAR` | `NIVEAU RÉUSSI` |
| C3 | ClearScene.ts | `BOSS CLEAR` | `BOSS VAINCU` |
| C4 | WitchMirrorBoss.ts | `BOSS HP` | `PV BOSS` |

### Important (texte maladroit, trop long ou incohérent)

| # | Fichier | Texte actuel | Proposition |
|---|---|---|---|
| I1 | levels.ts | `Miroir Sorcière` (nom niveau) | `La Sorcière au Miroir` |
| I2 | levels.ts | `CHAÎNE ANNEAUX` (ruleText) | `EN CHAÎNE` |
| I3 | levels.ts | `Collecte 10 éclats. Les murs brillent...Attends la voie libre.` | Supprimer 3e phrase |
| I4 | levels.ts | `Lis les déplacements avant de foncer dans la rue.` | `Attends un couloir libre, puis fonce.` |
| I5 | levels.ts | `Garde la direction, puis prends la cible quand l'élan est prêt.` | `Garde le cap. Frappe quand CHARGE clignote.` |
| I6 | levels.ts | `Change de voie avec douceur et garde l'axe.` | `Change de voie et passe chaque balise.` |
| I7 | levels.ts | `Repère la vraie cible parmi les leurres avant d'avancer.` | `Repère la vraie cible. Ignore les leurres.` |
| I8 | levels.ts | `Suis l'ombre qui trahit son mouvement.` | `Suis l'ombre qui bouge. Ignore les fausses.` |
| I9 | levels.ts | `Les zones préviennent avant de frapper. Sors vite.` | `Les zones s'allument avant de frapper. Sors vite.` |
| I10 | LevelIntroScene.ts | `Bats le miroir en 3 touches.` | `Touche le miroir 3 fois.` |
| I11 | LevelIntroScene.ts | `PV BOSS : 3` | `PV : 3` |
| I12 | ClearScene.ts | `TOUS LES NIVEAUX\nTERMINÉS !` | `TOUS LES MONDES\nTERMINÉS !` |
| I13 | ClearScene.ts | `Castle Boss débloqué` | `BOSS DU CHÂTEAU DÉBLOQUÉ` |
| I14 | ClearScene.ts | `Monde 1 terminé` | `MONDE 1 TERMINÉ` |
| I15 | GameOverScene.ts | `L'illusion t'a piégé` | `Pris dans l'illusion` |
| I16 | GameOverScene.ts | `REJOUE` (sous-titre) | `ENCORE UNE FOIS` ou supprimer |
| I17 | PaperboyDeliveryMechanic.ts | `LIVRER !` | `LIVRE !` |
| I18 | CrimeLordBoss.ts | `FENÊTRE` (phase vulnérable) | `ATTAQUE !` |
| I19 | DragonGateBoss.ts | `FENÊTRE` (phase ouverte) | `ATTAQUE !` |
| I20 | TurboRivalBoss.ts | `TURBO → FRAPPE` | `FRAPPE MAINTENANT !` |

### Mineur (polish, cohérence, casse)

| # | Fichier | Texte actuel | Proposition |
|---|---|---|---|
| M1 | levels.ts | `Dojo des Neiges` (doublon Dojo) | `Temple des Neiges` |
| M2 | levels.ts | `Challenger Final` | `Ultime Challenger` |
| M3 | levels.ts | `PRESSION` (ruleText Streets boss) | `ÉTAU` |
| M4 | levels.ts | `FENÊTRE` (ruleText Kombat boss) | `FENÊTRE D'ATTAQUE` |
| M5 | levels.ts | `Touche proprement. Ne force pas l'échange.` | `Touche proprement. Évite le contre.` |
| M6 | levels.ts | `Attends l'ouverture, puis touche avant la fermeture.` | `Attends l'ouverture. Frappe vite.` |
| M7 | levels.ts | `Livre les bonnes maisons et garde une trajectoire propre.` | `Livre les bonnes maisons sans te crasher.` |
| M8 | CastleIllusionMechanic.ts | `MURS FANTÔMES` | `MURS CACHÉS` |
| M9 | OutRunLaneMechanic.ts | `PASSE LES BALISES` | `FRANCHIS LES BALISES` |
| M10 | WitchMirrorBoss.ts | `TOUCHÉ` | `TOUCHÉ !` |
| M11 | WorldMapScene.ts | `[NOM] - NIVEAU` | `[NOM] · NIVEAU` |
| M12 | TitleScene.ts | `TOUCHER POUR JOUER` | `APPUYER POUR JOUER` |
| M13 | TitleScene.ts | `PROTOTYPE BUILD` | Supprimer en production |

---

## Fichiers impactés (audit uniquement — aucune modification dans ce patch)

- `src/config/levels.ts` — noms de niveaux, ruleText, introHint
- `src/scenes/LevelIntroScene.ts` — objectiveText, dangerText, infoStr
- `src/scenes/ClearScene.ts` — title, subTitle, fin de jeu, boutons
- `src/scenes/GameOverScene.ts` — titre, sous-titre
- `src/scenes/TitleScene.ts` — CTA, stats
- `src/scenes/WorldMapScene.ts` — footer idle, footer node
- `src/mechanics/CastleIllusionMechanic.ts` — getHudExtra
- `src/mechanics/PaperboyDeliveryMechanic.ts` — getHudExtra
- `src/mechanics/OutRunLaneMechanic.ts` — getHudExtra
- `src/mechanics/bosses/WitchMirrorBoss.ts` — getHudExtra
- `src/mechanics/bosses/CrimeLordBoss.ts` — getHudExtra
- `src/mechanics/bosses/DragonGateBoss.ts` — getHudExtra
- `src/mechanics/bosses/TurboRivalBoss.ts` — getHudExtra

---

## Recommandation

Ouvrir **PATCH 1018B — French Copy Harmonization Pass** pour appliquer les corrections classées Critique et Important dans l'ordre de priorité.

Ordre suggéré :
1. Critique C1–C4 (anglais bruts dans UI fonctionnelle)
2. Important I12–I16 (ClearScene / GameOverScene — visibles à chaque session)
3. Important I1–I11 (levels.ts — visibles à chaque intro de niveau)
4. Important I17–I20 (HUD boss — visibles en combat)
5. Mineur M1–M13 (polish)
