'use client';

import { useLocale, useTranslations } from 'next-intl';
import { usePathname } from '@/i18n/navigation';

const ICONES: Record<string, string> = {
  accueil: 'M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z',
  episodes: 'M12 3 2 8.5 12 14l10-5.5L12 3zM2 13.5 12 19l10-5.5',
  voyage: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM15.5 8.5l-2 5-5 2 2-5z',
  labo: 'M9.5 3h5M10 3v6.2L4.8 18a2 2 0 0 0 1.7 3h11a2 2 0 0 0 1.7-3L14 9.2V3M7.5 15h9',
  profil: 'M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4.5 21a7.5 7.5 0 0 1 15 0',
};

/** Navigation du téléphone : les cinq destinations, toujours à portée de pouce. */
export default function BarreMobile() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const chemin = usePathname();
  const liens = [
    { id: 'accueil', href: `/${locale}`, actif: chemin === '/' },
    { id: 'episodes', href: `/${locale}#carrousels`, actif: chemin.startsWith('/episodes') },
    { id: 'voyage', href: `/${locale}/voyage`, actif: chemin.startsWith('/voyage') },
    { id: 'labo', href: `/${locale}/labo`, actif: chemin.startsWith('/labo') },
    { id: 'profil', href: `/${locale}/profil`, actif: chemin.startsWith('/profil') },
  ];
  return (
    <nav className="bm" aria-label={t('menu')}>
      {liens.map((l) => (
        <a key={l.id} href={l.href} aria-current={l.actif ? 'page' : undefined} aria-label={t(`barre_${l.id}` as never)}>
          <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={ICONES[l.id]} /></svg>
          {l.actif && <span>{t(`barre_${l.id}` as never)}</span>}
        </a>
      ))}
    </nav>
  );
}
