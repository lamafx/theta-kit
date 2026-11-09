// Garde-fou : le téléphone de l'auteur n'apparaît jamais sur le site ni dans le CV public
// (site/theta-kit/CLAUDE.md, section 1). Repère tout ce qui ressemble à un numéro de téléphone.

const CANDIDAT = /(?:\+|00)?\d[\d\s.\-()/  ]{6,}\d/g;

/** Les numéros de téléphone probables d'un texte (au moins 8 chiffres, hors années et plages d'années). */
export function telephones(texte: string): string[] {
  const out = new Set<string>();
  for (const m of texte.matchAll(CANDIDAT)) {
    const brut = m[0];
    const chiffres = brut.replace(/\D/g, '');
    if (chiffres.length < 8 || chiffres.length > 15) continue;
    // « 2023 2026 », « 2025-2026 » : des années, pas un numéro.
    const groupes = brut.split(/[^\d]+/).filter(Boolean);
    if (groupes.every((g) => /^(19|20)\d\d$/.test(g))) continue;
    // Dates internes des PDF (D:AAAAMMJJhhmmss) et coordonnées (« 0 0 612 792 ») : pas des numéros.
    if (/^(19|20)\d{12}$/.test(chiffres) && groupes.length === 1) continue;
    if (groupes.filter((g) => g.length === 1).length >= 2) continue;
    // Montants et grands nombres écrits à la française (« 1 919 », « 2 041 ») : groupes de 3 après le premier.
    if (groupes.length > 1 && groupes.slice(1).every((g) => g.length === 3) && groupes[0].length <= 3 && !/^(\+|00)/.test(brut)) continue;
    out.add(brut.trim());
  }
  return [...out];
}

/** Cherche un numéro dans toutes les chaînes d'une valeur JSON. */
export function telephonesJson(valeur: unknown, chemin = ''): { chemin: string; numero: string }[] {
  if (typeof valeur === 'string') return telephones(valeur).map((numero) => ({ chemin, numero }));
  if (Array.isArray(valeur)) return valeur.flatMap((v, i) => telephonesJson(v, `${chemin}[${i}]`));
  if (valeur && typeof valeur === 'object') return Object.entries(valeur).flatMap(([k, v]) => telephonesJson(v, chemin ? `${chemin}.${k}` : k));
  return [];
}
