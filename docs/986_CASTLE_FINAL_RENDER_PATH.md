# 986 Castle Final Render Path

## Gameplay

Castle gameplay is owned by runtime rendering, not by the legacy full-frame asset.

Layer order:

```txt
0   background fill
1   castle_gameplay_bg.png
10  runtime board panel and shadow
30  runtime grid background, grid lines, and border
40  hazards, pickups, snake, and boss objects
70  gameplay FX
80  runtime HUD strip
90  runtime HUD text
110 screen FX and scanlines
```

`GameScene` skips `UniverseFrameRenderer` for Castle. This prevents the old baked
header, score zones, red/blue bars, or decorative full-frame UI from appearing in
gameplay. Other universes keep the existing frame path.

Castle visual identity now comes from:

- `assets/ui/castle/castle_gameplay_bg.png`
- `drawCastleRuntimeBoardPanel()`, with an intentionally visible gold/violet
  runtime frame around the board
- the runtime grid border
- `HUDRenderer`

## HUD

`HUDRenderer` owns the gameplay HUD for Castle.

The shared HUD height is `GAMEPLAY_HUD.HEIGHT` in `src/ui/RuntimeUILayout.ts`.
Castle does not pass `hud_panel.png` into `HUDRenderer`, so no legacy HUD image is
drawn over or under the runtime strip.

Normal Castle HUD:

```txt
CASTLE      STAGE 1      MAGIC 0/10
```

Castle boss HUD:

```txt
CASTLE BOSS      BOSS      BOSS HP 2/3
```

## Result Screens

Castle result screens use background images plus editable runtime text and
buttons.

- Game Over uses `assets/ui/castle/castle_game_over_bg.png`.
- Stage Clear and Boss Clear use `assets/ui/castle/castle_clear_bg.png`.
- `GameOverScene` and `ClearScene` share `RESULT_SCREEN_LAYOUT`.
- Each Castle result path draws one primary button and one secondary `CARTE`
  button. No third action slot is drawn.
- Castle skips `drawConsoleFrame()` on result screens to avoid old lower panel
  artifacts.

## Debug

Add `?debugLayers=1` to the URL while running Castle gameplay. It logs the active
Castle render contract in the browser console and confirms that the legacy frame
is skipped. It does not draw UI and has no effect without the query parameter.
