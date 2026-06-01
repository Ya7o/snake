#!/usr/bin/env python3
import json, os, sys
try:
    from PIL import Image
    import numpy as np
except ImportError as e:
    print(f'Missing: {e}', file=sys.stderr); sys.exit(1)

def analyze_icon(path, universe, icon_type):
    try:
        img = Image.open(path)
        w, h = img.size
        has_alpha = img.mode in ('RGBA','LA') or (img.mode=='P' and 'transparency' in img.info)
        if img.mode != 'RGBA': img = img.convert('RGBA')
        arr = np.array(img)
        alpha = arr[:,:,3]
        opaque = alpha > 10
        coverage = float(opaque.sum()) / (w*h)
        rows = np.any(opaque, axis=1)
        cols = np.any(opaque, axis=0)
        if rows.any():
            top = int(np.argmax(rows))
            bottom = int(h - 1 - np.argmax(rows[::-1]))
            left = int(np.argmax(cols))
            right = int(w - 1 - np.argmax(cols[::-1]))
            bbox = {'x':left,'y':top,'w':right-left+1,'h':bottom-top+1}
            center_x = (left+right)/2; center_y = (top+bottom)/2
            dx = round(center_x - w/2, 1); dy = round(center_y - h/2, 1)
        else:
            bbox = {'x':0,'y':0,'w':0,'h':0}; dx=dy=0; top=0;bottom=h;left=0;right=w
        margins = {'left':left,'right':w-1-right,'top':top,'bottom':h-1-bottom}
        margin_pct = {k:round(v/max(w,h)*100,1) for k,v in margins.items()}
        small = img.resize((32,32), Image.NEAREST)
        colors = len(set(small.getdata()))
        suspected_pixel_art = colors < 50
        suspected_blur = (w>256 and w!=h) or (w==h and w>512)
        corners = [arr[0,0],arr[0,-1],arr[-1,0],arr[-1,-1]]
        bg_contamination = any(c[3]>50 and not all(c[:3]<20) and not all(c[:3]>235) for c in corners)
        max_margin_pct = max(margin_pct.values())
        abs_offset = max(abs(dx), abs(dy))
        if not has_alpha or bg_contamination: severity='Critique'
        elif max_margin_pct>30 or abs_offset>w*0.15 or coverage<0.2: severity='Moyen'
        elif max_margin_pct>15 or abs_offset>w*0.08: severity='Mineur'
        else: severity='OK'
        notes=[]
        if not has_alpha: notes.append('Pas de canal alpha')
        if bg_contamination: notes.append('Fond parasite detecte dans les coins')
        if max_margin_pct>30: notes.append(f'Grande marge transparente ({max_margin_pct:.0f}%)')
        if coverage<0.2: notes.append(f'Couverture opaque tres faible ({coverage:.1%})')
        if abs_offset>w*0.1: notes.append(f'Sujet decentre (dx={dx}, dy={dy})')
        if suspected_pixel_art: notes.append('Pixel art suspecte')
        if suspected_blur: notes.append('Upscale/flou suspecte')
        return {'path':path,'universe':universe,'iconType':icon_type,'dimensions':{'w':w,'h':h},'hasAlpha':bool(has_alpha),'boundingBox':bbox,'opaqueCoverageRatio':round(coverage,3),'transparentMargins':margins,'transparentMarginsPct':margin_pct,'centerOffset':{'dx':dx,'dy':dy},'suspectedPixelArt':suspected_pixel_art,'suspectedBlur':suspected_blur,'backgroundContamination':bg_contamination,'severity':severity,'notes':'; '.join(notes) if notes else 'RAS'}
    except Exception as e:
        return {'path':path,'universe':universe,'iconType':icon_type,'error':str(e),'severity':'Critique','notes':f'Erreur analyse: {e}'}

