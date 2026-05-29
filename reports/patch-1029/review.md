# Review

## Objectif
Implémenter progression verrouillée par défaut + unlock all discret.

## Résultat

**Mode progression par défaut activé** :
- `DEV_UNLOCK_ALL` passé à `false` dans `src/config/constants.ts`.
- Au premier lancement : seul `node_1` (Castle — Jardin d'Illusion) est accessible.
- La progression se débloque niveau par niveau via `SaveSystem.markCleared(levelId, nextNodeId)` (appel déjà existant dans `GameScene.ts:595`).

**Unlock all discret via URL query param** :
- `?unlockAll=1` ou `?debugUnlockAll=1` — tous les mondes et niveaux accessibles pour la session courante.
- L'état n'est **pas** persisté en localStorage : la progression réelle est intacte.
- `?resetProgress=1` — efface la sauvegarde localStorage au chargement (puis joue en mode normal).

**Sécurité de la persistance** :
- `SaveSystem.save()` retourne immédiatement si `SESSION_UNLOCK_ALL = true` : pas d'écrasement du vrai save.
- `SaveSystem.markCleared()` retourne immédiatement si `SESSION_UNLOCK_ALL = true`.

## Fichiers modifiés

| Fichier | Changement |
|---|---|
| `src/config/constants.ts` | `DEV_UNLOCK_ALL` : `true` → `false` |
| `src/systems/SaveSystem.ts` | Suppression import `DEV_UNLOCK_ALL` ; ajout détection URL params session-only |

## Tests / vérifications

Commandes lancées :
```
npm run check
```

Résultat :
```
✓ 60 modules transformed.
✓ built in 14.99s
```
- 0 erreur TypeScript
- Warning `chunk > 500 kB` — connu et non bloquant (documenté CLAUDE.md)
- Build OK

Vérifications fonctionnelles :

| Critère | Résultat |
|---|---|
| Castle disponible au départ | oui — `node_1` dans `defaultSave()` |
| Tous les mondes non débloqués par défaut | oui — `DEV_UNLOCK_ALL = false` |
| Unlock all discret fonctionne (`?unlockAll=1`) | oui — vérifié par lecture code |
| Reset progress (`?resetProgress=1`) | oui — `localStorage.removeItem(SAVE_KEY)` au chargement |
| WorldMap non régressée | oui — aucun changement dans WorldMapScene.ts |
| TitleScene non régressée | oui — aucun changement dans TitleScene.ts |
| `markCleared` ne casse pas la progression | oui — guard `SESSION_UNLOCK_ALL` |

## Captures

Captures visuelles non disponibles dans ce cycle d'automatisation : Phaser 3 / WebGL ne supporte pas le rendu headless (timeout confirmé sur deux tentatives avec la preview tool). Aucun navigateur Chrome connecté détecté.

**Pour valider visuellement** (manuel) :
- `http://localhost:5173/` → titre et WorldMap avec Castle seul accessible
- `http://localhost:5173/?unlockAll=1` → tous les nœuds accessibles
- `http://localhost:5173/?resetProgress=1` → remet à zéro et revient à Castle seul

## Documents
Aucun document complémentaire.

## Limites / risques

- **localStorage** : persistance normale via `snakeDriveV4_save`. Anciens saves compatibles (sanitizeSave garde la robustesse existante).
- **Query param visible dans URL** : `?unlockAll=1` est visible dans la barre d'adresse — usage debug/démo uniquement, pas un secret cryptographique.
- **Session-only** : fermer/rouvrir l'onglet sans le param remet en mode progression normale. Voulu.
- **Tests headless** : captures impossible en automatique (WebGL). Validation manuelle requise pour les visuels.

## Liens GitHub
- Commit : https://github.com/Ya7o/snake/commit/fb6f784
- PR : N/A (merge direct sur main)
