'use client';

/** Parcours guidé d'un labo (décision du 2026-11-08) : une étape à la fois, puis la question du carrousel. */
export default function LaboParcours({ v, t }: { v: any; t: (k: string, a?: any) => string }) {
  const pc = v.pc;
  return (
    <div className="lbp">
      <ol className="lbp-points" aria-label={t('labo.parcours.progression')}>
        {pc.points.map((p: string, i: number) => (
          <li key={i} className={`lbp-point lbp-${p}`} aria-current={p === 'actuel' ? 'step' : undefined}>
            <span className="sr-only">{i < pc.n ? t('labo.parcours.etape_n', { n: i + 1 }) : t('labo.parcours.question')}</span>
          </li>
        ))}
      </ol>

      {pc.etape && (
        <>
          <p className="lbp-sur">{t('labo.parcours.etape_sur', { n: pc.num, total: pc.n })}</p>
          <h2 className="lbp-titre">{pc.titre}</h2>
          <p className="lbp-regarde">{pc.regarde}</p>
          <div className={`lbp-faire${pc.fait ? ' lbp-ok' : ''}`}>
            <span className="lbp-etiq">{pc.fait ? t('labo.parcours.fait') : t('labo.parcours.a_vous')}</span>
            <p>{pc.faire}</p>
          </div>
          {pc.fait ? (
            <div className="lbp-compris" aria-live="polite">
              <span className="lbp-etiq">{t('labo.parcours.compris')}</span>
              <p>{pc.compris}</p>
              <button type="button" className="lbp-btn" onClick={pc.suivant}>{pc.suivantLabel} →</button>
            </div>
          ) : (
            v.msg?.trim() && <p className="lbp-direct" aria-live="polite">{v.msg}</p>
          )}
        </>
      )}

      {pc.quiz && (
        <>
          <p className="lbp-sur">{t('labo.parcours.question')}</p>
          <h2 className="lbp-titre">{pc.question}</h2>
          <div className="lbp-choix" role="group" aria-label={pc.question}>
            {pc.choix.map((c: any, i: number) => (
              <button type="button" key={i} className={`lbp-c${c.etat ? ' lbp-c-' + c.etat : ''}`} onClick={c.fn} disabled={pc.juste} aria-pressed={c.etat ? 'true' : 'false'}>
                {c.t}
              </button>
            ))}
          </div>
          {pc.repondu && (
            <p className={`lbp-retour${pc.juste ? ' lbp-juste' : ''}`} aria-live="polite">{pc.explication}</p>
          )}
          {pc.juste && (
            <div className="lbp-fin">
              <button type="button" className="lbp-btn lbp-btn-sec" onClick={pc.rejouer}>{t('labo.parcours.rejouer')}</button>
              <span>{t('labo.parcours.libre')}</span>
            </div>
          )}
        </>
      )}
    </div>
  );
}
