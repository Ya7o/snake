# PATCH 1018B — French Copy Harmonization Pass

## Objectif

Harmoniser les textes français visibles joueur : noms de niveaux, ruleText, introHint, textes Clear / GameOver, HUD boss et HUD mécaniques normales.

Basé sur l'audit PATCH 1017B. Aucune modification gameplay, audio, asset ou background.

---

## Principes de ton

- Court
- Naturel
- Arcade
- Lisible mobile
- Cohérent entre univers
- Pas de texte explicatif lourd dans le HUD
- Impératif ou substantif, jamais de formulation passive
- Pas de mélange anglais/français sur une même ligne fonctionnelle

---

## Changements

| Fichier | Contexte | Ancien texte | Nouveau texte | Raison |
|---|---|---|---|---|
| `src/config/levels.ts` | castle_normal ruleText | `STAGE 1` | `NIVEAU 1` | C1 — Anglais brut dans interface française |
| `src/config/levels.ts` | castle_boss name | `Miroir Sorcière` | `La Sorcière au Miroir` | I1 — Nom incomplet, peu naturel |
| `src/config/levels.ts` | castle_normal introHint | `Collecte 10 éclats. Les murs brillent avant d'apparaître. Attends la voie libre.` | `Collecte 10 éclats. Les murs brillent avant d'apparaître.` | I3 — Trop long pour HUD mobile (3 phrases) |
| `src/config/levels.ts` | sonic_normal ruleText | `CHAÎNE ANNEAUX` | `EN CHAÎNE` | I2 — Juxtaposition sans lien grammatical |
| `src/config/levels.ts` | sonic_normal introHint | `Ramasse les anneaux dans l'ordre et garde le rythme.` | `Ramasse les anneaux en ordre. Ne casse pas la chaîne.` | Mineur — "garde le rythme" flou |
| `src/config/levels.ts` | streets_normal introHint | `Lis les déplacements avant de foncer dans la rue.` | `Attends un couloir libre, puis fonce.` | I4 — "Lis les déplacements" très maladroit |
| `src/config/levels.ts` | streets_boss ruleText | `PRESSION` | `ÉTAU` | M3 — Vague, ne dit pas l'action |
| `src/config/levels.ts` | fighter_normal introHint | `Garde la direction, puis prends la cible quand l'élan est prêt.` | `Garde le cap. Frappe quand CHARGE clignote.` | I5 — "l'élan est prêt" bizarre et long |
| `src/config/levels.ts` | fighter_boss name | `Challenger Final` | `Ultime Challenger` | M2 — Anglicisme dans contexte francophone |
| `src/config/levels.ts` | fighter_boss introHint | `Touche proprement. Ne force pas l'échange.` | `Touche proprement. Évite le contre.` | M5 — Polish, plus arcade |
| `src/config/levels.ts` | outrun_normal introHint | `Change de voie avec douceur et garde l'axe.` | `Change de voie et passe chaque balise.` | I6 — "garde l'axe" jargon conduite, peu clair |
| `src/config/levels.ts` | shinobi_normal name | `Dojo des Neiges` | `Temple des Neiges` | M1 — Doublon "Dojo" avec Fighter normal |
| `src/config/levels.ts` | shinobi_normal introHint | `Repère la vraie cible parmi les leurres avant d'avancer.` | `Repère la vraie cible. Ignore les leurres.` | I7 — Trop long pour 2 lignes mobile |
| `src/config/levels.ts` | shinobi_boss introHint | `Suis l'ombre qui trahit son mouvement.` | `Suis l'ombre qui bouge. Ignore les fausses.` | I8 — "trahit son mouvement" obscur |
| `src/config/levels.ts` | kombat_normal introHint | `Les zones préviennent avant de frapper. Sors vite.` | `Les zones s'allument avant de frapper. Sors vite.` | I9 — "préviennent" ambigu / opaque |
| `src/config/levels.ts` | kombat_boss ruleText | `FENÊTRE` | `FENÊTRE D'ATTAQUE` | M4 — Court mais opaque sans contexte |
| `src/config/levels.ts` | kombat_boss introHint | `Attends l'ouverture, puis touche avant la fermeture.` | `Attends l'ouverture. Frappe vite.` | M6 — "la fermeture" impersonnel |
| `src/config/levels.ts` | paperboy_normal introHint | `Livre les bonnes maisons et garde une trajectoire propre.` | `Livre les bonnes maisons sans te crasher.` | M7 — "trajectoire propre" jargon pilotage |
| `src/scenes/LevelIntroScene.ts` | Castle boss objectiveText | `Bats le miroir en ${bossHp} touches.` | `Touche le miroir ${bossHp} fois.` | I10 — "Bats le miroir" incohérent (on ne bat pas un miroir) |
| `src/scenes/LevelIntroScene.ts` | Non-Castle boss infoStr | `PV BOSS : ${bossHp}` | `PV : ${bossHp}` | I11 — Mélange FR/EN sur ligne fonctionnelle |
| `src/scenes/ClearScene.ts` | Titre victoire stage | `STAGE CLEAR` | `NIVEAU RÉUSSI` | C2 — Anglais brut dans interface française |
| `src/scenes/ClearScene.ts` | Titre victoire boss | `BOSS CLEAR` | `BOSS VAINCU` | C3 — Anglais brut dans interface française |
| `src/scenes/ClearScene.ts` | Sous-titre castle_normal | `Castle Boss débloqué` | `BOSS DU CHÂTEAU DÉBLOQUÉ` | I13 — Casse incohérente, mélange anglais |
| `src/scenes/ClearScene.ts` | Sous-titre castle_boss | `Monde 1 terminé` | `MONDE 1 TERMINÉ` | I14 — Casse incohérente (minuscule vs caps) |
| `src/scenes/ClearScene.ts` | Message fin de jeu | `TOUS LES NIVEAUX\nTERMINÉS !` | `TOUS LES MONDES\nTERMINÉS !` | I12 — "Niveaux" confond avec les 16 niveaux |
| `src/scenes/GameOverScene.ts` | Sous-titre Castle | `L'illusion t'a piégé` | `Pris dans l'illusion` | I15 — Tutoiement maladroit, style trop littéraire |
| `src/scenes/GameOverScene.ts` | Sous-titre non-Castle | `REJOUE` | `ENCORE UNE FOIS` | I16 — Doublon visuel avec bouton "REJOUER" |
| `src/scenes/TitleScene.ts` | CTA tap | `TOUCHER POUR JOUER` | `APPUYER POUR JOUER` | M12 — "Toucher" infinitif impersonnel, sonne robotique |
| `src/scenes/WorldMapScene.ts` | Footer nœud débloqué | `[NOM] - NIVEAU` / `[NOM] - BOSS` | `[NOM] · NIVEAU` / `[NOM] · BOSS` | M11 — Séparateur plus lisible |
| `src/mechanics/bosses/WitchMirrorBoss.ts` | Phase par défaut HUD | `BOSS HP` | `PV BOSS` | C4 — Anglais brut dans fallback visible joueur |
| `src/mechanics/bosses/WitchMirrorBoss.ts` | Phase touchée HUD | `TOUCHÉ` | `TOUCHÉ !` | M10 — Manque de punch, cohérence exclamation |
| `src/mechanics/bosses/CrimeLordBoss.ts` | Phase vulnérable HUD | `FENÊTRE` | `ATTAQUE !` | I18 — Opaque sans contexte |
| `src/mechanics/bosses/DragonGateBoss.ts` | Phase ouverte HUD | `FENÊTRE` | `ATTAQUE !` | I19 — Même problème que CrimeLord |
| `src/mechanics/bosses/TurboRivalBoss.ts` | Phase turbo HUD | `TURBO → FRAPPE` | `FRAPPE MAINTENANT !` | I20 — Flèche symbole + mélange, difficile à lire mobile |
| `src/mechanics/CastleIllusionMechanic.ts` | État calme HUD | `MURS FANTÔMES` | `MURS CACHÉS` | M8 — "Fantômes" décrit l'objet, pas l'action |
| `src/mechanics/OutRunLaneMechanic.ts` | HUD OutRun | `PASSE LES BALISES` | `FRANCHIS LES BALISES` | M9 — "Passe" ambigu (traverser vs dépasser) |
| `src/mechanics/PaperboyDeliveryMechanic.ts` | HUD avec journal | `LIVRER !` | `LIVRE !` | I17 — Infinitif tronqué, pas un impératif |

