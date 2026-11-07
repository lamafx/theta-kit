'use client';

import { useLocale, useTranslations } from 'next-intl';
import { usePathname as chemin } from 'next/navigation';

export default function LangSwitch({ sombre = false }: { sombre?: boolean }) {
  const locale = useLocale();
  const t = useTranslations('commun');
  const actuel = chemin();
  return (
    <span className={`lang${sombre ? ' lang-sombre' : ''}`} role="group" aria-label={t('langue')}>
      {(['fr', 'en'] as const).map((l) => (
        <a key={l} href={actuel.replace(/^\/(fr|en)/, `/${l}`)} aria-current={l === locale ? 'true' : undefined} hrefLang={l}>
          {l.toUpperCase()}
        </a>
      ))}
    </span>
  );
}
