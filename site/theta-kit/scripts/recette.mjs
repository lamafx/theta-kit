// Recette locale : charge chaque page, relève les erreurs, mesure le taux d'images, prend des captures.
// Usage : npm run start (dans un autre terminal), puis node scripts/recette.mjs [dossier-captures]
import fs from 'node:fs';
import { chromium } from 'playwright';

const BASE = process.env.BASE ?? 'http://localhost:3100';
const DOSSIER = process.argv[2] ?? 'recette';
fs.mkdirSync(DOSSIER, { recursive: true });
const navigateur = await chromium.launch({ channel: 'msedge', args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const GABARITS = {
  bureau: { viewport: { width: 1440, height: 900 } },
  telephone: { viewport: { width: 393, height: 852 }, hasTouch: true, isMobile: true, deviceScaleFactor: 2 },
  tablette: { viewport: { width: 768, height: 1024 }, hasTouch: true, isMobile: true },
};
const PAGES = ['/fr', '/en', '/fr/voyage', '/fr/labo', '/fr/labo/exemples', '/en/labo/familles', '/fr/labo/modele', '/fr/labo/gradient', '/en/labo/selle', '/fr/profil', '/en/profil', '/fr/episodes/06', '/en/episodes/06'];
const TEXTES_INTERDITS = ['—', ...(process.env.TELEPHONE ? [process.env.TELEPHONE] : []), '88 %', '88%', '1 919', '2 041', 'à 3 posts'];
const fps = (page, ms = 2500) => page.evaluate((d) => new Promise((ok) => {
  let n = 0; const t0 = performance.now();
  const f = () => { n += 1; if (performance.now() - t0 < d) requestAnimationFrame(f); else ok(Math.round((n * 1000) / d)); };
  requestAnimationFrame(f);
}), ms);

let problemes = 0;
for (const [nom, opt] of Object.entries(GABARITS)) {
  const ctx = await navigateur.newContext(opt);
  const page = await ctx.newPage();
  const erreurs = [];
  page.on('pageerror', (e) => erreurs.push(`exception : ${e.message}`));
  page.on('console', (m) => { if (m.type() === 'error' && !/Vercel|_vercel|insights/.test(m.text())) erreurs.push(`console : ${m.text().slice(0, 200)}`); });
  page.on('response', (r) => { if (r.status() >= 400 && !/_vercel/.test(r.url())) erreurs.push(`HTTP ${r.status()} : ${r.url()}`); });
  for (const chemin of PAGES) {
    erreurs.length = 0;
    await page.goto(BASE + chemin, { waitUntil: 'load', timeout: 90000 });
    await page.waitForTimeout(chemin.endsWith('/fr') || chemin.endsWith('/en') ? 4800 : 2800);
    const f = await fps(page);
    const texte = await page.evaluate(() => document.body.innerText);
    const interdits = TEXTES_INTERDITS.filter((x) => texte.includes(x));
    const debord = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    const nom2 = `${nom}${chemin.replace(/\//g, '_')}`;
    await page.screenshot({ path: `${DOSSIER}/${nom2}.png` });
    console.log(nom.padEnd(10), chemin.padEnd(22), `${String(f).padStart(3)} img/s`, debord > 1 ? `débordement ${debord}px` : '', interdits.length ? `INTERDIT ${interdits}` : '', erreurs.length ? erreurs.slice(0, 3) : '');
    problemes += erreurs.length + interdits.length + (debord > 1 ? 1 : 0);
  }
  await ctx.close();
}
await navigateur.close();
console.log(problemes ? `${problemes} problème(s)` : 'aucun problème');
