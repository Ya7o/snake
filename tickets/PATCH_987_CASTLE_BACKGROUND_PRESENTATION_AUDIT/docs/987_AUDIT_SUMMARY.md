# 987 — Audit Summary

## Short conclusion

The problem is no longer “the Castle images are bad”.

The problem is that the runtime layout does not respect the images.

If you miss this distinction, you keep producing new images when the code should change.

## Main findings

### Intro / stage card
The background should be the emotional anchor, and UI must float above it with discipline.

### Gameplay
Gameplay is the biggest offender.
The current board is too dominant vertically and horizontally, leaves too little room for the environment art, and forces the HUD to be a blunt strip.

### Game Over / Stage Clear
The result screens benefit strongly from the background art, but they still risk covering too much of the image with heavy containers if left unchecked.

### Typography
The typography is serviceable but not yet systematized.

## Strategic decision

The next implementation pass should define:

```txt
1. full-screen background behavior,
2. safe UI zones,
3. gameplay board occupancy,
4. HUD minimalism,
5. font hierarchy.
```
