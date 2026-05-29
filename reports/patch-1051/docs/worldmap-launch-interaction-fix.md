# WorldMap Launch Interaction Fix

## Problème

Le lancement d'un niveau depuis la WorldMap dépendait d'une fenêtre double-tap stricte
(`DOUBLE_TAP_MS = 320 ms`). Si le joueur lisait le hint `RETAPE POUR LANCER` avant de
re-taper, la fenêtre était expirée et le niveau ne se lançait pas.

## Cause

`handleNodeTap` utilisait un timestamp (`lastTapAt`) pour détecter un double-tap rapide.
Un retap lent (> 320 ms) était traité comme un premier tap sur un nœud déjà sélectionné :
la sélection était réaffichée mais aucun lancement n'était déclenché.

## Changement effectué

**Fichier :** `src/scenes/WorldMapScene.ts` — méthode `handleNodeTap`

| Avant | Après |
|---|---|
| Lance si même nœud retapé dans ≤ 320 ms | Lance si même nœud retapé **et déjà sélectionné par l'utilisateur** |
| `isDoubleTap = lastTapNodeId === id && elapsed ≤ DOUBLE_TAP_MS` | `if (isUnlocked && selectedLevelId === levelId && lastTapNodeId === nodeId)` |

La condition de sélection explicite (`lastTapNodeId`) garantit que l'auto-sélection au
chargement (Castle pré-sélectionné par `create()`) ne se transforme pas en lancement
dès le premier tap.

## Flux attendu après patch

| Action joueur | Résultat |
|---|---|
| Tap sur Castle (pré-sélectionné au chargement) | Sélectionne Castle (highlight + footer) |
| Retap sur Castle (immédiat ou lent) | Lance Castle |
| Tap sur monde verrouillé | Affiche "VERROUILLÉ", aucun lancement |
| Tap sur Castle → tap sur Sonic → retap Sonic | Sélectionne Sonic, puis lance Sonic |
| `?unlockAll=1` | Tous mondes sélectionnables, retap lent lance |
| `?resetProgress=1` | Castle seul accessible, retap lent lance |

## Risques

- **Aucun** changement de logique pour les mondes verrouillés (garde `isUnlocked`).
- Le double-tap rapide fonctionne toujours (cas couvert par la même condition).
- `lastTapAt` est conservé dans la classe (non lu mais non supprimé — pas d'impact TS).
- `WORLD_MAP_VIEW.DOUBLE_TAP_MS` reste dans `constants.ts` — export inutilisé, aucune
  erreur TypeScript.