BASE = os.path.expanduser('~/apps/snake/public/assets/runtime/universes')
ASSET_MAP = [
    ('sonic','pickup_main',f'{BASE}/sonic/pickup_ring.png'),
    ('sonic','pickup_bonus',f'{BASE}/sonic/pickup_secondary.png'),
    ('sonic','obstacle_normal',f'{BASE}/sonic/obstacle_bumper.png'),
    ('sonic','boss_idle',f'{BASE}/sonic/boss_loop_serpent.png'),
    ('streets','pickup_main',f'{BASE}/streets/pickup_street_bonus.png'),
    ('streets','pickup_bonus',f'{BASE}/streets/pickup_secondary.png'),
    ('streets','obstacle_normal',f'{BASE}/streets/obstacle_crowd.png'),
    ('streets','boss_idle',f'{BASE}/streets/boss_idle.png'),
    ('streets','boss_attack',f'{BASE}/streets/boss_attack.png'),
    ('fighter','pickup_main',f'{BASE}/fighter/pickup_energy.png'),
    ('fighter','pickup_bonus',f'{BASE}/fighter/pickup_secondary.png'),
    ('fighter','obstacle_normal',f'{BASE}/fighter/obstacle_charge_marker.png'),
    ('fighter','boss_idle',f'{BASE}/fighter/boss_idle.png'),
    ('fighter','boss_attack',f'{BASE}/fighter/boss_attack.png'),
    ('outrun','pickup_main',f'{BASE}/outrun/pickup_checkpoint.png'),
    ('outrun','pickup_bonus',f'{BASE}/outrun/pickup_secondary.png'),
    ('outrun','obstacle_normal',f'{BASE}/outrun/obstacle_car.png'),
    ('outrun','boss_idle',f'{BASE}/outrun/boss_idle.png'),
    ('outrun','boss_attack',f'{BASE}/outrun/boss_attack.png'),
    ('shinobi','pickup_main',f'{BASE}/shinobi/pickup_shuriken.png'),
    ('shinobi','pickup_bonus',f'{BASE}/shinobi/pickup_secondary.png'),
    ('shinobi','obstacle_normal',f'{BASE}/shinobi/obstacle_decoy.png'),
    ('shinobi','boss_idle',f'{BASE}/shinobi/boss_shadow_ninja.png'),
    ('kombat','pickup_main',f'{BASE}/kombat/pickup_finish_token.png'),
    ('kombat','pickup_bonus',f'{BASE}/kombat/pickup_secondary.png'),
    ('kombat','obstacle_normal',f'{BASE}/kombat/obstacle_fatal_zone.png'),
    ('kombat','boss_idle',f'{BASE}/kombat/boss_idle.png'),
    ('kombat','boss_attack',f'{BASE}/kombat/boss_attack.png'),
    ('paperboy','pickup_main',f'{BASE}/paperboy/pickup_newspaper.png'),
    ('paperboy','pickup_bonus',f'{BASE}/paperboy/pickup_secondary.png'),
    ('paperboy','obstacle_normal',f'{BASE}/paperboy/obstacle_dog.png'),
    ('paperboy','boss_idle',f'{BASE}/paperboy/boss_neighborhood_chaos.png'),
    ('paperboy','mailbox',f'{BASE}/paperboy/mailbox.png'),
]
results=[]
for universe,icon_type,path in ASSET_MAP:
    print(f'  {universe}/{icon_type} -> {os.path.basename(path)}')
    results.append(analyze_icon(path,universe,icon_type))
total=len(results)
critique=sum(1 for r in results if r.get('severity')=='Critique')
moyen=sum(1 for r in results if r.get('severity')=='Moyen')
mineur=sum(1 for r in results if r.get('severity')=='Mineur')
ok=sum(1 for r in results if r.get('severity')=='OK')
print(f'Summary: {total} assets | Critique={critique} Moyen={moyen} Mineur={mineur} OK={ok}')
out_path=os.path.expanduser('~/apps/snake/reports/icon-audit/docs/icon-audit-data.json')
with open(out_path,'w',encoding='utf-8') as f:
    json.dump({'summary':{'total':total,'critique':critique,'moyen':moyen,'mineur':mineur,'ok':ok},'assets':results},f,indent=2,ensure_ascii=False)
