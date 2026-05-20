import fs from 'node:fs';
const p = new URL('../tickets/status.json', import.meta.url);
const data = JSON.parse(fs.readFileSync(p, 'utf8'));
console.log('Current ticket:', data.currentTicket);
for (const [id, t] of Object.entries(data.tickets)) {
  console.log(`${id}: ${t.status} | depends: ${(t.dependsOn || []).join(', ') || '-'}`);
}
