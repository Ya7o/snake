/**
 * build-design-assets.mjs
 * Pipeline : design_boards/BOARD_MAPPING.json → public/assets/universes/[id]/ → manifest
 * Génère des assets PNG procéduraux thématiques. Aucune dépendance externe (Node zlib intégré).
 */

import { deflateSync } from 'zlib';
import { readFileSync, writeFileSync, mkdirSync, existsSync, copyFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

// ─── PNG encoder minimal (pure Node, pas de dépendance) ───────────────────────

const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    t[n] = c;
  }
  return t;
})();

function crc32(buf) {
  let c = 0xFFFFFFFF;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xFF] ^ (c >>> 8);
  return (c ^ 0xFFFFFFFF) >>> 0;
}

function pngChunk(type, data) {
  const typeBytes = Buffer.from(type, 'ascii');
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length, 0);
  const crcBuf = Buffer.alloc(4); crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBytes, data])), 0);
  return Buffer.concat([len, typeBytes, data, crcBuf]);
}

/**
 * Encode un PNG RGBA depuis une fonction getPixel(x, y) → [r, g, b, a]
 */
function encodePNG(width, height, getPixel) {
  const SIG = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0); ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; ihdr[9] = 6; // RGBA

  const raw = [];
  for (let y = 0; y < height; y++) {
    raw.push(0); // filter: None
    for (let x = 0; x < width; x++) {
      const px = getPixel(x, y);
      raw.push(px[0] & 0xFF, px[1] & 0xFF, px[2] & 0xFF, px[3] === undefined ? 255 : px[3] & 0xFF);
    }
  }

  return Buffer.concat([SIG, pngChunk('IHDR', ihdr), pngChunk('IDAT', deflateSync(Buffer.from(raw))), pngChunk('IEND', Buffer.alloc(0))]);
}

// ─── Helpers dessin pixel art ─────────────────────────────────────────────────

