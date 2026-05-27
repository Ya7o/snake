# 992 — Audio Policy V1

## Rule

Audio V1 is functional feedback, not final sound design.

Use sounds to make the prototype feel responsive.

---

# Use now

```txt
pickup_magic.wav
collision_hit.wav
stage_clear.wav
ui_button.wav
danger_alert.wav
```

---

# Do not use yet

```txt
boss_event.wav
bonus_pickup.wav
shield_pickup.wav
key_unlock.wav
```

Reason:
These imply mechanics that are not necessarily active yet.

---

# Global vs Castle

For V1:

| Scope | Sounds |
|---|---|
| Global | `collision_hit`, `stage_clear`, `ui_button` |
| Castle | `pickup_magic`, `danger_alert` |

Later, other universes can override pickup/danger sounds while keeping global UI/collision feedback.
