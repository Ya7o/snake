# PROTOCOLE RELEASE CANDIDATE

## Précondition
Ne pas déclarer release candidate tant que la QA Android réelle n’est pas faite.

## Commandes
```bash
npm run check
npm run build
npm run preview -- --host 0.0.0.0
```

## Tests minimum
- 8 univers.
- 16 niveaux ou plan de test structuré.
- 8 boss.
- WorldMap.
- Intro.
- Clear.
- GameOver.
- Refresh.
- Save.
- Mobile Android.

## Critères GO
- [ ] build OK.
- [ ] check OK.
- [ ] aucun P0.
- [ ] assets runtime visibles.
- [ ] textes visibles FR.
- [ ] progression OK.
- [ ] QA Android réelle OK.

## Critères NO-GO
- crash ;
- écran noir ;
- asset manquant bloquant ;
- texte gameplay incompréhensible ;
- progression cassée ;
- contrôles mobile non fiables ;
- GameScene n’affiche pas les assets runtime.
