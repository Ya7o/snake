# PATCH 1006 — Gameplay Depth Minimal Scope

## Objectif

Définir précisément ce que Phase 5 ajoute au jeu, et ce qu'elle interdit.

---

## Sources utilisées

- PATCH 1004A — Template Readiness Report
- PATCH 1004B — Audio Asset Coverage Audit
- PATCH 1005A — Minimal Audio Event Map
- PATCH 1005B — Boss Mechanics Prioritization

---

## Définition de Phase 5

Phase 5 ne doit pas ajouter de gros systèmes.
Elle doit seulement renforcer :

- feedback boss
- audio Tier 1
- lisibilité des boss
- quelques mécaniques boss faibles
- cohérence HUD boss
- validation mobile

---

## Objectifs Phase 5

| Axe | Objectif | Type | Priorité |
|---|---|---|---|
| Audio Tier 1 | ajouter gameOver, bossHit, bossClear | code + assets | P1 |
| Boss feedback | bossHit visuel + sonore | code | P1 |
| Boss HUD hints | afficher fenêtre d'attaque claire | code | P1 |
| Boss weakpoint rules | corriger mécaniques ambiguës | code | P1/P2 |
| Mobile readability | vérifier gameplay boss sur capture | audit | P1 |
| Per-universe polish | remettre à plus tard | interdit maintenant | P3 |

---

## Scope autorisé

Autorisé en Phase 5 :

- ajouter 3 clés audio Tier 1
- connecter bossHit
- connecter bossClear
- distinguer gameOver de collision
- ajouter HUD hint minimal pour boss
- corriger Shinobi reveal
- réduire Streets pressure zone
- clarifier OutRun turboRival
- vérifier boss via captures

---

## Hors périmètre

Interdit en Phase 5 :

- boutique
- inventaire
- upgrades
- progression complexe
- BGM
- sons par univers
- boss multi-phases
- dialogues
- cutscenes
- nouveaux écrans
- animations lourdes
- refactor global
- polish assets univers par univers

---

## Priorité de patchs recommandée

1. PATCH 1007A — Minimal Audio Tier 1 Implementation
2. PATCH 1007B — Boss HUD Hint Safety Pass
3. PATCH 1008 — Shinobi Reveal Rule Fix
4. PATCH 1009 — Streets Pressure Zone Readability
5. PATCH 1010 — OutRun Turbo Rival Clarification
6. PATCH 1011 — Boss Capture Audit

---

## Patchs parallélisables

- Audio implementation peut être parallèle à un patch boss **seulement si les fichiers ne se croisent pas**.
- Documentation/audit peuvent être parallèles.
- Deux patchs qui modifient `GameScene.ts` **ne doivent pas être parallèles**.
- Deux patchs qui modifient `AudioSystem.ts` / `audioRegistry.ts` **ne doivent pas être parallèles**.

Séquences compatibles :

| Patchs | Parallélisable ? | Raison |
|---|---|---|
| 1007A + 1007B | Non | 1007A touche AudioSystem ; 1007B touche GameScene mais peut débuter si les HUD hints n'impliquent pas AudioSystem |
| 1007B + 1008 | Oui | Fichiers distincts (GameScene HUD vs ShinobiBoss) |
| 1008 + 1009 | Oui | Fichiers distincts (ShinobiBoss vs CrimeLordBoss) |
| 1009 + 1010 | Oui | Fichiers distincts (CrimeLordBoss vs TurboRivalBoss) |
| 1011 + tout | Oui | Audit pur, aucune modification code |

---

## Gate de sortie Phase 5

Phase 5 est complète quand :

- [ ] `gameOver`, `bossHit`, `bossClear` existent et sont connectés
- [ ] au moins 4 boss sont lisibles et validés par capture
- [ ] Shinobi reveal n'est plus purement cosmétique
- [ ] Streets pressure zone n'est pas injuste sur mobile portrait
- [ ] OutRun boss a une logique compréhensible
- [ ] aucun nouveau système lourd n'a été ajouté

---

## Recommandation

Commencer par PATCH 1007A (audio Tier 1) car il débloque le feedback sonore pour tous les boss suivants.
Enchaîner avec PATCH 1007B (HUD hints) pour rendre les boss lisibles sans attendre les fixes individuels.
Traiter ensuite Shinobi, Streets et OutRun en séquence rapide — chaque fix est inférieur à 15 lignes.
Terminer par l'audit capture (1011) avant de déclarer Phase 5 fermée.

Priorité absolue : stabilité. Si un patch introduit une régression, il est revert immédiatement.

---

*Document créé le 2026-05-27. Aucun code ni asset modifié.*
