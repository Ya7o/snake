# Template universel — Flux ChatGPT → Claude Code → GitHub → ChatGPT Review

---

## Mode de fonctionnement du projet

Ce projet utilise un flux GitHub-first piloté par ChatGPT et exécuté par Claude Code.

Le principe :

1. ChatGPT prépare le cadrage de la tâche et le prompt.
2. L'utilisateur envoie le prompt à Claude Code depuis mobile.
3. Claude Code exécute la tâche sur PC/WSL dans le repo local.
4. Claude Code lance les vérifications demandées.
5. Claude Code crée un rapport standardisé dans `reports/patch-XXXX/review.md`.
6. Claude Code ajoute les captures dans `reports/patch-XXXX/screenshots/` si la tâche est visuelle.
7. Claude Code ajoute les documents complémentaires dans `reports/patch-XXXX/docs/` si nécessaire.
8. Claude Code commit et push sur GitHub depuis WSL.
9. L'utilisateur revient dans ChatGPT avec seulement : `"Contrôle PATCH XXXX"`.
10. ChatGPT contrôle le résultat depuis GitHub.

Le vrai livrable n'est jamais "Claude a fini".

Le vrai livrable est toujours :
- un commit ou une PR GitHub ;
- `reports/patch-XXXX/review.md` ;
- captures si la tâche est visuelle ;
- `npm run check` documenté ;
- limites et risques explicitement écrits.

Ne considère jamais une tâche terminée si :
- `reports/patch-XXXX/review.md` n'existe pas ;
- `npm run check` n'a pas été lancé ou documenté ;
- le commit/push GitHub n'a pas été fait ;
- les captures attendues ne sont pas dans `reports/patch-XXXX/screenshots/` ;
- les limites ou risques sont absents du rapport.

---

## Convention obligatoire de reporting

Chaque tâche doit utiliser un numéro de patch.

Exemple : `PATCH 1022`

```
reports/patch-1022/review.md          ← obligatoire
reports/patch-1022/screenshots/       ← si tâche visuelle
reports/patch-1022/docs/              ← si documents complémentaires
```

Cette convention est obligatoire, car ChatGPT doit pouvoir contrôler le travail uniquement avec :
`"Contrôle PATCH 1022"`

---

## Template de prompt à envoyer à Claude Code

