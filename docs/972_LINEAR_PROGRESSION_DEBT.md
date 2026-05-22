# 972 - Linear Progression Debt

Snake Drive V4 currently uses `MAP_NODES` order as the campaign progression source.

Accepted Phase 1/2 behavior:

- fresh save unlocks only `node_1`;
- clearing a level unlocks the next node in `MAP_NODES`;
- cleared and unlocked nodes stay preserved by the save sanitizer;
- locked nodes cannot launch from the World Map.

This is intentional technical debt for the Phase 2 vertical slice. Do not add branching progression, graph traversal, world gates, or alternate routes until after the vertical slice is stable.

If branching is added later, replace the array-order lookup in `GameScene.triggerClear()` with explicit `nextNodeId` or child-node data on map nodes, then update QA to validate the graph.
