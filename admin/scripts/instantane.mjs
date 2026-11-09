// Instantané de la série pour l'admin : lit serie-ml (source de vérité) et le site, écrit
// .instantane/donnees.json et copie les fichiers à consulter (PDF, pages du carrousel, CV, certificats)
// dans .instantane/fichiers/. Lecture seule : rien n'est écrit dans serie-ml ni dans le site.
//
// Lancé avant chaque build (prebuild) et avant `npm run dev`. Sur Vercel, le dépôt entier est cloné :
// ../serie-ml et ../site/theta-kit sont lisibles pendant le build.
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import YAML from 'yaml';

const ICI = path.dirname(fileURLToPath(import.meta.url));
const ADMIN = path.resolve(ICI, '..');
const RACINE = path.resolve(ADMIN, '..');
const SERIE = path.join(RACINE, 'serie-ml');
const SITE = path.join(RACINE, 'site', 'theta-kit');
const SORTIE = path.join(ADMIN, '.instantane');
const FICHIERS = path.join(SORTIE, 'fichiers');

const existe = (p) => fs.existsSync(p);
const lire = (p) => (existe(p) ? fs.readFileSync(p, 'utf8') : null);
const lireYaml = (p, silencieux = false) => {
  const t = lire(p);
  if (t == null) return null;
  try {
    return YAML.parse(t, { schema: 'core', uniqueKeys: false, maxAliasCount: -1 });
  } catch (e) {
    if (!silencieux) console.warn(`instantané : ${path.relative(RACINE, p)} illisible (${e.message.split('\n')[0]})`);
    return null;
  }
};
const lireJson = (p) => (existe(p) ? JSON.parse(fs.readFileSync(p, 'utf8')) : null);
const rel = (p) => path.relative(RACINE, p).split(path.sep).join('/');
const nn = (n) => String(n).padStart(2, '0');

if (!existe(path.join(SERIE, 'etat.yaml'))) {
  // Sans la série (projet Vercel sans les fichiers hors du dossier admin), on garde l'instantané existant.
  if (existe(path.join(SORTIE, 'donnees.json'))) {
    console.warn('instantané : serie-ml introuvable, instantané précédent conservé.');
    process.exit(0);
  }
  fs.mkdirSync(SORTIE, { recursive: true });
  fs.writeFileSync(path.join(SORTIE, 'donnees.json'), JSON.stringify({ indisponible: true, genere_le: new Date().toISOString() }));
  console.warn('instantané : serie-ml introuvable ; l’admin affichera « instantané indisponible ».');
  process.exit(0);
}

fs.rmSync(SORTIE, { recursive: true, force: true });
fs.mkdirSync(FICHIERS, { recursive: true });

/** Copie un fichier de la racine theta-kit dans l'instantané ; renvoie son chemin servi (relatif à la racine). */
function copier(abs) {
  if (!abs || !existe(abs)) return null;
  const r = rel(abs);
  const dest = path.join(FICHIERS, r);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(abs, dest);
  return r;
}

/** Empreinte Git d'un fichier (blob) : sert à refuser d'écraser un fichier modifié depuis l'instantané. */
function blobSha(abs) {
  if (!existe(abs)) return null;
  const octets = fs.readFileSync(abs);
  // Le dépôt est extrait en LF sur Vercel et sur GitHub ; sur Windows, Git normalise aussi à l'ajout.
  const norm = octets.includes(0) ? octets : Buffer.from(octets.toString('binary').replace(/\r\n/g, '\n'), 'binary');
  return crypto.createHash('sha1').update(`blob ${norm.length}\0`).update(norm).digest('hex');
}

// --- Calendrier : portage de serie/calendrier.py (dates_prevues) -------------------------------------------
const JOURS = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];
const MOIS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];

