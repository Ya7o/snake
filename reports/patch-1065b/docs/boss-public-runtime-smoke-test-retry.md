# Boss Public Runtime Smoke Test Retry

## URL

https://ya7o.github.io/snake/?unlockAll=1

## Objectif

Valider publiquement que les boss prioritaires chargent apres suppression des pickups generiques boss.

## Resultats

| Cas | Charge | Pickup generique | Pickup utile | Weakpoint / mecanique | Console | Verdict |
|---|---:|---|---|---|---|---|
| Sonic boss | oui | absent | n/a | weakpoint detecte, serpent visible | pas d'erreur bloquante | PASS |
| OutRun boss | oui | absent | n/a | rival visible, weakpoint non present a l'instant capture | pas d'erreur bloquante | PASS avec reserve |
| Shinobi boss | oui | absent | n/a | ombres visibles, weakpoint non present a l'instant capture | pas d'erreur bloquante | PASS avec reserve |
| Paperboy boss | oui | present comme pickup utile | present | boss targets visibles | pas d'erreur bloquante | PASS |
| Normal level | oui | present | present | gameplay Castle charge | pas d'erreur bloquante | PASS |

## Console / reseau

- Console : 0 erreur bloquante observee.
- Warnings : warnings WebGL `ReadPixels` pendant les captures Playwright, non bloquants.
- Audio autoplay : aucun warning autoplay observe.
- Reseau : 0 erreur critique, 0 HTTP 404, 0 request failed.

## Verdict

PASS avec reserve.

Les boss publics charges depuis GitHub Pages ne montrent pas de pickup generique sur Sonic, OutRun et Shinobi. Paperboy conserve un pickup utile, et un niveau normal conserve un pickup collectable. La reserve vient du test headless et du fait que les weakpoints OutRun/Shinobi ne sont pas exposes a chaque instant de capture, meme si leurs entites boss sont visibles et le runtime ne crashe pas.

## Limites

- Test headless Chromium avec viewport mobile 390x844, pas un mobile reel.
- Absence de pickup parfois difficile a prouver uniquement par capture; elle est aussi verifiee via l'etat runtime `GameScene.pickups`.
- Deploiement GitHub Pages peut etre en retard; ici le bundle public teste montre le comportement attendu.
- Audio autoplay non bloquant.
- Les niveaux ont ete lances depuis l'instance Phaser publique chargee par GitHub Pages afin de cibler directement les scenes boss.

## Recommandation

Boss public OK avec reserve headless. Aucun patch correctif requis pour ce smoke test.
