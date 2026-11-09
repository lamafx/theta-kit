import type { MetadataRoute } from 'next';

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://theta-ml.vercel.app';

export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: '*', allow: '/', disallow: ['/api/', '/admin', '/fr/apercu/', '/en/apercu/'] }, sitemap: `${SITE}/sitemap.xml` };
}
