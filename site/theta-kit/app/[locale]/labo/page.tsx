import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Labo from '@/components/Labo';
import { arbreLabos } from '@/lib/content';
import { dictMoteur, liens } from '@/lib/liens';
import labos from '@/contenu/labos.json';

export const revalidate = 1800;
export const metadata: Metadata = { title: 'Labo 3D' };

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('labo.themes');
  const { arbre, ouverts } = arbreLabos(locale, (id) => t(id as never));
  return <Labo locale={locale} dict={dictMoteur(locale)} href={liens(locale)} labos={labos} arbre={arbre} ouverts={ouverts} theme={ouverts[ouverts.length - 1] ?? 'exemples'} />;
}
