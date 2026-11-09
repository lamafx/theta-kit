import type { NextConfig } from 'next';

// L'admin est servi sous theta-ml.vercel.app/admin : le site public réécrit /admin/* vers ce projet
// (multi-zones Vercel). basePath garde les mêmes adresses des deux côtés.
const config: NextConfig = {
  basePath: '/admin',
  reactStrictMode: true,
  poweredByHeader: false,
  serverExternalPackages: ['pdfjs-dist', 'web-push'],
  // Les routes qui servent les fichiers de la série lisent l'instantané fait au build.
  outputFileTracingIncludes: {
    '/api/fichier': ['./.instantane/fichiers/**/*'],
    '/**': ['./.instantane/donnees.json'],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Robots-Tag', value: 'noindex, nofollow, noarchive' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'same-origin' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
      { source: '/sw.js', headers: [{ key: 'Cache-Control', value: 'no-cache' }, { key: 'Service-Worker-Allowed', value: '/admin/' }] },
    ];
  },
};
export default config;
