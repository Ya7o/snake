# PATCH 1015 — Title / Start Menu Readability Audit + Repo Cleanup Plan

## Objectif

Auditer l'écran Title / Start Menu et proposer un plan de nettoyage complet du repo avant release prototype.

---

## Title / Start Menu Audit

### Environnement de test

- Viewport : 390×844 px (portrait iPhone 14, représentatif Android portrait)
- Navigateur : Chromium headless via Puppeteer
- Délai de capture : 4 s après `domcontentloaded` (fade-in + animations actives)
- URL : `http://localhost:5174/` (Vite dev build)

### Capture écran — title_default.png

Résultat visible :

- Fond : image `title_hub_bg.png` chargée correctement (paysage cosmique multi-univers, style neon Mega Drive)
- Overlay sombre (opacity 0.38) correctement appliqué
- Titre **SNAKE** : vert lime (#83ff63), shadow violet (#3a0099), environ 46px, positionné à 22% H — lisible, dominant
- Sous-titre **DRIVE** : rose (#ff6ccc), positionné à 31% H — lisible
- Séparateur horizontal violet léger : 36,5% H — présent
- Stats **8 MONDES · 16 NIVEAUX / 8 BOSS À DÉBLOQUER** : blanc (#d9d9e8), UI_FONT 700, 14px — lisible, centré
- Capsule CTA **TOUCHER POUR JOUER** : fond sombre, bordure teal (#00d7c0), texte jaune (#ffe66a), 74% H — bien visible
- Animation blink sur titre et CTA : fonctionnelles (alpha oscillant)
- Footer **PROTOTYPE BUILD** : très discret (#2a2244), voulu bas contraste, ne gêne pas

### Capture écran — worldmap_after_start.png

Résultat visible :

- Transition fonctionnelle (fadeOut 200ms → WORLD_MAP → fadeIn)
- WorldMap affichée correctement : niveaux visibles (Castle of Illusion, Shinobi), tokens colorés
- Barre footer WorldMap visible en bas
- Aucune erreur de rendu visible

---

## Table d'audit

| Critère | Statut | Notes |
|---|---|---|
| Titre SNAKE lisible | **PASS** | Vert lime dominant, taille adaptée, shadow visible |
| Sous-titre DRIVE lisible | **PASS** | Rose, lisible, bien séparé |
| Bouton START (CTA) lisible | **PASS** | "TOUCHER POUR JOUER" jaune sur fond sombre, bordure teal |
| Mobile portrait 390×844 | **PASS** | Aucun débordement, tous éléments dans le viewport |
| Texte non coupé | **PASS** | Tous les textes complets, padding correct |
| Pas de chevauchement | **PASS** | Espacement correct entre tous les éléments |
| Fond / layout | **PASS** | Image de fond chargée, overlay correct, pas de noir inattendu |
| Transition WorldMap | **PASS** | fadeOut → scène WorldMap → fadeIn fonctionnel |
| Cohérence DA Mega Drive | **PASS** | Palette neon, ARCADE_FONT sur titres, UI_FONT sur texte fonctionnel |
| Cohérence avec nouvelle WorldMap | **PASS** | Même palette, même style, enchaînement fluide |
| Audio bouton | **PASS réserve** | `AudioSystem.uiButton()` appelé sur tap (code vérifié), non testé dans Chromium headless (WebAudio bloqué sans interaction réelle) |
| Première impression prototype | **PASS** | Look premium pour un prototype, atmosphérique |

---

## Verdict Title

**PASS**

L'écran Title est fonctionnel, lisible, cohérent DA, et prêt pour un export prototype.

### Réserve mineure

- **Audio** : le son bouton est câblé correctement dans le code (`AudioSystem.uiButton()`) mais non testifiable en headless. À valider manuellement sur appareil.
- **world_token_*.png** : 8 fichiers PNG dans `public/assets/ui/title/` ne sont **pas référencés** dans le code source. Orphelins probables. À vérifier avant suppression.

---

## Corrections recommandées Title

Aucune correction bloquante. Pour un polish optionnel (PATCH 1015B ou ultérieur) :

1. **Vérifier l'orphelinat des world_token_*.png** — confirmer s'ils sont utilisés (WorldMapScene, LevelIntroScene, etc.) ou supprimer après confirmation.
2. **Test audio manuel sur appareil** — valider que `AudioSystem.uiButton()` produit bien un son au premier tap (certains navigateurs mobiles requièrent une interaction préalable pour débloquer WebAudio).
3. **"PROTOTYPE BUILD" footer** — très bas contraste intentionnel, acceptable pour prototype. À retirer ou rendre encore plus discret pour release.

---

## Audit repo /home/kali/snake

### Résumé par dossier (tailles réelles mesurées)

| Dossier | Taille | Contenu |
|---|---|---|
| `src/` | 416 K | Code source TypeScript (60 fichiers) — propre et organisé |
| `public/` | 139 M | Assets runtime + index.html |
| `public/assets/ui/` | 85 M | Backgrounds gameplay par univers (8×~10MB) + title + worldmap |
| `public/assets/level-intros/` | 19 M | 8 images intro de niveau |
| `public/assets/universes/` | 18 M | db_ assets : pickups, obstacles, boss, frames |
| `public/assets/frames/` | 14 M | Cadres gameplay par univers |
| `public/assets/map/` | 2.8 M | world_map.png |
| `public/assets/openmoji/` | 392 K | Icônes OpenMoji sélectionnées |
| `public/assets/runtime/` | 1.9 M | rt_ assets 7 univers (sauf castle) |
| `public/assets/audio/` | 172 K | SFX audio |
| `docs/` | 448 K | Documentation (~75 fichiers .md) |
| `tmp/` | 160 M | Captures, archives patch, emoji SVG pack |
| `design_boards/` | 175 M | Sources design par univers + "Incoming univers 1" |
| `dist/` | 141 M | Build Vite (artefact généré) |
| `node_modules/` | 211 M | Dépendances npm |

**Total estimé repo : ~890 M** (sans node_modules : ~680 M)

### Détail tmp/

| Élément | Taille | Nature |
|---|---|---|
| `patch1000_capture_audit.tar.gz` | 14 M | Archive captures patch 1000 |
| `patch1001_outrun_layout_audit.tar.gz` | 546 K | Archive patch 1001 |
| `patch1002_global_capture_audit.tar.gz` | 24 M | Archive captures patch 1002 |
| `patch1003_clear_contrast_audit.tar.gz` | 2.3 M | Archive patch 1003 |
| `patch1007A_*.tar.gz` (2 fichiers) | ~16 K | Archives patch 1007A |
| `patch1007B_package.tar.gz` | 2.3 M | Archive patch 1007B |
| `patch1008_package.tar.gz` | 562 K | Archive patch 1008 |
| `patch1009_package.tar.gz` | 9.3 M | Archive patch 1009 |
| `patch1010_package.tar.gz` | 7.6 M | Archive patch 1010 |
| `patch1011_boss_capture_audit.tar.gz` | 2.4 M | Archive patch 1011 |
| `patch1012_phase5_closure.tar.gz` | 3.6 K | Archive patch 1012 |
| `patch1013A_package.tar.gz` | 6.2 M | Archive patch 1013A |
| `patch1013B_package.tar.gz` | 2.5 M | Archive patch 1013B |
| `patch1014_package.tar.gz` | 9.7 K | Archive patch 1014 |
| `capture/` | 14 M | Dossier captures patch 1000 |
| `capture1001/` | 576 K | Captures patch 1001 |
| `capture1002/` | 24 M | Captures patch 1002 |
| `capture1003/` | 2.3 M | Captures patch 1003 |
| `emoji/` | 25 M | Pack SVG OpenMoji complet (4 496 fichiers) |
| `patch999/` | 15 M | Captures anciennes (pré-1000) |
| `patch1007A/` | 80 K | Dossier patch 1007A |
| `patch1010/` | 7.8 M | Dossier patch 1010 |
| `patch1011/` | 2.5 M | Dossier patch 1011 |
| `patch1014/` | 28 K | Dossier patch 1014 |

### Détail design_boards/

| Dossier | Taille | Contenu |
|---|---|---|
| `castle/` | 11 M | Sources design univers Castle |
| `fighter/` | 8.8 M | Sources design univers Fighter |
| `kombat/` | 9.1 M | Sources design univers Kombat |
| `outrun/` | 19 M | Sources design univers OutRun |
| `paperboy/` | 9.8 M | Sources design univers Paperboy |
| `shinobi/` | 8.6 M | Sources design univers Shinobi |
| `sonic/` | 8.5 M | Sources design univers Sonic |
| `streets/` | 8.4 M | Sources design univers Streets |
| `minimap/` | 8.4 M | Design boards minimap (récents) |
| `Incoming univers 1/` | 85 M | Pack design futur univers non intégré |

---

## À conserver absolument

| Élément | Raison |
|---|---|
| `src/` | Code source complet du jeu |
| `public/assets/` | Tous les assets runtime actifs |
| `public/index.html` | Point d'entrée |
| `package.json` | Dépendances et scripts |
| `package-lock.json` | Verrouillage versions exactes |
| `tsconfig.json` | Configuration TypeScript |
| `vite.config.ts` | Configuration build |
| `CLAUDE.md` | Instructions de développement |
| `README.md` | Documentation projet |
| `docs/00_REPO_STRUCTURE.md` → `docs/18_REPO_CLEANUP_LOG.md` | Docs de référence projet |
| `docs/audits/` | Audits qualité |
| `docs/1001_*.md` à `docs/1015_*.md` | Historique des patches actifs |

---

## À exclure du package release

| Élément | Raison |
|---|---|
| `node_modules/` (211 M) | Généré par `npm install` |
| `dist/` (141 M) | Build artifact, regénérable avec `npm run build` |
| `tmp/` (160 M) | Captures, archives patch, debug |
| `tmp/emoji/` (25 M) | Pack SVG source complet, non nécessaire en release |
| `tmp/patch*.tar.gz` (~70 M) | Archives historiques patches |
| `tmp/capture*/` (~40 M) | Captures screenshots patches |
| `tmp/patch999/` (15 M) | Captures pré-1000 |
| `.gitignore` patterns | Artefacts de build locaux |

---

## À archiver hors repo

| Élément | Raison |
|---|---|
| `design_boards/` (175 M) | Sources design non nécessaires en runtime |
| `design_boards/Incoming univers 1/` (85 M) | Futur univers non intégré |
| `tmp/emoji/` (25 M) | Pack source OpenMoji complet |
| `tmp/patch*/` dossiers et archives | Historique patches dev |
| `docs/984_PROMPTS_FOR_FUTURE_UNIVERSES.md` | Prompts génération, pas release |
| `docs/990_DO_NOT_TOUCH_V3.md`, `docs/990_GLOBAL_ICON_POLICY_V3.md`, etc. | Docs V3 legacy |

---

## À vérifier avant suppression

| Élément | Doute | Action requise |
|---|---|---|
| `public/assets/ui/title/world_token_*.png` (8 fichiers) | Aucune référence trouvée dans src/ | Grep étendu + vérification WorldMapScene et LevelIntroScene à l'exécution |
| `public/assets/map/world_map.png` | Présent mais `WORLD_MAP_MINIMAP` référence `world_map_minimap_16_9.png` | Vérifier si `world_map.png` est encore utilisé |
| `docs/990_*.md` (V3 legacy) | Potentiellement obsolètes | Relire chaque fichier avant suppression |
| `docs/audits/MOBILE_FIRST_*.md` | Audits anciens, possiblement dépassés | Conserver comme historique ou archiver |
| Assets `runtime/universes/` vs `universes/` | Deux systèmes coexistent (rt_ et db_) | Valider que les 7 dossiers runtime non-castle sont tous utilisés |

---

## Suppression recommandée plus tard

| Chemin | Action future | Raison | Risque | Condition |
|---|---|---|---|---|
| `tmp/emoji/` | Supprimer | Pack SVG source complet (4 496 fichiers, 25 M) non utilisé à runtime | Faible — les PNGs sélectionnés sont dans `public/assets/openmoji/` | Vérifier qu'aucun script ne dépend du dossier emoji/ |
| `tmp/patch999/` | Supprimer | Captures pré-1000, anciens screenshots de debug | Faible — aucune référence code | Revue rapide du contenu |
| `tmp/capture/`, `tmp/capture1001/`, `tmp/capture1002/`, `tmp/capture1003/` | Supprimer | Dossiers screenshots redondants avec archives tar.gz | Faible | S'assurer que les .tar.gz sont conservés ailleurs |
| `tmp/patch1000_capture_audit.tar.gz` | Archiver hors repo | 14 M, archive capture ancienne | Faible | Déplacer vers archive externe |
| `tmp/patch1002_global_capture_audit.tar.gz` | Archiver hors repo | 24 M, plus grand archive capture | Faible | Déplacer vers archive externe |
| `design_boards/Incoming univers 1/` | Archiver hors repo | 85 M, futur univers non intégré — encombre le repo | Faible | Archiver dans `~/snake_archive/` avant suppression |
| `public/assets/ui/title/world_token_*.png` | Supprimer après vérification | 8 PNGs non référencés dans src/ | Moyen — à confirmer par grep exhaustif | Grep complet + test build sans ces fichiers |
| `public/assets/map/world_map.png` | Vérifier + supprimer si orphelin | Possiblement remplacé par `world_map_minimap_16_9.png` | Moyen | Grep toutes références + test visuel |
| `dist/` | Supprimer (regénérable) | Build artifact, 141 M | Nul — `npm run build` le recrée | Uniquement si stockage critique |
| `docs/990_DO_NOT_TOUCH_V3.md`, `docs/990_GLOBAL_ICON_POLICY_V3.md`, `docs/990_QA_AND_ACCEPTANCE_V3.md`, etc. | Archiver | Docs V3 legacy, projet en V4 | Faible — historique uniquement | Revue rapide avant archivage |

---

## Plan de nettoyage recommandé

### Étape 1 — Sauvegarde complète

```bash
# À exécuter AVANT toute suppression
mkdir -p /home/kali/snake_archive
tar -czf /home/kali/snake_archive/snake_full_backup_$(date +%Y%m%d).tar.gz \
    -C /home/kali snake \
    --exclude='snake/node_modules' \
    --exclude='snake/dist'
```

Conserver l'archive `snake_full_backup_*.tar.gz` sur stockage externe.

### Étape 2 — Exclusions release

Exclure du package release source :

- `node_modules/` → `npm install` au déploiement
- `dist/` → `npm run build` à la livraison
- `tmp/` → développement uniquement
- Archives `patch*.tar.gz` → historique dev

### Étape 3 — Archive design

Déplacer `design_boards/` vers `~/snake_archive/design_boards/` ou stockage externe.
Priorité : `Incoming univers 1/` (85 M).

### Étape 4 — Assets runtime

**Ne supprimer aucun asset sans scan de références préalable.**

Actions recommandées :
1. Produire un manifest des assets utilisés (grep automatique de tous les chemins dans src/)
2. Identifier les orphelins confirmés
3. Supprimer uniquement après validation

Suspects prioritaires : `world_token_*.png`, `world_map.png`

### Étape 5 — Docs

- Conserver `docs/00_*.md` à `docs/18_*.md` (référence)
- Conserver `docs/1001_*.md` à `docs/1015_*.md` (patches actifs)
- Archiver `docs/990_*.md` (V3 legacy)
- Créer `docs/release/` pour notes de version

### Étape 6 — Build final et smoke test

```bash
npm run build
# Vérifier dist/ : 0 erreur, bundle ~1.6 MB gzippé ~376 KB
# Smoke test : ouvrir dist/index.html, vérifier Title → WorldMap → niveau 1
```

---

## Commandes possibles plus tard — NE PAS EXÉCUTER DANS CE PATCH

```bash
# Sauvegarde complète avant nettoyage
mkdir -p /home/kali/snake_archive
tar -czf /home/kali/snake_archive/snake_full_backup_before_cleanup.tar.gz \
    -C /home/kali snake \
    --exclude='snake/node_modules' \
    --exclude='snake/dist'

# Package release source propre
tar --exclude='snake/node_modules' \
    --exclude='snake/tmp' \
    --exclude='snake/design_boards' \
    --exclude='snake/dist' \
    --exclude='snake/.git' \
    -czf /home/kali/snake_release_source.tar.gz \
    -C /home/kali snake

# Vérifier le contenu du package release
tar -tzf /home/kali/snake_release_source.tar.gz | head -30

# Archive design_boards séparée (hors repo)
tar -czf /home/kali/snake_archive/design_boards_archive.tar.gz \
    -C /home/kali/snake design_boards

# SEULEMENT après confirmation d'orphelinat :
# rm /home/kali/snake/public/assets/ui/title/world_token_*.png
# rm /home/kali/snake/public/assets/map/world_map.png
```

**Important : Ne pas exécuter de suppression. Ne pas exécuter `rm`. Ne pas déplacer `design_boards` maintenant.**

---

## Build Result

- Commande : `npm run build` (via `npm run check`)
- Résultat : **✓ build réussi en 12.46s**
- TypeScript : **0 erreur**
- Bundle : `dist/assets/index-CH6wkeS3.js` — 1 607 KB (gzip: 375 KB)
- Warning : chunk > 500 KB (attendu pour Phaser 3 — non bloquant)
- Modules : build complet

---

## Recommandation prochaine étape

Title : **PASS** — aucune correction bloquante.

**Prochaine étape recommandée : PATCH 1016 — Final Build Smoke Test**

- Smoke test complet : Title → WorldMap → chaque univers niveau 1 → boss accessible
- Validation audio sur appareil réel
- Vérification `DEV_UNLOCK_ALL` (actuellement `true` dans `constants.ts` — passer à `false` avant release)
- Cleanup réel uniquement après 1016/1017

Cleanup repo réel uniquement après validation complète de la build.