```
# Projet

Tu travailles sur le projet :

[Nom du projet]

Repo local WSL :

/mnt/c/Users/Boris/[nom-du-repo]

Repo GitHub :

[URL GitHub du repo]

Branche cible :

main

Numéro de patch :

PATCH [XXXX]

Nom de dossier rapport obligatoire :

reports/patch-[XXXX]/

Fichier principal obligatoire :

reports/patch-[XXXX]/review.md

Objectif :

[Nom clair de la tâche]

Type de tâche :

[code / audit / visuel / documentation / cleanup / release / workflow test]

---

# Contexte

[Décris brièvement l'état actuel du projet.]

[Explique le problème observé.]

[Explique pourquoi cette tâche existe.]

---

# Demande

[Décris précisément ce que Claude Code doit faire.]

---

# Règles strictes

- rester strictement dans le scope de cette tâche ;
- ne pas faire de refactor global ;
- ne pas supprimer de fichiers sans demande explicite ;
- ne pas modifier les assets sauf si demandé ;
- ne pas modifier les mécaniques sauf si demandé ;
- ne pas modifier les fichiers interdits ;
- ne pas ajouter de nouvelle fonctionnalité hors scope ;
- si une correction semble nécessaire mais hors scope, la noter dans le rapport au lieu de la faire ;
- documenter honnêtement les limites, risques et éléments non vérifiés ;
- toujours créer le rapport dans reports/patch-[XXXX]/review.md ;
- toujours pousser le résultat sur GitHub.

---

# Fichiers autorisés

- [liste des fichiers/dossiers modifiables]
- reports/patch-[XXXX]/

---

# Fichiers interdits

- node_modules/
- dist/
- tmp/
- .git/
- design_boards/
- fichiers temporaires
- archives
- logs
- [ajouter ici tout fichier sensible du projet]

---

# Objectifs détaillés

## 1) [Objectif 1]

[Description précise.]

## 2) [Objectif 2]

[Description précise.]

## 3) [Objectif 3]

[Description précise.]

---

# Critères d'acceptation

- [critère 1]
- [critère 2]
- [critère 3]
- npm run check doit passer, ou l'échec doit être documenté avec la cause exacte ;
- si la tâche est visuelle, les captures doivent prouver le résultat ;
- aucun fichier hors scope ne doit être modifié ;
- reports/patch-[XXXX]/review.md doit être créé ;
- le commit/push GitHub doit être fait.

---

# Tests / vérifications à lancer

Commande obligatoire :

npm run check

Commandes optionnelles si nécessaires :

- npm run build
- npm test
- [autre commande projet]

Le résultat doit être écrit dans reports/patch-[XXXX]/review.md.

---

# Captures si tâche visuelle

Si la tâche est visuelle, créer les captures utiles dans :

reports/patch-[XXXX]/screenshots/

Captures attendues :

- reports/patch-[XXXX]/screenshots/before.png si utile
- reports/patch-[XXXX]/screenshots/after.png
- reports/patch-[XXXX]/screenshots/mobile.png si utile
- reports/patch-[XXXX]/screenshots/[nom-ecran].png

Les captures doivent être commit et push sur GitHub.

---

# Documents complémentaires si nécessaires

Si la tâche produit des documents complémentaires, les créer dans :

reports/patch-[XXXX]/docs/

Exemples : notes.md, audit.md, checklist.md, mapping.md

---

# Contenu obligatoire de review.md

# Review

## Objectif
Ce qui était demandé.

## Résultat
Ce qui a été fait.

## Fichiers modifiés
Liste des fichiers importants.

## Tests / vérifications
Commande lancée :
- npm run check

Résultat :
- OK / échec / limites

## Captures
Liens ou chemins vers les screenshots si disponibles.

## Documents
Liens ou chemins vers les docs si disponibles.

## Limites / risques
Ce qui reste fragile, non vérifié, ou hors scope.

## Liens GitHub
- Commit :
- PR :

---

# Environnement Git obligatoire

Travaille depuis WSL, pas depuis PowerShell Windows.

Les commandes Git doivent être lancées depuis WSL :

cd /mnt/c/Users/Boris/[nom-du-repo]
git status
git add [fichiers attendus]
git commit -m "PATCH [XXXX] — [message clair]"
git push origin main

Ne pas lancer git depuis PowerShell Windows.
Raison : chmod / permissions peuvent être bloqués sur le filesystem NTFS.

---

# À la fin

1. Lance : npm run check
2. Note le résultat dans reports/patch-[XXXX]/review.md
3. Complète toutes les sections obligatoires de review.md
4. Si tâche visuelle, ajoute les captures dans reports/patch-[XXXX]/screenshots/
5. Si notes utiles, ajoute-les dans reports/patch-[XXXX]/docs/
6. Vérifie avec git status que seuls les fichiers attendus sont modifiés
7. Depuis WSL uniquement :
   git add [fichiers attendus]
   git commit -m "PATCH [XXXX] — [message clair]"
   git push origin main
8. Donne les liens GitHub : commit ou PR, review.md, captures si disponibles.

---

# Réponse finale attendue

Tâche :
PATCH [XXXX] — [Nom de la tâche]

Statut :
terminé / échoué

Tests :
npm run check : OK / erreur

GitHub :
- Commit :
- PR :
- Review :
- Captures :

Résumé :
- ce qui a été fait ;
- fichiers modifiés ;
- limites / risques ;
- recommandation : contrôler via GitHub.
```
