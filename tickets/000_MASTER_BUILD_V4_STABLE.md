# Ticket 000 — Master Build V4 Stable From Scratch

## Objectif

Développer une première V4 stable complète, web mobile, from scratch, en une séquence contrôlée.

L’utilisateur veut pouvoir envoyer ce package sur PC, demander l’exécution de ce ticket, puis obtenir une première version jouable et testable sur téléphone.

## Lecture obligatoire avant code

- `CLAUDE.md`
- `START_HERE_FOR_CLAUDE.md`
- `PROJECT_INDEX.md`
- `docs/01_VISION.md`
- `docs/02_GAME_DESIGN.md`
- `docs/03_MECHANICS_BIBLE.md`
- `docs/04_ART_BIBLE.md`
- `docs/06_TECHNICAL_ARCHITECTURE.md`
- `docs/07_QA_CHECKLIST.md`
- `docs/10_DESIGN_PACK_USAGE.md`
- `docs/13_ACCEPTANCE_MATRIX.md`
- `docs/14_UNIVERSE_IMPLEMENTATION_SPEC.md`
- `design_boards/BOARD_MAPPING.md`

## Résultat attendu

À la fin :
- `npm run check` OK ;
- `npm run dev` lance le jeu ;
- jeu accessible sur téléphone via URL Vite ;
- TitleScene ;
- WorldMapScene ;
- 16 nodes ;
- 8 univers ;
- 16 niveaux ;
- 8 boss ;
- Snake jouable ;
- 8 mécaniques normales différenciées ;
- 8 mécaniques boss différenciées ;
- layout mobile lisible ;
- design pack utilisé ou fallback documenté ;
- sauvegarde simple ;
- retry ;
- clear ;
- game over ;
- matrice d’acceptation remplie dans le résumé.

## Sous-étapes obligatoires

1. Exécuter mentalement `029_MAP_DESIGN_BOARDS_TO_UNIVERSES`.
2. Compléter ou documenter `design_boards/BOARD_MAPPING.md`.
3. Implémenter setup/scènes si nécessaire.
4. Implémenter core Snake.
5. Implémenter state machine.
6. Implémenter configs 8 univers / 16 niveaux / 16 nodes.
7. Implémenter world map.
8. Implémenter layout mobile maître.
9. Implémenter 8 mécaniques normales selon `docs/14_UNIVERSE_IMPLEMENTATION_SPEC.md`.
10. Implémenter 8 boss selon `docs/14_UNIVERSE_IMPLEMENTATION_SPEC.md`.
11. Intégrer le design pack ou fallbacks procéduraux.
12. Ajouter save minimal.
13. Ajouter audio minimal non bloquant.
14. Ajouter QA self-tests.
15. Lancer `npm run check`.
16. Produire un résumé avec matrice de conformité.

## Priorité si le ticket est trop large

Si tout ne peut pas être parfaitement finalisé, prioriser dans cet ordre :

1. build stable ;
2. Snake jouable ;
3. map avec 16 nodes ;
4. 16 niveaux lançables ;
5. 8 mécaniques normales distinctes même simples ;
6. 8 boss distincts même simples ;
7. retry/clear/game over ;
8. design thématique fallback ;
9. audio/polish.

Ne pas prétendre que les éléments partiels sont complets. Marquer `PARTIAL`.

## Fichiers à créer

Tous les fichiers nécessaires dans :

- `src/config/`
- `src/scenes/`
- `src/core/`
- `src/mechanics/`
- `src/mechanics/bosses/`
- `src/render/`
- `src/systems/`
- `src/ui/`
- `src/worldmap/`
- `src/qa/`
- `public/assets/universes/`

## Fichiers à modifier

- `src/main.ts`
- `design_boards/BOARD_MAPPING.md`
- `tickets/status.json`
- docs seulement si nécessaire pour noter un choix technique.

## Fichiers interdits

- Ne pas transformer un prototype V3 HTML en base de code.
- Ne pas supprimer `docs/`.
- Ne pas supprimer `design_boards/`.
- Ne pas écraser les planches source.
- Ne pas créer un seul énorme fichier qui contient tout.

## Contraintes mécaniques

Respecter strictement `docs/14_UNIVERSE_IMPLEMENTATION_SPEC.md`.

Chaque univers doit avoir :
- règle HUD ;
- feedback ;
- objectif ;
- danger ;
- clear ;
- test manuel.

Chaque boss doit avoir :
- HP ou phases ;
- attaque ;
- vulnérabilité ;
- feedback hit ;
- clear.

## Contraintes design

- Utiliser les planches dans `design_boards/_incoming/`.
- Mapper les planches avant intégration.
- Ne jamais afficher la planche brute dans la grille.
- Aucun label de planche visible.
- Grille sobre.
- Frame/HUD/transitions thématiques.
- Obstacles lisibles.
- Pickups plus visibles.
- Fallback procédural obligatoire si asset incertain.

## Contraintes mobile

- Portrait prioritaire.
- Swipe gameplay.
- Drag/pinch map.
- Tap buttons.
- Pas de double tap involontaire.
- Textes courts.
- Safe area.
- Grille prioritaire.

## Tests de validation

Commandes :

```bash
npm run check
npm run dev
```

Tests manuels :
1. Title.
2. Map.
3. Drag/pinch map.
4. Lancer les 8 niveaux normaux.
5. Lancer les 8 boss.
6. Tester swipe.
7. Tester retry.
8. Tester clear.
9. Tester retour map.
10. Recharger page et vérifier save.
11. Tester téléphone via Wi-Fi.

## Résumé attendu

Répondre avec :

- fichiers créés ;
- fichiers modifiés ;
- mécaniques normales implémentées ;
- boss implémentés ;
- design board mapping ;
- fallbacks ;
- résultat `npm run check` ;
- matrice `docs/13_ACCEPTANCE_MATRIX.md` résumée ;
- limites connues ;
- prochains tickets recommandés ;
- instruction pour tester sur mobile.

## Après ce ticket

Exécuter ensuite :

- `tickets/900_AUDIT_CONFORMITE_PROJET.md`

Puis, si besoin :

- `tickets/901_PLAN_CORRECTIONS_POST_AUDIT.md`
