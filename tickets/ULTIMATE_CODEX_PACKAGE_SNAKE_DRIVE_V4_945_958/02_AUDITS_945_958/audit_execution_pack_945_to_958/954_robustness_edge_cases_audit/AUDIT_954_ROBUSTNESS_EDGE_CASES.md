# AUDIT 954 — Robustesse / edge cases

## Constats
- Pause/focus/visibility : 128
- Resize/orientation : 66
- Storage/try/catch : 283
- Missing assets/fallback : 614
- Navigation/reload : 58

## Risques
- P0 : crash sur save corrompue ou asset manquant.
- P1 : bug après changement d'onglet.
- P1 : double input après spam tactile.
- P2 : layout cassé après resize.

## Corrections recommandées
- Tester spam swipe/tap.
- Tester changement d'onglet puis retour.
- Tester refresh pendant niveau.
- Tester resize/orientation.
- Tester asset manquant volontairement.
- Tester localStorage corrompu.
