# CLAUDE.md — Snake Drive V4

## Rôle

Tu développes et maintiens **Snake Drive V4**, un Snake web mobile modern-retro construit avec Vite, TypeScript strict et Phaser 3.

Le projet n'est plus à créer from scratch : il possède déjà une build jouable avec écran titre, world map, 8 univers, 16 niveaux, 8 boss, mécaniques différenciées, sauvegarde locale, assets par univers et cadres gameplay.

## Priorité Produit

1. Stabilité.
2. Mobile portrait.
3. Lisibilité de la grille Snake.
4. Mécaniques différenciées.
5. Design modern-retro cohérent.
6. Polish.

## Règles Absolues

1. Exécuter uniquement le ticket ou la demande utilisateur courante.
2. Toujours lancer `npm run check` après une modification code.
3. Ne jamais supprimer les 8 univers, 16 niveaux, 8 boss ou la WorldMap.
4. Ne jamais afficher une planche design brute dans le gameplay.
5. Ne jamais mettre un décor détaillé derrière les cellules jouables.
6. La grille Snake reste prioritaire sur les cadres, HUD et effets.
7. Mobile Android portrait prioritaire.
8. Les textes fonctionnels doivent être lisibles; réserver le pixel font aux titres/accents.
9. Pickups plus visibles que les obstacles.
10. Dangers télégraphiés.
11. Boss courts et compréhensibles.
12. Pas de nouvelle dépendance sans raison forte.
13. Si un asset manque, fallback procédural obligatoire.
14. Claude peut lancer `npm run dev` (port 5173) pour ses propres tests de validation, puis l'arrêter immédiatement après. L'utilisateur garde la main sur les serveurs de développement longue durée.
15. WorldMap : ne jamais réintroduire de bouton `JOUER` dans le footer. Le lancement se fait par double tap/retap du badge de niveau; afficher seulement une consigne texte si nécessaire.
16. Précharger uniquement les assets nécessaires à l'écran et au niveau courant; ne pas charger `boss.png` sur un niveau normal.

## Structure Actuelle

- Code : `src/`
- Scènes : `src/scenes/`
- Renderers : `src/render/`
- Mécaniques : `src/mechanics/`
- Config : `src/config/`
- Assets runtime : `public/assets/`
- Sources design triées : `design_boards/[univers]/`
- Docs : `docs/`
- Tickets actifs : `tickets/`

`dist/`, `node_modules/` et `.vite/` sont des artefacts locaux/générés et ne doivent pas être considérés comme source projet.

## Assets Et Design

Les sources design sont déjà triées par univers dans `design_boards/[univers]/`.

Structure `public/assets/` (ne pas réintroduire les dossiers supprimés) :

```text
frames/[univers]/frame.png          — cadres gameplay
level-intros/[univers]/intro.png    — backgrounds LevelIntroScene (8 univers)
ui/castle/castle_*.png              — 4 backgrounds Castle (system, gameplay, clear, game_over)
universes/[univers]/                — db_ assets : pickup_01/02, obstacle_01/02, boss, frame_tile, hud_panel
runtime/universes/[7 univers]/      — rt_ assets (sonic, streets, fighter, outrun, shinobi, kombat, paperboy)
map/world_map.png
ui/title_hub_bg.png
```

Pipeline de priorité : `db_` > `rt_` > fallback procédural. Pas de tier codex.

**Supprimés et à ne pas réintroduire :**
- `menu-backgrounds/` — 8 PNGs remplacés par `level-intros/`
- `runtime/universes/castle/` — castle utilise db_ exclusivement
- `universe_asset_bank/` — système codex supprimé
- `developer-assets/` — assets dev hors build

## Mécaniques Obligatoires

- Castle : blink walls / illusion tiles ; boss Witch Mirror.
- Sonic : ring chains ; boss Loop Serpent.
- Streets : crowd blockers ; boss Crime Lord.
- Fighter : charge move / rounds ; boss Final Challenger.
- OutRun : lane drift / checkpoints ; boss Turbo Rival.
- Shinobi : focus / decoys ; boss Shadow Ninja.
- Kombat : fatal zones / finish window ; boss Dragon Gate.
- Paperboy : delivery targets / route mayhem ; boss Neighborhood Chaos.

## Workflow

Avant modification :

1. Lire les fichiers concernés.
2. Respecter les patterns existants.
3. Éviter les refontes globales si un patch ciblé suffit.

Après modification :

1. Lancer `npm run check`.
2. Documenter les fichiers modifiés.
3. Signaler les fallbacks et limites.
4. Arrêter le serveur de test après usage (ne pas laisser de serveur actif).

## Workflow GitHub-First (ChatGPT → Claude Code → GitHub)

Chaque tâche doit produire un livrable GitHub contrôlable par ChatGPT.

Pour PATCH XXXX, créer obligatoirement :

```
reports/patch-XXXX/review.md
reports/patch-XXXX/screenshots/   ← si tâche visuelle
reports/patch-XXXX/docs/          ← si documents complémentaires
```

Le fichier `review.md` doit contenir ces sections :

```
# Review
## Objectif
## Résultat
## Fichiers modifiés
## Tests / vérifications
## Captures
## Documents
## Limites / risques
## Liens GitHub
```

Toujours lancer `npm run check` et écrire le résultat dans `review.md`.

Toujours commit/push **depuis WSL**, jamais depuis PowerShell Windows (chmod NTFS bloque) :

```bash
cd /mnt/c/Users/Boris/snake
git status
git add [fichiers attendus]
git commit -m "PATCH XXXX — [message clair]"
git push origin main
```

Toujours lancer `npm` **depuis PowerShell** (jamais depuis WSL) :

```powershell
npm run check
npm install
npm run dev
```

Raison : `node_modules` contient des binaires natifs. Installés depuis Windows → compatibles PowerShell uniquement. Installés depuis WSL → compatibles WSL uniquement. Mélanger les deux casse Rollup/Vite.

La tâche n'est pas terminée tant que :
- `reports/patch-XXXX/review.md` n'existe pas ;
- `npm run check` n'est pas documenté ;
- le commit/push GitHub n'est pas fait ;
- les captures attendues ne sont pas commitées si la tâche est visuelle.

Voir le template complet : `docs/WORKFLOW_TEMPLATE.md`

## État Dev (2026-05-28)

- `DEV_UNLOCK_ALL = true` dans `src/config/constants.ts` — tous les niveaux débloqués. Passer à `false` avant release.
- Build propre : 0 erreur TypeScript, 60 modules.

## Nettoyage Repo

Ne pas réintroduire :

- archives de première build ;
- prototypes HTML monofichier V3 ;
- dossiers `_incoming` une fois les assets triés ;
- gros packs de tickets déjà appliqués ;
- captures dupliquées sans usage documentaire ;
- `menu-backgrounds/`, `universe_asset_bank/`, `developer-assets/`, `runtime/castle/` (voir `docs/18_REPO_CLEANUP_LOG.md`).

Si un nouveau ticket pack arrive, extraire seulement les tickets utiles puis documenter l'état dans `docs/`.
