# PATCH 997 — OutRun Template Application Audit

## Objectif
Auditer l'état réel d'OutRun et mesurer l'écart avec le template Castle.
Aucun changement de code dans ce patch.

---

## 1. État actuel d'OutRun

### Déclaration univers
OutRun est déclaré dans `src/config/universes.ts` :

```ts
outrun: {
  id: 'outrun',
  name: UNIVERSE_DISPLAY_NAMES.outrun,     // 'OUTRUN'
  shortName: 'OUTRUN',
  assetFolder: 'outrun',
  mechanicNormal: 'laneDrift',
  mechanicBoss: 'turboRival',
  palette: { bg: '#0a001a', primary: '#ff6b9d', secondary: '#c44569', accent: '#ffd32a' }
}
```

### Niveaux déclarés
2 niveaux dans `src/config/levels.ts` :

| ID | Type | Nom | Mécanique | Quota/Boss | speedMs | MapNode |
|---|---|---|---|---|---|---|
| `outrun_normal` | normal | Autoroute du Soleil | laneDrift | quota: 10 | 130 | node_9 |
| `outrun_boss` | boss | Rival Turbo | turboRival | bossHp: 3 | 140 | node_10 |

### Mécanique codée
`OutRunLaneMechanic` dans `src/mechanics/OutRunLaneMechanic.ts` :
- 3 voies (lanes) distribuées sur les colonnes de la grille
- Pickups = checkpoints positionnés dans une voie
- Obstacles = traffic (cellules létales par voie)
- Mécanique boss `turboRival` : non implémentée séparément (fallback générique)

Traitement spécial dans `GameScene.ts` :
- Line 42 : `outrun: 0.72` — opacité grille outrun
- Line 52 : `outrun: 0.08` — alpha fond outrun
- Lines 377–378 : pickup overridé depuis `OutRunLaneMechanic.getCheckpointPickup()`
- Line 452 : même override lors du spawn
- Line 480 : skip eat-mechanic si OutRunLaneMechanic

### Objectif normal
Collecter 10 checkpoints (balises de voie).

### Objectif boss
Vaincre Rival Turbo (bossHp: 3) — mécanique de dépassement de voie.

### Assets OutRun existants

**`public/assets/universes/outrun/` (db_ tier)**
- `pickup_01.png` ✓
- `pickup_02.png` ✓
- `obstacle_01.png` ✓
- `obstacle_02.png` ✓
- `boss.png` ✓
- `frame_tile.png` ✓
- `hud_panel.png` ✓
- `board_preview.png` ✓
- `theme_palette.json` ✓

**`public/assets/runtime/universes/outrun/` (rt_ tier)**
- `boss_turbo_rival.png` ✓
- `obstacle_car.png` ✓
- `pickup_checkpoint.png` ✓

**`public/assets/frames/outrun/`**
- `frame.png` ✓

**`public/assets/level-intros/outrun/`**
- `intro.png` ✓

**`public/assets/ui/title/`**
- `world_token_outrun.png` ✓

**`public/assets/openmoji/world/`**
- `outrun.svg` ✓

**`public/assets/openmoji/pickups/`**
- `turbo.svg` ✓ (icon potentiel pour checkpoint)

### Backgrounds OutRun
**Aucun.** Il n'existe pas de dossier `public/assets/ui/outrun/`.
Aucun `outrun_system_bg.png`, `outrun_gameplay_bg.png`, `outrun_game_over_bg.png`, `outrun_clear_bg.png`.

### Sons OutRun
Aucun son spécifique OutRun. Seuls les fichiers audio génériques existent :
- `collision_hit.wav`
- `danger_alert.wav`
- `pickup_magic.wav`
- `stage_clear.wav`
- `ui_button.wav`

### Icons/pickups OutRun
- `openmoji/pickups/turbo.svg` ✓ — utilisable comme icon checkpoint
- Pas de set OpenMoji dédié `openmoji/outrun/`

### Traitement spécial OutRun dans GameScene
OutRun reçoit un traitement partiel via `OutRunLaneMechanic` :
- Pickup et obstacles correctement gérés via instanceof checks
- **Pas de gameplay background** (seul castle charge `castle_gameplay_bg`)
- Couleur de grille : `colorBg` depuis palette (`#0a001a`) — pas de traitement spécifique
- HUD : path générique non-castle (affiche `OUTRUN` + `BALISES`)
- ClearScene : path générique non-castle
- GameOverScene : path générique non-castle
- LevelIntroScene : utilise `level-intros/outrun/intro.png` (correct)

### MenuTheme OutRun
Déclaré dans `src/config/menuThemes.ts` :
```ts
outrun: {
  colors: { primary: 0xFF4FC3, primaryHex: '#FF4FC3',
            secondary: 0x20E6FF, secondaryHex: '#20E6FF',
            panelBg: 0x080D20, panelAlpha: 0.88,
            textHex: '#FFF8E8' },
  fx: 'neon',
}
```
MenuTheme complet et adapté (magenta + cyan + neon).

---

## 2. Comparaison OutRun / Template Castle

