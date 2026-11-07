import moteurEn from '@/messages/moteur.en.json';

export function liens(locale: string) {
  return { accueil: `/${locale}`, labo: `/${locale}/labo`, voyage: `/${locale}/voyage`, profil: `/${locale}/profil` };
}

/** Dictionnaire des moteurs : en français, la clé est le texte. */
export const dictMoteur = (locale: string) => (locale === 'en' ? moteurEn : undefined);

export const THEMES = ['exemples', 'donnees', 'familles', 'modele', 'cout', 'derivee', 'gradient', 'descente', 'minilots', 'minlocaux', 'selle', 'regression'];
