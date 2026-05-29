# Physical Mobile Device QA — Snake Drive V4

## Informations device

| Champ | Valeur |
|---|---|
| Device | À renseigner (ex : iPhone 14, Samsung Galaxy S23…) |
| OS | À renseigner (ex : iOS 17.4, Android 14) |
| Navigateur | À renseigner (ex : Safari, Chrome Mobile) |
| Réseau | À renseigner (ex : Wi-Fi, 4G) |
| Date de test | À faire sur device réel |
| Test réel effectué | **Non** — checklist préparée, exécution à faire sur device physique |

URL testée : https://ya7o.github.io/snake/

---

## Checklist QA mobile

| # | Critère | Statut | Notes |
|---|---|---|---|
| 1 | Chargement initial — page se charge sans erreur | Non testé | |
| 2 | Title lisible — texte "Snake Drive" ou titre visible et non coupé | Non testé | |
| 3 | Bouton Start tactile — tap déclenche la transition vers WorldMap | Non testé | |
| 4 | WorldMap lisible — nœuds et labels visibles, pas de chevauchement | Non testé | |
| 5 | Hint compris — texte "TAPE POUR SÉLECTIONNER / RETAPE POUR LANCER" visible et lisible | Non testé | |
| 6 | Castle accessible — nœud Castle visible et sélectionnable au tap | Non testé | |
| 7 | Retap Castle lance le niveau — second tap sur Castle sélectionné démarre la partie | Non testé | |
| 8 | Gameplay Castle jouable — serpent répond aux contrôles, HUD affiché | Non testé | |
| 9 | Swipe / contrôle directionnel — swipe gauche/droite/haut/bas reconnu | Non testé | |
| 10 | Audio après interaction — son se déclenche après premier tap utilisateur | Non testé | |
| 11 | Unlock all discret — `?unlockAll=1` débloque sans UI intrusif | Non testé | |
| 12 | Reset progress — `?resetProgress=1` réinitialise la progression | Non testé | |
| 13 | Orientation portrait — affichage correct en portrait, pas de débordement | Non testé | |
| 14 | Pas de scroll page parasite — le swipe de jeu ne scrolle pas la page du navigateur | Non testé | |
| 15 | Pas de clipping HUD — score, vies, timer non coupés par notch ou barre navigateur | Non testé | |
| 16 | Performance acceptable — pas de freeze observable, animations fluides | Non testé | |

---

## Problèmes observés

Aucun — test non effectué sur device physique.

---

## Verdict

**En attente** — checklist préparée. Test à exécuter sur un device physique avec accès à l'URL publique https://ya7o.github.io/snake/.

---

## Recommandations

1. Tester en priorité sur **iOS Safari** (comportement touch event différent de Chrome Android).
2. Vérifier le critère 14 (scroll parasite) avec attention : les jeux Phaser sur mobile peuvent laisser le scroll navigateur actif si `preventDefault` n'est pas appelé sur les touch events.
3. Tester critère 9 (swipe) avec des gestes rapides — la détection de direction peut échouer sur les diagonales.
4. Pour le critère 15 (HUD clipping), tester sur iPhone avec notch et sur Android avec barre de navigation dynamique.
5. Documenter la version exacte du navigateur mobile utilisé (les bugs WebGL varient entre versions).
