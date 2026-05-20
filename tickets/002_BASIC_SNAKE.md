# Ticket 002 — Core Snake classique

## Objectif
Créer le Snake stable de base.

## Résultat attendu
- grille ;
- Snake ;
- déplacement timestep fixe ;
- clavier ;
- swipe ;
- pickup ;
- croissance ;
- collision mur/corps ;
- retry.

## Fichiers à créer
- `src/core/Grid.ts`
- `src/core/Snake.ts`
- `src/core/CollisionSystem.ts`
- `src/core/SpawnSystem.ts`
- `src/core/ObjectiveSystem.ts`
- `src/systems/InputManager.ts`

## Fichiers à modifier
- `src/scenes/GameScene.ts`

## Fichiers interdits
- `src/mechanics/**`
- `src/worldmap/**`
- `public/assets/universes/**`

## Contraintes mécaniques
- Pas de demi-tour instantané.
- Spawn safe.
- Timestep fixe.
- Pas de physique Phaser.

## Contraintes design
- Sobriété.
- Lisibilité.
- Pas de décor.

## Contraintes mobile
- Swipe fiable.
- Pas de double input.

## Tests
```bash
npm run check
```
Manuel : pickup, croissance, mur, corps, retry.
