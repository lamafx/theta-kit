'use client';

import { TunnelEngine } from '@/lib/engines/tunnel';
import { useMoteur } from './Moteur';
import TunnelView from './views/TunnelView';
import '@/styles/voyage.css';

export default function Voyage(p: any) {
  const { v, t } = useMoteur(TunnelEngine, p);
  return (
    <>
      {!v.noGL && <TunnelView v={v} t={t} />}
      {v.noGL && (
        <div className="tn-liste">
          <a href={p.href.accueil}>← {t('commun.accueil')}</a>
          <h1>{t('voyage.liste_titre')}</h1>
          <p>{t('voyage.liste_intro')}</p>
          <ol>
            {p.chapters.filter((c: any) => c.ep).map((c: any) => (
              <li key={c.ep}>
                {c.links?.[0] ? <a href={c.links[0].href}>{c.num} · {c.t1} {c.t2}</a> : <span>{c.num} · {c.t1} {c.t2}</span>}
                <small>{c.text}</small>
              </li>
            ))}
          </ol>
        </div>
      )}
    </>
  );
}
