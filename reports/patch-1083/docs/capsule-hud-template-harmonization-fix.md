# Capsule HUD Template Harmonization Fix

## Problème

Après PATCH 1078, le HUD gameplay utilisait un template "flat strip" : fond sombre opaque,
barre accent en haut, texte gauche/centre/droite sans séparation visuelle par zone.

La QA mobile a montré que l'utilisateur préférait un style capsules (zones arrondies),
plus lisible et plus proche de l'identité design du jeu. Castle avait historiquement un HUD
différent des autres univers. Le besoin était un template commun harmonisé.

## Décision

Remplacer le flat strip par un template 3 capsules commun à tous les univers.
Les couleurs d'accent restent propres à chaque univers.

## Template final

### Structure

```
[ UNIVERS ]  [ RÈGLE / HINT ]  [ SCORE / HP ]
```

Dimensions (mobile 390 × 844, HUD HEIGHT = 56 px) :
- Marge extérieure : 5 px chaque côté
- Capsule gauche : ~96 px, radius 10
- Gap : 4 px
- Capsule centre : ~176 px (calculé), radius 10
- Gap : 4 px
- Capsule droite : ~100 px, radius 10
- Hauteur capsule : 40 px, centrée dans le strip de 56 px (8 px padding haut/bas)

### Capsule gauche (univers)

- Fond : 0x060212 opaque + tint accent 9 %
- Bordure : 2 px accent, alpha 0.88
- Texte : Press Start 2P 10 px, couleur accent
- Contenu : `shortName` de l'univers (CASTLE, SONIC, STREETS…)

### Capsule centre (règle / hint)

- Fond : 0x0e0828 opaque
- Bordure : 1 px neutre (#2c2848), alpha 0.72
- Texte : UI font bold 12 px, #c8c8dc
- Contenu : `ruleText` du niveau (EN CHAÎNE, BALISES, ZONES FATALES…)
- `fitCenter()` réduit le texte si trop long (min 11 px)

### Capsule droite (progression / HP)

- Fond : 0x060212 opaque + tint accent 9 %
- Bordure : 2 px accent, alpha 0.88
- Texte : UI font bold 12 px, blanc
- Contenu mode normal : `MAGIC score/quota` (Castle) ou `score/quota` (autres)
- Contenu mode boss : `HP hp/maxHp`

### Séparateur bas

Ligne 1 px accent alpha 0.28 sous le strip complet.

## Changements

| Fichier | Changement | Raison |
|---|---|---|
| src/render/HUDRenderer.ts | Remplacement complet — flat strip → 3 capsules | Template capsules demandé |
| src/scenes/GameScene.ts | Simplification label gauche (suppression cas `isCastle ? 'CASTLE BOSS'`) | shortName suffit, boss HP visible à droite |
| src/scenes/GameScene.ts | Prefix boss `'BOSS HP '` → `'HP '` | Plus compact dans la capsule droite |

## Avant / après

| Univers | Avant | Après | Accent conservé | Notes |
|---|---|---|---|---|
| Castle | Flat strip accent jaune, label "CASTLE" ou "CASTLE BOSS" | 3 capsules accent jaune, label "CASTLE" | oui | Suppression du cas spécial |
| Sonic | Flat strip accent jaune | 3 capsules accent jaune | oui | |
| Streets | Flat strip accent blanc | 3 capsules accent blanc | oui | Bordure blanche lisible |
| Fighter | Flat strip accent orange | 3 capsules accent orange | oui | |
| OutRun | Flat strip accent jaune | 3 capsules accent jaune | oui | |
| Shinobi | Flat strip accent blanc | 3 capsules accent blanc | oui | |
| Kombat | Flat strip accent orange | 3 capsules accent orange | oui | |
| Paperboy | Flat strip accent jaune | 3 capsules accent jaune | oui | |

## Non-régression

- gameplay : inchangé, aucune mécanique ni collision modifiée
- boss HUD : HP visible en capsule droite (`HP 2/3`), rule text en capsule centre
- score/progression : inchangé, même logique `score/quota`
- mobile : HUD HEIGHT reste 56 px — layout grille non modifié
- frames gameplay : inchangées — aucun asset, frame, viewport modifié

## Risques

- Textes longs dans la capsule centre (ex. `FENÊTRE D'ATTAQUE` = 18 chars) : géré par `fitCenter()`.
- Police Press Start 2P chargée depuis Google Fonts — dépend de la connectivité au premier chargement.
- Validation mobile réelle nécessaire pour confirmer le rendu des couleurs d'accent par univers.
