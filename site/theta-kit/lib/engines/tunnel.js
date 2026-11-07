import { DCLogic } from './base';

export class TunnelEngine extends DCLogic {
constructor(...args) {
super(...args);
this.S = 18;
this.CH = this.chaptersDef();
let arrive = false;
try { arrive = window.localStorage.getItem('theta-from-portal') === '1'; if (arrive) window.localStorage.removeItem('theta-from-portal'); } catch (err) { arrive = false; }
const emb = false;
this.embedded = emb; this.shown = !emb; this.backAcc = 0;
if (emb) arrive = false;
this.arr = arrive ? 1 : 0; this.pulse = 0; this.cv = 0;
this.state = { idx: 0, exiting: false, hoverLabel: '', drag: false, arrive: arrive };
this.setIris = (el) => { this.irisEl = el; };
this.target = 0; this.cur = 0; this.vel = 0; this.lastInput = -10; this.tween = null;
this.touch = null; this.mdrag = null; this.ptr = { x: 0, y: 0 }; this.px = { x: -100, y: -100 }; this.inside = false;
this.camP = { x: 0, y: 0 }; this.look = { x: 0, y: 0 }; this.lookT = { x: 0, y: 0 }; this.hover = -1; this.exit = null; this.warp = 0;
this.refs = []; this.refFns = this.CH.map((_, i) => (el) => { this.refs[i] = el; });
this.setCanvas = (el) => { if (el) this.canvas = el; };
this.setBar = (el) => { this.bar = el; };
this.setCursor = (el) => { this.cursorEl = el; };
this.jumps = this.CH.map((_, i) => () => this.jumpTo(i));
this.onWheel = (e) => {
if (this.exit) return;
const k = e.deltaMode === 1 ? 0.03 : e.deltaMode === 2 ? 0.9 : 0.0011;
if (this.embedded && this.target <= 0.02 && this.cur < 0.08 && e.deltaY < 0) {
this.backAcc += -e.deltaY * (e.deltaMode === 1 ? 30 : 1);
if (this.backAcc > 240) { this.backAcc = 0; this.toParent({ theta: 'back' }); }
return;
}
this.backAcc = 0;
this.tween = null; this.target = this.clampT(this.target + e.deltaY * k); this.lastInput = this.now();
};
this.onKey = (e) => {
const i = Math.round(this.target); let n = null;
if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') n = i + 1;
else if (e.key === 'ArrowUp' || e.key === 'PageUp') { if (this.embedded && i === 0) { this.toParent({ theta: 'back' }); return; } n = i - 1; }
else if (e.key === 'Home') n = 0; else if (e.key === 'End') n = this.CH.length - 1;
if (n != null) { if (e.preventDefault) e.preventDefault(); this.jumpTo(this.clampT(n)); }
};
this.onDown = (e) => {
if (e.target && e.target.closest && e.target.closest('a,button')) return;
if (e.pointerType === 'touch') { this.touch = { y: e.clientY, x: e.clientX, t: this.target, lx: this.lookT.x }; this.tween = null; return; }
this.mdrag = { x: e.clientX, y: e.clientY, lx: this.lookT.x, ly: this.lookT.y, moved: false };
};
this.onMove = (e) => {
const r = e.currentTarget.getBoundingClientRect();
this.px = { x: e.clientX - r.left, y: e.clientY - r.top }; this.inside = e.pointerType !== 'touch';
this.ptr = { x: this.px.x / r.width - 0.5, y: this.px.y / r.height - 0.5 };
if (this.touch) { this.target = this.clampT(this.touch.t + (this.touch.y - e.clientY) * 0.006); this.lookT.x = Math.max(-0.45, Math.min(0.45, this.touch.lx + (e.clientX - this.touch.x) * 0.002)); this.lastInput = this.now(); }
if (this.mdrag) {
const dx = e.clientX - this.mdrag.x, dy = e.clientY - this.mdrag.y;
if (Math.abs(dx) + Math.abs(dy) > 5) { this.mdrag.moved = true; if (!this.state.drag) this.setState({ drag: true }); }
this.lookT.x = Math.max(-0.55, Math.min(0.55, this.mdrag.lx + dx * 0.0022));
this.lookT.y = Math.max(-0.32, Math.min(0.32, this.mdrag.ly + dy * 0.0018));
}
};
this.onUp = () => {
const d = this.mdrag; this.mdrag = null; this.touch = null;
if (this.state.drag) this.setState({ drag: false });
if (d && !d.moved && this.hover >= 0) this.activate(this.hover);
else if (d && !d.moved) this.pulse = 1;
};
this.onLeave = () => { this.inside = false; this.mdrag = null; if (this.state.drag) this.setState({ drag: false }); };
this.goLabAny = (e) => this.leave(e, null);
this.goMain = (e) => this.leave(e, undefined);
}
toParent(m) { try { if (window.parent && window.parent !== window) window.parent.postMessage(m, '*'); } catch (err) {} }
onParent(e) {
const d = e && e.data; if (!d || typeof d !== 'object' || !d.theta) return;
if (d.theta === 'arrive') {
this.shown = true; this.arr = 1; this.tween = null; this.cur = 0; this.target = 0; this.cv = 0; this.warp = 0; this.exit = null;
this.setState({ arrive: false, exiting: false }); setTimeout(() => { if (!this.dead) this.setState({ arrive: true }); }, 30);
setTimeout(() => { try { const root = this.canvas && this.canvas.closest('[tabindex]'); if (root) root.focus(); } catch (err) {} }, 60);
} else if (d.theta === 'hide') {
this.shown = false; this.arr = 0; this.tween = null; this.cur = 0; this.target = 0; this.cv = 0;
}
}
now() { return (window.performance && performance.now ? performance.now() : Date.now()) / 1000; }
clampT(v) { return Math.max(0, Math.min(this.CH.length - 1, v)); }
jumpTo(i) {
if (this.exit) return;
const d = Math.abs(i - this.cur); if (d < 0.01) return;
this.tween = { from: this.cur, to: i, t: 0, dur: Math.min(2.6, 0.95 + d * 0.16) }; this.target = i; this.lastInput = -10;
}
leave(e, theme) {
if (this.leaving) return;
const href = e && e.currentTarget && e.currentTarget.getAttribute ? (e.currentTarget.getAttribute('href') || '') : '';
if (href.indexOf('mailto:') === 0) return;
if (!href) return;
if (e && e.preventDefault) e.preventDefault();
const a = e && e.currentTarget; if (!a || this.exit) return;
try { if (theme) window.localStorage.setItem('theta-lab-theme', theme); else if (theme === null) window.localStorage.removeItem('theta-lab-theme'); } catch (err) {}
this.exit = { t: 0 }; this.setState({ exiting: true });
const ir = this.irisEl;
if (ir) {
const rr = ir.getBoundingClientRect();
const x = (e && e.clientX != null ? e.clientX : rr.left + rr.width / 2) - rr.left, y = (e && e.clientY != null ? e.clientY : rr.top + rr.height / 2) - rr.top;
ir.style.transition = 'none'; ir.style.clipPath = 'circle(0px at ' + x + 'px ' + y + 'px)'; void ir.offsetWidth;
ir.style.transition = 'clip-path .85s cubic-bezier(.7,0,.25,1)'; ir.style.clipPath = 'circle(150% at ' + x + 'px ' + y + 'px)';
}
setTimeout(() => {
if (this.dead) return; this.leaving = true;
this.go_(href);
setTimeout(() => { if (this.dead) return; this.leaving = false; this.exit = null; this.warp = 0; if (this.irisEl) { this.irisEl.style.transition = 'none'; this.irisEl.style.clipPath = 'circle(0px at 50% 50%)'; } this.setState({ exiting: false }); }, 1400);
}, 880);
}
activate(i) {
const el = this.refs[i]; const c = this.CH[i];
if (i !== Math.round(this.cur)) { this.jumpTo(i); return; }
if (c.links && c.links.length && el) { const a = el.querySelector('a'); if (a) this.leave({ currentTarget: a, preventDefault: () => {}, clientX: this.px.x, clientY: this.px.y }, c.links[0].theme); }
}
chaptersDef() {
return this.props.chapters;
}
zc(i) { return -i * this.S; }

componentDidMount() { this.tries = 0; this.boot(); if (this.embedded) { this.onParentB = (e) => this.onParent(e); window.addEventListener('message', this.onParentB); this.toParent({ theta: 'ready' }); } }
componentWillUnmount() { this.dead = true; if (this.onParentB) window.removeEventListener('message', this.onParentB); clearTimeout(this.bootTimer); cancelAnimationFrame(this.raf); if (this.ro) this.ro.disconnect(); if (this.r) this.r.dispose(); }
componentDidUpdate(prev) { if (this.three && prev.photo !== this.props.photo) this.loadPhoto(); }
boot() {
if (this.dead) return;
if (!this.canvas) this.canvas = document.querySelector('canvas[data-tunnel]');
if (!window.THREE || !this.canvas) { if (this.tries++ < 150) this.bootTimer = setTimeout(() => this.boot(), 100); return; }
try { this.init(); this.three = true; this.loop(); } catch (err) { this.failed = true; this.setState({ noGL: true }); }
}

init() {
const T = window.THREE; this.T = T;
if (this.Q.statique) throw new Error('statique');
const r = new T.WebGLRenderer({ canvas: this.canvas, antialias: this.Q.aa });
this.dpr = this.Q.dpr; r.setPixelRatio(this.dpr); this.perf = { acc: 0, n: 0 };
r.outputColorSpace = T.SRGBColorSpace; r.toneMapping = T.ACESFilmicToneMapping; r.toneMappingExposure = 1.05;
r.setClearColor(0x0a0f17, 1); this.r = r;
const scene = new T.Scene(); this.scene = scene;
scene.fog = new T.FogExp2(0x0a0f17, 0.04);
this.cam = new T.PerspectiveCamera(52, 1, 0.05, 150);
this.ray = new T.Raycaster();
const pm = new T.PMREMGenerator(r); const es = new T.Scene();
es.add(new T.Mesh(new T.BoxGeometry(12, 12, 12), new T.MeshBasicMaterial({ color: 0x1a2a4a, side: T.BackSide })));
const lamp = (c, w, h, x, y, z) => { const m = new T.Mesh(new T.PlaneGeometry(w, h), new T.MeshBasicMaterial({ color: c, side: T.DoubleSide })); m.position.set(x, y, z); m.lookAt(0, 0, 0); es.add(m); };
lamp(0xffffff, 5, 3, -3, 4, 3); lamp(0xffffff, 3, 2, 4, 1.5, 3.5); lamp(0x4c8dff, 8, 2, 0, -5, 0);
scene.environment = pm.fromScene(es, 0.04).texture; pm.dispose();
scene.add(new T.HemisphereLight(0xcfe0ff, 0x0a0f17, 0.8));
const key = new T.DirectionalLight(0xffffff, 1.8); key.position.set(-2, 4, 6); scene.add(key);
const rim = new T.DirectionalLight(0x9cc6ff, 1.4); rim.position.set(3, 1, -4); scene.add(rim);
this.camLight = new T.PointLight(0x9cc6ff, 6, 9, 2); scene.add(this.camLight);

const N = this.CH.length, zMin = this.zc(N - 1) - 34, zMax = 24;
const segs = Math.round(3600 * this.Q.part); const pos = new Float32Array(segs * 6); const col = new Float32Array(segs * 6);
const cBlue = new T.Color('#4C8DFF'), cPale = new T.Color('#CFE0FF'), cBronze = new T.Color('#D9A066'), cW = new T.Color('#F5F8FC'), tmp = new T.Color();
for (let i = 0; i < segs; i++) {
const a = Math.random() * Math.PI * 2; const rad = 3.6 + Math.pow(Math.random(), 0.7) * 8;
const z = zMin + Math.random() * (zMax - zMin); const len = 0.25 + Math.random() * 1.5;
const x = Math.cos(a) * rad, y = Math.sin(a) * rad;
pos.set([x, y, z, x, y, z - len], i * 6);
const u = Math.random();
if (u < 0.1) tmp.copy(cBronze); else if (u < 0.18) tmp.copy(cW); else tmp.copy(cBlue).lerp(cPale, Math.random());
tmp.multiplyScalar(0.5 + Math.random() * 0.6);
col.set([tmp.r, tmp.g, tmp.b, tmp.r * 0.1, tmp.g * 0.1, tmp.b * 0.1], i * 6);
}
this.slen = new Float32Array(segs); for (let i = 0; i < segs; i++) this.slen[i] = pos[i * 6 + 2] - pos[i * 6 + 5]; this.stretch = 1;
const sg = new T.BufferGeometry(); sg.setAttribute('position', new T.BufferAttribute(pos, 3)); this.sg = sg; sg.setAttribute('color', new T.BufferAttribute(col, 3));
this.streakMat = new T.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.7, blending: T.AdditiveBlending, depthWrite: false });
this.streaks = new T.LineSegments(sg, this.streakMat); scene.add(this.streaks);
const dots = Math.round(2400 * this.Q.part); const dp = new Float32Array(dots * 3);
for (let i = 0; i < dots; i++) { const a = Math.random() * Math.PI * 2; const rad = 3 + Math.random() * 9; dp.set([Math.cos(a) * rad, Math.sin(a) * rad, zMin + Math.random() * (zMax - zMin)], i * 3); }
const dg = new T.BufferGeometry(); dg.setAttribute('position', new T.BufferAttribute(dp, 3));
this.dust = new T.Points(dg, new T.PointsMaterial({ color: 0x9cc6ff, size: 0.035, transparent: true, opacity: 0.7, blending: T.AdditiveBlending, depthWrite: false })); scene.add(this.dust);
this.helix = new T.Group(); scene.add(this.helix);
const helixMat = new T.LineBasicMaterial({ color: 0x4c8dff, transparent: true, opacity: 0.26, blending: T.AdditiveBlending, depthWrite: false });
const helixMat2 = new T.LineBasicMaterial({ color: 0xd9a066, transparent: true, opacity: 0.18, blending: T.AdditiveBlending, depthWrite: false });
for (let h = 0; h < 7; h++) {
const pts = []; const rad = 4.4 + h * 0.75; const ph = h * 1.3; const tw = (h % 2 ? 1 : -1) * (0.05 + h * 0.008);
for (let z = zMax; z > zMin; z -= 0.8) { const a = ph + z * tw; pts.push(new T.Vector3(Math.cos(a) * rad, Math.sin(a) * rad, z)); }
this.helix.add(new T.Line(new T.BufferGeometry().setFromPoints(pts), h % 3 === 0 ? helixMat2 : helixMat));
}

