# Capture Notes — PATCH 1030

## Tentatives et résultats

### 1. Playwright WSL (ticket initial)
- Commande : `npx playwright install chromium --with-deps` depuis WSL
- Résultat : **ÉCHEC** — Playwright 1.60.0 ne supporte pas Ubuntu 26.04-x64
- Même résultat avec Firefox

### 2. Playwright WSL /tmp/pw-capture (WSL Node natif v24)
- Installation dans `/tmp/pw-capture` avec le Node WSL (/usr/bin/node v24.15.0)
- Résultat : **MÊME ÉCHEC** — version 1.60.0 récupérée depuis le registry

### 3. Puppeteer WSL /tmp/pw-capture
- `npm install puppeteer` → télécharge Chrome linux-149.0.7827.22
- Lancement : **ÉCHEC** — `libnspr4.so: cannot open shared object file`
- Tentative `sudo apt-get install -y libnspr4 libnss3 ...` : **ÉCHEC** — sudo exige mot de passe en mode non-interactif

### 4. Puppeteer Windows PowerShell (solution retenue)
- Dossier temporaire : `C:\tmp\pw-win`
- `npm install puppeteer` via `C:\Program Files\nodejs\npm`
- Script : `C:\tmp\pw-win\capture.js` (CommonJS, localhost:5173)
- Résultat : **SUCCÈS** — 4 captures PNG générées

## Note collat : corruption node_modules
L'installation WSL `npm install -D playwright @playwright/test` dans le répertoire projet
a installé des binaires Linux dans node_modules Windows → `@rollup/rollup-win32-x64-msvc` manquant.

**Correction appliquée :**
```bash
git checkout -- package.json package-lock.json
```
Puis depuis PowerShell :
```powershell
Remove-Item -Recurse -Force node_modules
npm install
```
Build restauré : 0 erreur, 60 modules.

## Script retenu (Windows PowerShell)

Voir `capture-puppeteer.js` dans ce dossier pour la version documentaire.
Script exécuté depuis `C:\tmp\pw-win\capture.js` (hors repo, temp uniquement).
