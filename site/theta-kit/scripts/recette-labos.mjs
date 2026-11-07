// Recette des labos et des replis. Serveur sur le port 3100, lancé avec THETA_APERCU=1.
// Usage : node scripts/recette-labos.mjs [dossier-captures]
import fs from 'node:fs';
import { chromium } from 'playwright';

const B = process.env.BASE ?? 'http://localhost:3100';
const D = process.argv[2] ?? 'recette';
fs.mkdirSync(D, { recursive: true });
const ARGS = ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'];
const log = (...x) => fs.appendFileSync(`${D}/labos.log`, `${x.join(' ')}\n`);
fs.writeFileSync(`${D}/labos.log`, '');

const nav = await chromium.launch({ channel: 'msedge', args: ARGS });
const ouvrir = async (p, t) => {
  await p.goto(`${B}/fr/labo/${t}`, { waitUntil: 'load', timeout: 90000 });
  await p.waitForFunction(() => !document.body.innerText.includes('Chargement de la scène'), null, { timeout: 60000 });
  await p.waitForTimeout(7000);
};
const reussi = async (p, ms = 30000) => {
  const ok = await p.waitForFunction(() => /[1-9]\d*\/12/.test(document.querySelector('.lb-defis')?.innerText ?? ''), null, { timeout: ms }).then(() => true).catch(() => false);
  return ok ? 'réussi' : 'ÉCHEC';
};

// Défis sur ordinateur
const ctx = await nav.newContext({ viewport: { width: 1440, height: 900 } });
const p = await ctx.newPage();
const err = [];
p.on('pageerror', (e) => err.push(e.message));
const clic = async (x, y) => { await p.mouse.click(x, y); await p.waitForTimeout(1500); };

if (process.env.SUITE !== '1') {
await ouvrir(p, 'modele');
await p.locator('#lb-sl').fill('74');
await p.locator('#lb-batch').fill('4');
log('modele', await reussi(p));

}
await ouvrir(p, 'cout');
await clic(880, 585);
log('cout', await reussi(p), await p.locator('.lb-stat').innerText());

if (process.env.SUITE !== '1') {
await ouvrir(p, 'regression');
await p.getByRole('button', { name: 'Lecture' }).click();
log('regression', await reussi(p, 90000), await p.locator('.lb-stat').innerText());

await ouvrir(p, 'exemples');
await clic(720, 600);
await clic(1040, 440);
await clic(1270, 590);
log('exemples', await reussi(p), await p.locator('.lb-stat').innerText());

await ouvrir(p, 'donnees');
await p.getByRole('button', { name: 'Une colonne par quartier' }).click();
await p.waitForTimeout(2000);
await clic(1270, 520);
log('donnees', await reussi(p), await p.locator('.lb-stat').innerText());

}
await ouvrir(p, 'familles');
const lire = p.getByRole('button', { name: 'Faire un pas' });
await lire.click();
await p.waitForTimeout(1500);
await p.getByRole('button', { name: /Famille :/ }).click();
await p.waitForTimeout(1500);
await lire.click();
await p.waitForTimeout(1500);
await p.getByRole('button', { name: /Famille :/ }).click();
await p.waitForTimeout(1500);
await p.getByRole('button', { name: 'Lecture' }).click();
log('familles', await reussi(p, 90000), await p.locator('.lb-stat').innerText());
log('erreurs bureau', JSON.stringify(err));
await ctx.close();

// Téléphone
const tel = await nav.newContext({ viewport: { width: 393, height: 852 }, hasTouch: true, isMobile: true, deviceScaleFactor: 2 });
const q = await tel.newPage();
for (const t of ['exemples', 'donnees', 'modele', 'cout', 'regression']) {
  await ouvrir(q, t);
  await q.screenshot({ path: `${D}/tel_${t}.png` });
  log('tel', t, 'débord', await q.evaluate(() => document.documentElement.scrollWidth - innerWidth));
}
await q.goto(`${B}/fr/voyage`, { waitUntil: 'load', timeout: 90000 });
await q.waitForTimeout(10000);
await q.screenshot({ path: `${D}/tel_voyage.png` });
await q.goto(`${B}/fr/profil`, { waitUntil: 'load', timeout: 90000 });
await q.waitForTimeout(4000);
await q.screenshot({ path: `${D}/tel_profil.png` });
await tel.close();

// Animations réduites
const r = await nav.newContext({ viewport: { width: 1280, height: 800 }, reducedMotion: 'reduce' });
const m = await r.newPage();
await m.goto(`${B}/fr/voyage`, { waitUntil: 'load', timeout: 90000 });
await m.waitForTimeout(4000);
log('réduit voyage liste', await m.locator('.tn-liste li').count());
await m.goto(`${B}/fr`, { waitUntil: 'load', timeout: 90000 });
await m.waitForTimeout(3000);
log('réduit accueil svg', await m.locator('.hx-panel svg').count(), 'canvas initialisé', await m.evaluate(() => document.querySelector('canvas[data-hero]').width !== 300));
await r.close();
await nav.close();

// Sans WebGL
const nogl = await chromium.launch({ channel: 'msedge', args: ['--disable-webgl', '--disable-webgl2', '--disable-gpu', '--disable-3d-apis'] });
const c2 = await nogl.newContext({ viewport: { width: 1280, height: 800 } });
const n = await c2.newPage();
for (const u of ['/fr', '/fr/voyage', '/fr/labo/gradient', '/fr/profil']) {
  await n.goto(B + u, { waitUntil: 'load', timeout: 90000 });
  await n.waitForTimeout(4000);
  await n.screenshot({ path: `${D}/nogl${u.replace(/\//g, '_')}.png` });
  log('sans webgl', u, 'liste', await n.locator('.tn-liste li').count(), 'message', await n.locator('.lb-nogl').count(), 'svg', await n.locator('.hx-panel svg').count());
}
await nogl.close();
log('FIN');
