'use client';

import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useEngine } from '@/lib/useEngine';
import { frTypo } from '@/lib/typo';

/** Relie un moteur porté à sa vue : traduction, navigation, rendu. */
export function useMoteur(Moteur: any, { dict, ...p }: any) {
  const t = useTranslations();
  const router = useRouter();
  const tr = (s: string) => (p.locale === 'en' ? dict?.[s] ?? s : frTypo(s));
  const v = useEngine(Moteur, { ...p, tr, nav: (h: string) => router.push(h), prefetch: () => router.prefetch(p.href.voyage) });
  return { v, t: (k: string, a?: any) => t(k as never, a) };
}
