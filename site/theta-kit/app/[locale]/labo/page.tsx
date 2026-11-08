import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Labo from '@/components/Labo';
import PageSimple from '@/components/PageSimple';
import { Link } from '@/i18n/navigation';
import { arbreLabos, dateLisible, laboDuMoment, prochain } from '@/lib/content';
import { dictMoteur, liens } from '@/lib/liens';
import labos from '@/contenu/labos.json';

export const revalidate = 1800;
export const metadata: Metadata = { title: 'Labo 3D' };

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('labo');
  const noms = await getTranslations('labo.themes');
  const { arbre, ouverts } = arbreLabos(locale, (id) => noms(id as never));
  const theme = laboDuMoment(ouverts);
  if (!theme) {
    // Aucun épisode paru : aucun labo ouvert (décision du 2026-11-08).
    const suite = prochain();
    return (
      <PageSimple retour={t('aucun_retour')}>
        <article className="ep">
          <p className="ep-sur">{t('saison_n', { n: 1 })}</p>
          <h1>{t('aucun_titre')}</h1>
          <p className="ep-acc">{t('aucun_texte')}</p>
          {suite?.date && <p className="ep-note">{t('aucun_date', { n: suite.n, date: dateLisible(suite.date, locale) })}</p>}
          <div className="ep-btns"><Link className="btn btn-plein" href="/">{t('aucun_retour')}</Link></div>
        </article>
      </PageSimple>
    );
  }
  return <Labo locale={locale} dict={dictMoteur(locale)} href={liens(locale)} labos={labos} arbre={arbre} ouverts={ouverts} theme={theme} />;
}
