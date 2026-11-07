import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import PageSimple from '@/components/PageSimple';
import { Link } from '@/i18n/navigation';
import { dateLisible, estParu, serie, vuDe } from '@/lib/content';
import { frTypo as fr } from '@/lib/typo';

export const revalidate = 1800;
type Params = { params: Promise<{ locale: string; n: string }> };
const trouve = (n: string) => serie.episodes.find((e) => e.n === n && e.pret);

export function generateStaticParams() {
  return ['fr', 'en'].flatMap((locale) => serie.episodes.filter((e) => e.pret).map((e) => ({ locale, n: e.n })));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale, n } = await params;
  const e = trouve(n);
  if (!e) return {};
  const v = vuDe(e, locale);
  const paru = estParu(e);
  return {
    title: `Nº ${n} · ${v.titre}`,
    description: v.accroche,
    robots: paru ? undefined : { index: false },
    alternates: { languages: { fr: `/fr/episodes/${n}`, en: `/en/episodes/${n}` } },
    openGraph: { title: `Nº ${n} · ${v.titre}`, description: v.accroche, type: 'article', images: paru ? [`/covers/theta-${n}.jpg`] : undefined },
  };
}

export default async function Page({ params }: Params) {
  const { locale, n } = await params;
  const e = trouve(n);
  if (!e) notFound();
  setRequestLocale(locale);
  const t = await getTranslations('episode');
  const v = vuDe(e, locale);
  const entete = (
    <>
      <p className="ep-sur">Nº {n} / {serie.total} · {v.chapitre}</p>
      <h1>{v.t1} <em>{v.t2}</em></h1>
      <p className="ep-acc">{v.accroche}</p>
    </>
  );
  if (!estParu(e)) {
    return <PageSimple retour={t('retour')}><article className="ep">{entete}<p className="ep-note">{t('a_venir', { date: dateLisible(e.date!, locale) })}</p></article></PageSimple>;
  }
  const voisins = serie.episodes.filter((x) => estParu(x));
  const i = voisins.findIndex((x) => x.n === n);
  const prec = i > 0 ? voisins[i - 1] : null;
  const suiv = i >= 0 && i < voisins.length - 1 ? voisins[i + 1] : null;
  const ver = e.fin?.verification;
  const reponse = ver ? e.pages?.[ver.page - 2] : null;
  return (
    <PageSimple retour={t('retour')}>
      <article className="ep">
        <div className="ep-haut">
          <div>
            {entete}
            {locale === 'en' && <p className="ep-note">{t('fr_seulement')}</p>}
            <div className="ep-btns">
              <a className="btn btn-plein" href={`/pdf/theta-${n}.pdf`} download={`Theta-${n}.pdf`}>{t('telecharger')}</a>
              {v.themes[0] && <Link className="btn" href={`/labo/${v.themes[0]}`}>{t('labo')}</Link>}
            </div>
          </div>
          <img className="ep-cover" src={`/covers/theta-${n}.webp`} alt={`${t('apercu')} Nº ${n}`} width={1080} height={1350} />
        </div>
        {!!e.fin?.points.length && (
          <section lang="fr"><h2>{t('a_retenir')}</h2><ul>{e.fin.points.map((p) => <li key={p}>{fr(p)}</li>)}</ul></section>
        )}
        {ver && (
          <section lang="fr">
            <h2>{t('verifiez')}</h2>
            <p>{fr(ver.question)}</p>
            {reponse && <details><summary>{t('voir_reponse')}</summary><p>{fr(reponse.texte)}</p></details>}
          </section>
        )}
        {!!e.pages?.length && (
          <section lang="fr">
            <h2>{t('pages')}</h2>
            {e.pages.map((p) => <div className="ep-page" key={p.titre}>{p.role && <span>{p.role}</span>}<h3>{fr(p.titre)}</h3><p>{fr(p.texte)}</p></div>)}
          </section>
        )}
        {e.post && <section lang="fr"><h2>{t('post')}</h2><p className="ep-post">{fr(e.post)}</p></section>}
        {!!e.sources?.length && (
          <section lang="fr"><h2>{t('sources')}</h2><ul>{e.sources.map((s) => <li key={s.url}><a href={s.url} target="_blank" rel="noopener">{s.libelle} ↗</a></li>)}</ul></section>
        )}
        <nav className="ep-nav">
          {prec ? <Link href={`/episodes/${prec.n}`}>← {t('precedent')}</Link> : <span />}
          {suiv ? <Link href={`/episodes/${suiv.n}`}>{t('suivant')} →</Link> : <span />}
        </nav>
      </article>
    </PageSimple>
  );
}
