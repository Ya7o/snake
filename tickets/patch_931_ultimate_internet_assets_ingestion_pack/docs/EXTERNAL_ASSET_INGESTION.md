# External asset ingestion

## Pourquoi ce patch existe
Le pipeline developer assets reste fragile. Ce patch ajoute des sources internet candidates par univers, mais avec un garde-fou : rien n’est intégré automatiquement dans le gameplay.

## Workflow
1. Télécharger.
2. Indexer.
3. Auditer visuellement.
4. Découper les sprites utiles.
5. Optimiser pour mobile.
6. Brancher seulement les assets validés.

## Commandes
```bash
npm run assets:download-external
npm run assets:index-external
```

Pour les sources user-licensed :
```bash
ALLOW_USER_LICENSED_ASSETS=1 npm run assets:download-external
```

## QA obligatoire
Un asset doit être refusé si :
- il est trop lourd ;
- il est illisible sur mobile ;
- il copie trop directement une IP ;
- il ne respecte pas la direction modern-retro ;
- il gêne la grille Snake.