function hexToRgb(hex) {
  const h = hex.replace('#', '');
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

/** Canvas virtuel 2D — accumule des primitives, rend en PNG */
class PixelCanvas {
  constructor(w, h) {
    this.w = w; this.h = h;
    this.data = new Uint8Array(w * h * 4); // RGBA
  }

  _idx(x, y) { return (Math.round(y) * this.w + Math.round(x)) * 4; }

  clear(r = 0, g = 0, b = 0, a = 0) {
    for (let i = 0; i < this.w * this.h * 4; i += 4) {
      this.data[i] = r; this.data[i + 1] = g; this.data[i + 2] = b; this.data[i + 3] = a;
    }
  }

  setPixel(x, y, r, g, b, a = 255) {
    if (x < 0 || x >= this.w || y < 0 || y >= this.h) return;
    const i = this._idx(x, y);
    this.data[i] = r; this.data[i + 1] = g; this.data[i + 2] = b; this.data[i + 3] = a;
  }

  fillRect(x, y, w, h, r, g, b, a = 255) {
    for (let dy = 0; dy < h; dy++)
      for (let dx = 0; dx < w; dx++)
        this.setPixel(x + dx, y + dy, r, g, b, a);
  }

  strokeRect(x, y, w, h, r, g, b, a = 255) {
    for (let dx = 0; dx < w; dx++) {
      this.setPixel(x + dx, y, r, g, b, a);
      this.setPixel(x + dx, y + h - 1, r, g, b, a);
    }
    for (let dy = 0; dy < h; dy++) {
      this.setPixel(x, y + dy, r, g, b, a);
      this.setPixel(x + w - 1, y + dy, r, g, b, a);
    }
  }

  fillCircle(cx, cy, radius, r, g, b, a = 255) {
    const r2 = radius * radius;
    for (let dy = -radius; dy <= radius; dy++)
      for (let dx = -radius; dx <= radius; dx++)
        if (dx * dx + dy * dy <= r2)
          this.setPixel(cx + dx, cy + dy, r, g, b, a);
  }

  strokeCircle(cx, cy, radius, thickness, r, g, b, a = 255) {
    const outer = (radius + thickness) * (radius + thickness);
    const inner = (radius - thickness) * (radius - thickness);
    for (let dy = -(radius + thickness); dy <= radius + thickness; dy++)
      for (let dx = -(radius + thickness); dx <= radius + thickness; dx++) {
        const d2 = dx * dx + dy * dy;
        if (d2 >= inner && d2 <= outer) this.setPixel(cx + dx, cy + dy, r, g, b, a);
      }
  }

  fillDiamond(cx, cy, size, r, g, b, a = 255) {
    for (let dy = -size; dy <= size; dy++)
      for (let dx = -size; dx <= size; dx++)
        if (Math.abs(dx) + Math.abs(dy) <= size)
          this.setPixel(cx + dx, cy + dy, r, g, b, a);
  }

  fillTriangle(x1, y1, x2, y2, x3, y3, r, g, b, a = 255) {
    const minY = Math.floor(Math.min(y1, y2, y3));
    const maxY = Math.ceil(Math.max(y1, y2, y3));
    for (let py = minY; py <= maxY; py++) {
      const xs = [];
      const edges = [[x1, y1, x2, y2], [x2, y2, x3, y3], [x3, y3, x1, y1]];
      for (const [ax, ay, bx, by] of edges) {
        if ((ay <= py && by > py) || (by <= py && ay > py)) {
          xs.push(ax + (py - ay) / (by - ay) * (bx - ax));
        }
      }
      if (xs.length >= 2) {
        xs.sort((a, b) => a - b);
        for (let px = Math.floor(xs[0]); px <= Math.ceil(xs[1]); px++)
          this.setPixel(px, py, r, g, b, a);
      }
    }
  }

  toPNG() {
    const d = this.data;
    return encodePNG(this.w, this.h, (x, y) => {
      const i = (y * this.w + x) * 4;
      return [d[i], d[i + 1], d[i + 2], d[i + 3]];
    });
  }
}

// ─── Dessinateurs d'icônes thématiques 32×32 ─────────────────────────────────

const ICON_SIZE = 32;

function drawRing(c, [r, g, b]) {
  c.clear(); c.strokeCircle(16, 16, 10, 3, r, g, b); c.strokeCircle(16, 16, 10, 1, 255, 220, 0);
}

function drawStar(c, [r, g, b]) {
  c.clear();
  c.fillDiamond(16, 16, 11, r, g, b);
  c.fillDiamond(16, 16, 6, Math.min(r + 60, 255), Math.min(g + 60, 255), Math.min(b + 60, 255));
  c.fillCircle(16, 16, 3, 255, 255, 200);
}

function drawCheckpointFlag(c, [r, g, b]) {
  c.clear();
  // Pole
  c.fillRect(10, 6, 2, 22, 160, 160, 160);
  // Flag — damier vert/blanc
  const colors = [[r, g, b], [255, 255, 255]];
  for (let dy = 0; dy < 3; dy++)
    for (let dx = 0; dx < 4; dx++) {
      const col = colors[(dx + dy) % 2];
      c.fillRect(12 + dx * 4, 6 + dy * 4, 4, 4, col[0], col[1], col[2]);
    }
}

function drawTurboFlame(c, [r, g, b]) {
  c.clear();
  c.fillTriangle(16, 4, 24, 20, 8, 20, r, g, b);
  c.fillTriangle(16, 10, 22, 26, 10, 26, 255, 180, 0);
  c.fillCircle(16, 22, 5, 255, 255, 100);
}

function drawCone(c, [r, g, b]) {
  c.clear();
  // Cone orange avec bande blanche
  c.fillTriangle(16, 6, 26, 26, 6, 26, r, g, b);
  // Bande
  for (let dx = -5; dx <= 5; dx++) c.setPixel(16 + dx, 18, 255, 255, 255);
  for (let dx = -6; dx <= 6; dx++) c.setPixel(16 + dx, 19, 255, 255, 255);
  // Base
  c.fillRect(7, 26, 18, 3, 200, 200, 200);
}

function drawBarrier(c, [r, g, b]) {
  c.clear();
  // Barrière rouge/blanc rayée
  c.fillRect(4, 13, 24, 6, 200, 200, 200);
  for (let x = 4; x < 28; x += 6) c.fillRect(x, 13, 3, 6, r, g, b);
  // Poteaux
  c.fillRect(5, 10, 3, 12, 180, 180, 180);
  c.fillRect(24, 10, 3, 12, 180, 180, 180);
}

function drawCar(c, [r, g, b]) {
  c.clear();
  // Corps voiture
  c.fillRect(6, 14, 20, 8, r, g, b);
  // Cabine
  c.fillRect(9, 9, 14, 7, Math.max(r - 40, 0), Math.max(g - 40, 0), Math.max(b - 40, 0));
  // Vitres
  c.fillRect(10, 10, 5, 5, 150, 220, 255, 200);
  c.fillRect(17, 10, 5, 5, 150, 220, 255, 200);
  // Roues
  c.fillCircle(10, 22, 3, 40, 40, 40);
  c.fillCircle(22, 22, 3, 40, 40, 40);
  c.fillCircle(10, 22, 1, 100, 100, 100);
  c.fillCircle(22, 22, 1, 100, 100, 100);
}

function drawMagicOrb(c, [r, g, b]) {
  c.clear();
  c.fillCircle(16, 16, 11, r, g, b, 200);
  c.fillCircle(16, 16, 7, Math.min(r + 80, 255), Math.min(g + 80, 255), Math.min(b + 80, 255));
  c.fillCircle(12, 12, 3, 255, 255, 255, 150);
  c.strokeCircle(16, 16, 11, 1, 255, 255, 255, 100);
}

function drawStoneBlock(c, [r, g, b]) {
  c.clear();
  c.fillRect(4, 4, 24, 24, r, g, b);
  c.strokeRect(4, 4, 24, 24, 255, 255, 255, 80);
  // Fissures
  c.fillRect(8, 10, 6, 1, Math.max(r - 40, 0), Math.max(g - 40, 0), Math.max(b - 40, 0), 150);
  c.fillRect(16, 18, 8, 1, Math.max(r - 40, 0), Math.max(g - 40, 0), Math.max(b - 40, 0), 150);
}

function drawHadouken(c, [r, g, b]) {
  c.clear();
  c.fillCircle(16, 16, 10, r, g, b, 200);
  c.fillCircle(16, 16, 6, 255, 255, 255, 180);
  for (let a = 0; a < 8; a++) {
    const angle = a * Math.PI / 4;
    const x = Math.round(16 + Math.cos(angle) * 13);
    const y = Math.round(16 + Math.sin(angle) * 13);
    c.fillCircle(x, y, 2, r, g, b, 150);
  }
}

function drawFireball(c, [r, g, b]) {
  c.clear();
  c.fillCircle(16, 16, 9, r, g, b);
  c.fillCircle(14, 14, 5, 255, 200, 0);
  c.fillCircle(13, 13, 2, 255, 255, 200);
}

function drawBarrel(c, [r, g, b]) {
  c.clear();
  c.fillRect(7, 6, 18, 22, r, g, b);
  c.strokeRect(7, 6, 18, 22, 255, 255, 255, 80);
  // Cerceaux
  c.fillRect(7, 11, 18, 2, Math.max(r - 60, 0), Math.max(g - 60, 0), Math.max(b - 60, 0), 200);
  c.fillRect(7, 19, 18, 2, Math.max(r - 60, 0), Math.max(g - 60, 0), Math.max(b - 60, 0), 200);
}

function drawShuriken(c, [r, g, b]) {
  c.clear();
  c.fillDiamond(16, 16, 10, r, g, b);
  c.fillDiamond(16, 16, 10, r, g, b);
  // Rotation 45°
  c.fillRect(10, 14, 12, 4, r, g, b);
  c.fillRect(14, 10, 4, 12, r, g, b);
  c.fillCircle(16, 16, 3, 255, 255, 255);
}

function drawDagger(c, [r, g, b]) {
  c.clear();
  // Lame
  c.fillTriangle(16, 4, 20, 20, 12, 20, 200, 200, 220);
  // Garde
  c.fillRect(9, 20, 14, 3, r, g, b);
  // Manche
  c.fillRect(13, 23, 6, 7, Math.max(r - 30, 0), Math.max(g - 30, 0), Math.max(b - 30, 0));
}

function drawLantern(c, [r, g, b]) {
  c.clear();
  // Corps
  c.fillRect(10, 10, 12, 14, r, g, b, 220);
  c.strokeRect(10, 10, 12, 14, 255, 200, 0, 200);
  // Lumière
  c.fillCircle(16, 17, 4, 255, 230, 100, 180);
  // Suspension
  c.fillRect(15, 5, 2, 6, 150, 150, 150);
}

function drawDragonToken(c, [r, g, b]) {
  c.clear();
  c.fillCircle(16, 16, 12, r, g, b);
  c.strokeCircle(16, 16, 12, 1, 255, 180, 0);
  // Dragon simplifié — œil
  c.fillCircle(16, 14, 4, Math.max(r - 80, 0), 0, 0);
  c.fillCircle(16, 14, 2, 255, 200, 0);
}

function drawFireOrb(c, [r, g, b]) {
  c.clear();
  c.fillCircle(16, 16, 11, r, g, b);
  c.fillCircle(16, 14, 7, Math.min(r + 60, 255), 100, 0);
  c.fillCircle(15, 12, 3, 255, 240, 0);
}

function drawNewspaper(c, [r, g, b]) {
  c.clear();
  // Corps journal
  c.fillRect(5, 7, 22, 18, r, g, b);
  c.strokeRect(5, 7, 22, 18, 100, 100, 100);
  // Lignes de texte
  for (let row = 0; row < 4; row++)
    c.fillRect(8, 11 + row * 4, 16, 2, 100, 100, 100, 180);
  // Titre
  c.fillRect(7, 9, 18, 3, 80, 80, 80);
}

function drawCoin(c, [r, g, b]) {
  c.clear();
  c.fillCircle(16, 16, 11, r, g, b);
  c.strokeCircle(16, 16, 11, 1, Math.max(r - 60, 0), Math.max(g - 60, 0), 0);
  c.fillCircle(16, 16, 6, Math.min(r + 60, 255), Math.min(g + 60, 255), 0);
  c.fillCircle(14, 14, 2, 255, 255, 200);
}

function drawDog(c, [r, g, b]) {
  c.clear();
  // Corps
  c.fillRect(7, 16, 18, 10, r, g, b);
  // Tête
  c.fillRect(6, 8, 12, 10, r, g, b);
  // Oreilles
  c.fillRect(4, 7, 4, 5, Math.max(r - 30, 0), Math.max(g - 30, 0), Math.max(b - 30, 0));
  // Yeux
  c.fillCircle(10, 11, 2, 255, 255, 255); c.fillCircle(10, 11, 1, 40, 40, 40);
  // Nez
  c.fillRect(8, 15, 3, 2, 40, 40, 40);
  // Pattes
  c.fillRect(8, 26, 3, 4, r, g, b); c.fillRect(15, 26, 3, 4, r, g, b);
}

function drawWitchBoss(c, [r, g, b]) {
  c.clear();
  // Cape
  c.fillTriangle(16, 6, 26, 28, 6, 28, r, g, b);
  // Tête
  c.fillCircle(16, 10, 6, Math.min(r + 40, 255), Math.min(g + 40, 255), Math.min(b + 40, 255));
  // Chapeau
  c.fillTriangle(16, 2, 22, 8, 10, 8, 40, 20, 60);
  // Yeux
  c.fillCircle(13, 10, 2, 255, 220, 0);
  c.fillCircle(19, 10, 2, 255, 220, 0);
  // Bâton
  c.fillRect(24, 12, 2, 16, 120, 80, 40);
  c.fillCircle(25, 11, 3, 200, 0, 255, 200);
}

function drawMechaRobot(c, [r, g, b]) {
  c.clear();
  c.fillRect(8, 10, 16, 18, r, g, b);
  c.strokeRect(8, 10, 16, 18, 200, 200, 255, 180);
  c.fillRect(10, 6, 12, 6, Math.max(r - 30, 0), Math.max(g - 30, 0), Math.max(b - 30, 0));
  c.fillCircle(13, 9, 2, 255, 60, 60);
  c.fillCircle(19, 9, 2, 255, 60, 60);
  c.fillRect(6, 12, 4, 8, r, g, b); c.fillRect(22, 12, 4, 8, r, g, b);
  c.fillRect(10, 28, 4, 4, r, g, b); c.fillRect(18, 28, 4, 4, r, g, b);
}

function drawBrawler(c, [r, g, b]) {
  c.clear();
  c.fillRect(10, 6, 12, 12, r, g, b);
  c.fillRect(8, 18, 16, 10, Math.max(r - 20, 0), Math.max(g - 20, 0), Math.max(b - 20, 0));
  c.fillCircle(16, 9, 5, Math.min(r + 40, 255), Math.min(g + 20, 255), Math.min(b + 20, 255));
  c.fillRect(6, 18, 6, 8, r, g, b); c.fillRect(20, 18, 6, 8, r, g, b);
  c.fillRect(12, 28, 4, 4, r, g, b); c.fillRect(17, 28, 4, 4, r, g, b);
}

function drawFighterBoss(c, [r, g, b]) {
  c.clear();
  c.fillRect(10, 8, 12, 12, r, g, b);
  c.fillRect(8, 20, 16, 8, 0, 0, 80);
  c.fillCircle(16, 11, 5, Math.min(r + 60, 255), 180, 140);
  c.fillRect(4, 18, 6, 8, r, g, b); c.fillRect(22, 18, 6, 8, r, g, b);
  // Hadouken aura
  c.strokeCircle(16, 16, 14, 1, 0, 100, 255, 100);
}

function drawShadowNinja(c, [r, g, b]) {
  c.clear();
  c.fillRect(10, 8, 12, 14, 20, 20, 40);
  c.fillCircle(16, 11, 5, 30, 30, 50);
  c.fillRect(8, 22, 16, 8, 20, 20, 40);
  c.fillRect(4, 18, 6, 8, 20, 20, 40); c.fillRect(22, 18, 6, 8, 20, 20, 40);
  c.fillRect(12, 30, 4, 2, 20, 20, 40); c.fillRect(18, 30, 4, 2, 20, 20, 40);
  // Yeux — éclat rouge
  c.fillCircle(13, 11, 1, r, g, b); c.fillCircle(19, 11, 1, r, g, b);
  // Katana
  c.fillRect(24, 6, 1, 18, 200, 200, 220);
}

function drawKombatWarrior(c, [r, g, b]) {
  c.clear();
  c.fillRect(10, 8, 12, 12, r, g, b);
  c.fillRect(8, 20, 16, 8, Math.max(r - 60, 0), 0, 0);
  c.fillCircle(16, 11, 5, Math.min(r + 30, 255), 160, 120);
  c.fillRect(4, 18, 6, 8, r, g, b); c.fillRect(22, 18, 6, 8, r, g, b);
  c.fillRect(12, 28, 4, 4, r, g, b); c.fillRect(18, 28, 4, 4, r, g, b);
  // Masque
  c.fillRect(11, 13, 10, 3, 80, 0, 0);
  // Yeux blancs
  c.fillCircle(13, 11, 1, 255, 255, 255); c.fillCircle(19, 11, 1, 255, 255, 255);
}

function drawBulldog(c, [r, g, b]) {
  c.clear();
  c.fillRect(5, 14, 22, 14, r, g, b);
  c.fillRect(6, 6, 18, 12, r, g, b);
  // Oreilles
  c.fillRect(3, 5, 5, 6, Math.max(r - 40, 0), Math.max(g - 40, 0), Math.max(b - 40, 0));
  c.fillRect(24, 5, 5, 6, Math.max(r - 40, 0), Math.max(g - 40, 0), Math.max(b - 40, 0));
  c.fillCircle(11, 11, 3, 255, 255, 255); c.fillCircle(11, 11, 1, 30, 30, 30);
  c.fillCircle(21, 11, 3, 255, 255, 255); c.fillCircle(21, 11, 1, 30, 30, 30);
  // Groin
  c.fillRect(10, 14, 12, 5, Math.min(r + 30, 255), Math.min(g + 10, 255), Math.min(b + 10, 255));
  // Nez
  c.fillRect(13, 13, 6, 3, 40, 40, 40);
  // Pattes
  c.fillRect(7, 28, 5, 4, r, g, b); c.fillRect(20, 28, 5, 4, r, g, b);
}

// ─── Frame tile 32×32 par univers ─────────────────────────────────────────────

function drawFrameTile(c, palHex, style) {
  c.clear();
  const [r, g, b] = hexToRgb(palHex[0]);
  const [r2, g2, b2] = hexToRgb(palHex[1]);
  c.fillRect(0, 0, 32, 32, r, g, b);

  switch (style) {
    case 'stone':
      c.strokeRect(0, 0, 32, 32, r2, g2, b2, 200);
      c.fillRect(2, 2, 28, 4, Math.min(r + 20, 255), Math.min(g + 20, 255), Math.min(b + 20, 255), 120);
      break;
    case 'neon':
      c.strokeRect(0, 0, 32, 32, r2, g2, b2, 255);
      c.strokeRect(2, 2, 28, 28, r2, g2, b2, 100);
      break;
    case 'road':
      c.fillRect(0, 14, 32, 4, Math.min(r + 30, 255), Math.min(g + 20, 255), Math.min(b + 20, 255), 80);
      c.strokeRect(0, 0, 32, 32, r2, g2, b2, 180);
      break;
    case 'bamboo':
      c.fillRect(13, 0, 6, 32, Math.max(r - 20, 0), Math.max(g - 20, 0), Math.max(b - 20, 0), 100);
      c.strokeRect(0, 0, 32, 32, r2, g2, b2, 200);
      break;
    case 'fire':
      for (let x = 0; x < 32; x += 4) c.fillRect(x, 28, 2, 4, r2, g2, b2, 180);
      c.strokeRect(0, 0, 32, 32, r2, g2, b2, 200);
      break;
    case 'suburban':
      c.fillRect(0, 0, 32, 4, 100, 180, 100, 120);
      c.strokeRect(0, 0, 32, 32, r2, g2, b2, 160);
      break;
    default:
      c.strokeRect(0, 0, 32, 32, r2, g2, b2, 200);
  }
}

// ─── HUD panel 360×56 ─────────────────────────────────────────────────────────

function drawHudPanel(c, palHex) {
  const [r, g, b] = hexToRgb(palHex[0]);
  const [r2, g2, b2] = hexToRgb(palHex[1]);
  c.clear(r, g, b, 220);
  c.strokeRect(0, 0, 360, 56, r2, g2, b2, 200);
  c.fillRect(1, 1, 358, 3, r2, g2, b2, 80);
  c.fillRect(1, 52, 358, 3, r2, g2, b2, 80);
}

// ─── Données par univers ──────────────────────────────────────────────────────

const UNIVERSE_DEFS = {
  castle: {
    frameStyle: 'stone',
    drawPickup1: (c) => drawStar(c, hexToRgb('#f1c40f')),
    drawPickup2: (c) => drawMagicOrb(c, hexToRgb('#00bcd4')),
    drawObstacle1: (c) => drawStoneBlock(c, hexToRgb('#7b3fa0')),
    drawObstacle2: (c) => drawStoneBlock(c, hexToRgb('#4a235a')),
    drawBoss: (c) => drawWitchBoss(c, hexToRgb('#7b3fa0')),
  },
  sonic: {
    frameStyle: 'neon',
    drawPickup1: (c) => drawRing(c, hexToRgb('#f9ca24')),
    drawPickup2: (c) => drawStar(c, hexToRgb('#c0392b')),
    drawObstacle1: (c) => drawCone(c, hexToRgb('#e74c3c')),
    drawObstacle2: (c) => drawBarrel(c, hexToRgb('#555555')),
    drawBoss: (c) => drawMechaRobot(c, hexToRgb('#888888')),
  },
  streets: {
    frameStyle: 'neon',
    drawPickup1: (c) => drawMagicOrb(c, hexToRgb('#2980b9')),
    drawPickup2: (c) => drawCoin(c, hexToRgb('#27ae60')),
    drawObstacle1: (c) => drawBarrel(c, hexToRgb('#777777')),
    drawObstacle2: (c) => drawCone(c, hexToRgb('#e67e22')),
    drawBoss: (c) => drawBrawler(c, hexToRgb('#e67e22')),
  },
  fighter: {
    frameStyle: 'neon',
    drawPickup1: (c) => drawHadouken(c, hexToRgb('#3498db')),
    drawPickup2: (c) => drawFireball(c, hexToRgb('#e74c3c')),
    drawObstacle1: (c) => drawBarrel(c, hexToRgb('#5d4037')),
    drawObstacle2: (c) => drawStoneBlock(c, hexToRgb('#8d6e63')),
    drawBoss: (c) => drawFighterBoss(c, hexToRgb('#e74c3c')),
  },
  outrun: {
    frameStyle: 'road',
    drawPickup1: (c) => drawCheckpointFlag(c, hexToRgb('#27ae60')),
    drawPickup2: (c) => drawTurboFlame(c, hexToRgb('#ff6b9d')),
    drawObstacle1: (c) => drawCone(c, hexToRgb('#ff6b35')),
    drawObstacle2: (c) => drawBarrier(c, hexToRgb('#e74c3c')),
    drawBoss: (c) => drawCar(c, hexToRgb('#c0392b')),
  },
  shinobi: {
    frameStyle: 'bamboo',
    drawPickup1: (c) => drawShuriken(c, hexToRgb('#888888')),
    drawPickup2: (c) => drawDagger(c, hexToRgb('#00b4d8')),
    drawObstacle1: (c) => drawLantern(c, hexToRgb('#00b4d8')),
    drawObstacle2: (c) => drawStoneBlock(c, hexToRgb('#445566')),
    drawBoss: (c) => drawShadowNinja(c, hexToRgb('#c0392b')),
  },
  kombat: {
    frameStyle: 'fire',
    drawPickup1: (c) => drawDragonToken(c, hexToRgb('#f39c12')),
    drawPickup2: (c) => drawFireOrb(c, hexToRgb('#c0392b')),
    drawObstacle1: (c) => drawBarrel(c, hexToRgb('#555555')),
    drawObstacle2: (c) => drawFireball(c, hexToRgb('#ff4500')),
    drawBoss: (c) => drawKombatWarrior(c, hexToRgb('#8b0000')),
  },
  paperboy: {
    frameStyle: 'suburban',
    drawPickup1: (c) => drawNewspaper(c, hexToRgb('#f5f5f5')),
    drawPickup2: (c) => drawCoin(c, hexToRgb('#f1c40f')),
    drawObstacle1: (c) => drawDog(c, hexToRgb('#8B4513')),
    drawObstacle2: (c) => drawStoneBlock(c, hexToRgb('#555555')),
    drawBoss: (c) => drawBulldog(c, hexToRgb('#8B4513')),
  },
};

// ─── Build principal ──────────────────────────────────────────────────────────

function ensureDir(p) { if (!existsSync(p)) mkdirSync(p, { recursive: true }); }

function saveIcon(path, drawFn) {
  const c = new PixelCanvas(ICON_SIZE, ICON_SIZE);
  drawFn(c);
  writeFileSync(path, c.toPNG());
}

function saveHudPanel(path, palHex) {
  const c = new PixelCanvas(360, 56);
  drawHudPanel(c, palHex);
  writeFileSync(path, c.toPNG());
}

function saveFrameTile(path, palHex, style) {
  const c = new PixelCanvas(32, 32);
  drawFrameTile(c, palHex, style);
  writeFileSync(path, c.toPNG());
}

const mappingPath = join(ROOT, 'design_boards', 'BOARD_MAPPING.json');
const mapping = JSON.parse(readFileSync(mappingPath, 'utf-8'));

const manifest = { version: 1, generatedAt: new Date().toISOString(), universes: {} };

for (const [uid, umap] of Object.entries(mapping.universes)) {
  console.log(`\n── ${uid.toUpperCase()} ──`);
  const def = UNIVERSE_DEFS[uid];
  if (!def) { console.warn(`  WARN: aucun def pour ${uid}, skipped`); continue; }

  const outDir = join(ROOT, 'public', 'assets', 'universes', uid);
  ensureDir(outDir);

  const pal = umap.paletteHex;
  const fallbacks = [];

  // board_preview.png — copie de la source
  const srcFile = join(ROOT, umap.sourceFile);
  const previewPath = join(outDir, 'board_preview.png');
  if (existsSync(srcFile)) {
    copyFileSync(srcFile, previewPath);
    console.log(`  ✓ board_preview.png (source: ${umap.sourceFile})`);
  } else {
    console.warn(`  ✗ board source non trouvé : ${srcFile}`);
    fallbacks.push('boardPreview');
  }

  // theme_palette.json
  const palette = {
    bg: pal[0], primary: pal[1], accent: pal[2] ?? pal[1],
    secondary: pal[3] ?? pal[0], highlight: pal[4] ?? '#ffffff'
  };
  writeFileSync(join(outDir, 'theme_palette.json'), JSON.stringify(palette, null, 2));
  console.log('  ✓ theme_palette.json');

  // frame_tile.png
  saveFrameTile(join(outDir, 'frame_tile.png'), pal, def.frameStyle);
  console.log('  ✓ frame_tile.png');

  // hud_panel.png
  saveHudPanel(join(outDir, 'hud_panel.png'), pal);
  console.log('  ✓ hud_panel.png');

  // pickup_01.png
  saveIcon(join(outDir, 'pickup_01.png'), def.drawPickup1);
  console.log(`  ✓ pickup_01.png (${umap.pickups[0]})`);

  // pickup_02.png
  saveIcon(join(outDir, 'pickup_02.png'), def.drawPickup2);
  console.log(`  ✓ pickup_02.png (${umap.pickups[1]})`);

  // obstacle_01.png
  saveIcon(join(outDir, 'obstacle_01.png'), def.drawObstacle1);
  console.log(`  ✓ obstacle_01.png (${umap.obstacles[0]})`);

  // obstacle_02.png
  saveIcon(join(outDir, 'obstacle_02.png'), def.drawObstacle2);
  console.log(`  ✓ obstacle_02.png (${umap.obstacles[1]})`);

  // boss.png (48×48)
  const bossCanvas = new PixelCanvas(48, 48);
  // On dessine le boss dans un canvas 32×32 puis on étire dans 48×48
  const tmp = new PixelCanvas(32, 32);
  def.drawBoss(tmp);
  // Upscale 1.5x avec nearest-neighbor
  for (let y = 0; y < 48; y++)
    for (let x = 0; x < 48; x++) {
      const sx = Math.floor(x * 32 / 48);
      const sy = Math.floor(y * 32 / 48);
      const i = (sy * 32 + sx) * 4;
      bossCanvas.setPixel(x, y, tmp.data[i], tmp.data[i+1], tmp.data[i+2], tmp.data[i+3]);
    }
  writeFileSync(join(outDir, 'boss.png'), bossCanvas.toPNG());
  console.log(`  ✓ boss.png (${umap.boss})`);

  // Entrée manifest pour cet univers
  const assetBase = `assets/universes/${uid}`;
  manifest.universes[uid] = {
    boardSource: umap.sourceFile,
    assetBase,
    confidence: umap.confidence,
    fallback: fallbacks.length > 0,
    fallbacks,
    assets: {
      boardPreview: fallbacks.includes('boardPreview') ? null : `${assetBase}/board_preview.png`,
      frame:         `${assetBase}/frame_tile.png`,
      hudPanel:      `${assetBase}/hud_panel.png`,
      pickup01:      `${assetBase}/pickup_01.png`,
      pickup02:      `${assetBase}/pickup_02.png`,
      obstacle01:    `${assetBase}/obstacle_01.png`,
      obstacle02:    `${assetBase}/obstacle_02.png`,
      boss:          `${assetBase}/boss.png`,
    },
    assetTypes: {
      pickup01:   umap.pickups[0],
      pickup02:   umap.pickups[1],
      obstacle01: umap.obstacles[0],
      obstacle02: umap.obstacles[1],
      boss:       umap.boss,
    },
    palette,
  };
}

// Écrire manifest
const manifestPath = join(ROOT, 'public', 'assets', 'design-board-manifest.json');
writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
console.log('\n✓ public/assets/design-board-manifest.json écrit');
console.log(`✓ ${Object.keys(manifest.universes).length} univers traités`);
