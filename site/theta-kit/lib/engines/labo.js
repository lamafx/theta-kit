import { DCLogic } from './base';
import { themesSerie } from './labo-series';

export class LaboEngine extends DCLogic {
constructor(...args) {
super(...args);
this.C = { white: '#F5F8FC', blue: '#4C8DFF', light: '#9CC6FF', pale: '#CFE0FF', bronze: '#D9A066', muted: '#8A97A8', grid: '#2E3B4D' };
this.TH = this.themesDef();
this.ORDER = ['exemples', 'donnees', 'familles', 'modele', 'cout', 'derivee', 'gradient', 'descente', 'minilots', 'minlocaux', 'selle', 'regression'];
this.onPa = (e) => this.setState({ pa: parseFloat(e.target.value) });
this.onPb = (e) => this.setState({ pb: parseFloat(e.target.value) });
this.BATCH = [1, 8, 32, 256];
const saved = this.TH[this.props.theme] ? this.props.theme : null;
this.state = { theme: saved, eta: null, batch: 1, noise: false, h: 0.5, playing: false, showNeg: false, stats: [], calc: [], msg: '', chart: null, done: {}, ready: false, flash: false, dragging: false, success: false, exiting: false };
this.view = { yaw: 0, pitch: 0.3 }; this.drag = null; this.params = null; this.anim = null; this.hist = [];
this.steps = 0; this.examples = 0; this.converged = false; this.diverged = false; this.visitedSaddle = false; this.usedNoise = false; this.faceY = 0; this.lastStepT = -1; this.lastUI = 0;
this.setCanvas = (el) => { if (el) this.canvas = el; };
this.setIris = (el) => { this.irisEl = el; };
this.onDown = (e) => this.pDown(e);
this.onMove = (e) => this.pMove(e);
this.onUp = () => this.pUp();
this.goVoyage = (e) => this.leave(e);
this.goMain = (e) => this.leave(e);
this.togglePlay = () => { if (!this.three) return; if (this.diverged) this.resetPos(); this.converged = false; this.lastStepT = -1; this.setState({ playing: !this.state.playing }); };
this.doStep = () => { if (!this.three) return; if (this.diverged) this.resetPos(); this.converged = false; this.setState({ playing: false }); this.stepOnce(); };
this.doReset = () => { if (!this.three) return; this.setState({ playing: false }); this.resetPos(); };
this.onEta = (e) => this.setState({ eta: parseFloat(e.target.value) });
this.onBatch = (e) => this.setState({ batch: parseInt(e.target.value, 10) });
this.onH = (e) => this.setState({ h: parseFloat(e.target.value) });
this.toggleNoise = () => this.setState({ noise: !this.state.noise });
this.toggleNeg = () => this.setState({ showNeg: !this.state.showNeg });
this.push = () => {
if (!this.three || !this.params) return;
const p = this.params; this.converged = false;
this.animTo([p[0], p[1] + (Math.random() < 0.5 ? -0.12 : 0.12)], 0.45, 0.12);
};
this.recenter = () => { this.viewT = { yaw: 0.0, pitch: this.th().kind === '1d' ? 0.3 : 0.62 }; };
this.picks = {};
this.ORDER.forEach((k) => { this.picks[k] = () => this.pickTheme(k); });
}
leave(e) {
if (this.leaving) return;
if (e && e.preventDefault) e.preventDefault();
const a = e && e.currentTarget; if (!a || this.state.exiting) return;
this.setState({ exiting: true, playing: false });
const ir = this.irisEl;
if (ir) {
const rr = ir.getBoundingClientRect(); const ar = a.getBoundingClientRect();
const x = (e.clientX ? e.clientX : ar.left + ar.width / 2) - rr.left, y = (e.clientY ? e.clientY : ar.top + ar.height / 2) - rr.top;
ir.style.transition = 'none'; ir.style.clipPath = 'circle(0px at ' + x + 'px ' + y + 'px)'; void ir.offsetWidth;
ir.style.transition = 'clip-path .8s cubic-bezier(.7,0,.25,1)'; ir.style.clipPath = 'circle(150% at ' + x + 'px ' + y + 'px)';
}
setTimeout(() => {
if (this.dead) return; this.leaving = true;
this.go_(a.getAttribute('href'));
setTimeout(() => { if (!this.dead) { this.leaving = false; if (this.irisEl) { this.irisEl.style.transition = 'none'; this.irisEl.style.clipPath = 'circle(0px at 50% 50%)'; } this.setState({ exiting: false }); } }, 1400);
}, 820);
}

themesDef() {
const C = this.C;
const lm = (x) => 0.42 * Math.pow(x * x - 0.9, 2) + 0.16 * x;
const dlm = (x) => 1.68 * x * (x * x - 0.9) + 0.16;
return {
...themesSerie(this),
derivee: { id: 'derivee', num: '06', badge: '06', title: this.L('La dérivée'), tab: this.L('Dérivée'), sub: this.L('La pente en un point'), kind: '1d',
J: (x) => x * x, dJ: (x) => 2 * x, xmin: -2, xmax: 2, sx: 0.85, sy: 0.32, base: -0.75, start: [1.5],
idea: this.L('J′(a) mesure la pente de J au point a : son signe dit si J monte ou descend, sa taille dit à quelle vitesse. Glissez le robot, puis réduisez h.'),
formula: 'J(a) = a²', goal: this.L('placez le robot là où la pente vaut 0.'), ctl: { h: true },
legend: [[C.white, this.L('tangente J′(a)')], [C.bronze, this.L('sécante entre a et a + h')]] },
gradient: { id: 'gradient', num: '07', badge: '07', title: this.L('Le gradient'), tab: this.L('Gradient'), sub: this.L('Deux réglages, une flèche'), kind: '2d',
J: (a, b) => a * a + 3 * b * b, G: (a, b) => [2 * a, 6 * b], ra: 1.6, rb: 1.0, s: 1.0, sy: 0.2, base: -0.75, jmin: 0, jmax: 5.6, start: [1.2, 0.6], k: 0.16,
idea: this.L('Une pente par réglage : ∂J/∂a et ∂J/∂b. Le gradient ∇J les réunit en une flèche qui pointe vers la montée la plus raide. Placez le robot n’importe où.'),
formula: 'J(a, b) = a² + 3b²', goal: this.L('amenez le robot là où ∇J est presque nul.'), ctl: { neg: true },
legend: [[C.light, '∂J/∂a'], [C.bronze, '∂J/∂b'], [C.white, '∇J'], [C.blue, '−∇J']] },
descente: { id: 'descente', num: '08', badge: '08', title: this.L('Descente de gradient'), tab: this.L('Descente'), sub: this.L('Le rôle du pas η'), kind: '1d',
J: (x) => x * x, dJ: (x) => 2 * x, xmin: -2, xmax: 2, sx: 0.85, sy: 0.32, base: -0.75, start: [1.8], eta: 0.2,
idea: this.L('Un pas à la fois, dans le sens opposé à la pente. η fixe la longueur du pas : comparez 0,1 ; 0,5 ; 0,9 et 1,1.'),
formula: 'a ← a − η · J′(a)', goal: this.L('atteignez le minimum en 6 pas au plus.'), ctl: { eta: true, play: true },
legend: [[C.white, this.L('prochain pas')], [C.blue, this.L('chemin parcouru')]] },
minilots: { id: 'minilots', num: '09', badge: '09', title: this.L('Mini-lots'), tab: this.L('Mini-lots'), sub: this.L('Une pente estimée'), kind: '2d',
J: (a, b) => a * a + 3 * b * b, G: (a, b) => [2 * a, 6 * b], ra: 1.6, rb: 1.0, s: 1.0, sy: 0.2, base: -0.75, jmin: 0, jmax: 5.6, start: [1.45, 0.85], eta: 0.1, k: 0.16,
idea: this.L('La pente est estimée sur un petit lot de B exemples tirés au hasard : chaque pas coûte moins, mais la direction est bruitée.'),
formula: this.L('θ ← θ − η · ∇J estimé'), goal: this.L('approchez le minimum (J < 0,03) en lisant au plus 300 exemples.'), ctl: { eta: true, play: true, batch: true },
legend: [[C.white, this.L('vraie pente')], [C.bronze, this.L('pente estimée')], [C.blue, this.L('chemin')]] },
minlocaux: { id: 'minlocaux', num: '10', badge: '10', title: this.L('Minimums locaux'), tab: this.L('Min. locaux'), sub: this.L('Le départ compte'), kind: '1d',
J: lm, dJ: dlm, xmin: -1.55, xmax: 1.55, sx: 1.1, sy: 0.9, base: -0.55, start: [1.38], eta: 0.18, xg: -0.998, xl: 0.89,
idea: this.L('La descente s’arrête dès que la pente est nulle, même dans un creux qui n’est pas le plus bas. Essayez un autre départ, ou le bruit.'),
formula: 'a ← a − η · J′(a)', goal: this.L('atteignez le minimum global sans activer le bruit.'), ctl: { eta: true, play: true, noise: true },
legend: [[C.white, this.L('prochain pas')], [C.blue, this.L('chemin parcouru')]] },
selle: { id: 'selle', num: '10', badge: '10b', title: this.L('Point selle'), tab: this.L('Point selle'), sub: this.L('Plat, sans être un creux'), kind: '2d',
J: (a, b) => a * a - b * b + 0.3 * Math.pow(b, 4), G: (a, b) => [2 * a, -2 * b + 1.2 * b * b * b], ra: 1.4, rb: 1.75, s: 0.95, sy: 0.38, base: -0.15, jmin: -0.85, jmax: 2.0, start: [1.3, 0], eta: 0.12, k: 0.3,
idea: this.L('Pente nulle, mais ce n’est pas un creux : J monte selon a et descend selon b, comme au milieu d’un col. Lancez, puis poussez le robot.'),
formula: this.L('J(a, b) = a² − b² + 0,3 b⁴'), goal: this.L('bloquez le robot au point selle, puis faites-le descendre dans un creux.'), ctl: { eta: true, play: true, push: true },
legend: [[C.white, '−∇J'], [C.blue, this.L('chemin parcouru')]] }
};
}
fallbackTheme() { this.setState({ msg: '', calc: [], stats: [] }); }
themeKey() { return this.state.theme || this.props.theme || 'descente'; }
th() { return this.TH[this.themeKey()] || this.TH.descente; }
etaVal() { const t = this.th(); return this.state.eta != null ? this.state.eta : (t.eta || 0.2); }
fmt(v, d) { if (!Number.isFinite(v)) return '∞'; const n = d == null ? 2 : d; const r = Math.abs(v).toFixed(n); return (v < 0 && Number(r) !== 0 ? '−' : '') + r.replace('.', this.props.locale === 'en' ? '.' : ','); }
gauss() { let u = 0, v = 0; while (u === 0) u = Math.random(); while (v === 0) v = Math.random(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }

componentDidMount() { this.tries = 0; this.boot(); }
componentWillUnmount() {
this.dead = true; clearTimeout(this.bootTimer); clearTimeout(this.flashT); cancelAnimationFrame(this.raf);
if (this.ro) this.ro.disconnect();
if (this.r) this.r.dispose();
}
componentDidUpdate(prevProps) {
if (this.three && prevProps.theme !== this.props.theme && !this.state.theme) this.buildTheme();
}
boot() {
if (this.dead) return;
if (!this.canvas) this.canvas = document.querySelector('canvas[data-lab3d]');
if (!window.THREE || !this.canvas) { if (this.tries++ < 150) this.bootTimer = setTimeout(() => this.boot(), 100); return; }
try { this.init(); this.three = true; this.buildTheme(); this.setState({ ready: true }); this.loop(); }
catch (err) { this.three = false; this.setState({ noGL: true, ready: true }); this.fallbackTheme(); }
}
pickTheme(k) {
if (this.swap) { this.swapSuivant = k; return; }
if (k === this.themeKey()) return;
this.swap = { t: 0, k: k };
this.setState({ playing: false });
if (this.props.onTheme) this.props.onTheme(k);
}

init() {
const T = window.THREE; this.T = T; const C = this.C;
if (this.Q.statique === 'webgl') throw new Error('webgl');
const r = new T.WebGLRenderer({ canvas: this.canvas, antialias: this.Q.aa, alpha: true });
r.setPixelRatio(this.Q.dpr);
r.outputColorSpace = T.SRGBColorSpace; r.toneMapping = T.ACESFilmicToneMapping; r.toneMappingExposure = 1.1;
r.shadowMap.enabled = true; r.shadowMap.type = T.PCFSoftShadowMap;
this.r = r;
const scene = new T.Scene(); this.scene = scene;
this.cam = new T.PerspectiveCamera(30, 1, 0.1, 80);
this.ray = new T.Raycaster();
const pm = new T.PMREMGenerator(r); const es = new T.Scene();
es.add(new T.Mesh(new T.BoxGeometry(12, 12, 12), new T.MeshBasicMaterial({ color: 0x1a2a4a, side: T.BackSide })));
const lamp = (c, w, h, x, y, z) => { const m = new T.Mesh(new T.PlaneGeometry(w, h), new T.MeshBasicMaterial({ color: c, side: T.DoubleSide })); m.position.set(x, y, z); m.lookAt(0, 0, 0); es.add(m); };
lamp(0xffffff, 5, 3, -3, 4, 3); lamp(0xffffff, 3, 2, 4, 1.5, 3.5); lamp(0x4c8dff, 8, 2, 0, -5, 0);
scene.environment = pm.fromScene(es, 0.04).texture; pm.dispose();
scene.add(new T.HemisphereLight(0xcfe0ff, 0x0a0f17, 0.7));
const key = new T.DirectionalLight(0xffffff, 2.0); key.position.set(-2.5, 5.5, 3.5); key.castShadow = true;
key.shadow.mapSize.set(this.Q.ombre, this.Q.ombre);
const sc = key.shadow.camera; sc.left = -3; sc.right = 3; sc.top = 3; sc.bottom = -3; sc.near = 0.5; sc.far = 18;
key.shadow.bias = -0.0004; key.shadow.normalBias = 0.02; key.shadow.radius = 4;
scene.add(key);
const rim = new T.DirectionalLight(0x9cc6ff, 1.2); rim.position.set(3, 2, -3.5); scene.add(rim);
const dn = Math.round(260 * this.Q.part); const dp = new Float32Array(dn * 3);
for (let i = 0; i < dn; i++) { const a = Math.random() * Math.PI * 2, b = Math.acos(2 * Math.random() - 1), rr = 5 + Math.random() * 8; dp.set([Math.sin(b) * Math.cos(a) * rr, Math.sin(b) * Math.sin(a) * rr * 0.6, Math.cos(b) * rr - 3], i * 3); }
const dg = new T.BufferGeometry(); dg.setAttribute('position', new T.BufferAttribute(dp, 3));
this.dust = new T.Points(dg, new T.PointsMaterial({ color: 0x9cc6ff, size: 0.025, transparent: true, opacity: 0.35, blending: T.AdditiveBlending, depthWrite: false })); scene.add(this.dust);
const glow = (c, e) => new T.MeshStandardMaterial({ color: new T.Color(c), emissive: new T.Color(c), emissiveIntensity: e, roughness: 0.35 });
this.mat = {
white: new T.MeshPhysicalMaterial({ color: 0xf6f8fb, roughness: 0.3, clearcoat: 1, clearcoatRoughness: 0.12 }),
visor: new T.MeshPhysicalMaterial({ color: 0x04070b, roughness: 0.06, metalness: 0.3, clearcoat: 1, clearcoatRoughness: 0.02 }),
eye: new T.MeshStandardMaterial({ color: 0x9cc6ff, emissive: 0x9cc6ff, emissiveIntensity: 2.4 }),
bronze: new T.MeshStandardMaterial({ color: 0xc8925a, metalness: 1, roughness: 0.3 }),
metal: new T.MeshStandardMaterial({ color: 0xc9d1da, metalness: 1, roughness: 0.32 }),
dark: new T.MeshStandardMaterial({ color: 0x262e39, metalness: 0.5, roughness: 0.4 }),
chest: glow(C.blue, 1.2),
gWhite: glow(C.white, 0.55), gBlue: glow(C.blue, 0.9), gLight: glow(C.light, 0.6), gBronze: glow(C.bronze, 0.45), axis: glow('#4A5768', 0.05),
landV: new T.MeshStandardMaterial({ vertexColors: true, roughness: 0.5, metalness: 0.05, side: T.DoubleSide, transparent: true, opacity: 1 }),
trail: new T.LineBasicMaterial({ color: 0x9cc6ff, transparent: true, opacity: 0.8 })
};
this.geo = { axShaft: new T.CylinderGeometry(0.008, 0.008, 1, 8), axHead: new T.ConeGeometry(0.03, 0.08, 12), dot: new T.SphereGeometry(0.03, 16, 12) };
Object.keys(this.geo).forEach((k) => { this.geo[k].userData.shared = true; });
const rob = new T.Group(); rob.add(this.makeRobot()); this.rob = rob; scene.add(rob);
this.arA = this.makeArrow(this.mat.gLight); this.arB = this.makeArrow(this.mat.gBronze); this.arG = this.makeArrow(this.mat.gWhite);
this.arN = this.makeArrow(this.mat.gBlue); this.arEst = this.makeArrow(this.mat.gBronze); this.arStep = this.makeArrow(this.mat.gWhite);
[this.arA, this.arB, this.arG, this.arN, this.arEst, this.arStep].forEach((a) => scene.add(a));
this.tan = new T.Mesh(new T.CylinderGeometry(0.016, 0.016, 1, 12), this.mat.gWhite); scene.add(this.tan);
this.sec = new T.Mesh(new T.CylinderGeometry(0.012, 0.012, 1, 12), this.mat.gBronze); scene.add(this.sec);
this.secDot = new T.Mesh(new T.SphereGeometry(0.045, 20, 14), this.mat.gBronze); scene.add(this.secDot);
this.ghost = new T.Mesh(new T.TorusGeometry(0.08, 0.014, 12, 36), this.mat.gWhite); this.ghost.rotation.x = Math.PI / 2; scene.add(this.ghost);
this.tags = [0, 1, 2, 3].map(() => { const s = this.makeTag(); scene.add(s); return s; });
this.trail = new T.Group(); scene.add(this.trail); this.trailPts = [];
this.clock = new T.Clock(); this.viewT = null;
this.ro = new ResizeObserver(() => this.fit()); this.ro.observe(this.canvas.parentElement);
}
fit() {
if (!this.r) return;
const el = this.canvas.parentElement; const w = Math.max(1, el.clientWidth), h = Math.max(1, el.clientHeight);
this.r.setSize(w, h, false); this.cam.aspect = w / h;
const vis = 2 * Math.tan(this.cam.fov * Math.PI / 360);
const two = this.th().kind === '2d';
const H = two ? 3.1 : 2.7, W = two ? 4.3 : 4.0;
const wide = w > 980; const effW = wide ? Math.max(360, w - 460) : w; const effH = wide ? Math.max(280, h - 180) : h;
this.camDist = Math.max(H * h / (vis * effH), W * h / (vis * effW)) * 1.02;
this.offX = wide ? 0.13 * w : 0;
if (wide) this.cam.setViewOffset(w, h, -this.offX, -20, w, h); else this.cam.clearViewOffset();
this.cam.updateProjectionMatrix();
}

makeRobot() {
const T = this.T, M = this.mat; const b = new T.Group();
const add = (geo, mat, x, y, z) => { const m = new T.Mesh(geo, mat); m.position.set(x, y, z); m.castShadow = true; m.receiveShadow = true; b.add(m); return m; };
const torso = add(new T.SphereGeometry(0.62, 64, 40), M.white, 0, -0.1, 0); torso.scale.set(1.25, 0.7, 0.8);
[-1, 1].forEach((s) => {
add(new T.SphereGeometry(0.14, 32, 24), M.white, s * 0.7, -0.02, 0.04);
add(new T.TorusGeometry(0.1, 0.022, 16, 48), M.bronze, s * 0.7, -0.02, 0.17);
});
add(new T.TorusGeometry(0.1, 0.014, 12, 48), M.metal, 0, -0.1, 0.49);
add(new T.SphereGeometry(0.055, 24, 16), M.chest, 0, -0.1, 0.49);
add(new T.CylinderGeometry(0.12, 0.14, 0.24, 32), M.metal, 0, 0.36, 0);
const collar = add(new T.TorusGeometry(0.15, 0.03, 12, 40), M.bronze, 0, 0.27, 0); collar.rotation.x = Math.PI / 2;
const head = add(new T.SphereGeometry(0.5, 64, 48), M.white, 0, 0.95, 0); head.scale.set(1.1, 1, 0.95);
const visor = add(new T.SphereGeometry(0.507, 64, 32, Math.PI / 2 - 0.78, 1.56, Math.PI / 2 - 0.3, 0.6), M.visor, 0, 0.95, 0); visor.scale.set(1.1, 1, 0.95);
this.eyes = [-1, 1].map((s) => {
const e = add(new T.CapsuleGeometry(0.04, 0.1, 6, 16), M.eye, s * 0.17, 0.97, 0);
const q = 0.17 / 0.55; e.position.z = 0.475 * Math.sqrt(1 - q * q) + 0.035;
e.rotation.z = Math.PI / 2; e.rotation.y = s * 0.3; return e;
});
add(new T.BoxGeometry(0.08, 0.014, 0.02), M.chest, 0, 0.84, 0.46);
[-1, 1].forEach((s) => {
const cup = add(new T.CylinderGeometry(0.21, 0.21, 0.16, 48), M.white, s * 0.6, 0.95, 0); cup.rotation.z = Math.PI / 2;
const ring = add(new T.TorusGeometry(0.16, 0.035, 16, 48), M.bronze, s * 0.69, 0.95, 0); ring.rotation.y = Math.PI / 2;
const disc = add(new T.CylinderGeometry(0.125, 0.125, 0.03, 40), M.metal, s * 0.685, 0.95, 0); disc.rotation.z = Math.PI / 2;
});
add(new T.TorusGeometry(0.66, 0.045, 16, 64, Math.PI), M.dark, 0, 0.95, 0);
b.position.y = -0.56;
return b;
}
makeArrow(mat) {
const T = this.T; const g = new T.Group();
const shaft = new T.Mesh(new T.CylinderGeometry(0.018, 0.018, 1, 14), mat); shaft.castShadow = true;
const head = new T.Mesh(new T.ConeGeometry(0.05, 0.13, 20), mat); head.castShadow = true;
g.add(shaft); g.add(head); g.userData = { shaft: shaft, head: head }; g.visible = false; return g;
}
setArrow(g, origin, dir, len) {
if (!(len > 0.03)) { g.visible = false; return; }
const s = g.userData.shaft, h = g.userData.head; const L = Math.max(0.01, len - 0.13);
s.scale.y = L; s.position.y = L / 2; h.position.y = L + 0.065;
g.position.copy(origin); g.quaternion.setFromUnitVectors(new this.T.Vector3(0, 1, 0), dir.clone().normalize()); g.visible = true;
}
tipOf(origin, dir, len) { return origin.clone().addScaledVector(dir.clone().normalize(), len); }
placeBar(m, center, dir, len) { m.scale.set(1, len, 1); m.position.copy(center); m.quaternion.setFromUnitVectors(new this.T.Vector3(0, 1, 0), dir.clone().normalize()); m.visible = true; }
makeTag() {
const T = this.T; const m = new T.SpriteMaterial({ transparent: true, depthTest: false, depthWrite: false });
const s = new T.Sprite(m); s.renderOrder = 20; s.visible = false; s.userData = { text: null, accent: null }; return s;
}
setTag(s, text, pos, accent) {
const T = this.T;
if (s.userData.text !== text || s.userData.accent !== accent) {
const c = document.createElement('canvas'); const x0 = c.getContext('2d'); const font = '500 40px ' + getComputedStyle(document.documentElement).getPropertyValue('--font-mono');
x0.font = font; const w = Math.ceil(x0.measureText(text).width) + 56; c.width = w; c.height = 84;
const x = c.getContext('2d'); x.font = font;
const r = 34, hh = 68, y0 = 8;
x.beginPath(); x.moveTo(r, y0); x.lineTo(w - r, y0); x.arc(w - r, y0 + r, r, -Math.PI / 2, Math.PI / 2); x.lineTo(r, y0 + hh); x.arc(r, y0 + r, r, Math.PI / 2, Math.PI * 1.5); x.closePath();
x.fillStyle = 'rgba(10,15,23,0.78)'; x.fill();
x.fillStyle = accent || '#F5F8FC'; x.textBaseline = 'middle'; x.fillText(text, 28, y0 + hh / 2 + 2);
if (s.material.map) s.material.map.dispose();
const tex = new T.CanvasTexture(c); tex.colorSpace = T.SRGBColorSpace; s.material.map = tex; s.material.needsUpdate = true;
const H = 0.13; s.scale.set(H * w / 84, H, 1);
s.userData.text = text; s.userData.accent = accent;
}
s.position.copy(pos); s.visible = true;
}
makeLabel(text) {
const T = this.T; const c = document.createElement('canvas'); c.width = 128; c.height = 128;
const x = c.getContext('2d'); x.font = 'italic 400 88px ' + getComputedStyle(document.documentElement).getPropertyValue('--font-serif'); x.fillStyle = '#8A97A8'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(text, 64, 70);
const tex = new T.CanvasTexture(c); tex.colorSpace = T.SRGBColorSpace;
const m = new T.SpriteMaterial({ map: tex, transparent: true, depthWrite: false }); m.userData.own = true;
const s = new T.Sprite(m); s.scale.set(0.24, 0.24, 1); return s;
}
makeAxis(o, dir, len, label) {
const T = this.T; const g = new T.Group(); const q = new T.Quaternion().setFromUnitVectors(new T.Vector3(0, 1, 0), dir);
const shaft = new T.Mesh(this.geo.axShaft, this.mat.axis); shaft.scale.y = len; shaft.position.copy(o).addScaledVector(dir, len / 2); shaft.quaternion.copy(q);
const head = new T.Mesh(this.geo.axHead, this.mat.axis); head.position.copy(o).addScaledVector(dir, len + 0.04); head.quaternion.copy(q);
const lab = this.makeLabel(label); lab.position.copy(o).addScaledVector(dir, len + 0.2);
g.add(shaft); g.add(head); g.add(lab); return g;
}
staticTag(g, text, pos) { const s = this.makeTag(); s.material.userData = { own: true }; this.setTag(s, text, pos, '#D9A066'); g.add(s); }
wallMat() { const T = this.T; const m = new T.MeshStandardMaterial({ color: 0x0d1626, roughness: 0.8, metalness: 0.05, side: T.DoubleSide }); m.userData.own = true; return m; }
gridMat() { const m = new this.T.LineBasicMaterial({ color: 0xcfe0ff, transparent: true, opacity: 0.12 }); m.userData.own = true; return m; }
heightColor(t, tmp) {
const lo = this.cLo || (this.cLo = new this.T.Color('#13223F')), mid = this.cMid || (this.cMid = new this.T.Color('#1C46C9')), hi = this.cHi || (this.cHi = new this.T.Color('#CFE0FF'));
if (t < 0.5) tmp.copy(lo).lerp(mid, t * 2); else tmp.copy(mid).lerp(hi, (t - 0.5) * 2);
return tmp;
}

build1d(th) {
const T = this.T, g = new T.Group(); const NX = 160, NZ = 8, D = 1.0;
const xs = [], ys = [];
for (let i = 0; i <= NX; i++) { const x = th.xmin + (th.xmax - th.xmin) * i / NX; xs.push(x); ys.push(th.base + th.sy * th.J(x)); }
const ymin = Math.min.apply(null, ys), ymax = Math.max.apply(null, ys); const bottom = ymin - 0.22;
const geo = new T.PlaneGeometry(1, 1, NX, NZ); const p = geo.attributes.position; const cols = []; const tmp = new T.Color();
for (let i = 0; i < p.count; i++) {
const x = th.xmin + (th.xmax - th.xmin) * (p.getX(i) + 0.5); const y = th.base + th.sy * th.J(x);
p.setXYZ(i, x * th.sx, y, -p.getY(i) * D);
this.heightColor((y - ymin) / Math.max(1e-6, ymax - ymin), tmp); cols.push(tmp.r, tmp.g, tmp.b);
}
geo.setAttribute('color', new T.Float32BufferAttribute(cols, 3)); p.needsUpdate = true; geo.computeVertexNormals();
const top = new T.Mesh(geo, this.mat.landV); top.receiveShadow = true; g.add(top); this.landTop = top;
const wall = this.wallMat();
const shape = new T.Shape(); shape.moveTo(th.xmin * th.sx, bottom);
for (let i = 0; i <= NX; i++) shape.lineTo(xs[i] * th.sx, ys[i]);
shape.lineTo(th.xmax * th.sx, bottom); shape.lineTo(th.xmin * th.sx, bottom);
const sg = new T.ShapeGeometry(shape);
const fr = new T.Mesh(sg, wall); fr.position.z = D / 2; g.add(fr);
const bk = new T.Mesh(sg, wall); bk.position.z = -D / 2; g.add(bk);
[0, NX].forEach((i) => { const hh = ys[i] - bottom; const side = new T.Mesh(new T.PlaneGeometry(D, hh), wall); side.rotation.y = Math.PI / 2; side.position.set(xs[i] * th.sx, bottom + hh / 2, 0); g.add(side); });
const edgeMat = new T.LineBasicMaterial({ color: 0x9cc6ff, transparent: true, opacity: 0.7 }); edgeMat.userData.own = true;
g.add(new T.Line(new T.BufferGeometry().setFromPoints(xs.map((x, i) => new T.Vector3(x * th.sx, ys[i] + 0.004, D / 2))), edgeMat));
const gm = this.gridMat();
for (let i = 0; i <= 16; i++) { const x = th.xmin + (th.xmax - th.xmin) * i / 16; const y = th.base + th.sy * th.J(x) + 0.004; g.add(new T.Line(new T.BufferGeometry().setFromPoints([new T.Vector3(x * th.sx, y, -D / 2), new T.Vector3(x * th.sx, y, D / 2)]), gm)); }
g.add(this.makeAxis(new T.Vector3(th.xmin * th.sx, bottom, D / 2 + 0.12), new T.Vector3(1, 0, 0), (th.xmax - th.xmin) * th.sx + 0.15, 'a'));
g.add(this.makeAxis(new T.Vector3(th.xmin * th.sx - 0.12, bottom, D / 2 + 0.12), new T.Vector3(0, 1, 0), ymax - bottom + 0.25, 'J'));
if (th.id === 'minlocaux') {
const pl = this.pos([th.xl]); pl.y += 0.1; pl.z = -0.6; this.staticTag(g, 'local', pl);
const pg = this.pos([th.xg]); pg.y += 0.1; pg.z = -0.6; this.staticTag(g, 'global', pg);
}
return g;
}
build2d(th) {
const T = this.T, g = new T.Group(); const N = 96, s = th.s;
const yAt = (a, b) => th.base + th.sy * th.J(a, b);
const geo = new T.PlaneGeometry(1, 1, N, N); const p = geo.attributes.position; const cols = []; const tmp = new T.Color();
let ymin = Infinity, ymax = -Infinity;
for (let i = 0; i < p.count; i++) {
const a = p.getX(i) * 2 * th.ra, b = -p.getY(i) * 2 * th.rb; const J = th.J(a, b); const y = th.base + th.sy * J;
p.setXYZ(i, a * s, y, b * s); if (y < ymin) ymin = y; if (y > ymax) ymax = y;
this.heightColor(Math.max(0, Math.min(1, (J - th.jmin) / (th.jmax - th.jmin))), tmp); cols.push(tmp.r, tmp.g, tmp.b);
}
geo.setAttribute('color', new T.Float32BufferAttribute(cols, 3)); p.needsUpdate = true; geo.computeVertexNormals();
const top = new T.Mesh(geo, this.mat.landV); top.receiveShadow = true; top.castShadow = true; g.add(top); this.landTop = top;
const bottom = ymin - 0.2; const wall = this.wallMat();
const edges = [
(u) => [-th.ra + 2 * th.ra * u, th.rb], (u) => [-th.ra + 2 * th.ra * u, -th.rb],
(u) => [-th.ra, -th.rb + 2 * th.rb * u], (u) => [th.ra, -th.rb + 2 * th.rb * u]
];
const edgeMat = new T.LineBasicMaterial({ color: 0x9cc6ff, transparent: true, opacity: 0.7 }); edgeMat.userData.own = true;
edges.forEach((fn) => {
const pos = []; const line = [];
for (let i = 0; i < N; i++) {
const q0 = fn(i / N), q1 = fn((i + 1) / N);
const x0 = q0[0] * s, z0 = q0[1] * s, y0 = yAt(q0[0], q0[1]), x1 = q1[0] * s, z1 = q1[1] * s, y1 = yAt(q1[0], q1[1]);
pos.push(x0, y0, z0, x1, y1, z1, x1, bottom, z1, x0, y0, z0, x1, bottom, z1, x0, bottom, z0);
line.push(new T.Vector3(x0, y0 + 0.004, z0)); if (i === N - 1) line.push(new T.Vector3(x1, y1 + 0.004, z1));
}
const bg = new T.BufferGeometry(); bg.setAttribute('position', new T.Float32BufferAttribute(pos, 3)); bg.computeVertexNormals();
g.add(new T.Mesh(bg, wall));
g.add(new T.Line(new T.BufferGeometry().setFromPoints(line), edgeMat));
});
const btm = new T.Mesh(new T.PlaneGeometry(2 * th.ra * s, 2 * th.rb * s), wall); btm.rotation.x = Math.PI / 2; btm.position.y = bottom; g.add(btm);
const gm = this.gridMat();
for (let i = 0; i <= 6; i++) {
const a = -th.ra + 2 * th.ra * i / 6; const pts = [];
for (let j = 0; j <= N; j++) { const b = -th.rb + 2 * th.rb * j / N; pts.push(new T.Vector3(a * s, yAt(a, b) + 0.006, b * s)); }
g.add(new T.Line(new T.BufferGeometry().setFromPoints(pts), gm));
}
for (let j = 0; j <= 6; j++) {
const b = -th.rb + 2 * th.rb * j / 6; const pts = [];
for (let i = 0; i <= N; i++) { const a = -th.ra + 2 * th.ra * i / N; pts.push(new T.Vector3(a * s, yAt(a, b) + 0.006, b * s)); }
g.add(new T.Line(new T.BufferGeometry().setFromPoints(pts), gm));
}
if (!th.sansAxes) g.add(this.makeAxis(new T.Vector3(-th.ra * s, bottom, th.rb * s + 0.14), new T.Vector3(1, 0, 0), 2 * th.ra * s + 0.15, 'a'));
if (!th.sansAxes) g.add(this.makeAxis(new T.Vector3(-th.ra * s - 0.14, bottom, -th.rb * s), new T.Vector3(0, 0, 1), 2 * th.rb * s + 0.15, 'b'));
if (!th.sansAxes) g.add(this.makeAxis(new T.Vector3(-th.ra * s - 0.14, bottom, th.rb * s + 0.14), new T.Vector3(0, 1, 0), ymax - bottom + 0.25, 'J'));
if (th.id === 'selle') { const ps = this.pos([0, 0]); ps.y += 0.38; ps.z -= 0.3; this.staticTag(g, 'point selle', ps); }
return g;
}
buildTheme() {
const th = this.th();
if (this.land) {
this.scene.remove(this.land);
this.land.traverse((o) => {
if (o.geometry && !(o.geometry.userData && o.geometry.userData.shared)) o.geometry.dispose();
if (o.material && o.material.userData && o.material.userData.own) { if (o.material.map) o.material.map.dispose(); o.material.dispose(); }
});
}
this.land = th.kind === '1d' ? this.build1d(th) : this.build2d(th);
this.scene.add(this.land);
this.resetPos();
this.redeco();
this.rob.scale.setScalar(th.kind === '1d' ? 0.3 : 0.25);
this.view = { yaw: -0.45, pitch: th.kind === '1d' ? 0.5 : 0.8 }; this.recenter(); this.fit(); this.resetPos(); this.lastKey = null;
}

yOf(p) { const th = this.th(); return th.kind === '1d' ? th.base + th.sy * th.J(p[0]) : th.base + th.sy * th.J(p[0], p[1]); }
pos(p) { const th = this.th(); return th.kind === '1d' ? new this.T.Vector3(p[0] * th.sx, this.yOf(p), 0) : new this.T.Vector3(p[0] * th.s, this.yOf(p), p[1] * th.s); }
clampP(p) {
const th = this.th();
if (th.kind === '1d') return [Math.max(th.xmin, Math.min(th.xmax, p[0]))];
return [Math.max(-th.ra, Math.min(th.ra, p[0])), Math.max(-th.rb, Math.min(th.rb, p[1]))];
}
outside(p, f) {
const th = this.th();
if (!p.every(Number.isFinite)) return true;
if (th.kind === '1d') return Math.abs(p[0]) > f * Math.max(Math.abs(th.xmin), th.xmax);
return Math.abs(p[0]) > f * th.ra || Math.abs(p[1]) > f * th.rb;
}
tangent2d(p, va, vb) { const th = this.th(); const G = th.G(p[0], p[1]); return new this.T.Vector3(va * th.s, th.sy * (G[0] * va + G[1] * vb), vb * th.s); }

clearTrail() {
while (this.trail.children.length) { const c = this.trail.children[0]; this.trail.remove(c); if (c.isLine) c.geometry.dispose(); }
this.trailPts = []; this.trailLine = null; this.hist = [];
}
addTrail(p) {
const T = this.T; const cp = this.clampP(p); const v = this.pos(cp); v.y += 0.02;
this.hist.push(cp.slice()); if (this.hist.length > 300) this.hist.shift();
this.trailPts.push(v); if (this.trailPts.length > 300) this.trailPts.shift();
const dot = new T.Mesh(this.geo.dot, this.mat.gBlue); dot.position.copy(v); this.trail.add(dot);
if (this.trailLine) { this.trail.remove(this.trailLine); this.trailLine.geometry.dispose(); }
if (this.trailPts.length > 1) { this.trailLine = new T.Line(new T.BufferGeometry().setFromPoints(this.trailPts), this.mat.trail); this.trail.add(this.trailLine); }
}
resetCounters() { this.steps = 0; this.examples = 0; this.converged = false; this.diverged = false; this.visitedSaddle = false; this.usedNoise = false; this.lastEst = null; this.lastFrom = null; }
resetPos() { const th = this.th(); this.anim = null; this.params = th.start.slice(); this.resetCounters(); this.clearTrail(); this.addTrail(this.params); if (th.reset) th.reset(); }
redeco() {
const th = this.th();
if (this.deco) { this.land.remove(this.deco); this.deco.traverse((o) => { if (o.geometry && !(o.geometry.userData && o.geometry.userData.shared)) o.geometry.dispose(); if (o.material && o.material.userData && o.material.userData.own) { if (o.material.map) o.material.map.dispose(); o.material.dispose(); } }); this.deco = null; }
if (th.deco) { this.deco = new this.T.Group(); th.deco(this.deco); this.land.add(this.deco); }
this.lastKey = null;
}
placeAt(p) { if (this.th().fixe) return; this.anim = null; this.params = this.clampP(p); this.resetCounters(); this.clearTrail(); this.addTrail(this.params); }
animTo(np, dur, hop) {
const from = this.anim ? this.anim.to.slice() : this.params.slice();
this.lastFrom = this.params.slice(); this.params = np.slice();
this.anim = { from: from, to: np.slice(), t: 0, dur: dur, hop: hop };
}
afterMove() {
const th = this.th(); const p = this.params;
this.addTrail(p);
if (th.id === 'selle' && this.steps >= 2 && Math.abs(p[0]) < 0.08 && Math.abs(p[1]) < 0.05) this.visitedSaddle = true;
this.lastStepT = this.clock.elapsedTime;
}
stepOnce() {
const th = this.th(); if (!this.params) return;
if (th.pas) { if (this.anim) { this.anim = null; this.afterMove(); } th.pas(); return; }
if (this.anim) { this.anim = null; this.afterMove(); }
const p = this.params.slice(); const eta = this.etaVal(); let np;
if (th.kind === '1d') {
let g = th.dJ(p[0]);
if (th.ctl.noise && this.state.noise) { g += this.gauss() * 1.6; this.usedNoise = true; }
np = [p[0] - eta * g];
} else {
let g = th.G(p[0], p[1]);
if (th.ctl.batch) { const B = this.BATCH[this.state.batch]; const sig = 2.4 / Math.sqrt(B); g = [g[0] + this.gauss() * sig, g[1] + this.gauss() * sig]; this.lastEst = g.slice(); this.examples += B; }
np = [p[0] - eta * g[0], p[1] - eta * g[1]];
}
this.steps += 1;
const moved = Math.hypot.apply(null, np.map((v, i) => v - p[i]));
if (this.outside(np, th.kind === '1d' ? 1.02 : 1.5)) { this.diverged = true; this.setState({ playing: false }); }
else if (th.kind === '2d') np = this.clampP(np);
this.animTo(np, th.ctl.batch ? 0.22 : 0.42, Math.min(0.28, moved * 0.3 + 0.05));
const noisy = (th.ctl.noise && this.state.noise) || th.ctl.batch;
if (!noisy && moved < 0.002) { this.converged = true; if (this.state.playing) this.setState({ playing: false }); }
if (this.steps >= (noisy ? 160 : 220) && this.state.playing) this.setState({ playing: false });
}

ndc(e) { const r = this.canvas.getBoundingClientRect(); return new this.T.Vector2(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1); }
paramsFromPoint(pt) { const th = this.th(); return th.kind === '1d' ? [pt.x / th.sx] : [pt.x / th.s, pt.z / th.s]; }
pDown(e) {
if (!this.three || this.swap) return;
if (e.target && e.target.closest && e.target.closest('button,a,input,summary')) return;
this.ray.setFromCamera(this.ndc(e), this.cam);
const hr = this.ray.intersectObject(this.rob, true); const hl = this.ray.intersectObject(this.landTop, false);
if (hr.length || hl.length) {
this.drag = { mode: 'robot' };
if (!hr.length && hl.length) this.placeAt(this.paramsFromPoint(hl[0].point));
this.setState({ playing: false, dragging: true });
} else {
this.viewT = null;
this.drag = { mode: 'orbit', x: e.clientX, y: e.clientY, yaw: this.view.yaw, pitch: this.view.pitch };
this.setState({ dragging: true });
}
if (e.currentTarget && e.currentTarget.setPointerCapture) { try { e.currentTarget.setPointerCapture(e.pointerId); } catch (err) {} }
}
pMove(e) {
if (!this.three || !this.drag) return;
if (this.drag.mode === 'robot') {
this.ray.setFromCamera(this.ndc(e), this.cam);
const hl = this.ray.intersectObject(this.landTop, false);
if (hl.length) this.placeAt(this.paramsFromPoint(hl[0].point));
} else {
const d = this.drag;
this.view.yaw = Math.max(-1.3, Math.min(1.3, d.yaw + (e.clientX - d.x) * 0.008));
this.view.pitch = Math.max(0.06, Math.min(1.15, d.pitch + (e.clientY - d.y) * 0.005));
}
}
pUp() { if (this.drag) { this.drag = null; this.setState({ dragging: false }); } }

updateVisuals(pc, moving) {
const T = this.T, th = this.th(), f = (v, d) => this.fmt(v, d);
[this.arA, this.arB, this.arG, this.arN, this.arEst, this.arStep].forEach((a) => { a.visible = false; });
this.tags.forEach((s) => { s.visible = false; });
this.tan.visible = false; this.sec.visible = false; this.secDot.visible = false; this.ghost.visible = false;
if (this.swap) return;
if (th.visu) { th.visu(pc, moving); return; }
const up = (v, dy) => { const w = v.clone(); w.y += dy; return w; };
if (th.id === 'derivee') {
const a = pc[0]; const sl = th.sy * th.dJ(a) / th.sx; const c = this.pos([a]); c.y += 0.015;
const td = new T.Vector3(1, sl, 0).normalize();
this.placeBar(this.tan, c, td, 1.9);
this.setTag(this.tags[0], 'pente ' + f(th.dJ(a)), up(c.clone().addScaledVector(td, -0.95), 0.16));
const a2 = Math.min(th.xmax, a + this.state.h); const c2 = this.pos([a2]); c2.y += 0.015;
const sd = c2.clone().sub(c); const L = sd.length();
if (L > 1e-3) { const mid = c.clone().add(c2).multiplyScalar(0.5); this.placeBar(this.sec, mid, sd, L + 1.0); }
this.secDot.position.copy(c2); this.secDot.visible = true;
const sec = (th.J(a + this.state.h) - th.J(a)) / this.state.h;
this.setTag(this.tags[1], 'sécante ' + f(sec), up(c2, 0.18), '#D9A066');
} else if (th.kind === '1d' && th.ctl.play) {
if (!moving && !this.diverged) {
const a = pc[0]; const da = -this.etaVal() * th.dJ(a); const o = this.pos([a]); o.y += 0.03; o.z = 0.62;
const len = Math.min(3.8, Math.abs(da) * th.sx); const dir = new T.Vector3(Math.sign(da) || 1, 0, 0);
this.setArrow(this.arStep, o, dir, len);
const land = this.clampP([a + da]); const gp = this.pos(land); gp.y += 0.02; gp.z = 0.62;
if (Math.abs(da) > 0.02) { this.ghost.position.copy(gp); this.ghost.visible = true; }
const mid = o.clone().addScaledVector(dir, len / 2); mid.y += 0.16;
if (len > 0.2) this.setTag(this.tags[0], 'pas ' + f(da), mid);
}
} else if (th.kind === '2d') {
const G = th.G(pc[0], pc[1]); const o = this.pos(pc); o.y += 0.05; const k = th.k; const n = Math.hypot(G[0], G[1]);
const cap = (v) => Math.min(1.6, v);
if (th.id === 'gradient') {
const dA = this.tangent2d(pc, Math.sign(G[0]) || 1, 0), lA = cap(Math.abs(G[0]) * k);
const dB = this.tangent2d(pc, 0, Math.sign(G[1]) || 1), lB = cap(Math.abs(G[1]) * k);
this.setArrow(this.arA, o, dA, lA); this.setArrow(this.arB, o, dB, lB);
if (lA > 0.2) this.setTag(this.tags[0], '∂J/∂a', up(this.tipOf(o, dA, lA), 0.12), '#9CC6FF');
if (lB > 0.2) this.setTag(this.tags[1], '∂J/∂b', up(this.tipOf(o, dB, lB), 0.12), '#D9A066');
if (n > 1e-4) {
const dG = this.tangent2d(pc, G[0] / n, G[1] / n), lG = cap(n * k);
this.setArrow(this.arG, o, dG, lG);
if (lG > 0.2) this.setTag(this.tags[2], '∇J', up(this.tipOf(o, dG, lG), 0.14));
if (this.state.showNeg) { const dN = this.tangent2d(pc, -G[0] / n, -G[1] / n); this.setArrow(this.arN, o, dN, lG); this.setTag(this.tags[3], '−∇J', up(this.tipOf(o, dN, lG), 0.14), '#4C8DFF'); }
}
} else {
if (n > 1e-3 && !moving) {
const dN = this.tangent2d(pc, -G[0] / n, -G[1] / n), lN = cap(n * k);
this.setArrow(this.arG, o, dN, lN);
}
if (th.id === 'minilots' && this.lastEst && this.lastFrom) {
const fp = this.clampP(this.lastFrom); const ne = Math.hypot(this.lastEst[0], this.lastEst[1]);
if (ne > 1e-3) { const of = this.pos(fp); of.y += 0.05; const dE = this.tangent2d(fp, -this.lastEst[0] / ne, -this.lastEst[1] / ne); this.setArrow(this.arEst, of, dE, cap(ne * k)); }
}
}
}
}

ui() {
const th = this.th(), p = this.params, eta = this.etaVal(); const f = (v, d) => this.fmt(v, d);
if (th.ui) return { ...th.ui(), chart: this.chart() };
let S = [], calc = [], msg = '', ok = false;
if (th.id === 'derivee') {
const a = p[0], s = th.dJ(a), h = this.state.h, Ja = th.J(a), Jh = th.J(a + h), sec = (Jh - Ja) / h;
S = [['a', f(a)], ['J', f(Ja)], ['J′', f(s)]];
calc = ['J′(a) = 2a = 2 × ' + f(a) + ' = ' + f(s), this.L('sécante = (J(a + h) − J(a)) / h = ') + f(sec), this.L('écart = ') + f(sec - s) + this.L(', il vaut h')];
if (Math.abs(s) < 0.1) msg = this.L('Tangente horizontale : la pente vaut 0. C’est le fond de la courbe.');
else if (s > 0) msg = this.L('Pente positive : si a augmente, J augmente. Pour descendre, il faut diminuer a.');
else msg = this.L('Pente négative : si a augmente, J diminue. Pour descendre, il faut augmenter a.');
ok = Math.abs(s) < 0.1;
} else if (th.id === 'gradient') {
const G = th.G(p[0], p[1]), n = Math.hypot(G[0], G[1]);
S = [['a', f(p[0])], ['b', f(p[1])], ['|∇J|', f(n)]];
calc = ['∂J/∂a = 2a = ' + f(G[0]), '∂J/∂b = 6b = ' + f(G[1]), '∇J = (' + f(G[0]) + ' ; ' + f(G[1]) + '),  |∇J| = ' + f(n)];
if (n < 0.3) msg = this.L('∇J est presque nul : les deux pentes partielles s’annulent. C’est le fond du bol.');
else msg = this.L('∇J pointe vers la montée la plus raide.') + (Math.abs(G[1]) > Math.abs(G[0]) ? this.L(' Ici, b pèse le plus : il compte triple dans J.') : this.L(' Ici, a pèse le plus.'));
ok = n < 0.3;
} else if (th.id === 'descente') {
const a = p[0], g = th.dJ(a), da = -eta * g;
S = [[this.L('pas'), String(this.steps)], ['a', f(a)], ['J', f(th.J(a), 3)], ['η', f(eta)]];
calc = [this.L('pas = −η · J′(a) = −') + f(eta) + ' × ' + f(g) + ' = ' + f(da), 'a ← ' + f(a) + ' + (' + f(da) + ') = ' + f(a + da), this.L('a est multiplié par 1 − 2η = ') + f(1 - 2 * eta)];
if (this.diverged) msg = this.L('Sorti de la courbe : avec η = ') + f(eta) + this.L(', chaque pas l’envoie plus loin. La descente diverge.');
else if (eta < 0.1) msg = this.L('η petit : des pas sûrs, mais lents.');
else if (Math.abs(eta - 0.5) < 0.015) msg = this.L('η = 0,5 : ici, un seul pas suffit, car 1 − 2η = 0.');
else if (eta < 0.5) msg = this.L('Les pas raccourcissent d’eux-mêmes : près du fond, la pente diminue.');
else if (eta < 0.985) msg = this.L('η trop grand : le robot dépasse le fond et rebondit, en se rapprochant quand même.');
else if (eta <= 1.015) msg = this.L('η = 1 : le robot saute de a à −a sans fin.');
else msg = this.L('η > 1 : chaque pas l’éloigne davantage. La descente diverge.');
ok = this.steps >= 1 && this.steps <= 6 && Math.abs(a) < 0.03;
if (this.steps > 6 && Math.abs(a) < 0.03) msg += this.L(' Minimum atteint, mais en plus de 6 pas.');
} else if (th.id === 'minilots') {
const J = th.J(p[0], p[1]), B = this.BATCH[this.state.batch], G = th.G(p[0], p[1]);
S = [[this.L('pas'), String(this.steps)], [this.L('exemples'), String(this.examples)], ['J', f(J, 3)]];
calc = [this.L('vraie pente = (') + f(G[0]) + ' ; ' + f(G[1]) + ')', this.lastEst ? this.L('estimée sur ') + B + this.L(' ex. = (') + f(this.lastEst[0]) + ' ; ' + f(this.lastEst[1]) + ')' : this.L('faites un pas pour voir l’estimation'), this.L('bruit ∝ 1 / √B = ') + f(2.4 / Math.sqrt(B)), this.L('exemples lus = ') + this.steps + ' × ' + B + ' = ' + this.examples];
msg = B <= 8 ? this.L('Petit lot : chaque pas coûte peu, mais le chemin zigzague autour de la vraie pente.') : this.L('Grand lot : la pente estimée colle à la vraie, mais chaque pas coûte plus d’exemples.');
if (this.examples > 300 && J >= 0.03) msg += this.L(' Plus de 300 exemples lus : trouvez un meilleur équilibre entre B et η.');
ok = this.steps >= 1 && J < 0.03 && this.examples <= 300;
} else if (th.id === 'minlocaux') {
const a = p[0], J = th.J(a), g = th.dJ(a);
S = [[this.L('pas'), String(this.steps)], ['a', f(a)], ['J', f(J, 3)]];
calc = ['J′(a) = ' + f(g), 'a ← ' + f(a) + ' − ' + f(eta) + ' × ' + f(g) + ' = ' + f(a - eta * g), this.state.noise ? this.L('bruit activé') : this.L('bruit désactivé')];
const nearL = Math.abs(a - th.xl) < 0.06, nearG = Math.abs(a - th.xg) < 0.06;
if (nearG && this.steps >= 1) msg = this.L('Minimum global atteint.') + (this.usedNoise ? this.L(' Le bruit a pu aider, sans garantie.') : this.L(' Le départ a suffi.'));
else if (nearL && this.steps >= 1) msg = this.L('Pente nulle : arrêt dans un minimum local. Un creux plus bas existe à gauche.');
else msg = this.L('Le point de départ décide du creux atteint.');
ok = this.steps >= 1 && !this.usedNoise && nearG;
} else if (th.id === 'selle') {
const G = th.G(p[0], p[1]), n = Math.hypot(G[0], G[1]), J = th.J(p[0], p[1]);
const atS = Math.abs(p[0]) < 0.08 && Math.abs(p[1]) < 0.05;
S = [[this.L('pas'), String(this.steps)], ['a', f(p[0])], ['b', f(p[1])], ['|∇J|', f(n, 3)]];
calc = ['∂J/∂a = 2a = ' + f(G[0]), this.L('∂J/∂b = −2b + 1,2 b³ = ') + f(G[1]), this.L('en (0 ; 0), ∇J = (0 ; 0)')];
if (atS && n < 0.15) msg = this.L('Point selle : pente nulle, mais pas un minimum. Poussez le robot, puis relancez.');
else if (J < -0.6) msg = this.L('Sorti par la direction b, où J descend : le robot rejoint un vrai creux.');
else if (Math.abs(p[1]) < 0.005) msg = this.L('Sur la ligne b = 0, la pente selon b est nulle : la descente file vers le point selle.');
else msg = this.L('Hors de b = 0, la pente selon b écarte le robot du point selle.');
ok = this.visitedSaddle && J < -0.6;
}
return { S: S, calc: calc, msg: msg, ok: ok, chart: this.chart() };
}
chart() {
if (this.th().chart) return this.th().chart();
const th = this.th(), C = this.C, f = (v, d) => this.fmt(v, d); const p = this.params;
const L = [], D = [], X = []; const r1 = (v) => Math.round(v * 10) / 10;
const path = (pts) => pts.length ? 'M' + pts.map((q) => r1(q[0]) + ' ' + r1(q[1])).join(' L') : '';
const line = (pts, s, w, dash, m, o) => { if (pts.length > 1) L.push({ d: path(pts), s: s, w: w, dash: dash || 'none', m: m || 'none', o: o == null ? 1 : o }); };
if (th.kind === '1d') {
const N = 80; let lo = Infinity, hi = -Infinity; const vals = [];
for (let i = 0; i <= N; i++) { const a = th.xmin + (th.xmax - th.xmin) * i / N; const J = th.J(a); vals.push([a, J]); lo = Math.min(lo, J); hi = Math.max(hi, J); }
const Xa = (a) => 26 + (a - th.xmin) / (th.xmax - th.xmin) * 262; const Yj = (J) => 176 - (J - lo) / (hi - lo) * 156;
line([[26, 178], [292, 178]], C.grid, 1); line([[26, 178], [26, 12]], C.grid, 1);
X.push({ x: 292, y: 193, t: 'a', f: C.muted, a: 'end' }); X.push({ x: 30, y: 14, t: 'J', f: C.muted, a: 'start' });
line(vals.map((q) => [Xa(q[0]), Yj(q[1])]), C.white, 1.6, 'none', 'none', 0.85);
const a = this.clampP(p)[0];
if (th.id === 'derivee') {
const s = th.dJ(a), J0 = th.J(a), h = this.state.h, a2 = Math.min(th.xmax, a + h), J2 = th.J(a2);
line([[Xa(a - 0.9), Yj(J0 - 0.9 * s)], [Xa(a + 0.9), Yj(J0 + 0.9 * s)]], C.blue, 2);
const ss = (J2 - J0) / Math.max(1e-6, a2 - a);
line([[Xa(a - 0.5), Yj(J0 - 0.5 * ss)], [Xa(a2 + 0.5), Yj(J2 + 0.5 * ss)]], C.bronze, 1.4, '4 3');
D.push({ x: r1(Xa(a2)), y: r1(Yj(J2)), r: 3.5, f: C.bronze }); D.push({ x: r1(Xa(a)), y: r1(Yj(J0)), r: 4.5, f: C.white });
} else {
const hp = this.hist.map((q) => [Xa(q[0]), Yj(th.J(q[0]))]);
line(hp, C.blue, 1.4);
hp.forEach((q) => D.push({ x: r1(q[0]), y: r1(q[1]), r: 2.6, f: C.blue }));
const da = -this.etaVal() * th.dJ(a); const a2 = this.clampP([a + da])[0];
if (!this.diverged && Math.abs(da) > 0.01) line([[Xa(a), Yj(th.J(a))], [Xa(a2), Yj(th.J(a2))]], C.white, 1.1, '3 3', 'url(#lb-ah)', 0.8);
D.push({ x: r1(Xa(a)), y: r1(Yj(th.J(a))), r: 4.5, f: C.white });
}
} else {
const k = Math.min(262 / (2 * th.ra), 160 / (2 * th.rb)); const cx = 157, cy = 98;
const Xa = (a) => cx + a * k, Yb = (b) => cy - b * k;
line([[Xa(-th.ra), Yb(th.rb)], [Xa(th.ra), Yb(th.rb)], [Xa(th.ra), Yb(-th.rb)], [Xa(-th.ra), Yb(-th.rb)], [Xa(-th.ra), Yb(th.rb)]], C.grid, 1);
const inBox = (a, b) => Math.abs(a) <= th.ra + 1e-6 && Math.abs(b) <= th.rb + 1e-6;
const runs = (pts) => { let cur = []; pts.forEach((q) => { if (q && inBox(q[0], q[1])) cur.push([Xa(q[0]), Yb(q[1])]); else { if (cur.length > 1) line(cur, '#102C86', 1); cur = []; } }); if (cur.length > 1) line(cur, '#102C86', 1); };
if (th.id === 'selle') {
[-0.6, -0.3, 0, 0.4, 0.9, 1.5].forEach((c) => {
[1, -1].forEach((sg) => { const pts = []; for (let i = 0; i <= 140; i++) { const b = -th.rb + 2 * th.rb * i / 140; const r = c + b * b - 0.3 * Math.pow(b, 4); pts.push(r >= 0 ? [sg * Math.sqrt(r), b] : null); } runs(pts); });
});
} else {
[0.25, 0.75, 1.5, 2.5, 3.5, 4.6].forEach((c) => { const pts = []; for (let i = 0; i <= 96; i++) { const t = i / 96 * Math.PI * 2; pts.push([Math.sqrt(c) * Math.cos(t), Math.sqrt(c / 3) * Math.sin(t)]); } runs(pts); });
}
X.push({ x: r1(Xa(th.ra)), y: r1(Yb(-th.rb) + 14), t: 'a', f: C.muted, a: 'end' }); X.push({ x: r1(Xa(-th.ra) + 4), y: r1(Yb(th.rb) - 4), t: 'b', f: C.muted, a: 'start' });
const hp = this.hist.map((q) => [Xa(q[0]), Yb(q[1])]); line(hp, C.blue, 1.3);
const pc = this.clampP(p); const G = th.G(pc[0], pc[1]); const n = Math.hypot(G[0], G[1]);
if (n > 1e-3) {
const len = Math.min(70, n * 9); const dir = th.id === 'gradient' && !this.state.showNeg ? 1 : -1;
line([[Xa(pc[0]), Yb(pc[1])], [Xa(pc[0]) + dir * G[0] / n * len, Yb(pc[1]) - dir * G[1] / n * len]], C.white, 1.6, 'none', 'url(#lb-ah)');
}
if (th.id === 'minilots' && this.lastEst && this.lastFrom) {
const fp = this.clampP(this.lastFrom); const ne = Math.hypot(this.lastEst[0], this.lastEst[1]);
if (ne > 1e-3) { const len = Math.min(70, ne * 9); line([[Xa(fp[0]), Yb(fp[1])], [Xa(fp[0]) - this.lastEst[0] / ne * len, Yb(fp[1]) + this.lastEst[1] / ne * len]], C.bronze, 1.4, '4 3'); }
}
D.push({ x: r1(Xa(pc[0])), y: r1(Yb(pc[1])), r: 4.5, f: C.white });
}
const title = th.id === 'derivee' ? this.L('Vue 2D : tangente et sécante') : th.kind === '1d' ? this.L('Vue 2D : le trajet sur la courbe') : this.L('Vue de dessus : lignes de niveau');
return { title: title, lines: L, dots: D, texts: X };
}
pushUI() {
this.lastUI = this.clock.elapsedTime;
const u = this.ui(); const key = JSON.stringify(u) + this.themeKey() + this.state.h + this.etaVal();
if (key === this.lastKey) return; this.lastKey = key;
const st = { stats: u.S.map((r) => ({ k: r[0], v: r[1] })), calc: u.calc.map((t) => ({ t: t })), msg: u.msg, success: u.ok, chart: u.chart };
const tk = this.themeKey();
if (u.ok && !this.state.done[tk]) {
const done = Object.assign({}, this.state.done); done[tk] = true; st.done = done; st.flash = true;
clearTimeout(this.flashT); this.flashT = setTimeout(() => { if (!this.dead) this.setState({ flash: false }); }, 2400);
}
this.setState(st);
}

loop() {
if (this.dead) return;
this.raf = requestAnimationFrame(() => this.loop());
const dt = Math.min(0.05, this.clock.getDelta()); const t = this.clock.elapsedTime;
if (this.swap) {
const sw = this.swap; sw.t += dt;
if (!sw.built && sw.t > 0.35) { sw.built = true; this.setState({ theme: sw.k, eta: null, noise: false, showNeg: false, h: 0.5 }, () => this.buildTheme()); }
const out = sw.t < 0.35 ? sw.t / 0.35 : Math.max(0, 1 - (sw.t - 0.35) / 0.5);
const e = out * out * (3 - 2 * out);
if (this.land) this.land.scale.set(1, Math.max(0.02, 1 - e * 0.98), 1);
this.mat.landV.opacity = 1 - e * 0.7;
if (sw.t > 0.85) { this.swap = null; if (this.land) this.land.scale.set(1, 1, 1); this.mat.landV.opacity = 1; if (this.swapSuivant) { const k = this.swapSuivant; this.swapSuivant = null; this.pickTheme(k); } }
}
const th = this.th();
let pd = this.params, hop = 0, face = 0, moving = false;
if (this.anim) {
const A = this.anim; A.t += dt; const u = Math.min(1, A.t / A.dur);
const e = u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2;
pd = A.from.map((v, i) => v + (A.to[i] - v) * e); hop = Math.sin(Math.PI * u) * A.hop; moving = true;
const pa = this.pos(this.clampP(A.from)), pb = this.pos(this.clampP(A.to));
face = th.kind === '1d' ? Math.sign(pb.x - pa.x) * 0.45 : Math.max(-0.9, Math.min(0.9, Math.atan2(pb.x - pa.x, pb.z - pa.z)));
if (u >= 1) { this.anim = null; this.afterMove(); }
} else if (this.state.playing && !this.drag && !this.swap) {
const wait = th.ctl.batch ? 0.04 : 0.16;
if (this.lastStepT < 0 || t - this.lastStepT > wait) { this.lastStepT = t; this.stepOnce(); }
}
const pc = this.clampP(pd); const bp = this.pos(pc); const sc = this.rob.scale.x;
const ls = this.land ? this.land.scale.y : 1;
this.rob.position.set(bp.x, bp.y * ls + 1.094 * sc + 0.005 + hop + (moving ? 0 : 0.01 * Math.sin(t * 2.2)), bp.z);
this.faceY += (face - this.faceY) * Math.min(1, dt * 6);
this.rob.rotation.set(0, this.faceY, 0);
this.updateVisuals(pc, moving);
const blink = (t % 3.6) < 0.12 ? 0.15 : 1; this.eyes.forEach((e) => { e.scale.x = blink; });
this.mat.chest.emissiveIntensity = 0.9 + 0.5 * Math.sin(t * 2.4);
this.dust.rotation.y = t * 0.015;
if (this.viewT) { this.view.yaw += (this.viewT.yaw - this.view.yaw) * Math.min(1, dt * 2); this.view.pitch += (this.viewT.pitch - this.view.pitch) * Math.min(1, dt * 2); if (Math.abs(this.viewT.yaw - this.view.yaw) < 0.002 && Math.abs(this.viewT.pitch - this.view.pitch) < 0.002) this.viewT = null; }
const v = this.view, d = this.camDist || 8; const ty = th.kind === '1d' ? -0.2 : -0.25;
this.cam.position.set(d * Math.sin(v.yaw) * Math.cos(v.pitch), ty + d * Math.sin(v.pitch), d * Math.cos(v.yaw) * Math.cos(v.pitch));
this.cam.lookAt(0, ty, 0);
if (t - this.lastUI > 0.12 && !this.swap) this.pushUI();
this.r.render(this.scene, this.cam);
}

renderVals() {
const k = this.themeKey(); const th = this.th(); const done = this.state.done || {};
const eta = this.etaVal(); const playing = !!this.state.playing; const ctl = th.ctl; const C = this.C;
const themes = this.ORDER.map((id) => {
const t = this.TH[id]; const sel = id === k;
return { badge: t.badge, title: t.tab, pick: this.picks[id], pressed: sel ? 'true' : 'false', color: sel ? '#F5F8FC' : '#8A97A8', numColor: sel ? C.blue : '#6B7A8C', line: sel ? '#F5F8FC' : 'transparent', done: !!done[id] };
});
const score = this.ORDER.filter((id) => done[id]).length;
const won = !!this.state.success || !!done[k];
const ch = this.state.chart || { title: this.L('Vue 2D'), lines: [], dots: [], texts: [] };
let sl = null;
if (ctl.h) sl = { label: this.L('écart h'), min: 0.02, max: 1, step: 0.01, val: this.state.h, txt: this.fmt(this.state.h), fn: this.onH };
else if (ctl.eta) sl = { label: this.L('pas η'), min: 0.02, max: 1.2, step: 0.01, val: eta, txt: this.fmt(eta), fn: this.onEta };
if (ctl.ab) sl = { label: 'a', min: 0, max: 150, step: 1, val: this.state.pa ?? 30, txt: this.fmt(this.state.pa ?? 30, 0), fn: this.onPa };
let tg = null;
if (ctl.noise) tg = { label: this.state.noise ? this.L('Bruit activé') : this.L('Bruit'), on: !!this.state.noise, fn: this.toggleNoise };
else if (ctl.neg) tg = { label: this.L('Afficher −∇J'), on: !!this.state.showNeg, fn: this.toggleNeg };
else if (ctl.bascule) tg = th.bascule();
else if (ctl.push) tg = { label: this.L('Pousser'), on: false, fn: this.push };
const stats = this.state.stats || [];
return {
themes: themes, score: score,
num: th.num, title: th.title, sub: th.sub, idea: th.idea, goal: th.goal,
statLine: [th.formula].concat(stats.map((r) => r.k + ' ' + r.v)).join('   ·   '),
sceneLabel: this.L('Scène 3D : le robot Théta sur la surface de coût de la notion « ') + th.title + this.L(' ».'),
cursor: this.state.dragging ? 'grabbing' : 'grab',
setCanvas: this.setCanvas, setIris: this.setIris, onDown: this.onDown, onMove: this.onMove, onUp: this.onUp, goVoyage: this.goVoyage, goMain: this.goMain,
recenter: this.recenter, togglePlay: this.togglePlay, doStep: this.doStep, doReset: this.doReset,
hasPlay: !!ctl.play, playing: playing, notPlaying: !playing, playLabel: playing ? this.L('Pause') : this.L('Lecture'),
hasSlider: !!sl, slLabel: sl ? sl.label : '', slMin: sl ? sl.min : 0, slMax: sl ? sl.max : 1, slStep: sl ? sl.step : 0.01, slVal: sl ? sl.val : 0, slTxt: sl ? sl.txt : '', slChange: sl ? sl.fn : this.onEta,
hasBatch: !!ctl.batch || !!ctl.ab, batchIdx: ctl.ab ? (this.state.pb ?? 120) : this.state.batch, batchTxt: ctl.ab ? this.fmt(this.state.pb ?? 120, 0) : String(this.BATCH[this.state.batch]), onBatch: ctl.ab ? this.onPb : this.onBatch, b2Label: ctl.ab ? 'b' : this.L('lot B'), b2Min: ctl.ab ? -100 : 0, b2Max: ctl.ab ? 200 : 3, nbThemes: this.ORDER.length,
hasToggle: !!tg, tgLabel: tg ? tg.label : '', tgClick: tg ? tg.fn : this.push, tgPressed: tg && tg.on ? 'true' : 'false',
tgBg: tg && tg.on ? C.white : 'transparent', tgColor: tg && tg.on ? '#0A0F17' : C.white, tgBorder: tg && tg.on ? C.white : 'rgba(207,224,255,0.14)',
msg: this.state.msg || ' ', calc: this.state.calc || [],
chartTitle: ch.title, chartLines: ch.lines, chartDots: ch.dots, chartTexts: ch.texts,
legend: th.legend.map((l) => ({ c: l[0], t: l[1] })),
statusTxt: won ? this.L('réussi') : '', statusColor: C.blue, statusDot: won ? C.blue : '#2E3B4D', statusGlow: won ? '0 0 10px #4C8DFF' : 'none',
href: this.props.href, noGL: !!this.state.noGL, flash: !!this.state.flash, notReady: !this.state.ready, exitOp: this.state.exiting ? 1 : 0
};
}
}
