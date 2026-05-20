# PATCH — Mobile fit, WorldMap, intro et cadres

## Contexte
La dernière version progresse, mais plusieurs régressions mobile restent visibles sur Android : le bouton de l’écran d’introduction déborde, la WorldMap est trop zoomée et masque son cadre, le bouton `START` sous la minimap est inutile, certains marqueurs boss affichent un bandeau rouge parasite, les étoiles / icônes de sélection sont incohérentes, l’intro Sonic reste en anglais et n’explique pas assez la mécanique, et certains cadres de gameplay ne fit pas l’écran tandis que des décors mordent sur le plateau.

## Objectif
Corriger en une passe cohérente les régressions mobile-first les plus visibles : fit des boutons et panneaux, cadrage WorldMap, nettoyage des marqueurs WorldMap, textes FR et consignes d’intro, et fit correct des cadres de gameplay pour que le décor n’empiète plus sur la zone de jeu.

## Fichiers à modifier
- `src/scenes/WorldMapScene.ts` — corriger le zoom/cadrage initial mobile, supprimer le bouton `START` sous la minimap, nettoyer les icônes de sélection / étoiles / badges boss, et vérifier les overlays parasites.
- `src/scenes/LevelIntroScene.ts` — corriger le layout mobile, empêcher le débordement des boutons, passer les textes en français, et afficher la consigne de mécanique spéciale.
- `src/data/levels.ts` — compléter / corriger les textes FR des niveaux et boss, notamment Sonic.
- `src/data/worldMap*.ts` ou `src/data/levels.ts` — vérifier mapping étoiles / sélection / boss.
- `src/scenes/GameScene.ts` — corriger le fit mobile des cadres / plateaux selon l’univers actif.
- `src/renderers/*` ou `src/ui/*` — si un renderer de cadre / overlay / panel existe déjà, corriger la logique ici plutôt que dupliquer dans les scènes.
- `src/config/*` — centraliser les constantes de marge mobile, safe area, panel width, scale, fit et offsets si nécessaire.

## Fichiers interdits
- Ne pas supprimer les 8 univers.
- Ne pas supprimer les 16 niveaux.
- Ne pas supprimer les 8 boss.
- Ne pas supprimer la WorldMap.
- Ne pas modifier les règles de gameplay Snake.
- Ne pas revenir à un HTML monofichier.
- Ne pas ajouter de dépendance.
- Ne pas afficher les design boards brutes dans le gameplay.

## Comportement attendu
- [ ] Les boutons de l’écran d’introduction ne débordent plus horizontalement ou verticalement.
- [ ] Les boutons d’intro sont adaptés mobile : largeur utile, marge interne propre, zone tappable confortable.
- [ ] La WorldMap arrive légèrement dézoomée pour laisser voir le cadre, proche de la capture de référence.
- [ ] Le bouton `START` sous la minimap est supprimé.
- [ ] Les bandeaux rouges parasites sur certaines icônes boss sont supprimés.
- [ ] Les étoiles, checkmarks et icônes de sélection sont cohérents, lisibles et non superposés de façon confuse.
- [ ] L’intro Sonic est en français.
- [ ] L’intro Sonic explique clairement la particularité du niveau (anneaux en chaîne / rythme / objectif).
- [ ] Les autres intros restent cohérentes avec la logique FR déjà engagée.
- [ ] Les cadres de gameplay fit correctement l’écran mobile portrait.
- [ ] Les décors n’empiètent plus sur la zone utile du plateau Snake.
- [ ] Le plateau reste centré, lisible, et prioritaire par rapport au décor.
- [ ] Les univers Sonic et Kombat ne débordent plus comme sur les captures.

## Contraintes
- Mobile Android prioritaire.
- Viewport cible : 360–430 px de large, portrait.
- Le fit doit respecter les safe areas et laisser une zone respirable autour du cadre.
- Les boutons d’intro doivent tenir sans overlap même si le texte change.
- Le plateau Snake doit rester pleinement visible sans décor bloquant les cases jouables.
- Le cadrage WorldMap doit rester exploitable au tap/drag.
- Si un comportement diffère entre desktop et mobile, la priorité est mobile.
- Préférer des constantes et helpers communs plutôt que des offsets magiques dispersés.

## Hors scope
- Refaire complètement la WorldMap.
- Refaire tous les sprites gameplay.
- Refaire l’ensemble du HUD.
- Optimisation performance complète Android.
- Refonte complète du système boss.
- Intégration exhaustive des design boards.

## Rapport final obligatoire
À la fin, liste clairement :

1. Fichiers modifiés.
2. Cause du débordement du bouton d’intro.
3. Règle de cadrage WorldMap appliquée.
4. Cause des bandeaux rouges / icônes parasites boss.
5. Règle retenue pour étoiles / sélection / boss.
6. Textes FR ajoutés ou corrigés, notamment Sonic.
7. Règle de fit des cadres / plateau gameplay.
8. Tests effectués et résultats.
9. Questions ou points bloquants.

Si un doute existe, le lister explicitement : mapping boss ambigu, asset parasite non identifié, renderer de cadre partagé, scène intro différente, ou conflit entre décor et zone jouable.
