# 926 Mobile-Ready Compliance Audit

Date: 2026-05-20

## Files Audited

- `src/main.ts`
- `src/scenes/BootScene.ts`
- `src/scenes/TitleScene.ts`
- `src/scenes/WorldMapScene.ts`
- `src/scenes/LevelIntroScene.ts`
- `src/scenes/GameScene.ts`
- `src/scenes/ClearScene.ts`
- `src/scenes/GameOverScene.ts`
- `src/render/GridRenderer.ts`
- `src/render/HUDRenderer.ts`
- `src/render/ObstacleRenderer.ts`
- `src/render/PickupRenderer.ts`
- `src/render/SnakeRenderer.ts`
- `src/render/UniverseFrameRenderer.ts`
- `src/render/VfxUtils.ts`
- `src/systems/InputSystem.ts`
- `src/systems/DesignBoardManager.ts`
- `src/systems/SaveSystem.ts`
- `src/config/constants.ts`
- `src/config/levels.ts`
- `src/config/mapNodes.ts`
- `src/config/universes.ts`
- `src/config/types.ts`
- `package.json`
- `vite.config.ts`
- `tsconfig.json`

## Global Score

Mobile-ready score: **78 / 100**

The game is broadly playable in portrait and already includes several mobile-first patches: responsive Phaser resize, readable UI font for functional text, 46-56 px primary buttons, native swipe input, listener cleanup, frame-aware grid sizing, and renderer settings that favor text clarity. It is not fully compliant yet because World Map launch is still double-tap based, several title/map labels are below comfortable mobile text size, and retry/clear transitions add avoidable waiting.

## P0 / P1 / P2 Summary

No P0 blocker found.

P1 issues:

- World Map requires tap selection plus double tap to launch. This is hard to discover because selection text is hidden off-screen.
- `WorldMapScene` hit targets are acceptable, but there is no visible primary action within one second after selecting a node.
- `TitleScene`, `WorldMapScene`, and some clear/game-over labels still use 5-8 px arcade text for functional or status copy.
- `GameScene` back-to-map text at the bottom is only 8 px and has a small implicit hit area.

P2 issues:

- Mixed English and French remains visible: `TAP TO START`, `WORLD MAP`, `RETRY`, `NEXT LEVEL`, `GAME OVER`, `BOSS DEFEATED`.
- Retry and clear flows have 400-800 ms of flash/fade delay before the next actionable screen.
- Sparkles and title stars use random placement, so visual QA screenshots are not deterministic.
- `WorldMapScene` pinch listeners use passive touch move, so browser zoom/scroll behavior should be tested on real Android Chrome.

## Scene Compliance

Conformant or mostly conformant:

- `LevelIntroScene`: primary action is visible, button height is mobile-ready, text uses `UI_FONT` for rules/hints.
- `GameScene`: grid priority is strong, swipe input is low latency, render loop avoids large per-frame allocations.
- `GameOverScene`: retry button is prominent and thumb-sized.
- `ClearScene`: next action is visible and buttons are thumb-sized.

Non-conformant or partially conformant:

- `TitleScene`: readable as a title screen, but functional copy is small and English-only.
- `WorldMapScene`: interaction model is the main weak point; double tap is hidden and node selection feedback is too subtle.

## Typography

- P1: `WorldMapScene` creates hidden `selLevelTxt` and `selRuleTxt`; the visible map relies on source-map labels and tiny hit highlights.
- P1: `TitleScene` uses 6-7 px arcade copy for stats/version. This is marginal on 360 px wide Android screens.
- P1: `GameScene` uses `'< MAP'` at 8 px for a functional navigation control.
- P2: `ClearScene` boss badge uses 7 px arcade text.
- Pass: `LevelIntroScene`, `HUDRenderer`, `GameOverScene`, and main clear text use `UI_FONT` or large enough title treatment for functional readability.

## Touch Ergonomics

- Pass: Shared `addMobileButton` uses 46-56 px heights, centered layout, and pressed states.
- Pass: Gameplay swipe threshold is 18 px and fires on move, which is responsive for Snake.
- P1: World Map has no explicit launch button after selecting a node. Double tap works but is less reliable when drag/pan is also present.
- P1: `GameScene` bottom map control should use `addMobileButton` or a larger zone.
- P2: Drag threshold differs between `WORLD_MAP_VIEW.DRAG_THRESHOLD_PX` and the local hardcoded `5` in `WorldMapScene`.

## Performance Android

- Pass: `GameScene` keeps grid static with a dirty flag, parses colors in `create()`, and limits logic to fixed ticks.
- Pass: `InputSystem.destroy()` and `WorldMapScene.doShutdown()` remove listeners.
- Pass: `HUDRenderer.update()` skips unchanged text assignments.
- P2: `ClearScene` uses a timed sparkle redraw for 50 repeats. It is limited, but should be profiled on low-end Android.
- P2: `TitleScene` star positions are generated every scene create. This is acceptable, but deterministic QA would be easier with seeded positions.

## Layout / Fit

- Pass: `computeGridLayout()` reserves HUD and bottom space and the frame-aware width table keeps ornate frames from swallowing the grid.
- Pass: `UniverseFrameRenderer` maps full-frame inner rects per universe instead of stretching one layout.
- P1: Small viewport checks should specifically cover 360 x 640, 390 x 844, and 430 x 932. No automated screenshot harness is present.
- P2: `LevelIntroScene` has dense vertical text on shorter phones; it is likely playable, but should be screenshot-verified with long localized strings.

## Recommended Patches

1. Add a visible World Map footer with selected level name and a 56 px `JOUER` button; keep double tap as a shortcut only.
2. Replace `GameScene` bottom `'< MAP'` text with a proper mobile button or a 44 px hit zone.
3. Raise functional arcade text floors to at least 10-11 px, especially title stats, debug-excluded map hints, and boss badges.
4. Localize visible action labels consistently: `JOUER`, `REESSAYER`, `CARTE`, `NIVEAU SUIVANT`.
5. Add a lightweight Playwright or Phaser screenshot QA script for 360, 390, and 430 px portrait viewports.
6. Harmonize World Map drag threshold with `WORLD_MAP_VIEW.DRAG_THRESHOLD_PX`.
7. Shorten retry and next-level transition waits by roughly 200-300 ms.

## Questions / Blockers

- No real Android Chrome preview was run in this audit.
- No automated mobile screenshot harness exists yet.
- The source World Map image carries some labels directly; visual text quality depends partly on that raster asset, not only Phaser text.
