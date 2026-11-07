import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { CONTACT } from '@/lib/profil';
import Logo from './Logo';
import LangSwitch from './LangSwitch';

export default function Footer() {
  const t = useTranslations('footer');
  const n = useTranslations('nav');
  const locale = useLocale();
  const accueil = `/${locale}`;
  return (
    <footer className="ft">
      <div className="ft-in">
        <div className="ft-top">
          <div className="ft-brand">
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none', color: '#F5F8FC' }}>
              <Logo sombre />
              <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 30, lineHeight: 1 }}>Théta</span>
            </Link>
            <div className="ft-sig">{t('baseline_1')} <i>{t('baseline_2')}</i></div>
            <div style={{ fontSize: 15, lineHeight: 1.6 }}>{t('texte')} <span style={{ color: '#4C8DFF' }}>#ThetaML</span></div>
            <LangSwitch sombre />
          </div>
          <div className="ft-cols">
            <div className="ft-col">
              <span className="ft-h">{t('serie')}</span>
              <a href={`${accueil}#carrousels`}>{n('carrousels')}</a>
              <Link href="/voyage">{t('voyage')}</Link>
              <Link href="/labo">{n('labo')}</Link>
              <a href={`${accueil}#inscription`}>{t('recevoir')}</a>
            </div>
            <div className="ft-col">
              <span className="ft-h">{t('auteur')}</span>
              <Link href="/profil">{n('profil')}</Link>
              <a href={CONTACT.linkedin} target="_blank" rel="noopener">LinkedIn ↗</a>
              <a href={CONTACT.github} target="_blank" rel="noopener">GitHub ↗</a>
              <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
            </div>
            <div className="ft-col">
              <span className="ft-h">{t('infos')}</span>
              <Link href="/confidentialite">{t('confidentialite')}</Link>
              <Link href="/mentions-legales">{t('mentions')}</Link>
              <a href={`mailto:${CONTACT.email}?subject=D%C3%A9sinscription%20%CE%B8%20Th%C3%A9ta`}>{t('desinscrire')}</a>
            </div>
          </div>
        </div>
        <div className="ft-word" aria-hidden="true">Théta</div>
        <div className="ft-bar">
          <span>{t('copyright', { annee: new Date().getFullYear() })}</span>
          <a className="ft-up" href="#">{t('haut')}</a>
        </div>
      </div>
    </footer>
  );
}
