# Ticket 901 — Plan corrections post-audit

## Objectif

Transformer l’audit en tickets correctifs prêts à envoyer au PC.

## Entrées

- Rapport du ticket 900.
- Captures utilisateur.
- Bugs console.
- Matrice d’acceptation.

## Résultat attendu

Créer des tickets :

- `902_FIX_P0_...`
- `903_FIX_P1_...`
- `904_FIX_P2_...`

Chaque ticket doit préciser :
- root cause ;
- symptômes ;
- fichiers à modifier ;
- fichiers interdits ;
- contraintes mécaniques ;
- contraintes design ;
- contraintes mobile ;
- tests.

## Priorité

P0 :
- build cassé ;
- écran noir ;
- crash ;
- input inutilisable ;
- aucun niveau lançable.

P1 :
- mécanique absente ;
- boss absent ;
- map partiellement cassée ;
- lisibilité mauvaise ;
- design pack mal utilisé.

P2 :
- polish ;
- transitions ;
- audio ;
- détails visuels.

## Interdit

Ne pas faire de refonte globale.
