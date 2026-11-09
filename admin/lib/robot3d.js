// Copie de site/theta-kit/lib/engines/robot3d.js : le même robot θ que le site (même dessin, mêmes matériaux).

/** Environnement et lumières pour les matériaux physiques du robot. */
export function eclairerRobot(T, r, scene) {
  r.outputColorSpace = T.SRGBColorSpace; r.toneMapping = T.ACESFilmicToneMapping; r.toneMappingExposure = 1.0;
  const pm = new T.PMREMGenerator(r); const es = new T.Scene();
  es.add(new T.Mesh(new T.BoxGeometry(12, 12, 12), new T.MeshBasicMaterial({ color: 0xdfe7f3, side: T.BackSide })));
  const lamp = (c, w, h, x, y, z) => { const m = new T.Mesh(new T.PlaneGeometry(w, h), new T.MeshBasicMaterial({ color: c, side: T.DoubleSide })); m.position.set(x, y, z); m.lookAt(0, 0, 0); es.add(m); };
  lamp(0xffffff, 6, 4, -3, 4, 3); lamp(0xffffff, 4, 3, 4, 2, 3.5); lamp(0x9cc6ff, 8, 2, 0, -5, 1);
  scene.environment = pm.fromScene(es, 0.04).texture; pm.dispose();
  scene.add(new T.HemisphereLight(0xffffff, 0xb8c6da, 0.9));
  const key = new T.DirectionalLight(0xffffff, 1.6); key.position.set(-3, 5, 6); scene.add(key);
  const rim = new T.DirectionalLight(0x9cc6ff, 1.2); rim.position.set(4, 2, -4); scene.add(rim);
}

