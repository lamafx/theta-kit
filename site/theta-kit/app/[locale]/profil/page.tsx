import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import Profil from '@/components/Profil';
import { dictMoteur, liens } from '@/lib/liens';
import { CONTACT, donneesProfil } from '@/lib/profil';

export const metadata: Metadata = { title: 'Ladji Lama Kamagate' };

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const d = donneesProfil(locale === 'en' ? 'en' : 'fr');
  return <Profil locale={locale} dict={dictMoteur(locale)} href={liens(locale)} cv={CONTACT.cv} {...d} />;
}
