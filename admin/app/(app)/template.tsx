/** Chaque page entre en fondu léger : le template est remonté à chaque navigation. */
export default function Gabarit({ children }: { children: React.ReactNode }) {
  return <div className="page-entree">{children}</div>;
}
