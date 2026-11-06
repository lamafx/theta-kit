// Robot Théta (θ) paramétrique. Node 18+, aucune dépendance.
// Usage :
//   import { robot, placerRobot, GESTES, PLACEMENTS } from './robot.mjs';
//   const svg = placerRobot({ geste: 'menton', accent: '#4C8DFF', id: 'r1' });
//   // svg est un <g> à insérer dans un <svg viewBox="0 0 1080 1350">.
// Le repère local du robot fait 600 x 660 ; voir gestures.json.

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ici = dirname(fileURLToPath(import.meta.url));
const DATA = JSON.parse(readFileSync(join(ici, 'gestures.json'), 'utf8'));
export const GESTES = DATA.gestes;
export const PLACEMENTS = DATA.placements;

const C = {
  contour: '#8F9BAA',
  bras: '#E7ECF1',
  fond: '#0A0F17',
  blanc: '#F5F8FC',
  clair: '#8DB8FF',
  oeil: '#9CC6FF',
};

function defs(p, [f0, f1] = [470, 630]) {
  return `<defs>
<radialGradient id="${p}-shell" cx="38%" cy="28%" r="80%"><stop offset="0" stop-color="#FFFFFF"/><stop offset="0.55" stop-color="#E4E9EF"/><stop offset="1" stop-color="#97A3B2"/></radialGradient>
<linearGradient id="${p}-visor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1C2735"/><stop offset="1" stop-color="#04070B"/></linearGradient>
<linearGradient id="${p}-bronze" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F3D3A1"/><stop offset="0.5" stop-color="#C08A52"/><stop offset="1" stop-color="#7E532C"/></linearGradient>
<linearGradient id="${p}-metal" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#5F6974"/><stop offset="0.45" stop-color="#D9DFE6"/><stop offset="1" stop-color="#5A636E"/></linearGradient>
<radialGradient id="${p}-disc" cx="40%" cy="35%" r="70%"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#A3AEBB"/></radialGradient>
<filter id="${p}-glow" x="-80%" y="-120%" width="260%" height="340%"><feGaussianBlur stdDeviation="5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
<linearGradient id="${p}-fade" gradientUnits="userSpaceOnUse" x1="0" y1="${f0}" x2="0" y2="${f1}"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#000000"/></linearGradient>
<mask id="${p}-mask" maskUnits="userSpaceOnUse" x="-400" y="-200" width="1400" height="1100"><rect x="-400" y="-200" width="1400" height="1100" fill="url(#${p}-fade)"/></mask>
</defs>`;
}

function epaule(p, x, y) {
  return `<circle cx="${x}" cy="${y}" r="24" fill="url(#${p}-shell)"/><circle cx="${x}" cy="${y}" r="16" fill="none" stroke="url(#${p}-bronze)" stroke-width="5"/>`;
}

function corps(p, accent) {
  return `<rect x="275" y="268" width="50" height="72" rx="8" fill="url(#${p}-metal)"/>
<ellipse cx="300" cy="338" rx="46" ry="8" fill="url(#${p}-bronze)"/>
<path d="M110 660 C110 420 160 345 230 337 L370 337 C440 345 490 420 490 660 Z" fill="url(#${p}-shell)"/>
<path d="M110 660 C110 420 160 345 230 337 L370 337 C440 345 490 420 490 660" fill="none" stroke="${C.clair}" stroke-opacity="0.35" stroke-width="1.5"/>
<path d="M200 395 Q300 420 400 395" fill="none" stroke="#B7C1CD" stroke-width="2"/>
<circle cx="300" cy="448" r="20" fill="none" stroke="#B7C1CD" stroke-width="2"/>
<circle cx="300" cy="448" r="10" fill="${accent}" filter="url(#${p}-glow)"/>`;
}

function tete(p, inclinaison, [gx, gy]) {
  const ex = 247 + gx, ey = 179 + gy;
  return `<g transform="rotate(${inclinaison} 300 170)">
<path d="M190 160 C190 20 410 20 410 160" fill="none" stroke="#262E39" stroke-width="16" stroke-linecap="round"/>
<ellipse cx="300" cy="170" rx="120" ry="110" fill="url(#${p}-shell)"/>
<ellipse cx="300" cy="170" rx="120" ry="110" fill="none" stroke="${C.clair}" stroke-opacity="0.4" stroke-width="1.5"/>
<rect x="214" y="132" width="172" height="102" rx="51" fill="url(#${p}-visor)"/>
<path d="M234 160 Q258 142 296 140" fill="none" stroke="#FFFFFF" stroke-opacity="0.18" stroke-width="5" stroke-linecap="round"/>
<g filter="url(#${p}-glow)"><rect x="${ex}" y="${ey}" width="34" height="14" rx="7" fill="${C.oeil}"/><rect x="${ex + 72}" y="${ey}" width="34" height="14" rx="7" fill="${C.oeil}"/></g>
<circle cx="178" cy="182" r="42" fill="url(#${p}-shell)"/><circle cx="178" cy="182" r="32" fill="none" stroke="url(#${p}-bronze)" stroke-width="7"/><circle cx="178" cy="182" r="25" fill="url(#${p}-disc)"/>
<circle cx="422" cy="182" r="42" fill="url(#${p}-shell)"/><circle cx="422" cy="182" r="32" fill="none" stroke="url(#${p}-bronze)" stroke-width="7"/><circle cx="422" cy="182" r="25" fill="url(#${p}-disc)"/>
</g>`;
}

