# Restore Test — PATCH 1027

## Contexte

PATCH 1023 a échoué (archive introuvable).
PATCH 1026 a créé l'archive locale `/mnt/c/Users/Boris/snake/tmp/snake-drive-v4-clean-source.tar.gz`.
PATCH 1027 teste la restauration depuis cette archive.

## Environnement

- OS : Windows 10 Pro 10.0.19045 + WSL2
- PowerShell 5.1 (npm)
- tar.exe natif Windows (extraction)
- C: plein (0 Go libre) — extraction sur D: (19,65 Go libres)

## Commandes et résultats

### 1. Vérification archive

```
Test-Path "C:\Users\Boris\snake\tmp\snake-drive-v4-clean-source.tar.gz"
→ True (143 654 073 octets)
```

### 2. Listage archive

```bash
wsl -- tar -tzf /mnt/c/Users/Boris/snake/tmp/snake-drive-v4-clean-source.tar.gz
→ 542 entrées listées
```

### 3. Vérification exclusions

| Répertoire    | Statut       | Détail                                          |
|---------------|--------------|-------------------------------------------------|
| .git/         | ABSENT (OK)  |                                                 |
| node_modules/ | ABSENT (OK)  |                                                 |
| dist/         | ABSENT (OK)  |                                                 |
| tmp/          | ABSENT (OK)  |                                                 |
| tickets/      | ABSENT (OK)  |                                                 |
| design_boards/| ABSENT racine (OK) | Présent uniquement dans docs/design_boards/ — 4 fichiers .md de documentation |

### 4. Extraction

```powershell
# tar WSL → NTFS : échec (Cannot utime, Cannot write, No space on C:)
# Solution : tar.exe Windows natif

& "C:\Windows\System32\tar.exe" -xzf "C:\Users\Boris\snake\tmp\snake-drive-v4-clean-source.tar.gz" -C "D:\tmp\snake-drive-v4-restore-test"
→ Exit code : 0 — OK
```

### 5. Structure restaurée

```
D:\tmp\snake-drive-v4-restore-test\
├── src/          (config, core, data, mechanics, qa, render, scenes, systems, ui, worldmap, main.ts)
├── public/
│   └── assets/   (audio, frames, level-intros, map, openmoji, runtime, ui, universes)
├── docs/
├── reports/
├── scripts/      (create-clean-source-archive.sh présent)
├── package.json
├── CLAUDE.md
└── vite.config.ts
```

### 6. npm install

```powershell
cd D:\tmp\snake-drive-v4-restore-test
npm install
→ added 19 packages
→ 0 vulnerabilities
→ Durée : 3s
→ OK
```

### 7. npm run check

```powershell
npm run check
→ tsc && vite build
→ 0 erreur TypeScript
→ 60 modules transformés
→ Build en 8.74s
→ Warning chunk > 500 kB (connu, non bloquant)
→ OK
```

## Verdict

**RESTAURATION RÉUSSIE**

L'archive générée par PATCH 1026 peut être extraite dans un environnement vierge, reconstruite avec `npm install` + `npm run check`, sans erreur TypeScript ni erreur de build.

## Risques et limites

- **C: plein** — le test nécessite un disque alternatif (D:). En production, libérer l'espace sur C: avant extraction.
- **tar WSL → NTFS** — génère des erreurs de permissions. Workaround : utiliser `tar.exe` Windows natif ou extraire vers un chemin WSL natif (`/tmp/`).
- **npm install** dépend du réseau (npmjs.com).
- **npm run check** est RAM-dependent — risque OOM si peu de RAM disponible.
- `docs/design_boards/` (4 fichiers .md) est présent dans l'archive. Ce sont des docs, pas des assets. Non bloquant mais à surveiller si l'exclusion stricte est requise.
