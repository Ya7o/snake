# Snake Drive V4 — Product Backlog vNext

> Généré le 2026-05-28 sur la base de l'état réel du code source (src/, tickets/, public/assets/).  
> Ce document ne prescrit pas d'ordre d'exécution absolu — c'est un inventaire priorisé pour décider quoi faire après la stabilisation.

---

## Bugs bloquants

> Éléments qui cassent une fonctionnalité ou violent une règle produit explicite.

| ID | Sujet | Impact | Priorité | Commentaire |
|----|-------|--------|----------|-------------|
| BUG-01 | 3 fichiers WAV manquants : `game_over.wav`, `boss_hit.wav`, `boss_clear.wav` | Audio tombe sur le fallback synthétique (ton Web Audio) — fonctionnel mais pas fidèle au design sonore attendu | **HAUTE** | Confirmé dans `public/assets/audio/` : seuls 5/8 WAV présents. `audioRegistry.ts` pointe sur ces chemins manquants. |
| BUG-02 | `DEV_UNLOCK_ALL = true` dans `src/config/constants.ts:4` | En production, tous les niveaux et nœuds de la WorldMap sont débloqués dès le démarrage — la progression n'existe plus | **HAUTE** | Doit être mis à `false` avant tout build de release ou lien public partagé. |

---

## Bugs non bloquants

> Éléments dégradant l'expérience sans empêcher le jeu.

| ID | Sujet | Impact | Priorité | Commentaire |
|----|-------|--------|----------|-------------|
| BUG-03 | WorldMap : deux console.warn sur textures manquantes au boot | Logs parasites en prod, fallback procédural activé | **BASSE** | `WorldMapScene.ts:81` et `:144`. Le fallback fonctionne ; supprimer l'asset manquant ou ajouter l'asset `world_map_minimap_16_9.png`. |
| BUG-04 | MechanicFactory : fallback silencieux sur mécanique inconnue | Si un niveau pointe sur un ID de mécanique inconnu, Castle Illusion est utilisé sans avertissement utilisateur | **BASSE** | `src/mechanics/MechanicFactory.ts:41`. Comportement acceptable en dev, à monitorer si de nouveaux univers sont ajoutés. |
| BUG-05 | OutRun gameplay scale : vide vertical excessif entre HUD et frame | Impression de jeu trop petit, frame mal cadré — espace gaspillé en portrait | **MOYENNE** | Documenté dans ticket PATCH 961. Vérifier si le correctif de 960 a été sur-appliqué. Audit recommandé post-stabilisation. |
| BUG-06 | Level intro Shinobi / Kombat : boutons trop bas, chevauchement avec le cadre bas | Non-conformité layout mobile portrait — boutons partiellement hors zone utile | **MOYENNE** | Documenté dans ticket PATCH 961. Boutons `JOUER` / `CARTE` empiètent sur le décor frame bottom. |
| BUG-07 | Pickup clignotant OutRun illisible pendant l'animation | Viole la règle produit "pickups plus visibles que les obstacles" | **MOYENNE** | Documenté dans ticket PATCH 960. L'effet ON/OFF brutal rend le pickup invisible pendant la phase OFF. |

---

## Polish UX

### World Map affordance
- L'instruction de lancement (double tap sur le badge de niveau) n'est pas évidente au premier accès.
- Envisager un micro-texte d'aide contextuel qui disparaît après la première interaction.
- Le bandeau bas reste trop haut sur certains viewports — cible : 1 ligne utile (ticket PATCH 960).

