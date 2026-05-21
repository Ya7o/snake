# Provenance assets runtime 24

Ce document remplace les dossiers de staging externes dans `public/assets/external/` pour la release candidate.

## Statut

- Les 24 PNG runtime sont les seuls assets `public/assets/runtime/universes/` destinés au gameplay.
- Ils proviennent du pack validé `patch_943_final_24_validated_runtime_assets_and_cleanup`.
- Les anciens dossiers `_audit`, `_sources` et `_licenses` ne sont pas requis au runtime et ne doivent pas être embarqués dans `public/assets/external/`.
- Les 24 PNG ne doivent pas être modifiés sans validation explicite.

## Inventaire runtime

| Univers | Pickup | Obstacle | Boss |
|---|---|---|---|
| Castle | `pickup_orb.png` | `obstacle_blink_wall.png` | `boss_witch_mirror.png` |
| Sonic | `pickup_ring.png` | `obstacle_bumper.png` | `boss_loop_serpent.png` |
| Streets | `pickup_street_bonus.png` | `obstacle_crowd.png` | `boss_crime_lord.png` |
| Fighter | `pickup_energy.png` | `obstacle_charge_marker.png` | `boss_final_challenger.png` |
| OutRun | `pickup_checkpoint.png` | `obstacle_car.png` | `boss_turbo_rival.png` |
| Shinobi | `pickup_shuriken.png` | `obstacle_decoy.png` | `boss_shadow_ninja.png` |
| Kombat | `pickup_finish_token.png` | `obstacle_fatal_zone.png` | `boss_dragon_gate.png` |
| Paperboy | `pickup_newspaper.png` | `obstacle_dog.png` | `boss_neighborhood_chaos.png` |

## Règles release

- Conserver uniquement les assets runtime validés pour le gameplay.
- Garder les sources externes et audits hors du chemin public runtime.
- Documenter toute nouvelle source dans `docs/` avant intégration.
