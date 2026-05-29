# Missing Public Audio Assets Fix

## Probleme

PATCH 1040 a valide l'URL publique GitHub Pages avec une reserve : trois fichiers audio references par `src/data/audioRegistry.ts` etaient absents de `public/assets/audio/` et generaients des 404 publics :

- `/snake/assets/audio/game_over.wav`
- `/snake/assets/audio/boss_hit.wav`
- `/snake/assets/audio/boss_clear.wav`

Le jeu restait jouable grace aux fallbacks tonaux de `AudioSystem`, mais la release publique ne doit pas emettre ces 404.

## Fichiers ajoutes

| Fichier | Usage | Duree cible | Statut |
|---|---|---|---|
| `public/assets/audio/game_over.wav` | Defaite / game over | < 1.2s | Ajoute, environ 1.05s |
| `public/assets/audio/boss_hit.wav` | Impact boss | < 0.4s | Ajoute, environ 0.32s |
| `public/assets/audio/boss_clear.wav` | Mini fanfare boss clear | < 1.8s | Ajoute, environ 1.35s |

## Methode

Les fichiers ont ete generes comme WAV PCM 16-bit mono 44.1 kHz via :

- `reports/patch-1041/scripts/generate-tier1-wavs.js`

Les sons sont des placeholders propres :

- `game_over.wav` : descente tonale courte.
- `boss_hit.wav` : impact court avec texture legere.
- `boss_clear.wav` : mini fanfare ascendante courte.

Aucune logique audio n'a ete modifiee. Les fallbacks existants sont conserves.

## Verifications

- `npm run check` : OK
- `npm run build` : OK
- presence dans `public/assets/audio` : OK
- presence dans `dist/assets/audio` apres build : OK
- `src/data/audioRegistry.ts` reference deja les trois fichiers attendus : OK

## Limites

- Sons placeholder, sound design final a faire plus tard.
- Pas de test public post-deploiement dans ce patch.
- Les politiques navigateur d'autoplay audio restent applicables.
- Les fallbacks tonaux restent en place.

## PATCH suivant

PATCH 1043 - Public URL Audio Re-Smoke Test
