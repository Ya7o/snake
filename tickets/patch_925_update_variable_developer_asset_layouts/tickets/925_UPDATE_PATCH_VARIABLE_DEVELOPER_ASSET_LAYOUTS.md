# PATCH — Update 925 : layouts variables developer assets

## Contexte
Le patch 925 définit le pipeline developer assets. Les nouvelles planches confirment que les 8 univers ont une structure globalement similaire, mais pas strictement identique. Les blocs HUD, props, pickups, obstacles, boss, bordures, badges et palette existent presque toujours, mais leur position, leur hauteur et la zone palette varient selon les univers.

## Objectif
Mettre à jour le patch 925 pour supporter des layouts variables par univers, au lieu d’imposer un crop unique basé sur Castle. Le pipeline doit utiliser un manifest spécifique par univers et produire un audit des zones ambiguës, notamment la palette.

## Fichiers à modifier
- `src/assets/designBoardManifest.ts` — définir un manifest explicite par univers avec dimensions d’image, zones de crop, notes et statut de confiance.
- `tools/design-boards/extractDeveloperAssets.ts` — supporter les layouts variables, valider les zones, empêcher les crops hors image, et produire un rapport détaillé.
- `docs/design_boards/DEVELOPER_ASSET_PIPELINE.md` — documenter que les planches sont semblables mais non identiques.
- `docs/design_boards/DEVELOPER_ASSET_AUDIT.md` — lister les différences par univers.
- `package.json` — conserver ou ajouter le script `assets:extract-design-boards`.

## Fichiers interdits
- Ne pas afficher une planche developer asset brute dans le gameplay.
- Ne pas imposer un crop unique à tous les univers.
- Ne pas supprimer les 8 univers.
- Ne pas supprimer les 16 niveaux.
- Ne pas supprimer les 8 boss.
- Ne pas modifier les règles gameplay Snake.
- Ne pas ajouter de dépendance lourde.
- Ne pas revenir à un HTML monofichier.

## Comportement attendu
- [ ] Le manifest contient une entrée par univers : `castle`, `sonic`, `streets`, `fighter`, `outrun`, `shinobi`, `kombat`, `paperboy`.
- [ ] Chaque entrée peut avoir ses propres coordonnées de crop.
- [ ] Le pipeline ne réutilise pas aveuglément le layout Castle pour tous les univers.
- [ ] Les zones principales sont extraites quand elles existent : `gameplayPreview`, `hud`, `props`, `pickups`, `obstacles`, `boss`, `borders`, `badges`, `palette`.
- [ ] La zone `palette` accepte des positions et formats variables.
- [ ] Si la palette ne peut pas être convertie proprement en `palette.json`, le pipeline génère au moins `palette.png` et signale l’ambiguïté.
- [ ] Chaque zone possède un statut : `confirmed`, `estimated`, `missing` ou `ambiguous`.
- [ ] Le rapport final liste les zones estimées ou ambiguës par univers.
- [ ] Le script échoue seulement si une image est illisible ou si une zone confirmée sort des bornes.
- [ ] Les zones manquantes n’empêchent pas les autres exports.

## Contraintes
- Le pipeline doit être déterministe.
- Les crops doivent rester versionnables.
- Les coordonnées doivent être manuelles ou semi-manuelles, pas devinées par OCR.
- Les futures intégrations gameplay doivent pouvoir appeler les assets via `DesignBoardManager`.
- Mobile Android reste la cible finale, même si ce patch est pipeline-only.
- Les assets doivent habiller le jeu, pas noyer la grille Snake.

## Différences à prendre en compte
- Les titres/logos en haut ne sont pas tous de même hauteur.
- Le HUD mobile est généralement en haut à droite, mais sa taille varie.
- Les sections props/pickups/obstacles/boss sont similaires mais leurs séparateurs ne tombent pas toujours au même y.
- Les bordures peuvent occuper une zone plus ou moins haute.
- Les badges peuvent avoir 4, 5 ou 6 éléments selon univers.
- La palette est toujours en bas ou bas-droite, mais sa largeur, son alignement et son nombre de couleurs varient.
- Certains assets comme Kombat/Fighter ont des styles plus sombres et des séparateurs moins évidents.

## Hors scope
- Intégrer immédiatement les assets dans les scènes.
- Refaire les cadres de gameplay.
- Refaire HUD/pickups/obstacles/boss en runtime.
- Corriger WorldMap.
- Traduire les textes.
- Faire une détection automatique par IA ou OCR.

## Rapport final obligatoire
À la fin, liste clairement :

1. Fichiers créés ou modifiés.
2. Univers détectés.
3. Dimensions de chaque developer asset.
4. Zones confirmées par univers.
5. Zones estimées par univers.
6. Zones ambiguës ou manquantes.
7. Traitement de la palette pour chaque univers.
8. Emplacement des assets générés.
9. Tests effectués.
10. Questions ou points bloquants.

Si Codex hésite, il doit lister le doute au lieu de cropper au hasard.
