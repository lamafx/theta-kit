/** Le θ en anneaux de la page profil du site, en filigrane derrière les bandeaux de nuit. */
export default function Anneaux() {
  return (
    <svg className="anneaux" viewBox="-330 -470 660 940" aria-hidden="true">
      <g transform="skewX(-12)" fill="none" stroke="#FFFFFF" strokeWidth="6">
        <ellipse rx="270" ry="420" />
        <ellipse rx="176" ry="368" />
        <path d="M-176 -26 H176 M-176 26 H176" />
      </g>
      <ellipse rx="318" ry="160" fill="none" stroke="#D9A066" strokeWidth="2" transform="rotate(-18)" />
    </svg>
  );
}
