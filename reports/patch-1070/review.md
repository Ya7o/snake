# PATCH 1070 — Review

**Date:** 2026-05-30
**Sujet:** Gameplay HUD Template Decision — Castle capsules vs. bande large autres univers
**Type:** Audit produit / Décision UI — aucun code modifié

---

## Résumé

Suite au QA mobile réel, le HUD gameplay présente deux designs distincts :

- **Castle** : 3 capsules pill dorées/violettes, fond transparent, grille 16×26
- **Autres univers (×7)** : bande opaque plein écran, `hud_panel.png`, grille 16×20

L'audit confirme que cette différence est **intentionnelle et fonctionnelle**, non un bug.

---

## Résultats de l'audit

### Constat technique
La bifurcation est explicite dans `src/scenes/GameScene.ts` via le paramètre `capsuleMode = (uid === 'castle')` passé au `HUDRenderer`. Castle est le seul univers avec capsules ; les 7 autres utilisent la bande large.

### Options évaluées

| Option | Décision |
|---|---|
| A — Castle capsules comme template universel | Non recommandé |
| B — Bande large comme template universel | Acceptable si cohérence > identité Castle |
| C — Variations par univers (statu quo) | **Recommandé** |
| D — Template hybride | Non recommandé à ce stade |

### Recommandation : Option C (statu quo)

La différence est un **choix artistique assumé** :
- Castle = identité fantasy distinctive (capsules pill violet/doré)
- Autres univers = lisibilité maximale sur mobile (fond opaque, textes non tronqués)

Les deux implémentations respectent les contraintes mobiles (HUD 56px height, touch targets 46px min).

---

## Livrables

- `reports/patch-1070/docs/gameplay-hud-template-decision.md` — analyse complète, tableau d'options, recommandation
- `reports/patch-1070/screenshots/hud_castle_capsules.png` — Castle HUD (3 capsules)
- `reports/patch-1070/screenshots/hud_paperboy_strip.png` — Paperboy HUD (bande large)
- `reports/patch-1070/screenshots/hud_outrun_strip.png` — OutRun HUD (bande large, boss HP)

---

## Build

```
npm run check → ✓ built in 56.05s (tsc + vite build, 0 erreurs)
```

---

## Aucune modification de code

Conformément aux règles du patch, aucun fichier source ou asset n'a été modifié. L'audit est documentaire uniquement.
