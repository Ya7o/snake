# AUDIT 955 — Packaging web / déploiement

## Constats
- Taille dist : 38594.0 Ko
- Fichiers dist : 200
- Meta viewport : True
- Favicon/manifest/theme refs : 15

## Risques
- P1 : poids dist élevé si anciens assets embarqués.
- P1 : favicon/PWA absent si distribution mobile.
- P1 : chemins cassés selon hébergement.
- P2 : cache navigateur mobile.

## Corrections recommandées
- Vérifier dist sur hébergement cible.
- Vérifier chemins relatifs assets.
- Ajouter favicon/app icon si absent.
- Ajouter manifest PWA seulement si souhaité.
- Contrôler cache et hard refresh mobile.
- Documenter commande de déploiement.
