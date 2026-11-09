import Link from 'next/link';
import { Carte, Entete } from '@/components/Bloc';
import { IcDecisions, IcProfil, IcSalle } from '@/components/Icones';
import Appareil from './Appareil';

export const metadata = { title: 'Plus' };

export default function Plus() {
  return (
    <>
      <Entete sur="θ Admin" titre={<>Plus</>} />
      <div className="grille">
        <Carte className="c12">
          <nav className="lignes">
            <Link href="/decisions"><IcDecisions /><span className="titre">Décisions</span><span className="fin discret">›</span></Link>
            <Link href="/publication"><IcSalle /><span className="titre">Salle de publication</span><span className="fin discret">›</span></Link>
            <Link href="/profil"><IcProfil /><span className="titre">Profil et CV</span><span className="fin discret">›</span></Link>
          </nav>
        </Carte>
        <Carte className="c12" titre="Cet appareil">
          <Appareil vapid={process.env.NEXT_PUBLIC_VAPID_PUBLIC ?? ''} />
        </Carte>
      </div>
    </>
  );
}
