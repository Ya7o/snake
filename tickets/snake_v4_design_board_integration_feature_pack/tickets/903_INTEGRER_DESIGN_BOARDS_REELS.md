# Ticket 903 — Intégrer réellement les design boards dans le jeu

## Objectif

Corriger le fait que les planches présentes dans `/home/kali/snake/design_boards/_incoming` ne sont pas utilisées réellement par le jeu.

Le jeu doit maintenant :
- détecter les boards ;
- les mapper aux univers ;
- générer ou extraire des assets ;
- produire un manifest ;
- charger ce manifest ;
- utiliser les assets dans le rendu.

## Problème

Les boards sont actuellement des fichiers sources isolés.

Ils ne sont probablement pas utilisés parce que :
- le jeu charge depuis `public/assets/...`, pas depuis `design_boards/...` ;
- aucun script ne convertit les boards en assets ;
- aucun manifest ne relie board → univers → asset ;
- les renderers utilisent des fallbacks/couleurs ;
- aucun audit runtime ne vérifie l’utilisation des boards.

## Résultat attendu

À la fin :
- `design_boards/BOARD_MAPPING.json` existe ;
- `public/assets/design-board-manifest.json` existe ;
- chaque univers a une entrée manifest ;
- chaque univers a des assets ou fallback documentés ;
- AssetManager ou DesignBoardManager charge le manifest ;
- les renderers utilisent les assets du manifest quand disponibles ;
- fallback seulement si asset absent, avec warning clair ;
- `?debugAssets=1` permet de voir quel board/asset est utilisé ;
- `npm run check` OK.

## Fichiers à créer

- `design_boards/BOARD_MAPPING.json`
- `public/assets/design-board-manifest.json`
- `scripts/build-design-assets.mjs`
- `scripts/audit-design-assets.mjs`
- `src/systems/DesignBoardManager.ts`
- assets générés dans `public/assets/universes/[univers]/`

## Fichiers à modifier

Modifier uniquement si nécessaire :
- `package.json`
- `src/systems/AssetManager.ts`
- `src/config/universes.ts`
- `src/render/RenderHud.ts`
- `src/render/RenderFrame.ts`
- `src/render/RenderPickups.ts`
- `src/render/RenderObstacles.ts`
- `src/render/RenderBoss.ts`
- `src/scenes/GameScene.ts`
- `src/scenes/LevelIntroScene.ts`
- `src/scenes/WorldMapScene.ts`
- `docs/13_ACCEPTANCE_MATRIX.md`

## Fichiers interdits

Ne pas modifier :
- les règles des 16 niveaux sauf clé asset nécessaire ;
- les mécaniques de jeu sauf clé asset nécessaire ;
- les planches source originales dans `design_boards/_incoming` ;
- les docs de vision.

Ne pas supprimer :
- fallback procédural ;
- univers ;
- boss ;
- world map ;
- scènes principales.

## Contraintes design

1. Ne jamais afficher une planche brute dans le gameplay.
2. Les boards peuvent être affichés seulement dans un écran debug/preview.
3. Les assets gameplay doivent être lisibles à taille cellule.
4. Pickups plus visibles que obstacles.
5. Obstacles simplifiés si crop trop détaillé.
6. Frame/HUD peuvent utiliser des crops plus riches.
7. Si extraction automatique incertaine, générer un fallback procédural et documenter dans le manifest.

## Contraintes techniques

1. Le jeu doit charger les assets depuis `public/assets/...`.
2. `design_boards/...` reste une source de production.
3. Le script doit pouvoir être relancé sans casser les fichiers existants.
4. Le manifest doit être lisible côté client.
5. Pas de dépendance lourde si évitable.
6. Si une dépendance image est nécessaire, justifier.
7. `npm run check` doit passer.

## Implémentation attendue

### Étape 1 — Audit des boards

Inspecter :
- `design_boards/_incoming/`
- `design_boards/castle/`
- `design_boards/sonic/`
- `design_boards/streets/`
- `design_boards/fighter/`
- `design_boards/outrun/`
- `design_boards/shinobi/`
- `design_boards/kombat/`
- `design_boards/paperboy/`

Lister :
- fichiers trouvés ;
- dimensions ;
- univers probable ;
- confiance ;
- raison.

### Étape 2 — Mapping

Créer `design_boards/BOARD_MAPPING.json`.

Exemple OutRun :

```json
{
  "outrun": {
    "sourceFile": "design_boards/outrun/outrun_board_example.png",
    "confidence": "high",
    "reason": "Logo OutRun, voiture, turbo, route, checkpoint, plage.",
    "status": "mapped"
  }
}
```

