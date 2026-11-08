import type { Metadata } from 'next';
import { Geist, Geist_Mono, Instrument_Serif } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import BarreMobile from '@/components/BarreMobile';
import { routing } from '@/i18n/routing';
import '@/styles/commun.css';

const sans = Geist({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });
const mono = Geist_Mono({ subsets: ['latin'], variable: '--font-mono', display: 'swap', preload: false });
const serif = Instrument_Serif({ subsets: ['latin'], weight: '400', style: ['normal', 'italic'], variable: '--font-serif', display: 'swap', preload: false });

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://theta-ml.vercel.app';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });
  return {
    metadataBase: new URL(SITE),
    title: { default: t('title'), template: '%s · θ Théta' },
    description: t('description'),
    alternates: { languages: { fr: '/fr', en: '/en' } },
    openGraph: { title: t('title'), description: t('description'), siteName: 'θ Théta', type: 'website', images: [{ url: `/og/theta-${locale}.png`, width: 1200, height: 627 }] },
  };
}

export default async function Layout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const messages = await getMessages();
  return (
    <html lang={locale} className={`${sans.variable} ${mono.variable} ${serif.variable}`}>
      <body>
        <NextIntlClientProvider messages={messages}>{children}<BarreMobile /></NextIntlClientProvider>
        <Analytics />
      </body>
    </html>
  );
}
