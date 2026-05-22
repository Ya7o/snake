# 987 — Font / Sprite Audit

## Typography principle

Do not use one font style for every role with only size changes.

## Recommended font roles

### 1. Display / Universe titles
Use for:
- `CASTLE OF ILLUSION`
- `STAGE CLEAR`
- `PERDU`

Behavior:
- bold pixel display style;
- uppercase;
- thick enough for mobile;
- 1–2 px outline/shadow equivalent.

### 2. UI label font
Use for:
- `OBJECTIF`
- `DANGER`
- `STAGE 1`
- `MAGIC 0/10`

### 3. Button font
Use for:
- `JOUER`
- `CARTE`
- `REJOUER`
- `CONTINUER`

### 4. Body/helper text
Use for short explanatory lines.

## Suggested size hierarchy

```txt
Display Title:    26–34 px equivalent
Major Result:     30–40 px equivalent
Panel Heading:    18–24 px equivalent
HUD Labels:       14–18 px equivalent
Body Text:        14–16 px equivalent
Button Labels:    18–22 px equivalent
```

## Sprite audit

### Snake sprite
Readable enough, but cell downsizing must not make the face unreadable.

### Pickup sprite
Must remain brighter than the grid and clearly outlined.

### Grid lines
If cells get smaller, reduce line contrast slightly if the grid becomes too noisy.
