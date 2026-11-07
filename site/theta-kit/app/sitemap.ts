import type { MetadataRoute } from 'next';
import { episodesParus } from '@/lib/content';

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://theta-ml.vercel.app';
export const revalidate = 3600;

export default function sitemap(): MetadataRoute.Sitemap {
  const chemins = ['', '/voyage', '/labo', '/profil', '/confidentialite', '/mentions-legales', ...episodesParus().map((e) => `/episodes/${e.n}`)];
  return chemins.map((c) => ({
    url: `${SITE}/fr${c}`,
    alternates: { languages: { fr: `${SITE}/fr${c}`, en: `${SITE}/en${c}` } },
  }));
}
