# 970 — Phase 1 Gameplay Directives

## Intention

Snake Drive V4 doit devenir un Snake arcade mobile avec identité multi-univers.

La priorité Phase 1 est le gameplay, pas l’ajout d’assets.

---

## Positionnement

```txt
Snake arcade premium mobile
```

Inspiré Mega Drive / 16-bit / 32-bit, mais sans copier les licences officielles.

---

## Scope verrouillé

```txt
8 univers
16 niveaux total
8 boss inclus
```

Structure :

```txt
univers_normal
univers_boss
```

Ne pas passer à 24 niveaux maintenant.

---

## Boucle joueur

```txt
ouvrir le jeu
→ choisir/progresser sur la World Map
→ lire l’intro du niveau
→ jouer
→ clear ou fail
→ débloquer / retry
```

---

## Boucle gameplay normale

Le joueur collecte un quota.

Pendant ce temps :

- le Snake grandit ;
- le score monte ;
- le gimmick de l’univers ajoute de la pression ;
- les dangers restent lisibles ;
- le niveau finit vite.

Durée cible : 2 à 3 minutes.

---

## Boucle boss

Le boss est un puzzle de survie.

Le joueur doit :

- survivre aux patterns ;
- identifier une ouverture ;
- toucher/collecter la cible correcte ;
- retirer 1 PV ;
- répéter 3 fois.

Durée cible : 2 à 4 minutes.

---

## Règle de lisibilité

Un danger spécial doit toujours passer par au moins une phase visible avant d’être létal.

Exemples :

```txt
warning → active → clear
```

ou

```txt
telegraph → danger → cooldown
```

Interdit : mort instantanée incompréhensible.

---

## Règle d’univers

Chaque univers a 1 gimmick principal.

Pas de multiplication de mécaniques.

### Castle

Illusions, murs pulsés, miroir.

### Sonic

Rings, chaînes, vitesse.

### Streets

Foule, blockers, pression urbaine.

### Fighter

Charge, timing, duel.

### OutRun

Lanes, checkpoints, trafic.

### Shinobi

Focus, vraie cible, leurres.

### Kombat

Zones de feu, portail, fenêtres.

### Paperboy

Livraisons, chiens/obstacles suburbains, timing.

---

## Difficulté

Ordre recommandé :

1. Castle : pédagogique
2. Sonic : vitesse
3. Streets : déplacements ennemis
4. Fighter : timing
5. OutRun : lanes rapides
6. Shinobi : lecture fine
7. Kombat : pression élevée
8. Paperboy : chaos contrôlé

---

## HUD

Le HUD doit répondre à 3 questions :

1. Où suis-je ?
2. Que dois-je faire ?
3. Combien il me reste ?

Pas plus.

---

## Intro de niveau

Chaque intro doit contenir :

```txt
nom niveau
règle courte
objectif
hint
jouer
carte
```

Exemple :

```txt
JARDIN ENCHANTÉ
MURS FANTÔMES
OBJECTIF : 10
Les murs apparaissent par pulsations. Avance quand la voie est libre.
```

---

## Contrôles mobile

Priorité absolue :

- swipe court mais fiable ;
- pas de demi-tour impossible ;
- input buffer simple ;
- clavier pour debug ;
- aucune latence ressentie.

---

## Erreurs à éviter

- trop de gimmicks ;
- boss trop complexes ;
- backgrounds qui empêchent de lire ;
- niveaux trop longs ;
- textes trop longs ;
- UI baked dans les images ;
- ajout de dépendances.

---

## Définition de “Phase 1 terminée”

Phase 1 est terminée si :

- les 16 niveaux sont lançables ;
- les 16 niveaux sont clearables ;
- les 16 niveaux peuvent tuer le joueur ;
- la progression fonctionne ;
- les règles sont compréhensibles ;
- le build passe ;
- le jeu est jouable sur mobile portrait.