const core = new T.MeshBasicMaterial({ color: 0xe6eeff, toneMapped: false });
this.glowMats = []; this.gates = [];
const ringMat = new T.MeshBasicMaterial({ color: 0xd9a066, transparent: true, opacity: 0.4, toneMapped: false, depthWrite: false });
const loop = (rx, ry) => { const pts = []; for (let k = 0; k < 140; k++) { const t = k / 140 * Math.PI * 2; const y = ry * Math.sin(t); pts.push(new T.Vector3(rx * Math.cos(t) + 0.21 * y, y, 0)); } return new T.CatmullRomCurve3(pts, true); };
const bar = (y) => new T.LineCurve3(new T.Vector3(-1.33 + 0.21 * y, y, 0), new T.Vector3(1.33 + 0.21 * y, y, 0));
const gc = { o: loop(2.0, 3.0), i: loop(1.32, 2.62), b1: bar(-0.17), b2: bar(0.17) };
const gGeo = { o: new T.TubeGeometry(gc.o, 220, 0.016, 6, true), oG: new T.TubeGeometry(gc.o, 220, 0.06, 6, true), i: new T.TubeGeometry(gc.i, 220, 0.016, 6, true), iG: new T.TubeGeometry(gc.i, 220, 0.06, 6, true), b1: new T.TubeGeometry(gc.b1, 20, 0.016, 6, false), b1G: new T.TubeGeometry(gc.b1, 20, 0.06, 6, false), b2: new T.TubeGeometry(gc.b2, 20, 0.016, 6, false), b2G: new T.TubeGeometry(gc.b2, 20, 0.06, 6, false) };
const ringGeo = new T.TorusGeometry(4.3, 0.008, 6, 160);
for (let i = 0; i < N; i++) {
const g = new T.Group(); const glow = new T.MeshBasicMaterial({ color: 0x4c8dff, transparent: true, opacity: 0.3, blending: T.AdditiveBlending, depthWrite: false, toneMapped: false }); this.glowMats.push(glow);
['o', 'i', 'b1', 'b2'].forEach((k) => { g.add(new T.Mesh(gGeo[k], core)); g.add(new T.Mesh(gGeo[k + 'G'], glow)); });
g.position.set(0, -1.25, this.zc(i) - 2.4); scene.add(g); this.gates.push(g);
const ring = new T.Mesh(ringGeo, ringMat); ring.position.set(0, 0, this.zc(i) - 2.4); scene.add(ring);
}

