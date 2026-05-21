# AUDIT 946 — Audit complet Snake Drive V4

## Source
- Archive : `snake-drive-v4-backup-20260520-2039.tar.gz`
- Racine projet : `.`
- Date : `2026-05-20 17:02`

## Verdict global

**Le projet est sur une base beaucoup plus propre côté assets, mais le point critique restant est la vérification gameplay réelle.**

- Assets runtime : **24/24** présents avec transparence alpha.
- Anciens pipelines : **3** éléments legacy encore détectés.
- Build/check : **OK**.
- Câblage GameScene : **signal détecté**.

## 1. Vue d’ensemble technique

| Élément | Résultat |
|---|---:|
| Fichiers projet scannés | 515 |
| Fichiers code scannés | 187 |
| Fichiers TypeScript | 63 |
| Scènes détectées | 7 |
| Systèmes détectés | 5 |
| Assets runtime attendus | 24 |
| Assets runtime alpha OK | 24 |

## 2. Tests build/check

### `npm install --no-audit --no-fund`

Retour : `0`

```txt

added 19 packages in 7s

```

### `npm run check`

Retour : `0`

```txt

> snake-drive-v4@0.1.0 check
> npm run build


> snake-drive-v4@0.1.0 build
> tsc && vite build

[36mvite v6.4.2 [32mbuilding for production...[36m[39m
transforming...
[32m✓[39m 54 modules transformed.
rendering chunks...
computing gzip size...
[2mdist/[22m[32mindex.html                [39m[1m[2m    1.21 kB[22m[1m[22m[2m │ gzip:   0.61 kB[22m
[2mdist/[22m[2massets/[22m[36mindex-YYQZ95mf.js  [39m[1m[33m1,574.01 kB[39m[22m[2m │ gzip: 366.17 kB[22m
[33m
(!) Some chunks are larger than 500 kB after minification. Consider:
- Using dynamic import() to code-split the application
- Use build.rollupOptions.output.manualChunks to improve chunking: https://rollupjs.org/configuration-options/#output-manualchunks
- Adjust chunk size limit for this warning via build.chunkSizeWarningLimit.[39m
[32m✓ built in 14.01s[39m

```

### `npm run build`

Retour : `0`

```txt

> snake-drive-v4@0.1.0 build
> tsc && vite build

[36mvite v6.4.2 [32mbuilding for production...[36m[39m
transforming...
[32m✓[39m 54 modules transformed.
rendering chunks...
computing gzip size...
[2mdist/[22m[32mindex.html                [39m[1m[2m    1.21 kB[22m[1m[22m[2m │ gzip:   0.61 kB[22m
[2mdist/[22m[2massets/[22m[36mindex-YYQZ95mf.js  [39m[1m[33m1,574.01 kB[39m[22m[2m │ gzip: 366.17 kB[22m
[33m
(!) Some chunks are larger than 500 kB after minification. Consider:
- Using dynamic import() to code-split the application
- Use build.rollupOptions.output.manualChunks to improve chunking: https://rollupjs.org/configuration-options/#output-manualchunks
- Adjust chunk size limit for this warning via build.chunkSizeWarningLimit.[39m
[32m✓ built in 9.03s[39m

```

## 3. Audit assets runtime

| Critère | Résultat |
|---|---:|
| Présents | 24/24 |
| Alpha OK | 24/24 |
| Manquants | 0 |

Contact sheet :
```txt
runtime_assets_contact_sheet.jpg
```

Rapports :
```txt
reports/asset_audit.csv
reports/asset_audit.json
```

### Analyse
Les assets sont maintenant réduits à un set maîtrisé : 3 par univers. C’est le bon niveau de complexité pour éviter de replonger dans les pipelines d’extraction.

Le point à surveiller n’est plus “a-t-on les images ?”, mais :
- leur taille dans la cellule ;
- leur lisibilité mobile ;
- leur cohérence avec la mécanique.

## 4. Audit nettoyage / pipelines

| Élément legacy | Statut |
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


### Analyse
Il reste des éléments résiduels à nettoyer ou à archiver hors runtime.

## 5. Audit intégration gameplay des assets

| Signal GameScene | Détecté |
|---|---:|
| référence `runtimeUniverseAssets` / `getRuntimeAsset` | False |
| référence `RuntimeAssetResolver` / `preloadRuntimeAssets` | True |
| `load.image` | True |
| `add.image` | False |
| `setDisplaySize` | False |
| pickup | True |
| obstacle | True |
| boss | True |

### Analyse
Le code semble brancher ou préparer le branchement des assets runtime. Il faut maintenant valider en preview que les objets apparaissent aux bons endroits.

## 6. Audit des 8 univers et articulation thématique

### Castle
- **Thème** : magie / château / illusion.
- **Assets** : orbe, mur clignotant, miroir sorcier.
- **Articulation gameplay attendue** : le mur/obstacle doit renforcer la mécanique de danger intermittent.
- **Point à travailler** : rendre le clignotement très lisible et éviter que le miroir boss ressemble à un simple décor.

