# Review

## Objectif

Créer un script reproductible pour générer une archive source propre de Snake Drive V4,
afin de rendre le restore test (PATCH 1027) reproductible.

Contexte : PATCH 1023 avait échoué car aucune archive source propre n'était trouvable.

## Résultat

Script créé et exécuté avec succès :

- `scripts/create-clean-source-archive.sh` — script bash exécutable
- Archive générée : `/mnt/c/Users/Boris/snake/tmp/snake-drive-v4-clean-source.tar.gz`
- Taille : 137M
- Entrées : 542
- Toutes les exclusions vérifiées : OK

## Fichiers modifiés

- `scripts/create-clean-source-archive.sh` — script créé
- `reports/patch-1026/review.md` — ce fichier
- `reports/patch-1026/docs/archive-script-notes.md` — documentation du script
- `reports/patch-1026/logs/archive-check.txt` — résultat de vérification archive
- `reports/patch-1026/logs/archive-listing-summary.txt` — résumé du listing archive

Fichiers NON committés (exclus par `.gitignore`) :
- `tmp/snake-drive-v4-clean-source.tar.gz` — archive générée
- `tmp/verify-archive.sh` — script de vérification temporaire

## Tests / vérifications

### bash scripts/create-clean-source-archive.sh

```
=== Snake Drive V4 — Clean Source Archive ===
Repo root : /mnt/c/Users/Boris/snake
Output    : /mnt/c/Users/Boris/snake/tmp/snake-drive-v4-clean-source.tar.gz
Archive created.
Size      : 137M
Entries   : 542
```

Résultat : OK

### tar -tzf archive

```
tar -tzf /mnt/c/Users/Boris/snake/tmp/snake-drive-v4-clean-source.tar.gz
```

Résultat : listable, 542 entrées. OK

### Vérification exclusions

| Exclusion     | Résultat |
|---------------|----------|
| node_modules  | exclu OK |
| dist          | exclu OK |
| .git          | exclu OK |
| tmp           | exclu OK |
| design_boards | exclu OK |
| tickets       | exclu OK |

Note : `.gitignore` est présent (normal — seul le dossier `.git/` est exclu, pas le fichier `.gitignore`).

### npm run check

```
tsc && vite build
✓ 60 modules transformed.
✓ built in 13.14s
```

Résultat : OK (0 erreur TypeScript)
Warning connu : `chunk > 500 kB` — non bloquant, attendu.

## Captures

Aucune capture requise (tâche tooling sans interface visuelle).

## Documents

- [reports/patch-1026/docs/archive-script-notes.md](docs/archive-script-notes.md)

## Limites / risques

- L'archive générée (`tmp/`) n'est **pas committée** (exclu par `.gitignore`).
- L'archive doit être recréée si le code source change entre PATCH 1026 et PATCH 1027.
- PATCH 1027 devra tester la restauration depuis cette archive (npm install + npm run check dans un dossier temporaire propre).
- Le script doit être lancé depuis la racine du repo via WSL (bash) ou tout shell compatible POSIX.
- `npm run check` peut échouer en OOM si peu de RAM disponible — fermer Chrome et relancer.
- Le script utilise `set -euo pipefail` ; la commande `head -20` finale est protégée par `|| true` pour éviter SIGPIPE.

## Liens GitHub

- Commit : (voir ci-dessous après push)
- PR : N/A (push direct sur main)