| Élément template | Castle | OutRun actuel | État |
|---|---|---|---|
| `system_bg` | `castle_system_bg.png` | — | **manquant** |
| `gameplay_bg` | `castle_gameplay_bg.png` | — | **manquant** |
| `game_over_bg` | `castle_game_over_bg.png` | — | **manquant** |
| `clear_bg` | `castle_clear_bg.png` | — | **manquant** |
| Niveau normal | `castle_normal` | `outrun_normal` | OK |
| Niveau boss | `castle_boss` | `outrun_boss` | OK |
| Mécanique normale codée | `castleIllusion` | `laneDrift` ✓ | OK |
| Mécanique boss codée | `witchMirror` | `turboRival` (fallback) | **partiel** |
| HUD runtime | OUI (castle path) | OUI (generic path) | **partiel** |
| Board runtime | OUI (castle path) | OUI (generic path) | **partiel** |
| Grid runtime | OUI (couleur dédiée) | OUI (palette bg) | OK |
| Pickups (db_) | `pickup_01/02.png` | `pickup_01/02.png` ✓ | OK |
| Obstacles (db_) | `obstacle_01/02.png` | `obstacle_01/02.png` ✓ | OK |
| Boss (db_) | `boss.png` | `boss.png` ✓ | OK |
| Frame | `frames/castle/frame.png` | `frames/outrun/frame.png` ✓ | OK |
| Level intro | `level-intros/castle/intro.png` | `level-intros/outrun/intro.png` ✓ | OK |
| MenuTheme | OUI | OUI (`neon`) | OK |
| Universe config | OUI | OUI | OK |
| OpenMoji world icon | `castle.svg` | `outrun.svg` ✓ | OK |
| OpenMoji universe set | `openmoji/castle/` (5 SVGs) | — | **manquant** |
| Audio spécifique | `pickup_magic.wav` (générique) | — (générique) | **partiel** |
| Constant asset map | `CASTLE_RESULT_SCREEN_ASSETS` | — | **manquant** |
| GameScene bg binding | `uid === 'castle'` check | non branché | **manquant** |
| ClearScene bg | `isCastle` branching | path générique | **partiel** |
| GameOverScene bg | `isCastle` branching | path générique | **partiel** |
| LevelIntroScene bg | `isCastle` system_bg | `level-intros` intro | **partiel** |

**Résumé des manques critiques :**
1. Aucun des 4 backgrounds dédiés (`system_bg`, `gameplay_bg`, `game_over_bg`, `clear_bg`)
2. Aucune constante `OUTRUN_RESULT_SCREEN_ASSETS` dans `constants.ts`
3. Aucun binding dans GameScene, ClearScene, GameOverScene, LevelIntroScene
4. Aucun set OpenMoji `openmoji/outrun/`
5. Mécanique boss `turboRival` non différenciée du fallback générique

---

## 3. Pack OutRun cible

### Backgrounds à créer

```
public/assets/ui/outrun/outrun_system_bg.png
public/assets/ui/outrun/outrun_gameplay_bg.png
public/assets/ui/outrun/outrun_game_over_bg.png
public/assets/ui/outrun/outrun_clear_bg.png
```

### Règles visuelles OutRun

**Palette :**
- Ciel : dégradé sunset — orange vif en bas, magenta / violet en haut
- Sol : route en perspective
- Accents : lignes néon cyan / magenta
- Fond gameplay : centre peu détaillé, route lointaine, silhouettes palmes

**Éléments autorisés :**
- Sunset highway en perspective
- Silhouettes de palmiers (2D, minimalistes)
- Lignes de route stylisées
- Dégradé chrome / magenta / orange
- Dashboard stylisé comme motif de fond (non intrusif)

**Éléments interdits :**
- Voitures reconnaissables ou officielles
- Logos, marques
- Texte baked (`CHECKPOINT`, `FINISH`, `SPEED`, etc.)
- Boutons baked
- HUD baked
- Score baked
- Grille baked
- Personnage central dominant

**Règles par background :**

| Background | Ambiance | Lumière | Notes |
|---|---|---|---|
| `system_bg` | Menu / intro / briefing | Coucher de soleil vif | Peut avoir des détails latéraux |
| `gameplay_bg` | Fond calme pour la grille | Nuit bleue / crépuscule | Centre très dégagé, route lointaine |
| `game_over_bg` | Défaite sur route | Plus sombre, nuit | Moins de couleurs, plus de contraste bas |
| `clear_bg` | Victoire / arrivée | Sunset triomphal | Plus lumineux, dégradé chaud |

---

## 4. Gameplay OutRun cible

*(Documentation seulement — aucune modification de code)*

### Normal — `outrun_normal`
- **Objectif :** Passer 10 checkpoints (balises de voie)
- **Pickup principal :** checkpoint / balise de route (turbo icon)
- **Obstacle principal :** traffic car (véhicule en lane, léthal)
- **Feedback visuel :** glow de pickup sur la balise ; flash rouge sur collision traffic
- **Condition de clear :** 10 pickups collectés sans mort

