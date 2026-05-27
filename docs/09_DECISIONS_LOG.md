# 09 — Decisions Log

- V4 initialement construite from scratch; repo actuel maintenu comme build active.
- Web mobile.
- Phaser + TypeScript.
- Première build complète en un passage PC autorisée via ticket master.
- Conversation mobile sert à créer/auditer les tickets.
- Après première build : audit conformité, plan et code corrections.
- 2026-05-20 : nettoyage repo, suppression des archives de première build, `_incoming`, prototypes V3 et tickets appliqués.
- 2026-05-20 : cadres gameplay complets conservés par univers dans `public/assets/frames/[univers]/frame.png`.
- 2026-05-22 : audit stabilisation global — suppression du système codex (CodexAssetResolver, universeAssetBank, 80 PNGs), suppression developer-assets/ (78 fichiers), suppression runtime/castle/ (3 PNGs ghost), suppression menu-backgrounds/ (8 PNGs jamais affichés). Pipeline asset simplifié : db_ (castle) > rt_ (7 autres univers), plus de tier codex.
- 2026-05-22 : `resolveLevelId()` unifié dans les 4 scènes (LevelIntroScene, GameScene, ClearScene, GameOverScene).
- 2026-05-22 : `LevelIntroScene.preload()` charge uniquement l'asset badge du niveau courant — pickup_01.png pour normal, boss.png pour boss. `bgKey`/`bgUrl` supprimés de `MENU_THEMES` (menu-backgrounds/ jamais affichés, level-intros/*.png existent pour les 8 univers).
- 2026-05-22 : `DEV_UNLOCK_ALL = true` dans constants.ts pour développement — à passer `false` avant release.
- 2026-05-22 : `EntityState` union TypeScript stricte dans BaseMechanic. WitchMirrorBoss : miroir réel randomisé à chaque spawn.
- 2026-05-22 : Rule 14 CLAUDE.md — Claude peut lancer npm run dev pour ses tests de validation, doit arrêter le serveur après.