function trait(d, large, fin) {
  return `<path d="${d}" fill="none" stroke="${C.contour}" stroke-width="${large}" stroke-linecap="round" stroke-linejoin="round"/>
<path d="${d}" fill="none" stroke="${C.bras}" stroke-width="${fin}" stroke-linecap="round" stroke-linejoin="round"/>`;
}

function bras(p, pts) {
  const d = 'M' + pts.map(([x, y]) => `${x} ${y}`).join(' L');
  const [ex, ey] = pts[1];
  return trait(d, 50, 42) + `<circle cx="${ex}" cy="${ey}" r="15" fill="none" stroke="url(#${p}-bronze)" stroke-width="5"/>`;
}

function doigt(x1, y1, x2, y2) { return trait(`M${x1} ${y1} L${x2} ${y2}`, 22, 15); }

function main(p, m) {
  const { type, x, y } = m;
  const poing = `<circle cx="${x}" cy="${y}" r="30" fill="url(#${p}-shell)" stroke="${C.contour}" stroke-width="3"/>`;
  const rad = ((m.angle ?? 0) * Math.PI) / 180;
  switch (type) {
    case 'poing': return poing;
    case 'menton': return doigt(x + 10, y - 12, x + 32, y - 34) + poing;
    case 'index': {
      const fx = x + Math.cos(rad) * 70, fy = y + Math.sin(rad) * 70;
      return doigt(x + Math.cos(rad) * 14, y + Math.sin(rad) * 14, fx, fy) + doigt(x - 6, y - 20, x - 12, y - 40) + poing;
    }
    case 'plat': {
      const L = m.longueur ?? 120;
      return `<rect x="${x - L / 2}" y="${y - 22}" width="${L}" height="44" rx="22" fill="url(#${p}-shell)" stroke="${C.contour}" stroke-width="3" transform="rotate(${m.angle ?? 0} ${x} ${y})"/>`;
    }
    case 'pince':
      return doigt(x - 16, y + 18, x - 20, y + 36) + doigt(x + 12, y + 20, x + 10, y + 36) + poing;
    case 'paume':
      return `<g transform="rotate(${m.angle ?? 0} ${x} ${y})">${doigt(x + 18, y + 6, x + 34, y - 18)}<rect x="${x - 23}" y="${y - 48}" width="46" height="96" rx="23" fill="url(#${p}-shell)" stroke="${C.contour}" stroke-width="3"/></g>`;
    case 'ouverte':
      return `<rect x="${x - 48}" y="${y - 16}" width="96" height="32" rx="16" fill="url(#${p}-shell)" stroke="${C.contour}" stroke-width="3"/>`;
    case 'doigts': {
      const n = Math.max(1, Math.min(5, m.doigts ?? 3));
      const spread = n === 1 ? [0] : Array.from({ length: n }, (_, i) => -30 + (60 * i) / (n - 1));
      let s = '';
      for (const a of spread) {
        const r = ((a - 90) * Math.PI) / 180;
        s += doigt(x + Math.cos(r) * 18, y + Math.sin(r) * 18, x + Math.cos(r) * 62, y + Math.sin(r) * 62);
      }
      return s + poing;
    }
    default: return poing;
  }
}

