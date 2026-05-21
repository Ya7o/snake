# Notes patch 932

Le rapport 931 est correct : un downloader naïf ne suffit pas.

## Correction de méthode
Il faut traiter trois cas :
- fichier direct ;
- page OpenGameArt à scraper prudemment ;
- téléchargement manuel.

## OpenGameArt
Des liens fichiers existent souvent sous `/sites/default/files/`. Le script peut les extraire depuis le HTML.

## itch.io
Le téléchargement est souvent protégé par une page, une session, ou un bouton dynamique. Il faut passer par dépôt manuel.

## Quality gate
Le script refuse HTML. C’est mieux qu’un faux succès.
