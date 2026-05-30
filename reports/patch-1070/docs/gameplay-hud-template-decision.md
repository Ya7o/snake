# PATCH 1070 — Gameplay HUD Template Decision

**Date:** 2026-05-30
**Type:** Product decision / UI template / Audit
**Status:** Pending decision — no code modified

---

## Contexte

Lors du QA mobile réel, le HUD gameplay présente deux formes distinctes selon l'univers :

- **Castle** : 3 capsules pill arrondies, fond transparent, bords dorés/violets
- **Tous les autres univers** (Sonic, Streets, Fighter, OutRun, Shinobi, Kombat, Paperboy) : bande opaque plein écran, image `hud_panel.png`, séparateur accent en haut et en bas

Cette divergence est **intentionnelle dans le code** : le paramètre `capsuleMode` du `HUDRenderer` est explicitement `true` uniquement pour Castle (voir `GameScene.ts` ~ligne 185 : `uid === 'castle'`).

---

## Analyse technique

### Implémentation Castle — mode capsule

Fichier clé : `src/render/HUDRenderer.ts`, constructeur `capsuleMode = true`

```
┌───────────────────────────────────────────────────────────┐
│  [  CASTLE  ]     [   MURS FANTÔMES   ]     [ MAGIC 7/10]  │
│   capsule 1          capsule 2 (centre)        capsule 3   │
└───────────────────────────────────────────────────────────┘
```

- Fond transparent (`alpha = 0`) sur la bande HUD
- 3 pills dessinées en Graphics avec `fillRoundedRect` + `strokeRoundedRect`
- Restyling via `styleCastleRuntimeHud()` : fill `0x12071d`, stroke doré `0xf6c45c`, inner glow violet `0xa94cff`
- Textes centrés dans chaque pill (1/6, 1/2, 5/6 de la largeur)
- Police ARCADE pour nom univers, UI_FONT pour règle et score
- Grille élargie : 16×26 (CASTLE_GRID_ROWS = GRID_ROWS + 6), width 75%, Y bias 38%

### Implémentation autres univers — mode bande large

Fichier clé : `src/render/HUDRenderer.ts`, constructeur `capsuleMode = false` (défaut)

```
╔═══════════════════════════════════════════════════════════╗  ← accent bar (couleur univers)
║  SONIC ▸              RING CHAINS              ▸ 7/10    ║
╚═══════════════════════════════════════════════════════════╝  ← séparateur (alpha 0.35)
```

- Rectangle plein `0x07030f` opaque sur toute la largeur
- `hud_panel.png` de l'univers en overlay (alpha 0.55)
- Barre accent en haut (2px, couleur palette `accent`)
- Séparateur bas (1px, alpha 0.35)
- Nom univers aligné gauche, règle centrée, score aligné droit
- Grille standard : 16×20, width 94%, Y bias 22%

### Origine de la différence

La bifurcation est **explicite et délibérée** dans `GameScene.ts` :

```typescript
const readableHudPanelKey = uid === 'castle' ? undefined : ...
this.hudRenderer = new HUDRenderer(this, palette.accent, readableHudPanelKey, uid === 'castle');
//                                                                              ^^^^^^^^^^^^^^^^^^^
//                                                                              capsuleMode = true SEULEMENT pour Castle
```

Castle est aussi le seul univers à appeler `styleCastleRuntimeHud()` et `drawCastleRuntimeBoardPanel()`.

---

## Captures de référence (QA)

| Capture | Fichier | Description |
|---|---|---|
| Castle HUD — capsules | `screenshots/hud_castle_capsules.png` | 3 pills dorées/violettes, fond transparent |
| Paperboy HUD — bande | `screenshots/hud_paperboy_strip.png` | Bande opaque verte, hud_panel.png overlay |
| OutRun HUD — bande | `screenshots/hud_outrun_strip.png` | Bande opaque rose/magenta, boss HP |

---

## Tableau de décision

