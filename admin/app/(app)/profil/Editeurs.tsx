'use client';

import { useCallback, useEffect, useState } from 'react';
import { api } from '@/lib/client';
import { B, dateLongue, octets } from '@/lib/format';
import { Champ } from './EditeurJson';

// --- CV ------------------------------------------------------------------------------------------------------
type Analyse = { nbPages: number; lisible: boolean; numeros: string[]; taille: number; extrait: string; ok?: boolean; erreur?: string; commit?: string };

export function EditeurCV({ cv }: { cv: { chemin: string; taille: number; modifie_le: string | null } | null }) {
  const [fichier, setFichier] = useState<File | null>(null);
  const [analyse, setAnalyse] = useState<Analyse | null>(null);
  const [confirme, setConfirme] = useState(false);
  const [envoi, setEnvoi] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);

  async function envoyer(mode: 'verifier' | 'publier', f = fichier) {
    if (!f) return;
    setEnvoi(true);
    setErreur(null);
    const form = new FormData();
    form.set('cv', f);
    form.set('mode', mode);
    if (confirme) form.set('confirme', '1');
    try {
      const r = await fetch('/admin/api/cv', { method: 'POST', body: form, headers: { 'x-theta': '1' } });
      const j = (await r.json()) as Analyse;
      setAnalyse(j);
      if (!r.ok) setErreur(j.erreur ?? `erreur ${r.status}`);
    } catch (e) {
      setErreur((e as Error).message);
    } finally {
      setEnvoi(false);
    }
  }

  return (
    <>
      <p style={{ marginTop: 0 }}>
        CV public actuel : {cv ? `${octets(cv.taille)}, mis à jour ${cv.modifie_le ? `le ${dateLongue(cv.modifie_le, false)}` : '—'}` : 'aucun'}.{' '}
        {cv ? <a href={`${B}/api/fichier?chemin=${encodeURIComponent(cv.chemin)}`} target="_blank" rel="noreferrer">Ouvrir</a> : null}
      </p>
      <p className="petit discret">
        Déposez le PDF exporté de Canva. Il remplace le CV du site sous le même nom : le lien ne change pas. Avant tout envoi, le PDF est fouillé (texte, balises invisibles, métadonnées) : un numéro de téléphone le fait refuser.
      </p>
      <input
        type="file"
        accept="application/pdf"
        className="entree"
        onChange={(e) => {
          const f = e.target.files?.[0] ?? null;
          setFichier(f);
          setAnalyse(null);
          setConfirme(false);
          if (f) envoyer('verifier', f);
        }}
      />
      {envoi ? <p className="message"><span className="chargement" /> Analyse du PDF…</p> : null}
      {erreur ? <p className="message erreur" style={{ marginTop: 12 }}>{erreur}</p> : null}
      {analyse && !erreur && !analyse.commit ? (
        <div className="message ok" style={{ marginTop: 12 }}>
          <p style={{ margin: 0 }}>
            Aucun téléphone trouvé · {analyse.nbPages} page{analyse.nbPages > 1 ? 's' : ''} · {octets(analyse.taille)} · texte {analyse.lisible ? 'lisible' : 'illisible (vectorisé ?)'}.
          </p>
          {analyse.extrait ? <p className="petit" style={{ margin: '6px 0 0', color: 'var(--pale)' }}>« {analyse.extrait}… »</p> : null}
        </div>
      ) : null}
      {analyse && !analyse.numeros.length && !analyse.commit ? (
        <>
          {!analyse.lisible ? (
            <label className="case">
              <input type="checkbox" checked={confirme} onChange={(e) => setConfirme(e.target.checked)} />
              <span>J’ai vérifié à l’œil qu’il n’y a pas de téléphone dans ce CV.</span>
            </label>
          ) : null}
          <button className="btn btn-plein" style={{ marginTop: 12 }} data-geste disabled={envoi || (!analyse.lisible && !confirme)} onClick={() => envoyer('publier')}>
            Publier ce CV sur le site
          </button>
        </>
      ) : null}
      {analyse?.commit ? (
        <p className="message ok" style={{ marginTop: 12 }}>
          CV envoyé. Le site sera à jour après son redéploiement (une à deux minutes). <a href={analyse.commit} target="_blank" rel="noreferrer">Voir le commit</a>
        </p>
      ) : null}
    </>
  );
}

// --- Fichiers du profil ----------------------------------------------------------------------------------------
type Charge = { contenu: any; sha: string | null; source: 'github' | 'instantane' };

function useFichier(fichier: string) {
  const [c, setC] = useState<Charge | null>(null);
  const [erreur, setErreur] = useState<string | null>(null);
  const charger = useCallback(async () => {
    setErreur(null);
    try {
      setC(await api<Charge>(`profil?fichier=${fichier}`));
    } catch (e) {
      setErreur((e as Error).message);
    }
  }, [fichier]);
  useEffect(() => {
    charger();
  }, [charger]);
  return { c, setC, erreur, charger };
}

