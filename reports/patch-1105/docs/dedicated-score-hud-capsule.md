# Dedicated Score HUD Capsule

## Problème
Score mélangé avec HP/progression dans la capsule droite :
- `HP 2/3·1200`
- `4/10·1200`

Pas assez lisible. Le joueur ne distinguait pas facilement score et progression.

## Décision
Créer une capsule SCORE distincte. Layout 4 capsules.

## Layout final

### Géométrie (w=390px représentatif)
```
[universe ~78px] [    rule ~134px    ] [progress ~72px] [score ~84px]
     margin=5        gap=4 entre chaque capsule             margin=5
```

### Capsule univers (gauche)
- Largeur : `w × 0.20`
- Contenu : nom court de l'univers (ARCADE_FONT, accent color)
- Bordure accent

### Capsule règle (centre)
- Largeur : `w - 2×margin - 3×gap - leftW - progressW - scoreW`
- Contenu : rule text + hint (compactCenter, fitCenter auto-shrink)
- Bordure neutre

### Capsule progression/HP (nouveau)
- Largeur : `w × 0.185`
- Contenu : `4/10`, `HP 2/3`, `MAGIC 3/5`
- Bordure accent
- Auto-shrink si overflow

### Capsule score (nouveau, extrême droite)
- Largeur : `w × 0.215`
- Contenu : valeur numérique du score runtime (texte doré `#ffd700`)
- Bordure accent
- Auto-shrink si overflow (scores > 9999)

## Non-régression

| Zone | Statut |
|------|--------|
| gameplay | inchangé |
| score calculation | inchangée |
| HP boss | dans capsule progression, préfixe `HP ` conservé |
| progression | dans capsule progression, `quota` conservé |
| HUD sans ruban | 4 capsules flottantes, aucun bandeau plein largeur |

## Limites
- Capsule centre plus étroite (~134px vs ~176px avant) — géré par `fitCenter()`.
- Petits écrans (< 320px) : capsule centre à ~106px, peut tronquer règles très longues.
- Validation mobile réelle non effectuée — à confirmer sur device.
