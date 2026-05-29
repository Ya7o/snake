# Release Mode Decision — Progression & Unlock

**Patch :** 1028  
**Date :** 2026-05-29  
**Statut :** Décision validée — implémentation prévue PATCH 1029

---

## 1. Mode par défaut (release)

La release officielle doit utiliser une progression verrouillée :

- **Castle** est disponible au départ (premier nœud déverrouillé).
- Les 7 autres univers se débloquent en progressant sur la WorldMap selon l'ordre des nœuds.
- Les boss sont accessibles une fois les niveaux normaux de l'univers complétés (logique `markCleared` + `nextNodeId` déjà en place dans `SaveSystem`).
- `DEV_UNLOCK_ALL` doit être mis à `false` pour toute release publique.

Ce comportement est déjà implémenté dans `SaveSystem.ts` — il suffit de basculer le flag.

---

## 2. Bypass discret (debug / démo)

### Comparatif des options

| Option | Avantage | Risque | Recommandation |
|---|---|---|---|
| **A. Konami code** (↑↑↓↓←→←→BA) sur Title / WorldMap | Familier des joueurs retro, invisible | Peut se déclencher par accident sur mobile, nécessite clavier | Non recommandé seul (clavier peu adapté mobile) |
| **B. Séquence de taps sur le titre** (ex. 5 taps rapides sur "Snake Drive") | Mobile-friendly, invisible, facile à implémenter | Peut être découvert par curiosité, séquence à bien calibrer | Recommandé en complément |
| **C. Paramètre URL `?unlockAll=1`** | Totalement invisible en prod, idéal démo/debug, simple | Un utilisateur qui voit l'URL peut le partager | Recommandé en priorité |
| **D. localStorage flag manuel** (console dev) | Invisible, flexible | Nécessite les DevTools, pas adapté démo rapide | Réservé aux cas extrêmes |
| **E. Combinaison clavier debug** (ex. Ctrl+Shift+U) | Rapide sur desktop | Inutilisable sur mobile, trop facile à découvrir | Non recommandé |

### Décision

**Combiner C + B :**

1. **Priorité 1 — Paramètre URL** : `?unlockAll=1`  
   → Idéal pour les démonstrations et les tests rapides depuis un lien.  
   → Invisible en prod, pas de bouton visible.

2. **Priorité 2 — Séquence de taps discrète** : 5 taps rapides sur le logo "Snake Drive" dans TitleScene  
   → Mobile-friendly, utilisable sans URL.  
   → Confirmation via un feedback visuel discret (flash bref, pas de popup).

**Ne pas implémenter :**
- Aucun bouton "Débloquer tout" visible dans l'UI.
- Aucun menu de debug accessible depuis le gameplay normal.

---

## 3. Règles de persistance

| Donnée | Stockage | Durée |
|---|---|---|
| Progression normale (niveaux complétés, nœuds déverrouillés) | `localStorage` clé `snakeDriveV4_save` | Persistant jusqu'à reset manuel |
| `?unlockAll=1` via URL | **Session uniquement** (pas écrit en localStorage) | Expire à la fermeture de l'onglet ou rechargement sans le paramètre |
| Unlock via tap séquence | **Session uniquement** par défaut — optionnel : écrire une clé `snakeDriveV4_devUnlock` séparée | À décider à l'implémentation |
| Reset progression | Via `?resetProgress=1` ou `SaveSystem.reset()` en console | Immédiat |

### Justification session-only pour unlockAll

- Évite qu'un joueur lambda se retrouve avec tout déverrouillé après une démo.
- La progression normale reste intacte.
- Le démo-eur peut toujours relancer avec `?unlockAll=1`.

---

## 4. Critères d'implémentation PATCH 1029

PATCH 1029 devra :

- [ ] Mettre `DEV_UNLOCK_ALL = false` dans `src/config/constants.ts`.
- [ ] Modifier `SaveSystem.load()` pour lire un flag session (`unlockAllSession`) en plus de `DEV_UNLOCK_ALL`.
- [ ] Lire `?unlockAll=1` dans l'URL au démarrage (BootScene ou SaveSystem) et stocker en mémoire runtime uniquement.
- [ ] Implémenter la séquence 5 taps sur logo dans TitleScene, avec feedback visuel discret.
- [ ] Implémenter `?resetProgress=1` pour reset localStorage (puis redirect sans paramètre).
- [ ] Ne pas casser WorldMap ni les tests existants.
- [ ] Documenter l'utilisation du bypass dans `reports/patch-1029/docs/`.
- [ ] Créer captures si changement visuel détectable.
- [ ] `npm run check` vert avant commit.

---

## 5. Résumé de la décision

```
Release par défaut  : DEV_UNLOCK_ALL = false, progression verrouillée
Bypass debug/démo   : ?unlockAll=1 (URL, session) + 5 taps logo (session)
Reset               : ?resetProgress=1 ou SaveSystem.reset()
Stockage unlock     : Session uniquement (pas de persistance localStorage)
Bouton public       : Aucun
```
