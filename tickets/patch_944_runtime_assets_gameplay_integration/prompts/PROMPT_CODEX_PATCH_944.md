Tu dois appliquer le PATCH 944 — Runtime assets gameplay integration.

# Contexte
Le patch 943 a installé 24 PNG runtime validés dans :

```txt
public/assets/runtime/universes/<univers>/
```

et le catalogue :

```txt
src/assets/runtimeUniverseAssets.ts
```

Mais GameScene ne les utilise pas encore.

# Objectif
Brancher les 24 assets dans le gameplay :
- pickup ;
- obstacle ;
- boss marker ;
- fallback si asset absent ;
- preload uniquement pour l’univers courant.

# À copier
Copie `ready_to_copy/` à la racine du projet.

Le fichier utile proposé :

```txt
src/systems/RuntimeAssetResolver.ts
```

Le snippet d’aide :

```txt
src/scenes/GameScene.patch944.snippet.ts
```

# À modifier
- `src/scenes/GameScene.ts`
- éventuellement `src/scenes/BootScene.ts` ou `PreloadScene.ts` si le projet centralise le chargement.
- `src/assets/runtimeUniverseAssets.ts` seulement si l’import/export actuel doit être ajusté.

# Règles strictes
- Ne pas réintroduire les anciens dossiers `_downloaded`, `_extracted`, `design_board_icons`, `runtime_candidates_from_design_boards`.
- Ne pas charger les 24 assets globalement si le niveau courant n’en utilise que 3.
- Ne pas modifier les règles Snake.
- Ne pas modifier les 24 PNG.
- Ne pas remplacer toute la scène.
- Garder la grille lisible.

# Comportement attendu
- pickup affiche `role: "pickup"`;
- obstacle affiche `role: "obstacle"`;
- boss level ou boss marker affiche `role: "boss"`;
- fallback existant si texture absente ;
- assets centrés dans les cellules.

# Tailles recommandées
- pickup : `cellSize * 0.72`
- obstacle : `cellSize * 0.82`
- boss : `cellSize * 1.15`

# Tests
```bash
npm run check
npm run build
npm run preview -- --host 0.0.0.0
```

Tester mobile :
- 360x800
- 390x844
- 412x915

# Rapport final obligatoire
Liste :
1. Fichiers modifiés.
2. Fichiers créés.
3. Où les assets sont préchargés.
4. Où pickup / obstacle / boss sont affichés.
5. Fallback utilisé.
6. Tests effectués.
7. Résultat mobile.
8. Blocages / questions.