this.mat = {
white: new T.MeshPhysicalMaterial({ color: 0xf6f8fb, roughness: 0.3, clearcoat: 1, clearcoatRoughness: 0.12 }),
visor: new T.MeshPhysicalMaterial({ color: 0x04070b, roughness: 0.06, metalness: 0.3, clearcoat: 1, clearcoatRoughness: 0.02 }),
eye: new T.MeshStandardMaterial({ color: 0x9cc6ff, emissive: 0x9cc6ff, emissiveIntensity: 2.4 }),
bronze: new T.MeshStandardMaterial({ color: 0xc8925a, metalness: 1, roughness: 0.3 }),
metal: new T.MeshStandardMaterial({ color: 0xc9d1da, metalness: 1, roughness: 0.32 }),
dark: new T.MeshStandardMaterial({ color: 0x262e39, metalness: 0.5, roughness: 0.4 }),
chest: new T.MeshStandardMaterial({ color: 0x4c8dff, emissive: 0x4c8dff, emissiveIntensity: 1.2 })
};
const B = (c, o) => new T.MeshBasicMaterial({ color: c, toneMapped: false, transparent: o != null, opacity: o == null ? 1 : o });
const L = (c, o) => new T.LineBasicMaterial({ color: c, transparent: o != null, opacity: o == null ? 1 : o, toneMapped: false });
this.vm = { dW: B(0xf5f8fc), dB: B(0x4c8dff), dBr: B(0xd9a066), dP: B(0x9cc6ff), lW: L(0xe6eeff), lB: L(0x4c8dff), lP: L(0x9cc6ff, 0.6), lBr: L(0xd9a066), lG: L(0x2c4f92, 0.9) };
this.dotGeo = {}; this.eyes = []; this.robots = [];
this.CH.forEach((c, i) => {
if (!c.robot) return;
const rob = new T.Group(); rob.add(this.makeRobot()); rob.scale.setScalar(i === 0 ? 0.85 : 0.72);
const bx = i === 0 ? 1.9 : -2.55;
rob.position.set(bx, i === 0 ? -0.75 : -0.95, this.zc(i) - (i === 0 ? 0.6 : 0.4)); rob.userData = { base: rob.position.clone(), side: c.robot, last: i !== 0 };
scene.add(rob); this.robots.push(rob);
});
this.cards = []; this.hits = [];
this.CH.forEach((c, i) => { if (c.v) this.cards.push(this.makeCard(c, i)); });
this.buildPortrait();
this.comp = new T.Group(); this.comp.add(this.makeRobot()); this.comp.visible = false; scene.add(this.comp); this.compI = -1; this.compT = -10; this.refus = {};
this.clock = new T.Clock(); this.fit();
this.ro = new ResizeObserver(() => this.fit()); this.ro.observe(this.canvas.parentElement);
}
fit() {
if (!this.r) return;
const el = this.canvas.parentElement; this.W = Math.max(1, el.clientWidth); this.H = Math.max(1, el.clientHeight);
this.r.setSize(this.W, this.H, false); this.cam.aspect = this.W / this.H; this.cam.updateProjectionMatrix();
}
makeRobot() {
const T = this.T, M = this.mat; const b = new T.Group();
const add = (geo, mat, x, y, z) => { const m = new T.Mesh(geo, mat); m.position.set(x, y, z); b.add(m); return m; };
const torso = add(new T.SphereGeometry(0.62, 48, 32), M.white, 0, -0.1, 0); torso.scale.set(1.25, 0.7, 0.8);
[-1, 1].forEach((s) => { add(new T.SphereGeometry(0.14, 24, 18), M.white, s * 0.7, -0.02, 0.04); add(new T.TorusGeometry(0.1, 0.022, 12, 36), M.bronze, s * 0.7, -0.02, 0.17); });
add(new T.TorusGeometry(0.1, 0.014, 10, 36), M.metal, 0, -0.1, 0.49);
add(new T.SphereGeometry(0.055, 20, 14), M.chest, 0, -0.1, 0.49);
add(new T.CylinderGeometry(0.12, 0.14, 0.24, 24), M.metal, 0, 0.36, 0);
const collar = add(new T.TorusGeometry(0.15, 0.03, 10, 32), M.bronze, 0, 0.27, 0); collar.rotation.x = Math.PI / 2;
const head = add(new T.SphereGeometry(0.5, 48, 36), M.white, 0, 0.95, 0); head.scale.set(1.1, 1, 0.95);
const visor = add(new T.SphereGeometry(0.507, 48, 24, Math.PI / 2 - 0.78, 1.56, Math.PI / 2 - 0.3, 0.6), M.visor, 0, 0.95, 0); visor.scale.set(1.1, 1, 0.95);
[-1, 1].forEach((s) => {
const e = add(new T.CapsuleGeometry(0.04, 0.1, 6, 12), M.eye, s * 0.17, 0.97, 0);
const q = 0.17 / 0.55; e.position.z = 0.475 * Math.sqrt(1 - q * q) + 0.035; e.rotation.z = Math.PI / 2; e.rotation.y = s * 0.3; this.eyes.push(e);
});
add(new T.BoxGeometry(0.08, 0.014, 0.02), M.chest, 0, 0.84, 0.46);
[-1, 1].forEach((s) => {
const cup = add(new T.CylinderGeometry(0.21, 0.21, 0.16, 36), M.white, s * 0.6, 0.95, 0); cup.rotation.z = Math.PI / 2;
const ring = add(new T.TorusGeometry(0.16, 0.035, 12, 36), M.bronze, s * 0.69, 0.95, 0); ring.rotation.y = Math.PI / 2;
const disc = add(new T.CylinderGeometry(0.125, 0.125, 0.03, 32), M.metal, s * 0.685, 0.95, 0); disc.rotation.z = Math.PI / 2;
});
add(new T.TorusGeometry(0.66, 0.045, 12, 48, Math.PI), M.dark, 0, 0.95, 0);
b.position.y = -0.56;
return b;
}

