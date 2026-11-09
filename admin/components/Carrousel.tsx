'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { B } from '@/lib/format';

/** Les pages du carrousel, au glissé comme sur LinkedIn ; un toucher ouvre le plein écran. */
export default function Carrousel({ pages, titre }: { pages: string[]; titre: string }) {
  const [plein, setPlein] = useState<number | null>(null);
  const bande = useRef<HTMLDivElement>(null);
  const src = (p: string) => `${B}/api/fichier?chemin=${encodeURIComponent(p)}`;

  useEffect(() => {
    if (plein === null) return;
    const el = bande.current?.children[plein] as HTMLElement | undefined;
    el?.scrollIntoView({ inline: 'center', block: 'nearest' });
    const touche = (e: KeyboardEvent) => e.key === 'Escape' && setPlein(null);
    window.addEventListener('keydown', touche);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', touche);
      document.body.style.overflow = '';
    };
  }, [plein]);

  if (!pages.length) return <p className="vide">Pas encore de pages rendues.</p>;
  return (
    <>
      <div className="carrousel" role="list" aria-label={`Pages de ${titre}`}>
        {pages.map((p, i) => (
          <img key={p} role="listitem" src={src(p)} alt={`Page ${i + 1} sur ${pages.length}`} loading={i < 2 ? 'eager' : 'lazy'} onClick={() => setPlein(i)} />
        ))}
      </div>
      <p className="petit discret" style={{ margin: 0 }}>
        {pages.length} pages · touchez une page pour l’agrandir.
      </p>
      {plein !== null ? createPortal(
        <div className="plein-ecran" role="dialog" aria-modal="true" aria-label={titre}>
          <div className="barre">
            <span className="mono petit">{titre}</span>
            <button className="btn btn-petit" onClick={() => setPlein(null)} autoFocus>
              Fermer
            </button>
          </div>
          <div className="carrousel" ref={bande}>
            {pages.map((p, i) => (
              <img key={p} src={src(p)} alt={`Page ${i + 1} sur ${pages.length}`} />
            ))}
          </div>
        </div>,
        document.body,
      ) : null}
    </>
  );
}
