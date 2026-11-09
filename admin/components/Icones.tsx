// Icônes au trait, dessinées pour l'admin (1,7 px, coins arrondis).
const p = { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true };

export const IcAccueil = () => (<svg {...p}><path d="M4 11.5 12 5l8 6.5" /><path d="M6 10v9h12v-9" /><path d="M10 19v-5h4v5" /></svg>);
export const IcEpisodes = () => (<svg {...p}><rect x="4" y="3.5" width="12" height="15" rx="2" /><path d="M8 21h10a2 2 0 0 0 2-2V7" /><path d="M7.5 8h5M7.5 11.5h5" /></svg>);
export const IcLabos = () => (<svg {...p}><path d="M12 3 4 7.5v9L12 21l8-4.5v-9z" /><path d="M4 7.5 12 12l8-4.5M12 12v9" /></svg>);
export const IcStats = () => (<svg {...p}><path d="M4 20V10M10 20V4M16 20v-7M21 20H3" /></svg>);
export const IcPlus = () => (<svg {...p}><circle cx="5.5" cy="12" r="1.3" /><circle cx="12" cy="12" r="1.3" /><circle cx="18.5" cy="12" r="1.3" /></svg>);
export const IcDecisions = () => (<svg {...p}><path d="M12 3v18M5 7h14" /><path d="M5 7 2.5 13a3 3 0 0 0 5 0zM19 7l-2.5 6a3 3 0 0 0 5 0z" /></svg>);
export const IcSalle = () => (<svg {...p}><rect x="4.5" y="10.5" width="15" height="10" rx="2.5" /><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" /><path d="M12 14.5v2.5" /></svg>);
export const IcProfil = () => (<svg {...p}><circle cx="12" cy="8.5" r="3.8" /><path d="M4.5 20.5a7.5 7.5 0 0 1 15 0" /></svg>);
export const IcPdf = () => (<svg {...p}><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" /><path d="M14 3v5h5M9 13h6M9 16.5h4" /></svg>);
export const IcExterne = () => (<svg {...p} width={16} height={16}><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" /></svg>);
export const IcCloche = () => (<svg {...p}><path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15z" /><path d="M10 20.5a2 2 0 0 0 4 0" /></svg>);
export const IcSortie = () => (<svg {...p}><path d="M14 4h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-4M10 16l-4-4 4-4M6 12h10" /></svg>);
export const IcRetour = () => (<svg {...p}><path d="M15 5 8 12l7 7" /></svg>);
