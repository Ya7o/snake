# PATCH — Français + écran d’introduction niveau avec consignes

## Contexte
Snake Drive V4 mélange encore des textes anglais (`NEXT LEVEL`, `RETRY`, `WORLD MAP`, etc.) alors que le jeu doit être en français. De plus, une fois un niveau choisi, le joueur comprend difficilement la mécanique spéciale du niveau ou du boss. Les univers ont chacun une mécanique propre, mais elle n’est pas expliquée clairement avant de jouer.

## Objectif
Passer les textes visibles du jeu en français et ajouter un écran d’introduction concis avant chaque niveau/boss, après sélection depuis la WorldMap, pour expliquer la mécanique spéciale et l’objectif immédiat.

## Fichiers à modifier
- `src/data/levels.ts` — ajouter ou compléter les textes français par niveau : titre, objectif, mécanique, astuce courte.
- `src/data/worlds.ts`, `src/data/universes.ts` ou équivalent — ajouter ou compléter les noms français / labels d’univers si la data existe.
- `src/scenes/WorldMapScene.ts` — faire transiter le lancement d’un niveau vers l’écran d’introduction plutôt que lancer directement le gameplay, sauf cas déjà géré ailleurs.
- `src/scenes/LevelIntroScene.ts` — créer cette scène si elle n’existe pas.
- `src/scenes/GameScene.ts` ou scène gameplay équivalente — recevoir le niveau depuis l’intro et lancer le gameplay normalement.
- `src/scenes/ClearScene.ts` — traduire les textes visibles et conserver une action principale claire.
- `src/scenes/GameOverScene.ts` — traduire les textes visibles et conserver une action principale claire.
- `src/scenes/TitleScene.ts` ou `src/scenes/MenuScene.ts` — traduire les textes visibles du menu.
- `src/ui/*` — si les boutons/textes sont mutualisés, centraliser la traduction ici.
- `src/config/*` — si une liste de textes constants existe, y créer un dictionnaire français.

## Fichiers interdits
- Ne pas supprimer les 8 univers.
- Ne pas supprimer les 16 niveaux.
- Ne pas supprimer les 8 boss.
- Ne pas supprimer la WorldMap.
- Ne pas modifier les règles de gameplay Snake.
- Ne pas afficher les design boards brutes dans le gameplay.
- Ne pas ajouter de dépendance.
- Ne pas revenir à un HTML monofichier.

## Comportement attendu
- [ ] Tous les textes visibles principaux sont en français.
- [ ] Les boutons anglais sont remplacés : `NEXT LEVEL` → `NIVEAU SUIVANT`, `RETRY` → `REJOUER`, `WORLD MAP` → `CARTE`, `START` → `JOUER`, etc.
- [ ] Après sélection d’un niveau accessible, un écran d’introduction apparaît avant le gameplay.
- [ ] L’écran d’introduction contient des consignes courtes : objectif, mécanique spéciale, astuce.
- [ ] Pour un boss, l’écran indique clairement que c’est un boss et explique sa mécanique spécifique.
- [ ] Les textes restent concis, lisibles sur Android, et ne surchargent pas l’écran.
- [ ] Le joueur peut lancer le niveau depuis l’intro avec un gros bouton mobile-first.
- [ ] L’intro peut être passée rapidement par tap direct / bouton principal.
- [ ] Les actions restent compatibles avec l’économie d’interaction mobile : pas de parcours inutilement long.
- [ ] La WorldMap conserve le double tap direct si déjà implémenté, mais le double tap doit ouvrir l’intro ou lancer selon règle définie clairement.
- [ ] Les textes français sont centralisés autant que possible, pas dispersés en dur partout.

