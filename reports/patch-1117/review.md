# Review — PATCH 1117

## Objectif
Corriger les 3 problèmes P1 identifiés dans l'audit PATCH 1111 (gameplay + boss) et VIS-01 de l'audit 1112 :
GAM-01 Paperboy vitesse · GAM-02 anneaux Sonic inactifs · GAM-03 cœurs Unicode boss HUD.

## Résultat
**3 corrections appliquées. 0 régression.**

| ID | Correction | Fichier |
|---|---|---|
| GAM-01 | Paperboy normal `speedMs: 110` → `145` | levels.ts |
| GAM-02 / VIS-01 | `chainRing.inactive: 0x5d4e00` → `0x4a4a7a` (bleu-gris lisible) | ObstacleRenderer.ts |
| GAM-03 | `getHudExtra()` : suppression des `♥♡` Unicode, retourne `''` → centre HUD affiche le ruleText du boss | BaseBoss.ts |

## Fichiers modifiés
- `src/config/levels.ts`
- `src/render/ObstacleRenderer.ts`
- `src/mechanics/bosses/BaseBoss.ts`

## Tests / vérifications
```
npm run check
✓ 0 erreurs TypeScript
✓ 61 modules transformés
⚠ chunk > 500 kB — warning connu non bloquant
✓ built in 10.96s
```

## Captures
Non produites — corrections de valeurs numériques et couleur.

## Détail GAM-01
Paperboy normal : 110ms → 145ms/tick.
Impact : vitesse réduite de ~24%. Mécanique double-objet (journal + cible livraison) plus lisible.
Paperboy boss reste à 155ms (inchangé).

## Détail GAM-02
Ancien `0x5d4e00` (olive sombre, quasi invisible sur fond sombre) → `0x4a4a7a` (bleu-gris neutre).
La distinction active (jaune `0xf9ca24`) vs inactive (bleu-gris `0x4a4a7a`) est maintenant claire.
Le comportement mécanique est inchangé : les anneaux inactifs ne sont pas létaux.

## Détail GAM-03
`getHudExtra()` retourne `''` au lieu de `PV ♥♥♡`.
Le centre HUD de la capsule affiche désormais le `ruleText` du boss (ex: "3 MANCHES", "COUPE LA BOUCLE").
Le HP reste visible dans la capsule progress : `HP 2/3` (préfixe `'HP '` inchangé dans GameScene).
Plus de risque de caractère Unicode non rendu sur Android < 10.

## VIS-05 (confirmé non-bloquant)
`applyGameplayTextureFilter` est appelé dans `fitImageInCell()` pour toutes les images y compris les boss chargés dynamiquement. Les clés `rt_*` sont correctement traitées par `TextureFiltering.ts`. Aucun changement de code nécessaire.

## VIS-08 (documenté)
`world_token_*.png` : 8 assets orphelins dans `public/assets/ui/`. Aucune référence dans `src/`. Non supprimés en pré-release (hors scope).

## Limites / risques
- Paperboy normal 145ms : à valider en play-test (peut encore être difficile si la mécanique de livraison demande de l'apprentissage).
- Couleur `0x4a4a7a` des anneaux inactifs : à confirmer visuellement sur fond sombre. Si trop visible pour un "ring inactif passable", baisser l'alpha dans `drawChainRing`.

## Liens GitHub
À compléter après push.
