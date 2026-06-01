# 07 — QA Checklist

## Commandes

```bash
cd ~/apps/snake
npm run check          # TypeScript + Vite build (0 erreur attendu)
npm run dev            # Dev server port 5173 (arrêter après test)
```

## Checklist pre-release

### Build & Infrastructure
- [ ] `npm run check` = 0 erreur TypeScript
- [ ] Pas de régression après chaque patch
- [ ] `DEV_UNLOCK_ALL = false` dans `src/config/constants.ts`

### Navigation
- [ ] TitleScene → tap → WorldMap
- [ ] WorldMap → tap node → sélection ; retap → LevelIntro
- [ ] LevelIntro → JOUER → GameScene
- [ ] LevelIntro → CARTE → WorldMap (focus level)
- [ ] GameScene → clear → ClearScene
- [ ] GameScene → gameover → GameOverScene
- [ ] ClearScene → CONTINUER → LevelIntro suivant
- [ ] ClearScene → REJOUER → GameScene (même niveau)
- [ ] ClearScene → CARTE → WorldMap
- [ ] GameOverScene → REJOUER → GameScene
- [ ] GameOverScene → CARTE → WorldMap

### Gameplay core
- [ ] Snake se déplace à timestep fixe
- [ ] Swipe mobile fonctionne
- [ ] Pickup spawn safe (jamais sur snake ou mur)
- [ ] Collision mur → GameOver
- [ ] Collision corps → GameOver
- [ ] Score popup +100 sur pickup
- [ ] Quota atteint → Clear déclenché
- [ ] Retry remet score à 0

### Score
- [ ] BEST affiché sur LevelIntro avant partie
- [ ] Score in-game séparé du HP/quota (capsule droite)
- [ ] Popup +100 pickup, +250 boss hit
- [ ] Breakdown STAGE +500 ou VAINCU +1000 visible sur ClearScene
- [ ] Best score persisté en localStorage après clear/gameover

### Boss
- [ ] HP affiché dans capsule progress (`HP 2/3`)
- [ ] Centre HUD affiche ruleText boss (plus de ♥♡)
- [ ] Popup +250 sur chaque hit
- [ ] Clear boss déclenché quand HP = 0

### Mobile portrait
- [ ] Layout correct sur 390×844 (iPhone standard)
- [ ] Layout correct sur 360×780 (Android standard)
- [ ] Pas de débordement HUD ou boutons
- [ ] Touch input réactif

### Univers (× 8)
- [ ] Mécanique normale distincte et compréhensible
- [ ] Mécanique boss distincte et compréhensible
- [ ] Assets visuels chargés (ou fallback procédural visible)
- [ ] Texte GameOver spécifique à l'univers

## Checklist par patch

Avant commit :
1. `npm run check` (0 erreur)
2. `reports/patch-XXXX/review.md` créé
3. `git status` vérifié (scope correct)
4. Commit + push

## Audits de référence pre-release

| Audit | Patch | Verdict | Issues restantes |
|---|---|---|---|
| Screens + score | 1110 | PASS avec réserve | SCR corrigés en 1116 |
| Gameplay + boss | 1111 | PASS avec réserve | GAM corrigés en 1117 |
| Visual rendering | 1112 | PASS avec réserve | VIS-04 (boss PNG) à régénérer post-release |
