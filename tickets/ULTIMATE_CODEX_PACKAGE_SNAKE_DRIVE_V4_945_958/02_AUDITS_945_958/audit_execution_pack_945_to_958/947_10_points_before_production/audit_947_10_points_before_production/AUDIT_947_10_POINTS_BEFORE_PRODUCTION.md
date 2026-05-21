# AUDIT 947 — Audit des 10 points avant production

## Source
- Archive auditée : `snake-drive-v4-backup-20260520-2039.tar.gz`
- Racine projet : `.`
- Date : `2026-05-20 17:07`

## Synthèse

| # | Thématique | Score /5 | Verdict |
|---:|---|---:|---|
| 1 | Build / stabilité | 5/5 | OK |
| 2 | GameScene / gameplay réel | 3/5 | À vérifier |
| 3 | Lisibilité mobile | 5/5 | OK |
| 4 | Câblage des 24 assets | 5/5 | OK |
| 5 | Cohérence des 8 univers | 5/5 | OK |
| 6 | WorldMap / progression | 4/5 | Bon, à finaliser |
| 7 | Écrans intro / victoire / game over | 5/5 | OK |
| 8 | Nettoyage assets / dossiers résiduels | 4/5 | Bon, à finaliser |
| 9 | Textes français | 2/5 | À corriger |
| 10 | QA finale Android | 3/5 | À vérifier |


## Conclusion rapide

Le projet est **buildable** et les **24 assets runtime sont présents avec transparence**.  
Les deux priorités avant production sont maintenant :
1. **QA réelle mobile Android** ;
2. **confirmation visuelle du câblage GameScene** : pickup / obstacle / boss affichés dans les cellules, avec la bonne taille.

---

## 1. Build / stabilité

### Constats
- `npm run check` : `0`
- `npm run build` : `0`

### Verdict
**OK — 5/5**

### À travailler
- Garder ce niveau de stabilité à chaque patch.
- Ajouter un test rapide de lancement preview.
- Éviter de livrer si check/build ne passent pas.

---

## 2. GameScene / gameplay réel

### Constats statiques
| Signal | Détecté |
|---|---:|
| `GameScene.ts` existe | True |
| Référence runtime assets / resolver | True |
| `load.image` | True |
| `add.image` | False |
| `setDisplaySize` | False |
| pickup | True |
| obstacle | True |
| boss | True |

### Verdict
**À vérifier — 3/5**

### À travailler
- Confirmer en jeu que les assets sont vraiment visibles.
- Vérifier collisions après affichage sprite.
- Vérifier que le Snake reste l’élément prioritaire.
- Vérifier que le fallback existe si une texture manque.

---

## 3. Lisibilité mobile

### Constats
- Signaux touch / pointer / swipe : 80
- Signaux resize / viewport / scale : 128
- Signaux grille / cellSize : 199

### Verdict
**OK — 5/5**

### À travailler
- Tester en 360x800, 390x844, 412x915.
- Limiter les sprites :
  - pickup : 65–75% cellule ;
  - obstacle : 75–90% cellule ;
  - boss : 100–115% cellule.
- Vérifier que les doigts ne masquent pas les commandes.

---

## 4. Câblage des 24 assets

### Constats
- Assets attendus : 24
- Assets présents avec alpha : 24/24
- Contact sheet : `runtime_assets_contact_sheet.jpg`

### Verdict
**OK — 5/5**

### À travailler
- Ne pas se contenter de la présence fichier.
- Vérifier dans chaque univers :
  - pickup affiché ;
  - obstacle affiché ;
  - boss affiché ;
  - pas de fond parasite.

---

## 5. Cohérence des 8 univers

### Mentions détectées
| Univers | Mentions code |
|---|---:|
| castle | 234 |
| sonic | 234 |
| streets | 201 |
| fighter | 166 |
| outrun | 172 |
| shinobi | 167 |
| kombat | 170 |
| paperboy | 175 |


### Verdict
**OK — 5/5**

