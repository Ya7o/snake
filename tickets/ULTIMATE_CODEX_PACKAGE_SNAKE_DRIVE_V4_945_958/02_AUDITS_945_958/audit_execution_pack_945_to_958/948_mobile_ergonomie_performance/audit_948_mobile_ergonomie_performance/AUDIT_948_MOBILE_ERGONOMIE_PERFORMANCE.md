# AUDIT 948 — Ergonomie mobile, UX et performance

## Source
- Archive auditée : `snake-drive-v4-backup-20260520-2039.tar.gz`
- Racine projet : `.`
- Date : `2026-05-20 17:11`

## Synthèse scores

| # | Point de contrôle | Score /5 | Verdict |
|---:|---|---:|---|
| 1 | Viewport / adaptation écran | 4/5 | Bon, à contrôler sur appareil |
| 2 | Contrôles tactiles / ergonomie pouce | 5/5 | OK |
| 3 | Safe area / zones coupées | 3/5 | À vérifier |
| 4 | Lisibilité grille / HUD | 5/5 | OK |
| 5 | Assets / poids / chargement | 3/5 | À vérifier |
| 6 | Performance runtime Phaser | 4/5 | Bon, à contrôler sur appareil |
| 7 | Build / bundle / preview | 5/5 | OK |
| 8 | Accessibilité mobile | 4/5 | Bon, à contrôler sur appareil |
| 9 | Nettoyage résidus | 4/5 | Bon, à contrôler sur appareil |
| 10 | Debug / logs / robustesse | 3/5 | À vérifier |


## Verdict global

Le projet est **techniquement buildable** et les assets runtime sont maîtrisés.  
Le risque principal avant production est maintenant **l’expérience réelle sur téléphone** : lisibilité cellule, confort des contrôles, safe area, et performance en session longue.

---

## 1. Viewport / adaptation écran

### Signaux détectés
- Meta viewport : `True`
- `viewport-fit=cover` : `True`
- Phaser Scale FIT / équivalent : `False`
- Gestion resize : `True`
- Centrage Phaser : `True`

### À contrôler
- 360x800, 390x844, 412x915.
- Rotation écran : comportement portrait/paysage.
- Aucun élément coupé en haut/bas.
- WorldMap visible sans scroll horizontal.
- Intro niveau et GameOver lisibles sans zoom.

### Recommandation
Ajouter ou vérifier `viewport-fit=cover` si tu veux gérer les téléphones avec encoche, mais ne jamais placer les boutons critiques dans les zones extrêmes.

---

## 2. Contrôles tactiles / ergonomie pouce

### Signaux détectés
- Pointer : `46`
- Touch : `40`
- Swipe / drag / gesture : `62`
- Clavier fallback : `32`

### À contrôler
- Le jeu répond avec un seul pouce.
- Pas de double action involontaire.
- Pas de délai ressenti au swipe/tap.
- Les boutons ne sont pas collés au bas de l’écran.
- Le joueur comprend immédiatement comment diriger le Snake.

### Recommandation
Si le jeu repose sur swipe, ajouter un micro-écran d’aide au premier niveau : “Glisse pour changer de direction”.

---

## 3. Safe area / zones coupées

### Signaux détectés
- Safe area CSS : `0`
- Indices UI bottom/nav : `122`

### À contrôler
- Android avec barre de navigation basse.
- iPhone-like avec encoche si ciblé.
- Aucun bouton essentiel dans les coins extrêmes.
- HUD non masqué par navigateur mobile.

### Recommandation
Prévoir une marge interne mobile constante autour des boutons et du HUD.

---

## 4. Lisibilité grille / HUD

### Signaux détectés
- `setDepth` : `93`
- `fontSize` / `setFontSize` : `45`
- Caméra : `72`
- Alpha / transparences UI : `30`

### À contrôler
- Le Snake reste l’objet le plus lisible.
- Pickup / obstacle / boss ne masquent pas la grille.
- Textes HUD lisibles sans gêner le gameplay.
- Contraste suffisant sur tous les univers.
- Effets alpha non ambigus pour les dangers.

### Tailles conseillées
- Pickup : 65–75% cellule.
- Obstacle : 75–90% cellule.
- Boss : 100–115% cellule maximum.

---

## 5. Assets / poids / chargement

