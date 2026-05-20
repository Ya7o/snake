# Mobile-first Patch Plan

## P0 - A corriger d'abord

1. Boutons mobiles communs
   - Creer `MobileButton` / `ActionButton`.
   - Remplacer les textes interactifs de Clear, GameOver, LevelIntro et retour map.
   - Garantir une zone tappable proche de 44 px.

2. Typographie fonctionnelle
   - Definir tailles minimales par contexte.
   - Separer titres decoratifs et textes d'action.
   - Revoir les textes HUD trop petits sur 360 px.

3. Interaction WorldMap
   - Valider double tap et drag sur Android reel.
   - Ajuster seuils si le drag declenche encore des taps.

4. Retry / Next direct
   - Faire de `RETRY` et `NEXT LEVEL` les actions primaires evidentes.
   - Garder `WORLD MAP` comme action secondaire.

## P1 - Ensuite

1. Modern-retro gameplay sprites
   - Redessiner ou nettoyer snake head/body/tail.
   - Harmoniser pickups/obstacles par univers avec les boards.
   - Ajouter un feedback pickup/danger plus net.

2. Cadres et HUD par univers
   - Etendre le patch 910 avec des morceaux plus riches si les boards le permettent.
   - Eviter tout asset qui recouvre la grille.
   - Documenter les fallbacks par univers.

3. Architecture UI
   - Centraliser labels, boutons, tailles tactiles et routes communes.
   - Eviter la duplication de `scene.start(...)` dans chaque bouton.

4. Lisibilite WorldMap
   - Tester les nodes sans texte, avec feedback selected/locked/cleared.
   - Ajuster les marqueurs si les repere de l'image suffisent.

## P2 - Finition

1. Micro animations
   - Press states, pulse discret, transitions courtes.

2. Audio et haptique
   - Sons UI legers.
   - Vibration optionnelle si supportee et non intrusive.

3. Accessibilite
   - Mode contraste eleve.
   - Option scanlines reduites.
   - Taille texte confortable.

## Ordre recommande

1. Patch A - Typography clarity.
2. Patch B - Mobile action buttons.
3. Patch C - Interaction economy.
4. Patch D - Modern-retro gameplay sprites.
5. Patch E - Design boards integration for HUD/frame.
6. Patch F - Android performance/input.

## Tests Android recommandes

- Chrome Android 360-430 px portrait.
- Title -> map -> double tap node -> level.
- Drag map lent et rapide.
- Pinch zoom min/max.
- Clear -> next level.
- Game over -> retry.
- Retour map depuis gameplay.
- Niveau Sonic ou OutRun rapide pour ressentir input/FPS.