| Option | Avantages | Risques | Recommandation |
|---|---|---|---|
| **A — Garder Castle capsules comme template universel** | Visuellement distinctif, cohérent avec l'esthétique fantasy/medieval de Castle ; fond transparent laisse voir le wallpaper | Ne convient pas pour tous les univers (Sonic neon ≠ Castle purple) ; migrer 7 univers = refonte visuelle majeure | Non recommandé sans redesign de chaque palette |
| **B — Garder bande large autres mondes comme template universel** | Lisibilité maximale sur mobile (fond opaque) ; hud_panel.png par univers donne déjà une personnalisation suffisante ; solution éprouvée en QA | Castle perdrait son identité visuelle capsule-pill ; effort moyen pour Castle | Acceptable si cohérence > identité Castle |
| **C — Autoriser variations par univers (statu quo)** | Aucune migration ; chaque univers conserve son HUD optimisé ; Castle = capsules, autres = bande | Inconsistance perçue en QA inter-univers ; maintien de deux branches de code distinctes | **Recommandé** — la différence est assumée et fonctionnelle |
| **D — Créer template hybride** | Meilleur des deux : capsules + fond semi-opaque pour tous | Effort de développement significatif ; risque de régressions HUD ; capsules mal adaptées à textes longs (ex. RING CHAINS, CROWD BLOCKERS) | Non recommandé à ce stade |

---

## Analyse par critère

### Impact mobile

| Critère | Castle capsules | Bande large |
|---|---|---|
| Lisibilité fond clair | ★★★ — fond transparent risqué si wallpaper clair | ★★★★★ — fond `#07030f` toujours lisible |
| Touch target HUD | ★★★★ — 56px height, 46px min OK | ★★★★★ — idem + séparateur visuel clair |
| Texte tronqué | ★★★ — `fitOneLine()` contraint à `capW × 0.82` | ★★★★ — contrainte sur largeur écran entière |
| Cohérence visuelle | ★★★ — capsules élégantes mais spécifiques Castle | ★★★★★ — même look pour 7 univers |

### Impact lisibilité

- **Capsules** : le texte est centré dans chaque pill, longueur maximale limitée à `capW × 0.82` ≈ 82% d'un tiers de l'écran. Les noms de règles longs comme "CROWD BLOCKERS" ou "RING CHAINS" sont compressés (font-size réduit par `fitOneLine()`).
- **Bande large** : le texte central dispose de ~60% de la largeur écran. Pas de compression dans les cas normaux.

### Coût de migration

| Scénario | Effort estimé | Risque |
|---|---|---|
| Migrer Castle → bande large | Moyen — supprimer `styleCastleRuntimeHud()`, désactiver capsuleMode | Perte identité Castle, board panel différent |
| Migrer 7 univers → capsules | Élevé — adapter `capW` / textes pour 7 palettes différentes | Régression lisibilité sur textes longs |
| Statu quo (option C) | Nul | Maintenabilité : 2 branches HUD dans le code |
| Template hybride | Élevé (2–4 sprints) | Régressions cross-univers |

---

## Recommandation finale

**Option C — Statu quo : autoriser les variations par univers.**

**Justification :**

1. La différence est **délibérée** dans le code, non un bug. Castle a été conçu avec une identité visuelle distincte (panel violet/doré, capsules pill) cohérente avec son esthétique fantasy.
2. La bande large des autres univers **offre une lisibilité supérieure** pour les textes de règles longs, ce qui est un avantage, pas un défaut.
3. Le coût de migration vers un template unifié est disproportionné par rapport au gain utilisateur.
4. Les deux implémentations passent les contraintes mobiles (HEIGHT 56px, textes lisibles, touch targets conformes).

**Condition d'acceptation :** Documenter explicitement dans `HUDRenderer.ts` que le `capsuleMode` est une variation de design assumée, pas une dette technique.

**Ne pas modifier le code avant décision product validée.**

---

## Références code

| Fichier | Ligne | Rôle |
|---|---|---|
| `src/render/HUDRenderer.ts` | 1–50 | Implémentation capsule mode (Castle) |
| `src/render/HUDRenderer.ts` | 55–95 | Implémentation strip mode (autres univers) |
| `src/scenes/GameScene.ts` | ~185 | Bifurcation `uid === 'castle'` → capsuleMode |
| `src/scenes/GameScene.ts` | ~220 | `styleCastleRuntimeHud()` — capsule restyling Castle |
| `src/ui/CastleRuntimeLayering.ts` | 14 | `drawCastleRuntimeBoardPanel()` — board panel Castle |
| `src/ui/RuntimeUILayout.ts` | 1–5 | `GAMEPLAY_HUD.HEIGHT = 56` |
