# AUDIT_PATCH_MOBILE_UI_LEVEL_INTRO_SONIC_SHINOBI

## Contexte

Audit mobile portrait après les patchs précédents. Deux captures montrent que le problème n'est pas seulement local à OutRun/Castle :

- **Shinobi / écran après sélection du niveau** : le panneau d'information chevauche les boutons `JOUER` / `CARTE`. La composition verticale est trop chargée et les boutons ne respectent plus une zone sûre.
- **Sonic / gameplay** : le HUD haut reste trop volumineux et consomme beaucoup d'espace. Le pickup anneau visible sur le bord droit est bon, mais les anneaux/pickups sombres ou semi-transparents dans la grille sont difficiles à distinguer. Le frame bas est très présent et la grille doit rester prioritaire.

Captures :
- `references/screenshots/audit_shinobi_level_intro_overlap.jpg`
- `references/screenshots/audit_sonic_gameplay_hud_pickup_frame.jpg`

## Objectif

Créer une correction système pour les écrans mobile portrait :

1. Empêcher les chevauchements entre panneau de description de niveau et boutons d'action.
2. Réduire et normaliser le HUD gameplay sur tous les univers.
3. Clarifier la lisibilité des pickups semi-transparents/clignotants, notamment Sonic.
4. Maintenir le frame/décor comme habillage, jamais comme élément prioritaire face à la grille.

## Symptômes à corriger

### 1. Shinobi — intro niveau

- Le panneau `DOJO DES NEIGES / VRAIE CIBLE / OBJECTIF` descend trop bas.
- Les boutons `JOUER` et `CARTE` sont partiellement recouverts.
- La séparation entre contenu descriptif et actions n'est pas robuste selon la hauteur utile mobile.

### 2. Sonic — gameplay

- Le HUD haut occupe plusieurs bandes successives.
- L'information est lisible mais trop coûteuse en hauteur.
- Les pickups anneaux non actifs ou semi-transparents sont trop discrets dans la grille.
- La grille reste lisible, mais elle pourrait gagner en espace si le HUD était plus compact.

## Périmètre

### À modifier / inspecter

- `src/scenes/LevelIntroScene.ts` ou équivalent
- `src/scenes/GameScene.ts`
- `src/scenes/WorldMapScene.ts` si l'intro réutilise un layout commun
- `src/render/HUDRenderer.ts`
- `src/render/PickupRenderer.ts`
- `src/render/GridRenderer.ts`
- module de layout responsive / safe-area s'il existe
- configs de niveaux/univers si certains textes forcent des layouts trop hauts

### À éviter

- Ne pas patcher uniquement Shinobi en dur si le layout intro est partagé.
- Ne pas réduire la taille des textes jusqu'à l'illisibilité.
- Ne pas masquer des informations critiques du HUD : les prioriser sur une seule ligne utile.
- Ne pas supprimer les frames d'univers ; les redimensionner/positionner proprement.

## Demandes détaillées

### A. Layout intro niveau robuste

Mettre en place ou corriger une règle de layout verticale :

- zone titre univers en haut ;
- zone visuelle décorative compressible ;
- panneau mission compact ;
- zone boutons toujours réservée ;
- marge de sécurité entre panneau mission et boutons.

Critères :

- `JOUER` et `CARTE` ne doivent jamais être recouverts.
- Le panneau mission peut réduire ses paddings, sa hauteur ou son texte secondaire si nécessaire.
- Sur mobile portrait, les boutons doivent rester pleinement tapables.
- Si le texte est long, utiliser wrapping contrôlé ou version courte, pas chevauchement.

### B. HUD gameplay compact multi-univers

Réduire le HUD haut à une structure plus stricte :

- une ligne principale : univers / objectif court / progression ;
- une ligne secondaire seulement si mécanique indispensable ;
- éviter les doublons score/best/tokens/level si non utiles pendant l'action immédiate ;
- hauteur maximale explicite du HUD en portrait.

Sonic ne doit pas avoir un empilement trop haut de bandeaux décoratifs et statistiques.

### C. Pickups Sonic / pickups semi-transparents

Corriger la lisibilité :

- les pickups collectables doivent être plus visibles que les leurres, ombres ou obstacles ;
- éviter une alpha trop basse ;
- ajouter halo, contour, pulse doux ou badge clair ;
- ne jamais utiliser une animation qui rend le pickup presque invisible pendant une phase.

Critère de base : sur la capture Sonic, tous les anneaux collectables doivent être distinguables immédiatement sans zoom.

### D. Audit tous univers

Tester au minimum :

- Castle : intro + gameplay blink walls ;
- Sonic : intro + gameplay anneaux ;
- OutRun : gameplay frame/pickup ;
- Shinobi : intro + gameplay leurres/cible ;
- Kombat : gameplay zones dangereuses ;
- Paperboy : map/intro + gameplay deliveries.

Documenter toute exception.

## Critères d'acceptation

- [ ] Aucun chevauchement panneau mission / boutons sur Shinobi.
- [ ] Aucun chevauchement équivalent sur les autres intros niveau.
- [ ] Boutons `JOUER` et `CARTE` visibles et tapables à 100%.
- [ ] HUD Sonic réduit ou mieux organisé, sans perdre l'information critique.
- [ ] HUD haut respecte une hauteur maximale raisonnable en portrait.
- [ ] Pickups Sonic visibles immédiatement.
- [ ] Pickups clignotants/semi-transparents jamais rendus quasi invisibles.
- [ ] La grille reste prioritaire sur frame/HUD/décor.
- [ ] `npm run check` passe.

## Hors scope

- Refonte artistique complète de Shinobi ou Sonic.
- Nouvelle mécanique.
- Ajout de dépendance.
- Suppression des univers, niveaux, boss ou de la World Map.

## Consignes d'exécution

1. Lire les fichiers concernés avant modification.
2. Corriger la cause système du layout plutôt qu'un seul cas visuel.
3. Appliquer Shinobi et Sonic comme cas de validation principaux.
4. Auditer rapidement tous les univers.
5. Lancer `npm run check`.
6. Rapporter fichiers modifiés, tests effectués et limites restantes.
