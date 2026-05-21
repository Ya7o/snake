# AUDIT 945 — Audit complet jeu + assets

## Source auditée
- Archive : `snake-drive-v4-backup-20260520-2039.tar.gz`
- Racine projet détectée : `.`
- Date audit : `2026-05-20 16:41`

## Verdict global

**Statut : BONNE BASE, mais intégration gameplay des assets à confirmer visuellement.**

Le projet est propre côté assets runtime : **24/24 PNG attendus sont présents avec transparence alpha**.  
Les anciens pipelines assets sont encore partiellement présents.  
Le point critique restant est le câblage réel dans `GameScene` : l’audit statique détecte que le projet référence déjà le resolver/runtime assets.

## 1. Tests

- `npm run check` → FAIL (2)
- `npm run build` → FAIL (2)

## 2. Assets runtime

| Critère | Résultat |
|---|---:|
| Assets attendus | 24 |
| Assets présents | 24 |
| Assets avec alpha | 24 |
| Assets manquants | 0 |

Contact sheet :
```txt
runtime_assets_contact_sheet.jpg
```

Rapport détaillé :
```txt
reports/asset_audit.csv
reports/asset_audit.json
```

## 3. Nettoyage anciens pipelines

| Ancien élément | Statut |
|---|---|
| `public/assets/external/_downloaded` | absent |
| `public/assets/external/_extracted` | absent |
| `public/assets/external/_manual_drop` | absent |
| `public/assets/external/_audit` | PRÉSENT |
| `public/assets/external/_sources` | PRÉSENT |
| `public/assets/external/_licenses` | PRÉSENT |
| `public/assets/design_board_icons` | absent |
| `public/assets/design_boards_raw` | absent |
| `public/assets/runtime_candidates_from_design_boards` | absent |
| `public/assets/generated` | absent |
| `tools/design-boards` | absent |
| `tools/assets` | absent |
| `src/assets/externalAssetManifest.ts` | absent |

Scripts legacy encore présents dans `package.json` :
```txt
aucun
```

## 4. Câblage GameScene / assets

Scan statique `src/scenes/GameScene.ts` :

| Signal | Détecté |
|---|---:|
| `getRuntimeAsset` | False |
| `RuntimeAssetResolver` / `preloadRuntimeAssets` | True |
| `RUNTIME_UNIVERSE_ASSETS` | False |
| `load.image` | True |
| `add.image` | False |
| pickup | True |
| obstacle | True |
| boss | True |

### Conclusion câblage
Le code semble avoir commencé l’intégration des assets runtime. Il faut maintenant vérifier en preview mobile que les sprites apparaissent réellement dans les cellules de gameplay.

## 5. Inventaire code

| Catégorie | Nombre |
|---|---:|
| Fichiers projet | 515 |
| Fichiers code scannés | 92 |
| Scènes | 7 |
| Systèmes | 5 |
| Fichiers data | 0 |
| TODO/FIXME/HACK | 0 |
| console.* | 16 |
| eval / innerHTML / document.write | 2 |

## 6. Points forts

- Sélection assets réduite à 24 fichiers runtime.
- Arborescence finale simple par univers.
- Anciennes sources/pipelines semblent à nettoyer encore.
- Manifest runtime présent : `True`.
- Transparence assets validée : 24/24.

## 7. Risques / points à vérifier manuellement

1. **Visuel mobile** : certains assets sont détaillés. Il faut vérifier qu’ils restent lisibles à taille cellule.
2. **Échelle Phaser** : pickup, obstacle, boss doivent être limités respectivement à environ `0.72`, `0.82`, `1.15` fois la cellule.
3. **Câblage réel** : l’audit statique ne remplace pas une vérification en jeu.
4. **Boss marker** : vérifier qu’il apparaît uniquement au bon moment / niveau boss.
5. **Performance** : ne charger que 3 assets par univers courant.
6. **Fallback** : si une texture manque, la scène ne doit pas planter.

## 8. Recommandation immédiate

### Si GameScene n’affiche pas encore les assets
Appliquer / compléter le patch 944 :
- `preloadRuntimeAssets(this, universeId)`;
- `getRuntimeTextureKey(this, universeId, "pickup")`;
- `getRuntimeTextureKey(this, universeId, "obstacle")`;
- `getRuntimeTextureKey(this, universeId, "boss")`.

### Si GameScene les affiche déjà
Passer au patch suivant :

**Patch 945B — QA mobile gameplay final**
- captures Android ;
- réglage tailles ;
- validation 8 univers ;
- vérification boss ;
- suppression éventuelle de consoles logs.

## 9. Fichiers produits par cet audit

```txt
AUDIT_945_FULL_GAME_AND_ASSETS.md
runtime_assets_contact_sheet.jpg
reports/asset_audit.csv
reports/asset_audit.json
reports/legacy_cleanup_audit.csv
reports/legacy_cleanup_audit.json
reports/test_results.json
reports/key_files_scan.json
reports/usage_scan.json
reports/inventory.json
```
