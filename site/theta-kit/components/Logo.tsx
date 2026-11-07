export default function Logo({ sombre = false, taille = 20 }: { sombre?: boolean; taille?: number }) {
  return (
    <svg viewBox="-330 -470 660 940" width={taille} height={taille * 1.45} aria-hidden="true">
      <g transform="skewX(-12)">
        <path fillRule="evenodd" d="M-270 0 a270 420 0 1 0 540 0 a270 420 0 1 0 -540 0 Z M-176 0 a176 368 0 1 0 352 0 a176 368 0 1 0 -352 0 Z" fill={sombre ? '#F5F8FC' : '#0A0F17'} />
        <rect x="-178" y="-26" width="356" height="52" fill={sombre ? '#4C8DFF' : '#1C46C9'} />
      </g>
    </svg>
  );
}
