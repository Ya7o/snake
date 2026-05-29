# Snake Drive V4 — Audio Tier 1 Plan

## Objectif

Remplacer les 3 fallbacks tone critiques par de vrais WAV courts,
et corriger les anomalies identifiées lors de l'audit PATCH 1034.

## État actuel

| Clé audio    | Fichier attendu        | Existe ? | Fallback ?                      | Priorité |
|--------------|------------------------|----------|---------------------------------|----------|
| pickupMagic  | pickup_magic.wav       | OUI      | —                               | —        |
| dangerAlert  | danger_alert.wav       | OUI      | —                               | —        |
| stageClear   | stage_clear.wav        | OUI      | —                               | —        |
| uiButton     | ui_button.wav          | OUI      | —                               | —        |
| collisionHit | collision_hit.wav      | OUI      | —                               | NOTE 1   |
| gameOver     | game_over.wav          | NON      | descending sawtooth 3 tones     | P1       |
| bossHit      | boss_hit.wav           | NON      | square 160 Hz 0.35 s            | P1       |
| bossClear    | boss_clear.wav         | NON      | ascending triangle 3 tones      | P1       |

> **NOTE 1 — collisionHit** : le fichier WAV existe et est préchargé, mais
> AudioSystem.hit() n'est jamais appelé dans le code. À clarifier :
> supprimer la méthode morte ou la brancher sur un événement.

## Fichiers à produire (PATCH 1034B)

| Fichier          | Usage                             | Durée cible | Style sonore                         | Priorité |
|------------------|-----------------------------------|-------------|--------------------------------------|----------|
| game_over.wav    | Fin de partie (GameScene:572)     | 0.9–1.4 s   | Descente grave, 8-bit dramatique     | P1       |
| boss_hit.wav     | Coup sur boss (GameScene:534)     | 0.2–0.4 s   | Impact court, punch lourd, arcade    | P1       |
| boss_clear.wav   | Boss vaincu (GameScene:586)       | 1.0–1.8 s   | Fanfare montante, victoire, 8-bit    | P1       |

## Contraintes de production

- Format : WAV mono ou stéréo, 44 100 Hz, 16 bits
- Volume RMS normalisé : -18 dBFS ± 2 dB (cohérence avec les WAV existants)
- Lisibles sur mobile avec haut-parleurs intégrés (pas de basses profondes exclusives)
- Pas de BGM / boucles dans ce patch — événements ponctuels uniquement
- Taille individuelle cible : < 70 KB (référence stage_clear.wav = 64 KB)
- Les sons doivent rester distincts des fallbacks tone pour que le passage
  WAV → tone dégradé soit perceptible (éviter d'imiter le fallback)

## Décisions de code associées (hors scope PATCH 1034B)

- Clarifier AudioSystem.hit() / collisionHit.wav : appeler sur collision mur
  OU supprimer la méthode + le WAV + la clé registry (à décider avant PATCH 1034B)
- Le dossier sfx/ peut être supprimé s'il n'est pas utilisé, ou documenté pour usage futur

## PATCH suivant recommandé

**PATCH 1034B — Add/Generate Missing Tier 1 WAV Assets**

Scope :
1. Fournir game_over.wav, boss_hit.wav, boss_clear.wav dans public/assets/audio/
2. Vérifier le volume et la durée de chaque fichier
3. Décision sur collisionHit / hit() (dead code)
4. npm run check + commit

## Risques

1. Sons trop courts → pas le temps de s'enregistrer sur mobile (buffer latence)
2. Sons trop longs → gênent le gameplay si joueur rejoue immédiatement
3. Volume incohérent → sursaut ou inaudibilité sur mobile
4. WAV mal formé → Audio HTML5 refuse de charger, fallback silencieux
   (aucun message d'erreur visible car le system ne bloque pas sur 404)
5. collisionHit.wav préchargé inutilement → léger surcoût mémoire à chaque init
