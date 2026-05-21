# MASTER PROMPT CODEX — Snake Drive V4 — Pré-production 945 à 958

Tu travailles sur Snake Drive V4, projet Vite + TypeScript + Phaser 3.

## Source
Utilise la sauvegarde :
```txt
01_SOURCE_BACKUP/snake-drive-v4-backup-20260520-2039.tar.gz
```

## Contexte validé par audits
- `npm run check` passe.
- `npm run build` passe.
- 24 / 24 assets runtime sont présents avec transparence.
- Le projet est buildable.
- Verdict release candidate actuel : **NO-GO avant QA Android réelle**.
- Les anciens gros pipelines assets ont été nettoyés, mais 3 dossiers résiduels restent à traiter :
  - `public/assets/external/_audit`
  - `public/assets/external/_sources`
  - `public/assets/external/_licenses`

## Objectif général
Préparer le jeu pour une release candidate mobile.

Tu dois corriger par petits lots, dans cet ordre :

1. Textes visibles français.
2. Robustesse edge cases.
3. Vérification GameScene / assets runtime.
4. Gameplay balance.
5. Mécaniques par univers.
6. Progression / sauvegarde / WorldMap.
7. Nettoyage assets résiduels.
8. Packaging web / release candidate.

## Contraintes absolues
- Ne pas réintroduire les anciens pipelines assets.
- Ne pas restaurer `_downloaded`, `_extracted`, `design_board_icons`, `runtime_candidates_from_design_boards`.
- Ne pas modifier les 24 PNG runtime sans validation.
- Ne pas supprimer les 8 univers.
- Ne pas supprimer les 16 niveaux.
- Ne pas supprimer les 8 boss.
- Ne pas remplacer toute la scène de jeu.
- Mobile Android / Chrome Android prioritaire.
- Lisibilité grille Snake prioritaire.
- Le jeu doit rester en français côté joueur.

## Commandes obligatoires après chaque correction
```bash
npm run check
npm run build
```

## Test manuel recommandé
```bash
npm run preview -- --host 0.0.0.0
```

Puis tester sur Chrome Android.

## Rapport final obligatoire après chaque lot
Lister :
1. fichiers modifiés ;
2. corrections faites ;
3. tests lancés ;
4. résultat check/build ;
5. points testés sur mobile ;
6. risques restants ;
7. blocages / questions.

## Interdiction
Ne fais pas un méga patch qui change tout.  
Produis des patchs courts, séquencés, contrôlables.
