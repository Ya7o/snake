# Ingestion d'assets externes — Méthode

## Principe

Les assets externes sont une source secondaire pour enrichir le prototype. Ils ne remplacent pas les developer assets et ne sont pas chargés automatiquement en gameplay.

Flux : **Source externe → _manual_drop/ ou scrape auto → _downloaded/ → QA manuelle → public/assets/universes/**

---

## Prérequis

- Node.js 18+
- `npx tsx` disponible (pas de dépendance locale requise)

---

## Structure des répertoires

```
public/assets/external/
├── _sources/
│   ├── externalAssetManifest.json   ← manifest centralisé (version 2)
│   ├── externalAssetIndex.json      ← index généré (après indexation)
│   └── externalAssetIndex.json
├── _licenses/
│   └── ASSET_SOURCES.md             ← licences et attributions
├── _manual_drop/
│   └── <sourceId>/                  ← déposer ici les fichiers manuels
├── _downloaded/
│   └── <sourceId>/                  ← assets staging (hors gameplay)
└── _audit/
    ├── audit-latest.json            ← rapport machine
    └── audit-latest.md              ← rapport lisible
```

### Modes de téléchargement (champ `downloadMode` du manifest)

| Mode | Comportement |
|------|-------------|
| `direct` | Télécharge depuis `directUrls[]`, refuse les réponses HTML |
| `opengameartPageScrape` | Scanne la page OGA et extrait les liens `/sites/default/files/` |
| `manual` | Imprime les instructions, importe depuis `_manual_drop/` si présent |

---

## Commandes

### Télécharger les sources approuvées (CC0)

```bash
npm run assets:download-external
```

### Télécharger aussi les sources userLicensed (prototype personnel)

```bash
ALLOW_USER_LICENSED_ASSETS=1 npm run assets:download-external
```

### Télécharger une source spécifique

```bash
npm run assets:download-external -- --source=racing_pack_kenney
```

### Simulation sans téléchargement

```bash
npm run assets:download-external -- --dry-run
```

### Générer l'index des assets présents

```bash
npm run assets:index-external
```

### Auditer l'état de toutes les sources

```bash
npm run assets:audit-external
```

Ouvre `public/assets/external/_audit/audit-latest.md` pour le rapport complet.

### Sources nécessitant un téléchargement manuel

Voir `docs/EXTERNAL_ASSET_MANUAL_DOWNLOAD_WORKFLOW.md` pour la procédure complète.

Résumé rapide :
1. Télécharger le fichier depuis la page source.
2. Déposer dans `public/assets/external/_manual_drop/<sourceId>/`.
3. Relancer `npm run assets:download-external`.

---

## Ajouter une nouvelle source

1. Éditer `public/assets/external/_sources/externalAssetManifest.json` — ajouter l'entrée.
2. Mettre à jour `src/assets/externalAssetManifest.ts` (`APPROVED_SOURCES` ou `REVIEW_REQUIRED_SOURCES`, `UNIVERSE_SOURCE_MAP`).
3. Documenter la licence dans `public/assets/external/_licenses/ASSET_SOURCES.md`.
4. Relancer `npm run assets:download-external` et `npm run assets:index-external`.

---

## Intégrer un asset en gameplay (après QA)

Les assets dans `_downloaded/` ne sont **jamais** chargés directement par Phaser.

Étapes pour promouvoir un asset :

1. Extraire le sprite/tileset utile (recadrage manuel ou outil).
2. Copier dans `public/assets/universes/<univers>/`.
3. Vérifier que la grille Snake reste lisible.
4. Tester mobile portrait.
5. Documenter dans le ticket de modification.

---

## Règles impératives

- `review_required` : jamais sans opt-in `ALLOW_USER_LICENSED_ASSETS=1`.
- Le script refuse toute réponse HTTP avec `Content-Type: text/html` (guard anti-page-HTML).
- Ne jamais déposer dans `_downloaded/` directement — toujours via `_manual_drop/`.
- Aucun asset externe directement en `src/` ou `public/assets/frames/`.
- CC-BY : attribution obligatoire dans `ASSET_SOURCES.md` si distribué.
- Les archives ZIP restent dans `_downloaded/`, jamais dans `public/` à la racine.
