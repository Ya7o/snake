# PATCH — Runtime assets gameplay integration

## Contexte
Le patch 943 a nettoyé les anciens pipelines et installé une sélection maîtrisée de 24 assets runtime : 3 par univers, en PNG avec transparence. Le catalogue `runtimeUniverseAssets.ts` existe, mais il n’est pas encore câblé dans `GameScene`.

## Objectif
Brancher les 24 assets runtime dans le gameplay :
- pickup ;
- obstacle ;
- boss marker ;
- fallback si asset absent ;
- preload uniquement pour l’univers courant ;
- aucune réintroduction des anciens pipelines.

## Fichiers à modifier
- `src/scenes/GameScene.ts` — précharger et afficher les assets pickup/obstacle/boss de l’univers courant.
- `src/scenes/BootScene.ts` ou `src/scenes/PreloadScene.ts` — uniquement si le projet centralise le preload global.
- `src/assets/runtimeUniverseAssets.ts` — vérifier l’export `getRuntimeAsset(universeId, role)`.
- `src/systems/RuntimeAssetResolver.ts` — optionnel, créer un resolver léger pour éviter de répéter la logique dans les scènes.

## Fichiers à créer
- `src/systems/RuntimeAssetResolver.ts` — helper recommandé pour générer des keys Phaser stables.
- `docs/RUNTIME_ASSET_GAMEPLAY_INTEGRATION.md` — note technique.
- `docs/RUNTIME_ASSET_MOBILE_QA.md` — checklist mobile.

## Fichiers interdits
- Ne pas réintroduire `public/assets/external/_downloaded`.
- Ne pas réintroduire `public/assets/external/_extracted`.
- Ne pas réintroduire `public/assets/design_board_icons`.
- Ne pas réintroduire `public/assets/runtime_candidates_from_design_boards`.
- Ne pas charger les ZIP.
- Ne pas modifier les règles Snake.
- Ne pas supprimer les 8 univers.
- Ne pas supprimer les 16 niveaux.
- Ne pas supprimer les 8 boss.
- Ne pas remplacer toute la scène par un nouveau système.

## Comportement attendu
- [ ] Chaque niveau charge les 3 assets de son univers courant.
- [ ] Les pickups utilisent l’image `pickup`.
- [ ] Les obstacles utilisent l’image `obstacle`.
- [ ] Le boss ou niveau boss utilise l’image `boss`.
- [ ] Si un asset est absent, le gameplay continue avec fallback existant.
- [ ] Les images sont centrées dans les cellules.
- [ ] Les images ne masquent pas la grille.
- [ ] Les assets sont limités à une taille cellulaire mobile.
- [ ] Aucun ancien pipeline n’est utilisé.

## Contraintes
- Mobile-first Android / Chrome Android.
- Grille Snake prioritaire.
- Pas de chargement massif.
- Pas de dépendance supplémentaire.
- Ne charger que les assets de l’univers courant.
- Garder les performances stables.

## Hors scope
- Créer de nouveaux assets.
- Modifier les 24 PNG.
- Réactiver OpenGameArt.
- Réactiver les planches design-board.
- Changer les mécaniques par univers.
- Refaire l’UI / HUD / WorldMap.

## Rapport final obligatoire
À la fin, liste clairement :
1. Fichiers modifiés.
2. Fichiers créés.
3. Méthode de preload utilisée.
4. Où pickup / obstacle / boss sont affichés.
5. Tests effectués.
6. Résultat mobile.
7. Questions / blocages.
