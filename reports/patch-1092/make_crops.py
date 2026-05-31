"""
PATCH 1092 - Generate crops from already-captured full screenshots.
Uses PIL to crop regions from the 390x844 CSS-pixel screenshots (stored at 2x = 780x1688).
"""
from PIL import Image
import os

BASE = os.path.dirname(__file__)
SS = os.path.join(BASE, 'screenshots')
CROP = os.path.join(SS, 'crops')
os.makedirs(CROP, exist_ok=True)

# Device scale factor was 2, so all screenshots are 780x1688 pixels.
# CSS coordinates * 2 = physical pixel coordinates.
SCALE = 2

def crop_save(src_name, dst_name, css_box):
    """css_box = (left, top, right, bottom) in CSS pixels."""
    src = os.path.join(SS, src_name)
    if not os.path.exists(src):
        print(f'MISSING: {src_name}')
        return
    with Image.open(src) as im:
        px_box = tuple(int(v * SCALE) for v in css_box)
        region = im.crop(px_box)
        dst = os.path.join(CROP, dst_name)
        region.save(dst)
        print(f'  {dst_name}  ({region.size[0]}x{region.size[1]})')

universes = ['castle', 'sonic', 'streets', 'fighter', 'outrun', 'shinobi', 'kombat', 'paperboy']

print('=== HUD crops (top 60px) ===')
for u in universes:
    crop_save(f'{u}_gameplay.png', f'{u}_hud_crop.png', (0, 0, 390, 60))

print('\n=== Grid crops (y=60 to y=580) ===')
for u in universes:
    crop_save(f'{u}_gameplay.png', f'{u}_grid_crop.png', (0, 60, 390, 580))

print('\n=== Pickup detail crops (center area) ===')
# Pickup items appear in the grid center - crop ~200x200 area around center
for u in universes:
    crop_save(f'{u}_gameplay.png', f'{u}_pickup_crop.png', (95, 250, 295, 450))

print('\n=== Boss grid crops ===')
for u in ['castle', 'sonic', 'fighter', 'outrun', 'kombat', 'paperboy']:
    src = f'{u}_boss.png'
    if os.path.exists(os.path.join(SS, src)):
        crop_save(src, f'{u}_boss_grid_crop.png', (0, 60, 390, 580))

print('\n=== Snake detail crops (right side of grid where snake spawns) ===')
for u in universes:
    # Snake spawns around col 12-14, row 10 → x ≈ 280-350, y ≈ 300-380
    crop_save(f'{u}_gameplay.png', f'{u}_snake_crop.png', (240, 280, 390, 430))

print('\nDone.')
