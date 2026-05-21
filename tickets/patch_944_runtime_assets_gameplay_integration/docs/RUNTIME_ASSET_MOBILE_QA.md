# QA mobile — assets runtime

## Vérification écran téléphone
Tester sur :
- 360x800 ;
- 390x844 ;
- 412x915 ;
- Chrome Android réel si possible.

## Checklist
- [ ] Pickup visible mais pas énorme.
- [ ] Obstacle lisible.
- [ ] Boss marker lisible dans niveau boss.
- [ ] Snake toujours prioritaire.
- [ ] Grille toujours lisible.
- [ ] Pas de sprite qui sort fortement de sa cellule.
- [ ] Pas de ralentissement.
- [ ] Aucun asset manquant ne bloque la scène.
- [ ] Aucun ancien pipeline réintroduit.

## Tailles recommandées
- pickup : `cellSize * 0.72`
- obstacle : `cellSize * 0.82`
- boss : `cellSize * 1.15`

## Si un asset paraît trop détaillé
Le garder mais réduire sa taille d’affichage.
Ne pas agrandir la cellule.
Ne pas réduire la grille.
