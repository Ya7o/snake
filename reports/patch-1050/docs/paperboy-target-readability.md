# Paperboy Target Readability — PATCH 1050

## Problème constaté

Les delivery targets Paperboy (icône mailbox OpenMoji) étaient rendues sans halo ni glow autour de leur icône. Dans `ObstacleRenderer`, le chemin `hasEntityTexture` n'ajoute aucun effet visuel : l'image est affichée telle quelle, avec seulement l'alpha 0.88.

Résultat : les targets `idle` (vert `0x27ae60`) étaient visuellement difficiles à distinguer des route obstacles (gris `0x666666`), et les targets `highlighted` (jaune `0xf1c40f`) manquaient d'urgence visuelle.

## Table des changements

| Fichier | Changement | Raison |
|---|---|---|
| `src/scenes/GameScene.ts` | Ajout champ `deliveryTargetGlow: Graphics` | Support graphique per-frame |
| `src/scenes/GameScene.ts` | Création de la Graphics dans `create()` quand `uid === 'paperboy'` | Init conditionnel, depth 39 (sous entities) |
| `src/scenes/GameScene.ts` | Appel `drawPaperboyTargetGlow(time)` dans `update()` (60fps) | Animation fluide identique aux autres glows |
| `src/scenes/GameScene.ts` | Destruction dans SHUTDOWN | Pas de fuite mémoire |
| `src/scenes/GameScene.ts` | Ajout méthode `drawPaperboyTargetGlow(time)` | Logique glow différenciée idle/highlighted |

## Avant / Après

### Avant

- `deliveryTarget` idle : icône mailbox 1.9× cellule, aucun halo — difficile à repérer
- `deliveryTarget` highlighted : même rendu, seule la couleur de fond sous l'icône changeait
- Aucune distinction visuelle forte entre target et obstacle

### Après

- `deliveryTarget` idle : halo vert pulsant (`0x27ae60`) + ring vert discret — "cette maison est une cible"
- `deliveryTarget` highlighted : halo jaune pulsant intense (`0xf1c40f`) + ring blanc brillant — "livre ICI maintenant !"
- Route obstacles inchangés (pas de glow) — distinction claire target vs obstacle

## Mécanique inchangée

- Aucune modification de `PaperboyDeliveryMechanic.ts`
- Aucune modification de `NeighborhoodChaosBoss.ts`
- Aucune modification de `ObstacleRenderer.ts` ou `PickupRenderer.ts`
- La logique de collision, de livraison et de scoring n'est pas touchée

## Non-régression

- Le glow est conditionnel `uid === 'paperboy'` — aucun effet sur les autres univers
- Castle : non impacté, son propre `castlePickupGlow` est inchangé
- Depth 39 : derrière tous les gameplay objects (depth 40+), ne masque rien
- `getExtraEntities()` est déjà appelé chaque tick dans `renderGameState()` — le second appel per-frame pour le glow est négligeable (2 targets max)
