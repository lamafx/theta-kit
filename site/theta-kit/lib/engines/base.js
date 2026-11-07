// Socle des moteurs portés depuis les prototypes : état minimal, traduction, qualité 3D, navigation.

export class DCLogic {
  constructor(props) {
    this.props = props;
    this.state = {};
    this.onChange = null;
    this.Q = qualite();
    this.perf_ = { n: 0, t0: 0 };
  }

  setState(p, rappel) {
    this.state = { ...this.state, ...p };
    if (this.onChange) this.onChange();
    if (rappel) rappel();
  }

  /** Texte d'interface d'un moteur : le français est la clé, l'anglais vient de messages/moteur.en.json. */
  L(s) {
    return this.props.tr ? this.props.tr(s) : s;
  }

  go_(href) {
    if (this.props.nav) this.props.nav(href);
  }

  /** Baisse la définition si le taux d'images réel reste sous 40 pendant 2 s (docs/05). */
  perfTick(r) {
    const p = this.perf_;
    const t = performance.now();
    if (!p.t0) p.t0 = t;
    p.n += 1;
    if (t - p.t0 < 2000) return;
    const fps = (p.n * 1000) / (t - p.t0);
    p.n = 0;
    p.t0 = t;
    const dpr = r.getPixelRatio();
    if (fps < 40 && dpr > 1) r.setPixelRatio(Math.max(1, dpr - 0.5));
  }
}

export function sessionVu() {
  try {
    return document.documentElement.classList.contains('vu');
  } catch {
    return false;
  }
}

/** Niveau de qualité du navigateur. statique : pas de 3D (animations réduites, ou WebGL absent). */
export function qualite() {
  const defaut = { niveau: 'high', dpr: 1, aa: true, part: 1, ombre: 2048, statique: false };
  if (typeof window === 'undefined') return defaut;
  const reduit = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const webgl = (() => {
    try {
      const c = document.createElement('canvas');
      return !!(c.getContext('webgl2') || c.getContext('webgl'));
    } catch {
      return false;
    }
  })();
  const tactile = window.matchMedia('(pointer: coarse)').matches;
  const coeurs = navigator.hardwareConcurrency || 4;
  const largeur = window.innerWidth;
  const dp = window.devicePixelRatio || 1;
  let niveau = 'high';
  if (tactile && coeurs <= 4) niveau = 'low';
  else if (largeur < 1024 || tactile) niveau = 'mid';
  const reglages = {
    high: { dpr: Math.min(dp, 2), aa: true, part: 1, ombre: 2048 },
    mid: { dpr: Math.min(dp, 1.5), aa: true, part: 0.5, ombre: 1024 },
    low: { dpr: 1, aa: false, part: 0.2, ombre: 512 },
  };
  return { niveau, ...reglages[niveau], statique: !webgl ? 'webgl' : reduit ? 'reduit' : false };
}

let promesse = null;
/** three.js n'est chargé qu'après l'affichage de la page, et jamais côté serveur. */
export function chargerThree() {
  if (typeof window === 'undefined') return null;
  if (!promesse) {
    promesse = import('three').then((m) => {
      window.THREE = m;
      return m;
    });
  }
  return promesse;
}
