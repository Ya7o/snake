# Full Visual Quality Audit — PATCH 1092

## Objectif

Auditer la qualité visuelle globale du jeu : blur, pixel smoothing, scale, stretch, style mismatch et lisibilité. Couvrir les 8 univers, les 8 boss, et tous les écrans système.

---

## Méthode

- **Viewport** : 390×844 CSS px (iPhone standard portrait), deviceScaleFactor = 2 (1x physique = 780×1688)
- **URL** : `http://localhost:5173/snake/?unlockAll=1`
- **Mode** : headless Chromium via Playwright (WSL)
- **Univers testés** : Castle, Sonic, Streets, Fighter, OutRun, Shinobi, Kombat, Paperboy
- **Scènes testées** : TitleScene, WorldMapScene, LevelIntroScene, GameScene (16 niveaux), ClearScene, GameOverScene
- **Captures** : plein écran + crops par PIL depuis les fichiers existants
- **Limites** :
  - Rendu headless ≈ rendu desktop Chrome, pas un vrai device Android
  - Le snake bouge et peut mourir avant certaines captures (certains crops ont capturé l'écran de GameOver au lieu du gameplay)
  - La scène Shinobi boss a rendu une capture entièrement noire (timing ou chargement d'assets)
  - Audit audio non couvert

---

## Synthèse globale

| Zone | Statut | Problème principal | Priorité |
|---|---|---|---|
| Title Screen | ✅ Correct | Aucun | No action |
| WorldMap | ✅ Correct | Légère douceur de l'image (AI art) | P2 |
| LevelIntro | ✅ Correct | Aucun | No action |
| ClearScene | ✅ Correct | Aucun | No action |
| GameOverScene | ✅ Correct | Aucun | No action |
| HUD capsules | ✅ Correct | Label "PAPER" trop court pour Paperboy | P2 |
| Gameplay normal — OutRun | ✅ Meilleur univers | Aucun problème | No action |
| Gameplay normal — Fighter | ✅ Bon | SVG fists bien visibles | P2 |
| Gameplay normal — Paperboy | ✅ Bon | Obstacles très visibles | P2 |
| Gameplay normal — Sonic | ⚠️ Passable | pickup_secondary 32px flou | P1 |
| Gameplay normal — Streets | ⚠️ Passable | Pickup peu visible sur fond marron | P1 |
| Gameplay normal — Castle | ⚠️ Passable | Obstacles faible contraste | P1 |
| Gameplay normal — Shinobi | ⚠️ Faible | Shuriken invisible sur fond sombre | P1 |
| Gameplay normal — Kombat | ❌ Cassé | Pickup invisible sur fond rouge | P0 |
| Boss OutRun | ✅ Meilleur boss | Voitures pixel art lisibles | No action |
| Boss Paperboy | ✅ Bon | Boss identifiable | No action |
| Boss Castle | ⚠️ Passable | Board surchargé d'étoiles | P2 |
| Boss Sonic | ⚠️ Passable | Sprites flous (1254px → 50px) | P1 |
| Boss Streets | ⚠️ Passable | Boss perdu dans la foule | P1 |
| Boss Fighter | ⚠️ Faible | Boss trop petit, faible contraste | P1 |
| Boss Kombat | ❌ Cassé | Board quasi-entièrement noir | P0 |
| Boss Shinobi | ❌ Non-rendu | Screenshot entièrement noir | P0 |

---

## Audit par écran

| Écran | Rendu | Problèmes | Priorité | Recommandation |
|---|---|---|---|---|
| TitleScene | ✅ Propre | Aucun — bon contraste texte/bg | No action | — |
| WorldMapScene | ✅ Correct | Image légèrement douce (AI art 941×1672) | P2 | Acceptable en état |
| LevelIntroScene (Castle) | ✅ Propre | Background enchanteur, lisibilité parfaite | No action | — |
| GameScene (voir tableau univers) | Variable | Voir ci-dessous | — | — |
| ClearScene | ✅ Propre | "NIVEAU REUSSI" lisible, fond thématique | No action | — |
| GameOverScene | ✅ Propre | "PERDU" lisible, fond thématique correct | No action | — |

---

## Audit par univers normal

| Univers | Background | HUD | Board | Icônes/Pickups | Obstacles | Problème principal | Priorité |
|---|---|---|---|---|---|---|---|
| Castle | ✅ Maroon dark | ✅ Lisible | ✅ Bordure rose/dorée | ⚠️ SVG stars correctes, mais obstacle SVGs très faible alpha | ⚠️ BlinkWall quasi-invisible en ghost state | Obstacles faible contraste sur fond marron | P1 |
| Sonic | ✅ Pixel art lumineux | ✅ ANNEAU 1/4 lisible | ✅ Bleu marine | ⚠️ pickup_ring OK (450px) — pickup_secondary flou (32px) | ⚠️ Bumper faint rings | pickup_secondary 32px upscalé flou | P1 |
| Streets | ✅ Orange sombre | ✅ Lisible | ✅ Bordure orange | ⚠️ Pickup street_bonus visible sur plein écran mais petit | ⚠️ Crowd blocker petit, peu distinct | Pickup et obstacles faible contraste | P1 |
| Fighter | ✅ Rue asiatique | ✅ CHARGE lisible | ✅ Noir avec bordure rouge | ✅ Fists OpenMoji vivants et lisibles | ✅ Charge markers bold | Aucun problème majeur | P2 |
| OutRun | ✅ Retrowave sunset | ✅ BALISES lisible | ✅ Noir + bordure neon rose | ✅ Trophy SVG or, très visible | ✅ Voiture pixel art, excellent | Meilleur univers — aucun problème | No action |
| Shinobi | ⚠️ Très sombre | ✅ Lisible | ⚠️ Grille presque invisible | ⚠️ Shuriken 256px faible contraste sur fond sombre | ⚠️ Decoy à peine visible | Shuriken et grille faible contraste global | P1 |
| Kombat | ⚠️ Rouge sang uniforme | ✅ Lisible | ⚠️ Presque invisible sur rouge | ❌ finish_token invisible sur rouge | ⚠️ Fatal zone difficile à voir | Pickup invisible sur fond rouge — P0 | P0 |
| Paperboy | ✅ Suburban lumineux | ✅ Lisible | ✅ Vert sombre contrasté | ✅ Newspaper visible, mailbox distinct | ✅ Dog/obstacles gros et visibles | Meilleur univers (avec OutRun) | No action |

---

## Audit par boss

| Boss | Entité boss | Weakpoint/cible | Hazards | Effets | Problème principal | Priorité |
|---|---|---|---|---|---|---|
| Castle — WitchMirror | ⚠️ Procédural, petit | ⚠️ Diamonds subtils | ⚠️ Stars SVG denses | OK | Board surchargé, boss noyé | P2 |
| Sonic — LoopSerpent | ⚠️ PNG 1254→50px, flou | OK | Bumper rings OK | OK | Sprites blurs, identifiables | P1 |
| Streets — CrimeLord | ⚠️ Petit, même style que crowd | ⚠️ Faible distinction | ⚠️ Crowd dense, grid illisible | OK | Boss perdu dans crowd | P1 |
| Fighter — FinalChallenger | ⚠️ Très petit sur fond rouge | ❌ Weakpoint invisible | ❌ Counter zones invisibles | ⚠️ Trop petit | Boss trop petit, faible contraste | P1 |
| OutRun — TurboRival | ✅ Voiture rouge pixel art | ✅ TurboZone neon visible | ✅ Voitures obstacle distinctes | ✅ | Meilleur boss | No action |
| Shinobi — ShadowNinja | ❌ Screenshot entièrement noir | ❌ N/A | ❌ N/A | ❌ N/A | Render failure total | P0 |
| Kombat — DragonGate | ⚠️ Toutes petites sur fond noir | ❌ Quasi-invisible | ❌ Zones indistinctes | ❌ Trop sombre | Board quasi-noir, tout invisible | P0 |
| Paperboy — NeighborhoodChaos | ✅ Boss bear 256px visible | ✅ Mailbox targets clairs | ✅ Obstacles distincts | ✅ | Correct, lisible | No action |

---

## Problèmes détaillés

### VQA-001 — Kombat pickup invisible sur fond rouge
- **Scène** : GameScene / kombat_normal
- **Capture** : `kombat_gameplay.png`, `crops/kombat_pickup_crop.png`
- **Problème** : Le `pickup_finish_token.png` (1254×1254, ton rouge/orange) est quasiment invisible sur le fond rouge sang du board kombat. Le crop montre uniquement la grille et le serpent — le pickup est indiscernable.
- **Cause probable** : Palette du PNG trop proche du fond rouge. Halo procédural de `PickupRenderer` (faible alpha 10-30%) insuffisant pour le différencier.
- **Priorité** : P0
- **Recommandation** : Ajouter une surbrillance forcée (halo blanc ou jaune vif) pour tout pickup dont le fond board est rouge/sombre. Ou remplacer le PNG par un asset plus contrasté (jaune/blanc sur rouge).
- **Patch suggéré** : PATCH 1093 — Pickup Contrast Fix (Kombat + Shinobi)

---

### VQA-002 — Kombat boss board quasi-noir
- **Scène** : GameScene / kombat_boss
- **Capture** : `kombat_boss.png`
- **Problème** : Le board en mode boss kombat est presque entièrement noir. Le DragonGate est à peine visible comme une petite entité au centre. Les hazard zones (dangerZone) sont invisibles. Le fond `kombat_boss_system_bg.png` est très sombre.
- **Cause probable** : La grille kombat utilise un fond très sombre (#0a0000 ou similaire) + le background boss est une image noire. Sans ambiance lumineuse, tout disparaît.
- **Priorité** : P0
- **Recommandation** : Augmenter la luminosité du board kombat en mode boss. Ajouter des éléments visuels — au minimum augmenter la couleur de fond de grille à une valeur visible (maroon foncé plutôt que noir).
- **Patch suggéré** : PATCH 1094 — Kombat Boss Visual Fix

---

### VQA-003 — Shinobi boss screenshot entièrement noir
- **Scène** : GameScene / shinobi_boss
- **Capture** : `shinobi_boss.png` (all-black)
- **Problème** : La capture Playwright du niveau shinobi_boss retourne un canvas entièrement noir. Aucun élément visible.
- **Cause probable** : Possible échec de chargement du background `shinobi_boss_system_bg.png` ou timing de rendu insuffisant. Le niveau shinobi_boss utilise un fond très sombre et si l'image n'est pas chargée, le rendu vide = noir.
- **Priorité** : P0
- **Recommandation** : Vérifier le preload du `shinobi_boss_system_bg.png` dans GameScene. Ajouter un fallback procédural si le fond ne charge pas. Tester en conditions réseau lentes.
- **Patch suggéré** : PATCH 1094 — Shinobi Boss Preload Fix

---

### VQA-004 — pickup_secondary.png 32×32 flou sur tous les univers
- **Scène** : GameScene / tous les univers
- **Capture** : `crops/sonic_pickup_crop.png` (le plus visible — le ring secondaire sombre comparé au ring principal gold)
- **Problème** : Chaque univers possède un `pickup_secondary.png` de seulement 32×32 pixels. Ce fichier est affiché à `cs × 2.5 ≈ 57px CSS = 114px physique (2x DPR)`, soit une upscale de ×1.8. Avec `FilterMode.LINEAR`, cette upscale produit un rendu flou et pixelisé.
- **Cause probable** : Asset créé à trop basse résolution. Le LINEAR filter amplifie la dégradation.
- **Priorité** : P1
- **Recommandation** : Remplacer tous les `pickup_secondary.png` par des versions 256×256 minimum. Ou utiliser le fallback procédural (shapes SVG) pour le pickup secondaire.
- **Patch suggéré** : PATCH 1093 — Pickup Secondary Asset Resolution Fix

---

### VQA-005 — Shinobi shuriken faible contraste
- **Scène** : GameScene / shinobi_normal
- **Capture** : `shinobi_gameplay.png`, `crops/shinobi_pickup_crop.png`
- **Problème** : Le `pickup_shuriken.png` (256×256, gris foncé avec outline blanc fin) est à peine visible sur le fond maroon/violet sombre du board shinobi. Le halo procédural est trop discret. En conditions de jeu rapide, le joueur ne voit pas le pickup.
- **Cause probable** : Couleur du PNG trop proche du fond. Halo `PickupRenderer` (alpha 10-30%) insuffisant pour un fond très sombre.
- **Priorité** : P1
- **Recommandation** : Augmenter l'alpha et la taille du halo pour Shinobi (couleur teal/cyan au lieu de gray). Ou teinter le shuriken en cyan vif en post-processing.
- **Patch suggéré** : PATCH 1093 — Shinobi Pickup Visibility Fix

---

### VQA-006 — Castle obstacles SVG faible contraste en état ghost
- **Scène** : GameScene / castle_normal
- **Capture** : `castle_gameplay.png`, `crops/castle_pickup_crop.png`
- **Problème** : Les obstacles `blinkWall` au state `ghost` ont un alpha de 0.24 dans `ObstacleRenderer.entityAlpha()`. Sur le fond maroon castle, ces obstacles semi-transparents deviennent quasi-invisibles — ce qui est voulu (illusion tile), mais même les murs warning (alpha 0.62) restent difficiles à voir.
- **Cause probable** : Design intentionnel (mécanique "illusion"), mais le threshold de contraste est trop bas pour mobile.
- **Priorité** : P1
- **Recommandation** : Augmenter l'alpha minimum des blinkWalls ghost à 0.35 (depuis 0.24). Ajouter un léger flash outline pour le state warning.
- **Patch suggéré** : PATCH 1095 — Castle BlinkWall Visibility

---

### VQA-007 — Fighter boss trop petit et faible contraste
- **Scène** : GameScene / fighter_boss
- **Capture** : `fighter_boss.png`, `crops/fighter_boss_grid_crop.png`
- **Problème** : Le `finalChallenger` boss entity occupe environ 2-3 cellules. Sur le fond rouge/marron foncé du board fighter, la silhouette (PNG 1254×1254 downscalé à ~50px) est à peine discernable. Les zones counter et attack_window ont faible contraste.
- **Cause probable** : Boss PNG trop large downscalé avec LINEAR → blurry. Fond rouge similaire aux teintes du boss.
- **Priorité** : P1
- **Recommandation** : Augmenter le scale boss de 2.2 → 3.0 pour fighter. Ajouter un glow ring accent autour du boss. Utiliser `NEAREST` filter pour ces sprites.
- **Patch suggéré** : PATCH 1096 — Boss Scale/Contrast Polish

---

### VQA-008 — Streets boss perdu dans la foule
- **Scène** : GameScene / streets_boss
- **Capture** : `streets_boss.png`
- **Problème** : Le board streets_boss affiche des dizaines d'icônes crowd (petits personnages jaunes) remplissant 4+ rangées. Le crimeLord boss est une entité au centre, indistinguable visuellement de la foule. Lecture de la scène confuse.
- **Cause probable** : La mécanique crowdBlockers génère beaucoup d'entités. Le boss a la même taille d'icône que les obstacles.
- **Priorité** : P1
- **Recommandation** : Ajouter un glow rouge vif autour du boss entity. Augmenter sa taille à 4.0x scale. Réduire la densité de la foule en boss mode.
- **Patch suggéré** : PATCH 1096 — Streets Boss Readability

---

### VQA-009 — Sonic boss sprites 1254px downscalés flous
- **Scène** : GameScene / sonic_boss
- **Capture** : `sonic_boss.png`, `crops/sonic_boss_grid_crop.png`
- **Problème** : Le boss `loopSerpent` affiche une série de sprites (5-6 instances du `boss_loop_serpent.png`, 1254×1254) chacune downscalée à environ 50px CSS. Le filtre LINEAR + ratio de downscale ×24 produit des sprites mous. Visuellement identifiables mais manquent de netteté pixel art.
- **Cause probable** : Assets générés à trop haute résolution pour leur usage. LinearFilter sur un downscale ×24 = soft inévitable.
- **Priorité** : P1
- **Recommandation** : Créer des versions pré-redimensionnées à 128×128 ou 256×256 pour les boss sprites. Utiliser `FilterMode.NEAREST` ou NEAREST+mipmap pour ces assets.
- **Patch suggéré** : PATCH 1097 — Boss PNG Pre-resize + NEAREST Filter

---

### VQA-010 — antialias:true + LINEAR filter global
- **Scène** : Toutes scènes avec assets PNG
- **Capture** : Multiple (visible surtout sur boss sprites)
- **Problème** : La config Phaser (`antialias: true`) active le bilinear filtering globalement. En plus, `ObstacleRenderer` et `PickupRenderer` appellent explicitement `setFilter(LINEAR)` sur chaque texture. Résultat : tous les PNG pixel art (obstacles, boss) sont lissés — on perd le rendu net pixelisé attendu.
- **Cause probable** : Configuration par défaut conservée + ajout explicite du filtre linéaire dans les renderers.
- **Priorité** : P1
- **Recommandation** : Pour les sprites pixel art (obstacles, boss PNGs), utiliser `FilterMode.NEAREST` dans `fitImageInCell`. Pour les backgrounds AI-art, conserver LINEAR. Documenter la distinction.
- **Patch suggéré** : PATCH 1093 — Image Rendering Rules (antialias + NEAREST pour pixel art)

---

### VQA-011 — Snake trop petit en début de partie
- **Scène** : GameScene / tous
- **Capture** : Multiple (snake visible comme 1-2 petits carrés)
- **Problème** : Le serpent est visuellement minuscule en début de partie (longueur 1). Sur les fonds sombres (shinobi, kombat), les 2 segments bleus/verts disparaissent.
- **Cause probable** : Design normal — le serpent grandit. Mais le contraste en début de partie est insuffisant sur les fonds très sombres.
- **Priorité** : P2
- **Recommandation** : Ajouter un léger glow permanent autour de la tête du serpent (couleur contrastée par univers).
- **Patch suggéré** : PATCH 1098 — Snake Visibility Polish

---

### VQA-012 — Paperboy HUD label tronqué
- **Scène** : GameScene / paperboy
- **Capture** : `paperboy_gameplay.png`
- **Problème** : Le HUD gauche affiche "PAPER" au lieu de "PAPERBOY". La capsule est trop étroite pour 8 caractères en pixel font.
- **Cause probable** : La capsule gauche du HUD fait environ 96px — "PAPERBOY" en Press Start 2P 10px dépasse.
- **Priorité** : P2
- **Recommandation** : Réduire la font size à 8px pour les noms de 7+ caractères, ou tronquer à "PAPER BOY" sur 2 lignes.
- **Patch suggéré** : PATCH 1098 — HUD Label Fit

---

### VQA-013 — Castle boss board surchargé d'étoiles
- **Scène** : GameScene / castle_boss
- **Capture** : `castle_boss.png`, `crops/castle_boss_grid_crop.png`
- **Problème** : Le board castle_boss est peuplé de nombreuses étoiles SVG (WitchMirror pickups + obstacles). La WitchMirror boss entity est une entité procédurale au milieu — sa distinction visuelle parmi les étoiles est faible.
- **Cause probable** : La mécanique witchMirror génère des "faux éclats" (fake stars) en plus du vrai boss.
- **Priorité** : P2
- **Recommandation** : Différencier visuellement la WitchMirror : plus grande taille + bordure pulsante distincte. Réduire le nombre de faux éclats.
- **Patch suggéré** : PATCH 1098 — Castle Boss Visual Distinction

---

### VQA-014 — Style-mismatch backgrounds AI-art vs pixel art
- **Scène** : GameScene / streets, fighter, kombat
- **Capture** : `streets_gameplay.png`, `fighter_gameplay.png`, `kombat_gameplay.png`
- **Problème** : Les backgrounds des univers streets, fighter, kombat sont des images AI-art réalistes (photos AI). Les obstacles/sprites au-dessus sont en style pixel art. La rupture de style est visible.
- **Cause probable** : Assets de background générés à style différent.
- **Priorité** : P2
- **Recommandation** : Acceptable en l'état — le fond est suffisamment foncé/flou pour ne pas concurrencer le gameplay. Surveiller si retours joueurs négatifs.

---

## Recommandations de patchs

### PATCH 1093 — Pickup Visibility & Asset Resolution
- Remplacer tous les `pickup_secondary.png` 32×32 par des versions 256×256
- Ajouter halo forcé (blanc ou jaune vif) pour kombat + shinobi pickups
- Documenter les règles de filter : NEAREST pour pixel art PNGs, LINEAR pour backgrounds

### PATCH 1094 — Kombat + Shinobi Boss Render Fix
- Augmenter la luminosité du board kombat boss (fond grille : noir → maroon foncé)
- Vérifier et corriger le preload du shinobi_boss_system_bg.png (capture noire = non rendu)
- Ajouter fallback procédural si background ne charge pas

### PATCH 1095 — Castle BlinkWall Visibility
- Alpha minimum ghost state : 0.24 → 0.35
- Ajouter outline flash en state warning

### PATCH 1096 — Boss Scale/Contrast Polish (Fighter, Streets)
- Fighter boss scale : 2.2 → 3.0, glow ring accent
- Streets boss : glow rouge vif, taille 4.0x, densité foule réduite en boss mode

### PATCH 1097 — Boss PNG Pre-resize + NEAREST Filter
- Créer versions 256×256 pour boss_loop_serpent, boss_idle (fighter/streets/kombat/outrun)
- Appliquer `FilterMode.NEAREST` aux sprites pixel art dans les renderers

### PATCH 1098 — Polish Global (Snake, HUD, Castle boss distinction)
- Snake : glow tête permanent sur fonds sombres
- HUD Paperboy : font size adaptative ou label 2 lignes
- Castle boss : WitchMirror visuellement distincte des fake stars

---

## Synthèse priorités

| Priorité | Nb de problèmes | Impact |
|---|---|---|
| P0 | 3 | Kombat pickup invisible, Kombat boss board noir, Shinobi boss render failure |
| P1 | 7 | pickup_secondary 32px, Shinobi faible contraste, Castle obstacles, Fighter boss, Streets boss, Sonic boss blur, antialias global |
| P2 | 5 | Snake taille, HUD label, Castle boss surchargé, WorldMap douceur, Style-mismatch bg |
| No action | 5 | Title, LevelIntro, Clear, GameOver, OutRun/Paperboy normal et boss |