### Étape 3 — Script de génération

Créer `scripts/build-design-assets.mjs`.

Le script doit :
- lire `design_boards/BOARD_MAPPING.json` ;
- créer les dossiers `public/assets/universes/[univers]/` ;
- copier un `board_preview.png` ;
- générer `theme_palette.json` minimal ;
- générer ou extraire :
  - `frame.png`
  - `hud_panel.png`
  - `pickup_01.png`
  - `pickup_02.png`
  - `obstacle_01.png`
  - `obstacle_02.png`
  - `boss.png`
- écrire `public/assets/design-board-manifest.json`.

Si l’extraction est incertaine, créer des assets fallback procéduraux inspirés de la palette et noter `"fallback": true`.

### Étape 4 — Script audit

Créer `scripts/audit-design-assets.mjs`.

Vérifier :
- chaque univers a un board mappé ;
- chaque univers a une entrée manifest ;
- les fichiers référencés existent ;
- les assets critiques existent.

### Étape 5 — Scripts package

Ajouter sans casser les scripts existants :

```json
{
  "scripts": {
    "assets:build": "node scripts/build-design-assets.mjs",
    "assets:audit": "node scripts/audit-design-assets.mjs"
  }
}
```

### Étape 6 — Chargement runtime

Créer `src/systems/DesignBoardManager.ts`.

Responsabilités :
- charger `assets/design-board-manifest.json` ;
- fournir `getUniverseAssets(universeId)` ;
- indiquer réel/fallback ;
- log warning si asset manquant.

### Étape 7 — Rendu

Modifier les renderers pour utiliser les assets manifest quand disponibles :
- `RenderHud`
- `RenderFrame`
- `RenderPickups`
- `RenderObstacles`
- `RenderBoss`

Si asset indisponible :
- fallback procédural ;
- warning debug.

### Étape 8 — Debug visuel

Ajouter un debug activable par query param :

```text
?debugAssets=1
```

Il doit montrer :
- univers courant ;
- board source ;
- assets chargés ;
- fallback oui/non.

### Étape 9 — Validation

Lancer :

```bash
npm run assets:build
npm run assets:audit
npm run check
```

Puis tester :

```bash
npm run dev
```

et si possible :

```bash
npm run build
npm run preview -- --host 0.0.0.0
```

## Cas particulier OutRun

L’image exemple OutRun contient :
- logo OutRun ;
- frame mobile ;
- HUD ;
- dashboard voiture ;
- route / sunset / palm trees ;
- checkpoint ;
- turbo ;
- cône ;
- panneau danger ;
- barrière ;
- boss rival car.

Pour OutRun, utiliser prioritairement :
- checkpoint/turbo comme pickups ;
- cône/panneau/barrière comme obstacles ;
- voiture rival comme boss ;
- bordures route/sunset comme frame ou transition ;
- HUD mobile comme inspiration HUD.

## Tests de validation

Commandes :

```bash
npm run assets:build
npm run assets:audit
npm run check
npm run dev
```

Tests manuels :
1. Lancer le jeu.
2. Ouvrir un niveau OutRun.
3. Vérifier que le style OutRun apparaît.
4. Vérifier que pickup checkpoint/turbo est visible.
5. Vérifier que cône/panneau/barrière sont obstacles ou fallback.
6. Vérifier que le boss rival utilise l’asset ou fallback documenté.
7. Tester un autre univers.
8. Activer `?debugAssets=1`.
9. Vérifier que le debug indique le board utilisé.
10. Vérifier que la grille reste lisible.

## Critères d’acceptation

Le ticket est accepté si :
- `npm run assets:build` fonctionne ;
- `npm run assets:audit` fonctionne ;
- `npm run check` passe ;
- `public/assets/design-board-manifest.json` existe ;
- chaque univers a une entrée manifest ;
- chaque univers a des assets ou fallback documentés ;
- le runtime charge le manifest ;
- au moins OutRun utilise visiblement son board exemple ;
- aucun board brut n’est affiché dans le gameplay ;
- la grille reste lisible.

## Résumé attendu après exécution

Répondre avec :
- root cause confirmée ;
- fichiers créés ;
- fichiers modifiés ;
- mapping final des boards ;
- assets générés par univers ;
- quels assets sont réels ;
- quels assets sont fallback ;
- résultat `npm run assets:build` ;
- résultat `npm run assets:audit` ;
- résultat `npm run check` ;
- tests manuels à faire ;
- prochaines corrections recommandées.
