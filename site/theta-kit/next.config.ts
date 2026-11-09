import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const cache = 'public, max-age=3600, stale-while-revalidate=86400';
// L'admin (dossier admin/ de theta-kit, projet Vercel séparé) est servi sous /admin : multi-zones Vercel.
// Sans ADMIN_ORIGIN (adresse du projet Vercel de l'admin), aucune réécriture : jamais d'adresse devinée.
const ADMIN = process.env.ADMIN_ORIGIN?.replace(/\/$/, '');
const config: NextConfig = {
  reactStrictMode: false,
  async rewrites() {
    return {
      beforeFiles: ADMIN
        ? [
            { source: '/admin', destination: `${ADMIN}/admin` },
            { source: '/admin/:path*', destination: `${ADMIN}/admin/:path*` },
          ]
        : [],
      afterFiles: [],
      fallback: [],
    };
  },
  images: { formats: ['image/avif', 'image/webp'] },
  async headers() {
    return [
      { source: '/(pdf|covers|certificats)/:path*', headers: [{ key: 'Cache-Control', value: cache }] },
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ];
  },
};
export default createNextIntlPlugin('./i18n/request.ts')(config);