function datesPrevues(cal) {
  const dates = {};
  if (!cal?.date_lancement) return dates;
  const lancement = new Date(`${String(cal.date_lancement).slice(0, 10)}T00:00:00Z`);
  const jourSemaine = (lancement.getUTCDay() + 6) % 7;
  let lundi = new Date(lancement.getTime() - jourSemaine * 86400000);
  const saisons = Object.keys(cal.saisons).map(Number).sort((a, b) => a - b);
  for (const s of saisons) {
    const def = cal.saisons[s];
    const [debut, fin] = def.episodes;
    const aPlacer = [];
    for (let n = debut; n <= fin; n++) aPlacer.push(nn(n));
    if (def.bilan) aPlacer.push(`bilan-${s}`);
    let semaine = 0;
    while (aPlacer.length) {
      const cle = semaine % 2 === 0 ? 'semaine_impaire' : 'semaine_paire';
      const creneaux = (cal.creneaux[cle] ?? [])
        .map(([jour, heure]) => {
          const [h, m] = String(heure).split(':').map(Number);
          return new Date(lundi.getTime() + JOURS.indexOf(jour) * 86400000 + (h * 60 + m) * 60000);
        })
        .sort((a, b) => a - b);
      for (const c of creneaux) {
        const jourC = new Date(Date.UTC(c.getUTCFullYear(), c.getUTCMonth(), c.getUTCDate()));
        if (aPlacer.length && jourC >= lancement) dates[aPlacer.shift()] = c.toISOString();
      }
      lundi = new Date(lundi.getTime() + 7 * 86400000);
      semaine++;
    }
    lundi = new Date(lundi.getTime() + (cal.pause_entre_saisons_semaines ?? 0) * 7 * 86400000);
  }
  // Reports décidés par l'auteur (`serie reporter`) : ils remplacent la date calculée.
  for (const [cle, quand] of Object.entries(cal.reports ?? {})) {
    const k = /^\d+$/.test(cle) ? nn(cle) : cle;
    dates[k] = new Date(`${String(quand).replace(' ', 'T').slice(0, 16)}:00Z`).toISOString();
  }
  return dates;
}

/** « mardi 10 novembre 2026, 8 h 30 (Africa/Abidjan) » → ISO (Abidjan est à UTC). */
function lireDateTexte(txt) {
  const m = /(\d{1,2}) (\p{L}+) (\d{4}), (\d{1,2}) h ?(\d{2})?/u.exec(txt ?? '');
  if (!m) return null;
  const mois = MOIS.indexOf(m[2]);
  if (mois < 0) return null;
  return new Date(Date.UTC(+m[3], mois, +m[1], +m[4], +(m[5] ?? 0))).toISOString();
}

// --- Étapes et empreintes : portage de serie/reprise.py ---------------------------------------------------
const ETAPES = {
  lecture: ['banque/episodes/{NN}-*.yaml'],
  sources: ['banque/episodes/{NN}-*.yaml', 'sources/{NN}/*'],
  contenu: ['contenu/{NN}.yaml', 'charte/glossaire.yaml', 'charte/regles-redaction.md'],
  linkedin: ['contenu/{NN}.yaml'],
  images: ['contenu/{NN}.yaml', 'assets/images/candidats/{NN}/*.yaml'],
  rendu: ['contenu/{NN}.yaml', 'gabarits/*', 'bibliotheque/*.py', 'bibliotheque/*.svg', 'calculs/*.py', 'charte/charte.yaml', 'assets/images/candidats/{NN}/*'],
  verification: ['contenu/{NN}.yaml', 'sources/{NN}/*', 'gabarits/*', 'bibliotheque/*.py', 'charte/charte.yaml'],
  relecture: ['contenu/{NN}.yaml', 'sources/{NN}/*', 'sortie/{NN}/relecture.md'],
  publication: ['contenu/{NN}.yaml', 'sortie/{NN}/*.pdf', 'publier/{NN}/*'],
};

const cacheDossier = new Map();
function lister(dossierRel) {
  if (!cacheDossier.has(dossierRel)) {
    const abs = path.join(SERIE, dossierRel);
    cacheDossier.set(dossierRel, existe(abs) ? fs.readdirSync(abs, { withFileTypes: true }).filter((d) => d.isFile()).map((d) => d.name) : []);
  }
  return cacheDossier.get(dossierRel);
}

/** Motif à un seul niveau (« dossier/préfixe-*.ext »), comme Path.glob de la série. */
function globSerie(motif) {
  const i = motif.lastIndexOf('/');
  const dossier = motif.slice(0, i);
  const nom = motif.slice(i + 1);
  const re = new RegExp('^' + nom.split('*').map((s) => s.replace(/[.+?^${}()|[\]\\]/g, '\\$&')).join('.*') + '$');
  return lister(dossier).filter((f) => re.test(f)).map((f) => `${dossier}/${f}`);
}

