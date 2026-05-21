Tu dois appliquer le patch suivant au projet Snake Drive V4.

# PATCH — Internet assets ingestion pack par univers

## Objectif
Ajouter un système pour inclure des assets internet correspondant aux univers du jeu, sans les intégrer aveuglément au gameplay.

## Fichiers fournis
- `public/assets/external/_sources/externalAssetManifest.json`
- `src/assets/externalAssetManifest.ts`
- `tools/assets/downloadExternalAssets.ts`
- `tools/assets/indexExternalAssets.ts`
- quelques assets PNG téléchargés quand possible dans `_downloaded`

## À faire
1. Copier les fichiers fournis.
2. Ajouter dans `package.json` :
   ```json
   {
     "assets:download-external": "tsx tools/assets/downloadExternalAssets.ts",
     "assets:index-external": "tsx tools/assets/indexExternalAssets.ts"
   }
   ```
   Si `tsx` n’est pas disponible, adapte au runner TypeScript déjà utilisé dans le projet.
3. Lancer :
   ```bash
   npm run assets:download-external
   npm run assets:index-external
   npm run check
   npm run build
   ```
4. Ne pas charger automatiquement toutes les archives ZIP au runtime.
5. Ne pas utiliser les sources `userLicensed_review_required` sauf si l’utilisateur confirme explicitement et lance :
   ```bash
   ALLOW_USER_LICENSED_ASSETS=1 npm run assets:download-external
   ```

## Interdits
- Ne supprime aucun univers/niveau/boss.
- Ne modifie pas le gameplay Snake.
- Ne remplace pas les design boards.
- Ne charge pas les ZIP au runtime.
- Ne fais pas de HTML monofichier.

## Rapport final obligatoire
Liste :
1. Fichiers créés.
2. Scripts ajoutés.
3. Sources téléchargées.
4. Sources ignorées.
5. Sources review-required.
6. Tests.
7. Questions / blocages.
