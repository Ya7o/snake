# Asset Weight / Performance Audit

## Objectif

Auditer le poids des assets et du build public.

## Résumé

- public/assets total : 139M, 256 fichiers.
- dist total : 141M sur disque, 140M apparent, 260 fichiers.
- plus gros dossier : public/assets/ui, environ 85M.
- plus gros fichier : public/assets/universes/outrun/board_preview.png, 2.88 MB.
- warning Vite : oui, chunk principal `dist/assets/index-CyIQB7fK.js` à 1,609.04 kB minifié, 376.23 kB gzip.
- risque mobile : élevé sur réseaux lents si plusieurs backgrounds PNG sont chargés tôt ou recopiés dans le cache navigateur.

## Top fichiers lourds

| Fichier | Taille | Type | Recommandation |
|---|---:|---|---|
| public/assets/universes/outrun/board_preview.png | 2.88 MB | PNG | Compresser ou convertir après scan de références. |
| public/assets/ui/paperboy/paperboy_boss_system_bg.png | 2.78 MB | PNG | Compresser en priorité P1. |
| public/assets/ui/worldmap/world_map_minimap_16_9.png | 2.76 MB | PNG | Vérifier usage et dimensions avant optimisation. |
| public/assets/map/world_map.png | 2.74 MB | PNG | Compresser avec contrôle visuel mobile. |
| public/assets/ui/outrun/outrun_boss_system_bg.png | 2.54 MB | PNG | Compresser en priorité P1. |
| public/assets/ui/fighter/fighter_boss_system_bg.png | 2.48 MB | PNG | Compresser en priorité P1. |
| public/assets/ui/shinobi/shinobi_boss_system_bg.png | 2.44 MB | PNG | Compresser en priorité P1. |
| public/assets/ui/streets/streets_clear_bg.png | 2.42 MB | PNG | Compresser en priorité P1. |
| public/assets/ui/streets/streets_system_bg.png | 2.42 MB | PNG | Compresser en priorité P1. |
| public/assets/level-intros/paperboy/intro.png | 2.40 MB | PNG | Compresser les intros par lot ciblé. |
| public/assets/level-intros/outrun/intro.png | 2.38 MB | PNG | Compresser les intros par lot ciblé. |
| public/assets/ui/castle/castle_clear_bg.png | 2.38 MB | PNG | Compresser en priorité P1. |
| public/assets/level-intros/sonic/intro.png | 2.33 MB | PNG | Compresser les intros par lot ciblé. |
| public/assets/universes/paperboy/board_preview.png | 2.33 MB | PNG | Compresser ou convertir après scan de références. |
| public/assets/ui/outrun/outrun_clear_bg.png | 2.24 MB | PNG | Compresser en priorité P1. |
| public/assets/level-intros/kombat/intro.png | 2.23 MB | PNG | Compresser les intros par lot ciblé. |
| public/assets/ui/streets/streets_boss_system_bg.png | 2.20 MB | PNG | Compresser en priorité P1. |
| public/assets/ui/sonic/sonic_boss_system_bg.png | 2.19 MB | PNG | Compresser en priorité P1. |
| public/assets/level-intros/castle/intro.png | 2.19 MB | PNG | Compresser les intros par lot ciblé. |
| public/assets/universes/kombat/board_preview.png | 2.18 MB | PNG | Compresser ou convertir après scan de références. |

## Risques

- Chargement mobile lent sur premiere visite, surtout si le navigateur recupere plusieurs ecrans PNG de 2 MB et plus.
- Images boss/system lourdes : le dossier `public/assets/ui` represente environ 85M, avec plusieurs backgrounds par univers.
- Audio : risque faible dans cet audit, environ 412K seulement.
- JS chunk > 500 kB : le chunk principal depasse le seuil Vite avec 1,609.04 kB minifie.
- Cache GitHub Pages : le poids initial reste important pour les nouveaux visiteurs et apres invalidation de cache.

## Recommandations

### P0

Aucun fichier unique n'est aberrant au point de justifier une correction urgente dans ce patch. Le probleme principal est cumulatif : beaucoup de PNG entre 1.9 MB et 2.9 MB.

### P1

Compression ciblee des images PNG lourdes, en priorite :

- `public/assets/ui/` backgrounds system, clear, gameplay et boss_system.
- `public/assets/level-intros/*/intro.png`.
- `public/assets/universes/*/board_preview.png`.
- `public/assets/map/world_map.png` et `public/assets/ui/worldmap/world_map_minimap_16_9.png`.

### P2

- Verifier que le prechargement runtime ne demande que l'ecran courant et le niveau courant.
- Etudier un split JS plus tard si le chunk principal reste problematique apres stabilisation fonctionnelle.
- Evaluer des formats alternatifs pour les grands backgrounds uniquement apres validation visuelle mobile.

### À ne pas faire maintenant

- Refactor moteur.
- Compression aveugle.
- Suppression assets sans référence scan.

## PATCH suivant possible

PATCH 1045B — Compress Heavy Public Images

Seulement si l'audit identifie des gains évidents.

## Sources

- `reports/patch-1045/logs/public-assets-size.txt`
- `reports/patch-1045/logs/largest-files.txt`
- `reports/patch-1045/logs/dist-size.txt`
- `reports/patch-1045/logs/build-summary.txt`
