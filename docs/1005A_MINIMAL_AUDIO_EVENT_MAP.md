# PATCH 1005A — Minimal Audio Event Map

## Objectif

Définir la carte audio minimale Tier 1 avant toute implémentation.
Ce document est purement documentaire — aucun code, aucun asset modifié.

---

## Principes

- Audio fonctionnel avant sound design complet
- Sons courts — aucun son ne doit gêner le rythme de jeu
- Sons lisibles sur mobile (haut-parleur mono, volume variable)
- Pas de musique de fond pour l'instant
- Pas de son spécifique par univers en Phase 5 initiale
- Pas de surcharge sonore — chaque événement a un son maximum

---

## Événements Tier 1

| Clé audio | Événement | Statut actuel | Fichier actuel/cible | Durée cible | Priorité |
|---|---|---|---|---|---|
| `uiButton` | Bouton UI | **existant** | `ui_button.wav` | < 0.25s | P1 |
| `pickup` | Pickup collecté | **existant** | `pickup_magic.wav` | < 0.35s | P1 |
| `collisionHit` | Collision / impact | **existant** | `collision_hit.wav` | < 0.5s | P1 |
| `dangerAlert` | Danger imminent | **existant** | `danger_alert.wav` | < 0.5s | P1 |
| `stageClear` | Niveau normal terminé | **existant** | `stage_clear.wav` | < 1.5s | P1 |
| `gameOver` | Mort / échec définitif | **manquant** | `game_over.wav` | < 1.2s | P1 |
| `bossHit` | Boss touché (weak point) | **manquant** | `boss_hit.wav` | < 0.4s | P1 |
| `bossClear` | Boss vaincu | **manquant** | `boss_clear.wav` | < 1.8s | P1 |

**État actuel :** 5/8 couverts. 3 clés manquantes : `gameOver`, `bossHit`, `bossClear`.

---

## Règles de déclenchement

| Événement | Déclencheur code cible | Notes |
|---|---|---|
| `uiButton` | Boutons Title, WorldMap, overlays retry/continue | Déjà implémenté partiellement |
| `pickup` | `result.ate` dans la boucle GameScene | Existant et fonctionnel |
| `collisionHit` | Impact non fatal si la mécanique existe ; sinon réservé aux chocs | Actuellement aussi utilisé pour `gameOver` via délégation |
| `dangerAlert` | Cellule danger + pickup fatal (mechanic override) | Existant et fonctionnel |
| `stageClear` | `triggerClear()` sur niveau non-boss | À restreindre au cas non-boss une fois `bossClear` ajouté |
| `gameOver` | `triggerGameOver()` | Remplacer la délégation actuelle `gameover() → hit()` |
| `bossHit` | `resolveBossWeakPoint()` — TODO existant ligne 516 GameScene | Déjà identifié dans le code, attente d'une clé audio |
| `bossClear` | `triggerClear()` sur niveau boss | Distinguer du clear normal — détecter via `levelConfig` |

---

## Contraintes de mix

| Contrainte | Détail |
|---|---|
| Volume cohérent | Volume global fixé à 0.72 dans `AudioSystem.play()` — acceptable pour l'instant |
| Sons pickup courts | Pickup < 0.35s — un son long casse le rythme si le joueur enchaîne plusieurs pickups |
| Sons danger non répétés | `dangerAlert` ne doit pas rejouer à chaque frame — géré dans le code actuel |
| Pas de loop | Aucun son ne doit boucler — aucun système de loop prévu |
| Pas de BGM | Hors périmètre Phase 5 |
| Fallback tone conservé | Si un fichier WAV est absent, `AudioSystem.tone()` prend le relais — ne pas supprimer |
| Mobile mono | Sons mixables sur un seul canal — éviter les effets stéréo complexes |

---

## Fichiers WAV à prévoir (plus tard)

Ces fichiers n'existent pas encore. Ils devront être placés dans `public/assets/audio/` au moment de l'implémentation.

| Fichier | Clé | Durée cible | Nature sonore suggérée |
|---|---|---|---|
| `public/assets/audio/game_over.wav` | `gameOver` | < 1.2s | Descente tonale courte, distinct de collision |
| `public/assets/audio/boss_hit.wav` | `bossHit` | < 0.4s | Impact sourd, plus lourd que collision |
| `public/assets/audio/boss_clear.wav` | `bossClear` | < 1.8s | Fanfare courte, plus marquée que stageClear |

Le dossier `public/assets/audio/sfx/` existe (`.gitkeep`) — peut accueillir ces fichiers ou les mettre directement dans `audio/` selon convention choisie lors de l'implémentation.

---

## Hors périmètre Phase 5

- Sons spécifiques par univers (Tier 2 — voir 1004B)
- BGM / musique de fond
- Voice-over
- Jingles longs (> 2s)
- Refactor de l'AudioSystem
- Son pour LevelIntroScene (silence acceptable à ce stade)
- Variations dynamiques (pitch shifting, effets)

---

## PATCH suivant recommandé

**PATCH 1006A — Minimal Audio Tier 1 Implementation**

Objectif futur :
- Ajouter les 3 clés manquantes dans `src/data/audioRegistry.ts` : `gameOver`, `bossHit`, `bossClear`
- Ajouter les 3 méthodes dans `AudioSystem` avec fallback tone
- Connecter `gameOver` dans `triggerGameOver()` (remplacer `hit()`)
- Connecter `bossHit` dans `resolveBossWeakPoint()` (résoudre le TODO)
- Connecter `bossClear` dans `triggerClear()` pour les niveaux boss
- Garder le fallback procédural si les fichiers WAV sont absents
- Lancer `npm run check` après modification

Ne pas implémenter dans ce PATCH.

---

*Document rédigé le 2026-05-27. Aucun code ni asset modifié.*
