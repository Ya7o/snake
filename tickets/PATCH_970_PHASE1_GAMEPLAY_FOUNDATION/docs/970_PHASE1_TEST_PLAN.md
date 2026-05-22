# 970 — Phase 1 Test Plan

## Commandes

```bash
npm install
npm run check
npm run dev -- --host 0.0.0.0
```

Ne pas laisser de serveur lancé après le test.

---

## Tests desktop rapides

Tester au clavier :

- démarrage ;
- navigation World Map ;
- lancement niveau ;
- retry ;
- clear ;
- retour map.

---

## Tests mobile portrait

À faire dans le navigateur mobile ou via device toolbar.

Tailles minimales :

```txt
390x844
430x932
```

Vérifier :

- la grille reste jouable ;
- le HUD ne masque pas ;
- les boutons LevelIntro sont touchables ;
- swipe fiable ;
- pas de scroll page accidentel pendant le jeu.

---

## Tests par niveau

### Castle normal

- [ ] mur warning visible ;
- [ ] mur actif létal ;
- [ ] quota atteint clear.

### Castle boss

- [ ] vrai miroir identifiable ;
- [ ] 3 hits clear ;
- [ ] mauvais timing dangereux.

### Sonic normal

- [ ] chaîne de rings visible ;
- [ ] progression compréhensible ;
- [ ] vitesse contrôlable.

### Streets normal

- [ ] blockers visibles ;
- [ ] déplacements lisibles ;
- [ ] pas de chaos injuste.

### Fighter normal

- [ ] charge compréhensible ;
- [ ] bonus +2 clair ;
- [ ] danger lisible.

### OutRun normal

- [ ] checkpoints visibles ;
- [ ] trafic lisible ;
- [ ] lanes compréhensibles.

### Shinobi normal

- [ ] vraie cible lisible ;
- [ ] leurres compréhensibles ;
- [ ] mauvais choix expliqué par hint/HUD.

### Kombat normal

- [ ] zones warning visibles ;
- [ ] zones actives létales ;
- [ ] rouge pas illisible.

### Paperboy normal

- [ ] targets de livraison visibles ;
- [ ] obstacles suburbains lisibles ;
- [ ] score/quota clair.

---

## Boss smoke test

Tester au moins :

```txt
castle_boss
outrun_boss
kombat_boss
paperboy_boss
```

Critères :

- [ ] boss peut être vaincu ;
- [ ] boss peut tuer ;
- [ ] HP affichés ;
- [ ] clear sauvegarde progression.

---

## Debug optionnel

Si implémenté :

```txt
?debugGameplay=1
```

Doit afficher seulement :

- levelId ;
- mechanic ;
- score/quota ou HP ;
- tick ;
- entity counts.

Pas d’overlay intrusif par défaut.
