// Labos des épisodes qui ne se lisent pas sur une surface de coût (Nº 01 à 05 et 11).
// Les ventes d'Ames viennent de serie-ml (calculs/ames.py), via contenu/labos.json. Les points d'illustration
// des Nº 01 et 03 sont fictifs et présentés comme tels.
const PLAT = { kind: '2d', J: () => 0, G: () => [0, 0], ra: 1.75, rb: 1.15, s: 1, sy: 0, base: -0.55, jmin: 0, jmax: 1, k: 0.16, sansAxes: true };
const MAX_X = 3;
const MAX_Y = 300;
const XP = (x) => -PLAT.ra + (x / MAX_X) * 2 * PLAT.ra;
const ZP = (y) => PLAT.rb - (y / MAX_Y) * 2 * PLAT.rb;
const XI = (p) => ((p + PLAT.ra) / (2 * PLAT.ra)) * MAX_X;

function nuage(cx, cz, n, graine) {
  const pts = [];
  for (let i = 0; i < n; i++) {
    const a = Math.abs(Math.sin((i + 1) * 12.9898 + graine) * 43758.5453) % 1;
    const r = Math.abs(Math.sin((i + 1) * 78.233 + graine) * 12543.123) % 1;
    const t = a * Math.PI * 2;
    pts.push([cx + Math.cos(t) * r * 0.5, cz + Math.sin(t) * r * 0.42]);
  }
  return pts;
}
const SPAM = nuage(-0.85, 0.35, 14, 1);
const NON = nuage(0.8, -0.35, 14, 2);
const dist = (p, q) => Math.hypot(p[0] - q[0], p[1] - q[1]);
const proche = (p, liste) => liste.reduce((m, q) => Math.min(m, dist(p, q)), Infinity);

function sphere(e, g, x, z, mat, h = 0.05, k = 1.15) {
  const m = new e.T.Mesh(e.geo.dot, mat);
  m.position.set(x, PLAT.base + h, z);
  m.scale.setScalar(k);
  g.add(m);
}

/** Dessine ŷ = a·x + b sur le plan, coupée aux bords du graphique. */
function droite(e, a, b) {
  const T = e.T;
  let x0 = 0;
  let x1 = MAX_X;
  if (Math.abs(a) > 1e-6) {
    const u = (0 - b) / a;
    const v = (MAX_Y - b) / a;
    x0 = Math.max(x0, Math.min(u, v));
    x1 = Math.min(x1, Math.max(u, v));
  }
  if (x1 <= x0) return;
  const p0 = new T.Vector3(XP(x0), PLAT.base + 0.05, ZP(a * x0 + b));
  const p1 = new T.Vector3(XP(x1), PLAT.base + 0.05, ZP(a * x1 + b));
  const d = p1.clone().sub(p0);
  e.placeBar(e.tan, p0.clone().add(p1).multiplyScalar(0.5), d, d.length());
}

function axes(e, g) {
  const T = e.T;
  e.staticTag(g, e.L('surface'), new T.Vector3(PLAT.ra - 0.25, PLAT.base + 0.14, PLAT.rb + 0.12));
  e.staticTag(g, e.L('prix'), new T.Vector3(-PLAT.ra - 0.12, PLAT.base + 0.14, -PLAT.rb + 0.1));
}

function vueNuage(e, a, b, titre) {
  const C = e.C;
  const X = (x) => 26 + (x / MAX_X) * 262;
  const Y = (y) => 176 - (y / MAX_Y) * 160;
  const dots = e.props.labos.echantillon.map((q) => ({ x: Math.round(X(q[0]) * 10) / 10, y: Math.round(Y(q[1]) * 10) / 10, r: 1.8, f: C.light }));
  const lines = [{ d: 'M26 178 L292 178', s: C.grid, w: 1, dash: 'none', m: 'none', o: 1 }, { d: 'M26 178 L26 12', s: C.grid, w: 1, dash: 'none', m: 'none', o: 1 }];
  const y0 = Math.max(0, Math.min(MAX_Y, b));
  const y1 = Math.max(0, Math.min(MAX_Y, a * MAX_X + b));
  lines.push({ d: `M${X(0)} ${Y(y0)} L${X(MAX_X)} ${Y(y1)}`, s: C.white, w: 1.8, dash: 'none', m: 'none', o: 1 });
  return { title: titre, lines, dots, texts: [{ x: 292, y: 193, t: e.L('surface'), f: C.muted, a: 'end' }, { x: 30, y: 12, t: e.L('prix'), f: C.muted, a: 'start' }] };
}

