'use client';

import { useState } from 'react';

// Éditeur générique des fichiers du profil (data/*.json du site) : il suit la forme des données
// (textes FR et EN côte à côte, listes, interrupteurs) sans rien supprimer de ce qu'il ne connaît pas.

type Chemin = (string | number)[];
type Props = {
  valeur: any;
  surChange: (chemin: Chemin, v: any) => void;
  surDepot?: (chemin: Chemin, fichier: File) => void;
};

const LIBELLES: Record<string, string> = {
  nom: 'Nom', prenom_affiche: 'Prénom affiché', nom_affiche: 'Nom affiché', photo: 'Photo', titre: 'Titre', accroche: 'Accroche',
  en_une_phrase: 'En une phrase', recherche: 'Ce que je recherche', statut: 'Statut', lieu: 'Lieu', mots_cles: 'Mots-clés',
  compteurs: 'Compteurs', contact: 'Contact', langues: 'Langues', boite_a_outils: 'Boîte à outils', email: 'E-mail', linkedin: 'LinkedIn',
  github: 'GitHub', ancien_portfolio: 'Ancien portfolio', cv: 'CV', annee: 'Année', actuel: 'Étape actuelle', t: 'Titre', d: 'Description',
  id: 'Identifiant', type: 'Type', rang: 'Rang', date: 'Date', image: 'Image', fichier: 'Fichier (PDF ou image)', emetteur: 'Émetteur',
  competences: 'Compétences', desc: 'Description', vedette: 'À la une', n: 'Numéro', tags: 'Étiquettes', resultat: 'Résultat',
  notion: 'Notion', outils: 'Outils', points: 'Points', valeur: 'Valeur', suffixe: 'Suffixe', texte: 'Texte',
};
const lib = (k: string | number) => (typeof k === 'number' ? `Nº ${k + 1}` : LIBELLES[k] ?? k.replace(/_/g, ' '));

const estFrEn = (v: any) => v && typeof v === 'object' && !Array.isArray(v) && 'fr' in v && 'en' in v && Object.keys(v).length <= 3;
const listeTextes = (v: any) => Array.isArray(v) && v.every((x) => typeof x === 'string');

