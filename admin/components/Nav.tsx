'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { IcAccueil, IcCloche, IcDecisions, IcEpisodes, IcLabos, IcPlus, IcProfil, IcSalle, IcStats } from './Icones';

type Props = { pastilles: Partial<Record<string, number>>; version: string };

const LIENS = [
  { href: '/', label: 'Accueil', Ic: IcAccueil, cle: 'accueil' },
  { href: '/episodes', label: 'Épisodes', Ic: IcEpisodes, cle: 'episodes' },
  { href: '/labos', label: 'Labos', Ic: IcLabos, cle: 'labos' },
  { href: '/stats', label: 'Stats', Ic: IcStats, cle: 'stats' },
  { href: '/decisions', label: 'Décisions', Ic: IcDecisions, cle: 'decisions', large: true },
  { href: '/publication', label: 'Salle de publication', Ic: IcSalle, cle: 'publication', large: true },
  { href: '/profil', label: 'Profil et CV', Ic: IcProfil, cle: 'profil', large: true },
  { href: '/plus', label: 'Appareil et session', Ic: IcCloche, cle: 'plus', large: true },
];

export default function Nav({ pastilles, version }: Props) {
  const chemin = usePathname();
  const actif = (href: string) => (href === '/' ? chemin === '/' : chemin.startsWith(href));
  const plusActif = ['/decisions', '/publication', '/profil', '/plus'].some((h) => chemin.startsWith(h));
  const totalPlus = (pastilles.decisions ?? 0) + (pastilles.publication ?? 0) + (pastilles.profil ?? 0);
  return (
    <nav className="nav" aria-label="Navigation de l’admin">
      <Link href="/" className="nav-marque">
        <b>θ Théta</b>
        <span>Admin</span>
      </Link>
      {LIENS.map(({ href, label, Ic, cle, large }) => (
        <Link key={href} href={href} className={`nav-lien${large ? ' nav-large' : ''}`} aria-current={actif(href) ? 'page' : undefined}>
          <Ic />
          <span>{label}</span>
          {pastilles[cle] ? <span className="nav-pastille">{pastilles[cle]}</span> : null}
        </Link>
      ))}
      <Link href="/plus" className="nav-lien nav-plus" aria-current={plusActif ? 'page' : undefined}>
        <IcPlus />
        <span>Plus</span>
        {totalPlus ? <span className="nav-pastille">{totalPlus}</span> : null}
      </Link>
      <div className="nav-bas">{version}</div>
    </nav>
  );
}
