'use client';

import { useState } from 'react';
import { SuiviGeste } from '@/components/Geste';
import { api } from '@/lib/client';
import { lireExport, type ExportLinkedIn } from '@/lib/export-linkedin';

type Lance = { jeton: string; workflow: string; depuis: string };

/**
 * Déposer un ou plusieurs exports « Post analytics » de LinkedIn (.xlsx) : lus ici, dans le navigateur, puis
 * envoyés aussitôt (geste « importer ») ; rien à saisir. Les gros lots partent en plusieurs gestes (20 000 caractères
 * au plus par geste).
 */
export default function ImportLinkedIn() {
  const [lus, setLus] = useState<ExportLinkedIn[]>([]);
  const [erreurs, setErreurs] = useState<string[]>([]);
  const [lances, setLances] = useState<Lance[]>([]);
  const [envoi, setEnvoi] = useState(false);
  const [survol, setSurvol] = useState(false);

  async function traiter(fichiers: FileList | File[]) {
    const liste = [...fichiers].filter((f) => f.name.toLowerCase().endsWith('.xlsx'));
    if (!liste.length) return setErreurs(['Déposez des fichiers .xlsx exportés depuis les statistiques d’un post LinkedIn.']);
    setEnvoi(true);
    setErreurs([]);
    const ok: ExportLinkedIn[] = [];
    const ko: string[] = [];
    for (const f of liste) {
      try {
        // Le fichier porte la date de son téléchargement : c'est le jour du relevé.
        ok.push(await lireExport(new Uint8Array(await f.arrayBuffer()), new Date(f.lastModified || Date.now()).toISOString().slice(0, 10)));
      } catch (e) {
        ko.push(`${f.name} : ${(e as Error).message}`);
      }
    }
    setLus(ok);
    const lots: ExportLinkedIn[][] = [];
    for (const x of ok) {
      const dernier = lots.at(-1);
      if (dernier && dernier.length < 10 && JSON.stringify({ exports: [...dernier, x] }).length < 18000) dernier.push(x);
      else lots.push([x]);
    }
    const partis: Lance[] = [];
    for (const lot of lots) {
      try {
        partis.push(await api<Lance>('geste', { corps: { geste: 'importer', cible: '', valeur: { exports: lot } } }));
      } catch (e) {
        ko.push(`Envoi refusé : ${(e as Error).message}`);
      }
    }
    setLances(partis);
    setErreurs(ko);
    setEnvoi(false);
  }

  return (
    <div>
      <label
        className={`depot${survol ? ' survol' : ''}`}
        onDragOver={(e) => { e.preventDefault(); setSurvol(true); }}
        onDragLeave={() => setSurvol(false)}
        onDrop={(e) => { e.preventDefault(); setSurvol(false); traiter(e.dataTransfer.files); }}
        style={{ display: 'grid', placeItems: 'center', gap: 6, padding: '22px 16px', border: `1.5px dashed ${survol ? 'var(--panel)' : 'var(--line)'}`, borderRadius: 16, cursor: 'pointer', textAlign: 'center' }}
      >
        <input type="file" accept=".xlsx" multiple hidden onChange={(e) => e.target.files && traiter(e.target.files)} disabled={envoi} />
        <span>{envoi ? <span className="chargement" /> : null} Déposez ici les exports LinkedIn (.xlsx), ou touchez pour les choisir</span>
        <span className="petit discret">Sur LinkedIn : le post › Statistiques › Exporter. Plusieurs fichiers à la fois.</span>
      </label>
      {lus.length ? (
        <ul className="lignes" style={{ marginTop: 12 }}>
          {lus.map((x) => (
            <li key={x.id}>
              <span className="mono petit">{x.publie_le ?? '—'}</span>
              <span className="titre">{new Intl.NumberFormat('fr-FR').format(x.chiffres.impressions ?? 0)} impressions · {x.chiffres.reactions ?? 0} réactions</span>
              <span className="fin petit discret">relevé du {x.releve_le}</span>
            </li>
          ))}
        </ul>
      ) : null}
      {erreurs.map((m, i) => <p key={i} className="message erreur" style={{ marginTop: 10 }}>{m}</p>)}
      {lances.map((l) => <SuiviGeste key={l.jeton} lance={l} />)}
    </div>
  );
}