/** Signaux de typographie (règles de la série) : apostrophe droite, tiret long, anglais manquant. */
export function signaux(fr: string, en?: string) {
  const s: string[] = [];
  if (/'/.test(fr)) s.push('apostrophe droite (’ attendue)');
  if (/—/.test(fr) || (en && /—/.test(en))) s.push('tiret long interdit');
  if (fr.trim() && en !== undefined && !en.trim()) s.push('anglais manquant');
  return s;
}

function Texte({ v, set, long, label }: { v: string; set: (v: string) => void; long?: boolean; label: string }) {
  return long ? (
    <textarea className="zone" style={{ minHeight: 84 }} value={v} aria-label={label} onChange={(e) => set(e.target.value)} />
  ) : (
    <input className="entree" value={v} aria-label={label} onChange={(e) => set(e.target.value)} />
  );
}

function resume(o: any): string {
  if (!o || typeof o !== 'object') return String(o ?? '');
  const t = o.titre?.fr ?? o.fr?.t ?? o.t ?? o.titre ?? o.fr ?? o.id ?? o.texte ?? o.n;
  return typeof t === 'string' ? t : JSON.stringify(o).slice(0, 60);
}

function vider(o: any): any {
  if (typeof o === 'string') return '';
  if (typeof o === 'number') return 0;
  if (typeof o === 'boolean') return false;
  if (Array.isArray(o)) return [];
  if (o && typeof o === 'object') return Object.fromEntries(Object.entries(o).map(([k, v]) => [k, vider(v)]));
  return null;
}

export function Champ({ cle, v, chemin, surChange, surDepot }: { cle: string | number; v: any; chemin: Chemin } & Omit<Props, 'valeur'>) {
  const label = lib(cle);
  const set = (x: any) => surChange(chemin, x);
  if (cle === '_note') return null;

  if (estFrEn(v) && typeof v.fr === 'string') {
    const long = (v.fr?.length ?? 0) > 70 || (v.en?.length ?? 0) > 70;
    const sig = signaux(v.fr, v.en);
    return (
      <div className="champ">
        <span>{label}</span>
        <div className="duo">
          <Texte v={v.fr} long={long} label={`${label} (français)`} set={(x) => set({ ...v, fr: x })} />
          <Texte v={v.en} long={long} label={`${label} (anglais)`} set={(x) => set({ ...v, en: x })} />
        </div>
        {sig.length ? <span className="signal">{sig.join(' · ')}</span> : null}
      </div>
    );
  }
  if (estFrEn(v) && listeTextes(v.fr)) {
    return (
      <div className="champ">
        <span>{label} · une ligne par point</span>
        <div className="duo">
          <textarea className="zone" value={v.fr.join('\n')} aria-label={`${label} (français)`} onChange={(e) => set({ ...v, fr: e.target.value.split('\n') })} />
          <textarea className="zone" value={(v.en ?? []).join('\n')} aria-label={`${label} (anglais)`} onChange={(e) => set({ ...v, en: e.target.value.split('\n') })} />
        </div>
      </div>
    );
  }
  if (typeof v === 'string' || v === null) {
    const s = v ?? '';
    const depot = surDepot && (cle === 'image' || cle === 'fichier' || cle === 'photo');
    const sig = typeof cle === 'string' && !['id', 'email', 'linkedin', 'github', 'cv', 'image', 'fichier', 'photo', 'ancien_portfolio', 'date', 'type'].includes(cle) ? signaux(s) : [];
    return (
      <label className="champ">
        <span>{label}</span>
        <Texte v={s} long={s.length > 90} label={label} set={(x) => set(v === null && x === '' ? null : x)} />
        {depot ? (
          <input
            type="file"
            accept={cle === 'fichier' ? 'application/pdf,image/*' : 'image/*'}
            className="petit"
            onChange={(e) => e.target.files?.[0] && surDepot!(chemin, e.target.files[0])}
            aria-label={`Déposer ${label.toLowerCase()}`}
          />
        ) : null}
        {sig.length ? <span className="signal">{sig.join(' · ')}</span> : null}
      </label>
    );
  }
  if (typeof v === 'boolean') {
    return (
      <div className="champ" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button type="button" className="bascule" role="switch" aria-checked={v} aria-label={label} onClick={() => set(!v)} />
        <span style={{ textTransform: 'none', letterSpacing: 0, fontFamily: 'inherit', fontSize: 14, color: 'var(--white)' }}>{label}</span>
      </div>
    );
  }
  if (typeof v === 'number') {
    return (
      <label className="champ">
        <span>{label}</span>
        <input className="entree" type="number" value={v} onChange={(e) => set(Number(e.target.value))} />
      </label>
    );
  }
  if (listeTextes(v)) {
    return (
      <label className="champ">
        <span>{label} · une par ligne</span>
        <textarea className="zone" style={{ minHeight: 70 }} value={v.join('\n')} onChange={(e) => set(e.target.value.split('\n'))} />
      </label>
    );
  }
  if (Array.isArray(v)) return <Liste cle={cle} v={v} chemin={chemin} surChange={surChange} surDepot={surDepot} />;
  if (v && typeof v === 'object') {
    return (
      <fieldset style={{ border: '1px solid var(--ligne)', borderRadius: 14, padding: '12px 14px', margin: '0 0 14px' }}>
        <legend className="sur" style={{ padding: '0 6px', margin: 0 }}>{label}</legend>
        {Object.entries(v).map(([k, x]) => (
          <Champ key={k} cle={k} v={x} chemin={[...chemin, k]} surChange={surChange} surDepot={surDepot} />
        ))}
      </fieldset>
    );
  }
  return null;
}

function Liste({ cle, v, chemin, surChange, surDepot }: { cle: string | number; v: any[]; chemin: Chemin } & Omit<Props, 'valeur'>) {
  const [ouvert, setOuvert] = useState<number | null>(null);
  const deplacer = (i: number, d: number) => {
    const j = i + d;
    if (j < 0 || j >= v.length) return;
    const n = [...v];
    [n[i], n[j]] = [n[j], n[i]];
    surChange(chemin, n);
    setOuvert(j);
  };
  return (
    <div className="champ">
      <span>{lib(cle)} · {v.length}</span>
      <div className="sections-liste">
        {v.map((x, i) => (
          <div key={i} className="carte" style={{ padding: 12 }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
              <button type="button" className="btn btn-petit" onClick={() => setOuvert(ouvert === i ? null : i)} aria-expanded={ouvert === i} style={{ flex: 1, justifyContent: 'flex-start', minWidth: 0 }}>
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{resume(x) || `Élément ${i + 1}`}</span>
              </button>
              <button type="button" className="btn btn-petit" aria-label="Monter" onClick={() => deplacer(i, -1)} disabled={i === 0}>↑</button>
              <button type="button" className="btn btn-petit" aria-label="Descendre" onClick={() => deplacer(i, 1)} disabled={i === v.length - 1}>↓</button>
              <button
                type="button"
                className="btn btn-petit"
                aria-label="Supprimer"
                onClick={() => confirm(`Supprimer « ${resume(x)} » ?`) && surChange(chemin, v.filter((_, k) => k !== i))}
              >
                ✕
              </button>
            </div>
            {ouvert === i ? (
              <div style={{ marginTop: 12 }}>
                {x && typeof x === 'object' ? (
                  Object.entries(x).map(([k, y]) => <Champ key={k} cle={k} v={y} chemin={[...chemin, i, k]} surChange={surChange} surDepot={surDepot} />)
                ) : (
                  <Champ cle={i} v={x} chemin={[...chemin, i]} surChange={surChange} surDepot={surDepot} />
                )}
              </div>
            ) : null}
          </div>
        ))}
      </div>
      <button
        type="button"
        className="btn btn-petit"
        style={{ marginTop: 10, alignSelf: 'flex-start' }}
        onClick={() => {
          surChange(chemin, [...v, v.length ? vider(v[0]) : '']);
          setOuvert(v.length);
        }}
      >
        + Ajouter
      </button>
    </div>
  );
}
