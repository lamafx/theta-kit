const FINE = ' ';
const INSECABLE = ' ';

/** Typographie française : espaces insécables avant ; ? ! : et à l'intérieur des guillemets. Laisse les URL intactes. */
export function frTypo(texte: string): string {
  return texte
    .split(/(https?:\/\/\S+)/)
    .map((morceau, i) =>
      i % 2
        ? morceau
        : morceau
            .replace(/ ([;?!])/g, `${FINE}$1`)
            .replace(/ :/g, `${INSECABLE}:`)
            .replace(/« /g, `«${INSECABLE}`)
            .replace(/ »/g, `${INSECABLE}»`),
    )
    .join('');
}

export function typoProfonde<T>(valeur: T): T {
  if (typeof valeur === 'string') return frTypo(valeur) as T;
  if (Array.isArray(valeur)) return valeur.map(typoProfonde) as T;
  if (valeur && typeof valeur === 'object') {
    return Object.fromEntries(Object.entries(valeur).map(([k, v]) => [k, typoProfonde(v)])) as T;
  }
  return valeur;
}
