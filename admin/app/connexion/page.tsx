import type { Metadata } from 'next';
import Connexion from './Connexion';

export const metadata: Metadata = { title: 'Connexion' };

export default async function Page({ searchParams }: { searchParams: Promise<{ suite?: string }> }) {
  const { suite } = await searchParams;
  const sure = suite && suite.startsWith('/') && !suite.startsWith('//') ? suite : '/';
  return <Connexion suite={sure} configure={!!process.env.ADMIN_MOT_DE_PASSE_HASH && !!process.env.ADMIN_SECRET} />;
}
