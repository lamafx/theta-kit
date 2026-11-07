import { getTranslations, setRequestLocale } from 'next-intl/server';
import Accueil from '@/components/Accueil';
import { dateLisible, episodesParus, estOuvert, prochain, serie, vuDe } from '@/lib/content';
import { dictMoteur, liens, THEMES } from '@/lib/liens';

export const revalidate = 1800;

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const href = liens(locale);
  const parus = episodesParus();
  const suite = prochain();
  const carte = (e: (typeof parus)[number]) => {
    const v = vuDe(e, locale);
    const th = estOuvert(e) ? v.themes[0] : undefined;
    return { n: e.n, group: v.chapitre, t1: v.t1, t2: v.t2, text: v.accroche, cover: e.pret ? `/covers/theta-${e.n}.webp` : undefined, pages: e.nb_pages, theme: th, labHref: th ? `${href.labo}/${th}` : undefined };
  };
  const cartes: any[] = parus.map(carte);
  if (suite) {
    cartes.push({ ...carte(suite), bientot: suite.date ? t('commun.bientot', { date: dateLisible(suite.date, locale) }) : t('carrousels.bientot') });
  }
  cartes.push({ n: 'G', guide: true, group: t('guide.groupe'), t1: t('guide.t1'), t2: t('guide.t2'), text: t('guide.texte') });
  const nbEps = cartes.filter((c) => !c.guide).length;
  return (
    <>
      <Accueil
        locale={locale}
        dict={dictMoteur(locale)}
        cards={cartes}
        href={href}
        hrefConf={`${href.accueil}/confidentialite`}
        nbLabos={THEMES.length}
        total={serie.total}
        rythme={serie.posts_par_semaine}
        prochain={suite ? t('carrousels.prochain_court', { n: suite.n, titre: vuDe(suite, locale).titre }) : ''}
        portes={t('portail.portes', { n: nbEps + 3 })}
        nbEps={t('portail.episodes', { n: nbEps })}
        inscription={process.env.NEXT_PUBLIC_INSCRIPTION_ACTIVE === '1'}
      />
    </>
  );
}
