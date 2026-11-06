// Génère robot/apercus/<geste>.svg : chaque geste placé sur une couverture vide,
// avec la zone réservée au motif en pointillés. Usage : node scripts/apercu-gestes.mjs
import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { placerRobot, GESTES, PLACEMENTS } from '../robot/robot.mjs';

const racine = join(dirname(fileURLToPath(import.meta.url)), '..');
const sortie = join(racine, 'robot', 'apercus');
mkdirSync(sortie, { recursive: true });

for (const [nom, g] of Object.entries(GESTES)) {
  const pl = PLACEMENTS[g.position];
  const [x1, y1, x2, y2] = pl.zone_motif;
  const titreY = pl.titre === 'haut' ? 330 : 1120;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1350" width="1080" height="1350">
<rect width="1080" height="1350" fill="#0A0F17"/>
<rect x="${x1}" y="${y1}" width="${x2 - x1}" height="${y2 - y1}" fill="none" stroke="#4C8DFF" stroke-width="3" stroke-dasharray="12 10" stroke-opacity="0.6"/>
<text x="${(x1 + x2) / 2}" y="${(y1 + y2) / 2}" fill="#4C8DFF" fill-opacity="0.7" font-family="sans-serif" font-size="30" text-anchor="middle">zone du motif</text>
${placerRobot({ geste: nom, id: nom })}
<text x="80" y="${titreY}" fill="#F5F8FC" font-family="sans-serif" font-weight="700" font-size="96">${g.verbe}</text>
<text x="80" y="${titreY + 60}" fill="#A7B3C2" font-family="sans-serif" font-size="34">geste « ${nom} » · position ${g.position}</text>
</svg>`;
  writeFileSync(join(sortie, `${nom}.svg`), svg);
}
console.log(`${Object.keys(GESTES).length} aperçus écrits dans robot/apercus/`);
