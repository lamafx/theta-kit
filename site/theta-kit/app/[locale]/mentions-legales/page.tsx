import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import PageSimple from '@/components/PageSimple';

export const metadata: Metadata = { title: 'Mentions légales · Legal notice' };

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('legal');
  const c = await getTranslations('commun');
  return (
    <PageSimple retour={c('accueil')}>
      <article className="ep">
        <h1>{t('ment_titre')}</h1>
        <section><h2>{t('ment_h1')}</h2><p>{t('ment_p1')}</p></section>
        <section><h2>{t('ment_h2')}</h2><p>{t('ment_p2')}</p></section>
        <section><h2>{t('ment_h3')}</h2><p>{t('ment_p3')}</p></section>
      </article>
    </PageSimple>
  );
}