### Constats
- Images scannées : `469`
- Assets runtime : `24`
- Images > 250 Ko : `97`
- Références anciens pipelines dans code : `57`
- Taille dist : `38594.0 Ko`

### À contrôler
- Les 24 assets sont les seuls utilisés en gameplay.
- Aucun ancien dossier `_downloaded/_extracted` n’est rechargé.
- Pas de chargement global inutile.
- Les images détaillées restent lisibles après réduction.

### Recommandation
Continuer à charger seulement 3 assets par univers courant.

---

## 6. Performance runtime Phaser

### Signaux détectés
- `setInterval` : `0`
- `setTimeout` : `4`
- `update()` : `29`
- Tweens : `7`
- Particules / emitters : `12`
- `add.image` : `18`
- `add.graphics` : `29`
- `destroy()` : `67`

### À contrôler
- Pas de recréation massive de sprites à chaque frame.
- Les objets temporaires sont détruits ou recyclés.
- Pas d’accumulation de tweens après restart.
- FPS stable après plusieurs parties.
- Pas de fuite mémoire lors des transitions niveau → clear → worldmap → niveau.

### Recommandation
Faire un test de 10 minutes : enchaîner 10 parties et vérifier que le jeu ne ralentit pas.

---

## 7. Build / bundle / preview

### Résultat
- `npm run check` : `0`
- `npm run build` : `0`
- Fichiers dist : `200`
- Taille dist totale : `38594.0 Ko`

### À contrôler
- Preview locale Android :
  ```bash
  npm run preview -- --host 0.0.0.0
  ```
- Chargement initial.
- Pas d’écran noir.
- Pas d’erreur console mobile.

---

## 8. Accessibilité mobile

### Signaux détectés
- Contraste / lisibilité : `75`
- Reduced motion : `0`
- Audio / mute : `44`

### À contrôler
- Contraste de textes.
- Lisibilité des icônes.
- Pas d’information uniquement par couleur.
- Option mute si audio actif.
- Pas de clignotement agressif.

### Recommandation
Même sans gros système accessibilité, ajouter au minimum : mute, contraste texte, feedback visuel distinct.

---

## 9. Nettoyage résidus

### Résidus détectés
- `public/assets/external/_audit` — 1 éléments
- `public/assets/external/_sources` — 1 éléments
- `public/assets/external/_licenses` — 1 éléments


### À contrôler
- Ces dossiers ne doivent pas être chargés en runtime.
- Les garder seulement si utiles comme documentation hors build.
- Si inutiles : les supprimer.

---

## 10. Debug / logs / robustesse

### Signaux détectés
- `console.*` : `39`
- TODO/FIXME/HACK : `0`
- eval/innerHTML/document.write : `5`

### À contrôler
- Pas de logs verbeux en production.
- Pas de TODO bloquant.
- Pas de code dangereux.
- Pas de crash si asset manquant.

---

## Checklist manuelle mobile finale

### Écrans
- [ ] Title screen lisible.
- [ ] WorldMap utilisable au doigt.
- [ ] Intro niveau lisible.
- [ ] HUD non intrusif.
- [ ] GameOver clair.
- [ ] Clear screen clair.

### Gameplay
- [ ] Le Snake répond immédiatement.
- [ ] Pickup compris.
- [ ] Obstacle compris.
- [ ] Boss compris.
- [ ] Collision claire.
- [ ] Score/progression visible.
- [ ] Pas de sprite trop grand.

### Performance
- [ ] 10 parties enchaînées sans ralentissement.
- [ ] Pas de fuite visuelle après restart.
- [ ] Pas d’écran noir.
- [ ] Pas d’erreur console mobile.
- [ ] Chargement initial acceptable.

### Appareils / tailles
- [ ] 360x800.
- [ ] 390x844.
- [ ] 412x915.
- [ ] Chrome Android réel.
- [ ] Test avec barre de navigation Android visible.

## Fichiers produits

```txt
AUDIT_948_MOBILE_ERGONOMIE_PERFORMANCE.md
runtime_assets_mobile_contact_sheet.jpg
reports/audit_scores.csv
reports/signals_mobile_ux_perf.json
reports/image_asset_audit.csv
reports/dist_inventory.csv
reports/large_images_over_250kb.json
reports/hits_pointer_touch_swipe.json
reports/hits_resize_scale_viewport.json
reports/hits_render_perf.json
reports/debug_hits.json
```
