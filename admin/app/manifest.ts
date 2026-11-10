import type { MetadataRoute } from 'next';

// Manifeste de la PWA : il ne vaut que pour /admin, le site public n'est pas installable par lui.
export default function manifest(): MetadataRoute.Manifest {
  return {
    id: '/admin/',
    name: 'θ Admin · Théta',
    short_name: 'θ Admin',
    description: 'Espace d’administration de la série θ Théta.',
    start_url: '/admin/',
    scope: '/admin/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#F5F8FC',
    theme_color: '#F5F8FC',
    lang: 'fr',
    icons: [
      { src: '/admin/icones/icone-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/admin/icones/icone-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/admin/icones/icone-masquable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
    shortcuts: [
      { name: 'Épisodes à relire', url: '/admin/episodes?filtre=a-relire' },
      { name: 'Salle de publication', url: '/admin/publication' },
      { name: 'Statistiques', url: '/admin/stats' },
    ],
  };
}
