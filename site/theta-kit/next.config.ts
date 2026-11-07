import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const cache = 'public, max-age=3600, stale-while-revalidate=86400';
const config: NextConfig = {
  reactStrictMode: false,
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
