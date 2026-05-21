# PATCH — Audit conformité mécaniques univers et boss

## Contexte
L’intérêt principal du remake Snake Drive V4 est que chaque univers ne soit pas un simple skin. Chaque univers doit apporter une mécanique de gameplay différente, et chaque boss doit avoir une mécanique spécifique. Les mécaniques prévues existent dans la direction projet, mais il faut vérifier si elles sont réellement implémentées dans le code et perceptibles par le joueur.

## Objectif
Auditer entièrement les mécaniques de jeu pour vérifier que les 8 univers ont chacun une mécanique normale distincte, que les 8 boss ont chacun une mécanique boss distincte, et que ces mécaniques sont effectivement branchées au gameplay.

## Fichiers à auditer
- `src/data/levels.ts` — définition des niveaux, boss, objectifs, mécaniques.
- `src/data/worlds.ts`, `src/data/universes.ts`, `src/data/worldMap*.ts` — mapping univers/niveaux/boss.
- `src/scenes/GameScene.ts` — gameplay principal et application des mécaniques.
- `src/scenes/BossScene.ts` ou équivalent — logique boss si séparée.
- `src/systems/*` — systèmes de règles, collisions, pickups, obstacles, timers.
- `src/mechanics/*` — mécaniques par univers si dossier existant.
- `src/entities/*` — snake, pickups, obstacles, boss entities.
- `src/scenes/LevelIntroScene.ts` — explication des mécaniques au joueur.
- `src/ui/*` — HUD et feedbacks liés aux mécaniques.

## Fichiers interdits
- Ne pas modifier les mécaniques dans cet audit.
- Ne pas supprimer les 8 univers.
- Ne pas supprimer les 16 niveaux.
- Ne pas supprimer les 8 boss.
- Ne pas fusionner des mécaniques.
- Ne pas réduire le jeu à un simple reskin.
- Ne pas ajouter de dépendance.
- Ne pas revenir à un HTML monofichier.

## Mécaniques attendues par univers
1. Castle
   - Normal : murs clignotants / tuiles illusion.
   - Boss : Witch Mirror.

2. Sonic
   - Normal : chaînes d’anneaux.
   - Boss : Loop Serpent.

3. Streets
   - Normal : foule / bloqueurs temporaires.
   - Boss : Crime Lord.

4. Fighter
   - Normal : charge move / rounds.
   - Boss : Final Challenger.

5. OutRun
   - Normal : dérive de voies / checkpoints.
   - Boss : Turbo Rival.

6. Shinobi
   - Normal : focus / leurres.
   - Boss : Shadow Ninja.

7. Kombat
   - Normal : zones fatales / fenêtre de finish.
   - Boss : Dragon Gate.

8. Paperboy
   - Normal : livraisons / route mayhem.
   - Boss : Neighborhood Chaos.

## Comportement attendu
- [ ] Produire un rapport `docs/audits/927_GAMEPLAY_MECHANICS_COMPLIANCE_AUDIT.md`.
- [ ] Lister les 8 mécaniques normales attendues.
- [ ] Lister les 8 mécaniques boss attendues.
- [ ] Vérifier si chaque mécanique est présente dans la data.
- [ ] Vérifier si chaque mécanique est branchée dans le gameplay.
- [ ] Vérifier si chaque mécanique produit un effet réel, pas seulement un texte.
- [ ] Vérifier si chaque mécanique a un feedback joueur.
- [ ] Vérifier si chaque mécanique est expliquée en français dans l’intro.
- [ ] Vérifier si chaque univers joue différemment.
- [ ] Identifier les univers qui ne sont encore qu’un reskin.
- [ ] Identifier les boss qui ne sont pas mécaniquement distincts.
- [ ] Classer conformité : `OK`, `PARTIEL`, `ABSENT`, `AMBIGU`.
- [ ] Proposer les patchs d’implémentation manquants dans l’ordre.

## Grille de conformité par mécanique
Pour chaque univers et chaque boss, remplir :

- Nom univers / boss.
- Mécanique attendue.
- Présence dans data : oui/non/partiel.
- Présence dans gameplay runtime : oui/non/partiel.
- Feedback visuel : oui/non/partiel.
- Explication intro FR : oui/non/partiel.
- Impact réel sur gameplay : oui/non/partiel.
- Différence avec les autres univers : forte/moyenne/faible/nulle.
- Statut final : OK / PARTIEL / ABSENT / AMBIGU.
- Patch recommandé.

## Contraintes
- Le gameplay Snake doit rester prioritaire.
- Une mécanique ne doit pas être purement décorative.
- Une mécanique doit changer la prise de décision du joueur.
- Les boss doivent imposer une contrainte différente du niveau normal.
- Les intros doivent expliquer brièvement la règle.
- Mobile Android prioritaire : les mécaniques doivent rester lisibles au doigt.

## Hors scope
- Implémenter les mécaniques manquantes.
- Refaire les assets.
- Refaire le level design complet.
- Refaire les boss visuellement.
- Refaire la WorldMap.

## Rapport final obligatoire
À la fin, liste clairement :

1. Fichiers audités.
2. Tableau de conformité des 8 mécaniques univers.
3. Tableau de conformité des 8 mécaniques boss.
4. Univers réellement distincts.
5. Univers encore trop proches / reskin.
6. Boss réellement distincts.
7. Boss absents ou trop génériques.
8. Mécaniques présentes seulement dans le texte.
9. Mécaniques présentes dans le runtime.
10. Patchs recommandés dans l’ordre.
11. Questions ou points bloquants.
