// Lecture d'un export « Post analytics » de LinkedIn (.xlsx, bouton « Exporter » des statistiques d'un post).
// Sans dépendance : un .xlsx est un zip de XML ; DecompressionStream('deflate-raw') existe dans les navigateurs
// récents et dans Node 18+. Utilisé par l'admin (import, dans le navigateur) et par scripts/importer-exports.mjs.

export type ExportLinkedIn = {
  /** Identifiant du post (le nombre de urn:li:ugcPost:… ou urn:li:activity:…), clé du fichier enregistré. */
  id: string;
  urn: string;
  url: string;
  publie_le: string | null; // AAAA-MM-JJ
  heure: string | null; // « 9:48 AM », heure de l'ordinateur qui a exporté
  releve_le: string; // date du téléchargement de l'export (AAAA-MM-JJ)
  chiffres: Partial<Record<CleChiffre, number>>;
  /** Par catégorie (poste, lieu, secteur, entreprise, ancienneté, taille d'entreprise) : [valeur, part en %]. */
  demographie: Partial<Record<CleDemo, [string, number][]>>;
};

export const CHIFFRES = {
  impressions: 'Impressions',
  membres_atteints: 'Members reached',
  vues_profil: 'Profile viewers from this post',
  abonnes: 'Followers gained from this post',
  interactions: 'Social engagements',
  reactions: 'Reactions',
  commentaires: 'Comments',
  partages: 'Reposts',
  enregistrements: 'Saves',
  envois: 'Sends on LinkedIn',
  clics_lien: 'Link engagements',
} as const;
export type CleChiffre = keyof typeof CHIFFRES;

export const DEMOS = {
  poste: 'Job title',
  lieu: 'Location',
  secteur: 'Industry',
  entreprise: 'Company',
  anciennete: 'Seniority',
  taille: 'Company size',
} as const;
export type CleDemo = keyof typeof DEMOS;

export const NOMS_CHIFFRES: Record<CleChiffre, string> = {
  impressions: 'Impressions', membres_atteints: 'Membres atteints', vues_profil: 'Vues du profil', abonnes: 'Abonnés gagnés',
  interactions: 'Interactions', reactions: 'Réactions', commentaires: 'Commentaires', partages: 'Republications',
  enregistrements: 'Enregistrements', envois: 'Envois', clics_lien: 'Clics sur un lien',
};
export const NOMS_DEMOS: Record<CleDemo, string> = {
  poste: 'Postes', lieu: 'Lieux', secteur: 'Secteurs', entreprise: 'Entreprises', anciennete: 'Ancienneté', taille: 'Taille d’entreprise',
};

const u16 = (b: Uint8Array, i: number) => b[i] | (b[i + 1] << 8);
const u32 = (b: Uint8Array, i: number) => (b[i] | (b[i + 1] << 8) | (b[i + 2] << 16) | (b[i + 3] << 24)) >>> 0;

/** Les fichiers d'un zip (répertoire central), décompressés à la demande. */
async function dezipper(octets: Uint8Array, voulus: (nom: string) => boolean): Promise<Map<string, string>> {
  let fin = -1;
  for (let i = octets.length - 22; i >= Math.max(0, octets.length - 65557); i--) {
    if (u32(octets, i) === 0x06054b50) { fin = i; break; }
  }
  if (fin < 0) throw new Error('fichier illisible : ce n’est pas un .xlsx');
  const total = u16(octets, fin + 10);
  let p = u32(octets, fin + 16);
  const sortie = new Map<string, string>();
  for (let k = 0; k < total; k++) {
    if (u32(octets, p) !== 0x02014b50) throw new Error('zip abîmé');
    const methode = u16(octets, p + 10);
    const taille = u32(octets, p + 20);
    const lnom = u16(octets, p + 28), lext = u16(octets, p + 30), lcom = u16(octets, p + 32);
    const local = u32(octets, p + 42);
    const nom = new TextDecoder().decode(octets.subarray(p + 46, p + 46 + lnom));
    p += 46 + lnom + lext + lcom;
    if (!voulus(nom)) continue;
    const debut = local + 30 + u16(octets, local + 26) + u16(octets, local + 28);
    const brut = octets.subarray(debut, debut + taille);
    let donnees: Uint8Array;
    if (methode === 0) donnees = brut;
    else if (methode === 8) {
      const flux = new Blob([brut as BlobPart]).stream().pipeThrough(new DecompressionStream('deflate-raw'));
      donnees = new Uint8Array(await new Response(flux).arrayBuffer());
    } else throw new Error(`compression ${methode} non prise en charge`);
    sortie.set(nom, new TextDecoder().decode(donnees));
  }
  return sortie;
}

