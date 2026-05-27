# 989 — Icon Mapping

## Purpose

This mapping is intentionally simple and V1-friendly.

Exact OpenMoji SVG filenames must be verified after cloning OpenMoji. Filenames are usually codepoint-based.

---

# World tokens

| World | Preferred OpenMoji | Fallback |
|---|---|---|
| castle | castle 🏰 | crystal ball 🔮 / sparkles ✨ |
| speed | ring 💍 | high voltage ⚡ / cyclone 🌀 |
| streets | cityscape at dusk 🌆 | brick 🧱 |
| fighter | martial arts uniform 🥋 | oncoming fist 👊 |
| outrun | automobile 🚗 | sunset 🌅 / motorway 🛣️ |
| shinobi | ninja 🥷 | crescent moon 🌙 |
| kombat | dragon 🐉 | fire 🔥 |
| paperboy | rolled-up newspaper 🗞️ | mailbox 📫 / bicycle 🚲 |

---

# HUD icons

| HUD concept | Preferred icon | Fallback |
|---|---|---|
| magic tokens | sparkles ✨ | gem stone 💎 |
| boss | skull 💀 | dragon 🐉 |
| danger | warning ⚠️ | fire 🔥 |
| stage | flag 🚩 | map 🗺️ |
| clear | trophy 🏆 | sparkles ✨ |
| retry | anticlockwise arrows 🔄 | counterclockwise arrows button 🔁 |

---

# Pickup icons

| Pickup | Preferred icon | Fallback |
|---|---|---|
| magic star | sparkles ✨ | glowing star 🌟 |
| light orb | crystal ball 🔮 | glowing star 🌟 |
| mirror shard | gem stone 💎 | diamond 🔹 |
| ring | ring 💍 | coin 🪙 |
| newspaper | rolled-up newspaper 🗞️ | newspaper 📰 |
| turbo | high voltage ⚡ | rocket 🚀 |

---

# Implementation note

After cloning OpenMoji, use metadata/search to locate actual codepoint SVGs under:

```txt
/tmp/openmoji/color/svg/
```

Copy them with semantic names.
