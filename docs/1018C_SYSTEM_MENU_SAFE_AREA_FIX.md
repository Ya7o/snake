# 1018C — System Menu Safe Area Fix

## Problème

L'audit PATCH 1017C a identifié que plusieurs écrans LevelIntro boss avaient une marge basse insuffisante dans le panneau d'info :

- **Mortal Kombat boss** — texte potentiellement collé au bas du panneau
- **Paperboy boss** — idem
- **OutRun boss** — idem
- **Streets boss** — idem
- **Sonic boss** — idem

Root cause :
1. `minPanelH` boss non-Castle = 120px — trop petit pour accueillir badge BOSS + nom + règle + PV + hint sur 2 lignes avec confort.
2. `desiredPanelTopY` boss non-Castle = `H * 0.58` (identique au normal) — le panneau ne remontait pas pour laisser plus de place sur les écrans boss.
3. `contentBottomY = infoPanelTopY + panelH - 14` — seulement 14px de padding bas, insuffisant visuellement.

## Changement layout exact

Fichier modifié : `src/scenes/LevelIntroScene.ts`

### Ligne 87 — desiredPanelTopY

```diff
- const desiredPanelTopY = isCastle ? H * 0.56 : H * 0.58;
+ const desiredPanelTopY = isCastle ? H * 0.56 : (isBoss ? H * 0.54 : H * 0.58);
```

Les écrans boss non-Castle démarrent le panneau 4% plus haut dans la page, offrant plus de hauteur utile.

### Ligne 88 — minPanelH

```diff
- const minPanelH = isCastle ? (isBoss ? 174 : 158) : (isBoss ? 120 : 108);
+ const minPanelH = isCastle ? (isBoss ? 174 : 158) : (isBoss ? 148 : 116);
```

- Boss non-Castle : 120 → 148px (+28px)
- Normal non-Castle : 108 → 116px (+8px)

### Ligne 119 — contentBottomY

```diff
- const contentBottomY = infoPanelTopY + panelH - 14;
+ const contentBottomY = infoPanelTopY + panelH - 18;
```

Padding bas minimum : 14 → 18px (+4px), le texte ne sera jamais aussi proche du bord bas du panneau.

## Fichiers modifiés

- `src/scenes/LevelIntroScene.ts` — 3 lignes modifiées dans le bloc layout

## Avant / Après

| Paramètre | Avant | Après |
|-----------|-------|-------|
| `desiredPanelTopY` boss | `H * 0.58` | `H * 0.54` |
| `minPanelH` boss non-Castle | 120px | 148px |
| `minPanelH` normal non-Castle | 108px | 116px |
| Padding bas `contentBottomY` | 14px | 18px |

**Résultat attendu :**
- Descriptions boss non collées au bas du panneau
- Texte hint sur 2 lignes lisible avec espace bas confortable
- Boutons non chevauchés (la zone action reste réservée indépendamment)
- Background toujours visible (le panneau ne couvre pas davantage)

## Captures générées

```
tmp/patch1018C/captures/
  castle/          normal_system.png  boss_system.png
  sonic/           normal_system.png  boss_system.png
  street_of_rage/  normal_system.png  boss_system.png
  street_fighter/  normal_system.png  boss_system.png
  outrun/          normal_system.png  boss_system.png
  shinobi/         normal_system.png  boss_system.png
  mortal_kombat/   normal_system.png  boss_system.png
  paperboy/        normal_system.png  boss_system.png
```

Résolution : 390 × 844px (portrait mobile standard).

## Risques résiduels

- Appareils très petits (H < 550px) : le panneau boss peut rester légèrement comprimé — cas rare, non bloquant.
- Textes `introHint` exceptionnellement longs (> 65 chars) : le fallback `setMaxLines(2)` + réduction de fonte gère déjà ce cas.
- Castle est volontairement inchangé : le layout Castle possède sa propre gestion (sections OBJECTIF/DANGER).
- Les textes eux-mêmes ne sont pas corrigés dans ce patch — voir PATCH 1018B.

## Build

```
npm run build → OK
0 erreur TypeScript
60 modules transformés
```
