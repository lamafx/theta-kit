// Les gestes de l'admin : ce que chacun lance, et les confirmations qu'il exige.
// Série : workflow admin.yml (admin/outils/geste.py, qui appelle la CLI `serie`).
// LinkedIn : workflow linkedin.yml, qui garde le groupe de concurrence « linkedin » (jamais deux tournées).

export type CleGeste =
  | 'valider' | 'corriger' | 'recette' | 'trancher' | 'mesurer'
  | 'etat' | 'apercu'
  | 'essai' | 'tourner' | 'publier' | 'supprimer' | 'pilote' | 'reporter';

export type DefGeste = {
  libelle: string;
  workflow: 'admin.yml' | 'linkedin.yml';
  /** Sensible : salle de publication, phrase à taper et délai d'annulation. */
  sensible: boolean;
  phrase?: (cible: string, valeur: string) => string;
  effet?: string;
};

export const GESTES: Record<CleGeste, DefGeste> = {
  valider: { libelle: 'Valider (relu)', workflow: 'admin.yml', sensible: false },
  corriger: { libelle: 'À corriger', workflow: 'admin.yml', sensible: false },
  recette: { libelle: 'Recette du labo', workflow: 'admin.yml', sensible: false },
  trancher: { libelle: 'Trancher une décision', workflow: 'admin.yml', sensible: false },
  mesurer: { libelle: 'Chiffres LinkedIn', workflow: 'admin.yml', sensible: false },
  etat: { libelle: 'État de la connexion LinkedIn', workflow: 'linkedin.yml', sensible: false },
  apercu: { libelle: 'Aperçu du prochain post', workflow: 'linkedin.yml', sensible: false },
  essai: {
    libelle: 'Essai réel (post de test supprimé aussitôt)', workflow: 'linkedin.yml', sensible: true, phrase: () => 'ESSAI',
    effet: 'Un post de test, visible par vos relations seulement, est publié puis supprimé aussitôt.',
  },
  tourner: {
    libelle: 'Tourner maintenant', workflow: 'linkedin.yml', sensible: true, phrase: () => 'TOURNER',
    effet: 'La tournée part tout de suite : elle publie le post dû s’il l’est (heure passée depuis moins de 2 heures), sinon rien.',
  },
  publier: {
    libelle: 'Publier ce post maintenant', workflow: 'linkedin.yml', sensible: true, phrase: (c) => `PUBLIER ${c}`,
    effet: 'Le post part sur LinkedIn maintenant, hors calendrier (cas d’un post manqué). Il passe à « publié » et son labo s’ouvre.',
  },
  supprimer: {
    libelle: 'Supprimer le post publié', workflow: 'linkedin.yml', sensible: true, phrase: (c) => `SUPPRIMER ${c}`,
    effet: 'Le post et son premier commentaire sont supprimés de LinkedIn. L’épisode revient à « relu » ; il faudra le republier à la main.',
  },
  pilote: {
    libelle: 'Changer le pilote', workflow: 'admin.yml', sensible: true, phrase: (_c, v) => `PILOTE ${v.toUpperCase()}`,
    effet: 'Change qui fait la tournée (GitHub Actions ou le PC Windows). L’autre côté ne publie plus rien.',
  },
  reporter: {
    libelle: 'Reporter ou avancer', workflow: 'admin.yml', sensible: true, phrase: (c) => `REPORTER ${c}`,
    effet: 'La date de l’épisode change (calendrier.yaml, publier/NN/date.txt, site). Les autres épisodes ne bougent pas.',
  },
};

export const DELAI_ANNULATION = 10;