dot(r, mat) { const k = String(r); if (!this.dotGeo[k]) this.dotGeo[k] = new this.T.SphereGeometry(r, 16, 12); return new this.T.Mesh(this.dotGeo[k], mat); }
poly(pts, mat, dashed) { const g = new this.T.BufferGeometry().setFromPoints(pts); const l = new this.T.Line(g, mat); return l; }
setPoly(l, pts) { const a = l.geometry.attributes.position; for (let i = 0; i < a.count; i++) { const p = pts[Math.min(i, pts.length - 1)]; a.setXYZ(i, p.x, p.y, p.z); } a.needsUpdate = true; l.geometry.computeBoundingSphere(); }
rrect(w, h, r, n) { const T = this.T; const s = new T.Shape(); const x = -w / 2, y = -h / 2; s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r); s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h); s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r); s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y); return s; }
makeCard(c, i) {
const T = this.T, vm = this.vm; const g = new T.Group(); const V = (x, y, z) => new T.Vector3(x, y, z == null ? 0.04 : z);
const W = 2.5, H = 2.0; const shape = this.rrect(W, H, 0.16);
const fill = new T.Mesh(new T.ShapeGeometry(shape, 8), new T.MeshBasicMaterial({ color: 0x0f1622, transparent: true, opacity: 0.62, depthWrite: false, toneMapped: false }));
fill.userData.idx = i; g.add(fill); this.hits.push(fill);
const olMat = new T.LineBasicMaterial({ color: 0x2a3a55, transparent: true, opacity: 1, toneMapped: false });
const ol = new T.Line(new T.BufferGeometry().setFromPoints(shape.getPoints(10).map((p) => new T.Vector3(p.x, p.y, 0.01))), olMat); g.add(ol);
const ticks = new T.LineSegments(new T.BufferGeometry().setFromPoints([V(-W / 2 + 0.12, -H / 2 + 0.22, 0.02), V(-W / 2 + 0.36, -H / 2 + 0.22, 0.02)]), vm.lB); g.add(ticks);
const art = new T.Group(); art.scale.setScalar(0.95); g.add(art);
const st = { art: art, t0: Math.random() * 10 };
const curve = (fn, x0, x1, n) => { const p = []; for (let k = 0; k <= n; k++) { const x = x0 + (x1 - x0) * k / n; p.push(V(x, fn(x))); } return p; };
const v = c.v;
if (v === 'ml') {
st.dots = []; for (let k = 0; k < 16; k++) { const cls = k % 2; const d = this.dot(0.045, cls ? vm.dBr : vm.dP); const bx = cls ? 0.45 : -0.45, by = cls ? -0.3 : 0.3; d.position.set(bx + (Math.random() - 0.5) * 0.7, by + (Math.random() - 0.5) * 0.6, 0.05); d.userData.b = d.position.clone(); art.add(d); st.dots.push(d); }
st.line = this.poly([V(-1, -0.8), V(1, 0.8)], vm.lW); art.add(st.line);
st.upd = (t) => { const a = -0.62 + 0.28 * Math.sin(t * 0.8); const dx = Math.cos(a) * 1.05, dy = Math.sin(a) * 1.05; this.setPoly(st.line, [V(-dx, -dy), V(dx, dy)]); st.dots.forEach((d, k) => { d.position.y = d.userData.b.y + Math.sin(t * 1.5 + k) * 0.03; }); };
} else if (v === 'data') {
st.cubes = []; const bg = new T.BoxGeometry(0.2, 0.16, 0.16);
for (let rI = 0; rI < 4; rI++) for (let cI = 0; cI < 5; cI++) { const m = new T.Mesh(bg, cI === 4 ? vm.dBr : vm.dP); m.position.set(-0.78 + cI * 0.39, 0.5 - rI * 0.34, 0.08); m.userData = { r: rI, base: m.position.z }; art.add(m); st.cubes.push(m); }
st.upd = (t) => { const row = Math.floor(t * 1.1) % 4; st.cubes.forEach((m) => { const on = m.userData.r === row; const sc = on ? 1.25 : 1; m.scale.lerp(new T.Vector3(sc, sc, sc), 0.12); m.position.z = m.userData.base + (on ? 0.12 : 0); }); art.rotation.y = Math.sin(t * 0.5) * 0.25; };
} else if (v === 'families') {
st.cl = [];
[vm.dP, vm.dW, vm.dBr].forEach((mat, k) => { const grp = new T.Group(); for (let q = 0; q < 8; q++) { const d = this.dot(0.04, mat); const a = q / 8 * Math.PI * 2; d.position.set(Math.cos(a) * 0.2 * (0.6 + Math.random() * 0.6), Math.sin(a) * 0.2 * (0.6 + Math.random() * 0.6), 0.05); grp.add(d); } art.add(grp); st.cl.push(grp); });
st.ring = this.poly(curve((x) => 0, -1, 1, 2), vm.lG); art.add(st.ring);
st.upd = (t) => { st.cl.forEach((grp, k) => { const a = t * 0.35 + k * Math.PI * 2 / 3; grp.position.set(Math.cos(a) * 0.55, Math.sin(a) * 0.48, 0); grp.rotation.z = t * (0.6 + k * 0.2); }); };
} else if (v === 'model' || v === 'cost' || v === 'reg') {
const xs = [-0.85, -0.6, -0.35, -0.1, 0.15, 0.4, 0.62, 0.85]; const ys = xs.map((x, k) => 0.55 * x + [0.12, -0.1, 0.08, -0.14, 0.1, -0.06, 0.13, -0.09][k]);
st.pts = xs.map((x, k) => { const d = this.dot(0.045, vm.dP); d.position.set(x, ys[k], 0.05); art.add(d); return d; });
st.line = this.poly([V(-1, -0.5), V(1, 0.5)], v === 'reg' ? vm.lB : vm.lW); art.add(st.line);
if (v === 'cost') { st.err = xs.map(() => { const l = this.poly([V(0, 0), V(0, 0), V(0, 0), V(0, 0), V(0, 0)], vm.lBr); art.add(l); return l; }); }
if (v === 'model') { st.h1 = this.dot(0.06, vm.dBr); st.h2 = this.dot(0.06, vm.dB); art.add(st.h1); art.add(st.h2); }
st.upd = (t) => {
const a = v === 'reg' ? 0.55 : 0.55 + 0.3 * Math.sin(t * 0.9), b = v === 'reg' ? 0 : 0.12 * Math.cos(t * 0.7);
this.setPoly(st.line, [V(-1, -a + b), V(1, a + b)]);
if (st.h1) { st.h1.position.set(0, b, 0.06); st.h2.position.set(0.8, 0.8 * a + b, 0.06); }
if (st.err) st.err.forEach((l, k) => { const x = xs[k], y = ys[k], yh = a * x + b, e = y - yh, s = Math.abs(e); this.setPoly(l, [V(x, yh), V(x, y), V(x + s, y), V(x + s, yh), V(x, yh)]); });
if (v === 'reg') st.line.material.opacity = 1;
};
} else if (v === 'deriv') {
const f = (x) => 0.62 * x * x - 0.55; art.add(this.poly(curve(f, -1, 1, 60), vm.lP));
st.d = this.dot(0.06, vm.dW); art.add(st.d); st.tan = this.poly([V(0, 0), V(0, 0)], vm.lB); art.add(st.tan);
st.upd = (t) => { const x = Math.sin(t * 0.7) * 0.85, y = f(x), s = 1.24 * x; const n = Math.hypot(1, s), dx = 0.5 / n, dy = 0.5 * s / n; st.d.position.set(x, y, 0.06); this.setPoly(st.tan, [V(x - dx, y - dy), V(x + dx, y + dy)]); };
} else if (v === 'grad') {
const sf = (u, w) => -0.45 + 0.42 * (u * u + 2 * w * w);
for (let k = 0; k <= 6; k++) { const w = -0.8 + 1.6 * k / 6; const p = []; for (let q = 0; q <= 30; q++) { const u = -0.9 + 1.8 * q / 30; p.push(V(u, sf(u, w), w * 0.6)); } art.add(this.poly(p, vm.lG)); }
for (let k = 0; k <= 6; k++) { const u = -0.9 + 1.8 * k / 6; const p = []; for (let q = 0; q <= 30; q++) { const w = -0.8 + 1.6 * q / 30; p.push(V(u, sf(u, w), w * 0.6)); } art.add(this.poly(p, vm.lG)); }
art.rotation.x = 0.35;
st.d = this.dot(0.06, vm.dW); art.add(st.d); st.ar = this.poly([V(0, 0), V(0, 0), V(0, 0), V(0, 0), V(0, 0)], vm.lW); art.add(st.ar);
st.upd = (t) => {
const u = Math.cos(t * 0.6) * 0.6, w = Math.sin(t * 0.6) * 0.45; const p0 = V(u, sf(u, w), w * 0.6); st.d.position.copy(p0);
const gu = 0.84 * u, gw = 1.68 * w; const n = Math.hypot(gu, gw) || 1; const L = 0.45; const u2 = u + gu / n * L, w2 = w + gw / n * L; const p1 = V(u2, sf(u2, w2), w2 * 0.6);
const dir = p1.clone().sub(p0).normalize(); const side = new T.Vector3(-dir.y, dir.x, 0).multiplyScalar(0.07); const back = dir.clone().multiplyScalar(-0.12);
this.setPoly(st.ar, [p0, p1, p1.clone().add(back).add(side), p1, p1.clone().add(back).sub(side)]);
art.rotation.y = Math.sin(t * 0.3) * 0.3;
};
} else if (v === 'gd') {
const f = (x) => 0.62 * x * x - 0.55; art.add(this.poly(curve(f, -1, 1, 60), vm.lP));
st.d = this.dot(0.065, vm.dW); art.add(st.d); st.trail = [0, 1, 2, 3, 4, 5].map(() => { const d = this.dot(0.035, vm.dB); d.visible = false; art.add(d); return d; });
st.xs = [0.95]; for (let k = 0; k < 5; k++) st.xs.push(st.xs[k] * 0.45);
st.upd = (t) => { const cyc = 6.4; const ph = t % cyc; const k = Math.min(5, Math.floor(ph / 0.8)); const u = Math.min(1, (ph - k * 0.8) / 0.55);
const a = st.xs[k], b = st.xs[Math.min(5, k + 1)]; const x = k >= 5 ? st.xs[5] : a + (b - a) * (u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2); const hop = k >= 5 ? 0 : Math.sin(Math.PI * u) * 0.12;
st.d.position.set(x, f(x) + 0.07 + hop, 0.06); st.trail.forEach((d, q) => { d.visible = q <= k; d.position.set(st.xs[q], f(st.xs[q]) + 0.035, 0.05); }); };
} else if (v === 'sgd') {
[0.25, 0.5, 0.75, 1].forEach((s) => { const p = []; for (let q = 0; q <= 64; q++) { const a = q / 64 * Math.PI * 2; p.push(V(Math.cos(a) * 0.95 * s, Math.sin(a) * 0.55 * s)); } art.add(this.poly(p, vm.lG)); });
const path = []; let x = 0.85, y = 0.45; path.push(V(x, y, 0.05)); for (let k = 0; k < 14; k++) { x = x * 0.78 + (Math.random() - 0.5) * 0.22; y = y * 0.62 + (Math.random() - 0.5) * 0.22; path.push(V(x, y, 0.05)); }
st.path = this.poly(path, vm.lB); art.add(st.path); st.n = path.length; st.pp = path; st.d = this.dot(0.06, vm.dW); art.add(st.d);
art.add((() => { const d = this.dot(0.04, vm.dBr); d.position.set(0, 0, 0.05); return d; })());
st.upd = (t) => { const k = Math.floor((t * 3) % (st.n + 6)); const m = Math.min(st.n, k + 1); st.path.geometry.setDrawRange(0, m); st.d.position.copy(st.pp[m - 1]); };
} else if (v === 'local') {
const f = (x) => 0.75 * Math.pow(x * x - 0.42, 2) + 0.12 * x - 0.5; art.add(this.poly(curve(f, -1, 1, 80), vm.lP));
st.d = this.dot(0.065, vm.dW); art.add(st.d);
const xl = 0.62, xg = -0.68;
st.upd = (t) => { const ph = t % 7; let x, hop = 0;
if (ph < 1.6) { const u = ph / 1.6; x = 0.98 + (xl - 0.98) * (1 - Math.pow(1 - u, 3)); }
else if (ph < 2.8) x = xl;
else if (ph < 3.6) { const u = (ph - 2.8) / 0.8; x = xl + (-0.05 - xl) * u; hop = Math.sin(Math.PI * u) * 0.32; }
else if (ph < 5) { const u = (ph - 3.6) / 1.4; x = -0.05 + (xg + 0.05) * (1 - Math.pow(1 - u, 3)); }
else x = xg;
st.d.position.set(x, f(x) + 0.075 + hop, 0.06); };
}
const side = c.side; const base = new T.Vector3(-side * 2.2, -0.15, this.zc(i) - 0.9);
g.position.copy(base); g.rotation.y = side * 0.3; this.scene.add(g);
return { g: g, i: i, st: st, base: base, ol: olMat, fill: fill.material, side: side, hov: 0 };
}

