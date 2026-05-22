# 961 Mobile UI Audit Analysis

Patch: `PATCH_961_MOBILE_UI_AUDIT_LEVEL_INTRO_GAMEPLAY_SCALE`

## Décision d'application

Les corrections ne sont pas toutes du même type :

- **Gameplay vertical bias** : règle transversale. Tous les univers profitent d'un board moins centré trop bas, avec des valeurs par univers seulement pour tenir compte du poids visuel des frames.
- **Largeur OutRun** : exception documentée. OutRun garde un facteur spécifique car son frame plein est très large; il doit préserver le cadre complet sans redevenir minuscule.
- **Intro action bar** : règle transversale. Les boutons sont remontés via une zone sûre commune, pas par patch Shinobi/Kombat.
- **Pickups/anneaux Sonic** : correction de renderer ciblée au type `chainRing`, donc appliquée à Sonic sans affecter les autres mécaniques.

## Audit univers

| Univers | Intro | Gameplay | Décision |
| --- | --- | --- | --- |
| Castle | Action bar commune | Bias commun | Transversal OK. |
| Sonic | Action bar commune | Bias plus haut + anneaux renforcés | Mixte : layout global, anneaux ciblés. |
| Streets | Action bar commune | Bias commun | Transversal OK. |
| Fighter | Action bar commune | Bias commun | Transversal OK. |
| OutRun | Action bar commune | Largeur + bias spécifiques | Exception nécessaire pour le frame large. |
| Shinobi | Action bar commune | Bias commun | Transversal OK; pilote intro. |
| Kombat | Action bar commune | Bias commun | Transversal OK; pilote intro. |
| Paperboy | Action bar commune | Bias commun | Transversal OK. |

## Limites

- Aucun serveur local lancé, conformément à `CLAUDE.md`.
- Les captures Android réelles restent à refaire côté utilisateur pour confirmer les budgets visuels.