### Boss — `outrun_boss`
- **Menace :** Rival Turbo — une cellule-rival qui se déplace sur les lanes et tente de couper la trajectoire
- **Boss HP :** 3 (actuel dans config)
- **Feedback :** clignotement du rival quand touché ; agressivité croissante à chaque HP perdu
- **Condition de victoire :** réduire boss HP à 0 en récupérant les pickups d'attaque tout en évitant le traffic
- **Note :** mécanique `turboRival` actuellement non différenciée — à implémenter dans PATCH 998

---

## 5. Risques

### Risques visuels
- **Surcharge du centre :** un sunset trop illustratif avec route + palmiers + soleil occupera le centre et gênera la grille. Le `gameplay_bg` doit être très contraint, route en perspective lointaine uniquement.
- **Palette trop lumineuse :** magenta saturé + cyan + orange simultanés risquent de masquer les pickups (qui sont aussi magenta/cyan). Prévoir un gameplay_bg désaturé ou assombri.
- **Faux texte baked :** les panneaux de route (CHECKPOINT, km, EXIT) sont des éléments naturels du thème OutRun — risque élevé d'apparaître si la génération d'image n'est pas explicitement contrainte.

### Risques IP / droits
- **Voitures reconnaissables :** Ferrari Testarossa, Countach, etc. sont associées au thème OutRun. Utiliser des silhouettes génériques de roadster ou aucune voiture visible.
- **Logo officiel :** le logo OutRun (Sega/M2) est protégé. Ne pas reproduire.

### Risques techniques
- **Exceptions sans template :** si OutRun reçoit un binding `uid === 'outrun'` sans constante unifiée, la dette sera la même que pour Castle avant PATCH 993. Il faut un `OUTRUN_RESULT_SCREEN_ASSETS` symétrique à `CASTLE_RESULT_SCREEN_ASSETS`.
- **Lisibilité grille :** avec palette `bg: '#0a001a'` (très sombre), la grille sera peu visible si le gameplay_bg est trop lumineux. Le `gameplay_bg` doit respecter la même contrainte de valeur sombre que Castle.
- **isCastle hard-coding :** ClearScene, GameOverScene et LevelIntroScene ont tous des branches `isCastle`. Ajouter OutRun sans refactoriser créera un `isOutRun` parallèle. À documenter comme dette acceptable pour PATCH 998 (un seul univers supplémentaire reste gérable).
- **turboRival non implémenté :** le boss OutRun tombe sur le fallback générique. La boucle boss OutRun est jouable mais sans identité propre. À implémenter en PATCH 998 ou plus tard.

---

## 6. Recommandation PATCH 998

### PATCH 998 — OutRun Runtime Template Binding

**Périmètre :**
- Créer les 4 backgrounds OutRun (`public/assets/ui/outrun/`)
- Ajouter `OUTRUN_RESULT_SCREEN_ASSETS` dans `src/config/constants.ts`
- Brancher GameScene : charger `outrun_gameplay_bg` pour `uid === 'outrun'`
- Brancher ClearScene : `isOutRun` → charger et afficher `outrun_clear_bg`
- Brancher GameOverScene : `isOutRun` → charger et afficher `outrun_game_over_bg`
- Brancher LevelIntroScene : `isOutRun` → utiliser `outrun_system_bg` en fond
- Créer set OpenMoji minimal `openmoji/outrun/` si nécessaire (ou mapper vers génériques existants)

**Hors périmètre PATCH 998 :**
- Mécanique `turboRival` (boss) — traiter en PATCH 999 si nécessaire
- Refactorisation `isCastle` / `isOutRun` en système générique — traiter séparément
- Sons spécifiques OutRun — traiter ultérieurement

**Gate avant PATCH 998 :**
- Backgrounds OutRun validés visuellement (centre calme, aucun texte baked)
- `npm run build` OK
- Boucle complète jouable : WorldMap → LevelIntro → GamePlay → Clear/GameOver → WorldMap

**Validation finale PATCH 998 :**
- `npm run build` sans erreur TypeScript
- Gameplay OutRun normal et boss jouables sur mobile portrait
- Backgrounds cohérents avec la palette `#0a001a / magenta / cyan`
- Aucun régression sur Castle

---

## Statut de l'audit

| Critère | État |
|---|---|
| OutRun déclaré comme univers | ✓ OK |
| 2 niveaux configurés | ✓ OK |
| Mécanique normale codée | ✓ OK |
| Assets db_ et rt_ présents | ✓ OK |
| Level intro présent | ✓ OK |
| MenuTheme présent | ✓ OK |
| 4 backgrounds dédiés | ✗ Manquants |
| Constante asset map | ✗ Manquante |
| Binding GameScene | ✗ Non branché |
| Binding ClearScene | ✗ Non branché |
| Binding GameOverScene | ✗ Non branché |
| Binding LevelIntroScene | ✗ Partiel (intro seulement) |
| OpenMoji universe set | ✗ Manquant |
| Mécanique boss différenciée | ✗ Fallback générique |

**Conclusion :** OutRun est structurellement solide (univers, niveaux, mécanique, assets db_/rt_) mais n'a pas encore reçu le traitement background/binding du template Castle. Il ne manque que les 4 backgrounds et leur câblage dans les scènes. C'est le candidat idéal pour le deuxième vertical slice.
