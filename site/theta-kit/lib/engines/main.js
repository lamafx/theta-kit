import { DCLogic, sessionVu } from './base';

export class MainEngine extends DCLogic {
constructor(...args) {
super(...args);
this.state = { lgKind: '', fPdf: true, fNews: true, mOpen: false, mEp: '', mTitle: '', mStatus: 'idle', mErr: '', fStatus: 'idle', fErr: '', fName: '', noGL: false, vh: 900, iris: false, tunnelOn: false, tunnelShow: false, toast: '', toastOn: false, toastHref: '', toastLabel: '' };
this.armed = true; this.tReady = false; this.inTunnel = false;
this.EPS = this.epsDef();
this.setStack = (el) => { if (el) this.stack = el; };
this.setHeroCanvas = (el) => { if (el) this.heroCanvas = el; };

this.setFName = (el) => { this.fNameEl = el; }; this.setFMail = (el) => { this.fMailEl = el; }; this.setFOk = (el) => { this.fOkEl = el; }; this.setFTrap = (el) => { this.fTrapEl = el; };
this.fSubmit = (e) => { if (e && e.preventDefault) e.preventDefault(); this.subscribe(); };
this.fReset = () => this.setState({ fStatus: 'idle', fErr: '', fName: '' });
this.fTogPdf = () => this.setState({ fPdf: !this.state.fPdf, fErr: '' });
this.fTogNews = () => this.setState({ fNews: !this.state.fNews, fErr: '' });
this.setMMail = (el) => { this.mMailEl = el; }; this.setMOk = (el) => { this.mOkEl = el; }; this.setMNews = (el) => { this.mNewsEl = el; }; this.setMTrap = (el) => { this.mTrapEl = el; };
this.openMail = (e) => { if (e && e.preventDefault) e.preventDefault(); const a = e && e.currentTarget; const ep = a ? a.getAttribute('data-ep') : ''; const ti = a ? a.getAttribute('data-title') : ''; this.mFrom = a; this.setState({ mOpen: true, mEp: ep, mTitle: ti, mStatus: 'idle', mErr: '' }); setTimeout(() => { try { if (this.mMailEl) this.mMailEl.focus(); } catch (err) {} }, 60); };
this.closeMail = () => { this.setState({ mOpen: false }); try { if (this.mFrom) this.mFrom.focus(); } catch (err) {} };
this.mBack = (e) => { if (e && e.target === e.currentTarget) this.closeMail(); };
this.mSubmit = (e) => { if (e && e.preventDefault) e.preventDefault(); this.requestPdf(); };
this.setBubble = (el) => { this.bubbleEl = el; };
this.setPdBar = (el) => { this.pdBar = el; }; this.setPdCount = (el) => { this.pdCount = el; };
this.poke = () => { if (!this.hero3) return; if (this.hAct && this.now() - this.hAct.t0 < 0.3) return; this.heroAct(this.hFirst ? 'wave' : this.heroPick()); this.hFirst = false; };
this.pdNext = () => this.pdGo(1); this.pdPrev = () => this.pdGo(-1);
this.pdSkip = () => { if (!this.portal) return; this.scrollTween(window.scrollY + this.portal.getBoundingClientRect().top); };
this.setFrame = (el) => { this.frame = el; };
this.setLaboA = (el) => { this.laboA = el; };
this.dl = (e) => this.download(e);
this.toPdf = (e) => { if (e && e.preventDefault) e.preventDefault(); const el = document.getElementById('carrousels'); if (el) window.scrollTo({ top: window.scrollY + el.getBoundingClientRect().top, behavior: 'smooth' }); };
this.ps = 0; this.went = false;
this.setCanvas = (el) => { if (el) this.canvas = el; };
this.setPortal = (el) => { if (el) this.portal = el; };
this.setS1 = (el) => { this.s1 = el; }; this.setS2 = (el) => { this.s2 = el; }; this.setS3 = (el) => { this.s3 = el; };
this.setBar = (el) => { this.barEl = el; }; this.setBarIn = (el) => { this.barIn = el; };
this.setFlash = (el) => { this.flash = el; }; this.setGo = (el) => { this.goEl = el; };
this.enter = (e) => { if (e && e.preventDefault) e.preventDefault(); this.go(); };
this.setIris = (el) => { this.irisEl = el; };
this.toProfil = (e) => this.toLabo(e);
this.ctMove = (e) => { const a = e.currentTarget; if (!a) return; const r = a.getBoundingClientRect(); a.style.setProperty('--cx', (e.clientX - r.left) + 'px'); a.style.setProperty('--cy', (e.clientY - r.top) + 'px'); };
this.lg = (k) => this.setState({ lgKind: k });
this.openLegal = (e) => { const k = e && e.currentTarget ? e.currentTarget.getAttribute('data-kind') : 'privacy'; this.setState({ lgKind: k || 'privacy' }); };
this.lgClose = () => this.setState({ lgKind: '' });
this.lgBack = (e) => { if (e && e.target === e.currentTarget) this.setState({ lgKind: '' }); };
this.ftTop = () => { window.scrollTo({ top: 0, behavior: 'smooth' }); };
this.ftHome = (e) => { if (e && e.preventDefault) e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); };
this.ftProfil = (e) => this.toLabo(e);
this.toForm = (e) => { if (e && e.preventDefault) e.preventDefault(); const el = document.getElementById('inscription'); if (el) window.scrollTo({ top: window.scrollY + el.getBoundingClientRect().top - 20, behavior: 'smooth' }); };
this.toLabo = (e) => {
if (this.leaving) return;
if (e && e.preventDefault) e.preventDefault();
const a = e && e.currentTarget; if (!a || this.state.iris) return;
const th = a.getAttribute ? a.getAttribute('data-theme') : null;
try { if (th) window.localStorage.setItem('theta-lab-theme', th); else window.localStorage.removeItem('theta-lab-theme'); } catch (err) {}
this.setState({ iris: true });
const ir = this.irisEl;
if (ir) {
const ar = a.getBoundingClientRect(); const x = e.clientX ? e.clientX : ar.left + ar.width / 2, y = e.clientY ? e.clientY : ar.top + ar.height / 2;
ir.style.transition = 'none'; ir.style.clipPath = 'circle(0px at ' + x + 'px ' + y + 'px)'; void ir.offsetWidth;
ir.style.transition = 'clip-path .8s cubic-bezier(.7,0,.25,1)'; ir.style.clipPath = 'circle(150% at ' + x + 'px ' + y + 'px)';
}
setTimeout(() => {
if (this.dead) return; this.leaving = true;
this.go_(a.getAttribute('href'));
setTimeout(() => { if (this.dead) return; this.leaving = false; if (this.irisEl) { this.irisEl.style.transition = 'none'; this.irisEl.style.clipPath = 'circle(0px at 50% 50%)'; } this.setState({ iris: false }); }, 1400);
}, 820);
};
this.goNow = (e) => {
if (this.leaving) return;
if (e && e.preventDefault) e.preventDefault();
this.go();
};
}
epsDef() {
return this.props.cards;
}
initHero() {
const T = window.THREE; const cv = this.heroCanvas; if (!cv) return;
const r = new T.WebGLRenderer({ canvas: cv, antialias: this.Q.aa, alpha: true });
r.setPixelRatio(this.Q.dpr); r.setClearColor(0x000000, 0);
r.outputColorSpace = T.SRGBColorSpace; r.toneMapping = T.ACESFilmicToneMapping; r.toneMappingExposure = 1.0;
const scene = new T.Scene(); const cam = new T.PerspectiveCamera(30, 1, 0.1, 80);
const pm = new T.PMREMGenerator(r); const es = new T.Scene();
es.add(new T.Mesh(new T.BoxGeometry(12, 12, 12), new T.MeshBasicMaterial({ color: 0xdfe7f3, side: T.BackSide })));
const lamp = (c, w, h, x, y, z) => { const m = new T.Mesh(new T.PlaneGeometry(w, h), new T.MeshBasicMaterial({ color: c, side: T.DoubleSide })); m.position.set(x, y, z); m.lookAt(0, 0, 0); es.add(m); };
lamp(0xffffff, 6, 4, -3, 4, 3); lamp(0xffffff, 4, 3, 4, 2, 3.5); lamp(0x9cc6ff, 8, 2, 0, -5, 1);
scene.environment = pm.fromScene(es, 0.04).texture; pm.dispose();
scene.add(new T.HemisphereLight(0xffffff, 0xb8c6da, 0.9));
const key = new T.DirectionalLight(0xffffff, 1.6); key.position.set(-3, 5, 6); scene.add(key);
const rim = new T.DirectionalLight(0x9cc6ff, 1.2); rim.position.set(4, 2, -4); scene.add(rim);
const M = {
white: new T.MeshPhysicalMaterial({ color: 0xf8fafc, roughness: 0.28, clearcoat: 1, clearcoatRoughness: 0.1 }),
bronze: new T.MeshStandardMaterial({ color: 0xc8925a, metalness: 1, roughness: 0.3 }),
metal: new T.MeshStandardMaterial({ color: 0xc9d1da, metalness: 1, roughness: 0.3 }),
dark: new T.MeshStandardMaterial({ color: 0x262e39, metalness: 0.5, roughness: 0.4 }),
chest: new T.MeshStandardMaterial({ color: 0x4c8dff, emissive: 0x4c8dff, emissiveIntensity: 1.4 }),
theta: new T.MeshPhysicalMaterial({ color: 0x1438b0, roughness: 0.3, metalness: 0.05, clearcoat: 0.7, clearcoatRoughness: 0.15, envMapIntensity: 0.45 })
};
// face texture
const fc = document.createElement('canvas'); fc.width = 512; fc.height = 192; this.faceCtx = fc.getContext('2d');
this.faceTex = new T.CanvasTexture(fc); this.faceTex.colorSpace = T.SRGBColorSpace;
M.visor = new T.MeshPhysicalMaterial({ color: 0x05080d, roughness: 0.08, metalness: 0.3, clearcoat: 1, clearcoatRoughness: 0.03, emissive: 0xffffff, emissiveMap: this.faceTex, emissiveIntensity: 1.5 });
// theta : porte lumineuse redessinee (meme dessin que les portes du tunnel)
const th = new T.Group();
const core = new T.MeshBasicMaterial({ color: 0xf2f6ff, toneMapped: false });
this.hGlow = new T.MeshBasicMaterial({ color: 0x7fb0ff, transparent: true, opacity: 0.32, blending: T.AdditiveBlending, depthWrite: false, toneMapped: false });
const glow2 = new T.MeshBasicMaterial({ color: 0x4c8dff, transparent: true, opacity: 0.1, blending: T.AdditiveBlending, depthWrite: false, toneMapped: false });
const sk = 0.21;
const loop = (rx, ry) => { const pts = []; for (let k = 0; k < 160; k++) { const a = k / 160 * Math.PI * 2; const y = ry * Math.sin(a); pts.push(new T.Vector3(rx * Math.cos(a) + sk * y, y, 0)); } return new T.CatmullRomCurve3(pts, true); };
const barC = (y, w) => new T.LineCurve3(new T.Vector3(-w + sk * y, y, 0), new T.Vector3(w + sk * y, y, 0));
const tube = (cv, closed, seg) => { th.add(new T.Mesh(new T.TubeGeometry(cv, seg, 0.026, 8, closed), core)); th.add(new T.Mesh(new T.TubeGeometry(cv, seg, 0.085, 8, closed), this.hGlow)); th.add(new T.Mesh(new T.TubeGeometry(cv, seg, 0.15, 8, closed), glow2)); };
tube(loop(2.0, 3.0), true, 260); tube(loop(1.32, 2.62), true, 260);
const bw = 1.3; tube(barC(0.17, bw), false, 24); tube(barC(-0.17, bw), false, 24);
th.position.set(0, 0.95, -1.7); scene.add(th); this.hTheta = th;
const halo = new T.Mesh(new T.TorusGeometry(3.75, 0.01, 6, 220), new T.MeshBasicMaterial({ color: 0xd9a066, transparent: true, opacity: 0.55, toneMapped: false }));
halo.position.set(0, 0.95, -2.2); scene.add(halo); this.hHalo = halo;
const dn = Math.round(520 * this.Q.part); const dp = new Float32Array(dn * 3); for (let i = 0; i < dn; i++) { dp.set([(Math.random() - 0.5) * 11, -2.5 + Math.random() * 7.5, -4 + Math.random() * 5], i * 3); }
const dg = new T.BufferGeometry(); dg.setAttribute('position', new T.BufferAttribute(dp, 3));
this.hDust = new T.Points(dg, new T.PointsMaterial({ color: 0xcfe0ff, size: 0.035, transparent: true, opacity: 0.55, blending: T.AdditiveBlending, depthWrite: false })); scene.add(this.hDust);
// socle
const ped = new T.Group();
const pTop = new T.Mesh(new T.CylinderGeometry(0.95, 1.0, 0.14, 64), M.white); ped.add(pTop);
const pRing = new T.Mesh(new T.TorusGeometry(0.985, 0.022, 10, 96), M.bronze); pRing.rotation.x = Math.PI / 2; pRing.position.y = 0.05; ped.add(pRing);
const pLight = new T.Mesh(new T.TorusGeometry(1.0, 0.012, 8, 96), new T.MeshBasicMaterial({ color: 0x9cc6ff, toneMapped: false })); pLight.rotation.x = Math.PI / 2; pLight.position.y = -0.07; ped.add(pLight);
ped.position.set(0, -1.52, 0.6); scene.add(ped);
// ombres douces
const sc = document.createElement('canvas'); sc.width = sc.height = 128; const sx = sc.getContext('2d');
const gr = sx.createRadialGradient(64, 64, 2, 64, 64, 62); gr.addColorStop(0, 'rgba(8,20,70,0.6)'); gr.addColorStop(1, 'rgba(8,20,70,0)'); sx.fillStyle = gr; sx.fillRect(0, 0, 128, 128);
const stex = new T.CanvasTexture(sc);
const contact = new T.Mesh(new T.PlaneGeometry(1.5, 0.75), new T.MeshBasicMaterial({ map: stex, transparent: true, depthWrite: false }));
contact.rotation.x = -Math.PI / 2; contact.position.set(0, -1.444, 0.62); scene.add(contact); this.hContact = contact;
const gc = document.createElement('canvas'); gc.width = gc.height = 128; const gx = gc.getContext('2d');
const g2 = gx.createRadialGradient(64, 64, 2, 64, 64, 62); g2.addColorStop(0, 'rgba(156,198,255,0.55)'); g2.addColorStop(1, 'rgba(156,198,255,0)'); gx.fillStyle = g2; gx.fillRect(0, 0, 128, 128);
const pool = new T.Mesh(new T.PlaneGeometry(3.6, 1.3), new T.MeshBasicMaterial({ map: new T.CanvasTexture(gc), transparent: true, depthWrite: false, blending: T.AdditiveBlending, toneMapped: false }));
pool.rotation.x = -Math.PI / 2; pool.position.set(0, -1.62, 0.6); scene.add(pool);
// robot
const R = new T.Group(); const B = new T.Group(); R.add(B);
const add = (parent, geo, mat, x, y, z) => { const m = new T.Mesh(geo, mat); m.position.set(x, y, z); parent.add(m); return m; };
const torso = add(B, new T.SphereGeometry(0.62, 48, 32), M.white, 0, -0.1, 0); torso.scale.set(1.25, 0.7, 0.8);
add(B, new T.TorusGeometry(0.1, 0.014, 10, 36), M.metal, 0, -0.1, 0.49);
this.hChest = add(B, new T.SphereGeometry(0.055, 20, 14), M.chest, 0, -0.1, 0.49);
add(B, new T.CylinderGeometry(0.12, 0.14, 0.24, 24), M.metal, 0, 0.36, 0);
const collar = add(B, new T.TorusGeometry(0.15, 0.03, 10, 32), M.bronze, 0, 0.27, 0); collar.rotation.x = Math.PI / 2;
const HP = new T.Group(); HP.position.set(0, 0.42, 0); B.add(HP); this.hHead = HP;
const head = add(HP, new T.SphereGeometry(0.5, 48, 36), M.white, 0, 0.53, 0); head.scale.set(1.1, 1, 0.95);
const visor = add(HP, new T.SphereGeometry(0.507, 48, 24, Math.PI / 2 - 0.78, 1.56, Math.PI / 2 - 0.3, 0.6), M.visor, 0, 0.53, 0); visor.scale.set(1.1, 1, 0.95);
[-1, 1].forEach((s) => {
const cup = add(HP, new T.CylinderGeometry(0.21, 0.21, 0.16, 36), M.white, s * 0.6, 0.53, 0); cup.rotation.z = Math.PI / 2;
const ring = add(HP, new T.TorusGeometry(0.16, 0.035, 12, 36), M.bronze, s * 0.69, 0.53, 0); ring.rotation.y = Math.PI / 2;
const disc = add(HP, new T.CylinderGeometry(0.125, 0.125, 0.03, 32), M.metal, s * 0.685, 0.53, 0); disc.rotation.z = Math.PI / 2;
});
add(HP, new T.TorusGeometry(0.66, 0.045, 12, 48, Math.PI), M.dark, 0, 0.53, 0);
this.hArms = {};
[-1, 1].forEach((s) => {
add(B, new T.SphereGeometry(0.14, 24, 18), M.white, s * 0.7, -0.02, 0.04);
const SP = new T.Group(); SP.position.set(s * 0.8, 0.02, 0.05); B.add(SP);
add(SP, new T.CapsuleGeometry(0.085, 0.14, 6, 16), M.white, 0, -0.13, 0);
const EP = new T.Group(); EP.position.set(0, -0.26, 0); SP.add(EP);
const wr = add(EP, new T.TorusGeometry(0.075, 0.022, 10, 28), M.bronze, 0, -0.04, 0); wr.rotation.x = Math.PI / 2;
add(EP, new T.CapsuleGeometry(0.075, 0.1, 6, 16), M.white, 0, -0.12, 0);
add(EP, new T.SphereGeometry(0.095, 24, 18), M.white, 0, -0.24, 0);
this.hArms[s] = { sp: SP, ep: EP };
});
R.position.set(0, -0.91, 0.6); scene.add(R); this.hRobot = R; this.hBody = B;
this.hr = r; this.hScene = scene; this.hCam = cam;
const fit = () => { const el = cv.parentElement; const w = Math.max(1, el.clientWidth), h = Math.max(1, el.clientHeight); r.setSize(w, h, false); cam.aspect = w / h; const tn = Math.tan(15 * Math.PI / 180); const dist = Math.max(6.7 / 2 / tn, (5.0 / cam.aspect) / 2 / tn); this.hDist = Math.min(dist, 20); cam.updateProjectionMatrix(); this.hW = w; this.hH = h; };
fit(); this.hro = new ResizeObserver(fit); this.hro.observe(cv.parentElement);
this.hAct = null; this.hNext = sessionVu() ? 0.9 : 3.3; this.hBlink = 2; this.hT0 = this.now(); this.hFirst = true; this.hBag = [];
this.faceKey = ''; this.drawFace('neutral', 1, 0, 0);
this.hero3 = true; this.setState({ heroPret: true });
}
now() { return (window.performance && performance.now ? performance.now() : Date.now()) / 1000; }
drawFace(expr, open, lx, ly) {
const c = this.faceCtx; if (!c) return; const w = 512, h = 192;
c.setTransform(1, 0, 0, 1, 0, 0); c.fillStyle = '#0A0F17'; c.fillRect(0, 0, w, h);
c.fillStyle = '#9CC6FF'; c.strokeStyle = '#9CC6FF'; c.lineCap = 'round'; c.lineJoin = 'round'; c.lineWidth = 12;
c.shadowColor = '#4C8DFF'; c.shadowBlur = 22;
const ex = [0.31 * w + lx * 16, 0.69 * w + lx * 16], ey = 0.42 * h + ly * 12, my = 0.76 * h + ly * 8, mx = 0.5 * w + lx * 16;
const pill = (x, y, ww, hh) => { const rr = Math.min(ww, hh) / 2; c.beginPath(); c.moveTo(x - ww / 2 + rr, y - hh / 2); c.arcTo(x + ww / 2, y - hh / 2, x + ww / 2, y + hh / 2, rr); c.arcTo(x + ww / 2, y + hh / 2, x - ww / 2, y + hh / 2, rr); c.arcTo(x - ww / 2, y + hh / 2, x - ww / 2, y - hh / 2, rr); c.arcTo(x - ww / 2, y - hh / 2, x + ww / 2, y - hh / 2, rr); c.closePath(); c.fill(); };
const eye = (x) => { if (open < 0.18) { c.beginPath(); c.moveTo(x - 28, ey); c.lineTo(x + 28, ey); c.stroke(); } else pill(x, ey, 64, 40 * open); };
const happy = (x) => { c.beginPath(); c.arc(x, ey + 14, 26, Math.PI * 1.15, Math.PI * 1.85); c.stroke(); };
const line = (x0, y0, x1, y1) => { c.beginPath(); c.moveTo(x0, y0); c.lineTo(x1, y1); c.stroke(); };
if (expr === 'happy') { happy(ex[0]); happy(ex[1]); c.beginPath(); c.arc(mx, my - 14, 26, Math.PI * 0.2, Math.PI * 0.8); c.stroke(); }
else if (expr === 'excite') { happy(ex[0]); happy(ex[1]); c.beginPath(); c.arc(mx, my - 22, 34, 0, Math.PI); c.closePath(); c.fill(); }
else if (expr === 'wink') { eye(ex[0]); happy(ex[1]); c.beginPath(); c.arc(mx + 8, my - 12, 18, Math.PI * 0.15, Math.PI * 0.85); c.stroke(); }
else if (expr === 'surprised') { [0, 1].forEach((k) => { c.beginPath(); c.arc(ex[k], ey, 24, 0, Math.PI * 2); c.stroke(); }); c.beginPath(); c.arc(mx, my, 10, 0, Math.PI * 2); c.stroke(); }
else if (expr === 'grimace') { line(ex[0] - 22, ey - 18, ex[0] + 18, ey); line(ex[0] + 18, ey, ex[0] - 22, ey + 18); line(ex[1] + 22, ey - 18, ex[1] - 18, ey); line(ex[1] - 18, ey, ex[1] + 22, ey + 18); c.lineWidth = 9; c.beginPath(); for (let k = 0; k <= 6; k++) { const x = mx - 42 + k * 14, y = my + (k % 2 ? -7 : 7); if (k) c.lineTo(x, y); else c.moveTo(x, y); } c.stroke(); }
else if (expr === 'think') { [0, 1].forEach((k) => pill(ex[k] + 12, ey - 10, 60, 22)); c.lineWidth = 9; line(mx - 4, my, mx + 22, my - 4); }
else if (expr === 'silly') { c.beginPath(); c.arc(ex[0], ey, 26, 0, Math.PI * 2); c.stroke(); pill(ex[1], ey, 56, 14); c.beginPath(); c.arc(mx, my - 18, 30, Math.PI * 0.15, Math.PI * 0.85); c.stroke(); c.shadowBlur = 0; c.fillStyle = '#D9A066'; c.beginPath(); c.arc(mx + 6, my + 10, 11, 0, Math.PI); c.fill(); }
else { eye(ex[0]); eye(ex[1]); c.lineWidth = 8; line(mx - 12, my, mx + 12, my); }
if (this.faceTex) this.faceTex.needsUpdate = true;
}
heroAct(name) {
const D = { wave: [2.8, this.L('Salut ! Bienvenue sur Théta.')], wink: [1.9, this.L('Une notion à la fois.')], grimace: [2.3, this.L('Un minimum local… encore ?')], surprised: [2.0, this.L('Oh ! Un gradient.')], think: [3.0, this.L('Et si on dérivait ?')], silly: [2.6, this.L('Même pas peur des maths.')], excite: [2.4, this.L('Vite, le labo vous attend !')], danse: [2.8, this.L('Une notion, deux notions, trois notions !')], tire: [2.0, this.L('Encore, encore !')], peur: [1.8, this.L('Aïe, un point selle !')] };
const d = D[name]; if (!d) return;
this.hAct = { name: name, t0: this.now(), dur: d[0] };
if (this.bubbleEl) { this.bubbleEl.textContent = d[1]; }
}
heroPick() {
if (!this.hBag.length) { this.hBag = ['excite', 'grimace', 'danse', 'silly', 'tire', 'wink', 'excite', 'peur', 'surprised', 'danse', 'grimace', 'think', 'wave']; for (let i = this.hBag.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); const t = this.hBag[i]; this.hBag[i] = this.hBag[j]; this.hBag[j] = t; } }
return this.hBag.pop();
}
heroFrame() {
if (!this.hero3) return;
const vh = window.innerHeight || 900; const rr = this.heroCanvas.getBoundingClientRect();
if (rr.bottom < 0 || rr.top > vh || this.inTunnel) return;
const T = window.THREE; const t = this.now() - this.hT0; const dt = Math.min(0.05, t - (this.hLast || t)); this.hLast = t;
const ss = (a, b, x) => { const k = Math.max(0, Math.min(1, (x - a) / (b - a))); return k * k * (3 - 2 * k); };
if (!this.hAct && t > this.hNext) { this.heroAct(this.hFirst ? 'wave' : this.heroPick()); this.hFirst = false; }
let name = '', u = 0, e = 0;
if (this.hAct) { u = this.now() - this.hAct.t0; name = this.hAct.name; e = ss(0, 0.35, u) * (1 - ss(this.hAct.dur - 0.45, this.hAct.dur, u)); if (u >= this.hAct.dur) { this.hAct = null; this.hNext = t + 0.9 + Math.random() * 1.4; name = ''; e = 0; } }
const mx = this.mx || 0, my = this.my || 0;
const A = this.hArms, H = this.hHead, B = this.hBody;
let hy = mx * 0.7 + Math.sin(t * 1.3) * 0.16, hx = my * 0.35, hz = Math.sin(t * 2.1) * 0.05, by = Math.abs(Math.sin(t * 3.2)) * 0.07, sq = 1, tourne = 0;
const vif = Math.sin(t * 3.2) * 0.14;
const pose = { '-1': { z: -0.34 - vif, x: 0, ez: 0, ex: 0 }, '1': { z: 0.34 + vif, x: 0, ez: 0, ex: 0 } };
if (name === 'wave') { pose['-1'].z = -0.3 - 2.45 * e; pose['-1'].ez = -(0.15 + 0.55 * Math.sin(u * 11)) * e; hz = 0.12 * e; }
else if (name === 'think') { pose['1'].x = -1.2 * e; pose['1'].z = 0.3 - 0.75 * e; pose['1'].ex = -2.1 * e; hz = -0.14 * e; hx -= 0.18 * e; hy = hy * (1 - e) + 0.25 * e; }
else if (name === 'grimace') { hy += Math.sin(u * 16) * 0.2 * e; sq = 1 - 0.06 * e; pose['-1'].z = -0.15 - 0.3 * e; pose['1'].z = 0.15 + 0.3 * e; }
else if (name === 'surprised') { const bump = u < 0.6 ? Math.sin(u / 0.6 * Math.PI) : 0; by += 0.25 * bump; pose['-1'].z = -0.15 - 0.9 * e; pose['1'].z = 0.15 + 0.9 * e; hx -= 0.1 * e; }
else if (name === 'wink') { hz = -0.18 * e; pose['1'].z = 0.15 + 0.6 * e; pose['1'].ez = 0.5 * e; }
else if (name === 'excite') { by += Math.abs(Math.sin(u * 9)) * 0.3 * e; pose['-1'].z = -0.3 - (2.3 + 0.3 * Math.sin(u * 18)) * e; pose['1'].z = 0.3 + (2.3 + 0.3 * Math.sin(u * 18 + 1)) * e; hy += Math.sin(u * 14) * 0.25 * e; }
else if (name === 'danse') { const b2 = Math.sin(u * 7); tourne = b2 * 0.55 * e; by += Math.abs(b2) * 0.16 * e; hz = -b2 * 0.26 * e; pose['-1'].z = -0.3 - (1.2 + b2) * e; pose['1'].z = 0.3 + (1.2 - b2) * e; }
else if (name === 'tire') { hy += Math.sin(u * 20) * 0.3 * e; hz = Math.sin(u * 12) * 0.2 * e; by += Math.abs(Math.sin(u * 11)) * 0.14 * e; pose['-1'].ez = -0.7 * e; pose['1'].ez = 0.7 * e; }
else if (name === 'peur') { sq = 1 - 0.14 * e; by -= 0.06 * e; hy += Math.sin(u * 30) * 0.12 * e; pose['-1'].z = -0.1; pose['1'].z = 0.1; pose['-1'].x = -1.1 * e; pose['1'].x = -1.1 * e; pose['-1'].ex = -1.6 * e; pose['1'].ex = -1.6 * e; }
else if (name === 'silly') { hz = Math.sin(u * 6) * 0.25 * e; pose['-1'].z = -0.15 - (0.5 + 0.35 * Math.sin(u * 12)) * e; pose['1'].z = 0.15 + (0.5 + 0.35 * Math.sin(u * 12 + 1.5)) * e; }
const k = Math.min(1, dt * 9);
[-1, 1].forEach((s) => { const a = A[s], p = pose[s]; a.sp.rotation.z += (p.z - a.sp.rotation.z) * k; a.sp.rotation.x += (p.x - a.sp.rotation.x) * k; a.ep.rotation.z += (p.ez - a.ep.rotation.z) * k; a.ep.rotation.x += (p.ex - a.ep.rotation.x) * k; });
hy = Math.max(-0.7, Math.min(0.7, hy)); hx = Math.max(-0.35, Math.min(0.35, hx));
H.rotation.y += (hy - H.rotation.y) * Math.min(1, dt * 6); H.rotation.x += (hx - H.rotation.x) * Math.min(1, dt * 6); H.rotation.z += (hz - H.rotation.z) * Math.min(1, dt * 6);
B.position.y = by; B.scale.set(1 + (1 - sq) * 0.6, sq, 1);
B.rotation.y = Math.sin(t * 0.9) * 0.16 + mx * 0.15 + tourne;
this.hContact.scale.setScalar(1 - by * 0.9); this.hContact.material.opacity = Math.max(0.3, 1 - by * 2.5);
this.hChest.material.emissiveIntensity = 1.1 + 0.6 * Math.sin(t * 2.4);
this.hTheta.rotation.y = Math.sin(t * 0.35) * 0.08 + mx * 0.08; this.hGlow.opacity = 0.28 + 0.08 * Math.sin(t * 1.8); this.hHalo.rotation.z = t * 0.06; this.hDust.rotation.y = t * 0.02;
// face
let expr = 'neutral';
if (e > 0.15) expr = { wave: 'happy', danse: 'happy', tire: 'silly', peur: 'grimace' }[name] || name;
let open = 1;
if (!name) { if (t > this.hBlink) { const b = t - this.hBlink; open = b < 0.16 ? Math.abs(1 - b / 0.08) : 1; if (b >= 0.16) this.hBlink = t + 2.4 + Math.random() * 2.8; } }
const lx = Math.max(-1, Math.min(1, mx * 2)), ly = Math.max(-1, Math.min(1, my * 2));
const key = expr + (Math.round(open * 10)) + (Math.round(lx * 4)) + (Math.round(ly * 4));
if (key !== this.faceKey) { this.faceKey = key; this.drawFace(expr, open, Math.round(lx * 4) / 4, Math.round(ly * 4) / 4); }
// camera
const cam = this.hCam, d = this.hDist || 12;
cam.position.set(0.5 + mx * 1.0, 1.5 - my * 0.6, d); cam.lookAt(0.05, 0.75, 0);
this.hr.render(this.hScene, cam); this.perfTick(this.hr);
// bubble
if (this.bubbleEl) {
const op = name ? Math.min(1, e * 1.4) : 0;
const v = new T.Vector3(0.62, 1.2, 0); H.localToWorld(v); v.project(cam);
const x = (v.x * 0.5 + 0.5) * this.hW, y = (-v.y * 0.5 + 0.5) * this.hH;
const bx = Math.min(x, this.hW - this.bubbleEl.offsetWidth - 8);
this.bubbleEl.style.transform = 'translate(' + bx.toFixed(1) + 'px,' + (y - this.bubbleEl.offsetHeight - (1 - op) * 10).toFixed(1) + 'px)';
this.bubbleEl.style.opacity = op.toFixed(3);
}
}
subscribe() {
if (this.state.fStatus === 'sending') return;
const name = ((this.fNameEl && this.fNameEl.value) || '').trim().slice(0, 60);
const email = ((this.fMailEl && this.fMailEl.value) || '').trim().toLowerCase();
if (this.fTrapEl && this.fTrapEl.value) { this.setState({ fStatus: 'done', fName: name }); return; }
if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) { this.setState({ fStatus: 'bad', fErr: this.L('Indiquez une adresse e-mail valide.') }); if (this.fMailEl) this.fMailEl.focus(); return; }
if (!this.state.fPdf && !this.state.fNews) { this.setState({ fStatus: 'idle', fErr: this.L('Choisissez au moins : les PDF ou la newsletter.') }); return; }
if (!(this.fOkEl && this.fOkEl.checked)) { this.setState({ fStatus: 'idle', fErr: this.L('Cochez la case pour accepter de recevoir les e-mails.') }); return; }
this.setState({ fStatus: 'sending', fErr: '' });
const interets = []; if (this.state.fPdf) interets.push('pdf'); if (this.state.fNews) interets.push('newsletter');
const rec = { type: 'inscription', email: email, prenom: name, interets: interets, consentement: true, source: 'site-theta', date: new Date().toISOString() };
const ok = () => this.setState({ fStatus: 'done', fName: name, fErr: '' });
const fail = () => this.setState({ fStatus: 'idle', fErr: this.L('L’inscription n’a pas pu être envoyée. Réessayez dans un instant.') });
this.sendRec(rec).then(ok).catch(fail);
}
sendRec(rec) {
return fetch('/api/inscription', { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify({ ...rec, locale: this.props.locale }) }).then((r) => { if (!r.ok) throw new Error('http'); });
}
requestPdf() {
if (this.state.mStatus === 'sending') return;
const email = ((this.mMailEl && this.mMailEl.value) || '').trim().toLowerCase();
if (this.mTrapEl && this.mTrapEl.value) { this.setState({ mStatus: 'done' }); return; }
if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) { this.setState({ mStatus: 'bad', mErr: this.L('Indiquez une adresse e-mail valide.') }); if (this.mMailEl) this.mMailEl.focus(); return; }
if (!(this.mOkEl && this.mOkEl.checked)) { this.setState({ mStatus: 'idle', mErr: this.L('Cochez la case pour accepter l’envoi par e-mail.') }); return; }
this.setState({ mStatus: 'sending', mErr: '' });
const rec = { type: 'pdf', email: email, episode: this.state.mEp, titre: this.state.mTitle, newsletter: !!(this.mNewsEl && this.mNewsEl.checked), consentement: true, source: 'site-theta', date: new Date().toISOString() };
this.sendRec(rec).then(() => this.setState({ mStatus: 'done', mErr: '' })).catch(() => this.setState({ mStatus: 'idle', mErr: this.L('La demande n’a pas pu être envoyée. Réessayez dans un instant.') }));
}
showToast(msg, href, label) {
clearTimeout(this.toastT); this.setState({ toast: msg, toastOn: true, toastHref: href || '', toastLabel: label || '' });
this.toastT = setTimeout(() => { if (!this.dead) this.setState({ toastOn: false }); }, href ? 7000 : 3200);
}

