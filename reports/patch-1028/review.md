# Review — PATCH 1028

## Objectif

Documenter la décision produit sur le mode de progression et le déblocage discret ("unlock all") avant implémentation.

Aucune modification de code dans ce patch.

---

## Résultat

Décision produit documentée :

- Mode par défaut release : progression verrouillée (`DEV_UNLOCK_ALL = false`), Castle disponible au départ.
- Bypass debug/démo retenu : paramètre URL `?unlockAll=1` (session) + séquence 5 taps sur logo TitleScene (session).
- Pas de bouton public "Débloquer tout".
- Persistance unlock : session uniquement (pas de contamination localStorage).
- Reset progression : `?resetProgress=1` ou `SaveSystem.reset()`.

Critères d'implémentation pour PATCH 1029 définis et listés.

---

## Fichiers modifiés

| Fichier | Action |
|---|---|
| `reports/patch-1028/review.md` | Créé |
| `reports/patch-1028/docs/release-mode-decision.md` | Créé |

Aucun fichier `src/`, `public/`, `package.json` ou asset modifié.

---

## Tests / vérifications

```
npm run check
```

Résultat :

```
✓ 60 modules transformed.
✓ built in 14.57s
0 erreur TypeScript
Warning chunk > 500 kB : attendu, non bloquant (Rollup warning connu)
```

Build propre.

---

## Captures

Aucune capture — patch documentation uniquement, aucun changement visuel.

---

## Documents

- [`docs/release-mode-decision.md`](docs/release-mode-decision.md) — Décision complète : mode par défaut, comparatif bypass, règles persistance, critères PATCH 1029.

---

## Limites / risques

- La séquence de taps (5 taps sur logo) n'est pas encore implémentée — définie seulement.
- `?unlockAll=1` session-only signifie qu'un rechargement sans paramètre URL remet la progression normale. Comportement voulu.
- Si le tap sequence est calibré trop bas (< 5 taps), risque de déclenchement accidentel — à ajuster à l'implémentation PATCH 1029.

---

## Liens GitHub

- Commit : à venir après push
- Fichier décision : `reports/patch-1028/docs/release-mode-decision.md`
- Review : `reports/patch-1028/review.md`
