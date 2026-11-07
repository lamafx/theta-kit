import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Voyage from '@/components/Voyage';
import { dateLisible, estParu, prochain, serie, vuDe } from '@/lib/content';
import { dictMoteur, liens } from '@/lib/liens';
import { CONTACT } from '@/lib/profil';

export const revalidate = 1800;
export const metadata: Metadata = { title: 'Voyage 3D' };

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const href = liens(locale);
  const suite = prochain();
  const visibles = serie.episodes.filter((e) => estParu(e) || e === suite);
  const titreLabo = (id: string) => t(`labo.themes.${id}` as never);
  const chapitres: any[] = [
    { id: 'intro', nav: 'Intro', num: 'θ', group: t('voyage.intro_groupe'), t1: t('footer.baseline_1'), t2: t('footer.baseline_2'), text: t('voyage.intro_text'), side: -1, robot: 1 },
    ...visibles.map((e, i) => {
      const v = vuDe(e, locale);
      const paru = estParu(e);
      const labos = v.themes.map((id) => ({ href: `${href.labo}/${id}`, label: v.themes.length > 1 ? `${t('voyage.manipuler')} : ${titreLabo(id)}` : t('voyage.manipuler'), theme: id, primary: true }));
      const links = paru ? [...labos, { href: `${href.accueil}/episodes/${e.n}`, label: t('voyage.episode') }] : labos;
      return {
        ep: e.n, nav: e.n, num: `Nº ${e.n}`, group: v.chapitre, t1: v.t1, t2: v.t2, text: v.accroche, formula: v.formule,
        side: i % 2 ? -1 : 1, v: v.v, links,
        soon: paru ? undefined : e.date ? t('voyage.bientot', { date: dateLisible(e.date, locale) }) : t('carrousels.bientot'),
      };
    }),
    { id: 'guide', nav: t('voyage.guide_nav'), num: t('voyage.bonus'), group: t('guide.groupe'), t1: t('guide.t1'), t2: t('guide.t2'), text: t('guide.texte'), side: -1, links: [{ href: `${href.accueil}#inscription`, label: t('guide.cta'), primary: true }] },
    { id: 'auteur', nav: t('voyage.auteur_nav'), num: t('voyage.fin'), group: t('voyage.auteur_groupe'), t1: 'Ladji Lama', t2: 'Kamagate', text: t('voyage.auteur_text'), side: 1, robot: -1, soon: t('voyage.stage'), links: [{ href: `mailto:${CONTACT.email}`, label: t('voyage.contact_btn'), primary: true }, { href: href.labo, label: t('voyage.labo_btn') }] },
  ];
  return <Voyage locale={locale} dict={dictMoteur(locale)} chapters={chapitres} href={href} />;
}
