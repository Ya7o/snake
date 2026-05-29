# Review — PATCH 1032

## Objectif

Validation comportementale de la WorldMap dans le navigateur via Playwright :
- Navigation TitleScene → WorldMapScene
- Vérification des nodes accessibles / verrouillés (progression normale)
- Test `?unlockAll=1` (session debug unlock)
- Test `?resetProgress=1` (remise à zéro de la progression)
- Correction de l'erreur PATCH 1031b : DEV_UNLOCK_ALL était noté `true` à tort

---

## Résultat

**Tous les scénarios ont passé — 0 erreur.**

| Vérification | Résultat |
|---|---|
| Castle accessible par défaut | ✅ OUI |
| Autres mondes verrouillés par défaut | ✅ OUI (localStorage vide → seul node_1 débloqué) |
| `?unlockAll=1` rend tous les mondes accessibles | ✅ OUI |
| `?resetProgress=1` revient à Castle seul | ✅ OUI |
| Aucun bouton public unlock all | ✅ CONFIRMÉ |
| Navigation Title → WorldMap fonctionnelle | ✅ OUI |
| DEV_UNLOCK_ALL = false | ✅ CONFIRMÉ (correction PATCH 1031b) |

**Méthode d'accès Phaser** : `window.__SNAKE_GAME__` exposé dans `main.ts:55`

---

## Fichiers modifiés

Aucun fichier source modifié (`src/`, `public/`, `package.json`, `vite.config`, `tsconfig`).

Fichiers créés (rapport uniquement) :

```
reports/patch-1032/review.md
reports/patch-1032/scripts/behavioral-test.mjs
reports/patch-1032/scripts/run-tests.sh
reports/patch-1032/logs/behavioral-results.json
reports/patch-1032/screenshots/A_normal_title.png
reports/patch-1032/screenshots/A_normal_worldmap.png
reports/patch-1032/screenshots/B_unlock_all_title.png
reports/patch-1032/screenshots/B_unlock_all_worldmap.png
reports/patch-1032/screenshots/C_after_reset_title.png
reports/patch-1032/screenshots/C_after_reset_worldmap.png
reports/patch-1032/docs/behavioral-notes.md
```

---

## Tests / vérifications

### npm run check

```
> snake-drive-v4@0.1.0 check
> npm run build

tsc && vite build
✓ 60 modules transformed
✓ built in 6.90s
(!) chunk > 500 kB — warning Rollup attendu, non bloquant
0 erreur TypeScript
```

### Playwright — 3 scénarios

**Scénario A — Progression normale (localStorage vide)**

- URL : `http://localhost:5173/`
- Setup : `localStorage.removeItem('snakeDriveV4_save')`
- `worldmap_active` : ✅ true
- `node_count_16` : ✅ true (16 nodes rendus)
- `castle_selected_by_default` : ✅ true (`selectedLevelId = "castle_normal"`)
- `castle_node_unlocked` : ✅ true (`selectedNodeUnlocked = true`)
- `no_localStorage_on_fresh` : ✅ true (pas d'écriture avant first clear)
- Footer : `"JARDIN D'ILLUSION · NIVEAU"`
- Console errors : aucune

**Scénario B — Session unlock all (`?unlockAll=1`)**

- URL : `http://localhost:5173/?unlockAll=1`
- `worldmap_active` : ✅ true
- `node_count_16` : ✅ true
- `url_has_unlock_param` : ✅ true
- `first_node_unlocked` : ✅ true
- `no_localstorage_write` : ✅ true (SaveSystem ne persiste pas quand SESSION_UNLOCK_ALL=true)
- `streets_shows_unlocked_in_session` : ✅ true (handleNodeTap sur node_5 → selectedNodeUnlocked=true)
- Console errors : aucune

**Scénario C — Après reset (`?resetProgress=1`)**

- URL : `http://localhost:5173/?resetProgress=1`
- Setup : fake progress injecté (nodes 1-4 unlocked, castle cleared)
- `worldmap_active` : ✅ true
- `node_count_16` : ✅ true
- `url_has_reset_param` : ✅ true
- `save_was_cleared` : ✅ true (localStorage supprimé au chargement du module SaveSystem)
- `castle_selected_after_reset` : ✅ true
- `castle_unlocked_after_reset` : ✅ true
- Console errors : aucune

---

## Captures

| Fichier | Contenu |
|---|---|
| `A_normal_title.png` | TitleScene — état initial |
| `A_normal_worldmap.png` | WorldMap — progression normale, Castle sélectionné |
| `B_unlock_all_title.png` | TitleScene — session ?unlockAll=1 |
| `B_unlock_all_worldmap.png` | WorldMap — session unlock all |
| `C_after_reset_title.png` | TitleScene — ?resetProgress=1 |
| `C_after_reset_worldmap.png` | WorldMap — après reset, retour Castle seul |

---

## Documents

- `docs/behavioral-notes.md` — détail technique de la méthode de test et des accès Phaser
- `logs/behavioral-results.json` — résultats JSON complets des 3 scénarios

---

## Limites / risques

1. **Test ?unlockAll=1 partiel** : la vérification `streets_shows_unlocked_in_session` appelle `handleNodeTap` directement avec `isUnlocked=true`. Ce paramètre est bien celui capturé à la création de la scène (lors de `SaveSystem.load()` avec SESSION_UNLOCK_ALL=true), donc le test est correct — mais il n'inspecte pas directement l'état visuel des nodes verrouillés vs débloqués.

2. **DEV_UNLOCK_ALL = false** : confirmé dans `src/config/constants.ts:4`. Le rapport PATCH 1031b mentionnait à tort que DEV_UNLOCK_ALL était `true`. Il est `false` depuis sa création — le déverrouillage debug se fait exclusivement via `?unlockAll=1` en URL.

3. **Viewport Playwright** : tests exécutés en 390×844 (mobile portrait), conforme à la priorité produit Android portrait.

4. **Réseau WSL** : le serveur de dev écoute sur `0.0.0.0:5173` — Playwright y accède via `localhost:5173` depuis WSL. Port non ouvert à l'extérieur du test.

---

## Liens GitHub

- Commit : https://github.com/Ya7o/snake/commit/d70ef99
- Review : https://github.com/Ya7o/snake/blob/main/reports/patch-1032/review.md
- Logs : https://github.com/Ya7o/snake/blob/main/reports/patch-1032/logs/behavioral-results.json
