# Minimal Score System Design

## Objectif

Ajouter de la rejouabilité sans rendre le jeu brutalement plus difficile.

## Décision produit

- jeu accessible par défaut ;
- score comme objectif secondaire ;
- best score local par niveau ;
- bonus clairs ;
- pas de leaderboard online ;
- pas de grades pour le premier patch ;
- pas de boutique / monnaie / upgrades.

## Score proposé

| Événement | Points proposés | Notes |
|---|---:|---|
| Pickup collecté | +100 | niveaux normaux uniquement si pickup réel |
| Niveau terminé | +500 | clear normal |
| Boss touché | +250 | weakpoint / hit réel |
| Boss vaincu | +1000 | boss clear |
| Bonus temps restant | +10 par seconde | si timer disponible |
| GameOver | score affiché mais pas de bonus clear | ne pas punir plus |

## Affichage proposé

Décider où afficher :

| Écran | Affichage score | Recommandation |
|---|---|---|
| HUD gameplay | optionnel / plus tard | ne pas alourdir maintenant |
| ClearScene | score + best score | recommandé |
| GameOverScene | score obtenu | recommandé si simple |
| WorldMap | pas maintenant | éviter surcharge |

Recommandation :

- afficher score et best score sur ClearScene ;
- afficher score sur GameOver si simple ;
- ne pas toucher au HUD gameplay dans la première implémentation si cela risque de casser les templates.

## Persistance

- best score par `levelId` ;
- stockage `localStorage` ;
- pas de cloud ;
- reset progress peut aussi reset les scores ou non.

Décision documentée :

- Option recommandée : `?resetProgress=1` reset progression + best scores pour garder un reset propre.

## Scope PATCH 1073

PATCH 1073 devra implémenter :

- score runtime par niveau ;
- ajout points pickup / clear / boss hit / boss clear ;
- best score `localStorage` par `levelId` ;
- affichage ClearScene ;
- affichage GameOver si simple ;
- reset scores avec reset progress si logique centralisée ;
- aucun leaderboard ;
- aucune difficulté nouvelle ;
- aucun changement de gameplay.

## Risques

- score invisible si seulement stocké ;
- score trop généreux ;
- bonus temps impossible si timer non exposé ;
- HUD déjà chargé ;
- `localStorage` migration.

## Ne pas faire maintenant

- grades S/A/B/C ;
- étoiles ;
- leaderboard online ;
- succès ;
- monnaie ;
- boutique ;
- upgrades ;
- difficulty scaling ;
- refonte HUD.

## Recommandation finale

Le système de score minimal est validé pour v1.1 si l'implémentation reste locale, simple, non bloquante et affichée surtout sur Clear/GameOver.
