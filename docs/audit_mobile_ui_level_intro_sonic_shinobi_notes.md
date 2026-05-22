# Audit Mobile UI Level Intro Sonic Shinobi

Patch: `PATCH_AUDIT_MOBILE_UI_LEVEL_INTRO_SONIC_SHINOBI`

## Corrections

- Intro niveau : les boutons `JOUER` et `CARTE` occupent maintenant une action bar réservée. Le panneau mission se calcule au-dessus de cette zone avec une marge fixe, ce qui évite le chevauchement observé sur Shinobi.
- Intro niveau : le texte secondaire se limite à 2 ou 3 lignes selon l'espace réellement disponible dans la carte mission.
- Sonic gameplay : les anneaux de chaîne ont un halo et un contour plus visibles. Les anneaux inactifs restent moins prioritaires que l'anneau actif, mais ne deviennent plus quasi invisibles.
- HUD gameplay : la version compacte existante reste utilisée en une ligne principale, avec fit typographique sur mobile.

## Audit rapide

- Castle : layout intro partagé, boutons protégés; blink walls conservés.
- Sonic : anneaux renforcés; HUD compact conservé.
- OutRun : frame/pickup des patchs précédents conservés.
- Shinobi : cas pilote corrigé par la réservation de l'action bar.
- Kombat : zones dangereuses non modifiées; layout intro partagé.
- Paperboy : intro et WorldMap utilisent les mêmes garde-fous de hauteur.

## Limites

- Aucun serveur local n'a été lancé conformément à `CLAUDE.md`.
- Les captures Chrome Android réelles restent à refaire côté utilisateur.

