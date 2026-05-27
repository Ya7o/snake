# PATCH 1004B — Audio Asset Coverage Audit

## Objectif

Auditer la couverture audio actuelle avant la phase gameplay depth.
Ce document est purement documentaire — aucun code, aucun asset modifié.

---

## Sons existants

| Fichier | Chemin exact | Usage probable | Utilisé dans le code ? | Notes |
|---|---|---|---|---|
| `collision_hit.wav` | `public/assets/audio/collision_hit.wav` | Collision / mort du snake | **oui** | `AudioSystem.hit()` → `triggerGameOver()` |
| `danger_alert.wav` | `public/assets/audio/danger_alert.wav` | Apparition d'un danger | **oui** | `AudioSystem.danger()` → cellule danger + pickup fatal |
| `pickup_magic.wav` | `public/assets/audio/pickup_magic.wav` | Collecte de pickup | **oui** | `AudioSystem.pickup()` → `result.ate` |
| `stage_clear.wav` | `public/assets/audio/stage_clear.wav` | Niveau terminé | **oui** | `AudioSystem.clear()` → `triggerClear()` |
| `ui_button.wav` | `public/assets/audio/ui_button.wav` | Bouton UI | **oui** | `AudioSystem.uiButton()` → TitleScene, WorldMapScene, VfxUtils |

**Dossier vide présent :** `public/assets/audio/sfx/.gitkeep` — réservé mais non peuplé.

Aucun fichier audio spécifique par univers n'existe à ce jour.
Aucune musique de fond (BGM) n'existe.

---

## Où l'audio est utilisé

### Registry

`src/data/audioRegistry.ts` — 5 clés sémantiques :

```
pickupMagic   → assets/audio/pickup_magic.wav
collisionHit  → assets/audio/collision_hit.wav
stageClear    → assets/audio/stage_clear.wav
uiButton      → assets/audio/ui_button.wav
dangerAlert   → assets/audio/danger_alert.wav
```

### Système audio

`src/systems/AudioSystem.ts` — façade avec :
- `init()` / `resume()` : initialisation WebAudio + preload HTML Audio
- `play(key)` : lecture WAV avec fallback tone WebAudio
- `tone(freq, duration)` : beep procédural si WAV manquant
- Raccourcis : `pickup()`, `danger()`, `hit()`, `gameover()`, `clear()`, `uiButton()`
- `gameover()` délègue à `hit()` — pas de son distinct

### Scènes et déclencheurs

| Fichier | Appel | Déclencheur |
|---|---|---|
| `src/scenes/TitleScene.ts:27` | `AudioSystem.init()` | Démarrage du jeu |
| `src/scenes/TitleScene.ts:147` | `AudioSystem.uiButton()` | Tap sur bouton titre |
| `src/scenes/WorldMapScene.ts:354` | `AudioSystem.uiButton()` | Sélection de niveau sur la carte |
| `src/scenes/GameScene.ts:132` | `AudioSystem.resume()` | Entrée en jeu (unlock mobile) |
| `src/scenes/GameScene.ts:400` | `AudioSystem.danger()` | Snake entre dans une cellule danger |
| `src/scenes/GameScene.ts:413` | `AudioSystem.pickup()` | Snake collecte un pickup |
| `src/scenes/GameScene.ts:416` | `AudioSystem.danger()` | Pickup fatal (mechanic override) |
| `src/scenes/GameScene.ts:554` | `AudioSystem.hit()` | Mort du snake (`triggerGameOver`) |
| `src/scenes/GameScene.ts:567` | `AudioSystem.clear()` | Niveau complété (`triggerClear`) |
| `src/render/VfxUtils.ts:125` | `AudioSystem.uiButton()` | Bouton retry/continue (VFX overlay) |

**Non connecté au son :**
- `src/scenes/ClearScene.ts` — aucun appel audio
- `src/scenes/GameOverScene.ts` — aucun appel audio
- `src/scenes/LevelIntroScene.ts` — aucun appel audio
- Boss hit (`resolveBossWeakPoint`) — TODO laissé dans le code : `// TODO audio: play boss-hit cue when a dedicated audio cue exists.` (ligne 516 GameScene)

---

## Couverture actuelle par événement

