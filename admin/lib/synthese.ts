import 'server-only';
import { avance, estPublie, laboOuvert, prochainPost } from './donnees';
import type { Donnees } from './types';

/** Les chiffres du tableau de bord et des pastilles, tirés de l'instantané (et de l'état en direct). */
export function synthese(d: Donnees, maintenant = new Date()) {
  const eps = d.episodes ?? [];
  const publies = eps.filter(estPublie);
  const aRelire = eps.filter((e) => e.statut === 'genere');
  // Produits mais pas encore générés : l'épisode attend la relecture du relecteur (Claude) avant la vôtre.
  const enProduction = eps.filter((e) => e.statut === 'a_faire' && e.a_refaire.length && e.a_refaire.length < 9);
  const relusAvance = avance(eps);
  const prochain = prochainPost(eps);
  const labos = d.labos ?? [];
  const ouverts = labos.filter((l) => laboOuvert(l.date_ouverture, l.publie_le, maintenant));
  const prets = labos.filter((l) => l.scene && l.parcours && l.quiz);
  const aFinir = labos.filter((l) => l.scene && !(l.parcours && l.quiz));
  const aConcevoir = labos.filter((l) => !l.scene);
  const recetteAFaire = labos.filter((l) => {
    if (l.recette?.validee_le || laboOuvert(l.date_ouverture, l.publie_le, maintenant) || !l.date_ouverture) return false;
    const j = (new Date(l.date_ouverture).getTime() - maintenant.getTime()) / 86400000;
    return j <= 7;
  });
  const decisionsOuvertes = (d.decisions ?? []).filter((x) => x.choix?.statut !== 'tranchee');
  const jetonJours = d.publication?.jeton_expire ? Math.ceil((new Date(`${d.publication.jeton_expire}T00:00:00Z`).getTime() - maintenant.getTime()) / 86400000) : null;
  return {
    total: eps.length,
    publies,
    aRelire,
    enProduction,
    relusAvance,
    avanceMin: d.calendrier?.avance_min ?? 4,
    prochain,
    labos: { tous: labos, ouverts, prets, aFinir, aConcevoir, recetteAFaire },
    decisionsOuvertes,
    jetonJours,
  };
}

export type Synthese = ReturnType<typeof synthese>;
