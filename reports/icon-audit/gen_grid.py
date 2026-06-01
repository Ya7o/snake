import json, os

DATA = '/home/kali/apps/snake/reports/icon-audit/docs/icon-audit-data.json'
OUT = '/home/kali/apps/snake/reports/icon-audit/docs/icon-audit-grid.html'

with open(DATA) as f:
    data = json.load(f)
assets = data['assets']
sm = data['summary']
lk = {(a['universe'], a['iconType']): a for a in assets}

U = ['castle','sonic','streets','fighter','outrun','shinobi','kombat','paperboy']
CT = ['pickup_main','pickup_bonus','obstacle_normal','boss_idle','boss_attack']
SEV_BG = {'OK':'#27ae60','Mineur':'#f39c12','Moyen':'#e67e22','Critique':'#e74c3c'}
SEV_FG = {'OK':'#fff','Mineur':'#000','Moyen':'#fff','Critique':'#fff'}
UC = {'castle':'#9b59b6','sonic':'#3498db','streets':'#e67e22','fighter':'#e74c3c',
      'outrun':'#ff6b9d','shinobi':'#00b4d8','kombat':'#c0392b','paperboy':'#27ae60'}
US = {'castle':'SVG/OpenMoji','sonic':'Zone des Anneaux','streets':'Bagarre en Ruelle',
      'fighter':'Dojo des Guerriers','outrun':'Autoroute du Soleil','shinobi':'Temple des Neiges',
      'kombat':'Arene des Enfers','paperboy':'Tournee du Matin'}

def rp(u, fn):
    return '../../../public/assets/runtime/universes/' + u + '/' + fn

def mk(a):
    if a is None:
        return '<td style=border:1px
