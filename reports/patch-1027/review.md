# Review

## Objectif

Tester que l'archive source propre générée par PATCH 1026 peut être restaurée dans un dossier vide et reconstruite.

## Résultat

**RESTAURATION RÉUSSIE**

L'archive `/mnt/c/Users/Boris/snake/tmp/snake-drive-v4-clean-source.tar.gz` (137 MB, 542 entrées) a été extraite avec succès dans `D:\tmp\snake-drive-v4-restore-test`. Les vérifications TypeScript et Vite passent sans erreur (60 modules, 0 erreur TypeScript, build en 8.74s).

Adaptations nécessaires :
- C: plein (0 Go libre) → extraction sur D: (19,65 Go libres).
- tar via WSL vers chemin NTFS échoue → workaround : `tar.exe` Windows natif.

## Fichiers modifiés

- reports/patch-1027/review.md
- reports/patch-1027/docs/restore-test.md
- reports/patch-1027/logs/restore-summary.txt

## Tests / vérifications

Commandes lancées :

```bash
# Vérification archive
wsl -- tar -tzf /mnt/c/Users/Boris/snake/tmp/snake-drive-v4-clean-source.tar.gz
```

```powershell
# Extraction (tar Windows natif — C: plein)
& "C:\Windows\System32\tar.exe" -xzf "C:\Users\Boris\snake\tmp\snake-drive-v4-clean-source.tar.gz" -C "D:\tmp\snake-drive-v4-restore-test"

# Build
cd D:\tmp\snake-drive-v4-restore-test
npm install
npm run check
```

Résultats :

| Étape             | Résultat |
|-------------------|----------|
| Archive trouvée   | OK       |
| tar -tzf          | OK — 542 entrées |
| Exclusions .git   | ABSENT (OK) |
| Exclusions node_modules | ABSENT (OK) |
| Exclusions dist   | ABSENT (OK) |
| Exclusions tmp    | ABSENT (OK) |
| Exclusions tickets | ABSENT (OK) |
| Extraction        | OK — Exit code 0 |
| npm install       | OK — 19 packages, 0 vulnérabilités |
| npm run check     | OK — 0 erreur TS, 60 modules, 8.74s |

## Captures

Aucune capture requise (tâche audit/build).

## Documents

- reports/patch-1027/docs/restore-test.md
- reports/patch-1027/logs/restore-summary.txt

## Limites / risques

- **C: plein (0 Go)** — extraction réalisée sur D: ; libérer C: avant toute opération de restauration future.
- **tar WSL → NTFS** — incompatible ; utiliser `tar.exe` Windows natif ou extraire vers un chemin WSL natif.
- **docs/design_boards/** — 4 fichiers .md présents dans l'archive (sous `docs/`, pas racine) ; non bloquant.
- **npm install** — dépend du réseau (npmjs.com).
- **npm run check** — RAM-dependent ; risque OOM si charge mémoire élevée.
- Warning Rollup `chunk > 500 kB` — connu et attendu, non bloquant.

## Liens GitHub

- Commit : https://github.com/Ya7o/snake/commit/0f57e9b8c4b747f636016afb13ae61eec2126997
- PR : aucun (patch direct sur main)
- Review : https://github.com/Ya7o/snake/blob/main/reports/patch-1027/review.md
