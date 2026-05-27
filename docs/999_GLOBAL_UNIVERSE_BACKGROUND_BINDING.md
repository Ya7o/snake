# PATCH 999 — Global Universe Background Binding

## Objectif
Appliquer à tous les univers le système de backgrounds par mode :
- system
- boss system
- gameplay
- game over
- clear

## Univers couverts
- castle (uid: `castle`)
- sonic (uid: `sonic`)
- Streets of Rage (uid: `streets`)
- Street Fighter (uid: `fighter`)
- OutRun (uid: `outrun`)
- Shinobi (uid: `shinobi`)
- Mortal Kombat (uid: `kombat`)
- Paperboy (uid: `paperboy`)

## Assets copiés — 40 fichiers
Source : `design_boards/Incoming univers 1/unviers 1/{mode}/{universe}.png`
Cible : `public/assets/ui/{uid}/{uid}_{mode}_bg.png`

Noms normalisés par univers :
```
{uid}_system_bg.png
{uid}_boss_system_bg.png
{uid}_gameplay_bg.png
{uid}_game_over_bg.png
{uid}_clear_bg.png
```

## Système de registry
`src/config/constants.ts` expose :

```typescript
UNIVERSE_RESULT_SCREEN_ASSETS: Record<string, UniverseBgSet>
```

Les clés sont générées via la fonction `mk(uid)` — pas de duplication.
Les anciennes constantes `CASTLE_RESULT_SCREEN_ASSETS` et `OUTRUN_RESULT_SCREEN_ASSETS`
sont conservées comme alias pour la compatibilité ascendante.

## Mapping des scènes

| Scène | Slot utilisé |
|---|---|
| LevelIntroScene (normal) | `system` |
| LevelIntroScene (boss) | `bossSystem` (fallback `system`) |
| GameScene | `gameplay` |
| GameOverScene | `gameOver` |
| ClearScene | `clear` |

## Règles conservées
- image = ambiance
- runtime = UI
- aucun HUD baked
- aucun bouton baked
- aucun texte baked
- aucune grille baked
- aucune modification gameplay
- aucune modification des mécaniques boss

## Hors périmètre
- gameplay
- mécaniques boss
- title screen
- world map
- refactor complet du moteur

## Critères d'acceptation
- `npm run build` OK
- tous les univers chargent leurs fonds sans erreur
- gameplay background visible sur normal et boss
- intro boss utilise `bossSystem` quand disponible
- clear utilise `clear`
- game over utilise `gameOver`
- Castle non régressé
- OutRun non régressé
