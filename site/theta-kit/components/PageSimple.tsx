import type { ReactNode } from 'react';
import { Link } from '@/i18n/navigation';
import Footer from './Footer';
import LangSwitch from './LangSwitch';
import Logo from './Logo';

/** En-tête et pied communs aux pages de lecture : épisodes et textes légaux. */
export default function PageSimple({ retour, children }: { retour: string; children: ReactNode }) {
  return (
    <div className="ps">
      <header className="ps-top">
        <Link href="/" className="ps-logo"><Logo /><span>Théta</span></Link>
        <span className="ps-actions"><LangSwitch /><Link href="/">{retour}</Link></span>
      </header>
      <main className="ps-main">{children}</main>
      <Footer />
    </div>
  );
}
