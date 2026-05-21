# PATCH — Internet assets ingestion pack par univers

## Contexte
Le système lightweight 930 permet d’avancer sans dépendre des crops developer assets. Tu demandes maintenant d’inclure aussi des assets trouvés sur internet correspondant aux univers, pour prototype personnel, avec licences supposées acquises/validées côté utilisateur.

## Objectif
Ajouter un pack d’ingestion d’assets internet par univers : manifest de sources, scripts de téléchargement, index local, règles de licence, et mapping vers les 8 univers. Ce patch ne remplace pas les developer assets ; il ajoute une source d’assets externe contrôlée.

## Fichiers à créer
- `public/assets/external/_sources/externalAssetManifest.json` — manifest complet des sources internet.
- `src/assets/externalAssetManifest.ts` — version TypeScript du manifest.
- `tools/assets/downloadExternalAssets.ts` — script de téléchargement contrôlé.
- `tools/assets/indexExternalAssets.ts` — script d’indexation des assets téléchargés.
- `public/assets/external/_licenses/ASSET_SOURCES.md` — documentation licences / sources.
- `docs/EXTERNAL_ASSET_INGESTION.md` — méthode d’intégration.
- `docs/EXTERNAL_ASSET_MAPPING_BY_UNIVERSE.md` — mapping univers → sources.
- `public/assets/external/_downloaded/` — assets déjà téléchargés quand possible.

## Fichiers à modifier
- `package.json` — ajouter scripts :
  - `assets:download-external`
  - `assets:index-external`
- `src/scenes/BootScene.ts` ou `src/scenes/PreloadScene.ts` — uniquement pour préparer un futur preload, sans tout charger aveuglément.
- `src/assets/DesignBoardManager.ts` ou nouveau manager d’assets — seulement si le projet a déjà une abstraction.

## Fichiers interdits
- Ne pas remplacer les design boards.
- Ne pas supprimer les 8 univers.
- Ne pas supprimer les 16 niveaux.
- Ne pas supprimer les 8 boss.
- Ne pas modifier les règles Snake.
- Ne pas charger toutes les archives ZIP au runtime.
- Ne pas utiliser d’asset marqué `review_required` sans opt-in explicite.
- Ne pas revenir à un HTML monofichier.

## Comportement attendu
- [ ] Chaque univers a au moins une source d’assets candidate.
- [ ] Les sources sont centralisées dans un manifest.
- [ ] Les licences / auteurs / URLs sont documentés.
- [ ] Les sources CC0 sont marquées `approved`.
- [ ] Les sources à risque ou user-licensed sont marquées `userLicensed_review_required`.
- [ ] Le téléchargement des assets review-required nécessite `ALLOW_USER_LICENSED_ASSETS=1`.
- [ ] Les archives téléchargées restent dans `_downloaded`, pas chargées directement en jeu.
- [ ] Un index JSON des fichiers téléchargés peut être généré.
- [ ] Le patch n’intègre pas automatiquement ces assets en gameplay sans sélection / QA.
- [ ] Le rapport final liste les assets téléchargés, ignorés, et à valider.

## Mapping recommandé
- Castle : `ninja_jail_castle_r3troboidx`, `free_cc0_top_down_tileset_rgsdev`
- Sonic : `sonic_style_tiles_corey_archer` en `userLicensed_review_required`
- Streets : `streets_of_fight_ansimuz`, `street_tile_set_chasersgaming`
- Fighter : `streets_of_fight_ansimuz`
- OutRun : `racing_pack_kenney`, `topdown_vehicle_sprites_unlucky`
- Shinobi : `ninja_jail_castle_r3troboidx`, `free_cc0_top_down_tileset_rgsdev`
- Kombat : `free_cc0_top_down_tileset_rgsdev`, `animated_fire_benhickling`
- Paperboy : `dog_spritesheets_jason_gdn`, `pixel_dog_cat_bonzille`, `topdown_vehicle_sprites_unlucky`

## Contraintes
- Prototype personnel, mais garder une traçabilité licence propre.
- Ne pas mélanger “asset disponible” et “asset validé gameplay”.
- Un asset internet doit passer par une étape QA avant runtime.
- Les assets doivent rester secondaires face à la lisibilité de la grille Snake.
- Mobile Android prioritaire.

## Hors scope
- Découper toutes les archives.
- Intégrer automatiquement les assets dans les scènes.
- Remplacer les icônes SVG lightweight.
- Refaire les developer assets.
- Corriger les mécaniques gameplay.
- Créer une distribution publique.

## Rapport final obligatoire
À la fin, liste clairement :

1. Fichiers créés.
2. Fichiers modifiés.
3. Sources ajoutées par univers.
4. Assets téléchargés dans le package.
5. Assets laissés au script de téléchargement.
6. Assets marqués `review_required`.
7. Scripts npm à ajouter.
8. Tests effectués.
9. Questions ou points bloquants.
