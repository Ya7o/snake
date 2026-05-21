# PATCH — Audit mobile-ready conformité complète

## Contexte
Snake Drive V4 est prioritairement joué sur téléphone Android via navigateur. Les dernières versions montrent plusieurs fragilités : boutons peu ergonomiques, textes parfois illisibles, parcours utilisateur encore trop lourd, rendu pixel brut, cadres mal fittés, interactions WorldMap discutables et manque de cohérence mobile-first.

## Objectif
Auditer entièrement le jeu pour vérifier s’il est réellement mobile-ready : ergonomie, typographie, lisibilité, performance, interactions tactiles, layout portrait, accessibilité minimale, cohérence des parcours, et conformité à la direction modern-retro.

## Fichiers à auditer
- `src/main.ts` — configuration Phaser, scale, renderer, antialias, pixelArt, resolution.
- `src/scenes/*` — toutes les scènes : title, world map, intro, gameplay, clear, game over, boss.
- `src/ui/*` — boutons, textes, panneaux, HUD, helpers UI.
- `src/input/*` — swipe, tap, double tap, pointer, keyboard.
- `src/config/*` — constantes mobile, tailles, safe area, fonts, couleurs.
- `src/data/*` — labels, textes, niveaux, univers, boss.
- `src/renderers/*` — cadres, grille, décor, sprites, effets.
- `package.json`, `vite.config.*`, `tsconfig.*` — scripts, build, preview, contraintes.

## Fichiers interdits
- Ne pas modifier le gameplay dans cet audit.
- Ne pas supprimer les 8 univers.
- Ne pas supprimer les 16 niveaux.
- Ne pas supprimer les 8 boss.
- Ne pas supprimer la WorldMap.
- Ne pas ajouter de dépendance.
- Ne pas revenir à un HTML monofichier.

## Comportement attendu
- [ ] Produire un rapport `docs/audits/926_MOBILE_READY_COMPLIANCE_AUDIT.md`.
- [ ] Vérifier toutes les scènes en viewport mobile portrait 360–430 px.
- [ ] Identifier les textes trop petits, trop pixellisés, coupés ou en anglais.
- [ ] Identifier les boutons trop petits, mal placés, ambigus ou peu accessibles au pouce.
- [ ] Identifier les parcours trop longs : sélection + bouton inutile, retry trop lent, retour map peu clair.
- [ ] Vérifier la cohérence tap / double tap / drag / swipe.
- [ ] Vérifier que les actions principales sont visibles en moins d’une seconde.
- [ ] Vérifier le fit des cadres et la priorité de la grille Snake.
- [ ] Vérifier que les décors ne chevauchent pas le plateau.
- [ ] Vérifier les réglages renderer : `pixelArt`, `roundPixels`, `antialias`, `resolution`, `scale`.
- [ ] Vérifier les risques performance Android : objets créés dans `update()`, listeners accumulés, textures recréées, tweens/timers non nettoyés.
- [ ] Classer chaque problème en P0 / P1 / P2.
- [ ] Proposer des patchs concrets, ordonnés, au format court.

## Critères mobile-ready à vérifier
- Zone tappable minimale proche de 44 px CSS ou équivalent Phaser.
- Texte fonctionnel lisible sans effort sur Android.
- Une action principale dominante par écran.
- Parcours court : action directe quand possible.
- Pas de bouton critique trop bas ou trop proche des bords navigateur.
- Pas de conflit entre drag et double tap.
- Pas de décor prioritaire sur la grille.
- Rendu modern-retro propre : nostalgie 16-bit, finition actuelle.
- Performance stable en `npm run preview -- --host 0.0.0.0`.

## Hors scope
- Implémenter les corrections.
- Refaire tous les assets.
- Refaire les mécaniques.
- Refaire les design boards.
- Refaire la WorldMap.

## Rapport final obligatoire
À la fin, liste clairement :

1. Fichiers audités.
2. Score mobile-ready global sur 100.
3. Résumé P0 / P1 / P2.
4. Scènes conformes.
5. Scènes non conformes.
6. Problèmes de typographie.
7. Problèmes d’ergonomie tactile.
8. Problèmes de performance Android.
9. Problèmes de layout / fit.
10. Patchs recommandés dans l’ordre.
11. Questions ou points bloquants.
