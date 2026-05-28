# Archive Script Notes

## Commande

```bash
bash scripts/create-clean-source-archive.sh
```

## Sortie

```
/mnt/c/Users/Boris/snake/tmp/snake-drive-v4-clean-source.tar.gz
```

## Exclusions

Le script exclut les chemins suivants :

| Chemin exclu       | Raison                                        |
|--------------------|-----------------------------------------------|
| `./node_modules`   | Dépendances régénérables via npm install      |
| `./dist`           | Artefact de build, régénérable via npm run build |
| `./.git`           | Historique Git, non nécessaire au restore     |
| `./tickets`        | Tickets de développement, hors source         |
| `./design_boards`  | Assets design source lourds (non runtime)     |
| `./.cache`         | Cache applicatif                              |
| `./cache`          | Cache applicatif                              |
| `./.vite`          | Cache Vite                                    |
| `./coverage`       | Rapports de couverture de tests               |
| `./tmp`            | Fichiers temporaires (dont l'archive elle-même) |
| `./temp`           | Fichiers temporaires                          |
| `./logs`           | Fichiers de logs                              |
| `./.claude`        | Configuration Claude Code locale              |
| `*.tmp`            | Fichiers temporaires génériques               |
| `*.log`            | Fichiers de log                               |
| `*.bak`            | Fichiers de backup éditeur                    |
| `*.swp`, `*.swo`   | Fichiers swap vim                             |
| `.DS_Store`        | Metadata macOS                                |
| `Thumbs.db`        | Metadata Windows Explorer                     |
| `desktop.ini`      | Metadata Windows                              |

Note : `.gitignore` est conservé dans l'archive (exclure `.git/` n'exclut pas `.gitignore`).

## Usage

**PATCH 1027** doit utiliser cette archive comme source de restauration pour tester le restore propre.

Commande de restauration attendue (exemple) :
```bash
mkdir -p /tmp/snake-restore-test
tar -xzf /mnt/c/Users/Boris/snake/tmp/snake-drive-v4-clean-source.tar.gz -C /tmp/snake-restore-test
cd /tmp/snake-restore-test
npm install
npm run check
```

## Limites

- L'archive n'est **pas committée** dans le repo (gitignore exclut `tmp/` et `*.tar.gz`).
- Le dossier `tmp/` n'est **pas committé**.
- Le test de restauration est un sujet séparé (PATCH 1027).
- L'archive doit être recréée si le code source change significativement.
- Taille : 137M — principalement due aux assets `public/` (images PNG des univers).