drawPortrait(ctx, w, h, img) {
ctx.clearRect(0, 0, w, h);
if (img) {
const s = Math.max(w / img.width, h / img.height); const iw = img.width * s, ih = img.height * s; ctx.drawImage(img, (w - iw) / 2, (h - ih) / 2, iw, ih); return;
}
const sh = ctx.createLinearGradient(0, h * 0.62, 0, h); sh.addColorStop(0, '#6B7A8C'); sh.addColorStop(1, '#2E3B4D');
ctx.fillStyle = sh; ctx.beginPath(); ctx.ellipse(w / 2, h * 1.02, w * 0.48, h * 0.33, 0, Math.PI, 0); ctx.fill();
ctx.fillStyle = '#8A97A8'; ctx.fillRect(w / 2 - w * 0.09, h * 0.52, w * 0.18, h * 0.16);
const hg = ctx.createRadialGradient(w * 0.42, h * 0.32, w * 0.05, w / 2, h * 0.4, w * 0.32); hg.addColorStop(0, '#F5F8FC'); hg.addColorStop(0.7, '#A7B3C2'); hg.addColorStop(1, '#6B7A8C');
ctx.fillStyle = hg; ctx.beginPath(); ctx.ellipse(w / 2, h * 0.39, w * 0.22, h * 0.21, 0, 0, Math.PI * 2); ctx.fill();
ctx.fillStyle = '#2E3B4D'; ctx.beginPath(); ctx.ellipse(w / 2, h * 0.27, w * 0.23, h * 0.11, 0, Math.PI, 0); ctx.fill();
}
buildPortrait() {
const T = this.T; const i = this.CH.length - 1; const g = new T.Group();
const W = 1.85, H = 2.35;
const shape = this.rrect(W + 0.2, H + 0.2, 0.18);
const frame = new T.Line(new T.BufferGeometry().setFromPoints(shape.getPoints(10).map((p) => new T.Vector3(p.x, p.y, 0))), new T.LineBasicMaterial({ color: 0x9cc6ff, transparent: true, opacity: 0.7, toneMapped: false })); g.add(frame);
const back = new T.Mesh(new T.ShapeGeometry(shape, 8), new T.MeshBasicMaterial({ color: 0x0f1622, transparent: true, opacity: 0.55, depthWrite: false, toneMapped: false })); back.position.z = -0.05; g.add(back);
const cw = 120, chh = 152; const c = document.createElement('canvas'); c.width = cw; c.height = chh; this.pCanvas = c;
const n = 5200; const geo = new T.BufferGeometry(); const pos = new Float32Array(n * 3), col = new Float32Array(n * 3);
geo.setAttribute('position', new T.BufferAttribute(pos, 3)); geo.setAttribute('color', new T.BufferAttribute(col, 3));
this.pTarget = new Float32Array(n * 3); this.pScatter = new Float32Array(n * 3);
for (let k = 0; k < n; k++) { const a = Math.random() * Math.PI * 2, b = Math.acos(2 * Math.random() - 1), r = 2.2 + Math.random() * 2.5; this.pScatter.set([Math.sin(b) * Math.cos(a) * r, Math.sin(b) * Math.sin(a) * r, Math.cos(b) * r], k * 3); }
this.pGeo = geo; this.pN = n; this.pW = W; this.pH = H;
const pts = new T.Points(geo, new T.PointsMaterial({ size: 0.03, vertexColors: true, transparent: true, opacity: 0.95, blending: T.AdditiveBlending, depthWrite: false, toneMapped: false }));
g.add(pts); this.pPoints = pts; this.pGroup = g;
const thMat = new T.MeshBasicMaterial({ color: 0x4c8dff, toneMapped: false });
const th = new T.Group(); const loopc = (rx, ry) => { const p = []; for (let k = 0; k < 80; k++) { const t = k / 80 * Math.PI * 2; const y = ry * Math.sin(t); p.push(new T.Vector3(rx * Math.cos(t) + 0.21 * y, y, 0)); } return new T.CatmullRomCurve3(p, true); };
th.add(new T.Mesh(new T.TubeGeometry(loopc(0.12, 0.18), 60, 0.012, 6, true), thMat)); th.add(new T.Mesh(new T.TubeGeometry(new T.LineCurve3(new T.Vector3(-0.1, 0, 0), new T.Vector3(0.1, 0, 0)), 4, 0.012, 6, false), thMat));
th.position.set(W / 2 - 0.12, -H / 2 + 0.18, 0.02); g.add(th);
const zc = this.zc(i); g.position.set(-0.85, 0.05, zc - 0.9); g.rotation.y = 0.18; this.scene.add(g); this.portrait = g;
const arcPts = []; const rp = this.robots.find((rb) => rb.userData.last);
const a0 = new T.Vector3(rp ? rp.position.x + 0.25 : -2.3, rp ? rp.position.y + 0.1 : -0.8, zc - 0.3), a1 = new T.Vector3(-0.85 - W / 2 - 0.05, -0.2, zc - 0.85);
const ctrl = new T.Vector3((a0.x + a1.x) / 2, 0.9, zc - 0.5); const qc = new T.QuadraticBezierCurve3(a0, ctrl, a1); this.arc = qc;
this.scene.add(new T.Line(new T.BufferGeometry().setFromPoints(qc.getPoints(40)), new T.LineBasicMaterial({ color: 0x4c8dff, transparent: true, opacity: 0.35, toneMapped: false })));
this.arcDots = [0, 1, 2].map(() => { const d = this.dot(0.03, this.vm.dW); this.scene.add(d); return d; });
this.fillPortrait(null);
this.loadPhoto();
}
fillPortrait(img) {
const T = this.T; const c = this.pCanvas, w = c.width, h = c.height; const ctx = c.getContext('2d');
this.drawPortrait(ctx, w, h, img); let data;
try { data = ctx.getImageData(0, 0, w, h).data; } catch (err) { this.drawPortrait(ctx, w, h, null); data = ctx.getImageData(0, 0, w, h).data; }
const cands = [];
for (let y = 0; y < h; y += 1) for (let x = 0; x < w; x += 1) { const k = (y * w + x) * 4; if (data[k + 3] > 40) cands.push([x, y, (data[k] * 0.3 + data[k + 1] * 0.55 + data[k + 2] * 0.15) / 255]); }
const n = this.pN; const col = this.pGeo.attributes.color.array; const lo = new T.Color('#1C46C9'), hi = new T.Color('#F5F8FC'), mid = new T.Color('#4C8DFF'), tmp = new T.Color();
for (let k = 0; k < n; k++) {
const q = cands.length ? cands[Math.floor(Math.random() * cands.length)] : [w / 2, h / 2, 0.5];
const jx = q[0] + Math.random(), jy = q[1] + Math.random();
const X = (jx / w - 0.5) * this.pW, Y = (0.5 - jy / h) * this.pH; const nx = (jx / w - 0.5) * 2, ny = (jy / h - 0.42) * 2;
const Z = q[2] * 0.22 + Math.max(0, 1 - nx * nx * 1.6 - ny * ny * 0.9) * 0.18;
this.pTarget.set([X, Y, Z], k * 3);
const b = q[2]; if (b < 0.5) tmp.copy(lo).lerp(mid, b * 2); else tmp.copy(mid).lerp(hi, (b - 0.5) * 2); col.set([tmp.r, tmp.g, tmp.b], k * 3);
}
this.pGeo.attributes.color.needsUpdate = true;
}
loadPhoto() {
const src = '/img/llk-cutout.webp'; if (!src) { this.fillPortrait(null); return; }
const img = new Image(); img.onload = () => { if (this.dead) return; this.fillPortrait(img); this.makePhotoPlane(img); }; img.onerror = () => { if (!this.dead) this.fillPortrait(null); }; img.src = src;
}
makePhotoPlane(img) {
const T = this.T; if (!this.pGroup) return;
if (this.photoPlane) { this.pGroup.remove(this.photoPlane); this.photoPlane.material.map.dispose(); this.photoPlane.geometry.dispose(); }
const tex = new T.Texture(img); tex.colorSpace = T.SRGBColorSpace; tex.needsUpdate = true;
const ta = this.pW / this.pH, ia = img.width / img.height;
if (ia > ta) { tex.repeat.set(ta / ia, 1); tex.offset.set((1 - ta / ia) / 2, 0); } else { tex.repeat.set(1, ia / ta); tex.offset.set(0, (1 - ia / ta) / 2); }
const m = new T.Mesh(new T.PlaneGeometry(this.pW, this.pH), new T.MeshBasicMaterial({ map: tex, transparent: true, opacity: 0, depthWrite: false, toneMapped: false }));
m.position.z = 0.14; this.pGroup.add(m); this.photoPlane = m;
}