function vueGroupes(e, listes, moi, titre) {
  const C = e.C;
  const X = (p) => 150 + (p / PLAT.ra) * 122;
  const Y = (z) => 95 + (z / PLAT.rb) * 80;
  const dots = [];
  listes.forEach(([pts, f]) => pts.forEach((q) => dots.push({ x: Math.round(X(q[0])), y: Math.round(Y(q[1])), r: 3, f })));
  dots.push({ x: Math.round(X(moi[0])), y: Math.round(Y(moi[1])), r: 5, f: C.white });
  return { title: titre, lines: [], dots, texts: [] };
}

/** Le robot a bougé depuis le début de l'étape. */
const bouge = (e, seuil = 0.3) => !!(e.snap.p && e.params && dist(e.params, e.snap.p) > seuil);

export function themesSerie(e) {
  const C = e.C;
  const L = (s) => e.L(s);
  const f = (v, d) => e.fmt(v, d);
  const A = e.props.labos.ames;
  const J = (a, b) => (a * a * A.sxx + 2 * a * b * A.sx + b * b - 2 * a * A.sxy - 2 * b * A.sy + A.syy);
  const pts = e.props.labos.echantillon;
  const mae = (a, b) => pts.reduce((s, q) => s + Math.abs(a * q[0] + b - q[1]), 0) / pts.length;
  const VENTES = e.props.labos.ventes;

  return {
    exemples: {
      ...PLAT, id: 'exemples', num: '01', badge: '01', title: L('Apprendre d’exemples'), tab: L('Exemples'), sub: L('Un cas nouveau'),
      start: [0, 0], formula: L('exemples → modèle'), ctl: {},
      idea: L('Ces mails sont déjà triés (points d’illustration). Le modèle donne à un cas nouveau la réponse de l’exemple le plus proche. Déplacez le robot : c’est le nouveau mail.'),
      goal: L('obtenez les deux réponses, puis placez le robot loin de tout exemple.'),
      legend: [[C.bronze, L('spam')], [C.light, L('non-spam')], [C.white, L('nouveau mail')]],
      reset: () => { e.ex = { spam: false, non: false }; },
      deco: (g) => { SPAM.forEach((q) => sphere(e, g, q[0], q[1], e.mat.gBronze)); NON.forEach((q) => sphere(e, g, q[0], q[1], e.mat.gLight)); },
      ui: () => {
        const p = e.params;
        const dS = proche(p, SPAM);
        const dN = proche(p, NON);
        const d = Math.min(dS, dN);
        const rep = dS < dN ? 'spam' : 'non';
        const loin = d > 0.62;
        if (!loin) e.ex[rep] = true;
        e.vu01 = { rep, loin };
        const nom = rep === 'spam' ? L('spam') : L('non-spam');
        return {
          S: [[L('réponse'), nom], [L('distance'), f(d)]],
          calc: [L('exemple le plus proche à ') + f(d), L('spam à ') + f(dS) + ', ' + L('non-spam à ') + f(dN)],
          msg: loin ? L('Loin de ses exemples, rien ne garantit sa réponse.') : L('Près de ses exemples, le modèle prédit la réponse d’un cas nouveau.'),
          ok: e.ex.spam && e.ex.non && loin,
        };
      },
      chart: () => vueGroupes(e, [[SPAM, C.bronze], [NON, C.light]], e.params, L('Vue de dessus : les exemples')),
      parcours: [
        {
          titre: 'Des exemples déjà triés',
          regarde: 'Chaque boule est un mail déjà trié : bronze pour spam, bleu clair pour non-spam. Ce sont les exemples, chacun avec sa réponse. Le robot, lui, est un mail nouveau.',
          faire: 'Faites glisser le robot au milieu des boules bronze.',
          fait: () => bouge(e) && e.vu01 && e.vu01.rep === 'spam' && !e.vu01.loin,
          compris: 'Le modèle donne au mail nouveau la réponse de l’exemple le plus proche : spam. Personne n’a écrit de règle comme « contient le mot gratuit » : la réponse vient des exemples.',
        },
        {
          titre: 'L’autre réponse',
          regarde: 'Même modèle, mêmes exemples. Seule la position du mail nouveau change.',
          faire: 'Amenez le robot parmi les boules bleu clair.',
          fait: () => bouge(e) && e.vu01 && e.vu01.rep === 'non' && !e.vu01.loin,
          compris: 'Réponse : non-spam. C’est la différence de l’épisode : un programme classique suit des règles écrites à la main, le Machine Learning tire son modèle d’exemples.',
        },
        {
          titre: 'Loin des exemples',
          regarde: 'Le modèle n’a vu qu’un nombre limité d’exemples. Que fait-il face à un cas qui ne ressemble à aucun ?',
          faire: 'Placez le robot loin de toutes les boules, vers un bord.',
          fait: () => e.vu01 && e.vu01.loin,
          compris: 'Le modèle répond quand même, mais rien ne garantit sa réponse : aucun exemple ne lui ressemble. Loin de ses exemples, ses erreurs peuvent augmenter.',
        },
      ],
      quiz: {
        question: 'D’où le Machine Learning tire-t-il un modèle ?',
        choix: ['De règles écrites à la main', 'D’exemples dont on connaît la réponse', 'Du hasard'],
        bonne: 1,
        explication: 'Juste : le modèle est tiré d’exemples. Ici, chaque mail avait déjà sa réponse, spam ou non-spam : c’est l’apprentissage supervisé.',
      },
    },

    donnees: {
      ...PLAT, id: 'donnees', num: '02', badge: '02', title: L('Une ligne de tableau'), tab: L('Données'), sub: L('Trois ventes d’Ames, 2010'),
      start: [-1.2, 0.6], formula: L('caractéristiques → étiquette'), ctl: { bascule: true },
      idea: L('Chaque rangée est un exemple, chaque colonne une caractéristique, la dernière l’étiquette. Passez le robot sur le tableau, puis changez la façon de coder le quartier.'),
      goal: L('passez à une colonne par quartier, puis amenez le robot sur l’étiquette.'),
      legend: [[C.light, L('caractéristique')], [C.blue, L('quartier')], [C.bronze, L('étiquette')]],
      reset: () => { e.un = false; e.vu02 = { r: new Set(), c: new Set() }; },
      rejouer: () => { e.un = false; e.vu02 = { r: new Set(), c: new Set() }; },
      colonnes: () => {
        const q = VENTES.map((v) => v.quartier);
        const base = [[L('surface'), VENTES.map((v) => v.surface), 'c', ' m²'], [L('chambres'), VENTES.map((v) => v.chambres), 'c', '']];
        const code = e.un ? q.map((nom) => [nom, q.map((x) => (x === nom ? 1 : 0)), 'q', '']) : [[L('quartier'), [1, 2, 3], 'q', '']];
        return [...base, ...code, [L('prix'), VENTES.map((v) => v.prix), 'e', ' M']];
      },
      cellule: () => {
        const cols = e.th().colonnes();
        const c = Math.max(0, Math.min(cols.length - 1, Math.round(((e.params[0] + 1.5) / 3) * (cols.length - 1))));
        const r = Math.max(0, Math.min(2, Math.round((e.params[1] + 0.6) / 0.6)));
        return { cols, c, r };
      },
      deco: (g) => {
        const T = e.T;
        const cols = e.th().colonnes();
        cols.forEach((col, c) => {
          const x = -1.5 + (3 * c) / (cols.length - 1);
          const max = Math.max(...col[1], 1);
          col[1].forEach((v, r) => {
            const h = Math.max(0.02, (v / max) * 0.8);
            const m = new T.Mesh(new T.BoxGeometry(0.24, h, 0.24), col[2] === 'e' ? e.mat.gBronze : col[2] === 'q' ? e.mat.gBlue : e.mat.gLight);
            m.position.set(x, PLAT.base + h / 2, -0.6 + r * 0.6);
            g.add(m);
          });
          e.staticTag(g, col[0], new T.Vector3(x, PLAT.base + 0.12, 1.02));
        });
      },
      bascule: () => ({ label: e.un ? L('Numéroter les quartiers') : L('Une colonne par quartier'), on: e.un, fn: () => { e.un = !e.un; e.redeco(); } }),
      ui: () => {
        const { cols, c, r } = e.th().cellule();
        const col = cols[c];
        const v = VENTES[r];
        e.vu02 = e.vu02 || { r: new Set(), c: new Set() };
        e.vu02.r.add(r);
        e.vu02.c.add(col[2] + ':' + col[0]);
        e.vu02.ici = col[2];
        const msg = col[2] === 'e' ? L('Le prix est l’étiquette : la réponse à apprendre.')
          : col[2] === 'q' ? (e.un ? L('Une colonne par quartier : la maison y vaut 1 ou 0, sans ordre inventé.') : L('Piège : avec des numéros, Old Town peut être lu comme trois fois North Ames.'))
            : L('Une caractéristique : la même information pour toutes les maisons.');
        return {
          S: [[L('exemple'), v.quartier], [col[0], String(col[1][r]) + col[3]]],
          calc: VENTES.map((x) => `${x.surface} m², ${x.chambres} ${L('ch.')}, ${x.quartier}, ${x.prix} M FCFA`),
          msg, ok: e.un && col[2] === 'e',
        };
      },
      chart: () => ({ title: L('Le tableau'), lines: [], dots: [], texts: e.th().colonnes().map((col, i) => ({ x: 8, y: 26 + i * 24, t: `${col[0]} : ${col[1].join(' · ')}`, f: col[2] === 'e' ? C.bronze : C.pale, a: 'start' })) }),
      parcours: [
        {
          titre: 'Un exemple, c’est une ligne',
          regarde: 'Trois ventes réelles d’Ames, aux États-Unis, en 2010. Chaque rangée de barres est une maison ; la hauteur d’une barre, sa valeur.',
          faire: 'Faites passer le robot d’une rangée à une autre.',
          debut: () => { e.vu02 = { r: new Set(), c: new Set() }; },
          fait: () => e.vu02 && e.vu02.r.size >= 2,
          compris: 'Chaque rangée est un exemple. Pour le modèle, une maison n’est qu’une ligne de nombres : surface, chambres, quartier, puis prix.',
        },
        {
          titre: 'Les caractéristiques',
          regarde: 'Les colonnes en bleu clair décrivent les maisons : la même information pour toutes.',
          faire: 'Passez le robot sur la colonne surface, puis sur la colonne chambres.',
          debut: () => { e.vu02.c = new Set(); },
          fait: () => e.vu02 && [...e.vu02.c].filter((k) => k.startsWith('c:')).length >= 2,
          compris: 'Ce sont des caractéristiques : les variables d’entrée, ce que le modèle reçoit pour décider.',
        },
        {
          titre: 'L’étiquette',
          regarde: 'La dernière colonne, en bronze, n’est pas une entrée comme les autres.',
          faire: 'Amenez le robot sur la colonne prix.',
          fait: () => e.vu02 && e.vu02.ici === 'e',
          compris: 'Le prix est l’étiquette : la réponse à apprendre. En apprentissage supervisé, chaque exemple a la sienne.',
        },
        {
          titre: 'Un quartier n’est pas une quantité',
          regarde: 'Le quartier est codé par un numéro : 1, 2, 3. Beaucoup de modèles ne lisent que des nombres, et risquent de lire ces numéros comme des quantités.',
          faire: 'Appuyez sur « Une colonne par quartier ».',
          fait: () => !!e.un,
          compris: 'Avec des numéros, Old Town pouvait compter trois fois plus que North Ames. Avec une colonne par quartier, la maison vaut 1 dans la sienne et 0 ailleurs : plus d’ordre inventé.',
        },
      ],
      quiz: {
        question: 'Pour les maisons, quelle colonne est l’étiquette ?',
        choix: ['La surface', 'Le quartier', 'Le prix'],
        bonne: 2,
        explication: 'Juste : le prix est la réponse à apprendre. Surface, chambres et quartier sont les caractéristiques qui servent à le prédire.',
      },
    },

    familles: {
      ...PLAT, id: 'familles', num: '03', badge: '03', title: L('Trois familles'), tab: L('Familles'), sub: L('Avec, sans réponse, ou en agissant'),
      start: [0, 0], formula: L('supervisé · non supervisé · renforcement'), ctl: { bascule: true, play: true },
      idea: L('Mêmes points d’illustration, trois façons d’apprendre. Changez de famille, puis lancez : le modèle retrouve l’étiquette, cherche des groupes, ou agit et reçoit un retour.'),
      goal: L('essayez les trois familles jusqu’au bout.'),
      legend: [[C.bronze, L('groupe A')], [C.light, L('groupe B')], [C.blue, L('cible')]],
      reset: () => { e.fam = e.fam || 'sup'; e.vus = e.vus || {}; e.trouve = false; e.retour = 0; e.pref = [0, 0, 0, 0]; },
      deco: (g) => {
        const brut = e.fam === 'non' && !e.trouve;
        SPAM.forEach((q) => sphere(e, g, q[0], q[1], brut ? e.mat.metal : e.mat.gBronze));
        NON.forEach((q) => sphere(e, g, q[0], q[1], brut ? e.mat.metal : e.mat.gLight));
        if (e.fam === 'ren') sphere(e, g, 1.35, -0.85, e.mat.gBlue, 0.1, 3);
      },
      bascule: () => ({
        label: { sup: L('Famille : supervisé'), non: L('Famille : non supervisé'), ren: L('Famille : renforcement') }[e.fam],
        on: false,
        fn: () => { const fam = { sup: 'non', non: 'ren', ren: 'sup' }[e.fam]; e.fam = fam; e.resetPos(); e.redeco(); },
      }),
      pas: () => {
        e.steps += 1;
        if (e.fam === 'sup') { e.vus.sup = true; e.setState({ playing: false }); return; }
        if (e.fam === 'non') { e.trouve = true; e.vus.non = true; e.redeco(); e.setState({ playing: false }); return; }
        const cible = [1.35, -0.85];
        const dirs = [[0.22, 0], [-0.22, 0], [0, 0.22], [0, -0.22]];
        const i = Math.random() < 0.3 ? Math.floor(Math.random() * 4) : e.pref.indexOf(Math.max(...e.pref));
        const np = e.clampP([e.params[0] + dirs[i][0], e.params[1] + dirs[i][1]]);
        e.retour = dist(np, cible) < dist(e.params, cible) ? 1 : -1;
        e.pref[i] += e.retour;
        e.animTo(np, 0.14, 0.05);
        if (dist(np, cible) < 0.2) { e.vus.ren = true; e.setState({ playing: false }); }
      },
      ui: () => {
        const nb = ['sup', 'non', 'ren'].filter((k) => e.vus[k]).length;
        const msg = e.fam === 'sup' ? L('Supervisé : chaque exemple a son étiquette, le modèle apprend à la retrouver.')
          : e.fam === 'non' ? (e.trouve ? L('Non supervisé : sans étiquette, le modèle a trouvé une structure, ici deux groupes.') : L('Non supervisé : pas d’étiquette. Lancez pour chercher une structure.'))
            : L('Par renforcement : le système agit, reçoit un retour, recommence.');
        return {
          S: [[L('familles vues'), `${nb}/3`], [L('pas'), String(e.steps)]].concat(e.fam === 'ren' ? [[L('retour'), e.retour > 0 ? '+1' : e.retour < 0 ? '−1' : '0']] : []),
          calc: [L('Supervisé : données + étiquettes'), L('Non supervisé : données seules'), L('Renforcement : action, retour, nouvelle action')],
          msg, ok: nb === 3,
        };
      },
      chart: () => vueGroupes(e, [[SPAM, e.fam === 'non' && !e.trouve ? C.muted : C.bronze], [NON, e.fam === 'non' && !e.trouve ? C.muted : C.light]], e.params, L('Vue de dessus : les points')),
      rejouer: () => { e.fam = 'sup'; e.vus = {}; },
      parcours: [
        {
          titre: 'Supervisé : avec la réponse',
          regarde: 'Chaque point a sa couleur : son étiquette, comme le prix de chaque maison de l’épisode 02.',
          faire: 'Avec la famille « supervisé », appuyez sur Lecture.',
          fait: () => !!(e.vus && e.vus.sup),
          compris: 'Le modèle apprend à retrouver l’étiquette de chaque exemple. C’est l’apprentissage supervisé, celui des épisodes 01 et 02.',
        },
        {
          titre: 'Non supervisé : sans la réponse',
          regarde: 'Mêmes points, mais sans étiquette : ils deviennent gris. Le modèle ne sait pas ce qu’il faut prédire.',
          faire: 'Appuyez sur le bouton de famille jusqu’à « non supervisé », puis sur Lecture.',
          fait: () => !!(e.vus && e.vus.non),
          compris: 'Sans aucune réponse, le modèle a trouvé une structure : deux groupes de points semblables. Il ne prédit pas une étiquette, il organise les données.',
        },
        {
          titre: 'Par renforcement : en agissant',
          regarde: 'Cette fois, pas de jeu de données fixe. Le robot agit, et chaque pas lui vaut un retour : +1 s’il se rapproche de la cible bleue, −1 sinon.',
          faire: 'Passez à « renforcement », puis appuyez sur Lecture et regardez le compteur « retour ».',
          fait: () => !!(e.vus && e.vus.ren),
          compris: 'Le robot a retenu les gestes qui rapportaient +1 et a atteint la cible. Ses actions changeaient ce qu’il voyait ensuite : il apprend en agissant.',
        },
      ],
      quiz: {
        question: 'Quelle famille ne se contente pas d’un jeu de données fixe ?',
        choix: ['Supervisé', 'Non supervisé', 'Par renforcement'],
        bonne: 2,
        explication: 'Juste : par renforcement, le système agit dans un environnement, reçoit un retour, puis recommence. Ses actions changent les données qu’il reçoit.',
      },
    },

    modele: {
      ...PLAT, id: 'modele', num: '04', badge: '04', title: L('Deux réglages'), tab: L('Modèle'), sub: L('60 ventes réelles d’Ames'),
      start: [0, 0], formula: 'ŷ = a·x + b', ctl: { ab: true }, fixe: false,
      idea: L('Une droite, deux boutons : a la fait pivoter, b la décale. Réglez-les pour suivre ces ventes, puis déplacez le robot pour lire le prix prédit.'),
      goal: L('amenez l’écart moyen à moins de 10 % au-dessus du meilleur réglage.'),
      legend: [[C.light, L('ventes d’Ames')], [C.white, 'ŷ = a·x + b']],
      reset: () => { e.setState({ pa: 30, pb: 120 }); },
      deco: (g) => { pts.forEach((q) => sphere(e, g, XP(q[0]), ZP(q[1]), e.mat.gLight, 0.04, 0.8)); axes(e, g); },
      visu: (pc, moving) => {
        const a = e.state.pa ?? 30;
        const b = e.state.pb ?? 120;
        droite(e, a, b);
        const x = Math.max(0.1, XI(pc[0]));
        const y = a * x + b;
        if (!moving && e.params) e.params = [pc[0], Math.max(-PLAT.rb, Math.min(PLAT.rb, ZP(y)))];
        e.setTag(e.tags[0], `${Math.round(x * 100)} m² → ${Math.round(y)} M`, e.pos(e.params).add(new e.T.Vector3(0, 0.62, 0)));
      },
      ui: () => {
        const a = e.state.pa ?? 30;
        const b = e.state.pb ?? 120;
        const m = mae(a, b);
        const best = mae(A.a, A.b);
        return {
          S: [['a', f(a, 0)], ['b', f(b, 0)], [L('écart moyen'), f(m, 1)]],
          calc: [`ŷ = ${f(a, 0)}·x + ${f(b, 0)}`, L('meilleur réglage de la série : a = 74, b = 4'), L('écart moyen au meilleur réglage : ') + f(best, 1)],
          msg: m <= best * 1.1 ? L('Entraîner, c’est chercher les meilleurs réglages : vous y êtes presque.') : L('Changer a fait pivoter la droite, changer b la décale.'),
          ok: m <= best * 1.1,
        };
      },
      chart: () => vueNuage(e, e.state.pa ?? 30, e.state.pb ?? 120, L('Vue 2D : la droite et les ventes')),
      rejouer: () => { e.setState({ pa: 30, pb: 120 }); },
      parcours: [
        {
          titre: 'Le bouton a',
          regarde: 'Chaque boule est une vente réelle d’Ames : la surface en largeur, le prix en profondeur. La droite blanche est le modèle : ŷ = a·x + b.',
          faire: 'Bougez seulement le curseur a, sans toucher à b.',
          fait: () => Math.abs((e.state.pa ?? 30) - (e.snap.pa ?? 30)) >= 10 && (e.state.pb ?? 120) === (e.snap.pb ?? 120),
          compris: 'La droite a pivoté autour de son point sur l’axe vertical. a est la pente : ce que gagne le prix prédit pour chaque centaine de m² en plus.',
        },
        {
          titre: 'Le bouton b',
          regarde: 'Deuxième réglage, même droite.',
          faire: 'Bougez maintenant seulement le curseur b.',
          fait: () => Math.abs((e.state.pb ?? 120) - (e.snap.pb ?? 120)) >= 20 && (e.state.pa ?? 30) === (e.snap.pa ?? 30),
          compris: 'La droite est montée ou descendue sans tourner : b la décale. Deux nombres, deux effets différents.',
        },
        {
          titre: 'Suivre les ventes',
          regarde: 'L’écart moyen mesure, en millions de FCFA, la distance entre les prix prédits et les vrais prix.',
          faire: 'Réglez a et b pour que la droite passe au milieu des ventes : écart moyen à moins de 10 % du meilleur.',
          fait: () => { const a = e.state.pa ?? 30; const b = e.state.pb ?? 120; return mae(a, b) <= mae(A.a, A.b) * 1.1; },
          compris: 'Vous venez de faire à la main ce que fait l’entraînement : chercher les réglages qui collent aux exemples. a et b sont les paramètres du modèle, notés ensemble θ.',
        },
        {
          titre: 'Prédire',
          regarde: 'Les paramètres sont fixés. Le robot lit le prix prédit sur la droite.',
          faire: 'Déplacez le robot de gauche à droite.',
          fait: () => bouge(e, 0.5),
          compris: 'Le modèle prédit le prix d’une maison qu’il n’a jamais vue, d’après sa seule surface. La forme, une droite, était choisie d’avance ; seuls a et b ont été appris.',
        },
      ],
      quiz: {
        question: 'Si seul b change, que fait la droite ?',
        choix: ['Elle pivote', 'Elle monte ou descend sans tourner', 'Elle ne bouge pas'],
        bonne: 1,
        explication: 'Juste : b décale la droite vers le haut ou vers le bas. C’est a qui la fait pivoter.',
      },
    },

    cout: {
      id: 'cout', num: '05', badge: '05', title: L('La fonction de coût'), tab: L('Coût'), sub: L('Toutes les inclinaisons, b = 4'), kind: '1d',
      J: (u) => J(u + 75, 4), dJ: (u) => 2 * ((u + 75) * A.sxx + 4 * A.sx - A.sxy), xmin: -75, xmax: 75, sx: 0.0267, sy: 0.000125, base: -0.8, start: [50],
      formula: L('J = moyenne de (ŷ − y)²'), ctl: {},
      idea: L('Chaque position du robot est une droite de pente a, avec b = 4. La hauteur est son coût J sur les ventes d’Ames de 2006 à 2010. Glissez le robot le long du U.'),
      goal: L('placez le robot dans le creux du U.'),
      legend: [[C.white, L('coût J')]],
      visu: (pc) => { e.setTag(e.tags[0], 'J = ' + f(J(pc[0] + 75, 4), 0), e.pos(pc).add(new e.T.Vector3(0, 0.62, 0))); },
      ui: () => {
        const a = e.params[0] + 75;
        const j = J(a, 4);
        const ok = Math.abs(a - 74) < 5;
        return {
          S: [['a', f(a, 0)], ['J', f(j, 0)]],
          calc: [`ŷ = ${f(a, 0)}·x + 4`, L('J = moyenne de (ŷ − y)²'), L('creux : a ≈ 74, J ≈ 1 030')],
          msg: ok ? L('C’est le creux : la droite au coût le plus faible, sans que J vaille 0.') : L('Le carré grossit les grosses erreurs : plus la droite s’éloigne, plus J monte.'),
          ok,
        };
      },
    },

    regression: {
      ...PLAT, id: 'regression', num: '11', badge: '11', title: L('La régression linéaire'), tab: L('Régression'), sub: L('Mesurer, lire, faire un pas'),
      start: [0, 0], eta: 0.2, formula: 'ŷ = w·x + b', ctl: { eta: true, play: true }, fixe: true,
      idea: L('La droite part de w = 0 et b = 0. Chaque itération mesure le coût, lit le gradient et fait un pas, sur les 2 925 ventes d’Ames gardées par la série.'),
      goal: L('amenez le coût sous 1 040.'),
      legend: [[C.light, L('ventes d’Ames')], [C.white, 'ŷ = w·x + b']],
      reset: () => { e.w = 0; e.b = 0; },
      deco: (g) => { pts.forEach((q) => sphere(e, g, XP(q[0]), ZP(q[1]), e.mat.gLight, 0.04, 0.8)); axes(e, g); },
      pas: () => {
        const eta = e.etaVal();
        const dw = 2 * (e.w * A.sxx + e.b * A.sx - A.sxy);
        const db = 2 * (e.w * A.sx + e.b - A.sy);
        e.w -= eta * dw;
        e.b -= eta * db;
        e.steps += 1;
        if (!Number.isFinite(J(e.w, e.b)) || J(e.w, e.b) > 1e6) { e.diverged = true; e.setState({ playing: false }); }
        if (e.steps >= 400) e.setState({ playing: false });
      },
      visu: () => {
        droite(e, e.w, e.b);
        const x = 1.5;
        const y = Math.max(0, Math.min(MAX_Y, e.w * x + e.b));
        e.params = [XP(x), ZP(y)];
      },
      ui: () => {
        const j = J(e.w, e.b);
        return {
          S: [[L('itération'), String(e.steps)], ['w', f(e.w, 1)], ['b', f(e.b, 1)], ['J', f(j, 0)]],
          calc: [L('∂J/∂w = 2 · moyenne de (ŷ − y)·x'), L('∂J/∂b = 2 · moyenne de (ŷ − y)'), 'w ← w − η · ∂J/∂w,  b ← b − η · ∂J/∂b'],
          msg: e.diverged ? L('η trop grand : le coût explose. Replacez le robot et réduisez η.') : j < 1040 ? L('Le coût ne baisse presque plus : la droite est ajustée.') : L('Mesurer le coût, lire le gradient, faire un pas.'),
          ok: !e.diverged && j < 1040,
        };
      },
      chart: () => vueNuage(e, Number.isFinite(e.w) ? e.w : 0, Number.isFinite(e.b) ? e.b : 0, L('Vue 2D : l’ajustement')),
    },
  };
}