### À travailler par univers
- Castle : rendre le mur clignotant compréhensible.
- Sonic : distinguer anneau / bumper / serpent.
- Streets : rendre foule et boss urbain très lisibles.
- Fighter : clarifier la mécanique de charge.
- OutRun : checkpoint objectif, voiture obstacle.
- Shinobi : distinguer leurre / ninja / shuriken.
- Kombat : éviter confusion entre feu danger et token finish.
- Paperboy : conserver comme référence de clarté thématique.

---

## 6. WorldMap / progression

### Constats
| Signal | Détecté |
|---|---:|
| WorldMapScene existe | True |
| lock / unlock / progression | True |
| level / niveau | True |
| univers | False |

### Verdict
**Bon, à finaliser — 4/5**

### À travailler
- Vérifier que le joueur comprend où aller.
- Vérifier niveaux verrouillés/déverrouillés.
- Vérifier retour WorldMap après victoire/défaite.
- Éviter une carte trop décorative ou confuse.

---

## 7. Écrans intro / victoire / game over

### Constats
| Écran | Présent |
|---|---:|
| TitleScene | True |
| LevelIntroScene | True |
| ClearScene | True |
| GameOverScene | True |

### Verdict
**OK — 5/5**

### À travailler
- Intro : expliquer la mécanique du niveau en 1 phrase.
- Victoire : dire clairement ce qui est débloqué.
- Game over : proposer rejouer / carte sans friction.
- Uniformiser le style des boutons.

---

## 8. Nettoyage assets / dossiers résiduels

### Résidus détectés
- `public/assets/external/_audit` (1 éléments)
- `public/assets/external/_sources` (1 éléments)
- `public/assets/external/_licenses` (1 éléments)


### Verdict
**Bon, à finaliser — 4/5**

### À travailler
- Supprimer ou archiver hors build les dossiers résiduels.
- Vérifier que le build final ne contient pas de brouillons.
- Garder uniquement les 24 assets runtime côté gameplay.

---

## 9. Textes français

### Constats
- Occurrences FR détectées : 137
- Occurrences anglaises détectées par scan brut : 62

### Verdict
**À corriger — 2/5**

### À travailler
- Vérifier uniquement les textes visibles joueur.
- Les noms internes anglais peuvent rester.
- Les écrans titre, intro, clear, game over doivent être français.
- Relire accents, tutoiement/vouvoiement, cohérence du ton.

---

## 10. QA finale Android

### Verdict
**À vérifier — 3/5**

### À travailler
- Tester sur un vrai Android Chrome.
- Tester au moins :
  - Castle niveau normal ;
  - Sonic niveau normal ;
  - OutRun niveau normal ;
  - Paperboy niveau normal ;
  - un boss.
- Capturer screenshots.
- Vérifier FPS, tactile, lisibilité, redémarrage.
- Ne pas valider production sans vraie session mobile.

---

## Plan d’action recommandé

### P0 — Avant toute production
1. Lancer `npm run check`.
2. Lancer `npm run build`.
3. Vérifier en jeu que les 24 assets sont affichés.
4. Tester un téléphone Android réel.

### P1 — Polish gameplay
1. Ajuster tailles sprites.
2. Vérifier collision et feedback.
3. Tester les 8 univers.
4. Tester boss / game over / clear.

### P2 — Nettoyage final
1. Supprimer dossiers résiduels.
2. Nettoyer logs inutiles.
3. Relire textes FR.
4. Archiver les anciens patchs hors runtime.

## Fichiers inclus

```txt
AUDIT_947_10_POINTS_BEFORE_PRODUCTION.md
runtime_assets_contact_sheet.jpg
reports/audit_points_scores.csv
reports/asset_audit.csv
reports/signals.json
reports/test_results.json
reports/legacy_cleanup_audit.json
reports/english_ui_hits.json
reports/french_ui_hits.json
reports/console_hits.json
reports/todo_hits.json
reports/danger_hits.json
```