/** Tri de pathlib : partie par partie. */
function trierChemins(a, b) {
  const pa = a.split('/');
  const pb = b.split('/');
  for (let i = 0; i < Math.min(pa.length, pb.length); i++) {
    if (pa[i] !== pb[i]) return pa[i] < pb[i] ? -1 : 1;
  }
  return pa.length - pb.length;
}

const cacheHash = new Map();
function hashContenu(r) {
  if (!cacheHash.has(r)) {
    let o = fs.readFileSync(path.join(SERIE, r));
    if (!o.includes(0)) o = Buffer.from(o.toString('binary').replace(/\r\n/g, '\n'), 'binary');
    cacheHash.set(r, crypto.createHash('sha256').update(o).digest());
  }
  return cacheHash.get(r);
}

function empreinte(n, etape) {
  const fichiers = [...new Set(ETAPES[etape].flatMap((m) => globSerie(m.replaceAll('{NN}', n))))].sort(trierChemins);
  const h = crypto.createHash('sha256');
  for (const f of fichiers) {
    h.update(Buffer.from(f, 'utf8'));
    h.update(hashContenu(f));
  }
  return h.digest('hex');
}

function etapesARefaire(n, etapes) {
  const out = [];
  for (const etape of Object.keys(ETAPES)) {
    const fait = etapes?.[etape];
    if (!fait) out.push({ etape, raison: 'pas faite' });
    else if (fait.empreinte !== empreinte(n, etape)) out.push({ etape, raison: 'une entrée a changé depuis' });
  }
  return out;
}