loop() {
if (this.dead) return;
this.raf = requestAnimationFrame(() => this.loop());
if (!this.shown) { if (this.clock) this.clock.getDelta(); return; }
const T = this.T; const dt = Math.min(0.05, this.clock.getDelta()); const t = this.clock.elapsedTime;
const prev = this.cur;
if (this.tween) {
const tw = this.tween; tw.t += dt; const u = Math.min(1, tw.t / tw.dur); const e = u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2;
this.cur = tw.from + (tw.to - tw.from) * e; this.cv = 0; if (u >= 1) { this.tween = null; this.cur = tw.to; this.target = tw.to; }
} else {
if (!this.touch && this.now() - this.lastInput > 0.5) this.target = Math.round(this.target);
const kk = 22, cc = 8.6; this.cv += ((this.target - this.cur) * kk - this.cv * cc) * dt; this.cur += this.cv * dt;
if (Math.abs(this.target - this.cur) < 1e-4 && Math.abs(this.cv) < 1e-3) { this.cur = this.target; this.cv = 0; }
}
this.vel = this.vel * 0.85 + ((this.cur - prev) / Math.max(dt, 1e-3)) * 0.15;
if (this.exit) { this.exit.t += dt; this.warp = Math.min(1, this.warp + dt * 1.6); }
if (this.arr > 0) this.arr = Math.max(0, this.arr - dt * 2.2);
this.pulse = Math.max(0, this.pulse - dt * 2.2);
const ar = this.arr * this.arr * (3 - 2 * this.arr);
const sp = Math.min(1, Math.abs(this.vel) * 0.8 + this.warp + ar + this.pulse * 0.35);
const stt = 1 + sp * sp * 7;
if (Math.abs(stt - this.stretch) > 0.03 && this.sg) {
this.stretch = stt; const pa = this.sg.attributes.position.array, L = this.slen;
for (let i = 0; i < L.length; i++) pa[i * 6 + 5] = pa[i * 6 + 2] - L[i] * stt;
this.sg.attributes.position.needsUpdate = true;
}
this.perf.acc += dt; this.perf.n++;
if (this.perf.n >= 90) { const avg = this.perf.acc / this.perf.n; this.perf.acc = 0; this.perf.n = 0; if (avg > 1 / 30 && this.dpr > 1.5) { this.dpr = Math.max(1.5, this.dpr - 0.25); this.r.setPixelRatio(this.dpr); this.r.setSize(this.W, this.H, false); } }
if (!this.mdrag && !this.touch) { this.lookT.x *= Math.exp(-dt * 0.9); this.lookT.y *= Math.exp(-dt * 0.9); }
this.look.x += (this.lookT.x - this.look.x) * Math.min(1, dt * 6); this.look.y += (this.lookT.y - this.look.y) * Math.min(1, dt * 6);
this.camP.x += (this.ptr.x * 0.5 - this.camP.x) * Math.min(1, dt * 2.5); this.camP.y += (-this.ptr.y * 0.35 - this.camP.y) * Math.min(1, dt * 2.5);
const cz = 6 - this.cur * this.S - this.warp * this.warp * 9 + ar * 14 - this.pulse * 0.5;
this.cam.position.set(this.camP.x + Math.sin(t * 0.3) * 0.1, this.camP.y + Math.cos(t * 0.27) * 0.08, cz);
this.cam.rotation.set(this.camP.y * 0.05 - this.look.y, -this.camP.x * 0.08 - this.look.x, Math.sin(this.cur * 0.55) * 0.07 + this.warp * 0.25 - ar * 0.4);
const fov = 52 + sp * 22; if (Math.abs(this.cam.fov - fov) > 0.05) { this.cam.fov += (fov - this.cam.fov) * Math.min(1, dt * 5); this.cam.updateProjectionMatrix(); }
this.streakMat.opacity = 0.55 + sp * 0.45;
this.helix.rotation.z = t * 0.02 + this.cur * 0.08;
this.dust.rotation.z = -t * 0.01;
this.camLight.intensity = 6 + this.pulse * 10 + ar * 8; this.camLight.position.set(this.cam.position.x, this.cam.position.y, cz - 3);
const ci = Math.round(this.cur);
{
const ci = Math.round(this.cur); const ch = this.CH[ci]; const etroit = this.W < 820 || this.W / this.H < 1.05;
if (ci !== this.compI && Math.abs(this.cur - ci) < 0.18) {
this.compI = ci; this.compT = t;
const lab = ch && ch.ep && ch.links && ch.links[0] && ch.links[0].theme ? ci : -1;
if (lab !== this.state.offre) this.setState({ offre: lab });
}
const e = Math.max(0, 1 - (t - this.compT) / 1.8); const cp = this.cam.position; const m = !!(ch && ch.ep);
this.comp.visible = m;
if (m) {
this.comp.scale.setScalar(etroit ? 0.2 : 0.26);
this.comp.position.set(cp.x + (etroit ? 0.36 : 1.42), cp.y + (etroit ? 0.62 : -0.8) + Math.abs(Math.sin(t * (4 + 7 * e))) * (0.04 + 0.16 * e), cp.z - 2.4);
this.comp.rotation.set(0.05, -0.5 + Math.sin(t * 3.4) * (0.16 + 0.34 * e), Math.sin(t * 5.2) * (0.07 + 0.16 * e));
}
}
this.gates.forEach((g, i) => { g.rotation.y = Math.sin(t * 0.4 + i) * 0.12; const near = Math.max(0, 1 - Math.abs(this.cur - i) * 1.4); this.glowMats[i].opacity = 0.2 + near * 0.55 + this.warp * 0.4; });
this.robots.forEach((rob, k) => { const b = rob.userData.base; const etroit = this.W < 820 || this.W / this.H < 1.05; rob.position.x = etroit ? rob.userData.side * 0.62 : b.x; rob.scale.setScalar(etroit ? 0.72 : 1); rob.position.y = (etroit ? -0.2 : b.y) + Math.sin(t * 1.6 + k) * 0.06; rob.rotation.y = rob.userData.last ? 0.55 + Math.sin(t * 0.7) * 0.12 : -0.35 + Math.sin(t * 0.6) * 0.15 + this.camP.x * 0.4; });
const blink = (t % 3.8) < 0.12 ? 0.15 : 1; this.eyes.forEach((e) => { e.scale.x = blink; });
this.mat.chest.emissiveIntensity = 0.9 + 0.5 * Math.sin(t * 2.4);
const narrow = this.W < 820 || this.W / this.H < 1.05;
this.cards.forEach((cd) => {
const near = Math.max(0, 1 - Math.abs(this.cur - cd.i) * 1.2); cd.st.upd(t + cd.st.t0);
const hv = this.hover === cd.i ? 1 : 0; cd.hov += (hv - cd.hov) * Math.min(1, dt * 8);
const s = (narrow ? 0.62 : 1) * (1 + cd.hov * 0.06);
cd.g.scale.setScalar(s);
cd.g.position.set(narrow ? 0 : cd.base.x, narrow ? 1.35 : cd.base.y + Math.sin(t * 0.8 + cd.i) * 0.05, cd.base.z);
cd.g.rotation.y = (narrow ? 0 : cd.side * 0.3) + this.camP.x * 0.15 + Math.sin(t * 0.5 + cd.i) * 0.04;
cd.ol.color.setHex(cd.hov > 0.5 ? 0x4c8dff : 0x2a3a55); cd.ol.opacity = 0.55 + near * 0.45; cd.fill.opacity = 0.45 + cd.hov * 0.25;
});
if (this.portrait) {
const p = Math.max(0, Math.min(1, (this.cur - (this.CH.length - 2)) * 1.25)); const e = p * p * (3 - 2 * p);
const a = this.pGeo.attributes.position.array; const tg = this.pTarget, sc = this.pScatter;
for (let k = 0; k < this.pN * 3; k += 3) { const wob = (1 - e) * 0.2; a[k] = sc[k] + (tg[k] - sc[k]) * e + Math.sin(t + k) * 0.004; a[k + 1] = sc[k + 1] + (tg[k + 1] - sc[k + 1]) * e + Math.cos(t * 0.8 + k) * 0.004 * (1 + wob * 10); a[k + 2] = sc[k + 2] + (tg[k + 2] - sc[k + 2]) * e; }
this.pGeo.attributes.position.needsUpdate = true;
if (this.photoPlane) { const q = Math.max(0, Math.min(1, (e - 0.82) / 0.18)); const qq = q * q * (3 - 2 * q); this.photoPlane.material.opacity = qq * 0.97; if (this.pPoints) this.pPoints.material.opacity = 0.95 - qq * 0.7; }
this.portrait.rotation.y = 0.18 + this.camP.x * 0.35 + Math.sin(t * 0.4) * 0.05; this.portrait.rotation.x = -this.camP.y * 0.2;
this.arcDots.forEach((d, k) => { d.position.copy(this.arc.getPoint(((t * 0.35) + k / 3) % 1)); });
}
this.cam.updateMatrixWorld();
if (this.inside && !this.mdrag && !this.exit) {
this.ray.setFromCamera(new T.Vector2(this.px.x / this.W * 2 - 1, -(this.px.y / this.H) * 2 + 1), this.cam);
const hit = this.ray.intersectObjects(this.hits, false).find((h) => h.distance < 16);
const hi = hit ? hit.object.userData.idx : -1;
if (hi !== this.hover) {
this.hover = hi;
const c = hi >= 0 ? this.CH[hi] : null; const cur = Math.round(this.cur);
const lbl = !c ? '' : hi !== cur ? this.L('Aller au ') + c.num : (c.links && c.links.length ? c.links[0].label : '');
this.setState({ hoverLabel: lbl });
}
} else if (this.hover !== -1 && !this.inside) { this.hover = -1; this.setState({ hoverLabel: '' }); }
if (this.cursorEl) {
const big = this.hover >= 0;
this.cursorEl.style.transform = 'translate3d(' + this.px.x.toFixed(1) + 'px,' + this.px.y.toFixed(1) + 'px,0)';
this.cursorEl.style.opacity = this.inside ? '1' : '0';
this.cursorEl.style.width = big ? '64px' : '34px'; this.cursorEl.style.height = big ? '64px' : '34px'; this.cursorEl.style.margin = big ? '-32px 0 0 -32px' : '-17px 0 0 -17px';
this.cursorEl.style.background = big ? 'rgba(76,141,255,0.16)' : 'transparent'; this.cursorEl.style.borderColor = big ? '#4C8DFF' : 'rgba(207,224,255,0.55)';
}
const v = new T.Vector3();
this.CH.forEach((c, i) => {
const el = this.refs[i]; if (!el) return;
const dist = cz - this.zc(i);
if (dist < 0.6 || this.exit) { el.style.opacity = '0'; el.style.visibility = 'hidden'; el.style.pointerEvents = 'none'; return; }
const fin = Math.max(0, Math.min(1, (20 - dist) / 11)), fout = Math.max(0, Math.min(1, (dist - 2.2) / 1.8));
const op = fin * fout;
const ax = narrow ? 0 : c.side * 0.75; const ay = narrow ? -0.45 : 0.35;
v.set(ax, ay, this.zc(i)).project(this.cam);
const sx = narrow ? this.W / 2 : (v.x + 1) / 2 * this.W, sy = narrow ? this.H * 0.62 : (1 - v.y) / 2 * this.H;
const sc = narrow ? Math.min(1, 6 / dist) : Math.min(2.4, 6 / dist);
const tx = narrow ? '-50%' : (c.side < 0 ? '-100%' : '0%');
const ry = narrow ? 0 : -c.side * 14 * (1 - fout * 0.4) + this.look.x * 20;
const lift = (1 - fin) * 30;
el.style.transformOrigin = narrow ? 'center center' : (c.side < 0 ? 'right center' : 'left center');
el.style.transform = 'translate3d(' + sx.toFixed(1) + 'px,' + (sy + lift).toFixed(1) + 'px,0) translate(' + tx + ',-50%) perspective(1100px) rotateY(' + ry.toFixed(2) + 'deg) scale(' + sc.toFixed(3) + ')';
el.style.opacity = op.toFixed(3); el.style.visibility = op < 0.02 ? 'hidden' : 'visible'; el.style.pointerEvents = op > 0.6 ? 'auto' : 'none';
});
if (this.bar) this.bar.style.transform = 'scaleX(' + (this.cur / (this.CH.length - 1)).toFixed(4) + ')';
if (ci !== this.state.idx) this.setState({ idx: ci });
this.r.render(this.scene, this.cam);
}

