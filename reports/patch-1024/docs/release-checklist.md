# Snake Drive V4 — Prototype Release Checklist

## Statut
Prototype multi-univers jouable.

## Contenu validé
- [x] 8 univers
- [x] 16 niveaux
- [x] 8 boss
- [x] world map
- [x] LevelIntro system/boss
- [x] gameplay normal/boss
- [x] Clear/GameOver
- [x] textes FR harmonisés
- [x] OpenMoji / placeholders corrigés
- [x] build validé

## Tests manuels recommandés
- Title → WorldMap
- WorldMap → Castle normal
- Castle normal → Clear
- Castle boss → Clear
- Paperboy normal → pickup visible
- Paperboy boss → target visible
- OutRun boss → turbo/rival lisible
- Mortal Kombat system → description safe area
- GameOver → Retry / WorldMap

## Décisions produit à prendre
- DEV_UNLOCK_ALL : true pour démo ou false pour progression ?
- Build source uniquement ou build web hébergeable ?
- BGM reportée ou non ?
- OutRun turboZone à polir ou acceptable ?
- Nettoyage repo réel ou simple export propre ?

## Limites connues
- pas de BGM
- certains sons peuvent utiliser fallback
- OutRun turboZone perfectible
- boss Paperboy complexe
- warning Vite chunk > 500 kB non bloquant
- npm run check dépend de la RAM disponible

## Critère de release prototype
Le prototype est release-ready si :
- npm run check passe ;
- archive source propre disponible ;
- README de lancement présent ;
- aucun bug bloquant sur Title/WorldMap/Game/Clear/GameOver ;
- le mode DEV_UNLOCK_ALL est décidé.
