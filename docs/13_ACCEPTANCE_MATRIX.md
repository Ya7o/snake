# 13 — Acceptance Matrix

Mis à jour au 2026-06-01 — source : audits PATCH 1110/1111/1112 + vérification code.

## Statuts

- `OK` : conforme et vérifié (code ou test).
- `PARTIAL` : présent mais incomplet ou fallback procédural.
- `FAIL` : absent ou cassé.
- `NOT TESTED` : non validé en runtime.

## Matrice globale

| Domaine | Critère | Statut | Notes |
|---|---|---:|---|
| Build | `npm run check` passe | **OK** | 0 erreur, 61 modules, PATCH 1117 |
| Web mobile | `npm run dev` accessible sur téléphone via Wi-Fi | NOT TESTED | |
| Architecture | Scènes séparées | **OK** | 7 scènes indépendantes |
| Architecture | Core Snake séparé du rendu | **OK** | src/core/ vs src/render/ |
| Architecture | Mécaniques séparées par univers | **OK** | MechanicFactory + BaseMechanic |
| UX | TitleScene fonctionnelle | **OK** (code) | Tap/keydown → WorldMap ; "PROTOTYPE BUILD" supprimé (PATCH 1116) |
| UX | WorldMapScene fonctionnelle | **OK** (code) | Tap sélectionne, retap lance ; pas de bouton JOUER |
| UX | LevelIntroScene — BEST affiché | **OK** (code) | `SaveSystem.getBestScore()` |
| UX | LevelIntroScene — boutons JOUER + CARTE | **OK** (code) | Tap-anywhere debounce 500ms (PATCH 1116) |
| UX | ClearScene — titre | **OK** (code) | "NIVEAU RÉUSSI" corrigé (PATCH 1116) |
| UX | ClearScene — breakdown score | **OK** (code) | STAGE +500 / VAINCU +1000 visibles (PATCH 1116) |
| UX | ClearScene — boutons CONTINUER / REJOUER / CARTE | **OK** (code) | |
| UX | GameOverScene — texte univers | **OK** (code) | FATALITY, CRASH !, K.O. !, etc. (PATCH 1116) |
| UX | GameOverScene — boutons REJOUER + CARTE | **OK** (code) | |
| Score | Capsule score in-game séparée HP/progression | **OK** (code) | HUD 4 capsules |
| Score | Popup +100 pickup | **OK** (code) | `spawnScorePopup` |
| Score | Popup +250 boss hit | **OK** (code) | `resolveBossWeakPoint` |
| Score | Best score persisté localStorage | **OK** (code) | `snakeDriveV4.bestScores` |
| Score | Reset score au replay | **OK** (code) | `runtimeScore = 0` dans `create()` |
| Input | Swipe gameplay | NOT TESTED | InputSystem.ts wired |
| Input | Clavier desktop fallback | NOT TESTED | |
| Input | Map drag | NOT TESTED | |
| Input | Map pinch zoom | NOT TESTED | |
| Gameplay | Snake avance à timestep fixe | **OK** (code) | Accumulator pattern |
| Gameplay | Collision mur + corps | **OK** (code) | `stepSnake()` |
| Gameplay | Pickup spawn safe | **OK** (code) | `spawnPickup()` évite snake + walls |
| Gameplay | Paperboy vitesse acceptable | **OK** (code) | 110→145ms (PATCH 1117) |
| Gameplay | Sonic anneaux inactifs lisibles | **OK** (code) | `0x5d4e00`→`0x4a4a7a` (PATCH 1117) |
| Boss | HP affiché dans capsule progress | **OK** (code) | `HP hp/maxHp` |
| Boss | Centre HUD = ruleText (plus de ♥♡) | **OK** (code) | `getHudExtra()` retourne `''` (PATCH 1117) |
| Save | Progression unlockedNodes / clearedLevels | **OK** (code) | `snakeDriveV4_save` localStorage |
| Design | "PROTOTYPE BUILD" supprimé | **OK** | PATCH 1116 |
| Design | Cadres gameplay chargés | PARTIAL | Assets présents, rendu visuel non testé en runtime |
| Design | Pickups visibles vs obstacles | PARTIAL | Audit 1112 : PNG 64×64, LINEAR filter OK, contenu illustré à valider |
| Audio | Audio ne bloque pas le jeu | NOT TESTED | AudioSystem.ts wired |

## Matrice univers

| Univers | Normal jouable | Mécanique distincte | Boss jouable | Mécanique boss | Design identifiable | Notes |
|---|---:|---:|---:|---:|---:|---|
| Castle | OK (code) | OK — blinkWall / OpenMoji | OK (code) | OK — WitchMirror phases | OK — OpenMoji SVG crisp | |
| Sonic | OK (code) | OK — ringChains | OK (code) | OK — loopSerpent | PARTIAL — inactifs corrigés 1117 | |
| Streets | OK (code) | OK — crowdBlockers | OK (code) | OK — crimeLord | NOT TESTED runtime | |
| Fighter | OK (code) | OK — chargeMove | OK (code) | OK — finalChallenger 3 manches | NOT TESTED runtime | |
| OutRun | OK (code) | OK — laneDrift | OK (code) | OK — turboRival | NOT TESTED runtime | |
| Shinobi | OK (code) | OK — focusMode (real/decoy) | OK (code) | OK — shadowNinja | PARTIAL — PNG distinction à valider | |
| Kombat | OK (code) | OK — fatalZones (PATCH 1115b) | OK (code) | OK — dragonGate | NOT TESTED runtime | |
| Paperboy | OK (code) | OK — deliveryTargets (vitesse corrigée 1117) | OK (code) | OK — neighborhoodChaos | NOT TESTED runtime | |

## Critères de release

- [x] `npm run check` = OK
- [x] `DEV_UNLOCK_ALL = false`
- [x] Toutes corrections P1 appliquées (PATCH 1116 + 1117)
- [ ] Play-test mobile physique (Paperboy, Shinobi, boss timing)
- [ ] Validation visuelle runtime PNG assets (PATCH 1112 VIS-04)