const entites = (s: string) =>
  s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n))).replace(/&amp;/g, '&');
const textes = (xml: string) => [...xml.matchAll(/<t[^>]*>([\s\S]*?)<\/t>/g)].map((m) => entites(m[1])).join('');

/** Les lignes de la première feuille, en texte. */
export async function lignesXlsx(octets: Uint8Array): Promise<string[][]> {
  const f = await dezipper(octets, (n) => n === 'xl/sharedStrings.xml' || /^xl\/worksheets\/sheet1\.xml$/.test(n));
  const partages = [...(f.get('xl/sharedStrings.xml') ?? '').matchAll(/<si>([\s\S]*?)<\/si>/g)].map((m) => textes(m[1]));
  const feuille = f.get('xl/worksheets/sheet1.xml');
  if (!feuille) throw new Error('feuille absente');
  return [...feuille.matchAll(/<row[^>]*>([\s\S]*?)<\/row>/g)].map((r) =>
    [...r[1].matchAll(/<c([^>]*?)(?:\/>|>([\s\S]*?)<\/c>)/g)].map((c) => {
      const type = /\bt="([^"]+)"/.exec(c[1])?.[1];
      const corps = c[2] ?? '';
      if (type === 'inlineStr') return textes(corps);
      const v = /<v>([\s\S]*?)<\/v>/.exec(corps)?.[1];
      if (v === undefined) return '';
      return type === 's' ? partages[Number(v)] ?? '' : entites(v);
    }).filter((x) => x !== ''),
  ).filter((l) => l.length);
}

/** « 11/10/2026 » (mois/jour/année, export en anglais) → 2026-11-10. */
function dateUs(s: string | undefined): string | null {
  const m = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(s?.trim() ?? '');
  return m ? `${m[3]}-${m[1].padStart(2, '0')}-${m[2].padStart(2, '0')}` : null;
}

const nombreDe = (s: string) => {
  const v = Number(String(s).replace(/[\s,  ]/g, ''));
  return Number.isFinite(v) ? v : null;
};
/** « 4% » → 4 ; « < 1% » → 0,5. */
const partDe = (s: string) => (/^<\s*1\s*%$/.test(s.trim()) ? 0.5 : nombreDe(s.replace('%', '')));

export async function lireExport(octets: Uint8Array, releveLe: string): Promise<ExportLinkedIn> {
  const lignes = await lignesXlsx(octets);
  const champ = new Map<string, string>();
  for (const l of lignes) if (l.length === 2 && !champ.has(l[0])) champ.set(l[0], l[1]);
  const url = champ.get('Post URL') ?? '';
  const m = /(ugcPost|activity|share)[-:](\d{15,22})/.exec(url);
  if (!m) throw new Error('pas un export de statistiques d’un post LinkedIn (« Post URL » absent)');
  const chiffres: ExportLinkedIn['chiffres'] = {};
  for (const [cle, libelle] of Object.entries(CHIFFRES) as [CleChiffre, string][]) {
    const v = champ.has(libelle) ? nombreDe(champ.get(libelle)!) : null;
    if (v !== null) chiffres[cle] = v;
  }
  const demographie: ExportLinkedIn['demographie'] = {};
  const parLibelle = new Map(Object.entries(DEMOS).map(([k, v]) => [v as string, k as CleDemo]));
  for (const l of lignes) {
    const cle = l.length === 3 ? parLibelle.get(l[0]) : undefined;
    const part = cle ? partDe(l[2]) : null;
    if (cle && part !== null) (demographie[cle] ??= []).push([l[1], part]);
  }
  return {
    id: m[2],
    urn: `urn:li:${m[1]}:${m[2]}`,
    url: url.split('?')[0],
    publie_le: dateUs(champ.get('Post Date')),
    heure: champ.get('Post Publish Time') ?? null,
    releve_le: releveLe,
    chiffres,
    demographie,
  };
}