| Événement | Son actuel | Couverture | Commentaire |
|---|---|---|---|
| Bouton UI | `ui_button.wav` | **OK** | Title, WorldMap, VfxUtils |
| Pickup collecté | `pickup_magic.wav` | **OK** | GameScene `result.ate` |
| Collision / mort | `collision_hit.wav` | **OK** | `triggerGameOver()` |
| Danger warning | `danger_alert.wav` | **OK** | Cellule danger + pickup fatal |
| Stage clear | `stage_clear.wav` | **OK** | `triggerClear()` |
| Game over | `collision_hit.wav` | **Partiel** | `gameover()` délègue à `hit()` — identique à collision, pas de distinction |
| Boss hit (weak point) | aucun | **Manquant** | TODO en code, aucune clé audio prévue |
| Boss defeated | `stage_clear.wav` | **Partiel** | Boss defeat passe par `triggerClear()`, même son que niveau normal |
| World map select | `ui_button.wav` | **OK** | Même son que bouton générique |
| Level intro | aucun | **Manquant** | LevelIntroScene muette |
| BGM / ambiance | aucun | **Manquant** | Aucune piste musicale prévue |

---

## Couverture par univers

Aucun son spécifique par univers n'existe. Tous les univers partagent le même pool générique.

| Univers | Son pickup spécifique | Son danger spécifique | Son boss spécifique | Ambiance/BGM | Statut |
|---|---|---|---|---|---|
| castle | aucun | aucun | aucun | aucune | générique uniquement |
| sonic | aucun | aucun | aucun | aucune | générique uniquement |
| street_of_rage | aucun | aucun | aucun | aucune | générique uniquement |
| street_fighter | aucun | aucun | aucun | aucune | générique uniquement |
| outrun | aucun | aucun | aucun | aucune | générique uniquement |
| shinobi | aucun | aucun | aucun | aucune | générique uniquement |
| mortal_kombat | aucun | aucun | aucun | aucune | générique uniquement |
| paperboy | aucun | aucun | aucun | aucune | générique uniquement |

La politique audio actuelle (doc `992_AUDIO_POLICY.md`) acte explicitement ce choix : Audio V1 = feedback fonctionnel, pas sound design final.

---

## Recommandation amateur raisonnable

Ne pas viser un son par univers avant que les mécaniques soient stables.

### Tier 1 — sons génériques obligatoires (déjà partiellement couverts)

| Clé | Fichier actuel | Statut |
|---|---|---|
| `uiButton` | `ui_button.wav` | présent |
| `pickup` | `pickup_magic.wav` | présent |
| `collisionHit` | `collision_hit.wav` | présent |
| `dangerAlert` | `danger_alert.wav` | présent |
| `stageClear` | `stage_clear.wav` | présent |
| `gameOver` | — manquant — | à créer (son distinct de collision) |
| `bossHit` | — manquant — | à créer |
| `bossClear` | — manquant — | à créer (distinct de stageClear) |

### Tier 2 — variations par famille d'univers (plus tard)

Familles suggérées et univers associés :

| Famille | Univers | Pickup | Danger |
|---|---|---|---|
| magic | castle | pickup cristal | drain mana |
| speed | sonic | ring tintement | avertissement vitesse |
| urban | street_of_rage, paperboy | ramassage objet | klaxon / foule |
| combat | street_fighter, mortal_kombat | frappe | cri danger |
| ninja | shinobi | shuriken | sifflement |
| dark | mortal_kombat | — | grondement |
| drive | outrun | bonus route | frein brusque |

### Tier 3 — sons spécifiques par univers

À décider uniquement si les mécaniques de chaque univers le justifient et que Tier 1 + Tier 2 sont stables.

---

## Risques

| Risque | Détail |
|---|---|
| Trop de sons par univers | Surcharge cognitive, cohérence sonore difficile à maintenir |
| Volume incohérent | Volume fixé à 0.72 dans `AudioSystem.play()` — aucun ajustement par événement |
| Sons trop longs | WAV non audités en durée — un `stageClear` long peut gêner sur mobile |
| Sons gênants en boucle | BGM non implémentée, risque nul pour l'instant — à surveiller si on en ajoute |
| Droits/licences audio | Les WAV actuels ont une origine non documentée — vérifier avant release publique |
| Surcharge mobile | Preload de tous les sons au démarrage (`preload()` appelé dans `init()`) — à surveiller si le pool grossit |
| gameover ≡ collision | `AudioSystem.gameover()` appelle `hit()` — pas de distinction sémantique pour le joueur |
| Boss hit silencieux | TODO en code depuis un moment — incohérence avec le feedback visuel (flash + shake) |

---

## Recommandation PATCH suivant

**PATCH 1005 — Minimal Audio Event Map**

Objectif : définir la table d'événements audio cibles pour Tier 1 complet, sans implémenter encore.

Contenu attendu :
- Table des 8 événements Tier 1 avec clé sémantique cible
- Contraintes de durée par type (ex. : pickup < 0.3s, boss_clear < 2s)
- Stratégie d'ajout des 3 clés manquantes (`gameOver`, `bossHit`, `bossClear`) dans `audioRegistry.ts`
- Ordre d'implémentation recommandé

Ne pas implémenter dans ce PATCH.

---

*Audit réalisé le 2026-05-27. Aucun code ni asset modifié.*
