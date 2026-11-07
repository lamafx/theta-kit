import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import Labo from '@/components/Labo';
import { dictMoteur, liens, THEMES } from '@/lib/liens';
import labos from '@/contenu/labos.json';

export const dynamicParams = false;
export const metadata: Metadata = { title: 'Labo 3D' };
export function generateStaticParams() {
  return ['fr', 'en'].flatMap((locale) => THEMES.map((theme) => ({ locale, theme })));
}

export default async function Page({ params }: { params: Promise<{ locale: string; theme: string }> }) {
  const { locale, theme } = await params;
  if (!THEMES.includes(theme)) notFound();
  setRequestLocale(locale);
  return <Labo locale={locale} dict={dictMoteur(locale)} href={liens(locale)} labos={labos} theme={theme} />;
}
