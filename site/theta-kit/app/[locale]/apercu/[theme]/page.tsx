import crypto from 'node:crypto';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import Labo from '@/components/Labo';
import { arbreLabos } from '@/lib/content';
import { dictMoteur, liens, THEMES } from '@/lib/liens';
import labos from '@/contenu/labos.json';

// Aperçu d'un labo encore fermé, réservé à l'auteur : le lien vient de l'admin, signé avec THETA_APERCU_SECRET
// et valable une heure. Sans lien valide, la page n'existe pas. Jamais indexée, jamais comptée.
export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Aperçu du labo', robots: { index: false, follow: false } };

function jetonValide(theme: string, jeton: string | undefined) {
  const secret = process.env.THETA_APERCU_SECRET;
  if (!secret || secret.length < 32 || !jeton) return false;
  const [exp, sig] = jeton.split('.');
  if (!exp || !sig || Number(exp) < Date.now() / 1000) return false;
  const attendu = crypto.createHmac('sha256', secret).update(`${theme}.${exp}`).digest('base64url');
  return attendu.length === sig.length && crypto.timingSafeEqual(Buffer.from(attendu), Buffer.from(sig));
}

export default async function Apercu({ params, searchParams }: { params: Promise<{ locale: string; theme: string }>; searchParams: Promise<{ j?: string }> }) {
  const { locale, theme } = await params;
  const { j } = await searchParams;
  if (!THEMES.includes(theme) || !jetonValide(theme, j)) notFound();
  setRequestLocale(locale);
  const noms = await getTranslations('labo.themes');
  const { arbre, ouverts } = arbreLabos(locale, (id) => noms(id as never));
  // Dans l'aperçu, le labo demandé s'ouvre comme s'il était publié ; les autres gardent leur état.
  const arbreApercu = arbre.map((s) => ({ ...s, chapitres: s.chapitres.map((c) => ({ ...c, labos: c.labos.map((l) => (l.id === theme ? { ...l, ouvert: true } : l)) })) }));
  return <Labo locale={locale} dict={dictMoteur(locale)} href={liens(locale)} labos={labos} arbre={arbreApercu} ouverts={[...new Set([...ouverts, theme])]} theme={theme} apercu />;
}
