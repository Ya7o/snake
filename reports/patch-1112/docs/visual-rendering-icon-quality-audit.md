# Visual Rendering + Icon Quality Audit

## Résumé exécutif
**Verdict visuel global : PASS avec réserve**

L'infrastructure de rendu est correcte. LINEAR filter appliqué à tous les univers (PATCH 1115b). PNG 64×64 sont techniquement propres. La différence de qualité entre Castle (SVG OpenMoji) et les autres univers (PNG illustrés) est structurelle et prévisible. Les risques principaux sont liés au contenu illustré des PNG plutôt qu'au rendering pipeline.

---

## Hypothèse SVG/OpenMoji vs PNG générés

### Ce qui rend bien
| Famille | Raison |
|---|---|
| SVG OpenMoji (Castle) | Résolution infinie, DPR-adaptatif (64-128px), silhouettes claires, couleurs vives sans artefacts |
| Fallback procédural | Formes géométriques simples (ring, star, diamond…) — toujours lisibles, 0 artefact |
| Backgrounds (gameplay_bg, clear_bg…) | Affiché en cover-fill sur tout l'écran — scaling sans problème |
| PNG 64×64 sans détail fin (icône simple) | Tient bien à ~24-64px display si l'illustration est simple |

### Ce qui risque de mal rendre
| Famille | Raison probable |
|---|---|
| PNG 64×64 illustrés très détaillés | À ~24px display, les détails fins fusionnent — silhouette peu lisible |
| PNG avec palette complexe/bruitée | LINEAR filter atténue la pixelisation mais n'améliore pas le bruit de texture |
| PNG boss upscalé (2.5-3.0× cell) | Si boss PNG est dessiné en détail fin, upscale expose les artefacts |
| Pickups secondaires (pickupSecondary) | Utilisé pour distinguer 2 types dans même univers — confusion si PNG similaires |

### Pourquoi le gap est structurel
Castle utilise des SVG OpenMoji avec states distincts (crystal/warning/boss). Les autres univers utilisent des PNGs illustrés 64×64 générés. La différence de rendu est prévisible : SVG > PNG illustré complexe ≥ PNG illustré simple ≥ fallback procédural.

---

## Tableau des problèmes

| Élément | Type | Problème | Cause probable | Action recommandée | Priorité |
|---|---|---|---|---|---|
| Sonic pickup inactif (chainRing) | PNG overlay | Couleur `0x5d4e00` trop sombre — invisible sur fond sombre | Couleur procédurale non optimisée | Remplacer par couleur plus douce (gris bleuté) | **P1** |
| Shinobi real vs decoy (focusTarget) | ENTITY_COLORS | Distinction `real=0x00b4d8` vs `decoy=0x666666` peut être faible si PNG override | Procédural OK, mais texture override possible | Forcer fallback procédural si PNG trop similaires | **P1** |
| Paperboy deliveryTarget vs pickup | PNG similaire | pickup(02) et deliveryTarget(03) peuvent se ressembler à 24px | PNGs générés avec style similaire | Vérifier visuellement ; ajouter couleur tint différenciateur si nécessaire | **P1** |
| Boss icons upscalé 2.5-3.0× | PNG 64×64 | Upscale de boss à ~72px expose artefacts si contenu fin | Source 64×64 limite la montée en échelle | Régénérer boss clés (Shinobi, Streets) avec illustration simple | **P1** |
| LINEAR filter uniformité | Code | Appliqué via `applyGameplayTextureFilter` — à vérifier passage sur toutes images (y compris boss dynamiques) | Code correct mais boss images chargées dynamiquement hors du flow normal | Audit code TextureFiltering.ts | P2 |
| Obstacle danger vs obstacle normal | PNG similarité | `obstacle`(04) et `obstacleDanger`(05) peuvent se ressembler si illustration similaire | PNGs sans différenciation suffisante | Vérifier chaque paire ; amplifier différence par tint danger rouge | P2 |
| HUD capsules font size | Rendu | `LABEL_MIN=12` et `CAPTION_MIN=11` — taille limite sur 360px écran | 4 capsules sur largeur contrainte | Si overflow, envisager 3 capsules ou taille 10px | P2 |
| World tokens (world_token_*.png) | PNG UI | Assets chargés mais non utilisés dans code (uniquement dans public/assets/ui/) | Résidus ou feature non branchée | Vérifier usage ; supprimer si orphelins | P2 |

---

## Assets à remplacer avant release

