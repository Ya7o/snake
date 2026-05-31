import json, os
DATA_PATH = '/home/kali/apps/snake/reports/icon-audit/docs/icon-audit-data.json'
OUT_PATH = '/home/kali/apps/snake/reports/icon-audit/docs/icon-audit-grid.html'
with open(DATA_PATH) as f: data = json.load(f)
print('loaded', len(data['assets']), 'assets')
