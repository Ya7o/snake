# Boss Generic Pickup Clarity Fix

**PATCH 1064** — src/scenes/GameScene.ts

## Problème

Dans 7 boss sur 8, spawnInitialPickup() tombait sur le chemin generique et appelait
spawnPickup(), creant un pickup orphelin sans lien avec la mecanique du boss.
Cas signales QA mobile : OutRun (balise vs turboZone), Sonic (anneau vs orbe boss),
Shinobi (pickup inutile sur ecran charge).

## Cause racine

spawnInitialPickup() gerait les cas Sonic/Shinobi/OutRun normal avec des early-returns,
mais laissait tomber en fallthrough tous les boss (sauf ces trois) vers spawnPickup().
spawnNextPickup() avait le meme probleme : apres un eventuel collect, un nouveau pickup
generique etait re-spawne.

## Fix

Deux guards identiques ajoutes, un dans chaque methode :

    // Non-Paperboy boss levels manage their own pickup logic — no generic orphan pickup
    if (this.levelConfig.type === 'boss' && this.levelConfig.universeId !== 'paperboy') return;

spawnInitialPickup() — ligne ~388 : empeche le pickup au demarrage du niveau boss.
spawnNextPickup()    — ligne ~519 : empeche le re-spawn si un pickup etait collecte.

## Exception Paperboy

NeighborhoodChaosBoss (paperboy_boss) utilise onPickupCollected() pour activer
hasPaper = true, ce qui deverrouille les bossTarget comme points faibles.
Le pickup generique est la livraison de journal — mecanique centrale, conservee.

## Perimetre

| Niveau                          | Avant             | Apres    |
|---------------------------------|-------------------|----------|
| castle_boss   (witchMirror)     | pickup orphelin   | supprime |
| sonic_boss    (loopSerpent)     | pickup orphelin   | supprime |
| streets_boss  (crimeLord)       | pickup orphelin   | supprime |
| fighter_boss  (finalChallenger) | pickup orphelin   | supprime |
| outrun_boss   (turboRival)      | pickup orphelin   | supprime |
| shinobi_boss  (shadowNinja)     | pickup orphelin   | supprime |
| kombat_boss   (dragonGate)      | pickup orphelin   | supprime |
| paperboy_boss (neighborhoodChaos) | pickup livraison | conserve |
| tous niveaux normaux            | pickup normal     | conserve |

## Inchange

- Weakpoints / boss hazards
- Mecaniques de victoire
- Assets, audio, progression
- Niveaux normaux
- Paperboy normal et boss