// --- Rapports en Markdown ---------------------------------------------------------------------------------
function decisionsRelecture(texte, n) {
  if (!texte) return [];
  const titres = [...texte.matchAll(/^### (D\d+) · (.+)$/gm)];
  return titres.map((t, i) => {
    const fin = i + 1 < titres.length ? titres[i + 1].index : texte.length;
    const bloc = texte.slice(t.index + t[0].length, fin);
    const champ = (nom) => (new RegExp(`^- \\*\\*${nom}\\*\\* : (.+)$`, 'm').exec(bloc)?.[1] ?? '').trim();
    return {
      id: `${n}-${t[1]}`,
      source: `sortie/${n}/relecture.md`,
      famille: 'relecture',
      episode: n,
      code: t[1],
      titre: t[2].trim(),
      contexte: champ('Constat'),
      recommandation: champ('Option recommandée'),
      options: ['Appliquer la correction recommandée', 'Ne rien changer'],
    };
  });
}

function avertissementsVerification(texte) {
  if (!texte) return null;
  const resultat = /^Résultat : (.+)$/m.exec(texte)?.[1] ?? '';
  const section = (titre) => {
    const m = new RegExp(`^## ${titre}\\s*\\n([\\s\\S]*?)(?=^## |$(?![\\s\\S]))`, 'm').exec(texte);
    return m ? m[1].split('\n').filter((l) => l.startsWith('- ')).map((l) => l.slice(2).trim()) : [];
  };
  return { resultat, erreurs: section('Erreurs?(?: bloquantes?)?'), avertissements: section('Avertissements') };
}

// --- Lecture de la série ----------------------------------------------------------------------------------
const etatBrut = lireYaml(path.join(SERIE, 'etat.yaml')) ?? { episodes: {} };
const cal = lireYaml(path.join(SERIE, 'calendrier.yaml'));
const prevues = datesPrevues(cal);
const siteEpisodes = lireJson(path.join(SITE, 'contenu', 'episodes.json'))?.episodes ?? [];
const affichage = lireJson(path.join(SITE, 'data', 'episodes-affichage.json')) ?? { episodes: {} };
const decisionsChoisies = lireYaml(path.join(SERIE, 'decisions.yaml'))?.decisions ?? {};

const episodes = siteEpisodes.map((se) => {
  const n = se.n;
  const e = etatBrut.episodes?.[n] ?? etatBrut.episodes?.[Number(n)] ?? {};
  const pub = path.join(SERIE, 'publier', n);
  const sor = path.join(SERIE, 'sortie', n);
  const pngs = (d) => (existe(d) ? fs.readdirSync(d).filter((f) => /^page-\d+\.png$/.test(f)).sort().map((f) => copier(path.join(d, f))) : []);
  const pdfDe = (d) => (existe(d) ? fs.readdirSync(d).find((f) => f.endsWith('.pdf')) : null);
  const pdfPub = pdfDe(pub);
  const pdfSor = pdfDe(sor);
  const dateTxt = lire(path.join(pub, 'date.txt'));
  const contenu = existe(path.join(SERIE, 'contenu', `${n}.yaml`)) ? lireYaml(path.join(SERIE, 'contenu', `${n}.yaml`), true) : null;
  const trace = lireYaml(path.join(SERIE, 'publier', 'linkedin', `${n}.yaml`));
  const mesures = lireYaml(path.join(SERIE, 'mesures', `${n}.yaml`));
  const statut = e.statut ?? 'a_faire';
  const relecture = lire(path.join(sor, 'relecture.md'));
  return {
    n,
    saison: se.saison,
    chapitre: se.chapitre,
    titre: se.titre,
    accroche: se.accroche,
    statut,
    publie_le: e.publie_le ? String(e.publie_le).slice(0, 10) : null,
    date_prevue: lireDateTexte(dateTxt) ?? prevues[n] ?? null,
    date_txt: dateTxt?.trim() ?? null,
    a_refaire: e.etapes && Object.keys(e.etapes).length ? etapesARefaire(n, e.etapes) : [],
    themes: affichage.episodes?.[n]?.themes ?? [],
    pdf: copier(pdfPub ? path.join(pub, pdfPub) : pdfSor ? path.join(sor, pdfSor) : null),
    pages: existe(path.join(pub, 'apercus')) ? pngs(path.join(pub, 'apercus')) : pngs(sor),
    post: {
      titre: lire(path.join(pub, 'titre.txt'))?.trim() ?? null,
      texte: lire(path.join(pub, 'texte.txt'))?.trim() ?? (contenu?.linkedin?.texte ?? contenu?.linkedin?.corps)?.trim?.() ?? null,
      commentaire: lire(path.join(pub, 'premier-commentaire.txt'))?.trim() ?? null,
      provisoire: !existe(path.join(pub, 'texte.txt')),
    },
    verification: avertissementsVerification(lire(path.join(sor, 'verification.md'))),
    corrections: lire(path.join(sor, 'corrections.md')),
    decisions: decisionsRelecture(relecture, n).map((d) => d.id),
    trace: trace ? { lien: trace.lien ?? null, publie_a: trace.publie_a ?? null, commentaire: trace.premier_commentaire ?? null } : null,
    mesures: mesures ?? null,
  };
});

// Bilans de saison
const bilans = Object.entries(etatBrut.bilans ?? {}).map(([s, b]) => {
  const pub = path.join(SERIE, 'publier', `bilan-${s}`);
  return {
    cle: `bilan-${s}`,
    saison: Number(s),
    statut: b?.statut ?? 'a_faire',
    publie_le: b?.publie_le ? String(b.publie_le).slice(0, 10) : null,
    date_prevue: lireDateTexte(lire(path.join(pub, 'date.txt'))) ?? prevues[`bilan-${s}`] ?? null,
    pdf: copier(existe(pub) ? path.join(pub, fs.readdirSync(pub).find((f) => f.endsWith('.pdf')) ?? '_') : null),
  };
});

// --- Labos ------------------------------------------------------------------------------------------------
const conceptionLabos = lire(path.join(SERIE, 'conception', 'labos-saison-1.txt')) ?? '';
const series = lire(path.join(SITE, 'lib', 'engines', 'labo-series.js')) ?? '';
const liensTs = lire(path.join(SITE, 'lib', 'liens.ts')) ?? '';
const themesSite = JSON.parse((/THEMES = (\[[^\]]*\])/.exec(liensTs)?.[1] ?? '[]').replace(/'/g, '"'));
const messagesFr = lireJson(path.join(SITE, 'messages', 'fr.json')) ?? {};
const nomsLabos = messagesFr?.labo?.themes ?? {};
const recette = lireYaml(path.join(SERIE, 'labos', 'recette.yaml'))?.labos ?? {};

function blocSerie(id) {
  const re = new RegExp(`^ {4}${id}: \\{`, 'm');
  const m = re.exec(series);
  if (!m) return '';
  const suite = series.slice(m.index + m[0].length);
  const fin = /^ {4}[a-z0-9]+: \{/m.exec(suite);
  return fin ? suite.slice(0, fin.index) : suite;
}

// Tableau « État des lieux » de labos-saison-1.txt : la conception prévue des labos 12 à 19.
const prevus = [];
for (const l of conceptionLabos.split(/\r?\n/)) {
  const m = /^ {2}(\d{2}) {2}(.+?) {2,}([a-z0-9]+)(?: \(\d+b\))? {2,}(.+?)(?: {2,}(\d{2}\/\d{2}\/\d{4}))?\s*$/.exec(l);
  if (m) prevus.push({ n: m[1], notion: m[2].trim(), id: m[3], etat: m[4].trim() });
  const s = /^ {30,}([a-z0-9]+) \((\d+b)\) {2,}(.+?)\s*$/.exec(l);
  if (s) prevus.push({ n: prevus.at(-1)?.n ?? '', notion: '', id: s[1], etat: s[3].trim() });
}

const idsLabos = [];
for (const ep of episodes) for (const id of ep.themes) if (!idsLabos.find((x) => x.id === id)) idsLabos.push({ id, n: ep.n });
for (const p of prevus) if (!idsLabos.find((x) => x.id === p.id)) idsLabos.push({ id: p.id, n: p.n });

const labos = idsLabos.map(({ id, n }) => {
  const bloc = blocSerie(id);
  const ep = episodes.find((e) => e.n === n);
  const plan = prevus.find((p) => p.id === id);
  return {
    id,
    n,
    titre: nomsLabos[id] ?? plan?.notion ?? ep?.titre ?? id,
    scene: themesSite.includes(id),
    parcours: /\bparcours\s*:/.test(bloc),
    quiz: /\bquiz\s*:/.test(bloc),
    conception: plan?.etat ?? null,
    date_ouverture: ep?.date_prevue ?? null,
    publie_le: ep?.publie_le ?? null,
    recette: recette[id] ?? null,
  };
});

// La recette de la section 8 de labos-saison-1.txt, case par case.
function modeleRecette(texte) {
  const debut = texte.indexOf('8. RECETTE');
  if (debut < 0) return [];
  const lignes = texte.slice(debut).split(/\r?\n/).slice(2);
  const groupes = [];
  let item = null;
  for (const l of lignes) {
    if (/^Le but, en une ligne/.test(l)) break;
    const g = /^([A-ZÉ][\p{L} ]+)$/u.exec(l);
    if (g) {
      groupes.push({ titre: g[1].trim(), cases: [] });
      item = null;
      continue;
    }
    const c = /^ {2}\[ \] (.+)$/.exec(l);
    if (c && groupes.length) {
      item = { id: '', texte: c[1].trim() };
      groupes.at(-1).cases.push(item);
      continue;
    }
    if (item && /^ {6}\S/.test(l)) item.texte += ' ' + l.trim();
  }
  for (const g of groupes) g.cases.forEach((c, i) => (c.id = `${g.titre.toLowerCase().normalize('NFD').replace(/[^a-z]/g, '')}-${i + 1}`));
  return groupes;
}

// --- Décisions --------------------------------------------------------------------------------------------
function decisionsTexte(texte, entete, prefixe, famille) {
  const debut = texte.indexOf(entete);
  if (debut < 0) return [];
  const lignes = texte.slice(debut).split(/\r?\n/);
  const out = [];
  for (const l of lignes.slice(1)) {
    if (/^={5,}/.test(l) && out.length) break;
    const m = /^ {2}([A-Z]\d+)\. (.+)$/.exec(l);
    if (m) out.push({ code: m[1], texte: m[2].trim() });
    else if (out.length && /^ {6}\S/.test(l)) out.at(-1).texte += ' ' + l.trim();
  }
  return out.map((d) => {
    const reco = /Recommandé\s*:\s*([^.?]+)/.exec(d.texte)?.[1]?.trim() ?? '';
    return { id: `${prefixe}-${d.code}`, famille, code: d.code, titre: d.texte, contexte: '', recommandation: reco, options: [], source: famille === 'labos' ? 'conception/labos-saison-1.txt' : 'conception/espace-admin.txt' };
  });
}

function ambiguitesOuvertes(texte) {
  if (!texte) return [];
  const titres = [...texte.matchAll(/^### (A\d+) · (.+)$/gm)];
  return titres
    .map((t, i) => {
      const fin = i + 1 < titres.length ? titres[i + 1].index : texte.length;
      const bloc = texte.slice(t.index, fin);
      const champ = (nom) => (new RegExp(`^\\| ${nom} \\| (.+?) \\|\\s*$`, 'm').exec(bloc)?.[1] ?? '').trim();
      return {
        id: t[1], famille: 'ambiguite', code: t[1], titre: t[2].trim(), contexte: champ('Question'),
        recommandation: champ('Choix provisoire'), options: champ('Options') ? [champ('Options')] : [], statut_source: champ('Statut'), source: 'AMBIGUITES.md',
      };
    })
    .filter((a) => a.statut_source && !/^(Résolue|Fermée|Close|Tranchée)/i.test(a.statut_source));
}

const toutesDecisions = [
  ...episodes.flatMap((e) => decisionsRelecture(lire(path.join(SERIE, 'sortie', e.n, 'relecture.md')), e.n)),
  ...decisionsTexte(conceptionLabos, '7. DÉCISIONS À TRANCHER', 'labos', 'labos'),
  ...ambiguitesOuvertes(lire(path.join(SERIE, 'AMBIGUITES.md'))),
].map((d) => ({ ...d, choix: decisionsChoisies[d.id] ?? null }));

// --- Publication ------------------------------------------------------------------------------------------
const pilote = (lire(path.join(SERIE, 'publier', 'linkedin', 'pilote.txt')) ?? 'windows').trim().split(/\s/)[0];
const jetonTxt = lire(path.join(SERIE, 'publier', 'linkedin', 'jeton.txt'));
const journalAdmin = lireYaml(path.join(SERIE, 'publier', 'linkedin', 'journal-admin.yaml'))?.gestes ?? [];

// --- Profil du site ---------------------------------------------------------------------------------------
const DATA = path.join(SITE, 'data');
const fichiersProfil = ['profil.json', 'parcours.json', 'certificats.json', 'projets.json', 'sections.json'];
const profil = Object.fromEntries(
  fichiersProfil.map((f) => [f.replace('.json', ''), { chemin: `site/theta-kit/data/${f}`, sha: blobSha(path.join(DATA, f)), contenu: lireJson(path.join(DATA, f)) }]),
);
const cvAbs = path.join(SITE, 'public', 'cv', 'CV-Ladji-Lama-Kamagate-ML.pdf');
const cv = existe(cvAbs) ? { chemin: copier(cvAbs), taille: fs.statSync(cvAbs).size, sha: blobSha(cvAbs) } : null;
const dossierCertifs = path.join(SITE, 'public', 'certificats');
const certificatsFichiers = existe(dossierCertifs) ? fs.readdirSync(dossierCertifs).map((f) => copier(path.join(dossierCertifs, f))) : [];

// --- Git --------------------------------------------------------------------------------------------------
function git(...args) {
  try {
    return execFileSync('git', args, { cwd: RACINE, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch {
    return null;
  }
}
const commit = process.env.VERCEL_GIT_COMMIT_SHA ?? git('rev-parse', 'HEAD');
const commitDate = git('log', '-1', '--format=%cI') ?? null;
const cvDate = git('log', '-1', '--format=%cI', '--', 'site/theta-kit/public/cv/CV-Ladji-Lama-Kamagate-ML.pdf');

const donnees = {
  genere_le: new Date().toISOString(),
  commit,
  commit_date: commitDate,
  calendrier: {
    lancement: cal?.date_lancement ? String(cal.date_lancement).slice(0, 10) : null,
    fuseau: cal?.fuseau ?? 'Africa/Abidjan',
    avance_min: cal?.avance_minimum_episodes_relus ?? 4,
    reports: cal?.reports ?? {},
  },
  episodes,
  bilans,
  labos,
  recette_modele: modeleRecette(conceptionLabos),
  decisions: toutesDecisions,
  publication: { pilote, jeton_expire: jetonTxt?.trim() || null, journal: journalAdmin },
  profil,
  cv: cv ? { ...cv, modifie_le: cvDate } : null,
  certificats_fichiers: certificatsFichiers,
};

fs.writeFileSync(path.join(SORTIE, 'donnees.json'), JSON.stringify(donnees));
const taille = (d) => fs.readdirSync(d, { withFileTypes: true }).reduce((s, x) => s + (x.isDirectory() ? taille(path.join(d, x.name)) : fs.statSync(path.join(d, x.name)).size), 0);
console.log(
  `instantané : ${episodes.length} épisodes, ${labos.length} labos, ${toutesDecisions.length} décisions, ` +
    `${(taille(SORTIE) / 1e6).toFixed(1)} Mo de fichiers.`,
);
