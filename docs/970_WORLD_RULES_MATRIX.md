# 970 - World Rules Matrix

Cette matrice sert de reference a l'implementation Phase 1.

Elle n'est pas une bible definitive. Elle empeche surtout la derive de scope.

| Monde | Niveau normal | Objectif | Gimmick | Boss | Boss rule |
|---|---|---:|---|---|---|
| Castle | Jardin Enchante | 10 | murs fantomes pulses | Miroir Sorciere | toucher le vrai miroir stable |
| Sonic | Zone des Anneaux | 15 | chaines de rings | Serpent en Boucle | couper la boucle au bon timing |
| Streets | Bagarre en Ruelle | 10 | foule mobile | Seigneur du Crime | survivre a l'etau puis toucher ouverture |
| Fighter | Dojo des Guerriers | 8 | charge directionnelle | Challenger Final | 3 manches / fenetres propres |
| OutRun | Autoroute du Soleil | 10 | lanes + checkpoints | Rival Turbo | depasser dans bonne voie |
| Shinobi | Dojo des Neiges | 8 | vraie cible / leurres | Ninja de l'Ombre | suivre l'ombre vraie |
| Kombat | Arene des Enfers | 10 | zones fatales telegraphiees | Porte du Dragon | fenetre de portail |
| Paperboy | Tournee du Matin | 8 | livraisons | Chaos du Quartier | survivre vagues puis livrer |

## Balancing Initial

| Monde | speedMs normal | quota | speedMs boss | bossHp |
|---|---:|---:|---:|---:|
| Castle | 165 | 10 | 175 | 3 |
| Sonic | 135 | 15 | 145 | 3 |
| Streets | 155 | 10 | 165 | 3 |
| Fighter | 165 | 8 | 175 | 3 |
| OutRun | 130 | 10 | 140 | 3 |
| Shinobi | 160 | 8 | 160 | 3 |
| Kombat | 160 | 10 | 170 | 3 |
| Paperboy | 155 | 8 | 155 | 3 |

Ces valeurs correspondent au fichier `src/config/levels.ts`. Ne les changer que si un test manuel demontre un probleme.

## Telegraphie

| Danger | Warning minimal | Letal |
|---|---:|---:|
| mur illusion | 3-5 ticks | oui |
| zone feu | 3-5 ticks | oui |
| blocker mobile | visible avant mouvement | oui |
| trafic | spawn en haut / trajectoire visible | oui |
| leurre shinobi | non letal tant qu'on ne collecte pas | oui si mauvais choix |
| boss hit window | visible et stable | non, sert a attaquer |

## Scoring

- Pickup standard : +1.
- Pickup bonus ou action parfaite : +2 maximum.
- Boss hit : -1 PV boss, pas forcement score.
- Pas de multiplicateurs complexes en Phase 1.

## Fail

Le joueur meurt si :

- collision avec soi-meme ;
- sortie de grille ;
- danger actif ;
- mauvais choix explicite dans certains mondes.

Ne pas tuer le joueur pour une regle non expliquee.
