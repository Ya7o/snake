# 990 V3 — Obstacle / Danger / Boss Binding

## Castle V1 binding

```txt
obstacle fixed  -> 🧱 brick
obstacle alt    -> 🪨 stone
door/gate       -> 🚪 door
danger          -> 🔥 fire
warning         -> ⚠️ warning
boss event      -> 🔮 crystal ball / portal
boss danger     -> 💀 skull
boss reward     -> 👑 crown
```

## Use cases

### Obstacle

A cell that blocks or kills depending on current rules.

V1:
```txt
🧱 brick
```

### Danger

A temporary or lethal cell.

V1:
```txt
🔥 fire
⚠️ warning
```

### Boss event

A signal, not necessarily a boss character.

V1:
```txt
🔮 portal/orb
💀 boss danger
👑 reward
```

Do not implement new boss mechanics just because these icons exist.
