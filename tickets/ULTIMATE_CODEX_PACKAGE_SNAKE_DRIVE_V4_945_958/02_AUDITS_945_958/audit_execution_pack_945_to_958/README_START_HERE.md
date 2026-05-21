# Package total — audits et corrections 945 à 958

## Source
- Archive : `snake-drive-v4-backup-20260520-2039.tar.gz`
- Date : `2026-05-20 17:24`

## Résultat global
- `npm run check` : 0
- `npm run build` : 0
- Assets runtime alpha : 24/24
- Résidus legacy : 3
- Taille dist : 38594.0 Ko
- Verdict RC 958 : **NO-GO avant QA Android réelle**

## Audits inclus
- 945 — Vue ensemble jeu + assets
- 946 — Design / code / assets
- 947 — 10 points avant production
- 948 — Ergonomie mobile / performance
- 949 — Gameplay balance
- 950 — Mécaniques par univers
- 951 — Progression / save / WorldMap
- 952 — Textes FR / microcopy
- 953 — Audio / feedback
- 954 — Robustesse edge cases
- 955 — Packaging web / déploiement
- 956 — Licences / propriété assets
- 957 — Accessibilité / confort
- 958 — Release candidate final

## Corrections prioritaires consolidées

### P0
- Faire une vraie QA Chrome Android.
- Vérifier en jeu pickup / obstacle / boss dans chaque univers.
- Tester refresh, retour onglet, save absente/corrompue.
- Ne créer un release candidate qu'après session mobile réelle.

### P1
- Relire et corriger les textes visibles en français.
- Tester et équilibrer les 16 niveaux.
- Confirmer que chaque univers a une mécanique perceptible.
- Ajuster tailles sprites runtime en cellule.
- Supprimer ou archiver les 3 résidus : `_audit`, `_sources`, `_licenses`.

### P2
- Nettoyer logs / TODO.
- Ajouter notes de provenance assets générés.
- Finaliser packaging web : favicon, cache, manifest PWA si souhaité.
- Ajouter/valider mute si audio actif.

## Utilisation
Chaque dossier 949–958 contient :
- un rapport d’audit exécuté ;
- un dossier `reports/` ;
- un prompt de correction Codex dans `prompts/`.

Commencer par :
```txt
958_release_candidate_final_audit/AUDIT_958_RELEASE_CANDIDATE_FINAL.md
```

Puis appliquer les prompts correctifs en priorité :
```txt
952_french_ui_microcopy_audit/prompts/PROMPT_CORRECTIF_952.md
954_robustness_edge_cases_audit/prompts/PROMPT_CORRECTIF_954.md
949_gameplay_balance_audit/prompts/PROMPT_CORRECTIF_949.md
950_universe_mechanics_audit/prompts/PROMPT_CORRECTIF_950.md
```
