# Pré-production 945-958

Date : 2026-05-21

## Verdict

**NO-GO release candidate** tant qu'une QA Chrome Android réelle n'a pas été exécutée.

Le repo est buildable et les correctifs locaux critiques sont appliqués, mais les tickets 949, 954, 957 et 958 contiennent des validations impossibles à certifier par audit statique seul.

## Correctifs appliqués

- Progression : une nouvelle sauvegarde démarre sur `node_1` uniquement; les sauvegardes vides/corrompues sont sanitizées; les IDs invalides sont filtrés.
- Audio : ajout d'un mute persistant sur l'écran titre; les sons ne jouent pas si le mute est actif.
- Textes FR : écrans victoire/défaite, HUD boss, WorldMap et consignes niveaux relus et raccourcis.
- Assets : suppression des résidus runtime `public/assets/external/_audit`, `_sources`, `_licenses`; provenance des 24 assets runtime déplacée dans `docs/ASSET_PROVENANCE_RUNTIME_24.md`.
- Packaging : ajout de `favicon.svg`, `site.webmanifest` et `theme-color`.
- Build : correction syntaxique de `src/assets/universeAssetBank.ts`.

## Statut par ticket

| Ticket | Statut | Commentaire |
|---|---|---|
| 945 | OK local | Inventaire source/assets cohérent; build OK. |
| 946 | OK local | Code et assets principaux présents; 8 univers/16 niveaux/8 boss conservés. |
| 947 | Partiel | Assets et textes corrigés; QA Android et observations gameplay restent à faire. |
| 948 | Partiel | UI mobile et runtime assets présents; pas de test 360/390/412 réel dans cette passe. |
| 949 | Partiel | Table de difficulté préparée ci-dessous; playtest 16 niveaux non exécuté. |
| 950 | Partiel | Règles visibles et mécaniques présentes; matrice ci-dessous à confirmer en jeu. |
| 951 | OK local | Save robuste et progression depuis zéro restaurée. |
| 952 | OK local | Microcopy joueur en français court; noms de marques/univers conservés. |
| 953 | Partiel | Audio distinct et mute ajoutés; volume téléphone/muet non testé. |
| 954 | Partiel | Fallbacks et sanitization présents; edge cases manuels non testés. |
| 955 | Partiel | Build, favicon, manifest OK; hébergement cible et cache non testés. |
| 956 | OK local | Résidus externes retirés du runtime public; provenance docs conservée. |
| 957 | Partiel | Flashs raccourcis et mute présent; confort 10 minutes non testé. |
| 958 | NO-GO | QA Android réelle et tag RC restent obligatoires. |

## Table difficulté à tester

| Niveau | Vitesse | Objectif | Risque principal | Reco QA |
|---|---:|---:|---|---|
| Jardin Enchanté | 165 ms | 10 | murs clignotants mal anticipés | Vérifier premier niveau accessible. |
| Miroir Sorcière | 175 ms | 3 PV | confusion vraie/fausse cible | Vérifier télégraphie boss. |
| Zone des Anneaux | 135 ms | 15 | vitesse élevée tôt | Réduire quota si trop long mobile. |
| Serpent en Boucle | 145 ms | 3 PV | trajectoire boss peu lisible | Tester lisibilité à une main. |
| Bagarre en Ruelle | 155 ms | 10 | foule mobile injuste | Vérifier blocages sans issue. |
| Seigneur du Crime | 165 ms | 3 PV | pression écran | Vérifier fenêtre d'attaque. |
| Dojo des Guerriers | 165 ms | 8 | charge peu comprise | Vérifier HUD `CHARGE`. |
| Challenger Final | 175 ms | 3 PV | contre-attaque brutale | Vérifier rythme des manches. |
| Autoroute du Soleil | 130 ms | 10 | niveau rapide | Tester sur Android bas de gamme. |
| Rival Turbo | 140 ms | 3 PV | dépassement ambigu | Vérifier feedback de dépassement. |
| Dojo des Neiges | 160 ms | 8 | leurres trop proches | Vérifier vraie cible visible. |
| Ninja de l'Ombre | 160 ms | 3 PV | clones ambigus | Vérifier contraste ombre. |
| Arène des Enfers | 160 ms | 10 | zones fatales couleur seule | Vérifier danger non uniquement couleur. |
| Porte du Dragon | 170 ms | 3 PV | fenêtre trop courte | Chronométrer fenêtre de frappe. |
| Tournée du Matin | 155 ms | 8 | livraison peu évidente | Vérifier cible maison/journal. |
| Chaos du Quartier | 155 ms | 3 PV | obstacles cumulés | Vérifier absence de mort forcée. |

## Matrice univers

| Univers | Mécanique | Feedback existant | Risque restant |
|---|---|---|---|
| Castle | murs clignotants | HUD + obstacles pulsés | danger peut rester trop discret |
| Sonic | chaînes d'anneaux | pickups multiples + score | rythme possiblement trop rapide |
| Streets | foule mobile | obstacles dynamiques | blocage injuste à confirmer |
| Fighter | charge | HUD charge + glow | règle à tester sans explication longue |
| OutRun | voies + balises | pickups de checkpoint | vitesse élevée sur mobile |
| Shinobi | vraie cible + leurres | HUD `VRAIE CIBLE` | distinction leurre/cible à confirmer |
| Kombat | zones fatales | obstacles danger | dépendance couleur à vérifier |
| Paperboy | journaux + livraison | HUD livraison + cibles | objectif moins naturel que pickup simple |

## Plan QA restant

1. Lancer `npm run preview -- --host 0.0.0.0`.
2. Tester sur Chrome Android réel en portrait : 360x800, 390x844, 412x915 si possible.
3. Faire une partie sur chaque univers normal et au moins 3 boss.
4. Tester refresh pendant niveau, après clear, après game over.
5. Tester localStorage corrompu : `localStorage.setItem('snakeDriveV4_save', '{bad')`.
6. Tester mute, volume bas, téléphone muet.
7. Vérifier hard refresh après build déployée.
8. Tagger RC seulement si aucun P0/P1 bloquant n'est observé.
