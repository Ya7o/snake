# PATCH 1017C — System Menu Safe Area Audit

## Périmètre

Audit visuel uniquement des écrans `LevelIntroScene` normal (`system`) et boss
(`boss system`) pour les 8 univers. Aucun code, asset ou texte runtime n'est modifié.

Conditions de capture :

- Build audité : `npm run build` réussi le 27 mai 2026.
- Rendu : build Vite servi localement avec `vite preview`.
- Viewport : `360 x 640 px`, `deviceScaleFactor: 2`, Chromium headless.
- Méthode : ouverture directe de chaque `LevelIntroScene` avec son `levelId`.
- Total : 16 captures sous `snake/tmp/patch1017C/captures/`.

Points contrôlés pour chaque écran : titre, nom de niveau, description, boutons,
marges du panneau, espacement texte/boutons, et contraste panneau/background.

## Synthèse

| Univers | Normal system | Boss system | Problème | Priorité |
|---|---|---|---|---|
| Castle | PASS | PASS | Panneau plus dense que les autres, mais contenu et boutons restent séparés | Mineure |
| Sonic | PASS | PASS avec réserves | Description boss sur 2 lignes : marge basse du texte réduite | Mineure |
| Street of Rage | PASS | PASS avec réserves | Description boss sur 2 lignes près du bas utile du panneau | Importante |
| Street Fighter | PASS | PASS | Textes courts, aucune collision observée | Aucune |
| OutRun | PASS | PASS avec réserves | Description boss sur 2 lignes, padding vertical serré | Importante |
| Shinobi | PASS | PASS | Description boss courte et dégagée | Aucune |
| Mortal Kombat | PASS | PASS avec réserves | Signalement non reproduit en normal; boss plus serré sous la description | Importante |
| Paperboy | PASS avec réserves | PASS avec réserves | Descriptions longues sur 2 lignes; zone basse visuellement la plus chargée | Importante |

## Observations Globales

- Aucun texte n'est tronqué dans les 16 captures.
- Aucun bouton n'est coupé et aucun bouton ne chevauche le panneau ou sa description.
- À `360 x 640`, aucune description ne touche effectivement la bordure basse du panneau.
- Les écrans non-Castle emploient une même zone de panneau basse; lorsque le hint
  passe sur deux lignes, son espace de respiration inférieur devient faible, surtout en boss.
- Les backgrounds restent suffisamment assombris sous le panneau; ils ne gênent pas la
  lecture des descriptions ni des boutons.
- Le cas remonté pour Mortal Kombat normal n'est pas reproduit sur le build capturé.
  Il indique néanmoins qu'une marge trop juste peut se manifester selon viewport,
  zoom navigateur ou métriques de police de l'appareil.

## Détail Par Univers

### Castle

- Capture normal : `snake/tmp/patch1017C/captures/castle/normal_system.png`
- Capture boss : `snake/tmp/patch1017C/captures/castle/boss_system.png`
- Problème observé : aucun clipping. Le panneau Castle contient deux sections
  (`OBJECTIF` et `DANGER`) et reste lisible, avec une marge basse visible.
- Correction recommandée : aucune correction bloquante; conserver Castle comme contrôle
  lors d'un éventuel ajustement global de safe area.

### Sonic

- Capture normal : `snake/tmp/patch1017C/captures/sonic/normal_system.png`
- Capture boss : `snake/tmp/patch1017C/captures/sonic/boss_system.png`
- Problème observé : normal confortable; le hint boss occupe deux lignes et rapproche
  le dernier interligne du bas du panneau, sans contact ni chevauchement.
- Correction recommandée : garantir un padding bas minimum du texte descriptif boss.

### Street Of Rage

- Capture normal : `snake/tmp/patch1017C/captures/street_of_rage/normal_system.png`
- Capture boss : `snake/tmp/patch1017C/captures/street_of_rage/boss_system.png`
- Problème observé : le hint boss sur deux lignes remplit fortement la dernière zone
  du panneau. Les boutons restent distincts et entièrement visibles.
