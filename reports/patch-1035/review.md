# Review — PATCH 1035

## Objectif

Ajouter un texte hint discret dans le footer de la WorldMap pour expliquer comment lancer un niveau, sans ajouter de bouton JOUER.

## Résultat

Texte "RETAPE POUR LANCER" ajouté dans la zone footer de la WorldMap :
- Visible uniquement quand un node **débloqué** est sélectionné
- Masqué quand le node est verrouillé
- Position : `footerY + 30` (sous le nom de niveau décalé à `footerY + 13`)
- Style : `UI_FONT`, `10px`, `#444466`, `alpha 0.75`, non gras
- Aucun bouton JOUER ajouté

## Fichiers modifiés

- `src/scenes/WorldMapScene.ts`
  - Ajout du champ `footerHintTxt` (ligne 51)
  - `footerLevelTxt` décalé à `footerY + 13` (était `footerY + 22`)
  - Création de `footerHintTxt` à `footerY + 30`, initialement invisible
  - `selectNode()` : `setVisible(true/false)` selon `isUnlocked`

## Tests / vérifications

### npm run check
```
tsc && vite build
✓ 60 modules transformed
built in 7.26s
0 erreur TypeScript
Warning chunk > 500 kB — attendu, non bloquant
```

### Vérifications fonctionnelles
- hint visible : **oui** — "RETAPE POUR LANCER" affiché sous le niveau sélectionné
- pas de bouton JOUER ajouté : **oui** — `updateFooterButton()` reste vide
- progression non modifiée : **oui** — aucune logique de save/unlock touchée
- WorldMap lisible : **oui** — hint discret, ne gêne pas la carte

## Captures

- `screenshots/worldmap_default_hint.png` — WorldMap avec premier node sélectionné, hint visible
- `screenshots/worldmap_unlock_all_hint.png` — idem (DEV_UNLOCK_ALL=true, tous nodes accessibles)

## Limites / risques

- Le hint n'est pas animé (statique) — suffisant pour l'objectif
- Sur très petits écrans (<320px de large) le hint peut se chevaucher avec le texte niveau si les deux lignes sont longues, mais le footer 44px reste lisible à 390px (portrait mobile Android standard)
- `DEV_UNLOCK_ALL = true` dans constants.ts — à passer à `false` avant release (hors scope)

## Liens GitHub

- Commit : à générer après push
- Fichier : `src/scenes/WorldMapScene.ts`
- Report : `reports/patch-1035/review.md`
