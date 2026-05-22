# 970 — World Rules Matrix

Cette matrice sert de référence à l’implémentation Phase 1.

Elle n’est pas une bible définitive. Elle empêche surtout la dérive de scope.

| Monde | Niveau normal | Objectif | Gimmick | Boss | Boss rule |
|---|---|---:|---|---|---|
| Castle | Jardin Enchanté | 10 | murs fantômes pulsés | Miroir Sorcière | toucher le vrai miroir stable |
| Sonic | Zone des Anneaux | 15 | chaînes de rings | Serpent en Boucle | couper la boucle au bon timing |
| Streets | Bagarre en Ruelle | 10 | foule mobile | Seigneur du Crime | survivre à l’étau puis toucher ouverture |
| Fighter | Dojo des Guerriers | 8 | charge directionnelle | Challenger Final | 3 manches / fenêtres propres |
| OutRun | Autoroute du Soleil | 10 | lanes + checkpoints | Rival Turbo | dépasser dans bonne voie |
| Shinobi | Dojo des Neiges | 8 | vraie cible / leurres | Ninja de l’Ombre | suivre l’ombre vraie |
| Kombat | Arène des Enfers | 10 | zones fatales télégraphiées | Porte du Dragon | fenêtre de portail |
| Paperboy | Tournée du Matin | 8 | livraisons | Chaos du Quartier | survivre vagues puis livrer |

---

## Balancing initial recommandé

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

Ces valeurs correspondent déjà globalement au fichier `src/config/levels.ts`. Ne les changer que si un test manuel démontre un problème.

---

## Règles de télégraphie

| Danger | Warning minimal | Létal |
|---|---:|---:|
| mur illusion | 3–5 ticks | oui |
| zone feu | 3–5 ticks | oui |
| blocker mobile | visible avant mouvement | oui |
| trafic | spawn en haut / trajectoire visible | oui |
| leurre shinobi | non létal tant qu’on ne collecte pas | oui si mauvais choix |
| boss hit window | visible et stable | non, sert à attaquer |

---

## Règles de scoring

- Pickup standard : +1.
- Pickup bonus ou action parfaite : +2 maximum.
- Boss hit : -1 PV boss, pas forcément score.
- Ne pas ajouter de multiplicateurs complexes en Phase 1.

---

## Règles de fail

Le joueur meurt si :

- collision avec soi-même ;
- sortie de grille ;
- danger actif ;
- mauvais choix explicite dans certains mondes.

Ne pas tuer le joueur pour une règle non expliquée.