print(f'Written: {out_path}')

# ─────────────────────────────────────────────────────────────────────────────
# GENERATE HTML GRID + MARKDOWN REPORT
# ─────────────────────────────────────────────────────────────────────────────
import json as _json
_data = _json.loads(open(out_path).read())
_assets = _data["assets"]
_sm = _data["summary"]
_lk = {(a["universe"], a["iconType"]): a for a in _assets}

_UNIVERSES = ["castle","sonic","streets","fighter","outrun","shinobi","kombat","paperboy"]
_UC = {"castle":"#9b59b6","sonic":"#3498db","streets":"#e67e22","fighter":"#e74c3c","outrun":"#ff6b9d","shinobi":"#00b4d8","kombat":"#c0392b","paperboy":"#27ae60"}
_US = {"castle":"SVG/OpenMoji","sonic":"Zone des Anneaux","streets":"Bagarre en Ruelle","fighter":"Dojo des Guerriers","outrun":"Autoroute du Soleil","shinobi":"Temple des Neiges","kombat":"Arene des Enfers","paperboy":"Tournee du Matin"}
_SC = {"OK":"badge-OK","Mineur":"badge-Mineur","Moyen":"badge-Moyen","Critique":"badge-Critique"}
_CT = ["pickup_main","pickup_bonus","obstacle_normal","boss_idle","boss_attack"]

def _rp(u, fn):
    return "../../../public/assets/runtime/universes/" + u + "/" + fn

def _mk(a):
    if a is None:
        return "<td class=icon-cell>N/A</td>"
    fn = os.path.basename(a["path"])
    u = a["universe"]
    p = _rp(u, fn)
    sv = a.get("severity","OK")
    sc = _SC.get(sv,"badge-OK")
    d = a.get("dimensions",{})
    bb = a.get("boundingBox",{})
    mp = a.get("transparentMarginsPct",{})
    co = a.get("centerOffset",{})
    cov = a.get("opaqueCoverageRatio",0)
    notes = a.get("notes","RAS")
    tip = (fn + "&#10;" + str(d.get("w",0)) + "x" + str(d.get("h",0))
           + " | alpha: " + ("yes" if a.get("hasAlpha") else "NO") + "&#10;"
           + "Coverage: " + "{:.1%}".format(cov) + "&#10;"
           + "BBox: " + str(bb.get("w",0)) + "x" + str(bb.get("h",0)) + "&#10;"
           + "Margins L" + str(mp.get("left",0)) + "% R" + str(mp.get("right",0))
           + "% T" + str(mp.get("top",0)) + "% B" + str(mp.get("bottom",0)) + "%&#10;"
           + "dx=" + str(co.get("dx",0)) + " dy=" + str(co.get("dy",0)) + "&#10;" + notes)
    img_html = ("<div class=bg-pair>"
                "<div class=icon-wrap><div class=light><img src=" + p + " style=width:64px;height:64px;object-fit:contain alt=></div></div>"
                "<div class=icon-wrap><div class=dark><img src=" + p + " style=width:64px;height:64px;object-fit:contain alt=></div></div>"
                "</div>")
    return ("<td class=icon-cell><div class=icon-pair>" + img_html + "</div>"
            "<span class="badge " + sc + "">" + sv + "<span class=tooltip-box>" + tip + "</span></span></td>")

print("Generating HTML grid...")

_SPECIAL = {"fighter":"fist.svg (sparZone)","outrun":"trophy.svg (checkpoint)"}
def _sp(u):
    if u == "paperboy":
        a = _lk.get(("paperboy","mailbox"))
        if a: return _mk(a)
    return "<td class=svg-cell>" + _SPECIAL.get(u,"--") + "</td>"

