Tu dois appliquer le patch suivant au projet Snake Drive V4.

# PATCH — External assets download hardening + manual ingestion

## Problème
Le rapport 931 montre que `_downloaded/` reste vide. Cause : plusieurs URLs sont des pages HTML, pas des URLs directes de fichiers. Le script doit arrêter de considérer ces URLs comme téléchargeables.

## Objectif
Rendre l’ingestion robuste :
- refuser les réponses HTML ;
- distinguer `direct`, `opengameartPageScrape`, `manual` ;
- permettre dépôt manuel dans `_manual_drop/<sourceId>/` ;
- copier les dépôts manuels vers `_downloaded/<sourceId>/` ;
- auditer ce qui manque.

## Fichiers fournis
- `tools/assets/downloadExternalAssets.ts`
- `tools/assets/auditExternalAssets.ts`
- `public/assets/external/_sources/manifest_patch_932.json`

## À faire
1. Remplacer/adapter `tools/assets/downloadExternalAssets.ts`.
2. Ajouter `tools/assets/auditExternalAssets.ts`.
3. Ajouter dans `package.json` :
   ```json
   {
     "assets:audit-external": "tsx tools/assets/auditExternalAssets.ts"
   }
   ```
4. Mettre à jour `externalAssetManifest.json` :
   - `downloadMode: "direct"` pour URL fichier directe ;
   - `downloadMode: "opengameartPageScrape"` pour page OpenGameArt ;
   - `downloadMode: "manual"` pour itch.io ou page sans lien direct fiable.
5. Créer `public/assets/external/_manual_drop/.gitkeep`.
6. Lancer :
   ```bash
   npm run assets:download-external
   npm run assets:index-external
   npm run assets:audit-external
   npm run check
   npm run build
   ```

## Interdits
- Ne charge pas une page HTML comme asset.
- Ne télécharge pas `review_required` sans `ALLOW_USER_LICENSED_ASSETS=1`.
- Ne branche pas ces assets au gameplay.
- Ne modifie pas les règles Snake.

## Rapport final obligatoire
Liste :
1. Fichiers modifiés.
2. Sources auto.
3. Sources manuelles.
4. Sources review-required.
5. Audit généré.
6. Tests.
7. Blocages.