/** Construit le robot : groupe racine, corps, tête, bras, visage dessiné sur une texture. */
export function creerRobot(T) {
  const M = {
    white: new T.MeshPhysicalMaterial({ color: 0xf8fafc, roughness: 0.28, clearcoat: 1, clearcoatRoughness: 0.1 }),
    bronze: new T.MeshStandardMaterial({ color: 0xc8925a, metalness: 1, roughness: 0.3 }),
    metal: new T.MeshStandardMaterial({ color: 0xc9d1da, metalness: 1, roughness: 0.3 }),
    dark: new T.MeshStandardMaterial({ color: 0x262e39, metalness: 0.5, roughness: 0.4 }),
    chest: new T.MeshStandardMaterial({ color: 0x4c8dff, emissive: 0x4c8dff, emissiveIntensity: 1.4 }),
  };
  const fc = document.createElement('canvas'); fc.width = 512; fc.height = 192; const ctx = fc.getContext('2d');
  const faceTex = new T.CanvasTexture(fc); faceTex.colorSpace = T.SRGBColorSpace;
  M.visor = new T.MeshPhysicalMaterial({ color: 0x05080d, roughness: 0.08, metalness: 0.3, clearcoat: 1, clearcoatRoughness: 0.03, emissive: 0xffffff, emissiveMap: faceTex, emissiveIntensity: 1.5 });

  const R = new T.Group(); const B = new T.Group(); R.add(B);
  const add = (parent, geo, mat, x, y, z) => { const m = new T.Mesh(geo, mat); m.position.set(x, y, z); parent.add(m); return m; };
  const torso = add(B, new T.SphereGeometry(0.62, 48, 32), M.white, 0, -0.1, 0); torso.scale.set(1.25, 0.7, 0.8);
  add(B, new T.TorusGeometry(0.1, 0.014, 10, 36), M.metal, 0, -0.1, 0.49);
  add(B, new T.SphereGeometry(0.055, 20, 14), M.chest, 0, -0.1, 0.49);
  add(B, new T.CylinderGeometry(0.12, 0.14, 0.24, 24), M.metal, 0, 0.36, 0);
  const collar = add(B, new T.TorusGeometry(0.15, 0.03, 10, 32), M.bronze, 0, 0.27, 0); collar.rotation.x = Math.PI / 2;
  const HP = new T.Group(); HP.position.set(0, 0.42, 0); B.add(HP);
  const head = add(HP, new T.SphereGeometry(0.5, 48, 36), M.white, 0, 0.53, 0); head.scale.set(1.1, 1, 0.95);
  const visor = add(HP, new T.SphereGeometry(0.507, 48, 24, Math.PI / 2 - 0.78, 1.56, Math.PI / 2 - 0.3, 0.6), M.visor, 0, 0.53, 0); visor.scale.set(1.1, 1, 0.95);
  [-1, 1].forEach((s) => {
    const cup = add(HP, new T.CylinderGeometry(0.21, 0.21, 0.16, 36), M.white, s * 0.6, 0.53, 0); cup.rotation.z = Math.PI / 2;
    const ring = add(HP, new T.TorusGeometry(0.16, 0.035, 12, 36), M.bronze, s * 0.69, 0.53, 0); ring.rotation.y = Math.PI / 2;
    const disc = add(HP, new T.CylinderGeometry(0.125, 0.125, 0.03, 32), M.metal, s * 0.685, 0.53, 0); disc.rotation.z = Math.PI / 2;
  });
  add(HP, new T.TorusGeometry(0.66, 0.045, 12, 48, Math.PI), M.dark, 0, 0.53, 0);
  const arms = {};
  [-1, 1].forEach((s) => {
    add(B, new T.SphereGeometry(0.14, 24, 18), M.white, s * 0.7, -0.02, 0.04);
    const SP = new T.Group(); SP.position.set(s * 0.8, 0.02, 0.05); B.add(SP);
    add(SP, new T.CapsuleGeometry(0.085, 0.14, 6, 16), M.white, 0, -0.13, 0);
    const EP = new T.Group(); EP.position.set(0, -0.26, 0); SP.add(EP);
    const wr = add(EP, new T.TorusGeometry(0.075, 0.022, 10, 28), M.bronze, 0, -0.04, 0); wr.rotation.x = Math.PI / 2;
    add(EP, new T.CapsuleGeometry(0.075, 0.1, 6, 16), M.white, 0, -0.12, 0);
    add(EP, new T.SphereGeometry(0.095, 24, 18), M.white, 0, -0.24, 0);
    arms[s] = { sp: SP, ep: EP };
  });

  // Réacteur sous le corps : halo additif qui pulse pendant le vol.
  const jc = document.createElement('canvas'); jc.width = jc.height = 64; const jx = jc.getContext('2d');
  const jg = jx.createRadialGradient(32, 32, 1, 32, 32, 30); jg.addColorStop(0, 'rgba(220,235,255,1)'); jg.addColorStop(0.35, 'rgba(120,170,255,.65)'); jg.addColorStop(1, 'rgba(76,141,255,0)');
  jx.fillStyle = jg; jx.fillRect(0, 0, 64, 64);
  const jet = new T.Sprite(new T.SpriteMaterial({ map: new T.CanvasTexture(jc), transparent: true, depthWrite: false, blending: T.AdditiveBlending, toneMapped: false }));
  jet.position.set(0, -0.62, 0); jet.scale.set(0.7, 0.9, 1); B.add(jet);

  let cle = '';
  /** Visage : 'neutral' ou 'happy', ouverture des yeux 0..1, regard lx/ly en -1..1. */
  const visage = (expr, open, lx, ly) => {
    const k = expr + (open < 0.18 ? 'c' : 'o') + Math.round(lx * 4) + Math.round(ly * 4); if (k === cle) return; cle = k;
    const c = ctx, w = 512, h = 192;
    c.setTransform(1, 0, 0, 1, 0, 0); c.fillStyle = '#0A0F17'; c.fillRect(0, 0, w, h);
    c.fillStyle = '#9CC6FF'; c.strokeStyle = '#9CC6FF'; c.lineCap = 'round'; c.lineWidth = 12; c.shadowColor = '#4C8DFF'; c.shadowBlur = 22;
    const ex = [0.31 * w + lx * 16, 0.69 * w + lx * 16], ey = 0.42 * h + ly * 12, my = 0.76 * h + ly * 8, mx = 0.5 * w + lx * 16;
    const pill = (x, y, ww, hh) => { const rr = Math.min(ww, hh) / 2; c.beginPath(); c.moveTo(x - ww / 2 + rr, y - hh / 2); c.arcTo(x + ww / 2, y - hh / 2, x + ww / 2, y + hh / 2, rr); c.arcTo(x + ww / 2, y + hh / 2, x - ww / 2, y + hh / 2, rr); c.arcTo(x - ww / 2, y + hh / 2, x - ww / 2, y - hh / 2, rr); c.arcTo(x - ww / 2, y - hh / 2, x + ww / 2, y - hh / 2, rr); c.closePath(); c.fill(); };
    if (expr === 'happy') {
      [0, 1].forEach((i) => { c.beginPath(); c.arc(ex[i], ey + 14, 26, Math.PI * 1.15, Math.PI * 1.85); c.stroke(); });
      c.beginPath(); c.arc(mx, my - 14, 26, Math.PI * 0.2, Math.PI * 0.8); c.stroke();
    } else {
      [0, 1].forEach((i) => { if (open < 0.18) { c.beginPath(); c.moveTo(ex[i] - 28, ey); c.lineTo(ex[i] + 28, ey); c.stroke(); } else pill(ex[i], ey, 64, 40 * open); });
      c.lineWidth = 8; c.beginPath(); c.moveTo(mx - 12, my); c.lineTo(mx + 12, my); c.stroke();
    }
    faceTex.needsUpdate = true;
  };
  visage('neutral', 1, 0, 0);
  return { R, B, tete: HP, bras: arms, jet, visage };
}
