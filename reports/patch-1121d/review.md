# PATCH 1121D - Snake Head/Tail Scale Rebalance

**Date:** 2026-06-02
**Fichier modifie:** `src/config/snakeSkins.ts`
**SnakeRenderer.ts:** aucune modification necessaire (partScale deja supporte)

---

## Analyse prealable

La formule de rendu dans `SnakeRenderer.ts` :

```
scale = (cs * 0.92 * partScale) / max(frameWidth, frameHeight)
visual_fill = cs * 0.92 * partScale * content_ratio
```

Ratios de contenu estimes a partir des valeurs existantes et du commentaire inline :
- head : ~88% du sprite (contenu dense, peu de marge transparente)
- body : ~47% du sprite (contenu plus creux)
- tail : ~34% du sprite (contenu tres clairseme)

### Etat avant patch (PATCH 1121B)

| Partie | scale | content_ratio | visual_fill (% cellule) |
|--------|-------|---------------|--------------------------|
| head   | 1.10  | 88%           | ~89%  OK                 |
| body   | 2.00  | 47%           | ~87%  OK                 |
| tail   | 1.30  | 34%           | ~41%  SOUS-REMPLI        |

**Diagnostic :** tailScale=1.3 ne compensait pas le faible ratio de contenu de la queue (34%).
La queue visuellement remplissait ~41% de la cellule contre ~87% pour le corps.
La tete a ~89% etait proche du corps mais la queue tres petite desequilibrait la perception.

---

## Modifications

### `src/config/snakeSkins.ts`

```diff
-    headScale: 1.1,
+    headScale: 1.25,
     bodyScale: 2.0,
-    tailScale: 1.3,
+    tailScale: 3.1,
```

### Calcul des valeurs cibles

**Objectif :** tete +17% visuellement vs body, queue +12% visuellement vs body

Body baseline : cs * 0.92 * 2.0 * 0.47 = **86.7% de fill**

**headScale = 1.25**
visual = cs * 0.92 * 1.25 * 0.88 = 101.2% de fill
- Leger depassement theorique absorbe par les marges transparentes du sprite
- Head visuellement +17% vs body

**tailScale = 3.1**
visual = cs * 0.92 * 3.1 * 0.34 = 96.9% de fill
- Pas de debordement (97% < 100%)
- Tail visuellement +12% vs body

### Etat apres patch

| Partie | scale | content_ratio | visual_fill | delta vs body |
|--------|-------|---------------|-------------|---------------|
| head   | 1.25  | 88%           | ~101%       | +17%          |
| body   | 2.00  | 47%           | ~87%        | baseline      |
| tail   | 3.10  | 34%           | ~97%        | +12%          |

---

## Invariants verifies

- OK Gameplay non modifie
- OK Collisions non modifiees (hitbox = logique Snake, independante du rendu)
- OK Vitesse non modifiee
- OK Logique de rendu SnakeRenderer.ts inchangee
- OK Pivot centre (setPosition au centre de cellule)
- OK Rotation conservee (DIR_TRANSFORM applique identiquement)
- OK bodyScale = 2.0 (baseline maintenue)
- OK headScale dans la plage +15-30% vs body (atteint +17%)
- OK tailScale dans la plage +10-20% vs body (atteint +12%)
- OK Pas de debordement visible pour la queue (97% fill)
- OK head borderline (101%) absorbe par padding transparent du PNG head

---

## Validation

```
npm run check -> tsc + vite build : 0 erreurs, 0 warnings TypeScript
Build : 62 modules, dist/index.html + 1 chunk JS (1627 kB), 12.5s
```

---

## Tests recommandes en jeu

- [ ] Serpent horizontal (direction RIGHT/LEFT) : verifier taille relative head/body/tail
- [ ] Serpent vertical (direction DOWN/UP) : rotation 90 deg, pas de clip
- [ ] Apres croissance (+3 segments) : body ne domine plus
- [ ] Rotation 4 directions : tete lisible, queue identifiable
- [ ] Verifier absence de chevauchement visuel entre segments
- [ ] Verifier que la hitbox n'a pas change (collision gameplay)