renderVals() {
const idx = this.state.idx || 0;
const chapters = this.CH.map((c, i) => {
const right = c.side > 0;
return {
ref: this.refFns[i], label: c.num + ' ' + c.t1 + ' ' + c.t2,
num: c.num, group: c.group, t1: c.t1, t2: c.t2, text: c.text,
hasFormula: !!c.formula, formula: c.formula || '',
origin: right ? 'left center' : 'right center', align: right ? 'left' : 'right', items: right ? 'flex-start' : 'flex-end',
links: (c.links || []).map((l) => ({ href: l.href, label: l.label, go: (e) => this.leave(e, l.theme), bg: l.primary ? '#F5F8FC' : 'rgba(15,22,34,0.55)', color: l.primary ? '#0A0F17' : '#F5F8FC', border: l.primary ? '#F5F8FC' : '#2E3B4D' })),
soon: !!c.soon, soonTxt: c.soon || ''
};
});
const navItems = this.CH.map((c, i) => {
const on = i === idx;
return { label: c.nav, go: this.jumps[i], current: on ? 'step' : 'false', weight: on ? '600' : '400', color: on ? '#F5F8FC' : '#8A97A8', dot: on ? '9px' : '6px', dotColor: on ? '#4C8DFF' : '#2E3B4D', glow: on ? '0 0 12px #4C8DFF' : 'none' };
});
const c = this.CH[idx];
return {
chapters: chapters, navItems: navItems,
offre: this.state.offre >= 0 && !this.refus[this.state.offre] ? { texte: this.L('Le labo du ') + this.CH[this.state.offre].num + this.L(' vous attend !'), href: this.CH[this.state.offre].links[0].href, label: this.CH[this.state.offre].links[0].label, oui: (e) => this.leave(e, this.CH[this.state.offre].links[0].theme), non: () => { this.refus[this.state.offre] = true; this.setState({ offreVue: this.state.offre }); } } : null, nonTxt: this.L('Pas maintenant'), goPrev: () => this.jumpTo(this.clampT(Math.round(this.target) - 1)), goNext: () => this.jumpTo(this.clampT(Math.round(this.target) + 1)), href: this.props.href, aide: this.L('Molette · glisser pour regarder · cliquer sur une carte'), noGL: !!this.state.noGL, setCanvas: this.setCanvas, setIris: this.setIris, setBar: this.setBar, setCursor: this.setCursor,
onWheel: this.onWheel, onKey: this.onKey, onDown: this.onDown, onMove: this.onMove, onUp: this.onUp, onLeave: this.onLeave,
goLabAny: this.goLabAny, goMain: this.goMain,
cursor: this.state.drag ? 'grabbing' : (this.state.hoverLabel ? 'pointer' : 'default'),
cursorLabel: this.state.hoverLabel || '', cursorLabelOp: this.state.hoverLabel ? 1 : 0,
exitOp: this.state.exiting ? 1 : 0,
curLabel: c.id === 'intro' ? 'θ' : c.id === 'auteur' ? this.L('Fin') : c.nav, curName: c.id === 'intro' ? this.L('Introduction') : (c.t2 || '').replace(/[?:]/g, '').trim(),
atStart: idx === 0, arrive: this.state.arrive
};
}
}
