# Workflow de téléchargement manuel des assets externes

Certaines sources ne sont pas téléchargeables automatiquement (itch.io, kenney.nl CDN dynamique, Spriters Resource). Ce document décrit la procédure pour les importer proprement.

---

## Sources nécessitant un téléchargement manuel

| Source ID | Plateforme | Page |
|-----------|-----------|------|
| `ninja_jail_castle_r3troboidx` | itch.io | https://r3troboidx.itch.io/ninja-jail-castle |
| `sonic_style_tiles_corey_archer` | Spriters Resource | https://www.spriters-resource.com/genesis/sonicthehedgehog/sheet/6784/ |
| `racing_pack_kenney` | kenney.nl | https://kenney.nl/assets/racing-pack |
| `topdown_vehicle_sprites_unlucky` | itch.io | https://unluckystudio.itch.io/topdown-game-vehicles-pack |
| `pixel_dog_cat_bonzille` | itch.io | https://bonzille.itch.io/pixel-animals |

---

## Procédure

### Étape 1 — Télécharger le fichier

Aller sur la page de la source. Télécharger le pack (ZIP, PNG ou archive).

Pour `sonic_style_tiles_corey_archer` : nécessite `ALLOW_USER_LICENSED_ASSETS=1` côté script — usage prototype personnel uniquement, ne pas distribuer.

### Étape 2 — Déposer dans _manual_drop

Placer le(s) fichier(s) téléchargé(s) dans :

```
public/assets/external/_manual_drop/<sourceId>/
```

Exemple pour le Racing Pack Kenney :

```
public/assets/external/_manual_drop/racing_pack_kenney/
└── racing-pack.zip
```

### Étape 3 — Importer via le script

```bash
npm run assets:download-external
```

Le script détecte automatiquement les fichiers dans `_manual_drop/<sourceId>/` et les copie vers `_downloaded/<sourceId>/`.

Pour une source spécifique :

```bash
npm run assets:download-external -- --source=racing_pack_kenney
```

### Étape 4 — Vérifier avec l'audit

```bash
npm run assets:audit-external
```

Ouvrir `public/assets/external/_audit/audit-latest.md` pour confirmer que la source passe en statut `ready`.

### Étape 5 — Indexer

```bash
npm run assets:index-external
```

---

## Règles impératives

- Ne jamais déposer dans `_downloaded/` directement — toujours passer par `_manual_drop/` pour garder la traçabilité.
- `sonic_style_tiles_corey_archer` : prototype personnel uniquement, ne jamais inclure dans un build distribué.
- Les fichiers dans `_manual_drop/` et `_downloaded/` ne sont **jamais** chargés en runtime par Phaser — ils restent en staging.
- Un asset dans `_downloaded/` doit passer par une étape QA avant d'être copié dans `public/assets/universes/<univers>/`.

---

## Sources scrapeables (OpenGameArt)

Pour les sources en mode `opengameartPageScrape`, le script tente automatiquement d'extraire les liens `/sites/default/files/` de la page OGA.

Si le scrape échoue (rate limiting, changement de structure), utiliser la même procédure `_manual_drop/` ci-dessus.

Sources OGA scrapables :
- `free_cc0_top_down_tileset_rgsdev`
- `streets_of_fight_ansimuz`
- `street_tile_set_chasersgaming`
- `animated_fire_benhickling`
- `dog_spritesheets_jason_gdn`
