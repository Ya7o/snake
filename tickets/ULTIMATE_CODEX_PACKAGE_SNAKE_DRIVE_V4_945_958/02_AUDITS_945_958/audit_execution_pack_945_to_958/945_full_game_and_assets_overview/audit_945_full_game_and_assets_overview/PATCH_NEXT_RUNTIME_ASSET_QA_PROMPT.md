# PATCH — Final QA / runtime asset verification

## Contexte
L’audit 945 confirme la présence des 24 assets runtime. Le dernier point à vérifier est leur affichage réel dans GameScene et leur lisibilité mobile.

## Objectif
Vérifier en jeu :
- pickup affiché par univers ;
- obstacle affiché par univers ;
- boss marker affiché par univers ;
- fallback si texture absente ;
- lisibilité mobile.

## À faire
1. Lancer :
   ```bash
   npm run check
   npm run build
   npm run preview -- --host 0.0.0.0
   ```
2. Tester au moins :
   - Castle level normal ;
   - Sonic level normal ;
   - Streets level normal ;
   - OutRun level normal ;
   - Paperboy level normal ;
   - un boss level.
3. Capturer écran mobile si possible.
4. Ajuster tailles :
   - pickup : 0.65–0.75 cell ;
   - obstacle : 0.75–0.90 cell ;
   - boss : 1.0–1.15 cell.

## Interdits
- Ne pas réintroduire les anciens pipelines.
- Ne pas modifier les 24 PNG.
- Ne pas charger tous les assets globalement.
- Ne pas casser la grille.
- Ne pas modifier les règles Snake.

## Rapport final obligatoire
- univers testés ;
- assets affichés ;
- tailles retenues ;
- problèmes visuels ;
- tests.
