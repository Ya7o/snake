# Audio Polish QA

## Objectif

Évaluer les sons Tier 1 avant sound design final.

## Sons audités

| Clé | Fichier | Existe | Durée | Qualité prototype | Recommandation |
|---|---|---:|---:|---|---|
| uiButton | ui_button.wav | Oui | 0.055 s | Bonne. Très court, propre, discret. | Garder pour prototype v1. |
| pickup | pickup_magic.wav | Oui | 0.310 s | Bonne. Cue positif court et lisible. | Garder pour prototype v1. |
| collisionHit | collision_hit.wav | Oui | 0.280 s | Correcte. Impact plus fort, sans clipping. | Garder provisoirement, vérifier agressivité mobile. |
| dangerAlert | danger_alert.wav | Oui | 0.400 s | Correcte. Alerte courte, niveau raisonnable. | Garder provisoirement, vérifier distinction en gameplay. |
| stageClear | stage_clear.wav | Oui | 0.735 s | Bonne. Jingle court et propre. | Garder pour prototype v1. |
| gameOver | game_over.wav | Oui | 1.050 s | Correcte techniquement, placeholder audible probable. | Remplacer plus tard pour identité finale. |
| bossHit | boss_hit.wav | Oui | 0.320 s | Correcte techniquement, mais niveau RMS le plus haut. | Vérifier sur mobile réel, remplacer si trop dominant. |
| bossClear | boss_clear.wav | Oui | 1.350 s | Correcte techniquement, plus longue et placeholder probable. | Remplacer plus tard pour finalisation boss. |

## Critères

- court ;
- lisible mobile ;
- pas agressif ;
- pas trop fort ;
- pas trop long ;
- distinct des autres sons ;
- fallback conservé.

## Verdict par son

### uiButton

Acceptable pour prototype v1. Le fichier est très court, mono, propre, et son niveau reste conservateur. Aucun risque technique détecté.

### pickup

Acceptable pour prototype v1. Durée courte, niveau modéré, aucun clipping. Le son devrait rester lisible sans dominer l'action.

### collisionHit

Acceptable provisoirement. Le niveau crête est plus élevé que les cues positifs, ce qui convient à un impact, mais il faut confirmer sur haut-parleur mobile que l'attaque ne devient pas agressive.

### dangerAlert

Acceptable provisoirement. La durée de 0.400 s reste compatible avec une alerte courte. La priorité QA est de vérifier qu'il se distingue clairement de collisionHit pendant le jeu.

### stageClear

Acceptable pour prototype v1. Le son reste court pour un jingle de réussite et ne présente pas de problème technique.

### gameOver

Techniquement acceptable, mais à considérer comme placeholder. La durée est correcte pour un état game over, toutefois le son mérite une passe de sound design final pour mieux porter l'identité du jeu.

### bossHit

Acceptable seulement comme placeholder. C'est le son avec le RMS le plus haut du lot, donc il peut devenir fatigant si répété pendant un boss. À tester en combat sur mobile réel.

### bossClear

Techniquement acceptable, mais à considérer comme placeholder. C'est le plus long des sons Tier 1, ce qui est tolérable pour une victoire boss, mais il devrait être remplacé ou retravaillé pour le polish final.

## Recommandations

### À garder pour prototype v1

- uiButton
- pickup
- stageClear
- collisionHit, sous réserve de test mobile
- dangerAlert, sous réserve de test gameplay

### À remplacer plus tard

- gameOver
- bossHit
- bossClear

### À vérifier sur mobile réel

- collisionHit : agressivité de l'attaque sur haut-parleur téléphone.
- dangerAlert : distinction avec les sons de collision et lisibilité en situation.
- bossHit : fatigue auditive en répétition pendant un combat boss.
- bossClear : durée et présence dans le flux de victoire.

## PATCH suivant possible

PATCH 1046B — Replace Placeholder Audio

Seulement si nécessaire.

## Notes QA

- Les huit fichiers Tier 1 existent localement.
- Les fichiers sont tous des WAV PCM 16-bit mono à 44,100 Hz.
- Aucun clipping PCM détecté.
- Les URLs publiques game_over, boss_hit et boss_clear répondent en HTTP 200 avec Content-Type audio/wav.
- Aucun WAV, code, AudioSystem, audioRegistry, BGM ou fallback n'a été modifié dans ce patch.
