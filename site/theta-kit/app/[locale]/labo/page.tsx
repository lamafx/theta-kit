import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import Labo from '@/components/Labo';
import { dictMoteur, liens } from '@/lib/liens';
import labos from '@/contenu/labos.json';

export const metadata: Metadata = { title: 'Labo 3D' };

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <Labo locale={locale} dict={dictMoteur(locale)} href={liens(locale)} labos={labos} theme="descente" />;
}
