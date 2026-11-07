import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import PageSimple from '@/components/PageSimple';

export const metadata: Metadata = { title: 'Confidentialité · Privacy' };

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('legal');
  const c = await getTranslations('commun');
  return (
    <PageSimple retour={c('accueil')}>
      <article className="ep">
        <h1>{t('conf_titre')}</h1>
        <p className="ep-acc">{t('conf_intro')}</p>
        <section><h2>{t('conf_h1')}</h2><ul><li>{t('conf_l1')}</li><li>{t('conf_l2')}</li><li>{t('conf_l3')}</li></ul></section>
        <section><h2>{t('conf_h2')}</h2><p>{t('conf_p2')}</p></section>
        <section><h2>{t('conf_h3')}</h2><p>{t('conf_p3')}</p></section>
        <section><h2>{t('conf_h4')}</h2><p>{t('conf_p4')}</p></section>
        <section><h2>{t('conf_h5')}</h2><p>{t('conf_p5')}</p></section>
      </article>
    </PageSimple>
  );
}
