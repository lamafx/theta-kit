// Génère la couverture A d'un épisode : templates/sortie/couverture-<NN>.html (1080 x 1350).
// Usage : node templates/couverture.mjs 08        (un épisode)
//         node templates/couverture.mjs tout      (les 62)
// Le motif est lu dans motifs/<NN>.svg (contenu SVG en coordonnées 1080 x 1350, sans balise <svg>).
// S'il n'existe pas, la zone du motif reste vide et un avertissement s'affiche : il faut le dessiner.
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { placerRobot, GESTES, PLACEMENTS } from '../robot/robot.mjs';

const racine = join(dirname(fileURLToPath(import.meta.url)), '..');
const T = JSON.parse(readFileSync(join(racine, 'design', 'tokens.json'), 'utf8'));
const BANQUE = JSON.parse(readFileSync(join(racine, 'data', 'episodes.json'), 'utf8'));
const S = T.sombre;
const AUTEUR = T.signature;

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Coupe le titre en deux lignes équilibrées (le dernier mot reçoit le point d'accent).
function titreHTML(titre, accent) {
  const t = titre.replace(/\s*\?$/, ' ?');
  const fin = /[?!]$/.test(t) ? '' : `<span style="color: ${accent}">.</span>`;
  const mots = t.split(' ');
  if (t.length <= 12 || mots.length < 2) return esc(t) + fin;
  let meilleur = 1, ecart = Infinity;
  for (let i = 1; i < mots.length; i++) {
    const a = mots.slice(0, i).join(' ').length, b = mots.slice(i).join(' ').length;
    if (Math.abs(a - b) < ecart) { ecart = Math.abs(a - b); meilleur = i; }
  }
  return esc(mots.slice(0, meilleur).join(' ')) + '<br>' + esc(mots.slice(meilleur).join(' ')) + fin;
}

export function couverture(num) {
  const ep = BANQUE.episodes.find((e) => e.num === num);
  if (!ep) throw new Error(`Épisode inconnu : ${num}`);
  const g = GESTES[ep.geste];
  const position = ep.position ?? g.position;
  const pl = PLACEMENTS[position];
  const accent = S.accent;
  const fichierMotif = join(racine, 'motifs', `${num}.svg`);
  const motif = existsSync(fichierMotif) ? readFileSync(fichierMotif, 'utf8').replaceAll('{{accent}}', accent) : null;
  if (!motif) console.warn(`[${num}] motifs/${num}.svg manquant : à dessiner (voir data/episodes.json, champ motif).`);
  const robot = placerRobot({ geste: ep.geste, position, accent, id: `r${num}`, doigts: ep.doigts });
  const titreLong = ep.titre.length > 26;
  const taille = titreLong ? 96 : 124;
  const chapitre = BANQUE.chapitres[String(ep.chapitre)];
  const enHaut = pl.titre === 'haut';
  // Pied de page : si le robot occupe le bas à droite, la signature se resserre à gauche.
  const piedEtroit = position === 'bas';
  // En-tête : si le robot occupe le haut à droite, on retire la marque de droite.
  const enteteDroite = position !== 'haut' && position !== 'droite';

  const blocTitre = `<div style="position: relative; z-index: 2; ${enHaut ? 'margin-top: 64px' : 'margin-top: auto'}; display: flex; flex-direction: column">
<h1 style="margin: 0; font-size: ${taille}px; line-height: 0.93; font-weight: 600; letter-spacing: -0.04em; color: ${S.encre}; max-width: ${position === 'gauche' || enHaut ? 920 : 760}px">${titreHTML(ep.titre, accent)}</h1>
<p style="margin: 28px 0 0; max-width: 720px; font-size: 32px; line-height: 1.35; color: ${S.texte2}">${esc(ep.accroche)}</p>
</div>`;

  return `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<title>Théta Nº ${num} · ${esc(ep.titre)} · couverture</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&amp;family=Geist+Mono:wght@400;500&amp;family=STIX+Two+Text:ital,wght@0,400;1,400&amp;display=swap" rel="stylesheet">
<style>html,body{margin:0;background:${S.fond}}</style>
</head>
<body>
<div id="page" style="width: 1080px; height: 1350px; box-sizing: border-box; padding: 72px 80px 56px; background: ${S.fond}; color: ${S.encre}; font-family: 'Geist', sans-serif; display: flex; flex-direction: column; overflow: hidden; position: relative">

<svg viewBox="0 0 1080 1350" width="1080" height="1350" xmlns="http://www.w3.org/2000/svg" style="position: absolute; left: 0; top: 0; display: block">
<g id="motif">${motif ?? ''}</g>
${robot}
</svg>

<div style="position: relative; z-index: 2; display: flex; justify-content: space-between; align-items: center; font-family: 'Geist Mono', monospace; font-size: 22px; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase">
<span style="display: flex; gap: 14px"><span style="color: ${accent}">Nº ${num}</span><span style="color: ${S.texte2}">${esc(chapitre)}</span></span>
${enteteDroite ? `<span style="display: flex; align-items: baseline; gap: 10px; color: ${S.texte2}"><span style="font-family: 'STIX Two Text', serif; font-style: italic; font-size: 30px; letter-spacing: 0; text-transform: none; color: ${accent}">θ</span>Théta</span>` : ''}
</div>

${enHaut ? blocTitre : ''}
${enHaut ? '' : blocTitre}

<div style="position: relative; z-index: 2; margin-top: ${enHaut ? 'auto' : '48px'}; ${piedEtroit ? 'width: 420px; ' : ''}padding-top: 22px; border-top: 1px solid ${S.filet}; display: flex; justify-content: space-between; align-items: center">
<span style="font-size: 24px; font-weight: 500; color: ${S.encre}">${esc(AUTEUR)}</span>
<span style="display: flex; align-items: center; gap: 12px">
${piedEtroit ? '' : `<span style="font-family: 'Geist Mono', monospace; font-size: 22px; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; color: ${S.texte2}">Glissez</span>`}
<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="${accent}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
</span>
</div>

</div>
</body>
</html>
`;
}

const arg = process.argv[2];
if (arg) {
  const sortie = join(racine, 'templates', 'sortie');
  mkdirSync(sortie, { recursive: true });
  const nums = arg === 'tout' ? BANQUE.episodes.map((e) => e.num) : [arg.padStart(2, '0')];
  for (const n of nums) writeFileSync(join(sortie, `couverture-${n}.html`), couverture(n));
  console.log(`${nums.length} couverture(s) écrite(s) dans templates/sortie/`);
}
