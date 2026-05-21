# PACKAGE ULTIME CODEX — Snake Drive V4 — Audits 945 à 958

## But
Ce package est le dossier complet à donner à Codex pour préparer les corrections pré-production.

Il contient :
- la dernière sauvegarde source ;
- tous les audits 945 à 958 ;
- les prompts correctifs ;
- une feuille de route de correction ;
- une checklist QA mobile ;
- un protocole release candidate.

## Source à utiliser
```txt
01_SOURCE_BACKUP/snake-drive-v4-backup-20260520-2039.tar.gz
```

## Audits à lire
```txt
02_AUDITS_945_958/audit_execution_pack_945_to_958/README_START_HERE.md
```

## Premier prompt à donner à Codex
```txt
03_CODEX_MASTER_PROMPTS/MASTER_PROMPT_CODEX_PREPRODUCTION.md
```

## Ordre de correction recommandé
1. Lot A — Textes français visibles.
2. Lot B — Robustesse edge cases.
3. Lot C — QA GameScene assets runtime.
4. Lot D — Gameplay balance.
5. Lot E — Mécaniques par univers.
6. Lot F — Progression / sauvegarde / WorldMap.
7. Lot G — Nettoyage assets résiduels.
8. Lot H — Packaging web / release candidate.

## Règles strictes
- Ne pas réintroduire les anciens pipelines assets.
- Ne pas modifier les 24 PNG runtime sans demande explicite.
- Ne pas supprimer les 8 univers.
- Ne pas supprimer les 16 niveaux.
- Ne pas supprimer les 8 boss.
- Ne pas faire de refonte globale.
- Chaque patch doit être court, testable et accompagné d’un rapport.
