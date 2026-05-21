# PATCH — External assets download hardening + manual ingestion

## Contexte
Le rapport du patch 931 montre que le manifest a été ajouté proprement, mais que le téléchargement n’est pas fiable : plusieurs URLs sont des pages HTML itch.io/OpenGameArt et non des URLs directes de fichiers. Le dossier `_downloaded/` reste donc vide, ce qui rend le pack inexploitable sans étape manuelle.

## Objectif
Durcir le système d’ingestion d’assets internet : séparer clairement pages sources, URLs directes et dépôt manuel ; refuser les réponses HTML déguisées en assets ; scraper prudemment les liens `/sites/default/files/` pour OpenGameArt ; et produire un audit clair des assets téléchargés, importés manuellement, ignorés ou bloqués.

## Fichiers à modifier
- `tools/assets/downloadExternalAssets.ts` — remplacer le téléchargement naïf par un downloader robuste.
- `tools/assets/indexExternalAssets.ts` — conserver l’indexation des assets présents dans `_downloaded/`.
- `package.json` — ajouter si besoin `assets:audit-external`.
- `public/assets/external/_sources/externalAssetManifest.json` — ajouter `downloadMode`, `pageUrl`, `directUrls`, `status`.
- `docs/EXTERNAL_ASSET_INGESTION.md` — documenter le workflow manuel et la validation.
- `public/assets/external/_licenses/ASSET_SOURCES.md` — préciser les sources qui nécessitent téléchargement manuel.

## Fichiers à créer
- `tools/assets/auditExternalAssets.ts` — audit local des sources, téléchargements et manual drops.
- `public/assets/external/_manual_drop/.gitkeep` — dossier où déposer les fichiers téléchargés manuellement.
- `public/assets/external/_audit/` — rapports JSON/MD générés.
- `docs/EXTERNAL_ASSET_MANUAL_DOWNLOAD_WORKFLOW.md` — procédure claire pour importer les assets manuels.

## Fichiers interdits
- Ne pas charger des pages HTML comme assets.
- Ne pas considérer un téléchargement comme réussi si le content-type est HTML.
- Ne pas forcer le téléchargement des sources `review_required`.
- Ne pas intégrer automatiquement les assets au gameplay.
- Ne pas supprimer les 8 univers.
- Ne pas modifier le gameplay Snake.
- Ne pas revenir à un HTML monofichier.

## Comportement attendu
- [ ] Le script refuse une URL qui retourne du HTML.
- [ ] Les sources peuvent être `direct`, `opengameartPageScrape` ou `manual`.
- [ ] Pour OpenGameArt, le script peut scanner la page et extraire les liens `/sites/default/files/...`.
- [ ] Pour itch.io ou pages non directes, le script indique `manual_required`.
- [ ] Les fichiers déposés dans `_manual_drop/<sourceId>/` sont copiés dans `_downloaded/<sourceId>/`.
- [ ] Les sources `review_required` restent bloquées sans `ALLOW_USER_LICENSED_ASSETS=1`.
- [ ] Un rapport JSON est généré après téléchargement.
- [ ] Un audit Markdown liste les sources sans asset local.
- [ ] Le build ne dépend pas de la présence des assets externes.
- [ ] Les assets téléchargés restent en staging, pas en runtime direct.

## Contraintes
- Prototype personnel, mais traçabilité obligatoire.
- Les assets internet doivent passer par QA avant intégration.
- Pas de dépendance lourde.
- Ne pas casser le patch 930 lightweight.
- Mobile Android reste la cible finale.

## Hors scope
- Trouver une source CC0 Sonic parfaite.
- Intégrer les assets au gameplay.
- Découper les spritesheets.
- Optimiser les images.
- Refaire la DA.
- Remplacer les developer assets.

## Rapport final obligatoire
À la fin, liste clairement :

1. Fichiers modifiés.
2. Fichiers créés.
3. Nouvelles valeurs `downloadMode`.
4. Sources passées en manuel.
5. Sources téléchargées automatiquement.
6. Sources review-required.
7. Tests effectués.
8. Questions ou points bloquants.
