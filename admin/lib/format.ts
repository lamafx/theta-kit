// Mise en forme en français, heure d'Abidjan (UTC toute l'année).
export const B = '/admin';

const TZ = 'Africa/Abidjan';

export function dateLongue(iso: string | null | undefined, avecHeure = true) {
  if (!iso) return '—';
  const d = new Date(iso.length === 10 ? `${iso}T12:00:00Z` : iso);
  const jour = new Intl.DateTimeFormat('fr-FR', { weekday: 'short', day: 'numeric', month: 'long', timeZone: TZ }).format(d);
  if (!avecHeure || iso.length === 10) return jour;
  const h = new Intl.DateTimeFormat('fr-FR', { hour: 'numeric', minute: '2-digit', timeZone: TZ }).format(d).replace(':', ' h ').replace(' h 00', ' h');
  return `${jour}, ${h}`;
}

export function dateCourte(iso: string | null | undefined) {
  if (!iso) return '—';
  const d = new Date(iso.length === 10 ? `${iso}T12:00:00Z` : iso);
  return new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short', timeZone: TZ }).format(d);
}

/** « dans 19 h », « dans 3 jours », « il y a 2 h ». */
export function relatif(iso: string | null | undefined, maintenant = Date.now()) {
  if (!iso) return '';
  const ms = new Date(iso).getTime() - maintenant;
  const a = Math.abs(ms);
  const m = Math.round(a / 60000);
  const h = Math.round(a / 3600000);
  const j = Math.round(a / 86400000);
  const v = m < 60 ? `${m} min` : h < 36 ? `${h} h` : `${j} jours`;
  return ms >= 0 ? `dans ${v}` : `il y a ${v}`;
}

export function joursAvant(iso: string | null | undefined, maintenant = Date.now()) {
  if (!iso) return null;
  return Math.ceil((new Date(iso).getTime() - maintenant) / 86400000);
}

export const LIBELLE_STATUT: Record<string, string> = {
  a_faire: 'à produire',
  genere: 'à relire',
  relu: 'relu',
  publie: 'publié',
  mesure: 'mesuré',
};

export function nombre(n: number | null | undefined) {
  if (n == null) return '—';
  return new Intl.NumberFormat('fr-FR').format(n);
}

export function octets(n: number) {
  return n > 1e6 ? `${(n / 1e6).toFixed(1).replace('.', ',')} Mo` : `${Math.round(n / 1e3)} Ko`;
}