_rows = []
for u in _UNIVERSES:
    col = _UC.get(u,"#888")
    sub = _US.get(u,"")
    lbl = ("<td class=universe-label>" + u.upper()
           + "<br><span style=font-weight:normal;color:" + col + ";font-size:0.8em>" + sub + "</span></td>")
    if u == "castle":
        _rows.append("<tr>" + lbl + "<td class=svg-cell colspan=6>Castle: SVG/OpenMoji at 64x64. magic_star(pickup), gem(bonus), brick/stone/door(obstacles), fire(danger), crystal_ball/skull/crown(boss). Vector.</td></tr>")
    else:
        cells = "".join(_mk(_lk.get((u,ct))) for ct in _CT) + _sp(u)
        _rows.append("<tr>" + lbl + cells + "</tr>")

_css = ("body{font-family:monospace;background:#0d0d1a;color:#e0e0e0;margin:0;padding:16px}"
        "h1{color:#9b59b6}"
        "table{border-collapse:collapse;width:100%;font-size:0.72em}"
        "th{background:#1e1e3a;color:#9b59b6;padding:8px;border:1px solid #333;position:sticky;top:0}"
        "td{border:1px solid #333;padding:4px;text-align:center;vertical-align:middle}"
        ".universe-label{text-align:left;font-weight:bold;color:#f1c40f;background:#0a0820;padding:6px 10px;white-space:nowrap}"
        ".icon-cell{background:#111}.icon-pair{display:flex;flex-direction:column;align-items:center;gap:4px}"
        ".bg-pair{display:flex;gap:4px;justify-content:center}"
        ".light{background:#f0f0f0;padding:3px;border-radius:4px}.dark{background:#1a1a2e;padding:3px;border-radius:4px}"
        ".badge{display:inline-block;padding:2px 6px;border-radius:3px;font-size:0.7em;font-weight:bold;margin-top:3px;position:relative;cursor:help}"
        ".badge-OK{background:#27ae60;color:#fff}.badge-Mineur{background:#f39c12;color:#000}"
        ".badge-Moyen{background:#e67e22;color:#fff}.badge-Critique{background:#e74c3c;color:#fff}"
        ".svg-cell{color:#666;font-size:0.7em;padding:8px}"
        ".tooltip-box{display:none;position:absolute;z-index:100;background:#1a1a2e;border:1px solid #9b59b6;"
        "padding:8px;border-radius:6px;font-size:0.75em;text-align:left;width:220px;"
        "bottom:120%;left:50%;transform:translateX(-50%);color:#e0e0e0;white-space:pre-wrap}"
        ".badge:hover .tooltip-box{display:block}")

_html = ("<!DOCTYPE html><html lang=fr><head><meta charset=UTF-8>"
         "<title>Icon Audit Grid</title><style>" + _css + "</style></head><body>"
         "<h1>SNAKE DRIVE V4 - ICON AUDIT GRID</h1>"
         "<p style=color:#888;font-size:0.8em>2026-05-31 | PNG assets (Castle=SVG) | "
         + str(_sm["total"]) + " assets | OK:" + str(_sm["ok"]) + " Mineur:" + str(_sm["mineur"]) + " Moyen:" + str(_sm["moyen"]) + " Critique:" + str(_sm["critique"]) + "</p>"
         "<table><thead><tr><th>Universe</th><th>pickup_main</th><th>pickup_bonus</th>"
         "<th>obstacle_normal</th><th>boss_idle</th><th>boss_attack</th><th>special</th></tr></thead>"
         "<tbody>" + "
".join(_rows) + "</tbody></table>"
         "<div style=margin-top:20px;padding:12px;background:#1a1a2e;border-radius:6px;font-size:0.78em;color:#aaa>"
         "Notes: Castle=SVG/OpenMoji (vector). 17/33 PNGs are 1254x1254 (upscale flag). "
         "All pickup_secondary=32x32 pixel art. Outrun car sprites have ~25% top/bottom margins by design. "
         "Shinobi pickup_secondary=only MOYEN issue (16.8% coverage).</div>"
         "</body></html>")

_html_path = out_path.replace("icon-audit-data.json", "icon-audit-grid.html")
with open(_html_path, "w", encoding="utf-8") as _f:
    _f.write(_html)
print("HTML written:", _html_path)
