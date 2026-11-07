import { DCLogic } from './base';

export class ProfilEngine extends DCLogic {
constructor(...args) {
super(...args);
this.state = { vh: 900, lgKind: '', pjF: 'all', pjOpen: 0 };
this.PJ = this.props.projets;
this.FILT = [['all', this.L('Tout')], ['ml', 'Machine Learning'], ['vision', 'Vision'], ['iot', 'IoT']];
this.fPick = this.FILT.map((f) => () => this.setState({ pjF: f[0], pjOpen: -1 }));
this.pjTog = this.PJ.map((_, i) => () => this.setState({ pjOpen: this.state.pjOpen === i ? -1 : i }));
this.SEED = this.props.preuves;
this.state.certs = []; this.state.czF = 'all'; this.state.lb = -1; this.state.canEdit = false; this.state.up = false; this.state.upType = 'cert'; this.state.upErr = ''; this.state.upBusy = false; this.state.upFile = '';
this.czPick = [['all', this.L('Tout')], ['cert', 'Certifications'], ['prix', this.L('Prix')]].map((f) => () => this.setState({ czF: f[0], lb: -1 }));
this.czOpeners = []; for (let i = 0; i < 200; i++) { const k = i; this.czOpeners.push(() => this.setState({ lb: k })); }
this.setRail = (el) => { this.rail = el; if (el) setTimeout(() => this.czScroll(), 50); }; this.setProg = (el) => { this.progEl = el; };
this.czScroll = () => { const r = this.rail; if (!r || !this.progEl) return; const max = Math.max(1, r.scrollWidth - r.clientWidth); const vis = Math.max(0.08, Math.min(1, r.clientWidth / Math.max(1, r.scrollWidth))); this.progEl.style.width = (vis * 100).toFixed(1) + '%'; this.progEl.style.transform = 'translateX(' + ((r.scrollLeft / max) * (1 / vis - 1) * 100).toFixed(1) + '%)'; };
this.czStep = (d) => { const r = this.rail; if (!r) return; const c = r.querySelector('.cz-card'); const w = c ? c.getBoundingClientRect().width + 26 : 460; r.scrollBy({ left: d * w, behavior: 'smooth' }); };
this.czPrev = () => this.czStep(-1); this.czNext = () => this.czStep(1);
this.tilt = (e) => { const el = e.currentTarget; const r = el.getBoundingClientRect(); const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height; el.style.setProperty('--ry', ((x - 0.5) * 14).toFixed(2) + 'deg'); el.style.setProperty('--rx', ((0.5 - y) * 10).toFixed(2) + 'deg'); el.style.setProperty('--gx', (x * 100).toFixed(1) + '%'); el.style.setProperty('--gy', (y * 100).toFixed(1) + '%'); };
this.untilt = (e) => { const el = e.currentTarget; el.style.setProperty('--rx', '0deg'); el.style.setProperty('--ry', '0deg'); };
this.lbClose = () => this.setState({ lb: -1 });
this.lbBack = (e) => { if (e && e.target === e.currentTarget) this.setState({ lb: -1 }); };
this.lbPrev = () => { const n = this.czList().length; if (n) this.setState({ lb: (this.state.lb - 1 + n) % n }); };
this.lbNext = () => { const n = this.czList().length; if (n) this.setState({ lb: (this.state.lb + 1) % n }); };
this.lbDelete = () => this.removeCert();
this.upOpenFn = () => this.setState({ up: true, upErr: '', upFile: '', upType: 'cert' });
this.upClose = () => this.setState({ up: false });
this.upBack = (e) => { if (e && e.target === e.currentTarget) this.setState({ up: false }); };
this.upCert = () => this.setState({ upType: 'cert' }); this.upPrix = () => this.setState({ upType: 'prix' });
this.upPick = (e) => { const f = e && e.target && e.target.files && e.target.files[0]; this.setState({ upFile: f ? f.name : '' }); };
this.upSubmit = (e) => { if (e && e.preventDefault) e.preventDefault(); this.addCert(); };
this.setCover = (el) => { this.coverEl = el; }; this.setCv3d = (el) => { this.cv3d = el; }; this.setCvSvg = (el) => { this.cvSvg = el; }; this.setTl = (el) => { this.tlEl = el; };
this.setIris = (el) => { this.irisEl = el; };
this.goHome = (e) => this.leave(e);
this.goLabo = (e) => { try { window.localStorage.removeItem('theta-lab-theme'); } catch (err) {} this.leave(e); };
this.goVoyage = (e) => this.leave(e);
this.ftHome = (e) => this.leave(e);
this.ftProfil = (e) => { if (e && e.preventDefault) e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); };
this.lg = (k) => this.setState({ lgKind: k });
this.openLegal = (e) => { const k = e && e.currentTarget ? e.currentTarget.getAttribute('data-kind') : 'privacy'; this.setState({ lgKind: k || 'privacy' }); };
this.lgClose = () => this.setState({ lgKind: '' });
this.lgBack = (e) => { if (e && e.target === e.currentTarget) this.setState({ lgKind: '' }); };
this.ftTop = () => { window.scrollTo({ top: 0, behavior: 'smooth' }); };

this.toStory = (e) => { if (e && e.preventDefault) e.preventDefault(); const el = document.getElementById('episode'); if (el) window.scrollTo({ top: window.scrollY + el.getBoundingClientRect().top, behavior: 'smooth' }); };
}
componentDidMount() {
this.onPM = (e) => { this.mx = (e.clientX / (window.innerWidth || 1)) - 0.5; this.my = (e.clientY / (window.innerHeight || 1)) - 0.5; if (this.coverEl) { this.coverEl.style.setProperty('--mx', this.mx.toFixed(3)); this.coverEl.style.setProperty('--my', this.my.toFixed(3)); } };
window.addEventListener('pointermove', this.onPM, { passive: true });
this.mx = 0; this.my = 0; this.tries = 0; this.boot3d(); this.tick();
this.onEsc = (e) => { if (e.key === 'Escape') { if (this.state.lgKind) this.setState({ lgKind: '' }); if (this.state.lb >= 0) this.setState({ lb: -1 }); if (this.state.up) this.setState({ up: false }); } if (this.state.lb >= 0 && e.key === 'ArrowRight') this.lbNext(); if (this.state.lb >= 0 && e.key === 'ArrowLeft') this.lbPrev(); }; window.addEventListener('keydown', this.onEsc);
this.measure = () => { const h = Math.max(640, Math.min(window.innerHeight || 900, 1100)); if (h !== this.state.vh) this.setState({ vh: h }); };
this.measure(); window.addEventListener('resize', this.measure);
const els = Array.prototype.slice.call(document.querySelectorAll('[data-rv]'));
this.counted = new WeakSet();
if (typeof IntersectionObserver === 'function') {
this.io = new IntersectionObserver((ents) => { ents.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('on'); this.io.unobserve(en.target); en.target.querySelectorAll('[data-count]').forEach((c) => this.countUp(c)); } }); }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });
els.forEach((el) => this.io.observe(el));
} else { els.forEach((el) => el.classList.add('on')); }
}
componentWillUnmount() { this.dead = true; if (this.unsubCerts) { try { this.unsubCerts(); } catch (err) {} } window.removeEventListener('pointermove', this.onPM); clearTimeout(this.bootT); cancelAnimationFrame(this.raf); if (this.ro) this.ro.disconnect(); if (this.r) this.r.dispose(); window.removeEventListener('keydown', this.onEsc); window.removeEventListener('resize', this.measure); if (this.io) this.io.disconnect(); }