---

## Textes non modifiés volontairement

| Fichier | Texte | Raison |
|---|---|---|
| `src/scenes/TitleScene.ts` | `PROTOTYPE BUILD` | Marqueur dev intentionnel — à supprimer avant release uniquement |
| `src/scenes/LevelIntroScene.ts` | `JOUER` / `CARTE` | Corrects et directs ✓ |
| `src/scenes/WorldMapScene.ts` | `CHOISIS UN NIVEAU` | Acceptable, non prioritaire |
| `src/scenes/WorldMapScene.ts` | `VERROUILLÉ` | Court et clair ✓ |
| `src/scenes/ClearScene.ts` | `BOSS VAINCU !` (badge) | Déjà correct et percutant ✓ |
| `src/scenes/ClearScene.ts` | `CONTINUER` / `SUIVANT` / `CARTE` | Corrects ✓ |
| `src/scenes/GameOverScene.ts` | `PERDU` | Court, arcade ✓ |
| `src/scenes/GameOverScene.ts` | `REJOUER` (bouton) | Impératif court ✓ |
| `src/mechanics/bosses/WitchMirrorBoss.ts` | `ATTENTION` / `DANGER` / `FRAPPE` | Corrects et arcades ✓ |
| `src/mechanics/bosses/LoopSerpentBoss.ts` | `FRAPPE` | Correct ✓ |
| `src/mechanics/bosses/FinalChallengerBoss.ts` | `FRAPPE` / `ÉVITE` | Corrects ✓ |
| `src/mechanics/bosses/ShadowNinjaBoss.ts` | `FRAPPE` / `OBSERVE` | Corrects ✓ |
| `src/mechanics/bosses/NeighborhoodChaosBoss.ts` | `LIVRE` / `VAGUE 1/3` | Corrects ✓ |
| `src/mechanics/PaperboyDeliveryMechanic.ts` | `PRENDS LE JOURNAL` | Acceptable ✓ |
| `src/config/levels.ts` | `sonic_boss` introHint `Anticipe ses virages…` | Correct ✓ |
| `src/config/levels.ts` | `streets_boss` introHint `Reste mobile…` | Correct ✓ |
| `src/config/levels.ts` | `outrun_boss` introHint `Choisis la bonne ligne…` | Correct ✓ |
| `src/config/levels.ts` | `paperboy_boss` introHint `Les pièges s'enchaînent…` | Court et direct ✓ |
| `src/config/levels.ts` | `kombat_normal` ruleText `ZONES FATALES` | Cohérent avec HUD ✓ |
| `src/config/levels.ts` | `shinobi_*` ruleText `VRAIE CIBLE` / `VRAIE OMBRE` | Cohérents ✓ |

---

## Risques

- Texte `FENÊTRE D'ATTAQUE` légèrement plus long que `FENÊTRE` — vérifié OK dans layout kombat_boss
- `BOSS DU CHÂTEAU DÉBLOQUÉ` plus long que `Castle Boss débloqué` — surveillé en ClearScene subtitleY
- `ENCORE UNE FOIS` plus long que `REJOUE` — la zone subtitle a du wordWrap, OK mobile
- `FRAPPE MAINTENANT !` plus long que `TURBO → FRAPPE` — HUD single-line, font réduite si besoin
- Cohérence titre `BOSS VAINCU` + badge `BOSS VAINCU !` : légère redondance pour boss non-Castle, acceptable (positionnements distincts)

---

## Critères d'acceptation

- [x] `npm run build` OK — 0 erreur TypeScript, 60 modules
- [x] Textes principaux plus naturels
- [x] Pas de texte coupé détecté dans les captures
- [x] Pas de texte hors écran
- [x] HUD boss reste court
- [x] Boutons restent lisibles
- [x] Aucun changement gameplay
- [x] Aucun changement asset
