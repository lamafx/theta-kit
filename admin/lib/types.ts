// Forme de .instantane/donnees.json (scripts/instantane.mjs).

export type Statut = 'a_faire' | 'genere' | 'relu' | 'publie' | 'mesure';

export type Episode = {
  n: string;
  saison: number;
  chapitre: { numero: number; titre: string };
  titre: string;
  accroche: string;
  statut: Statut;
  publie_le: string | null;
  date_prevue: string | null;
  date_txt: string | null;
  a_refaire: { etape: string; raison: string }[];
  themes: string[];
  pdf: string | null;
  pages: string[];
  post: { titre: string | null; texte: string | null; commentaire: string | null; provisoire: boolean };
  verification: { resultat: string; erreurs: string[]; avertissements: string[] } | null;
  corrections: string | null;
  decisions: string[];
  trace: { lien: string | null; publie_a: string | null; commentaire: string | null } | null;
  mesures: Record<string, any> | null;
};

export type Bilan = {
  cle: string;
  saison: number;
  statut: Statut;
  publie_le: string | null;
  date_prevue: string | null;
  pdf: string | null;
  pages?: string[];
  post?: { titre: string | null; texte: string | null };
  trace?: { lien: string | null; publie_a: string | null } | null;
};

export type Recette = { cases?: Record<string, boolean>; validee_le?: string | null; note?: string | null };

export type Labo = {
  id: string;
  n: string;
  titre: string;
  scene: boolean;
  parcours: boolean;
  quiz: boolean;
  conception: string | null;
  date_ouverture: string | null;
  publie_le: string | null;
  recette: Recette | null;
};

export type GroupeRecette = { titre: string; cases: { id: string; texte: string }[] };

export type Decision = {
  id: string;
  famille: 'relecture' | 'labos' | 'ambiguite' | 'admin';
  code: string;
  titre: string;
  contexte: string;
  recommandation: string;
  options: string[];
  source: string;
  episode?: string;
  statut_source?: string;
  choix: { statut: 'tranchee' | 'plus_tard'; choix?: string; note?: string; le?: string } | null;
};

export type FichierProfil = { chemin: string; sha: string | null; contenu: any };

export type Donnees = {
  indisponible?: boolean;
  genere_le: string;
  commit: string | null;
  commit_date: string | null;
  calendrier: { lancement: string | null; fuseau: string; avance_min: number; reports: Record<string, string> };
  episodes: Episode[];
  bilans: Bilan[];
  labos: Labo[];
  recette_modele: GroupeRecette[];
  decisions: Decision[];
  publication: { pilote: string; jeton_expire: string | null; journal: GesteJournal[] };
  profil: Record<'profil' | 'parcours' | 'certificats' | 'projets' | 'sections', FichierProfil>;
  cv: { chemin: string; taille: number; sha: string | null; modifie_le: string | null } | null;
  certificats_fichiers: string[];
  /** Exports LinkedIn importés (serie-ml/mesures/linkedin/<id>.yaml), du plus récent au plus ancien. */
  linkedin?: PostLinkedin[];
};

export type PostLinkedin = {
  id: string;
  urn: string;
  url: string;
  publie_le: string | null;
  heure: string | null;
  /** « 01 », « bilan-1 », ou null pour un post hors série. */
  episode: string | null;
  releves: { releve_le: string; chiffres: Partial<Record<import('./export-linkedin').CleChiffre, number>> }[];
  demographie?: Partial<Record<import('./export-linkedin').CleDemo, [string, number][]>>;
  demographie_du?: string;
};

export type GesteJournal = { le: string; geste: string; cible?: string; valeur?: string; resultat?: string; tournee?: string };