| Asset | Niveau | Pourquoi | Remplacement recommandé |
|---|---|---|---|
| Sonic chainRing couleur inactive | Sonic normal | Couleur `0x5d4e00` illisible sur fond sombre | ENTITY_COLORS patch : `0x5a5a7a` gris bleuté neutre |
| Boss illustrations trop détaillées | Shinobi, Streets bosses | Détail fin → bruit à 64px upscalé | Régénérer avec silhouette simple, fond transparent |
| pickupSecondary Paperboy (03) | Paperboy normal | Doit être visuellement distincte du pickup journal (02) | Si similaire : ajouter tint jaune dans renderer |

---

## Assets à régénérer manuellement

| Asset | Niveau | Règles de génération |
|---|---|---|
| `shinobi/01_boss_idle.png` | Shinobi boss | Silhouette ninja simple, fond transparent, couleur dominante cyan, max 2 couleurs |
| `streets/01_boss_idle.png` | Streets boss | Silhouette homme fort simple, fond transparent, couleur dominante rouge/orange |
| `sonic/02_boss_idle.png` | Sonic boss | Serpent tête simple vue de face, couleur verte, fond transparent |
| Tout PNG avec fond de couleur | Multi | Forcer fond transparent sur toutes les illustrations runtime |

---

## Problèmes code/rendering

| Zone | Problème | Patch recommandé |
|---|---|---|
| `ObstacleRenderer` chainRing | `0x5d4e00` inactive trop sombre — ENTITY_COLORS hardcodée | PATCH 1113 — changer couleur inactive |
| `ObstacleRenderer` boss dynamic | Boss textures chargées dynamiquement (FIGHTER_BOSS_IDLE_KEY etc.) — LINEAR filter non appliqué via `applyGameplayTextureFilter` classique | Vérifier dans `TextureFiltering.ts` si boss keys sont couverts |
| `PickupRenderer` DEFAULT_IMAGE_PROFILE | `maxSizeScale: 2.8` — à 24px cs = 67px display sur 64px source = légère upscale | Acceptable car <10% — pas de changement requis |
| `world_token_*.png` | 8 assets présents dans `public/assets/ui/` mais aucun usage trouvé dans codebase | Supprimer ou brancher dans PATCH ultérieur |

---

## Stratégie recommandée

### Avant release (PATCH 1113–1115)
1. Corriger `ENTITY_COLORS.chainRing.inactive` : `0x5d4e00` → `0x5a5a7a`
2. Vérifier visuellement en runtime : Paperboy pickup vs deliveryTarget, Shinobi real vs decoy
3. Si boss PNG trop bruités : régénérer Shinobi et Streets boss avec illustration simple
4. Vérifier `applyGameplayTextureFilter` couvre bien les textures boss chargées dynamiquement

### Après release
- Généraliser méthode SVG/OpenMoji aux univers non-Castle (long terme)
- Régénérer les 7 sets de PNG avec contrainte silhouette simple + fond transparent
- Envisager OpenMoji gameplay cell icons pour Sonic/Fighter (bonus de lisibilité garanti)

### À ne pas faire maintenant
- Remplacer tous les PNG en bulk (risque régressions, hors scope pre-release)
- Modifier le PickupRenderer ou l'ObstacleRenderer au-delà de corrections ciblées
- Introduire de nouveaux SVG assets sans validation play-test

---

## Inventaire assets runtime

### Tailles vérifiées
Tous les 42 PNG runtime sont 64×64 RGBA :
- 7 univers × 6 rôles (pickup, pickupSecondary, obstacle, obstacleDanger, boss, bossAttack)
- Aucun PNG manquant

### Correspondance roles → fichiers
| Univers | pickup | pickupSecondary | obstacle | obstacleDanger | boss | bossAttack |
|---|---|---|---|---|---|---|
| sonic | 01 | 03 | 04 | 05 | 02 | 06 |
| streets | 02 | 03 | 04 | 05 | 01 | 06 |
| fighter | 03 | 04 | 05 | 02 | 01 | 06 |
| outrun | 01 | 02 | 03 | 04 | 05 | 06 |
| shinobi | 02 | 03 | 04 | 05 | 01 | 06 |
| kombat | 02 | 03 | 04 | 05 | 01 | 06 |
| paperboy | 02 | 03 | 04 | 05 | 01 | 06 |

### Facteurs de scale ObstacleRenderer
| Contexte | Scale |
|---|---|
| OpenMoji Castle (blinkWall, witchMirror) | 3.0× cell |
| Boss runtime standard | 2.5× cell |
| shadowNinja, crimeLord, loopSerpent | 2.8–3.0× cell (boost silhouette) |
| Obstacles runtime (crowdBlocker, sparZone…) | 2.5× cell |

### Fallback procédural par univers (PickupRenderer)
| Univers | Forme |
|---|---|
| castle | star |
| sonic | ring |
| streets | diamond |
| fighter | lightning |
| outrun | triangle |
| shinobi | cross |
| kombat | flame |
| paperboy | circle |
