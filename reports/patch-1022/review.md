# Review

## Objectif

Documenter les exigences d'environnement pour `npm run check`.
Contexte : pendant PATCH 1021, `npm run check` a échoué une fois en OOM Node/Vite/Rollup. Après fermeture de Chrome et libération RAM, la commande est passée sans modification de configuration. Ce patch documente cette contrainte d'environnement dans CLAUDE.md.

## Résultat

CLAUDE.md mis à jour avec :
- nouvelle section **6. Exigences d'environnement pour `npm run check`** (procédure OOM, warnings connus, interdictions de modification config) ;
- ancienne section 6 (Règles de scope) renumérotée en **7**.

Aucun code source, asset, configuration build ni script npm modifié.

## Fichiers modifiés

- `CLAUDE.md` — ajout section 6 "Exigences d'environnement pour npm run check" ; renumérotation section 7
- `reports/patch-1022/review.md` — ce fichier

## Tests / vérifications

```
npm run check
> tsc && vite build
✓ 60 modules transformed.
✓ built in 10.64s
```

- 0 erreur TypeScript
- 60 modules (identique à l'état précédent)
- Build réussi en 10.64s
- Warning `chunk > 500 kB` : connu et non bloquant (documenté dans CLAUDE.md section 6)
- Aucun OOM lors de cette exécution

## Captures

Aucune capture requise (patch documentation uniquement).

## Documents

Aucun document complémentaire.

## Limites / risques

- Ce patch ne modifie pas la configuration build ; il documente uniquement la contrainte RAM.
- Si OOM persiste malgré RAM disponible, un futur patch dédié sera nécessaire (investigation Vite/Rollup options).
- Le warning `chunk > 500 kB` est connu et non bloquant ; un futur patch de code-splitting pourrait l'adresser si besoin.

## Liens GitHub

- Commit : https://github.com/Ya7o/snake/commit/747152b
- PR : N/A
