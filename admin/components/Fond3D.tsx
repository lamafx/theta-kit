'use client';

import { useEffect, useRef } from 'react';

/**
 * Fond de l'admin : une nappe de points en perspective qui ondule lentement, comme une surface de coût
 * vue de loin. Calculée, jamais dessinée à l'œil ; en pause quand l'onglet est caché.
 */
export default function Fond3D() {
  const hote = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = hote.current;
    if (!el) return;
    let arret = false;
    let nettoyer = () => {};
    (async () => {
      const T = await import('three');
      if (arret) return;
      let r: import('three').WebGLRenderer;
      try {
        r = new T.WebGLRenderer({ antialias: false, alpha: true, powerPreference: 'low-power' });
      } catch {
        return;
      }
      r.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
      el.appendChild(r.domElement);
      const scene = new T.Scene();
      const cam = new T.PerspectiveCamera(55, 1, 0.1, 100);
      cam.position.set(0, 3.2, 9);
      cam.lookAt(0, -0.5, 0);
      const N = window.innerWidth < 700 ? 56 : 90;
      const pos = new Float32Array(N * N * 3);
      const geo = new T.BufferGeometry();
      geo.setAttribute('position', new T.BufferAttribute(pos, 3));
      const mat = new T.PointsMaterial({ color: 0x9cc6ff, size: 0.035, transparent: true, opacity: 0.55, depthWrite: false, sizeAttenuation: true });
      const nappe = new T.Points(geo, mat);
      scene.add(nappe);
      const taille = () => {
        r.setSize(window.innerWidth, window.innerHeight, false);
        cam.aspect = window.innerWidth / window.innerHeight;
        cam.updateProjectionMatrix();
      };
      taille();
      window.addEventListener('resize', taille);
      const lent = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const calcul = (t: number) => {
        let i = 0;
        for (let a = 0; a < N; a++) {
          for (let b = 0; b < N; b++) {
            const x = (a / (N - 1) - 0.5) * 22;
            const z = (b / (N - 1) - 0.5) * 22;
            const y = 0.35 * Math.sin(x * 0.45 + t * 0.35) * Math.cos(z * 0.4 - t * 0.25) + 0.04 * (x * x + z * z) * 0.12 - 1.4;
            pos[i++] = x;
            pos[i++] = y;
            pos[i++] = z;
          }
        }
        geo.attributes.position.needsUpdate = true;
      };
      calcul(0);
      let raf = 0;
      const t0 = performance.now();
      let dernier = 0;
      const boucle = (maintenant: number) => {
        raf = requestAnimationFrame(boucle);
        if (document.hidden || maintenant - dernier < 33) return; // 30 images/s suffisent pour un fond
        dernier = maintenant;
        if (!lent) calcul((maintenant - t0) / 1000);
        nappe.rotation.y = lent ? 0 : Math.sin((maintenant - t0) / 40000) * 0.3;
        r.render(scene, cam);
      };
      raf = requestAnimationFrame(boucle);
      nettoyer = () => {
        cancelAnimationFrame(raf);
        window.removeEventListener('resize', taille);
        geo.dispose();
        mat.dispose();
        r.dispose();
        r.domElement.remove();
      };
    })();
    return () => {
      arret = true;
      nettoyer();
    };
  }, []);
  return <div ref={hote} className="fond" aria-hidden="true" />;
}
