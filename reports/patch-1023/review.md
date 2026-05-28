# Review

## Objectif

Vérifier qu'une archive source propre du prototype Snake Drive V4 est réutilisable dans un dossier vierge : extraction, `npm install`, `npm run check`, vérification des exclusions (.git, node_modules, dist, tmp, design_boards).

## Résultat

**ÉCHOUÉ — Archive introuvable.**

Aucune archive source n'a été trouvée dans les emplacements spécifiés. Le test de restauration ne peut donc pas être exécuté sans inventer d'archive.

## Fichiers modifiés

Aucun fichier source modifié.

Créés :
- `reports/patch-1023/review.md`
- `reports/patch-1023/docs/restore-test.md`

## Tests / vérifications

### Recherche d'archive

Emplacements vérifiés dans l'ordre spécifié :

```
/media/sf_Share/snake-drive-v4-backup-*.tar.gz         → ABSENT  (/media/sf_Share n'existe pas)
/home/kali/snake/tmp/snake-drive-v4-backup-*.tar.gz    → ABSENT  (/home/kali/snake n'existe pas)
/home/kali/snake/tmp/snake_drive_v4_prototype_source.tar.gz → ABSENT
/mnt/c/Users/Boris/snake/tmp/snake-drive-v4-backup-*.tar.gz → ABSENT  (dossier tmp inexistant)
```

Recherche élargie effectuée :

```
find /mnt/c/Users/Boris/snake /tmp /home ...           → 0 archive source trouvée
find /mnt/c/Users/Boris/Downloads /Desktop /Documents  → 0 résultat (.tar.gz snake)
```

Seuls fichiers trouvés portant "snake" et ".zip" :
```
/mnt/c/Users/Boris/Desktop/Snake - assets/old/snake_frames_pack_8_universes.zip
/mnt/c/Users/Boris/Desktop/Snake - assets/old/snake_retro_ui_pack_8themes.zip
```
→ Ce sont des packs d'assets, pas des archives source du prototype.

### Commandes demandées

| Commande | Résultat |
| --- | --- |
| `tar -tzf <archive>` | Non exécutée : aucune archive disponible. |
| `tar -xzf <archive> -C /tmp/snake-drive-v4-restore-test` | Non exécutée : aucune archive disponible. |
| `npm install` | Non exécutée : aucun dossier restauré. |
| `npm run check` | Non exécutée : aucun dossier restauré. |
| Vérification `src/`, `public/`, `public/assets/`, `docs/`, `package.json` | Non exécutée : aucun dossier restauré. |

## Captures

Aucune capture (extraction non réalisée).

## Documents

- `reports/patch-1023/docs/restore-test.md` — détail des commandes de recherche et contexte

## Limites / risques

- Archive testée : aucune, car aucun fichier correspondant n'est présent.
- Taille archive : non applicable.
- Résultat restauration : non applicable.
- Exclusions `.git/`, `node_modules/`, `dist/`, `tmp/`, `design_boards/` : non vérifiables sans archive.
- Aucun script de création d'archive n'a été trouvé dans `scripts/` ou `tools/`.
- Le dossier `/mnt/c/Users/Boris/snake/tmp/` n'existe pas.
- Le repo a été déplacé de `/home/kali/snake` vers `/mnt/c/Users/Boris/snake` — les emplacements historiques `/home/kali/...` sont définitivement absents.
- `/media/sf_Share/` n'est pas monté dans cet environnement WSL.

### Recommandation pour PATCH 1024

Créer un script `scripts/create-archive.sh` (ou équivalent PowerShell) qui génère l'archive propre dans `/mnt/c/Users/Boris/snake/tmp/`, puis relancer un PATCH de restore test.

Commande exemple :
```bash
cd /mnt/c/Users/Boris/snake
mkdir -p tmp
tar --exclude='.git' \
    --exclude='node_modules' \
    --exclude='dist' \
    --exclude='tmp' \
    --exclude='design_boards' \
    --exclude='*.log' \
    -czf tmp/snake-drive-v4-backup-$(date +%Y%m%d-%H%M%S).tar.gz .
```

## Liens GitHub

- Commit : https://github.com/Ya7o/snake/commit/4838f8c
- Review : https://github.com/Ya7o/snake/blob/main/reports/patch-1023/review.md
