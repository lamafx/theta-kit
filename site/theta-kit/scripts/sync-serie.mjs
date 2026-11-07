// Lit serie-ml (source de vérité) et produit ce dont le site a besoin :
//   contenu/episodes.json, public/pdf/theta-NN.pdf, public/covers/theta-NN.webp.
// Lecture seule côté serie-ml. À relancer après chaque épisode relu : npm run sync
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import sharp from 'sharp';

const ICI = path.dirname(fileURLToPath(import.meta.url));
const SITE = path.resolve(ICI, '..');
const SERIE = path.resolve(SITE, '..', '..', 'serie-ml');
// PyYAML est le lecteur de la série : certains fichiers ne passent pas avec les lecteurs JavaScript stricts.
const BRUT = JSON.parse(execFileSync(process.env.PYTHON || 'python', [path.join(ICI, 'lire_yaml.py'), SERIE], { encoding: 'utf8', maxBuffer: 1 << 28 }));
const yamlDe = (rel) => BRUT[rel];
// Décision de l'auteur : les chiffres du mémoire NGONI ne figurent pas sur le site.
const CHIFFRES_NGONI = /1\s?919|2\s?041|19 intentions/;
const MOIS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];

/** « mardi 10 novembre 2026, 8 h 30 (Africa/Abidjan) » → ISO. Abidjan est à UTC toute l'année. */
function lireDate(txt) {
  const m = /(\d{1,2}) (\p{L}+) (\d{4}), (\d{1,2}) h (\d{2})/u.exec(txt);
  if (!m) throw new Error(`date illisible : ${txt}`);
  const mois = MOIS.indexOf(m[2]);
  if (mois < 0) throw new Error(`mois illisible : ${m[2]}`);
  return new Date(Date.UTC(+m[3], mois, +m[1], +m[4], +m[5])).toISOString();
}

/** Retire les marqueurs de formule de la série et pose l'apostrophe typographique. */
const propre = (s) => String(s ?? '').replace(/\$/g, '').replace(/\s*\n\s*/g, ' ').replace(/'/g, '’').trim();

function lireSources(txt) {
  const out = [];
  for (const l of txt.split(/\r?\n/)) {
    const m = /^-\s*(.+?)\s*:\s*(https?:\/\/\S+)\s*$/.exec(l);
    if (m) out.push({ libelle: propre(m[1]), url: m[2] });
  }
  return out;
}

function lirePost(txt) {
  const lignes = txt.trim().split(/\r?\n/);
  const derniere = lignes[lignes.length - 1] ?? '';
  const hashtags = derniere.trim().startsWith('#') ? derniere.trim().split(/\s+/) : [];
  if (hashtags.length) lignes.pop();
  return { texte: lignes.join('\n').trim().replace(/'/g, '’'), hashtags };
}

function lirePages(contenu) {
  const pages = [];
  let fin = null;
  for (const p of contenu.pages ?? []) {
    if (p.type === 'fin') {
      fin = {
        points: (p.points ?? []).map(propre),
        verification: p.verification ? { question: propre(p.verification.question), page: p.verification.page } : null,
      };
    } else if (p.type !== 'couverture') {
      pages.push({
        role: propre(p.role ?? ''),
        titre: propre(p.titre),
        texte: propre(p.texte),
      });
    }
  }
  return { pages, fin };
}

const fiches = Object.keys(BRUT).filter((f) => f.startsWith('banque/episodes/')).sort();
const etat = yamlDe('etat.yaml').episodes;
const calendrier = yamlDe('calendrier.yaml');
const LISIBLES = new Set(['relu', 'publie', 'mesure']);
fs.mkdirSync(path.join(SITE, 'public', 'pdf'), { recursive: true });
fs.mkdirSync(path.join(SITE, 'public', 'covers'), { recursive: true });

const episodes = [];
for (const f of fiches) {
  const fiche = yamlDe(f);
  const n = String(fiche.numero).padStart(2, '0');
  const statut = etat[n]?.statut ?? 'a_faire';
  const ep = {
    n,
    saison: fiche.saison,
    chapitre: { numero: fiche.chapitre.numero, titre: propre(fiche.chapitre.titre) },
    titre: propre(fiche.titre),
    accroche: propre(fiche.accroche),
    statut,
    pret: false,
  };
  const dossier = path.join(SERIE, 'publier', n);
  if (LISIBLES.has(statut) && fs.existsSync(path.join(dossier, 'date.txt'))) {
    const pdf = fs.readdirSync(dossier).find((x) => x.endsWith('.pdf'));
    const apercus = fs.readdirSync(path.join(dossier, 'apercus')).filter((x) => x.endsWith('.png')).sort();
    if (!pdf || !apercus.length) throw new Error(`épisode ${n} relu mais sans PDF ou aperçu`);
    fs.copyFileSync(path.join(dossier, pdf), path.join(SITE, 'public', 'pdf', `theta-${n}.pdf`));
    await sharp(path.join(dossier, 'apercus', apercus[0]))
      .resize({ width: 1080 }).webp({ quality: 82 })
      .toFile(path.join(SITE, 'public', 'covers', `theta-${n}.webp`));
    await sharp(path.join(dossier, 'apercus', apercus[0]))
      .resize({ width: 1080 }).jpeg({ quality: 84 })
      .toFile(path.join(SITE, 'public', 'covers', `theta-${n}.jpg`));
    const contenu = yamlDe(`contenu/${n}.yaml`);
    const post = lirePost(fs.readFileSync(path.join(dossier, 'texte.txt'), 'utf8'));
    const lus = lirePages(contenu);
    if (CHIFFRES_NGONI.test(JSON.stringify(lus))) console.warn(`Nº ${n} : chiffres NGONI dans les pages, à vérifier.`);
    const postMasque = CHIFFRES_NGONI.test(post.texte);
    if (postMasque) console.warn(`Nº ${n} : post non repris sur le site (chiffres NGONI).`);
    Object.assign(ep, {
      pret: true,
      date: lireDate(fs.readFileSync(path.join(dossier, 'date.txt'), 'utf8')),
      publie_le: etat[n]?.publie_le ?? null,
      nb_pages: apercus.length,
      ...lus,
      post: postMasque ? null : post.texte,
      hashtags: post.hashtags,
      sources: lireSources(fs.readFileSync(path.join(dossier, 'premier-commentaire.txt'), 'utf8')),
    });
  }
  episodes.push(ep);
}

const postsParSemaine = (calendrier.creneaux.semaine_impaire ?? []).length;
const sortie = {
  _note: 'Fichier généré par scripts/sync-serie.mjs depuis serie-ml. Ne pas modifier à la main.',
  total: episodes.length,
  posts_par_semaine: postsParSemaine,
  lancement: String(calendrier.date_lancement).slice(0, 10),
  fuseau: calendrier.fuseau,
  episodes,
};
fs.writeFileSync(path.join(SITE, 'contenu', 'labos.json'), JSON.stringify(BRUT.__labos) + '\n', 'utf8');
fs.writeFileSync(path.join(SITE, 'contenu', 'episodes.json'), JSON.stringify(sortie, null, 2) + '\n', 'utf8');
console.log(`${episodes.length} épisodes lus, ${episodes.filter((e) => e.pret).length} prêts, ${postsParSemaine} posts par semaine.`);
