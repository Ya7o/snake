# PATCH — Final 24 validated runtime assets + cleanup

## Contexte
Les anciens correctifs ont créé trop de dossiers expérimentaux : external assets, extractions de planches, runtime candidates et pipelines non retenus. Le projet doit revenir à une base propre avec seulement 24 images runtime maîtrisées.

## Objectif
Installer uniquement les 24 assets validés :
- 8 univers ;
- pickup / obstacle / boss ;
- PNG RGBA avec transparence ;
- catalogue `runtimeUniverseAssets.ts` ;
- script de nettoyage des anciens pipelines.

## Fichiers à copier
- `ready_to_copy/public/assets/runtime/universes/**`
- `ready_to_copy/src/assets/runtimeUniverseAssets.ts`
- `ready_to_copy/src/assets/runtimeUniverseAssets.manifest.json`
- `tools/cleanup/cleanup_failed_asset_pipelines.sh`

## Fichiers à supprimer via script
- `public/assets/external/_downloaded`
- `public/assets/external/_extracted`
- `public/assets/external/_manual_drop`
- `public/assets/design_board_icons`
- `public/assets/design_boards_raw`
- `public/assets/runtime_candidates_from_design_boards`
- `public/assets/generated`
- anciens scripts `tools/design-boards`
- scripts assets externes devenus inutiles

## Comportement attendu
- [ ] Le projet ne garde que 24 assets runtime gameplay.
- [ ] GameScene ne charge que les assets du niveau courant.
- [ ] Fallback SVG conservé.
- [ ] Aucun asset expérimental n’est utilisé.
- [ ] Build OK.

## Hors scope
- Réintégrer les assets OpenGameArt.
- Réutiliser les planches brutes.
- Relancer le pipeline de crop automatique.
- Changer le gameplay.

## Rapport final obligatoire
Lister :
1. Fichiers copiés.
2. Dossiers supprimés.
3. Assets chargés par univers.
4. Tests.
5. Questions / blocages.
