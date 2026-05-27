# 990 V3 — Castle Quick Wins

## Added in V3

These were added because they are useful without forcing a major gameplay redesign:

| Function | Icon | Use |
|---|---:|---|
| key / unlock | 🗝️ | unlock, Castle key, gate condition |
| pause | ⏸️ | pause button |
| shield | 🛡️ | temporary protection / power-up placeholder |
| bonus/perfect | 🌟 / ⭐ | perfect, bonus, reward feedback |
| play/continue | ▶️ | start/continue button icon |
| home/menu | 🏠 | return to menu |
| door/gate | 🚪 | Castle gate/door obstacle or objective |
| boss reward | 👑 | world clear / boss reward |

---

# Important

Adding icons does not mean the mechanics must be implemented immediately.

Examples:
- `shield` can exist in registry before shield mechanics exist;
- `key` can be used as unlock symbol before key collection exists;
- `door` can be a visual obstacle before becoming an actual lock/gate mechanic.

Do not create mechanics just to use icons.

---

# Recommended immediate use

Use immediately:
```txt
pause
play
home
key/unlock
bonus/perfect
```

Use after gameplay validation:
```txt
shield
door/gate
```
