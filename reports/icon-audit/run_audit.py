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
