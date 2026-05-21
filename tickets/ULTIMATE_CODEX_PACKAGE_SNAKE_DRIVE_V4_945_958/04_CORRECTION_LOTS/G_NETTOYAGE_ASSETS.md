# LOT G — Nettoyage assets résiduels

## Objectif
Retirer ou archiver les résidus non runtime.

## Résidus détectés
```txt
public/assets/external/_audit
public/assets/external/_sources
public/assets/external/_licenses
```

## À faire
- Vérifier qu’ils ne sont pas utilisés.
- Les supprimer du runtime si inutiles.
- Si conservation nécessaire, documenter pourquoi.

## Interdits
- Ne pas supprimer les 24 assets runtime.
- Ne pas supprimer `src/assets/runtimeUniverseAssets.ts`.

## Tests
```bash
npm run check
npm run build
```
