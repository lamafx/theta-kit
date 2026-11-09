'use client';

import { useEffect, useRef } from 'react';

type Props = { expression?: 'neutral' | 'happy'; className?: string; titre?: string };

/** Le robot θ du site, en 3D : il flotte, cligne des yeux et suit le doigt ou la souris. */
export default function Robot3D({ expression = 'neutral', className = 'robot', titre = 'Robot θ' }: Props) {
  const hote = useRef<HTMLDivElement>(null);
  const expr = useRef(expression);
  expr.current = expression;

  useEffect(() => {
    const el = hote.current;
    if (!el) return;
    let arret = false;
    let nettoyer = () => {};
    (async () => {
      const T = await import('three');
      const { creerRobot, eclairerRobot } = await import('@/lib/robot3d');
      if (arret) return;
      let r: import('three').WebGLRenderer;
      try {
        r = new T.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
      } catch {
        el.classList.add('sans-webgl');
        return;
      }
      r.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      el.appendChild(r.domElement);
      const scene = new T.Scene();
      const cam = new T.PerspectiveCamera(32, 1, 0.1, 50);
      cam.position.set(0, 0.35, 5.2);
      eclairerRobot(T, r, scene);
      const rob = creerRobot(T);
      rob.R.scale.setScalar(0.92);
      scene.add(rob.R);
      const taille = () => {
        const w = el.clientWidth || 1;
        const h = el.clientHeight || w;
        r.setSize(w, h, false);
        cam.aspect = w / h;
        cam.updateProjectionMatrix();
      };
      taille();
      const ro = new ResizeObserver(taille);
      ro.observe(el);
      let vise = { x: 0, y: 0 };
      const suivre = (e: PointerEvent) => {
        const b = el.getBoundingClientRect();
        vise = { x: Math.max(-1, Math.min(1, (e.clientX - (b.left + b.width / 2)) / (window.innerWidth / 2))), y: Math.max(-1, Math.min(1, (e.clientY - (b.top + b.height / 2)) / (window.innerHeight / 2))) };
      };
      window.addEventListener('pointermove', suivre, { passive: true });
      let visible = true;
      const io = new IntersectionObserver(([x]) => (visible = x.isIntersecting));
      io.observe(el);
      const lent = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      let regard = { x: 0, y: 0 };
      let prochainClin = 1.5;
      let raf = 0;
      const t0 = performance.now();
      const boucle = () => {
        raf = requestAnimationFrame(boucle);
        if (!visible || document.hidden) return;
        const t = (performance.now() - t0) / 1000;
        regard = { x: regard.x + (vise.x - regard.x) * 0.06, y: regard.y + (vise.y - regard.y) * 0.06 };
        rob.B.position.y = lent ? 0 : Math.sin(t * 1.4) * 0.06;
        rob.B.rotation.z = lent ? 0 : Math.sin(t * 0.9) * 0.03;
        rob.tete.rotation.y = regard.x * 0.45;
        rob.tete.rotation.x = regard.y * 0.2;
        rob.R.rotation.y = regard.x * 0.25;
        rob.bras[1].sp.rotation.z = 0.15 + Math.sin(t * 1.1) * 0.06;
        rob.bras[-1].sp.rotation.z = -0.15 - Math.sin(t * 1.1 + 1) * 0.06;
        (rob.jet.material as import('three').SpriteMaterial).opacity = 0.7 + Math.sin(t * 9) * 0.25;
        let ouvert = 1;
        if (t > prochainClin) {
          const d = t - prochainClin;
          ouvert = d < 0.14 ? 0.1 : 1;
          if (d > 0.18) prochainClin = t + 2.5 + Math.random() * 3;
        }
        rob.visage(expr.current, ouvert, regard.x, regard.y);
        r.render(scene, cam);
      };
      boucle();
      nettoyer = () => {
        cancelAnimationFrame(raf);
        ro.disconnect();
        io.disconnect();
        window.removeEventListener('pointermove', suivre);
        r.dispose();
        r.domElement.remove();
      };
    })();
    return () => {
      arret = true;
      nettoyer();
    };
  }, []);

  return <div ref={hote} className={className} role="img" aria-label={titre} />;
}
