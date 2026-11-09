import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono, Instrument_Serif } from 'next/font/google';
import Fond3D from '@/components/Fond3D';
import EnregistrerSW from '@/components/EnregistrerSW';
import '@/styles/admin.css';

const sans = Geist({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });
const mono = Geist_Mono({ subsets: ['latin'], variable: '--font-mono', display: 'swap' });
const serif = Instrument_Serif({ subsets: ['latin'], weight: '400', style: ['normal', 'italic'], variable: '--font-serif', display: 'swap' });

export const metadata: Metadata = {
  title: { default: 'θ Admin', template: '%s · θ Admin' },
  description: 'Espace d’administration de la série θ Théta.',
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
  appleWebApp: { capable: true, title: 'θ Admin', statusBarStyle: 'black-translucent' },
  icons: { icon: '/admin/icones/icone.svg', apple: '/admin/icones/apple-touch.png' },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = { themeColor: '#0A0F17', width: 'device-width', initialScale: 1, viewportFit: 'cover' };

export default function Racine({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${sans.variable} ${mono.variable} ${serif.variable}`}>
      <body>
        <Fond3D />
        {children}
        <EnregistrerSW />
      </body>
    </html>
  );
}
