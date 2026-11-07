'use client';

import { useEffect, useState } from 'react';

const ACCENT: Record<number, string> = { 1: '#4C8DFF', 2: '#9CC6FF', 3: '#D9A066', 4: '#CFE0FF' };

/** Choix du labo : saisons, chapitres, puis labos, avec la date d'ouverture de ceux qui sont fermés. */
export default function LaboMenu({ v, t }: { v: any; t: (k: string, a?: any) => string }) {
  const [ouvert, setOuvert] = useState(false);
  const labos = v.arbre.flatMap((s: any) => s.chapitres.flatMap((c: any) => c.labos.map((l: any) => ({ ...l, saison: s.saison }))));
  const dispo = labos.filter((l: any) => l.ouvert);
  const actuel = labos.find((l: any) => l.id === v.actuel) ?? dispo[0];
  const i = dispo.findIndex((l: any) => l.id === actuel?.id);

  useEffect(() => {
    if (!ouvert) return;
    const fermer = (e: KeyboardEvent) => { if (e.key === 'Escape') setOuvert(false); };
    window.addEventListener('keydown', fermer);
    return () => window.removeEventListener('keydown', fermer);
  }, [ouvert]);

  const choisir = (id: string) => { setOuvert(false); v.pick(id); };
  return (
    <div className="lbm" style={{ ['--saison' as any]: ACCENT[actuel?.saison ?? 1] }}>
      <button type="button" className="lbm-fl" disabled={i <= 0} onClick={() => choisir(dispo[i - 1].id)} aria-label={t('labo.prec')}>‹</button>
      <button type="button" className="lbm-btn" aria-expanded={ouvert} onClick={() => setOuvert(!ouvert)}>
        <span className="lbm-s">{t('labo.saison_n', { n: actuel?.saison ?? 1 })}</span>
        <span className="lbm-t">Nº {actuel?.n} · {actuel?.titre}</span>
        <span className="lbm-c" aria-hidden="true">▾</span>
      </button>
      <button type="button" className="lbm-fl" disabled={i < 0 || i >= dispo.length - 1} onClick={() => choisir(dispo[i + 1].id)} aria-label={t('labo.suiv')}>›</button>
      {ouvert && (
        <>
          <button type="button" className="lbm-fond" aria-label={t('commun.fermer')} onClick={() => setOuvert(false)} />
          <div className="lbm-panneau" role="dialog" aria-label={t('labo.choisir')}>
            <div className="lbm-tete">
              <b>{t('labo.choisir')}</b>
              <button type="button" onClick={() => setOuvert(false)} aria-label={t('commun.fermer')}>×</button>
            </div>
            {v.arbre.map((s: any) => (
              <details key={s.saison} open={s.saison === (actuel?.saison ?? 1)} style={{ ['--saison' as any]: ACCENT[s.saison] }}>
                <summary>
                  <span>{t('labo.saison_n', { n: s.saison })}</span>
                  <small>{s.nbOuverts > 0 ? t('labo.ouverts', { n: s.nbOuverts }) : t('labo.a_venir')}</small>
                </summary>
                {s.chapitres.map((c: any) => (
                  <div className="lbm-chap" key={c.titre}>
                    <h3>{c.titre}</h3>
                    {c.labos.map((l: any) => l.ouvert ? (
                      <button type="button" key={l.id} className="lbm-l" aria-current={l.id === actuel?.id ? 'true' : undefined} onClick={() => choisir(l.id)}>
                        <span>Nº {l.n}</span>{l.titre}
                      </button>
                    ) : (
                      <div className="lbm-l lbm-ferme" key={l.id}>
                        <span>Nº {l.n}</span>{l.titre}<em>{l.quand ? t('labo.ouvre_le', { date: l.quand }) : t('labo.a_venir')}</em>
                      </div>
                    ))}
                  </div>
                ))}
              </details>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