async function versBase64(f: File, image: boolean): Promise<{ base64: string; ext: string }> {
  if (image && f.type.startsWith('image/')) {
    // Image réduite dans le navigateur avant l'envoi (1 800 px au plus, JPEG).
    const bmp = await createImageBitmap(f);
    const k = Math.min(1, 1800 / Math.max(bmp.width, bmp.height));
    const cv = document.createElement('canvas');
    cv.width = Math.round(bmp.width * k);
    cv.height = Math.round(bmp.height * k);
    cv.getContext('2d')!.drawImage(bmp, 0, 0, cv.width, cv.height);
    const url = cv.toDataURL('image/jpeg', 0.86);
    return { base64: url.split(',')[1], ext: 'jpg' };
  }
  const buf = new Uint8Array(await f.arrayBuffer());
  let s = '';
  for (let i = 0; i < buf.length; i += 0x8000) s += String.fromCharCode(...buf.subarray(i, i + 0x8000));
  return { base64: btoa(s), ext: f.name.split('.').pop()!.toLowerCase() };
}

const slug = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60) || 'fichier';

export function EditeurFichier({ fichier, titre, aide }: { fichier: string; titre: string; aide: string }) {
  const { c, setC, erreur, charger } = useFichier(fichier);
  const [depots, setDepots] = useState<Record<string, string>>({});
  const [modifie, setModifie] = useState(false);
  const [envoi, setEnvoi] = useState(false);
  const [res, setRes] = useState<{ ok?: boolean; erreur?: string; commit?: string; alerte6?: string[] | null; issue?: string | null } | null>(null);

  const surChange = (chemin: (string | number)[], v: any) => {
    setC((avant) => {
      if (!avant) return avant;
      const racine = structuredClone(avant.contenu);
      if (!chemin.length) return { ...avant, contenu: v };
      let o = racine;
      for (const k of chemin.slice(0, -1)) o = o[k];
      o[chemin.at(-1)!] = v;
      return { ...avant, contenu: racine };
    });
    setModifie(true);
    setRes(null);
  };

  const surDepot = async (chemin: (string | number)[], f: File) => {
    const element = chemin.slice(0, -1).reduce((o: any, k) => o?.[k], c?.contenu);
    const base = slug(element?.id ?? f.name.replace(/\.[^.]+$/, ''));
    const champ = chemin.at(-1);
    const { base64, ext } = await versBase64(f, champ !== 'fichier' || f.type.startsWith('image/'));
    const nom = `${base}${champ === 'fichier' && ext === 'pdf' ? '' : champ === 'fichier' ? '-fichier' : ''}.${ext}`;
    setDepots((d) => ({ ...d, [nom]: base64 }));
    surChange(chemin, `/certificats/${nom}`);
  };

  async function enregistrer() {
    if (!c) return;
    setEnvoi(true);
    setRes(null);
    try {
      const r = await api('profil', { corps: { fichier, contenu: c.contenu, sha: c.sha, depots: Object.entries(depots).map(([nom, base64]) => ({ nom, base64 })) } });
      setRes(r);
      setModifie(false);
      setDepots({});
      await charger();
    } catch (e) {
      setRes({ erreur: (e as Error).message });
    } finally {
      setEnvoi(false);
    }
  }

  return (
    <section>
      <h2>{titre}</h2>
      <p className="petit discret" style={{ marginTop: -6 }}>{aide}</p>
      {erreur ? <p className="message erreur">{erreur}</p> : null}
      {!c ? <p className="message"><span className="chargement" /> Chargement…</p> : null}
      {c?.source === 'instantane' ? <p className="message" style={{ marginBottom: 12 }}>Lu dans l’instantané (accès GitHub non configuré) : l’enregistrement sera refusé tant qu’il manque.</p> : null}
      {c?.contenu ? (
        Array.isArray(c.contenu) ? (
          <Champ cle={titre} v={c.contenu} chemin={[]} surChange={surChange} surDepot={surDepot} />
        ) : (
          Object.entries(c.contenu).map(([k, v]) => <Champ key={k} cle={k} v={v} chemin={[k]} surChange={surChange} surDepot={surDepot} />)
        )
      ) : null}
      {Object.keys(depots).length ? <p className="petit signal">Fichiers à envoyer : {Object.keys(depots).join(', ')}</p> : null}
      <div className="btns" style={{ position: 'sticky', bottom: 'calc(var(--nav-h) + 12px)', marginTop: 12 }}>
        <button className="btn btn-plein" data-geste disabled={!modifie || envoi} onClick={enregistrer}>
          {envoi ? <span className="chargement" /> : null} Enregistrer {titre.toLowerCase()}
        </button>
        {modifie ? <button className="btn" onClick={() => { setModifie(false); setDepots({}); charger(); }}>Annuler les changements</button> : null}
      </div>
      {res?.erreur ? <p className="message erreur" style={{ marginTop: 12 }}>{res.erreur}</p> : null}
      {res?.ok ? (
        <p className="message ok" style={{ marginTop: 12 }}>
          Enregistré. Le site sera à jour après son redéploiement. {res.commit ? <a href={res.commit} target="_blank" rel="noreferrer">Voir le commit</a> : null}
        </p>
      ) : null}
      {res?.alerte6 ? (
        <p className="message erreur" style={{ marginTop: 12 }}>
          À reporter dans serie-ml/theta-post/editorial/ligne_editoriale.md §6 : {res.alerte6.join(', ')}. {res.issue ? <a href={res.issue} target="_blank" rel="noreferrer">Issue ouverte</a> : null}
        </p>
      ) : null}
    </section>
  );
}

