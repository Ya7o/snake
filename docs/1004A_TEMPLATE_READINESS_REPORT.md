# PATCH 1004A — Template Readiness Report

## Objectif

Évaluer si le template multi-univers est assez stable pour passer à la phase gameplay depth.

## Sources utilisées

- PATCH 996 — Castle Vertical Slice Checklist
- PATCH 997 — OutRun Template Application Audit
- PATCH 1000 — Castle & OutRun Screen Capture Audit
- PATCH 1001 — OutRun Gameplay Layout Compliance
- PATCH 1002 — Global Multi-Universe Screen Capture Audit
- PATCH 1003 — Clear Text Contrast Safety Pass

## Statut global

- **Castle** : référence validée — vertical slice complet, scènes, HUD, board, backgrounds, boss, mécanique blink walls / illusion tiles opérationnels.
- **OutRun** : deuxième univers exploitable avec réserve — layout conforme, runtime correct, gameplay background acceptable mais pas idéal (trop illustratif pour une lisibilité optimale).
- **8 univers** : backgrounds branchés et affichables — registry opérationnel, fallback procédural actif si asset manquant.
- **Clear text** : contraste sécurisé — pass PATCH 1003 appliqué, textes fonctionnels lisibles sur tous les univers audités.

## Ce qui est désormais standard

Règles de template validées et stables :

- 1 niveau normal + 1 boss par univers (16 niveaux total, 8 boss)
- 5 backgrounds par univers : `system`, `bossSystem`, `gameplay`, `gameOver`, `clear`
- **LevelIntroScene normal** → background `system`
- **LevelIntroScene boss** → background `bossSystem`, fallback `system`
- **GameScene** → background `gameplay`
- **GameOverScene** → background `gameOver`
- **ClearScene** → background `clear`
- **HUD** : runtime (couleurs, polices, scores) — pas baked dans l'image
- **Board** : runtime (grille Snake) — pas baked dans l'image
- **Grille** : runtime — prioritaire sur tout cadre ou décor
- **Textes** : runtime — lisibilité garantie indépendamment du background
- **Image** = ambiance / univers (décor, atmosphère)
- **Runtime** = UI fonctionnelle (HUD, score, boutons, textes)

## Ce qui est validé comme réutilisable

| Élément | Réutilisable ? | Notes |
|---|---:|---|
| Scene flow | oui | TitleScene → WorldMap → LevelIntro → GameScene → GameOver/Clear, stable sur tous les univers |
| Runtime HUD | oui | Score, niveau, vies — indépendant du background, conforme Castle et OutRun |
| Runtime board | oui | Grille Snake runtime, priorité visuelle maintenue sur tous les univers testés |
| Runtime buttons | oui | Boutons système positionnés runtime, pas baked dans les images |
| Background registry | oui | RuntimeAssetResolver branché, fallback procédural actif si asset absent |
| Clear contrast safety | oui | Pass PATCH 1003 appliqué, contrastes sécurisés sur textes fonctionnels |
| LevelIntro layout | oui / partiel | Layout stable ; certains boss system backgrounds très illustratifs peuvent réduire la lisibilité du titre |
| GameScene layout | oui / partiel | Stable pour Castle et OutRun ; gameplay background OutRun acceptable mais lisibilité à surveiller sur futurs univers |
| Gameplay mechanics | non | Spécifiques par univers — castle, sonic, streets, fighter, outrun, shinobi, kombat, paperboy chacun distincts |

## Réserves restantes

- **OutRun gameplay background** : acceptable pour le test mais pas idéal — trop illustratif, risque de concurrencer la grille sur certains appareils.
- **Boss system backgrounds très illustratifs** : certains univers (ex. Witch Mirror Castle) chargés visuellement — à surveiller si le texte du niveau introductif devient illisible.
- **Mortal Kombat** : univers plus chargé visuellement que les autres — la lisibilité de la grille en gameplay devra être vérifiée lors du déploiement de sa mécanique.
- **Paperboy** : narrative et lisible, mais le style illustratif peut créer des conflits si de nouveaux assets sont générés sans contrainte de clarté.
- **Audio** : coverage encore générique — effets sonores présents mais pas différenciés par univers ni par mécanique.
- **Boss mechanics** : pas toutes différenciées — certains boss partagent encore des comportements génériques plutôt que les mécaniques cibles définies.
- **Risque assets baked UI** : si de nouveaux visuels sont générés sans contrainte explicite, ils peuvent inclure des éléments d'UI baked (scores, boutons fictifs) qui entrent en conflit avec le runtime.

## À ne pas corriger maintenant

- Ne pas refaire tous les backgrounds — le registry fonctionne, les fallbacks couvrent les absences.
- Ne pas polir chaque univers à la main avant la phase gameplay depth.
- Ne pas implémenter tous les boss en même temps — prioriser par univers pilote.
- Ne pas créer de boutique, inventaire ou système de progression complexe avant stabilisation des mécaniques de base.
- Ne pas refaire TitleScene ni WorldMap avant que le gameplay depth soit défini et testé.

## Gate de passage vers Phase 5

- [x] Castle vertical slice validé
- [x] OutRun deuxième univers test exploitable
- [x] 8 univers affichables
- [x] Clear text contrast sécurisé
- [ ] Audio coverage audité
- [ ] Boss mechanics priorisées
- [ ] Gameplay depth minimal défini

## Recommandation

Le template est structurellement stable. La séparation image/runtime est tenue, le registry fonctionne, les fallbacks couvrent les absences d'assets, et les textes fonctionnels sont lisibles sur l'ensemble des univers audités.

Les trois gates restantes (audio coverage, boss mechanics, gameplay depth minimal) ne bloquent pas le passage à la phase suivante : elles constituent le périmètre de cette phase. Le projet peut entrer en **Phase 5 — Gameplay Depth** dès que le premier univers cible est sélectionné et son gameplay depth minimal défini.

**Recommandation : passer à Phase 5.**
