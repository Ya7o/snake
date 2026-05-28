# Review

## Objectif

Inscrire le workflow GitHub-first dans CLAUDE.md pour que Claude Code l'applique automatiquement à tous les prochains patchs.

Le flux validé est :
ChatGPT prépare → Claude Code exécute dans WSL → rapport `reports/patch-XXXX/review.md` → commit/push GitHub → ChatGPT contrôle avec `Contrôle PATCH XXXX`.

## Résultat

CLAUDE.md mis à jour avec une section "Workflow GitHub-First" complète en 6 sous-sections :

1. Mode de fonctionnement du projet (flux numéroté en 10 étapes)
2. Convention obligatoire de reporting (`reports/patch-XXXX/`)
3. Contenu obligatoire de `review.md` (template)
4. Règles de fin de tâche (checklist)
5. Environnement Git obligatoire (WSL uniquement, npm depuis PowerShell)
6. Règles de scope

Aucun code source, asset, ni mécanique modifié.

## Fichiers modifiés

- `CLAUDE.md` — section "Workflow GitHub-First" enrichie (flux numéroté, convention reporting, règles scope, checklist fin de tâche)
- `reports/patch-1021/review.md` — ce fichier

## Tests / vérifications

- `npx tsc --noEmit` : **0 erreur TypeScript** (aucun code modifié, résultat attendu)
- `npm run build` (via `npm run check`) : **échec OOM Vite** — erreur préexistante, non liée à PATCH 1021 (uniquement des fichiers Markdown modifiés). Le build V8 manque de mémoire sur cette machine lors de la phase Vite bundling. À investiguer séparément.
- Scope vérifié : seuls `CLAUDE.md` et `reports/patch-1021/` modifiés.

## Captures

Aucune capture requise (tâche documentation uniquement).

## Documents

Aucun document complémentaire.

## Limites / risques

- `npm run build` échoue avec OOM Node.js (Fatal process out of memory: Zone). Ce problème est **préexistant** et indépendant de ce patch (0 fichier source modifié). Il doit être investigué dans un patch dédié (mémoire Node.js insuffisante pour la phase Vite bundling).
- `tsc --noEmit` confirme 0 erreur TypeScript — la base de code reste propre.
- CLAUDE.md était déjà en place avec une section GitHub-First partielle ; ce patch l'a enrichie sans réécriture globale.

## Liens GitHub

- Commit : https://github.com/Ya7o/snake/commit/ *(à compléter après push)*
- Rapport : https://github.com/Ya7o/snake/blob/main/reports/patch-1021/review.md
