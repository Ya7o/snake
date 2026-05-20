# BOARD_MAPPING.md

## Mapping Actuel

Les sources design sont triées et nommées par univers.

| Univers | Dossier source | Cadre source | Assets runtime |
|---|---|---|---|
| Castle | `design_boards/castle/` | `cadre castle of illusuion.png` | `public/assets/frames/castle/`, `public/assets/universes/castle/` |
| Sonic | `design_boards/sonic/` | `cadre sonic 2.png` | `public/assets/frames/sonic/`, `public/assets/universes/sonic/` |
| Streets | `design_boards/streets/` | `cadre street of rage.png` | `public/assets/frames/streets/`, `public/assets/universes/streets/` |
| Fighter | `design_boards/fighter/` | `cadre street fighter.png` | `public/assets/frames/fighter/`, `public/assets/universes/fighter/` |
| OutRun | `design_boards/outrun/` | `cadre outrun.png` | `public/assets/frames/outrun/`, `public/assets/universes/outrun/` |
| Shinobi | `design_boards/shinobi/` | `cadre shinobi.png` | `public/assets/frames/shinobi/`, `public/assets/universes/shinobi/` |
| Kombat | `design_boards/kombat/` | `cadre mortal kombat.png` | `public/assets/frames/kombat/`, `public/assets/universes/kombat/` |
| Paperboy | `design_boards/paperboy/` | `cadre paperboy.png` | `public/assets/frames/paperboy/`, `public/assets/universes/paperboy/` |

## Notes

- Le nom `cadre castle of illusuion.png` conserve la faute du fichier source.
- Les cadres complets sont copiés tels quels vers `public/assets/frames/[univers]/frame.png`.
- Les découpes gameplay/HUD restent dans `public/assets/universes/[univers]/`.

## Règles

- Ne pas deviner silencieusement si une nouvelle source est ambiguë.
- Garder les sources dans `design_boards/[univers]/`.
- Exporter uniquement les assets runtime propres vers `public/assets/`.
- Ne jamais écraser une source sans demande explicite.
