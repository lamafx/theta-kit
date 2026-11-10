import Link from 'next/link';
import Anneaux from '@/components/Anneaux';

export const metadata = { title: 'Hors ligne' };

export default function HorsLigne() {
  return (
    <main className="connexion">
      <Anneaux />
      <div className="boite">
        <p className="sur">θ Admin</p>
        <h1>
          Hors <em>ligne</em>
        </h1>
        <p className="chapeau" style={{ margin: '12px auto 22px' }}>
          Cette page n’a pas encore été ouverte sur cet appareil. Les pages déjà vues restent lisibles sans réseau ; aucun geste ne part hors ligne.
        </p>
        <Link className="btn btn-plein" href="/">
          Réessayer
        </Link>
      </div>
    </main>
  );
}