### Sonic
- **Thème** : vitesse, anneaux, obstacles rebondissants.
- **Assets** : anneau, bumper, serpent loop.
- **Articulation gameplay attendue** : le pickup anneau doit encourager la chaîne; le bumper doit signaler un danger clair.
- **Point à travailler** : ne pas surcharger avec trop de références Sonic; rester prototype personnel ou reskin original.

### Streets
- **Thème** : rue, foule, boss urbain.
- **Assets** : bonus, foule, crime lord.
- **Articulation gameplay attendue** : les obstacles doivent évoquer des bloqueurs de passage.
- **Point à travailler** : distinguer clairement foule/ennemi/bonus à taille mobile.

### Fighter
- **Thème** : combat, énergie, charge.
- **Assets** : énergie, marqueur charge, challenger.
- **Articulation gameplay attendue** : le marqueur obstacle doit être perçu comme une zone/attaque, pas comme un pickup.
- **Point à travailler** : clarifier visuellement la mécanique de charge.

### OutRun
- **Thème** : route, checkpoint, voitures.
- **Assets** : checkpoint, voiture, rival turbo.
- **Articulation gameplay attendue** : checkpoint = objectif; voiture = obstacle de trajectoire.
- **Point à travailler** : tester que la voiture reste lisible dans une cellule Snake sans masquer la route/grille.

### Shinobi
- **Thème** : ninja, shuriken, leurres.
- **Assets** : shuriken, decoy ninja, shadow ninja.
- **Articulation gameplay attendue** : distinguer vraie cible / leurre.
- **Point à travailler** : ajouter feedback clair quand le joueur touche un leurre.

### Kombat
- **Thème** : feu, fatal zone, portail dragon.
- **Assets** : token finish, zone fatale, dragon gate.
- **Articulation gameplay attendue** : la zone fatale doit être immédiatement comprise comme dangereuse.
- **Point à travailler** : attention à ne pas confondre pickup finish et danger feu si les couleurs sont trop proches.

### Paperboy
- **Thème** : livraison, chien, chaos quartier.
- **Assets** : journal, chien, bulldog boss.
- **Articulation gameplay attendue** : journal = objectif; chien = danger; boss = menace finale.
- **Point à travailler** : Paperboy est le plus clair thématiquement; il peut servir de niveau référence pour calibrer les autres.

## 7. Audit mobile-first

Signaux scannés :
- `touch` : 20
- `pointer` : 20
- `swipe` : 16
- `mobile` : 20
- `resize` : 8
- `cellSize` : 20

### Points à travailler
1. Valider une seule échelle de cellule entre univers.
2. Ne jamais agrandir la grille pour compenser un asset trop détaillé.
3. Garder les sprites dans la cellule.
4. Vérifier une main / pouce sur Android.
5. Éviter les boutons trop proches du bas écran.

## 8. Audit texte / compréhension

Occurrences anglaises détectées par scan brut : **3**.  
Occurrences françaises détectées : **24**.

### Point à travailler
Vérifier uniquement les textes visibles joueur. Les noms internes anglais sont acceptables, mais les écrans joueur doivent rester français.

## 9. Audit qualité code

| Signal | Nombre |
|---|---:|
| TODO/FIXME/HACK | 0 |
| console.* | 16 |
| eval/innerHTML/document.write | 2 |

### Point à travailler
Nettoyer les logs et TODO avant une version envoyable, surtout sur mobile.

## 10. Priorités recommandées

### P0 — Validation technique
1. Faire passer `npm run check`.
2. Faire passer `npm run build`.
3. Confirmer que `GameScene` affiche vraiment les 24 assets.

### P1 — QA mobile par univers
1. Tester chaque univers.
2. Tester au moins un boss.
3. Ajuster tailles des sprites.
4. Confirmer que la grille reste prioritaire.

### P1 — Articulation mécanique/thème
Chaque univers doit avoir :
- une instruction FR claire ;
- un pickup immédiatement identifiable ;
- un obstacle immédiatement identifiable ;
- un boss distinct ;
- une mécanique réellement perceptible.

### P2 — Polish
1. Nettoyer logs.
2. Nettoyer résidus legacy.
3. Uniformiser feedback visuel.
4. Vérifier transitions intro → niveau → clear/game over.

## 11. Fichiers d’audit produits

```txt
AUDIT_946_FULL_GAME_DESIGN_CODE_ASSETS.md
runtime_assets_contact_sheet.jpg
reports/
  asset_audit.csv
  asset_audit.json
  legacy_cleanup_audit.csv
  legacy_cleanup_audit.json
  runtime_integration_scan.json
  universe_scan.json
  mechanics_scan.json
  mobile_scan.json
  ui_text_hits.json
  quality_hits.json
  recommendations.json
  test_results.json
  inventory.json
```