### Textes restants
- Certains libellés fonctionnels utilisent encore des polices pixel là où un texte lisible serait attendu (règle produit #8).
- Audit des textes HUD haut sur tous les univers : s'assurer que l'information critique (quota, timer, objectif) reste lisible en portrait sans être tronquée.
- Vérifier que les noms d'univers et de niveaux tiennent sur 1 ligne dans le bandeau WorldMap.

### System panels (Castle)
- Les écrans Castle (clear, game_over, système) utilisent des assets `castle_*.png` dédiés — vérifier la cohérence visuelle entre les 4 backgrounds Castle (`system`, `gameplay`, `clear`, `game_over`).
- Comprimer les backgrounds système Castle si le poids est excessif (voir section Assets).

### Mobile spacing
- Safe-area : vérifier que les boutons d'action sur les écrans d'intro restent dans la zone safe de l'écran sur tous les univers (pas seulement Shinobi/Kombat).
- Marge HUD haut : uniformiser le gap entre le bord supérieur et la première ligne de HUD.
- Décor bottom : s'assurer que le décor secondaire (voiture OutRun, route…) ne réduit pas la grille jouable en dessous du minimum lisible.

---

## Gameplay polish

### OutRun — turboZone
- La mécanique `turboZone` (lane drift / checkpoints) fonctionne mais la zone d'accélération n'est pas suffisamment télégraphiée visuellement.
- Envisager un indicateur de zone (flash de piste, icône HUD) pour signaler au joueur qu'il entre en turboZone.
- Ne pas ajouter de logique de mécanique — modifier uniquement le rendu/signal visuel.

### Paperboy — lisibilité des targets de livraison
- Les cibles de livraison (maisons) ne sont pas toujours distinguables des obstacles.
- Appliquer la règle : target delivery = plus visible qu'un obstacle, différent du pickup standard.
- Un contour ou halo dédié suffit ; pas de refonte graphique complète.

### Sonic — orb timing (optionnel)
- Le timing des ring chains est parfois perçu comme serré sur mobile (tap précis requis).
- Option légère : légère fenêtre de tolérance supplémentaire (±1 frame) sans rendre les chains triviales.
- Non prioritaire — ne pas modifier si cela déséquilibre le niveau.

---

## Audio

### Vrais WAV manquants (priorité haute)
- Produire et placer dans `public/assets/audio/` :
  - `game_over.wav` — son de fin de partie
  - `boss_hit.wav` — impact sur boss
  - `boss_clear.wav` — victoire sur boss
- Le fallback synthétique actuel (Web Audio API, tons générés) fonctionne mais est clairement placeholder.
- Maintenir la compatibilité avec `audioRegistry.ts` — les clés sont déjà correctement définies.

### BGM (plus tard)
- Pas de BGM dans la version actuelle — c'est un choix délibéré acceptable pour le prototype.
- Si ajoutée, prévoir un fichier par univers ou par famille d'univers, chargé à la demande (pas en précharge globale).
- Implémenter un bouton mute BGM séparé du SFX.

### Sons par famille d'univers (plus tard)
- Actuellement, tous les univers partagent les mêmes WAV SFX.
- Option vNext lointain : variantes de `stageClear` et `bossHit` par univers (ex. version 16-bit pour Sonic, rock pour Kombat).
- Non prioritaire — infrastructure audio actuelle suffit.

---

## Assets

### Compression backgrounds Castle
- Les 4 backgrounds Castle (`castle_system.png`, `castle_gameplay.png`, `castle_clear.png`, `castle_game_over.png`) sont des PNG de grande taille.
- Audit de poids recommandé : si > 200 Ko par image, compresser (TinyPNG ou équivalent sans perte visible).

### Audit poids images global
- Lancer un audit de poids sur `public/assets/` pour identifier les images trop lourdes.
- Cibles : boss PNGs (boss.png par univers), level-intros, world_map.png.
- Objectif : < 100 Ko par image univers, < 500 Ko pour world_map.
- Ne pas compresser les assets sources dans `design_boards/` — uniquement `public/assets/`.

### OpenMoji complémentaires
- Castle et Paperboy utilisent des registres d'icônes OpenMoji.
- Si des combinaisons d'icônes manquent ou sont peu lisibles, compléter le registre avec des glyphes OpenMoji compatibles.
- Ne pas introduire d'autres librairies d'icônes.

### Asset manquant : world_map_minimap_16_9.png
- La WorldMap logue un warning au boot pour cet asset — soit créer l'asset, soit supprimer la référence si le fallback procédural suffit.

---

## Release

### DEV_UNLOCK_ALL
- `src/config/constants.ts:4` : passer `DEV_UNLOCK_ALL` de `true` à `false`.
- Tester le flux complet de progression depuis zéro (nouveau joueur, aucun niveau débloqué).
- Vérifier que la sauvegarde localStorage fonctionne correctement après ce changement.

### Clean restore test
- Supprimer le localStorage du navigateur de test.
- Lancer le jeu en mode `DEV_UNLOCK_ALL = false`.
- Vérifier : seul le niveau 1 (Castle L1) est accessible, les autres sont verrouillés.
- Jouer et finir Castle L1 : vérifier que Castle L2 se débloque.
- Vérifier que le boss du bon univers se débloque après L2.

### Release README
- Créer ou mettre à jour `README.md` à la racine avec :
  - description du projet
  - instructions d'installation (`npm install`, `npm run dev`, `npm run build`)
  - liste des 8 univers et 16 niveaux
  - note sur `DEV_UNLOCK_ALL`
  - crédits assets (OpenMoji, Phaser 3)

### Hosted web build
- Optionnel : builder (`npm run build`) et héberger le `dist/` sur GitHub Pages ou Netlify.
- Nécessite de valider la base URL dans `vite.config.*` si déployé sur un sous-chemin.

---

## Long terme

| Thème | Description |
|-------|-------------|
| **Progression** | Système de score persistant par niveau, leaderboard local. |
| **Scoring** | Points multiplicateurs par univers, bonus boss. |
| **Sauvegarde cloud** | Sync de la progression via un backend léger (Supabase, Firebase) pour multi-device. |
| **Nouveaux univers** | Template documenté dans `tickets/PATCH_984_*/docs/984_PROMPTS_FOR_FUTURE_UNIVERSES.md`. |
| **BGM complète** | Une BGM par univers, gestion audio avancée. |
| **Gamepad / touch polish** | Support contrôleur physique, swipe gestuel plus tolérant sur mobile. |
| **Accessibility** | Contraste, tailles de texte, réduction des animations. |

---

## À ne pas faire maintenant

| Item | Raison |
|------|--------|
| Nouveaux boss | Les 8 boss existants sont complets et testés — ajouter un 9e demande un effort de design majeur. |
| Boutique / monnaie | Hors scope prototype — ajouterait une complexité économie/UX sans valeur immédiate. |
| Inventaire / équipement | Idem boutique. |
| Grosse refonte UI | L'interface actuelle est cohérente — une refonte risque de régresser le travail de polish accumulé. |
| Refactor moteur Phaser | Phaser 3 est stable et adapté — aucune raison identifiée de migrer ou refactorer. |
| Système de tutoirial in-game complet | Trop coûteux en développement pour ce stade du projet. |
| Nouvelles mécaniques cross-univers | Complexité de regression trop haute — stabiliser d'abord ce qui existe. |

---

*Document basé sur l'état du code au 2026-05-28. Mettre à jour après chaque cycle de patch majeur.*
