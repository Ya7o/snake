# Review

## Objectif
Corriger le panneau score Clear/Boss Clear et déplacer PROCHAIN sous CONTINUER.

## Résultat
Le panneau score a été agrandi (88px avec record, 62px sans) et repositionné vers le bas (H×0.49) pour éviter le chevauchement avec le badge boss. Les positions des textes internes ont été recentrées. Le texte PROCHAIN : ... est maintenant placé directement sous le bouton CONTINUER. Les boutons REJOUER et CARTE ont été décalés en conséquence.

## Fichiers modifiés
- `src/scenes/ClearScene.ts` — layout Clear/Boss Clear uniquement

## Tests / vérifications

### npm run check
```
> snake-drive-v4@0.1.0 check
> npm run build

✓ 60 modules transformed.
✓ built in 13.88s
0 erreur TypeScript
warning chunk > 500kB (attendu, non bloquant)
```
Résultat : **OK**

### Vérifications fonctionnelles
- panneau score ne déborde plus : **oui**
- PROCHAIN sous CONTINUER : **oui**
- REJOUER toujours présent : **oui**
- CONTINUER fonctionne : **oui** (navigation vers LevelIntroScene)
- CARTE fonctionne : **oui** (navigation vers WorldMapScene)
- mobile portrait lisible : **oui**

## Captures

| Fichier | Viewport | Cas |
|---|---|---|
| `sonic_boss_clear_mobile_after.png` | 390×844 | Sonic Boss Clear + Nouveau Record |
| `castle_clear_mobile_after.png` | 390×844 | Castle Normal Clear |
| `castle_boss_clear_mobile_after.png` | 390×844 | Castle Boss Clear + Nouveau Record |
| `clear_new_record_mobile_after.png` | 390×844 | Sonic Normal + Nouveau Record |
| `clear_desktop_after.png` | 1280×720 | Sonic Boss Clear — desktop |
| `sonic_boss_clear_mobile_412x915.png` | 412×915 | Sonic Boss — viewport alternatif |
| `clear_no_record_mobile_390x844.png` | 390×844 | Streets Normal sans nouveau record |

## Documents
- `reports/patch-1080/docs/clear-boss-clear-score-panel-real-mobile-fix.md`
- `reports/patch-1080/logs/clear-layout-assertions.json`

## Limites / risques
- Viewports H < 600px (vieilles tablettes/pliables) : gap badge ↔ panneau ~5px en mode record. Peu probable sur mobiles Android cibles.
- Textes de niveaux très longs (> 22 caractères) : `addFittedText` réduit la fonte jusqu'à 10px min ; tronqué visuellement si extrêmement long.
- Dernier niveau sans next : bloc "TOUS LES MONDES TERMINÉS" repositionné à H×0.62 — testé visuellement OK.

## Liens GitHub
- Commit : (voir push ci-dessous)
- PR : non applicable (branche main directe)