## Contraintes
- Mobile Android prioritaire.
- Viewport cible : 360–430 px de large en portrait.
- Texte concis : idéalement 2 à 4 lignes utiles maximum.
- Une seule action principale sur l’intro : `JOUER`.
- Action secondaire possible : `CARTE`.
- Pas de tutoriel long.
- Pas de modal qui casse le rythme.
- Typographie fonctionnelle nette, pas pixel illisible.
- Le style doit rester modern-retro : inspiration Mega Drive / 16-bit, finition actuelle.

## Textes français recommandés par univers

### Castle — murs illusion
- Objectif : `Mange les orbes et évite les murs.`
- Mécanique : `Certains murs clignotent : ils peuvent apparaître ou disparaître.`
- Astuce : `Observe le rythme avant de foncer.`
- Boss Witch Mirror : `Le miroir trompe tes repères. Suis le vrai danger, pas son reflet.`

### Sonic — chaînes d’anneaux
- Objectif : `Ramasse les anneaux en chaîne.`
- Mécanique : `Les chaînes d’anneaux rapportent plus si tu gardes le rythme.`
- Astuce : `Prépare ton virage avant le prochain anneau.`
- Boss Loop Serpent : `La boucle change ta trajectoire. Anticipe la sortie.`

### Streets — foule
- Objectif : `Traverse la rue et récupère les bonus.`
- Mécanique : `La foule bloque des passages temporairement.`
- Astuce : `Attends l’ouverture plutôt que forcer.`
- Boss Crime Lord : `Ses hommes ferment les routes. Garde une voie de secours.`

### Fighter — charge / rounds
- Objectif : `Survis au round et frappe au bon moment.`
- Mécanique : `La charge impose un déplacement plus engagé.`
- Astuce : `Ne déclenche pas la charge sans sortie.`
- Boss Final Challenger : `Il punit les trajectoires prévisibles. Varie ton rythme.`

### OutRun — lanes / checkpoints
- Objectif : `Atteins les checkpoints sans sortir de route.`
- Mécanique : `La route te pousse entre les voies.`
- Astuce : `Corrige tôt, pas au dernier moment.`
- Boss Turbo Rival : `Le rival accélère la pression. Reste propre dans les virages.`

### Shinobi — focus / leurres
- Objectif : `Repère la vraie cible.`
- Mécanique : `Des leurres peuvent t’attirer dans un piège.`
- Astuce : `Utilise le focus avant de t’engager.`
- Boss Shadow Ninja : `L’ombre copie tes mouvements. Ne poursuis pas le leurre.`

### Kombat — zones fatales
- Objectif : `Survis et attends la fenêtre de finition.`
- Mécanique : `Les zones fatales deviennent dangereuses par séquences.`
- Astuce : `Entre seulement quand la fenêtre est ouverte.`
- Boss Dragon Gate : `Le portail alterne danger et ouverture. Patiente, puis frappe.`

### Paperboy — livraisons
- Objectif : `Livre les bonnes maisons.`
- Mécanique : `La route se remplit d’obstacles et de cibles.`
- Astuce : `Vise la livraison, pas tous les bonus.`
- Boss Neighborhood Chaos : `Le quartier devient instable. Priorise les livraisons sûres.`

## Hors scope
- Refaire tous les sprites.
- Refaire le HUD complet.
- Refaire la WorldMap.
- Corriger toutes les performances Android.
- Intégrer complètement les design boards.
- Ajouter un système multilingue complet si le jeu reste uniquement français.

## Rapport final obligatoire
À la fin, liste clairement :

1. Fichiers modifiés.
2. Où les textes français sont centralisés.
3. Scène d’introduction créée ou modifiée.
4. Règle de navigation : WorldMap → intro → gameplay.
5. Règle boss vs niveau normal.
6. Liste des textes français ajoutés.
7. Tests effectués et résultats.
8. Questions ou points bloquants.

Si un doute existe, le lister explicitement : niveau sans univers, boss non identifié, mécanique ambiguë, texte trop long sur mobile, scène de lancement incertaine, ou conflit avec double tap WorldMap.