download(e) {
if (this.props.track) this.props.track(e);
}
onMsg(e) {
;
}
enterTunnel() {
if (!this.armed) return; this.armed = false; this.go();
}


componentDidMount() {
this.onMsgB = (e) => this.onMsg(e); window.addEventListener('message', this.onMsgB);
this.onEsc = (e) => { if (e.key === 'Escape' && this.state.mOpen) this.closeMail(); if (e.key === 'Escape' && this.state.lgKind) this.setState({ lgKind: '' }); }; window.addEventListener('keydown', this.onEsc);
if (window.matchMedia('(pointer: coarse)').matches) this.setState({ tactile: true });
this.mx = 0; this.my = 0; this.onPM = (e) => { this.mx = e.clientX / (window.innerWidth || 1) - 0.5; this.my = e.clientY / (window.innerHeight || 1) - 0.5; };
window.addEventListener('pointermove', this.onPM, { passive: true });
this.onWheelCancel = () => { this.stw = null; }; window.addEventListener('wheel', this.onWheelCancel, { passive: true }); window.addEventListener('touchstart', this.onWheelCancel, { passive: true });
this.measure = () => { const h = Math.max(520, Math.min(window.innerHeight || 900, 1400)); if (h !== this.state.vh) this.setState({ vh: h }); };
this.measure(); window.addEventListener('resize', this.measure);
this.tries = 0; this.boot();
// Le chargement se joue à chaque ouverture ; ensuite, un retour dans le site ne le rejoue pas.
setTimeout(() => document.documentElement.classList.add('vu'), 3800);
}
componentWillUnmount() { this.dead = true; if (this.onEsc) window.removeEventListener('keydown', this.onEsc); if (this.hro) this.hro.disconnect(); if (this.hr) this.hr.dispose(); if (this.onWheelCancel) { window.removeEventListener('wheel', this.onWheelCancel); window.removeEventListener('touchstart', this.onWheelCancel); } clearTimeout(this.fallT); clearTimeout(this.toastT); try { document.documentElement.style.overflow = ''; } catch (err) {} window.removeEventListener('message', this.onMsgB); if (this.onPM) window.removeEventListener('pointermove', this.onPM); window.removeEventListener('resize', this.measure); clearTimeout(this.bootTimer); cancelAnimationFrame(this.raf); if (this.ro) this.ro.disconnect(); if (this.r) this.r.dispose(); }
boot() {
if (this.dead) return;
if (!this.canvas) this.canvas = document.querySelector('canvas[data-portal]');
if (!window.THREE || !this.canvas || !this.portal) { if (this.tries++ < 150) this.bootTimer = setTimeout(() => this.boot(), 100); return; }
if (this.Q.statique) { this.setState({ noGL: true }); this.clock = null; this.loop(); return; }
try { this.initHero(); } catch (err) { console.error('robot 3D', err); this.setState({ noGL: true }); }
try { this.init(); } catch (err) { this.noGL = true; }
this.clock = window.THREE ? new window.THREE.Clock() : null; this.loop();
}
go() {
if (this.went) return; this.went = true;
try { window.localStorage.setItem('theta-from-portal', '1'); } catch (err) {}
if (this.flash) { this.flash.style.transition = 'opacity .16s ease'; this.flash.style.opacity = '1'; }
setTimeout(() => { if (!this.dead) { this.go_(this.props.href.voyage); this.went = false; } }, 120);
}
init() {
const T = window.THREE; this.T = T;
const r = new T.WebGLRenderer({ canvas: this.canvas, antialias: this.Q.aa });
r.setPixelRatio(this.Q.dpr); r.setClearColor(0x0a0f17, 1); this.r = r;
const scene = new T.Scene(); this.scene = scene; scene.fog = new T.FogExp2(0x0a0f17, 0.045);
this.cam = new T.PerspectiveCamera(55, 1, 0.05, 120);
const segs = Math.round(2200 * this.Q.part); const pos = new Float32Array(segs * 6), col = new Float32Array(segs * 6); this.len = new Float32Array(segs);
const cB = new T.Color('#4C8DFF'), cP = new T.Color('#CFE0FF'), cBr = new T.Color('#D9A066'), tmp = new T.Color();
for (let i = 0; i < segs; i++) {
const a = Math.random() * Math.PI * 2, rad = 3.6 + Math.pow(Math.random(), 0.7) * 8, z = -70 + Math.random() * 82, l = 0.3 + Math.random() * 1.3;
const x = Math.cos(a) * rad, y = Math.sin(a) * rad; this.len[i] = l;
pos.set([x, y, z, x, y, z - l], i * 6);
const u = Math.random(); if (u < 0.1) tmp.copy(cBr); else tmp.copy(cB).lerp(cP, Math.random()); tmp.multiplyScalar(0.5 + Math.random() * 0.6);
col.set([tmp.r, tmp.g, tmp.b, tmp.r * 0.1, tmp.g * 0.1, tmp.b * 0.1], i * 6);
}
const sg = new T.BufferGeometry(); sg.setAttribute('position', new T.BufferAttribute(pos, 3)); sg.setAttribute('color', new T.BufferAttribute(col, 3)); this.sg = sg;
this.streakMat = new T.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.5, blending: T.AdditiveBlending, depthWrite: false });
scene.add(new T.LineSegments(sg, this.streakMat));
const core = new T.MeshBasicMaterial({ color: 0xe6eeff, toneMapped: false });
this.glow = new T.MeshBasicMaterial({ color: 0x4c8dff, transparent: true, opacity: 0.35, blending: T.AdditiveBlending, depthWrite: false, toneMapped: false });
const loop = (rx, ry) => { const p = []; for (let k = 0; k < 140; k++) { const t = k / 140 * Math.PI * 2; const y = ry * Math.sin(t); p.push(new T.Vector3(rx * Math.cos(t) + 0.21 * y, y, 0)); } return new T.CatmullRomCurve3(p, true); };
const bar = (y) => new T.LineCurve3(new T.Vector3(-1.33 + 0.21 * y, y, 0), new T.Vector3(1.33 + 0.21 * y, y, 0));
const gate = new T.Group();
[loop(2.0, 3.0), loop(1.32, 2.62)].forEach((cv) => { gate.add(new T.Mesh(new T.TubeGeometry(cv, 220, 0.018, 6, true), core)); gate.add(new T.Mesh(new T.TubeGeometry(cv, 220, 0.07, 6, true), this.glow)); });
[-0.17, 0.17].forEach((y) => { gate.add(new T.Mesh(new T.TubeGeometry(bar(y), 20, 0.018, 6, false), core)); gate.add(new T.Mesh(new T.TubeGeometry(bar(y), 20, 0.07, 6, false), this.glow)); });
gate.position.set(0, -1.25, 0); scene.add(gate); this.gate = gate;
const ring = new T.Mesh(new T.TorusGeometry(4.3, 0.008, 6, 160), new T.MeshBasicMaterial({ color: 0xd9a066, transparent: true, opacity: 0.45, toneMapped: false })); scene.add(ring); this.ring = ring;
const dn = Math.round(1400 * this.Q.part); const dp = new Float32Array(dn * 3); for (let i = 0; i < dn; i++) { const a = Math.random() * Math.PI * 2, rad = 3 + Math.random() * 9; dp.set([Math.cos(a) * rad, Math.sin(a) * rad, -70 + Math.random() * 82], i * 3); }
const dg = new T.BufferGeometry(); dg.setAttribute('position', new T.BufferAttribute(dp, 3));
this.dust = new T.Points(dg, new T.PointsMaterial({ color: 0x9cc6ff, size: 0.035, transparent: true, opacity: 0.6, blending: T.AdditiveBlending, depthWrite: false })); scene.add(this.dust);
const fit = () => { const el = this.canvas.parentElement; const w = Math.max(1, el.clientWidth), h = Math.max(1, el.clientHeight); r.setSize(w, h, false); this.cam.aspect = w / h; this.cam.updateProjectionMatrix(); };
fit(); this.ro = new ResizeObserver(fit); this.ro.observe(this.canvas.parentElement);

