# External asset manual download workflow

## Quand utiliser le dépôt manuel
Utilise `_manual_drop/<sourceId>/` quand :
- l’URL est itch.io ;
- l’URL demande une session ;
- l’URL retourne HTML ;
- la page ne donne pas de lien direct stable ;
- l’asset est déjà sous licence utilisateur.

## Procédure
1. Télécharger manuellement l’asset depuis la page source.
2. Déposer les fichiers dans :
   `public/assets/external/_manual_drop/<sourceId>/`
3. Lancer :
   `npm run assets:download-external`
4. Le script copie vers :
   `public/assets/external/_downloaded/<sourceId>/`
5. Lancer :
   `npm run assets:index-external`
   `npm run assets:audit-external`

## Règle
Un asset manuel n’est pas encore validé gameplay. Il est seulement ingéré.