czList() {
const all = this.state.certs.concat(this.SEED); const F = this.state.czF;
return all.filter((c) => F === 'all' || (F === 'prix' ? c.type === 'prix' : c.type !== 'prix'));
}


countUp(el) {
if (this.counted.has(el)) return; this.counted.add(el);
const to = parseFloat(el.getAttribute('data-count')) || 0; const t0 = performance.now(); const dur = 1400;
const step = () => { if (this.dead) return; const u = Math.min(1, (performance.now() - t0) / dur); const e = 1 - Math.pow(1 - u, 3); el.textContent = String(Math.round(to * e)); if (u < 1) requestAnimationFrame(step); };
requestAnimationFrame(step);
}
boot3d() {
if (this.dead) return;
if (this.Q.statique) return;
if (!window.THREE || !this.cv3d) { if (this.tries++ < 100) this.bootT = setTimeout(() => this.boot3d(), 100); return; }
try { this.init3d(); } catch (err) { this.three = false; }
}
init3d() {
const T = window.THREE; const cv = this.cv3d;
const r = new T.WebGLRenderer({ canvas: cv, antialias: this.Q.aa, alpha: true }); r.setPixelRatio(this.Q.dpr); r.setClearColor(0x000000, 0); this.r = r;
const scene = new T.Scene(); const cam = new T.PerspectiveCamera(32, 1, 0.1, 80); this.scene = scene; this.cam = cam;
const core = new T.MeshBasicMaterial({ color: 0xf2f6ff, toneMapped: false });
const glow = new T.MeshBasicMaterial({ color: 0x7fb0ff, transparent: true, opacity: 0.3, blending: T.AdditiveBlending, depthWrite: false, toneMapped: false }); this.glow = glow;
const glow2 = new T.MeshBasicMaterial({ color: 0x4c8dff, transparent: true, opacity: 0.1, blending: T.AdditiveBlending, depthWrite: false, toneMapped: false });
const th = new T.Group(); const sk = 0.21;
const loop = (rx, ry) => { const pts = []; for (let k = 0; k < 160; k++) { const a = k / 160 * Math.PI * 2; const y = ry * Math.sin(a); pts.push(new T.Vector3(rx * Math.cos(a) + sk * y, y, 0)); } return new T.CatmullRomCurve3(pts, true); };
const bar = (y) => new T.LineCurve3(new T.Vector3(-1.3 + sk * y, y, 0), new T.Vector3(1.3 + sk * y, y, 0));
const tube = (c, closed, seg) => { th.add(new T.Mesh(new T.TubeGeometry(c, seg, 0.024, 8, closed), core)); th.add(new T.Mesh(new T.TubeGeometry(c, seg, 0.08, 8, closed), glow)); th.add(new T.Mesh(new T.TubeGeometry(c, seg, 0.15, 8, closed), glow2)); };
tube(loop(2.0, 3.0), true, 260); tube(loop(1.32, 2.62), true, 260); tube(bar(0.17), false, 24); tube(bar(-0.17), false, 24);
scene.add(th); this.th = th;
const ring = new T.Mesh(new T.TorusGeometry(3.7, 0.008, 6, 200), new T.MeshBasicMaterial({ color: 0xd9a066, transparent: true, opacity: 0.5, toneMapped: false })); ring.position.z = -0.6; scene.add(ring); this.ring = ring;
const ring2 = new T.Mesh(new T.TorusGeometry(4.3, 0.006, 6, 200), new T.MeshBasicMaterial({ color: 0x4c8dff, transparent: true, opacity: 0.35, toneMapped: false })); ring2.rotation.x = 1.15; scene.add(ring2); this.ring2 = ring2;
const dn = Math.round(900 * this.Q.part); const dp = new Float32Array(dn * 3); for (let i = 0; i < dn; i++) { const a = Math.random() * Math.PI * 2, rr = 2.6 + Math.random() * 5.5; dp.set([Math.cos(a) * rr * 1.4, Math.sin(a) * rr, -3 + Math.random() * 4], i * 3); }
const dg = new T.BufferGeometry(); dg.setAttribute('position', new T.BufferAttribute(dp, 3));
this.dust = new T.Points(dg, new T.PointsMaterial({ color: 0xcfe0ff, size: 0.03, transparent: true, opacity: 0.6, blending: T.AdditiveBlending, depthWrite: false })); scene.add(this.dust);
const fit = () => { const w = Math.max(1, cv.clientWidth), h = Math.max(1, cv.clientHeight); r.setSize(w, h, false); cam.aspect = w / h; const tn = Math.tan(16 * Math.PI / 180); this.dist = Math.max(7.6 / 2 / tn, (5.2 / cam.aspect) / 2 / tn); cam.updateProjectionMatrix(); this.W = w; this.H = h; };
fit(); this.ro = new ResizeObserver(fit); this.ro.observe(cv);
this.three = true; this.t0 = performance.now(); this.intro = 0;
if (this.coverEl) this.coverEl.classList.add('cv-3d-on');
}
tick() {
if (this.dead) return; this.raf = requestAnimationFrame(() => this.tick());
const vh = window.innerHeight || 900;
if (this.tlEl) { const r = this.tlEl.getBoundingClientRect(); const p = Math.max(0, Math.min(1, (vh * 0.6 - r.top) / Math.max(1, r.height))); if (Math.abs(p - (this.tlp || 0)) > 0.002) { this.tlp = p; this.tlEl.style.setProperty('--tp', p.toFixed(3)); } }
if (!this.three || !this.coverEl) return;
const cr = this.coverEl.getBoundingClientRect(); if (cr.bottom < 0) return;
const t = (performance.now() - this.t0) / 1000; this.intro = Math.min(1, t / 2.2); const ei = 1 - Math.pow(1 - this.intro, 3);
const sc = Math.max(0, -cr.top) / Math.max(1, cr.height);
this.th.rotation.y = Math.sin(t * 0.35) * 0.12 + this.mx * 0.5 + (1 - ei) * 1.4;
this.th.rotation.x = this.my * 0.25;
this.th.scale.setScalar(0.85 + ei * 0.15);
this.th.position.y = 0.55 + sc * 1.4;
this.glow.opacity = 0.26 + 0.08 * Math.sin(t * 1.8);
this.ring.rotation.z = t * 0.05; this.ring2.rotation.z = -t * 0.04; this.dust.rotation.z = t * 0.015;
this.cam.position.set(this.mx * 0.8, -this.my * 0.5, this.dist || 13); this.cam.lookAt(0, 0.4, 0);
this.r.render(this.scene, this.cam); this.perfTick(this.r);
}
leave(e) {
if (this.leaving) return;
if (e && e.preventDefault) e.preventDefault();
const a = e && e.currentTarget; if (!a) return;
const ir = this.irisEl;
if (ir) {
const ar = a.getBoundingClientRect(); const x = e.clientX ? e.clientX : ar.left + ar.width / 2, y = e.clientY ? e.clientY : ar.top + ar.height / 2;
ir.style.transition = 'none'; ir.style.clipPath = 'circle(0px at ' + x + 'px ' + y + 'px)'; void ir.offsetWidth;
ir.style.transition = 'clip-path .8s cubic-bezier(.7,0,.25,1)'; ir.style.clipPath = 'circle(150% at ' + x + 'px ' + y + 'px)';
}
setTimeout(() => {
if (this.dead) return; this.leaving = true;
this.go_(a.getAttribute('href'));
setTimeout(() => { if (this.dead) return; this.leaving = false; if (this.irisEl) { this.irisEl.style.transition = 'none'; this.irisEl.style.clipPath = 'circle(0px at 50% 50%)'; } }, 1400);
}, 820);
}
renderVals() {
const vh = this.state.vh || 900;
const d = (n) => (0.15 + n * 0.14).toFixed(2) + 's';
const czL = this.czList(); const allC = this.state.certs.concat(this.SEED);
const nCert = allC.filter((c) => c.type !== 'prix').length, nPrix = allC.filter((c) => c.type === 'prix').length;
const lbc = this.state.lb >= 0 ? czL[this.state.lb] : null;
const kindOf = (c) => (c.url && /^image\//.test(c.ct || '') ? 'img' : c.url && /pdf/.test(c.ct || '') ? 'pdf' : 'plate');
const F = this.state.pjF;
const list = this.PJ.map((p, i) => ({ p, i })).filter((o) => F === 'all' || o.p.tags.indexOf(F) >= 0);
return {
href: this.props.href, cv: this.props.cv, coverH: vh + 'px', p: this.props.p,
filters: this.FILT.map((f, k) => ({ label: f[1], n: f[0] === 'all' ? this.PJ.length : this.PJ.filter((p) => p.tags.indexOf(f[0]) >= 0).length, sel: F === f[0] ? 'true' : 'false', pick: this.fPick[k] })),
projects: list.map((o, k) => ({ n: o.p.n, i: String(o.i + 1), title: o.p.title, date: o.p.date, res: o.p.res, notion: o.p.notion, desc: o.p.desc,
bullets: o.p.bullets.map((b) => ({ t: b })), tools: o.p.tools.map((x) => ({ t: x })), isOpen: this.state.pjOpen === o.i, open: this.state.pjOpen === o.i ? 'true' : 'false', toggle: this.pjTog[o.i] })),
czNCert: String(nCert), czSCert: nCert > 1 ? 's' : '', czNPrix: String(nPrix), czSPrix: nPrix > 1 ? 's' : '', czCanEdit: this.state.canEdit,
czFilters: [['all', this.L('Tout'), allC.length, 0], ['cert', 'Certifications', nCert, 1], ['prix', this.L('Prix'), nPrix, 2]].filter((f) => f[2] > 0 || f[0] === 'all').map((f) => ({ label: f[1], n: String(f[2]), sel: this.state.czF === f[0] ? 'true' : 'false', pick: this.czPick[f[3]] })),
czItems: czL.map((c, i) => { const k = kindOf(c); return { title: c.title, issuer: c.issuer, date: c.date || '', rank: c.rank || '', event: c.event || c.issuer, url: c.url || '', kind: c.type === 'prix' ? 'prix' : 'cert', isImg: k === 'img', isPdf: k === 'pdf', isPlate: k === 'plate', badge: c.type === 'prix' ? 'Distinction' : 'Certification', aria: this.L('Agrandir : ') + c.title, skills: (c.skills || []).map((t) => ({ t: t })), open: this.czOpeners[i], delay: (i * 0.08).toFixed(2) + 's' }; }),
czPrev: this.czPrev, czNext: this.czNext, czScroll: this.czScroll, setRail: this.setRail, setProg: this.setProg, tilt: this.tilt, untilt: this.untilt, upOpenFn: this.upOpenFn,
lbOpen: !!lbc, lbTitle: lbc ? lbc.title : '', lbIssuer: lbc ? lbc.issuer : '', lbDate: lbc ? (lbc.date || '') : '', lbDesc: lbc ? (lbc.desc || '') : '', lbKind: lbc ? (lbc.type === 'prix' ? 'Distinction' : 'Certification') : '',
lbImg: !!lbc && kindOf(lbc) === 'img', lbPdf: !!lbc && kindOf(lbc) === 'pdf', lbPlate: !!lbc && kindOf(lbc) === 'plate', lbUrl: lbc ? (lbc.url || '') : '', lbRank: lbc ? (lbc.rank || '') : '', lbEvent: lbc ? (lbc.event || lbc.issuer) : '',
lbSkills: lbc ? (lbc.skills || []).map((t) => ({ t: t })) : [], lbHasVerify: !!(lbc && lbc.verify), lbVerify: lbc ? (lbc.verify || '') : '', lbHasUrl: !!(lbc && (lbc.file || lbc.url)), lbFile: lbc ? (lbc.file || lbc.url || '') : '', lbCanDel: !!(lbc && !lbc.seed && this.state.canEdit),
lbPos: lbc ? (this.state.lb + 1) + ' / ' + czL.length : '', lbClose: this.lbClose, lbBack: this.lbBack, lbPrev: this.lbPrev, lbNext: this.lbNext, lbDelete: this.lbDelete,
upOpen: this.state.up, upPrixOn: this.state.upType === 'prix', upIsCert: this.state.upType === 'cert' ? 'true' : 'false', upIsPrix: this.state.upType === 'prix' ? 'true' : 'false', upCert: this.upCert, upPrix: this.upPrix, upPick: this.upPick, upSubmit: this.upSubmit, upClose: this.upClose, upBack: this.upBack,
upFileTxt: this.state.upFile || 'Glisse ou choisis le fichier', upErr: this.state.upErr, upBtn: this.state.upBusy ? 'Envoi en cours…' : 'Publier sur mon profil', upOp: this.state.upBusy ? 0.6 : 1, yes: true,
setUpFile: this.setUpFile, setUpTitle: this.setUpTitle, setUpIssuer: this.setUpIssuer, setUpDate: this.setUpDate, setUpRank: this.setUpRank, setUpVerify: this.setUpVerify, setUpSkills: this.setUpSkills,
setCover: this.setCover, setCv3d: this.setCv3d, setCvSvg: this.setCvSvg, setTl: this.setTl, d0: d(0), d1: d(1), d2: d(2), d3: d(3), d4: d(4),
setIris: this.setIris, goHome: this.goHome, toStory: this.toStory, goLabo: this.goLabo, goVoyage: this.goVoyage, ftHome: this.ftHome, ftProfil: this.ftProfil,
lgOpen: !!this.state.lgKind, lgPrivacy: this.state.lgKind === 'privacy', lgLegal: this.state.lgKind === 'legal', lgTitle: this.state.lgKind === 'legal' ? 'Mentions légales' : 'Confidentialité',
openLegal: this.openLegal, lgClose: this.lgClose, lgBack: this.lgBack, ftTop: this.ftTop,

};
}
}
