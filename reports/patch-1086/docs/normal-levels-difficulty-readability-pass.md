# Normal Levels — Difficulty & Readability Pass — PATCH 1086

## 1. Castle normal — Plus de murs fantômes

**Fichier :** `src/mechanics/CastleIllusionMechanic.ts`

| Paramètre | Avant | Après |
|---|---|---|
| `maxWalls` | 2 | 3 |
| `spawnIntervalTicks` | 20 | 16 |
| `safeTicks` | 8 | 8 |
| `warningTicks` | 8 | 8 |
| `activeTicks` | 4 | 4 |

Effet : un troisième mur peut être présent simultanément ; les murs arrivent plus souvent. La lisibilité du télégraphe (ghost→warning→active) est conservée.

---

## 2. Sonic normal — Boost de vitesse à la fin de la chaîne

**Fichier :** `src/mechanics/SonicRingsMechanic.ts`, `src/mechanics/BaseMechanic.ts`, `src/scenes/GameScene.ts`

- Ajout de `getSpeedMultiplier(): number` dans `BaseMechanic` (default 1.0).
- `SonicRingsMechanic` : quand les 4 anneaux sont collectés en ordre, active `boostTicksLeft = 20`.
- Pendant le boost : `getSpeedMultiplier()` retourne `0.55` (vitesse ×1/0.55 ≈ +82 % plus rapide).
- HUD extra : `TURBO !` pendant le boost, revient à `ANNEAU X/4` ensuite.
- `GameScene.update()` : utilise `effectiveSpeedMs = levelConfig.speedMs * mechanic.getSpeedMultiplier()`.

---

## 3. Streets normal — Attaque en ligne droite des combattants

**Fichier :** `src/mechanics/StreetsCrowdMechanic.ts`

- Nouveau système de charge : les blockers peuvent passer en état `warning → charging`.
- `warning` : 2 ticks de télégraphe ; les cellules de la trajectoire (2–5 cases) sont marquées en `danger`.
- `charging` : le blocker avance 1 cellule/tick dans une direction fixe pour 2–5 steps, puis disparaît.
- Charge déclenchée sur un blocker idle toutes les ~25 ticks.
- Max blockers : 4→5.
- `getExtraEntities()` : émet les cellules de trajectoire pendant `warning` comme entités `crowdBlocker/danger`.
- Couleurs ajoutées : `warning: 0xf39c12`, `charging: 0xe74c3c`, `danger: 0xc0392b` dans `ObstacleRenderer`.

---

## 4. Street Fighter normal — Icônes corrigées (sparZone)

**Fichiers :** `src/ui/OpenMojiIconRegistry.ts`, `src/data/openmojiIconRegistry.ts`, `src/scenes/GameScene.ts`

- Ajout de `FIGHTER_OPENMOJI_ICONS.sparZone` → `assets/openmoji/obstacles/fist.svg` (OpenMoji 1F44A).
- SVG copié depuis `design_boards/openemoji/color/svg/1F44A.svg`.
- `GameScene` : entity texture resolver pour `fighter` → sparZone utilise l'icône poing.
- Les logos Kombat ne s'affichent plus sur les zones de dojo Fighter.

---

## 5. OutRun normal — Icône checkpoint remplacée par trophée

**Fichiers :** `src/ui/OpenMojiIconRegistry.ts`, `src/data/openmojiIconRegistry.ts`, `src/scenes/GameScene.ts`

- Ajout de `OUTRUN_OPENMOJI_ICONS.checkpoint` → `assets/openmoji/pickups/trophy.svg` (OpenMoji 1F3C6).
- SVG copié depuis `design_boards/openemoji/color/svg/1F3C6.svg`.
- `GameScene` : pour OutRun, `pickupRenderer.setTextureKey(trophy)` remplace le pickup générique.

---

## 6. Shinobi normal — Décoys en orbite circulaire (shuriken)

**Fichier :** `src/mechanics/ShinobiFocusMechanic.ts`

- Chaque décoy a maintenant : `orbitCenter`, `orbitRadius` (2–3 cases), `orbitAngle`.
- `tick()` : `orbitAngle += π/12` (15°/tick → tour complet en ~24 ticks ≈ 3.8 s).
- Position recalculée par trigonométrie ; clampée aux bords de la grille.
- La vraie cible reste statique ; les décoys orbitent autour de leur point de spawn.
- Angles de départ échelonnés pour ne pas se superposer.

---

## 7. Mortal Kombat normal — Zones de lave multi-cellules (10–20 cases)

**Fichier :** `src/mechanics/KombatFatalMechanic.ts`

- `FatalZone` contient maintenant `cells: Cell[]` au lieu d'un seul `cell: Cell`.
- `spawnCluster(center, radius, cols, rows)` génère un cluster circulaire (~13 cellules à radius=2).
- Radius aléatoire 2.0–2.5 → zone de 12–20 cellules.
- Max zones simultanées : 4→2 (chaque zone est nettement plus grande).
- Warning ticks : 5→8 (plus de temps pour réagir à une grande zone).
- `getExtraEntities()` : un `ExtraEntity { type: 'fatalZone', state }` par cellule de chaque zone.
- `getDangerCells()` : toutes les cellules actives sont létales.

---

## 8. Paperboy normal — Icône journal et boucle clarifiée

**Fichiers :** `src/ui/OpenMojiIconRegistry.ts`, `src/scenes/GameScene.ts`

- Ajout de `PAPERBOY_OPENMOJI_ICONS.newspaper` → `assets/openmoji/pickups/newspaper.svg` (déjà présent).
- `GameScene` : pour Paperboy, `pickupRenderer.setTextureKey(newspaper)` remplace le pickup générique.
- Le journal 📰 est maintenant visuellement distinct des boîtes aux lettres 📫.
- HUD extra inchangé : `'PRENDS LE JOURNAL'` / `'LIVRE !'` — clair et suffisant.
- Route obstacles (cônes) : conservés, distinctifs des deux icônes principales.

---

## Risques

- **Sonic boost** : la vitesse ×1.82 peut surprendre le joueur la première fois. Risque acceptable — c'est le reward d'une chaîne complète.
- **Shinobi décoys** : si une décoy se positionne exactement sur la vraie cible (orbite), le joueur pourrait confondre. Probabilité faible avec les angles échelonnés.
- **Kombat multi-cell** : si le cluster spawne proche du serpent, le joueur peut ne pas avoir le temps de réagir même avec 8 ticks de warning. Acceptable pour PATCH 1086 — ajustable au PATCH 1088 si QA confirme.
- **Streets charge** : les cellules de trajectoire en état `danger` sont légales (pas de hit immédiat pendant warning). Le joueur voit les cases orange avant la charge.
