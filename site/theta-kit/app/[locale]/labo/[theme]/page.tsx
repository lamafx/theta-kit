import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Labo from '@/components/Labo';
import PageSimple from '@/components/PageSimple';
import { Link } from '@/i18n/navigation';
import { arbreLabos, labo } from '@/lib/content';
import { dictMoteur, liens, THEMES } from '@/lib/liens';
import labos from '@/contenu/labos.json';

export const revalidate = 1800;
export const dynamicParams = false;
export const metadata: Metadata = { title: 'Labo 3D' };
export function generateStaticParams() {
  return ['fr', 'en'].flatMap((locale) => THEMES.map((theme) => ({ locale, theme })));
}

export default async function Page({ params }: { params: Promise<{ locale: string; theme: string }> }) {
  const { locale, theme } = await params;
  if (!THEMES.includes(theme)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations('labo');
  const noms = await getTranslations('labo.themes');
  const { arbre, ouverts } = arbreLabos(locale, (id) => noms(id as never));
  if (!ouverts.includes(theme)) {
    const info = labo(arbre, theme);
    return (
      <PageSimple retour={t('aucun_retour')}>
        <article className="ep">
          <p className="ep-sur">{t('saison_n', { n: info?.saison ?? 1 })} · Nº {info?.n}</p>
          <h1>{info?.titre}</h1>
          <p className="ep-acc">{t('verrou_titre')}</p>
          <p className="ep-note">{info?.quand ? t('verrou_texte', { date: info.quand }) : t('verrou_sans')}</p>
          <div className="ep-btns">{ouverts.length > 0
            ? <Link className="btn btn-plein" href="/labo">{t('retour')}</Link>
            : <Link className="btn btn-plein" href="/">{t('aucun_retour')}</Link>}</div>
        </article>
      </PageSimple>
    );
  }
  return <Labo locale={locale} dict={dictMoteur(locale)} href={liens(locale)} labos={labos} arbre={arbre} ouverts={ouverts} theme={theme} />;
}