// --- Sections ------------------------------------------------------------------------------------------------
const NOMS_SECTIONS: Record<string, string> = {
  episode: 'En une phrase',
  projets: 'Projets',
  preuves: 'Certificats et distinctions',
  parcours: 'Parcours',
  outils: 'Outils et engagements',
  contact: 'Contact (CV, LinkedIn, GitHub)',
};
const TOUTES = Object.keys(NOMS_SECTIONS);

export function EditeurSections() {
  const { c, erreur, charger } = useFichier('sections');
  const [ordre, setOrdre] = useState<string[]>([]);
  const [masquees, setMasquees] = useState<string[]>([]);
  const [envoi, setEnvoi] = useState(false);
  const [res, setRes] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  useEffect(() => {
    if (!c?.contenu) return;
    const o = (c.contenu.ordre ?? []).filter((x: string) => TOUTES.includes(x));
    setOrdre([...o, ...TOUTES.filter((x) => !o.includes(x))]);
    setMasquees(c.contenu.masquees ?? []);
  }, [c]);
  const bouger = (i: number, d: number) => {
    const j = i + d;
    if (j < 0 || j >= ordre.length) return;
    const n = [...ordre];
    [n[i], n[j]] = [n[j], n[i]];
    setOrdre(n);
    setRes(null);
  };
  async function enregistrer() {
    setEnvoi(true);
    setErr(null);
    try {
      const r = await api('profil', { corps: { fichier: 'sections', contenu: { ...(c?.contenu ?? {}), ordre, masquees }, sha: c?.sha ?? null } });
      setRes(r.commit ?? 'ok');
      await charger();
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setEnvoi(false);
    }
  }
  return (
    <>
      {erreur ? <p className="message erreur">{erreur}</p> : null}
      <p className="petit discret" style={{ marginTop: 0 }}>La couverture (photo, titre) reste toujours en tête. Réordonnez avec les flèches ; l’interrupteur masque une section entière.</p>
      <div className="sections-liste">
        {ordre.map((s, i) => {
          const visible = !masquees.includes(s);
          return (
            <div key={s} className={`section-l${visible ? '' : ' masquee'}`}>
              <span className="mono petit discret" style={{ width: 22 }}>{i + 1}</span>
              <span style={{ flex: 1, minWidth: 0 }}>{NOMS_SECTIONS[s]}</span>
              <button type="button" className="btn btn-petit" aria-label={`Monter ${NOMS_SECTIONS[s]}`} disabled={i === 0} onClick={() => bouger(i, -1)}>↑</button>
              <button type="button" className="btn btn-petit" aria-label={`Descendre ${NOMS_SECTIONS[s]}`} disabled={i === ordre.length - 1} onClick={() => bouger(i, 1)}>↓</button>
              <button
                type="button"
                className="bascule"
                role="switch"
                aria-checked={visible}
                aria-label={`${NOMS_SECTIONS[s]} visible`}
                onClick={() => {
                  setMasquees(visible ? [...masquees, s] : masquees.filter((x) => x !== s));
                  setRes(null);
                }}
              />
            </div>
          );
        })}
      </div>
      <div className="btns" style={{ marginTop: 14 }}>
        <button className="btn btn-plein" data-geste disabled={envoi || !c} onClick={enregistrer}>
          {envoi ? <span className="chargement" /> : null} Enregistrer l’ordre
        </button>
      </div>
      {err ? <p className="message erreur" style={{ marginTop: 12 }}>{err}</p> : null}
      {res ? <p className="message ok" style={{ marginTop: 12 }}>Enregistré : la page profil suivra cet ordre après le redéploiement du site.</p> : null}
    </>
  );
}
