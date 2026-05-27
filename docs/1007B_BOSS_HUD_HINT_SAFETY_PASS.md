# PATCH 1007B — Boss HUD Hint Safety Pass

## Objectif

Améliorer la lisibilité des boss via hints HUD courts et cohérents, sans modifier les mécaniques, l'audio ou les assets.

## Contexte

Le système HUD boss repose sur `BaseBoss.getHudExtra()`, qui retourne une chaîne courte affichée dans la zone centrale du HUD (entre le nom d'univers et le score). La logique `compactCenter()` dans `HUDRenderer` affiche l'extra si sa longueur est ≤ longueur du ruleText + 4 caractères ; sinon elle repasse au ruleText.

Avant ce patch, seuls Castle/WitchMirror et Fighter/FinalChallenger (partiellement) avaient des hints fonctionnels.

## Changements par boss

### Castle — WitchMirrorBoss
- **État** : inchangé (référence)
- **Hints existants** : ATTENTION / DANGER / FRAPPE / TOUCHÉ / BOSS HP
- **Fichier** : aucun

### Kombat — DragonGateBoss
- **Hints ajoutés** :
  - `opening` → ATTENTION
  - `open` → FENÊTRE (fenêtre d'attaque ouverte)
  - `danger` → DANGER (zones danger actives)
  - `closed` → BaseBoss par défaut
- **Fichier modifié** : `src/mechanics/bosses/DragonGateBoss.ts`

### Fighter — FinalChallengerBoss
- **Hint corrigé** :
  - `attack_window` : anciennement `PV ♥♥♥ FRAPPE !` (trop long → fallback rule) → maintenant **FRAPPE**
  - `counter` ajouté : **ÉVITE**
  - `idle` → BaseBoss par défaut
- **Fichier modifié** : `src/mechanics/bosses/FinalChallengerBoss.ts`

### Sonic — LoopSerpentBoss
- **Hint ajouté** :
  - Constant : **FRAPPE** (l'orb en queue est toujours le point faible)
- **Fichier modifié** : `src/mechanics/bosses/LoopSerpentBoss.ts`

### Shinobi — ShadowNinjaBoss
- **Hints ajoutés** :
  - Clone réel révélé (`revealed = true`) → **FRAPPE**
  - Sinon → **OBSERVE**
- **Fichier modifié** : `src/mechanics/bosses/ShadowNinjaBoss.ts`

### Streets — CrimeLordBoss
- **Hints ajoutés** :
  - `pressure` → **DANGER**
  - `vulnerable` → **FENÊTRE**
- **Fichier modifié** : `src/mechanics/bosses/CrimeLordBoss.ts`

### OutRun — TurboRivalBoss
- **Hints ajoutés** :
  - turboZones actives → **TURBO**
  - pas de turboZone → **ÉVITE**
- **Fichier modifié** : `src/mechanics/bosses/TurboRivalBoss.ts`

### Paperboy — NeighborhoodChaosBoss
- **Hint corrigé** :
  - Anciennement `PV ♥♥♥ V1` (trop long → fallback rule)
  - `hasPaper = true` → **LIVRE**
  - `hasPaper = false` → **VAGUE X/3** (ex: VAGUE 1/3)
- **Fichier modifié** : `src/mechanics/bosses/NeighborhoodChaosBoss.ts`

## Règles conservées

- aucun changement mécanique (cycles, timers, dégâts)
- aucun changement audio (AudioSystem.ts non touché)
- aucun changement asset
- aucun refactor global
- aucun nouveau système HUD — utilisation exclusive de `getHudExtra()` existant
- runtime UI uniquement

## Analyse compactCenter

La logique `HUDRenderer.compactCenter(rule, extra)` affiche `extra` si `extra.length ≤ rule.length + 4`.

| Boss | ruleText | len | seuil | Hints (len) | Visible |
|------|----------|-----|-------|-------------|---------|
| Castle | BOSS | 4 | 8 | DANGER(6) FRAPPE(6) TOUCHÉ(6) | ✓ |
| Kombat | FENÊTRE | 7 | 11 | ATTENTION(9) FENÊTRE(7) DANGER(6) | ✓ |
| Fighter | 3 MANCHES | 9 | 13 | FRAPPE(6) ÉVITE(5) | ✓ |
| Sonic | COUPE LA BOUCLE | 15 | 19 | FRAPPE(6) | ✓ |
| Shinobi | VRAIE OMBRE | 11 | 15 | FRAPPE(6) OBSERVE(7) | ✓ |
| Streets | PRESSION | 8 | 12 | FENÊTRE(7) DANGER(6) | ✓ |
| OutRun | DÉPASSEMENT | 11 | 15 | TURBO(5) ÉVITE(5) | ✓ |
| Paperboy | SURVIE | 6 | 10 | LIVRE(5) VAGUE 1/3(9) | ✓ |

## Critères d'acceptation

- [x] npm run build OK (0 erreur TypeScript, 60 modules)
- [x] boss HUD lisible sur les 8 boss (hints courts dans compactCenter)
- [x] Castle non régressé (WitchMirrorBoss non touché)
- [x] aucun changement de mécanique boss
- [x] aucun conflit avec AudioSystem
- [x] hints courts (≤ 9 chars)
- [x] pas de texte hors écran (via compactCenter + fitOneLine)
