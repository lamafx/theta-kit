import 'server-only';
import zlib from 'node:zlib';

/**
 * Tout le texte d'un PDF, pour le garde-fou téléphone :
 *  1. le texte des pages, lu par pdf.js (qui sait lire les polices de Canva) ;
 *  2. les chaînes brutes du fichier, flux décompressés compris : balises d'accessibilité (/E, /Alt,
 *     /ActualText), métadonnées, liens. Le téléphone s'est déjà caché dans une balise /E des originaux.
 */
export async function texteDuPdf(octets: Buffer): Promise<{ pages: string; brut: string; nbPages: number }> {
  let pages = '';
  let nbPages = 0;
  try {
    const pdfjs: any = await import('pdfjs-dist/legacy/build/pdf.mjs');
    const doc = await pdfjs.getDocument({ data: new Uint8Array(octets), isEvalSupported: false, disableFontFace: true, useSystemFonts: false, verbosity: 0 }).promise;
    nbPages = doc.numPages;
    for (let i = 1; i <= doc.numPages; i++) {
      const p = await doc.getPage(i);
      const c = await p.getTextContent();
      pages += c.items.map((x: any) => x.str ?? '').join(' ') + '\n';
    }
    await doc.destroy().catch(() => {});
  } catch {
    // PDF illisible par pdf.js : il reste les chaînes brutes, et l'auteur devra confirmer à la main.
  }
  return { pages, brut: chainesBrutes(octets), nbPages };
}

function chainesBrutes(octets: Buffer): string {
  const morceaux: string[] = [octets.toString('latin1')];
  const s = morceaux[0];
  // Flux FlateDecode : décompressés un par un.
  const re = /stream\r?\n/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(s))) {
    const debut = m.index + m[0].length;
    const fin = s.indexOf('endstream', debut);
    if (fin < 0) break;
    const entete = s.slice(Math.max(0, m.index - 400), m.index);
    if (/FlateDecode/.test(entete)) {
      try {
        morceaux.push(zlib.inflateSync(octets.subarray(debut, fin)).toString('latin1'));
      } catch {
        try {
          morceaux.push(zlib.inflateSync(octets.subarray(debut, fin - 1)).toString('latin1'));
        } catch {}
      }
    }
    re.lastIndex = fin;
  }
  const textes: string[] = [];
  for (const t of morceaux) {
    for (const x of t.matchAll(/\(((?:\\.|[^\\()])*)\)/g)) textes.push(decoderLitteral(x[1]));
    for (const x of t.matchAll(/<(FEFF[0-9A-Fa-f\s]+)>/g)) textes.push(decoderHex(x[1]));
  }
  return textes.join('\n');
}

function decoderLitteral(s: string) {
  const brut = s.replace(/\\([nrtbf()\\]|[0-7]{1,3})/g, (_m, c) => (/^[0-7]+$/.test(c) ? String.fromCharCode(parseInt(c, 8)) : ({ n: '\n', r: '\r', t: '\t', b: '', f: '' } as any)[c] ?? c));
  if (brut.startsWith('þÿ')) {
    let out = '';
    for (let i = 2; i + 1 < brut.length; i += 2) out += String.fromCharCode((brut.charCodeAt(i) << 8) | brut.charCodeAt(i + 1));
    return out;
  }
  return brut;
}

function decoderHex(h: string) {
  const x = h.replace(/\s/g, '').slice(4);
  let out = '';
  for (let i = 0; i + 3 < x.length; i += 4) out += String.fromCharCode(parseInt(x.slice(i, i + 4), 16));
  return out;
}