this.three = true;
}
loop() {
if (this.dead) return;
this.raf = requestAnimationFrame(() => this.loop());
const vh = window.innerHeight || 900;
try { this.heroFrame(); } catch (err) { console.error('robot 3D', err); this.hero3 = false; }
if (!this.inTunnel) this.stackFx(vh);
this.stepTween();
if (!this.portal || this.inTunnel) return;
const rect = this.portal.getBoundingClientRect(); const total = Math.max(1, rect.height - vh);
if (rect.top < vh * 1.6 && this.props.prefetch && !this.pre) { this.pre = true; this.props.prefetch(); }
const p = Math.max(0, Math.min(1, -rect.top / total));
const dt = this.clock ? Math.min(0.05, this.clock.getDelta()) : 0.016; const t = this.clock ? this.clock.elapsedTime : 0;
const prev = this.ps; this.ps += (p - this.ps) * Math.min(1, dt * 5);
const ps = this.ps, sp = Math.min(1, Math.abs(this.ps - prev) / Math.max(dt, 1e-3) * 1.4);
const bell = (x, a, b, c, d) => x <= a || x >= d ? 0 : x < b ? (x - a) / (b - a) : x <= c ? 1 : (d - x) / (d - c);
const o1 = ps < 0.12 ? 1 : Math.max(0, 1 - (ps - 0.12) / 0.08);
const o2 = bell(ps, 0.19, 0.26, 0.44, 0.51);
const o3 = bell(ps, 0.53, 0.6, 0.8, 0.87);
if (this.s1) { this.s1.style.opacity = o1.toFixed(3); this.s1.style.transform = 'translateY(' + (-Math.max(0, ps - 0.1) * 160).toFixed(1) + 'px)'; }
if (this.s2) { this.s2.style.opacity = o2.toFixed(3); this.s2.style.transform = 'translateY(-50%) scale(' + (0.96 + (ps - 0.19) * 0.12).toFixed(3) + ')'; }
if (this.s3) { this.s3.style.opacity = o3.toFixed(3); this.s3.style.transform = 'translateY(-50%) scale(' + (0.96 + (ps - 0.53) * 0.12).toFixed(3) + ')'; }
const txt = Math.max(o1, o2, o3);
if (this.barIn) this.barIn.style.transform = 'scaleX(' + ps.toFixed(3) + ')';
if (p < 0.85) this.armed = true;
const inView = rect.top < vh && rect.bottom > 0;
if (!this.three || !inView) return;
const ease = ps * ps * (3 - 2 * ps);
const cz = 9 - ease * 15;
this.cam.position.set(this.mx * 0.6 + Math.sin(t * 0.3) * 0.1, -this.my * 0.4 + Math.cos(t * 0.27) * 0.08, cz);
this.cam.rotation.set(this.my * 0.04, -this.mx * 0.06, Math.sin(t * 0.2) * 0.03 + ease * 0.2);
const fov = 55 + ease * 30 + sp * 8; if (Math.abs(this.cam.fov - fov) > 0.05) { this.cam.fov = fov; this.cam.updateProjectionMatrix(); }
this.streakMat.opacity = (0.45 + ease * 0.5 + sp * 0.2) * (1 - txt * 0.45);
const pa = this.sg.attributes.position.array; const stretch = 1 + ease * 4 + sp * 6;
if (Math.abs(stretch - (this.lastStretch || 0)) > 0.02) { for (let i = 0, n = this.len.length; i < n; i++) pa[i * 6 + 5] = pa[i * 6 + 2] - this.len[i] * stretch; this.sg.attributes.position.needsUpdate = true; this.lastStretch = stretch; }
this.glow.opacity = 0.3 + ease * 0.5 + Math.sin(t * 2) * 0.05;
this.gate.rotation.y = Math.sin(t * 0.4) * 0.12 * (1 - ease);
this.ring.rotation.z = t * 0.05; this.dust.rotation.z = -t * 0.02;
this.r.render(this.scene, this.cam);
}
scrollTween(y) {
const from = window.scrollY, dist = Math.abs(y - from); if (dist < 2) return;
this.stw = { from: from, to: y, t0: this.now(), dur: Math.min(1.7, 0.6 + dist / 5000) };
}
stepTween() {
const w = this.stw; if (!w) return;
const u = Math.min(1, (this.now() - w.t0) / w.dur); const e = u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2;
window.scrollTo(0, w.from + (w.to - w.from) * e); if (u >= 1) this.stw = null;
}
pdGo(dir) {
if (!this.stack || !this.cards || !this.cards.length) return;
const n = this.cards.length, ch = this.cards[0].el.offsetHeight, base = window.scrollY + this.stack.getBoundingClientRect().top;
let i = (this.pdIdx == null ? -1 : this.pdIdx) + dir;
if (i >= n) { this.pdSkip(); return; }
if (i < 0) { const sec = document.getElementById('carrousels'); if (sec) this.scrollTween(window.scrollY + sec.getBoundingClientRect().top); return; }
this.scrollTween(base + i * ch - (80 + i * 8) + 2);
}
stackFx(vh) {
if (!this.stack) return;
if (!this.cards || this.cards.length === 0) this.cards = Array.prototype.slice.call(this.stack.querySelectorAll('[data-card]')).map((el) => ({ el: el, inner: el.querySelector('[data-inner]'), shade: el.querySelector('[data-shade]') }));
const sr = this.stack.getBoundingClientRect();
const barOn = sr.top < vh * 0.55 && sr.bottom > vh * 0.8;
if (this.pdBar && this.pdBarOn !== barOn) { this.pdBarOn = barOn; this.pdBar.style.opacity = barOn ? '1' : '0'; this.pdBar.style.transform = barOn ? 'translate(-50%, 0)' : 'translate(-50%, 20px)'; this.pdBar.style.pointerEvents = barOn ? 'auto' : 'none'; }
if (sr.bottom < -50 || sr.top > vh + 50) return;
const cs = this.cards, ch = Math.max(1, cs.length ? cs[0].el.offsetHeight : vh); let act = -1;
for (let i = 0; i < cs.length; i++) {
const c = cs[i]; if (!c.inner) continue;
const rt = c.el.getBoundingClientRect();
const fan = Math.max(0, Math.min(1, (vh - rt.top) / (vh * 0.7)));
let q = 0;
if (i + 1 < cs.length) { const nt = cs[i + 1].el.getBoundingClientRect().top; q = Math.max(0, Math.min(1, 1 - (nt - rt.top) / ch)); }
const k = Math.round(q * 1000);
if (c.k !== k) { c.k = k; c.inner.style.transform = 'scale(' + (1 - q * 0.07).toFixed(4) + ')'; if (c.shade) c.shade.style.opacity = (q * 0.6).toFixed(3); }
const f = (fan * (1 - q * 0.6)).toFixed(3);
if (rt.top <= 80 + i * 8 + 6) act = i;
if (c.f !== f) { c.f = f; c.inner.style.setProperty('--f', f); }
}
this.pdIdx = act;
const lbl = String(Math.max(1, act + 1)).padStart(2, '0') + ' / ' + String(cs.length).padStart(2, '0');
if (this.pdCount && this.pdCount.textContent !== lbl) this.pdCount.textContent = lbl;
}
renderVals() {
const loader = true;
const d = (n) => 'calc(var(--intro-base) + ' + (n * 0.14).toFixed(2) + 's)';
const vh = this.state.vh || 900;
return {
showLoader: loader, d0: d(0), d1: d(1), d2: d(2), d3: d(3), d4: d(4), d5: d(5), d6: d(6),
portalH: this.state.tactile ? '100dvh' : Math.round(vh * 3) + 'px', stickyH: this.state.tactile ? '100dvh' : vh + 'px', tactile: !!this.state.tactile, href: this.props.href, hrefConf: this.props.hrefConf, total: String(this.props.total), nbLabos: String(this.props.nbLabos), rythme: String(this.props.rythme), prochain: this.props.prochain, portes: this.props.portes, nbEps: this.props.nbEps,

eps: this.EPS.map((e, i) => {
const light = !e.guide && i % 2 === 1;
const bg = e.guide ? '#1C46C9' : light ? '#F5F8FC' : '#0A0F17';
return {
n: e.guide ? 'θ' : e.n, total: e.guide ? this.L('Saison 1') : String(this.props.total), coverNo: e.guide ? 'Guide' : 'Nº ' + e.n, group: e.group, t1: e.t1, t2: e.t2, text: e.text,
top: (80 + i * 8) + 'px', bg: bg,
fg: light ? '#0A0F17' : '#F5F8FC', muted: light ? '#4A5768' : e.guide ? '#CFE0FF' : '#A7B3C2',
accent: light ? '#1C46C9' : '#CFE0FF', line: light ? '#DCE3EC' : e.guide ? '#1C46C9' : '#1E2938', line2: light ? '#C9D4E3' : e.guide ? '#4C8DFF' : '#2E3B4D',
panel: e.guide ? '#1C46C9' : light ? '#DCE3EC' : '#0A0F17',
btnBg: light ? '#0A0F17' : '#F5F8FC', btnFg: light ? '#F5F8FC' : '#0A0F17',
pdf: (e.guide || e.bientot) ? '#inscription' : '/pdf/theta-' + e.n + '.pdf', target: (e.guide || e.bientot) ? undefined : (this.state.tactile ? '_blank' : undefined), labHref: e.labHref || '#',
file: (e.guide || e.bientot) ? undefined : 'Theta-' + e.n + '.pdf',
cta: e.guide ? this.L('Recevoir le guide') : e.bientot ? e.bientot : this.L('Télécharger le PDF'),
icon: (e.guide || e.bientot) ? 'M4 6h16v12H4zM4 7l8 6 8-6' : 'M12 4v12M6 11l6 6 6-6M5 20h14',
hasCover: !!e.cover, noCover: !e.cover, cover: e.cover || '', coverAlt: e.cover ? this.L('Couverture du carrousel Nº ') + e.n : '', dl: this.dl, lab: this.toLabo, mail: this.openMail, hasMail: !e.guide && !e.bientot && !!this.props.inscription, plain: e.t1 + ' ' + e.t2, foot: e.guide ? this.L('Fin de saison · inscription ci-dessous') : e.bientot ? this.L('Carrousel θ Théta · PDF') : this.L('Carrousel θ Théta · PDF') + ' · ' + e.pages + ' pages', aria: e.guide ? this.L('S’inscrire pour recevoir le guide de la saison') : e.bientot ? e.bientot : this.L('Télécharger le PDF de l’épisode ') + e.n, badge: e.guide ? this.L('Recevoir le guide') : e.bientot ? e.bientot : this.L('Télécharger le PDF · Nº ') + e.n, h: Math.max(500, Math.min(820, vh - 80 - 8 * (this.EPS.length - 1) - 10)) + 'px', hasLab: !!e.theme, theme: e.theme || ''
};
}),
setStack: this.setStack, setFrame: this.setFrame, setLaboA: this.setLaboA, toPdf: this.toPdf,

yes: true, fPdfPressed: this.state.fPdf ? 'true' : 'false', fNewsPressed: this.state.fNews ? 'true' : 'false', fTogPdf: this.fTogPdf, fTogNews: this.fTogNews,
mOpen: this.state.mOpen, mEp: this.state.mEp, mTitle: this.state.mTitle, mDone: this.state.mStatus === 'done', mForm: this.state.mStatus !== 'done', mErr: this.state.mErr, mMailBad: this.state.mStatus === 'bad' ? 'true' : 'false',
mBtnTxt: this.state.mStatus === 'sending' ? this.L('Envoi…') : this.L('Recevoir le PDF'), mBtnOp: this.state.mStatus === 'sending' ? 0.6 : 1,
setMMail: this.setMMail, setMOk: this.setMOk, setMNews: this.setMNews, setMTrap: this.setMTrap, closeMail: this.closeMail, mBack: this.mBack, mSubmit: this.mSubmit,
inscription: !!this.props.inscription, fOpen: !!this.props.inscription && this.state.fStatus !== 'done', fDone: this.state.fStatus === 'done', fErr: this.state.fErr, fMailBad: this.state.fStatus === 'bad' ? 'true' : 'false',
fBtnTxt: this.state.fStatus === 'sending' ? this.L('Inscription…') : this.L('Je m’inscris'), fBtnOp: this.state.fStatus === 'sending' ? 0.6 : 1,
fDoneTxt: this.L('Votre inscription est enregistrée') + this.L(this.state.fPdf && this.state.fNews ? this.L(' pour les PDF et la newsletter.') : this.state.fPdf ? this.L(' pour les PDF des épisodes.') : this.L(' pour la newsletter.')),
fThanks: this.state.fName ? this.L('Merci ') + this.state.fName + this.L(' !') : this.L('Merci !'),
setFName: this.setFName, setFMail: this.setFMail, setFOk: this.setFOk, setFTrap: this.setFTrap, fSubmit: this.fSubmit, fReset: this.fReset,
toast: this.state.toast, toastOp: this.state.toastOn ? 1 : 0, toastY: this.state.toastOn ? '0' : '16px', toastPE: this.state.toastOn && this.state.toastHref ? 'auto' : 'none', toastHref: this.state.toastHref, toastLabel: this.state.toastLabel, hasToastLink: !!this.state.toastHref,
heroH: Math.max(720, Math.min(vh, 1100)) + 'px', setHeroCanvas: this.setHeroCanvas, setBubble: this.setBubble, poke: this.poke, noGL: this.state.noGL || !this.state.heroPret,
setPdBar: this.setPdBar, setPdCount: this.setPdCount, pdNext: this.pdNext, pdPrev: this.pdPrev, pdSkip: this.pdSkip,
setPortal: this.setPortal, setCanvas: this.setCanvas, setS1: this.setS1, setS2: this.setS2, setS3: this.setS3, setBar: this.setBar, setBarIn: this.setBarIn, setFlash: this.setFlash, setGo: this.setGo, setIris: this.setIris, toLabo: this.toLabo, toProfil: this.toProfil, ctMove: this.ctMove, ftHome: this.ftHome, ftProfil: this.ftProfil, toForm: this.toForm,
openLegal: this.openLegal, lgClose: this.lgClose, lgBack: this.lgBack, ftTop: this.ftTop,
 irisOp: this.state.iris ? 1 : 0,
enter: this.enter, goNow: this.goNow,
marquee: [this.L('Données'), this.L('Caractéristiques'), this.L('Fonction de coût'), this.L('Dérivée'), this.L('Gradient'), this.L('Descente de gradient'), this.L('Mini-lots'), this.L('Points selle'), this.L('Régression linéaire'), this.L('Données'), this.L('Caractéristiques'), this.L('Fonction de coût'), this.L('Dérivée'), this.L('Gradient'), this.L('Descente de gradient'), this.L('Mini-lots'), this.L('Points selle'), this.L('Régression linéaire')].map((t) => ({ t: this.L(t) }))
};
}
}
