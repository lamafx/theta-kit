import sections from '@/data/sections.json';

/** Les sections connues de la page profil (components/views/ProfilView.tsx), dans leur ordre d'origine. */
export const SECTIONS = ['episode', 'projets', 'preuves', 'parcours', 'outils', 'contact'] as const;

/** L'ordre choisi dans l'admin, sans les sections masquées ; une section absente du fichier garde sa place à la fin. */
export function ordreSections(): string[] {
  const choisi = (sections.ordre as string[]).filter((s) => (SECTIONS as readonly string[]).includes(s));
  const complet = [...choisi, ...SECTIONS.filter((s) => !choisi.includes(s))];
  return complet.filter((s) => !(sections.masquees as string[]).includes(s));
}
