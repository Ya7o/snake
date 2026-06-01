# 19 — Pre-Release Status

Dernière mise à jour : 2026-06-01

## Verdict global

**PASS avec réserve** — prêt pour play-test physique final.

Toutes les corrections P1 identifiées lors des audits pre-release (PATCH 1110–1112) ont été appliquées en PATCH 1116 et 1117. Aucun P0 détecté. Un point visuel P1 (PNG boss trop détaillés) reste à traiter post play-test (PATCH 1112 VIS-04).

---

## Patches pre-release appliqués

| Patch | Type | Résumé |
|---|---|---|
| 1115b | Fix | LINEAR filter tous univers non-Castle |
| 1116 | Fix | Screens + score : 7 corrections (titre, typo, breakdowns, GameOver, LevelIntro, badge) |
| 1117 | Fix | Gameplay : Paperboy vitesse, Sonic ring color, Boss HUD Unicode |

## Audits de référence

| Audit | Fichier | Résultat |
|---|---|---|
| Screens + score | `reports/patch-1110/` | PASS avec réserve — corrigé en 1116 |
| Gameplay + boss | `reports/patch-1111/` | PASS avec réserve — corrigé en 1117 |
| Visual rendering | `reports/patch-1112/` | PASS avec réserve — VIS-04 post-release |

## Build

```
npm run check : 0 erreur TypeScript, 61 modules
DEV_UNLOCK_ALL = false
```

## Blocages release

Aucun P0. Points P2 restants sans blocage :

| ID | Description | Post-release |
|---|---|---|
| VIS-04 | Boss PNG Shinobi/Streets trop détaillés à 64px upscalé | Régénérer silhouettes simples |
| VIS-08 | `world_token_*.png` orphelins (8 PNGs) | Supprimer ou brancher |
| GAM-04 | OutRun normal 130ms peut être difficile pour nouveaux joueurs | Play-test à confirmer |
| GAM-06 | WitchMirror phase 3 : 30 miroirs sur 416 cells | Play-test à confirmer |

## Prochaines étapes recommandées

1. **Play-test physique** mobile Android — Paperboy, Shinobi boss, OutRun, WitchMirror phase 3.
2. **Validation visuelle** runtime : PNG assets Sonic/Streets/Shinobi/Fighter à l'écran.
3. Si play-test confirme : release tag GitHub.
4. Post-release : régénérer PNG boss simplifiés (Shinobi, Streets).