function accessoire(p, a, accent, miroir) {
  const contreMiroir = (x, y) => (miroir ? ` transform="translate(${2 * x} 0) scale(-1 1)"` : '');
  switch (a.type) {
    case 'question': {
      const t = a.texte ?? '?';
      return `<text x="${a.x}" y="${a.y}" font-family="Geist, sans-serif" font-weight="600" font-size="${a.taille}" fill="${accent}" fill-opacity="${a.opacite ?? 1}" text-anchor="middle"${contreMiroir(a.x, a.y)}>${t}</text>`;
    }
    case 'point':
      return `<circle cx="${a.x}" cy="${a.y}" r="11" fill="${C.fond}" stroke="${C.clair}" stroke-width="3"/>`;
    case 'loupe': {
      const dx = a.cx - a.x, dy = a.cy - a.y, d = Math.hypot(dx, dy);
      const bx = a.cx - (dx / d) * a.r, by = a.cy - (dy / d) * a.r;
      return `<path d="M${a.x} ${a.y} L${bx} ${by}" stroke="#262E39" stroke-width="18" stroke-linecap="round"/>
<circle cx="${a.cx}" cy="${a.cy}" r="${a.r}" fill="${accent}" fill-opacity="0.16" stroke="url(#${p}-bronze)" stroke-width="10"/>
<path d="M${a.cx - a.r * 0.5} ${a.cy - a.r * 0.2} Q${a.cx - a.r * 0.4} ${a.cy - a.r * 0.55} ${a.cx - a.r * 0.05} ${a.cy - a.r * 0.6}" fill="none" stroke="#FFFFFF" stroke-opacity="0.5" stroke-width="5" stroke-linecap="round"/>`;
    }
    case 'bouton':
      return `<circle cx="${a.x}" cy="${a.y}" r="${a.r}" fill="#1E2938" stroke="${C.clair}" stroke-width="3"/>
<line x1="${a.x}" y1="${a.y}" x2="${a.x - a.r * 0.6}" y2="${a.y - a.r * 0.6}" stroke="${accent}" stroke-width="6" stroke-linecap="round"/>
<g stroke="${C.clair}" stroke-opacity="0.6" stroke-width="3" stroke-linecap="round"><line x1="${a.x - a.r - 12}" y1="${a.y}" x2="${a.x - a.r - 22}" y2="${a.y}"/><line x1="${a.x}" y1="${a.y - a.r - 12}" x2="${a.x}" y2="${a.y - a.r - 22}"/><line x1="${a.x - a.r * 0.8 - 8}" y1="${a.y - a.r * 0.8 - 8}" x2="${a.x - a.r * 0.8 - 16}" y2="${a.y - a.r * 0.8 - 16}"/></g>`;
    case 'crayon': {
      const ang = (Math.atan2(a.y2 - a.y1, a.x2 - a.x1) * 180) / Math.PI;
      const L = Math.hypot(a.x2 - a.x1, a.y2 - a.y1);
      return `<g transform="translate(${a.x1} ${a.y1}) rotate(${ang})"><rect x="0" y="-11" width="${L - 26}" height="22" rx="6" fill="${C.blanc}" stroke="${C.contour}" stroke-width="2"/><path d="M${L - 26} -11 L${L} 0 L${L - 26} 11 Z" fill="${accent}"/></g>`;
    }
    case 'objet': {
      const col = a.couleur === 'blanc' ? C.blanc : accent;
      if (a.forme === 'cercle') return `<circle cx="${a.x}" cy="${a.y}" r="26" fill="${col}"/>`;
      if (a.forme === 'carre') return `<rect x="${a.x - 24}" y="${a.y - 24}" width="48" height="48" rx="8" fill="${col}"/>`;
      return `<rect x="${a.x - 70}" y="${a.y - 36}" width="140" height="72" rx="14" fill="${col}"/><path d="M${a.x - 70} ${a.y - 8} H${a.x + 70}" stroke="${C.fond}" stroke-opacity="0.25" stroke-width="3"/>`;
    }
    case 'ondes':
      return `<g fill="none" stroke="${accent}" stroke-width="5" stroke-linecap="round">${[30, 56, 82].map((r, i) => `<path d="M${a.x - r * 0.5} ${a.y - r} A${r} ${r} 0 0 1 ${a.x - r * 0.5} ${a.y + r}" stroke-opacity="${1 - i * 0.28}"/>`).join('')}</g>`;
    default: return '';
  }
}

// Robot dans son repère local (600 x 660), motif à gauche.
export function robot({ geste = 'visiere', accent = '#4C8DFF', id = 'r', fondu = true, miroir = false, doigts, label } = {}) {
  const g = GESTES[geste];
  if (!g) throw new Error(`Geste inconnu : ${geste}`);
  const p = id;
  const actifsGauche = g.bras.some((b) => b.points[0][0] === 142);
  const actifsDroite = g.bras.some((b) => b.points[0][0] === 458);
  let s = defs(p, Array.isArray(fondu) ? fondu : undefined);
  s += `<g${fondu ? ` mask="url(#${p}-mask)"` : ''}>${corps(p, accent)}${actifsGauche ? '' : epaule(p, 142, 392)}${actifsDroite ? '' : epaule(p, 458, 392)}</g>`;
  s += tete(p, g.inclinaison ?? 0, g.regard ?? [0, 0]);
  for (const b of g.bras) s += bras(p, b.points);
  for (const b of g.bras) s += main(p, doigts && b.main.type === 'doigts' ? { ...b.main, doigts } : b.main);
  for (const a of g.accessoires ?? []) s += accessoire(p, a, accent, miroir);
  for (const b of g.bras) s += epaule(p, b.points[0][0], b.points[0][1]);
  const aria = label ?? `Le robot de la série, ${g.description.charAt(0).toLowerCase()}${g.description.slice(1)}`;
  return `<g role="img" aria-label="${aria.replace(/"/g, '&quot;')}">${s}</g>`;
}

// Robot placé sur une couverture 1080 x 1350, selon la position du geste (ou une position imposée).
export function placerRobot({ geste, position, accent = '#4C8DFF', id = 'r', fondu = true, doigts, label } = {}) {
  const g = GESTES[geste];
  const pos = position ?? g.position;
  const pl = PLACEMENTS[pos];
  if (!pl) throw new Error(`Position inconnue : ${pos}`);
  const [tx, ty] = pl.translate;
  const sx = pl.miroir ? -pl.scale : pl.scale;
  return `<g transform="translate(${tx} ${ty}) scale(${sx} ${pl.scale})">${robot({ geste, accent, id, fondu: fondu && (pl.fondu ?? true), miroir: pl.miroir, doigts, label })}</g>`;
}