- Correction recommandée : augmenter légèrement la hauteur utile du panneau boss ou
  remonter son contenu tout en conservant le gap avant les boutons.

### Street Fighter

- Capture normal : `snake/tmp/patch1017C/captures/street_fighter/normal_system.png`
- Capture boss : `snake/tmp/patch1017C/captures/street_fighter/boss_system.png`
- Problème observé : aucun; descriptions courtes, marges confortables.
- Correction recommandée : aucune.

### OutRun

- Capture normal : `snake/tmp/patch1017C/captures/outrun/normal_system.png`
- Capture boss : `snake/tmp/patch1017C/captures/outrun/boss_system.png`
- Problème observé : le normal passe sans réserve notable. Le hint boss sur deux
  lignes est lisible mais dispose de peu d'air sous la seconde ligne.
- Correction recommandée : inclure OutRun boss dans le test de non-régression d'un
  correctif global de panneau.

### Shinobi

- Capture normal : `snake/tmp/patch1017C/captures/shinobi/normal_system.png`
- Capture boss : `snake/tmp/patch1017C/captures/shinobi/boss_system.png`
- Problème observé : aucun; titres, description et boutons ont des espacements clairs.
- Correction recommandée : aucune.

### Mortal Kombat

- Capture normal : `snake/tmp/patch1017C/captures/mortal_kombat/normal_system.png`
- Capture boss : `snake/tmp/patch1017C/captures/mortal_kombat/boss_system.png`
- Problème observé : le signalement "description qui touche la bordure du bas" n'est
  pas reproduit sur le normal à `360 x 640`; la description tient sur deux lignes avec
  marge visible. Le boss est plus serré : sa seconde ligne reste dans le panneau, mais
  la marge inférieure est faible.
- Correction recommandée : traiter le layout de manière préventive et tester Mortal
  Kombat normal/boss sur petits viewports et appareils utilisant leurs métriques de police.

### Paperboy

- Capture normal : `snake/tmp/patch1017C/captures/paperboy/normal_system.png`
- Capture boss : `snake/tmp/patch1017C/captures/paperboy/boss_system.png`
- Problème observé : les deux descriptions sont longues. Elles restent entières, mais
  Paperboy boss fait partie des panneaux les plus denses au bas de l'écran.
- Correction recommandée : couvrir Paperboy boss avec Mortal Kombat boss dans toute
  validation de padding bas / safe area.

## Matrice De Contrôle

| Vérification | Résultat | Note |
|---|---|---|
| Titre lisible | PASS | 16/16 titres visibles et contrastés |
| Nom niveau lisible | PASS | 16/16 noms visibles dans le panneau |
| Description non coupée | PASS | 16/16 descriptions complètes |
| Boutons non coupés | PASS | 32/32 boutons entièrement visibles |
| Pas de texte collé à la bordure | PASS avec réserves | Aucun contact; marge réduite sur plusieurs boss à deux lignes |
| Panel respecte la safe area | PASS avec réserves | Fonctionne à `360 x 640`; réserve à consolider pour variations appareil |
| Aucune description ne touche le bas | PASS observé | Signalement Mortal Kombat non reproduit dans cette passe |
| Pas de chevauchement bouton / texte | PASS | Gap visible sur les 16 écrans |
| Background ne gêne pas le panel | PASS | Panneaux sombres lisibles sur tous fonds |

## Verdict

**PASS avec réserves**

Le build audité ne présente ni description coupée, ni contact réel avec la bordure
basse, ni chevauchement de boutons sur les 16 écrans système capturés. La réserve porte
sur la faible marge basse de plusieurs écrans boss à description sur deux lignes,
notamment Mortal Kombat et Paperboy, cohérente avec le risque remonté en test joueur.

## Recommandation

Proposer **PATCH 1018C — System Menu Safe Area Fix**.

Le correctif recommandé doit rester ciblé sur le layout du panneau `LevelIntroScene` :
réserver un padding bas minimum aux descriptions multilignes et valider à nouveau les
16 écrans sur viewport court, sans modifier les textes pour résoudre un problème de place.
