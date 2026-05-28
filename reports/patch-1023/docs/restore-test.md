# Restore Test — PATCH 1023

## Contexte

PATCH 1023 avait pour objectif de tester une archive propre du prototype Snake Drive V4 dans un dossier temporaire (`/tmp/snake-drive-v4-restore-test`).

Le test ne peut pas être réalisé : aucune archive n'a été trouvée.

## Commandes de recherche exécutées

```bash
# Emplacements primaires spécifiés dans le ticket
ls /media/sf_Share/snake-drive-v4-backup-*.tar.gz
# → ls: cannot access '/media/sf_Share/snake-drive-v4-backup-*.tar.gz': No such file or directory

ls /home/kali/snake/tmp/snake-drive-v4-backup-*.tar.gz
# → ls: cannot access '/home/kali/snake/tmp/...': No such file or directory

ls /home/kali/snake/tmp/snake_drive_v4_prototype_source.tar.gz
# → No such file or directory

ls /mnt/c/Users/Boris/snake/tmp/snake-drive-v4-backup-*.tar.gz
# → No such file or directory (dossier tmp absent)

# Recherche élargie
find /mnt/c/Users/Boris /tmp /home -name 'snake*.tar.gz'
# → 0 résultat

find /mnt/c/Users/Boris -name '*.tar.gz' | grep -i snake
# → 0 résultat

find /mnt/c/Users/Boris/Downloads /mnt/c/Users/Boris/Desktop /mnt/c/Users/Boris/Documents \
  -name 'snake*.tar.gz' -o -name 'snake*.zip'
# → Uniquement 2 packs d'assets .zip (pas des archives source)

find /mnt/d -name 'snake*.tar.gz'
# → 0 résultat

# Contenu du dossier snake
ls /mnt/c/Users/Boris/snake/tmp/
# → dossier inexistant
```

## Étapes planifiées non exécutées

```bash
# 1. Extraction
mkdir -p /tmp/snake-drive-v4-restore-test
tar -tzf <archive> | grep -E '^(\.git|node_modules|dist|tmp|design_boards)' || echo "Exclusions OK"
tar -xzf <archive> -C /tmp/snake-drive-v4-restore-test

# 2. Vérification structure
ls /tmp/snake-drive-v4-restore-test/src/
ls /tmp/snake-drive-v4-restore-test/public/assets/
ls /tmp/snake-drive-v4-restore-test/docs/
ls /tmp/snake-drive-v4-restore-test/package.json

# 3. Install + check dans le dossier restauré
cd /tmp/snake-drive-v4-restore-test
npm install
npm run check
```

## Environnement WSL

- WSL2, Ubuntu
- Repo principal : `/mnt/c/Users/Boris/snake`
- `/media/sf_Share` non monté (ancienne config VirtualBox / dossier partagé VM)

## Prochaine étape recommandée

Créer l'archive propre avec le script suivant depuis WSL :

```bash
cd /mnt/c/Users/Boris/snake
mkdir -p tmp
tar --exclude='.git' \
    --exclude='node_modules' \
    --exclude='dist' \
    --exclude='tmp' \
    --exclude='design_boards' \
    --exclude='*.log' \
    --exclude='.vite' \
    -czf tmp/snake-drive-v4-backup-$(date +%Y%m%d-%H%M%S).tar.gz .
echo "Archive créée : $(ls -lh tmp/snake-drive-v4-backup-*.tar.gz | tail -1)"
```

Puis relancer un PATCH de restore test.
