# PATCH 1014 — Docs & Asset Cleanup Audit

## Objectif

Auditer docs, assets et fichiers temporaires avant packaging prototype Phase 6.
Aucun fichier modifié, déplacé ou supprimé dans ce patch.

---

## Résumé

**Verdict : projet prêt pour cleanup ciblé, pas encore pour release propre.**

- ~80 MB d'archives patch dans `tmp/` à exclure du package release
- ~25 MB d'assets emoji raw dans `tmp/emoji/` (déjà intégrés dans `public/assets/openmoji/`)
- ~14 archives patch *.tar.gz dans `tmp/` — conserver pour historique, exclure du release
- ~65 fichiers docs — 20 sont des références actives, ~45 sont des logs patch ou archives historiques
- Assets actifs bien structurés ; **8 fichiers `board_preview.png` et 8 `world_token_*.png` non référencés** dans le code — suspects
- `dist/` (141 MB) et `node_modules/` (211 MB) absents du repo source mais présents localement — exclure systématiquement
- `design_boards/` (175 MB) : sources design utiles, ne pas mettre dans le package release source minimal

**Risques principaux :**
- Ne pas supprimer `public/assets/ui/` ni `public/assets/universes/` — toute l'arborescence est active
- Ne pas supprimer `public/assets/openmoji/` — utilisé via `openmojiIconRegistry.ts`
- Ne pas supprimer `public/assets/runtime/` — 7 univers avec assets rt_ actifs (castle n'a pas de runtime)
- `world_token_*.png` : non référencés mais potentiellement prévus pour Phase 6 — ne pas supprimer sans vérification

---

## Docs

### Série 00-18 : Core Design & Architecture

| Fichier | Catégorie | Garder ? | Raison |
|---|---|:---:|---|
| `00_REPO_STRUCTURE.md` | référence | Oui | Structure projet active |
| `01_VISION.md` | référence | Oui | Vision produit de référence |
| `02_GAME_DESIGN.md` | référence | Oui | GDD complet |
| `03_MECHANICS_BIBLE.md` | référence | Oui | Règles mécaniques 8 univers |
| `04_ART_BIBLE.md` | référence | Oui | Guide visuel |
| `05_UX_FLOW.md` | référence | Oui | Flow UX actif |
| `06_TECHNICAL_ARCHITECTURE.md` | référence | Oui | Architecture technique |
| `07_QA_CHECKLIST.md` | référence | Oui | QA checklist release |
| `08_ASSET_GUIDE.md` | référence | Oui | Pipeline assets actif |
| `09_DECISIONS_LOG.md` | historique | Oui | Log décisions architecturales |
| `10_DESIGN_PACK_USAGE.md` | référence | Oui | Workflow design boards |
| `11_MOBILE_ITERATION_WORKFLOW.md` | référence | Oui | Workflow mobile actif |
| `12_PREREQUISITES_PC.md` | référence | Oui | Prérequis dev |
| `13_ACCEPTANCE_MATRIX.md` | référence | Oui | Critères d'acceptance |
| `14_UNIVERSE_IMPLEMENTATION_SPEC.md` | référence | Oui | Spec implémentation univers |
| `16_WORLDMAP_ASSET_USAGE.md` | référence | Oui | Usage assets world map |
| `17_WORLDMAP_VISUAL_REFERENCE.md` | référence | Oui | Référence visuelle world map |
| `18_REPO_CLEANUP_LOG.md` | historique | Oui | Log des suppressions passées — évite réintroductions |

### Série 9xx : Préproduction & Audits

| Fichier | Catégorie | Garder ? | Raison |
|---|---|:---:|---|
| `910_REPORT.md` | historique | Archive | Rapport préproduction ancien |
| `960_outrun_mobile_layout_notes.md` | patch log | Archive | Notes layout OutRun appliquées |
| `961_mobile_ui_audit_analysis.md` | patch log | Archive | Analyse UI mobile — intégrée |
| `970_WORLD_RULES_MATRIX.md` | référence | Oui | Matrice règles univers — toujours utile Phase 6 |
| `972_LINEAR_PROGRESSION_DEBT.md` | historique | Archive | Dette progression linéaire — résolue en Phase 5 |
| `980_CASTLE_VERTICAL_SLICE_NOTES.md` | patch log | Archive | Notes Castle VS — appliquées |
| `981_CASTLE_PLAYTEST_CHECKLIST.md` | patch log | Archive | Checklist Castle — validée |
| `983_CASTLE_SCREENSHOT_VALIDATION.md` | patch log | Archive | Validation captures Castle |
| `984_PROMPTS_FOR_FUTURE_UNIVERSES.md` | référence | Oui | Prompts assets Phase 6 — utile |
| `986_CASTLE_FINAL_RENDER_PATH.md` | historique | Archive | Pipeline render Castle |
| `987_CASTLE_BACKGROUND_PRESENTATION_AUDIT.md` | historique | Archive | Audit backgrounds Castle |
| `990_ASSET_COPY_AND_BINDING_V3.md` | référence | Oui | Contrat binding assets V3 |
| `990_CASTLE_QUICK_WINS.md` | patch log | Archive | Quick wins Castle appliqués |
| `990_DO_NOT_TOUCH_V3.md` | référence | Oui | Liste fichiers protégés |
| `990_GLOBAL_ICON_POLICY_V3.md` | référence | Oui | Politique icônes globale |
| `990_ICON_SELECTION_TABLE_V3.md` | référence | Oui | Table sélection icônes |
| `990_OBSTACLE_DANGER_BOSS_BINDING_V3.md` | référence | Oui | Binding obstacles/boss |
| `990_QA_AND_ACCEPTANCE_V3.md` | référence | Oui | QA V3 — critères actifs |
| `990_RUNTIME_REGISTRY_CONTRACT_V3.md` | référence | Oui | Contrat registry runtime |
| `992_AUDIO_EVENT_MAPPING.md` | référence | Oui | Mapping événements audio |
| `992_AUDIO_POLICY.md` | référence | Oui | Politique audio |
| `992_AUDIO_QA_CHECKLIST.md` | référence | Oui | QA audio |
| `992_AUDIO_RUNTIME_CONTRACT.md` | référence | Oui | Contrat runtime audio |
| `992_DO_NOT_TOUCH.md` | référence | Oui | Fichiers audio protégés |
| `993_CASTLE_VERTICAL_SLICE_TEMPLATE.md` | référence | Oui | Template VS — base Phase 6 |
| `994_CASTLE_GAMEPLAY_READABILITY_HUD_PASS.md` | patch log | Archive | Pass HUD Castle appliqué |
| `995_CASTLE_GAMEPLAY_LAYOUT_POLISH.md` | patch log | Archive | Polish layout Castle appliqué |
| `996_CASTLE_VERTICAL_SLICE_CHECKLIST.md` | release | Oui | Checklist VS — référence release |
| `997_OUTRUN_TEMPLATE_APPLICATION_AUDIT.md` | historique | Archive | Audit OutRun template |
| `998_OUTRUN_RUNTIME_TEMPLATE_BINDING.md` | référence | Oui | Binding runtime OutRun |
| `999_GLOBAL_UNIVERSE_BACKGROUND_BINDING.md` | référence | Oui | Binding backgrounds global |
| `UNIVERSE_TEMPLATE_RULES.md` | référence | Oui | Règles template univers — Phase 6 |
| `ASSET_PROVENANCE_RUNTIME_24.md` | référence | Oui | Provenance assets runtime |
| `PREPRODUCTION_945_958_STATUS.md` | historique | Archive | Status préproduction — obsolète |

### Série 10xx : Patches & Tickets

| Fichier | Catégorie | Garder ? | Raison |
|---|---|:---:|---|
| `1001_OUTRUN_GAMEPLAY_LAYOUT_COMPLIANCE.md` | patch log | Archive | Compliance OutRun appliquée |
| `1003_CLEAR_TEXT_CONTRAST_SAFETY_PASS.md` | patch log | Archive | Pass contraste texte appliqué |
| `1004A_TEMPLATE_READINESS_REPORT.md` | historique | Archive | Report template readiness Phase 4 |
| `1004B_AUDIO_ASSET_COVERAGE_AUDIT.md` | historique | Archive | Audit audio Phase 4 |
| `1005A_MINIMAL_AUDIO_EVENT_MAP.md` | référence | Oui | Carte événements audio — active |
| `1005B_BOSS_MECHANICS_PRIORITIZATION.md` | historique | Archive | Priorisation boss Phase 4/5 |
| `1006_GAMEPLAY_DEPTH_MINIMAL_SCOPE.md` | référence | Oui | Scope mécaniques actif |
| `1007A_MINIMAL_AUDIO_TIER1_IMPLEMENTATION.md` | patch log | Archive | Impl audio Tier1 appliquée |
| `1007B_BOSS_HUD_HINT_SAFETY_PASS.md` | patch log | Archive | Pass HUD boss appliqué |
| `1008_SHINOBI_REVEAL_RULE_FIX.md` | patch log | Archive | Fix règle reveal Shinobi |
| `1009_STREETS_PRESSURE_ZONE_READABILITY.md` | patch log | Archive | Lisibilité zones Streets |
| `1010_OUTRUN_TURBO_RIVAL_CLARIFICATION.md` | patch log | Archive | Clarification Turbo Rival |
| `1012_PHASE5_CLOSURE_REPORT.md` | release | Oui | **Rapport closure Phase 5 — référence critique** |
| `1013A_WORLD_MAP_MINIMAP_REFRESH.md` | patch log | Archive | Refresh minimap — appliqué |
| `1013B_WORLD_MAP_VIEWPORT_FIT_SELECTION_POLISH.md` | patch log | Archive | Polish viewport World Map |

### Audits sous-dossier

| Fichier | Catégorie | Garder ? | Raison |
|---|---|:---:|---|
| `audits/915_COMMAND_RESULTS.md` | historique | Archive | Résultats commandes audit Phase 3 |
| `audits/915_LATEST_MOBILE_FIRST_CODE_AUDIT.md` | historique | Archive | Audit code mobile Phase 3 |
| `audits/926_MOBILE_READY_COMPLIANCE_AUDIT.md` | historique | Archive | Compliance mobile Phase 3 |
| `audits/927_GAMEPLAY_MECHANICS_COMPLIANCE_AUDIT.md` | historique | Archive | Compliance mécaniques Phase 3 |
| `audits/MOBILE_FIRST_PATCH_PLAN.md` | historique | Archive | Plan patch mobile Phase 3 |
| `audits/MOBILE_FIRST_UX_AUDIT.md` | historique | Archive | Audit UX mobile Phase 3 |
| `audits/MOBILE_FIRST_UX_CHECKLIST.md` | historique | Archive | Checklist UX mobile Phase 3 |

### Docs design boards

| Fichier | Catégorie | Garder ? | Raison |
|---|---|:---:|---|
| `design_boards/CROP_QUALITY_RULES.md` | référence | Oui | Règles qualité crop actives |
| `design_boards/DEVELOPER_ASSET_AUDIT.md` | historique | Archive | Audit assets dev |
| `design_boards/DEVELOPER_ASSET_PIPELINE.md` | référence | Oui | Pipeline assets dev |
| `design_boards/MANUAL_CROP_WORKFLOW.md` | référence | Oui | Workflow crop manuel |

### Docs externes et divers

| Fichier | Catégorie | Garder ? | Raison |
|---|---|:---:|---|
| `EXTERNAL_ASSET_INGESTION.md` | historique | Archive | Ingestion assets externe — done |
| `EXTERNAL_ASSET_MANUAL_DOWNLOAD_WORKFLOW.md` | historique | Archive | Workflow download manuel — done |
| `EXTERNAL_ASSET_MAPPING_BY_UNIVERSE.md` | historique | Archive | Mapping assets par univers |
| `mobile-ui-readability-audit.md` | historique | Archive | Audit lisibilité mobile |
| `audit_mobile_ui_level_intro_sonic_shinobi_notes.md` | historique | Archive | Notes audit mobile level intro |

---

## Assets actifs

### Audio

| Chemin | Type | Usage | Actif ? | Risque suppression |
|---|---|---|:---:|---|
| `audio/collision_hit.wav` | SFX | `audioRegistry.ts` collision | Oui | Fort — gameplay |
| `audio/danger_alert.wav` | SFX | `audioRegistry.ts` danger | Oui | Fort — gameplay |
| `audio/pickup_magic.wav` | SFX | `audioRegistry.ts` pickup | Oui | Fort — gameplay |
| `audio/stage_clear.wav` | SFX | `audioRegistry.ts` clear | Oui | Fort — gameplay |
| `audio/ui_button.wav` | SFX | `audioRegistry.ts` UI | Oui | Fort — UX |
| `audio/sfx/.gitkeep` | placeholder | aucun | Non | Nul — placeholder vide |

### Frames (cadres gameplay)

| Chemin | Type | Usage | Actif ? | Risque suppression |
|---|---|---|:---:|---|
| `frames/castle/frame.png` | PNG | `UniverseFrameRenderer.ts` | Oui | Fort |
| `frames/fighter/frame.png` | PNG | `UniverseFrameRenderer.ts` | Oui | Fort |
| `frames/kombat/frame.png` | PNG | `UniverseFrameRenderer.ts` | Oui | Fort |
| `frames/outrun/frame.png` | PNG | `UniverseFrameRenderer.ts` | Oui | Fort |
| `frames/paperboy/frame.png` | PNG | `UniverseFrameRenderer.ts` | Oui | Fort |
| `frames/shinobi/frame.png` | PNG | `UniverseFrameRenderer.ts` | Oui | Fort |
| `frames/sonic/frame.png` | PNG | `UniverseFrameRenderer.ts` | Oui | Fort |
| `frames/streets/frame.png` | PNG | `UniverseFrameRenderer.ts` | Oui | Fort |

### Level Intros (8 univers)

| Chemin | Type | Usage | Actif ? | Risque suppression |
|---|---|---|:---:|---|
| `level-intros/castle/intro.png` | PNG | `LevelIntroScene.ts` | Oui | Fort |
| `level-intros/fighter/intro.png` | PNG | `LevelIntroScene.ts` | Oui | Fort |
| `level-intros/kombat/intro.png` | PNG | `LevelIntroScene.ts` | Oui | Fort |
| `level-intros/outrun/intro.png` | PNG | `LevelIntroScene.ts` | Oui | Fort |
| `level-intros/paperboy/intro.png` | PNG | `LevelIntroScene.ts` | Oui | Fort |
| `level-intros/shinobi/intro.png` | PNG | `LevelIntroScene.ts` | Oui | Fort |
| `level-intros/sonic/intro.png` | PNG | `LevelIntroScene.ts` | Oui | Fort |
| `level-intros/streets/intro.png` | PNG | `LevelIntroScene.ts` | Oui | Fort |

### Map / World Map

| Chemin | Type | Usage | Actif ? | Risque suppression |
|---|---|---|:---:|---|
| `map/world_map.png` | PNG | `WorldMapScene.ts` (fond) | Probable | Fort — fond world map |
| `map/.gitkeep` | placeholder | aucun | Non | Nul |
| `ui/worldmap/world_map_minimap_16_9.png` | PNG | `constants.ts` + `WorldMapScene.ts` | Oui | Fort — minimap active |

### UI Backgrounds (8 univers × 5 = 40 fichiers)

Schéma : `ui/[univers]/[univers]_{system,boss_system,gameplay,game_over,clear}_bg.png`
Référencé dynamiquement dans `constants.ts` via template string.

| Univers | Fichiers | Actif ? | Risque |
|---|---|:---:|---|
| castle | 5 backgrounds | Oui | Fort |
| fighter | 5 backgrounds | Oui | Fort |
| kombat | 5 backgrounds | Oui | Fort |
| outrun | 5 backgrounds | Oui | Fort |
| paperboy | 5 backgrounds | Oui | Fort |
| shinobi | 5 backgrounds | Oui | Fort |
| sonic | 5 backgrounds | Oui | Fort |
| streets | 5 backgrounds | Oui | Fort |

### UI Title

| Chemin | Type | Usage | Actif ? | Risque suppression |
|---|---|---|:---:|---|
| `ui/title/title_hub_bg.png` | PNG | `TitleScene.ts` | Oui | Fort — écran titre |
| `ui/title/world_token_castle.png` | PNG | **non référencé** | Suspect | Voir section suspects |
| `ui/title/world_token_fighter.png` | PNG | **non référencé** | Suspect | Voir section suspects |
| `ui/title/world_token_kombat.png` | PNG | **non référencé** | Suspect | Voir section suspects |
| `ui/title/world_token_outrun.png` | PNG | **non référencé** | Suspect | Voir section suspects |
| `ui/title/world_token_paperboy.png` | PNG | **non référencé** | Suspect | Voir section suspects |
| `ui/title/world_token_shinobi.png` | PNG | **non référencé** | Suspect | Voir section suspects |
| `ui/title/world_token_speed.png` | PNG | **non référencé** | Suspect | Voir section suspects |
| `ui/title/world_token_streets.png` | PNG | **non référencé** | Suspect | Voir section suspects |

### Universes DB assets (8 univers × 9 fichiers = 72 fichiers)

Schéma : `universes/[univers]/{pickup_01,pickup_02,obstacle_01,obstacle_02,boss,frame_tile,hud_panel}.png`
Tier `db_` — chargé par `RuntimeAssetResolver.ts`.

| Univers | Fichiers actifs | board_preview.png | theme_palette.json |
|---|---|---|---|
| castle | 7 PNG actifs | **suspect** | **suspect** |
| fighter | 7 PNG actifs | **suspect** | **suspect** |
| kombat | 7 PNG actifs | **suspect** | **suspect** |
| outrun | 7 PNG actifs | **suspect** | **suspect** |
| paperboy | 7 PNG actifs | **suspect** | **suspect** |
| shinobi | 7 PNG actifs | **suspect** | **suspect** |
| sonic | 7 PNG actifs | **suspect** | **suspect** |
| streets | 7 PNG actifs | **suspect** | **suspect** |

### Runtime assets (7 univers × 3 fichiers = 21 fichiers)

Schéma : `runtime/universes/[univers]/{boss_*.png, obstacle_*.png, pickup_*.png}`
Castle n'a pas de dossier runtime (db_ exclusif, par design).

| Univers | Boss | Obstacle | Pickup | Actif ? |
|---|---|---|---|:---:|
| fighter | `boss_final_challenger.png` | `obstacle_charge_marker.png` | `pickup_energy.png` | Oui |
| kombat | `boss_dragon_gate.png` | `obstacle_fatal_zone.png` | `pickup_finish_token.png` | Oui |
| outrun | `boss_turbo_rival.png` | `obstacle_car.png` | `pickup_checkpoint.png` | Oui |
| paperboy | `boss_neighborhood_chaos.png` | `obstacle_dog.png` | `pickup_newspaper.png` | Oui |
| shinobi | `boss_shadow_ninja.png` | `obstacle_decoy.png` | `pickup_shuriken.png` | Oui |
| sonic | `boss_loop_serpent.png` | `obstacle_bumper.png` | `pickup_ring.png` | Oui |
| streets | `boss_crime_lord.png` | `obstacle_crowd.png` | `pickup_street_bonus.png` | Oui |

### OpenMoji

| Dossier | Usage | Actif ? | Note |
|---|---|:---:|---|
| `openmoji/boss/` (9 SVG) | `openmojiIconRegistry.ts` — icônes boss | Oui | À vérifier par icône |
| `openmoji/castle/` (6 SVG) | `openmojiIconRegistry.ts` — icônes castle | Oui | |
| `openmoji/danger/` (9 SVG) | `openmojiIconRegistry.ts` — icônes danger | Oui | |
| `openmoji/hud/` (15 SVG) | `openmojiIconRegistry.ts` — HUD icons | Oui | |
| `openmoji/obstacles/` (9 SVG) | `openmojiIconRegistry.ts` — obstacles | Oui | |
| `openmoji/pickups/` (11 SVG) | `openmojiIconRegistry.ts` — pickups | Oui | |
| `openmoji/result/` (8 SVG) | `openmojiIconRegistry.ts` — résultats | Oui | |
| `openmoji/world/` (8 SVG) | `openmojiIconRegistry.ts` — world map | Oui | |
| `openmoji/OPENMOJI_COPY_REPORT.json` | build artifact | Non | Suspect — voir section |

---

## Assets suspects / non utilisés

| Chemin | Pourquoi suspect | Recommandation |
|---|---|---|
| `universes/*/board_preview.png` (×8) | Non référencé dans `src/` — probable capture de qualité de design board | Ne pas supprimer sans vérification ; peut être utilisé en Phase 6 pour un menu de sélection |
| `universes/*/theme_palette.json` (×8) | Non référencé dans `src/` — probable métadonnée de design | Ne pas supprimer ; utile pour Phase 6 theming |
| `ui/title/world_token_*.png` (×8) | Non référencé dans `src/` — probablement préparé pour Phase 6 | Ne pas supprimer ; intention de réutilisation probable |
| `ui/title/world_token_speed.png` | Nommé "speed" au lieu de "sonic" — incohérence de nommage | Vérifier si correspond à l'univers Sonic |
| `public/assets/design-board-manifest.json` | Non référencé dans `src/` — manifest de build design | Peut être archivé dans `tmp/` ou `design_boards/` |
| `public/assets/openmoji/OPENMOJI_COPY_REPORT.json` | Artefact du script `copy-openmoji-subset.mjs` | Déplacer dans `tmp/` lors du prochain cleanup |
| `public/assets/audio/sfx/.gitkeep` | Dossier placeholder vide — aucun SFX additionnel présent | Peut rester en placeholder pour Phase 6 audio |
| `public/assets/map/.gitkeep` | Dossier map contient déjà `world_map.png` — gitkeep redondant | Supprimer lors du prochain cleanup |
| `universes/*/` `.gitkeep` (×8) | Chaque dossier univers contient un `.gitkeep` inutile maintenant rempli | Supprimer lors du prochain cleanup |
| `tmp/emoji/` (25 MB, ~1400 SVG bruts) | Pack OpenMoji complet — déjà intégré dans `public/assets/openmoji/` via `copy-openmoji-subset.mjs` | Exclure du release ; peut être supprimé localement si disk space nécessaire |
| `tmp/capture*/` (~40 MB de PNGs) | Captures screenshot d'audit patches 1001-1003 | Exclure du release source ; archiver ou supprimer localement |
| `tmp/patch*.tar.gz` (14 archives, ~80 MB) | Archives patches historiques | Exclure du release ; conserver localement pour historique |

---

## Dossiers à exclure du package release

| Chemin | Raison |
|---|---|
| `tmp/` | Captures, archives patches, assets emoji bruts — 100+ MB d'artefacts de développement |
| `tmp/capture/` | Screenshots d'audit — aucun usage runtime |
| `tmp/capture1001/` | Screenshots patch 1001 |
| `tmp/capture1002/` | Screenshots patch 1002 (24 MB) |
| `tmp/capture1003/` | Screenshots patch 1003 |
| `tmp/emoji/` | Pack OpenMoji complet brut (25 MB) — déjà distillé dans `public/assets/openmoji/` |
| `tmp/patch*.tar.gz` | Archives patches historiques (~80 MB total) |
| `tmp/patch999/`, `tmp/patch1007A/`, etc. | Dossiers de travail des patches |
| `dist/` | Build généré (141 MB) — exclure si package source ; inclure si package déployable |
| `node_modules/` | Dépendances (211 MB) — toujours exclure du source release |
| `design_boards/` | Sources design (175 MB) — exclure du package release minimal ; conserver en repo |
| `.vite/` | Cache Vite — généré |
| `.git/` | Historique git — exclure des archives de déploiement |
| `scripts/openmoji_selected_icons_manifest.json` | Manifest de build — optionnel |

---

## Structure release recommandée

```
snake-drive-v4-prototype/
├── src/                          # Code source complet
│   ├── assets/
│   ├── config/
│   ├── core/
│   ├── data/
│   ├── mechanics/
│   ├── qa/
│   ├── render/
│   ├── scenes/
│   ├── systems/
│   ├── ui/
│   ├── worldmap/
│   └── main.ts
├── public/
│   ├── assets/
│   │   ├── audio/             # 5 WAV actifs (sfx/.gitkeep optionnel)
│   │   ├── frames/            # 8 frames PNG
│   │   ├── level-intros/      # 8 intro PNG
│   │   ├── map/               # world_map.png
│   │   ├── openmoji/          # SVG actifs seulement (sans OPENMOJI_COPY_REPORT.json)
│   │   ├── runtime/           # 21 PNG runtime (7 univers)
│   │   ├── ui/                # 40 backgrounds + title + worldmap minimap
│   │   └── universes/         # 72 PNG db_ + board_preview + theme_palette
│   ├── favicon.svg
│   ├── site.webmanifest
│   └── index.html (à la racine)
├── docs/
│   └── release/               # Sous-dossier docs essentiels release
│       ├── 01_VISION.md
│       ├── 02_GAME_DESIGN.md
│       ├── 03_MECHANICS_BIBLE.md
│       ├── 07_QA_CHECKLIST.md
│       ├── 1012_PHASE5_CLOSURE_REPORT.md
│       └── 996_CASTLE_VERTICAL_SLICE_CHECKLIST.md
├── scripts/                   # Scripts build utilitaires
├── index.html
├── package.json
├── package-lock.json
├── tsconfig.json
├── vite.config.ts
├── CLAUDE.md
└── README.md
```

**Exclusions du package source minimal :**
- `tmp/` (intégral)
- `dist/`
- `node_modules/`
- `design_boards/`
- `.git/`
- `.vite/`

---

## Nettoyage recommandé

### Critique
*À faire avant export release.*

- [ ] Vérifier que `world_token_*.png` ne sont pas référencés et documenter leur usage Phase 6 prévu
- [ ] Vérifier incohérence de nommage `world_token_speed.png` vs univers "sonic"
- [ ] Exclure `tmp/` de l'archive release via `.gitignore` ou `.npmignore`
- [ ] Confirmer `DEV_UNLOCK_ALL = false` dans `constants.ts` avant release (`src/config/constants.ts` — actuellement `true`)
- [ ] Supprimer `.gitkeep` redondants dans dossiers universes déjà remplis

### Important
*À faire si temps disponible.*

- [ ] Archiver les docs patch log série 1001-1013 dans un sous-dossier `docs/patch-history/`
- [ ] Archiver les docs série 9xx (980-987, 960-961, audits/) dans `docs/archive/`
- [ ] Déplacer `public/assets/design-board-manifest.json` vers `design_boards/` ou `tmp/`
- [ ] Déplacer `public/assets/openmoji/OPENMOJI_COPY_REPORT.json` vers `tmp/`
- [ ] Supprimer `tmp/emoji/` localement (25 MB — déjà intégré dans openmoji)
- [ ] Créer `docs/release/` avec les 6 docs essentiels release listés ci-dessus

### Mineur
*Peut attendre.*

- [ ] Supprimer archives `tmp/patch*.tar.gz` obsolètes (patches < 1010) si espace disque nécessaire
- [ ] Supprimer captures `tmp/capture*/` (40 MB) si non utilisées pour référence
- [ ] Vérifier si `board_preview.png` et `theme_palette.json` sont utiles pour un futur menu de sélection
- [ ] Consolider les 4 docs audio 992_* en un seul document release

---

## Fichiers à ne pas toucher

Les dossiers et fichiers suivants sont sensibles — toute modification peut casser le build :

| Chemin | Raison |
|---|---|
| `src/` (intégral) | Code source actif — 58 modules TypeScript |
| `public/assets/ui/` | 40 backgrounds actifs référencés dynamiquement |
| `public/assets/runtime/` | 21 assets runtime tier rt_ actifs |
| `public/assets/audio/` | 5 SFX actifs |
| `public/assets/openmoji/` (SVG) | Icônes actives via `openmojiIconRegistry.ts` |
| `public/assets/universes/*/pickup_*.png` | Assets db_ tier actifs |
| `public/assets/universes/*/obstacle_*.png` | Assets db_ tier actifs |
| `public/assets/universes/*/boss.png` | Assets db_ tier actifs |
| `public/assets/universes/*/frame_tile.png` | Assets db_ tier actifs |
| `public/assets/universes/*/hud_panel.png` | Assets db_ tier actifs |
| `public/assets/frames/` | 8 cadres gameplay actifs |
| `public/assets/level-intros/` | 8 intros actives |
| `public/assets/map/world_map.png` | Fond world map actif |
| `public/assets/ui/worldmap/world_map_minimap_16_9.png` | Minimap active |
| `public/assets/ui/title/title_hub_bg.png` | Background titre actif |
| `package.json` + `package-lock.json` | Dépendances — ne pas modifier |
| `tsconfig.json` | Config TypeScript stricte |
| `vite.config.ts` | Config Vite |
| `CLAUDE.md` | Instructions projet |

---

## État des dossiers audités — chiffres clés

| Dossier | Fichiers | Taille | Statut |
|---|---|---|---|
| `docs/` | ~65 fichiers | < 5 MB | 20 actifs, ~45 archivables |
| `public/assets/audio/` | 6 | < 1 MB | 5 actifs, 1 placeholder |
| `public/assets/frames/` | 8 | ~5 MB | Tous actifs |
| `public/assets/level-intros/` | 8 | ~8 MB | Tous actifs |
| `public/assets/map/` | 2 | ~2 MB | 1 actif + 1 placeholder |
| `public/assets/openmoji/` | ~75 SVG + 1 JSON | ~1 MB | SVG actifs, JSON suspect |
| `public/assets/runtime/` | 21 PNG | ~15 MB | Tous actifs |
| `public/assets/ui/` | ~50 fichiers | ~80 MB | Tous actifs sauf world_token_* |
| `public/assets/universes/` | ~90 fichiers | ~30 MB | 72 PNG actifs, 16 suspects |
| `tmp/` | >200 fichiers | ~140 MB | 100% à exclure du release |
| `dist/` | générés | 141 MB | Exclure du source release |
| `node_modules/` | milliers | 211 MB | Toujours exclure |
| `design_boards/` | ~50 PNG + docs | 175 MB | Exclure du release minimal |

**Total à exclure d'un package release source minimal : ~670 MB**
**Total release source minimal estimé : ~50-60 MB (avant minification)**

---

## Prochaine étape recommandée

Compte tenu des résultats de l'audit :

- Build propre confirmé (0 erreur TypeScript, 58 modules)
- Assets actifs bien identifiés et structurés
- `DEV_UNLOCK_ALL = true` encore actif — **à corriger avant release**
- `world_token_*.png` non référencés — à clarifier en Phase 6
- Docs patch logs archivables sans risque

**Prochaine étape recommandée :**

```
PATCH 1015 — Title / Start Menu Readability Audit
```

Raison : le titre (TitleScene) est le premier écran visible. Avant tout release prototype, valider sa lisibilité sur mobile portrait et vérifier l'usage (ou non) des `world_token_*.png` clarifierait leur statut. C'est moins risqué qu'un smoke test final qui nécessite le cleanup préalable.

Alternative si cleanup urgent :

```
PATCH 1016 — Final Build Smoke Test
```

À préférer si le prototype doit être envoyé rapidement et que le cleanup peut attendre.
