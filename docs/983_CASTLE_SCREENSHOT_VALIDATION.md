# 983 — Castle Screenshot Validation Checklist

Captures obligatoires avant de valider PATCH 983 et de passer à PATCH 990.

---

## 1. Castle Level Intro

Lancer : Castle Stage 1 (castle_normal) depuis WorldMap.

- [ ] Titre univers lisible en haut.
- [ ] Panneau info visible avec niveau, OBJECTIF, DANGER.
- [ ] `JOUER` est le bouton dominant (doré/primaire).
- [ ] `CARTE` est secondaire, plus petit.
- [ ] Aucun bouton trop bas (recouvert par chrome mobile).
- [ ] Pas de régression visuelle par rapport à PATCH 982.

---

## 2. Castle Gameplay HUD

Lancer Castle Stage 1, observer le HUD en haut.

- [ ] Aucun vestige HUD bakés visibles (anciens scores 012345, barres décoratives, cœurs, numéros).
- [ ] `CASTLE` lisible à gauche.
- [ ] `STAGE 1` ou le ruleText lisible au centre.
- [ ] `MAGIC 0/10` lisible à droite.
- [ ] HUD a une hauteur correcte (~56 px) et semble intentionnel.
- [ ] La grille Snake commence clairement sous le HUD.
- [ ] Snake et pickups visibles et non coupés par le HUD.
- [ ] Mode boss : `CASTLE BOSS` + `BOSS HP X/3` lisibles.

**Bloqueur template** : si des artefacts HUD bakés sont encore visibles, le patch échoue.

---

## 3. Castle Game Over

Perdre une vie en Castle Stage 1.

- [ ] Fond Castle (castle_game_over_bg) affiché.
- [ ] `PERDU` en rouge dominant, hiérarchie forte.
- [ ] `L'illusion t'a piégé` lisible, ton cohérent.
- [ ] Nom du niveau affiché (contextY).
- [ ] `REJOUER` est le bouton primaire (doré).
- [ ] `CARTE` est le bouton secondaire (violet sombre).
- [ ] Aucun bouton trop bas pour le chrome mobile.
- [ ] Séparateur fin entre les deux boutons.

---

## 4. Castle Stage Clear

Terminer Castle Stage 1 (collecter 10 éclats).

- [ ] Fond Castle (castle_clear_bg) affiché.
- [ ] `STAGE CLEAR` affiché, animation pulse.
- [ ] `Castle Boss débloqué` lisible (subtitleY).
- [ ] Nom du prochain niveau affiché (contextY).
- [ ] `CONTINUER` est le bouton primaire (doré).
- [ ] `CARTE` est le bouton secondaire (violet sombre).
- [ ] Positions cohérentes avec Game Over (même famille visuelle).

---

## 5. Castle Boss Clear

Battre le boss Castle (castle_boss).

- [ ] `BOSS CLEAR` affiché.
- [ ] `Monde 1 terminé` lisible.
- [ ] Boutons `CONTINUER` et `CARTE` cohérents avec Stage Clear.
- [ ] Layout identique à Stage Clear (même famille).

---

## Règle de validation

Ces cinq captures doivent valider avant de lancer PATCH 990 (template extraction).

Si le HUD gameplay montre encore des artefacts bakés → **PATCH 983 non terminé**.

Si Game Over et Clear ont des positions de boutons clairement différentes → **PATCH 983 non terminé**.
