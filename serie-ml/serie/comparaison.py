"""Comparaison de deux images PNG, pixel par pixel, dans Chromium (aucune dépendance de plus).

Algorithme de pixelmatch (Mapbox, licence ISC) : un pixel diffère si l'écart de couleur perçu
(espace YIQ) dépasse le seuil ; il est classé « anti-crénelage » s'il borde un contour présent
dans les deux images, et n'est alors pas compté comme écart.
"""

from __future__ import annotations

import base64
from dataclasses import dataclass
from pathlib import Path

SCRIPT = r"""
async ([a, b, seuil, avecDiff, masques]) => {
  const charger = s => new Promise((ok, ko) => { const i = new Image(); i.onload = () => ok(i); i.onerror = ko; i.src = s; });
  const [ia, ib] = await Promise.all([charger(a), charger(b)]);
  if (ia.width !== ib.width || ia.height !== ib.height)
    return {erreur: `tailles différentes : ${ia.width}×${ia.height} et ${ib.width}×${ib.height}`};
  const w = ia.width, h = ia.height;
  const pixels = i => { const c = document.createElement('canvas'); c.width = w; c.height = h;
    const x = c.getContext('2d'); x.drawImage(i, 0, 0); return x.getImageData(0, 0, w, h).data; };
  const A = pixels(ia), B = pixels(ib);
  const blend = (c, al) => 255 + (c - 255) * al;
  const y_ = (r, g, b) => r * 0.29889531 + g * 0.58662247 + b * 0.11448223;
  const i_ = (r, g, b) => r * 0.59597799 - g * 0.27417610 - b * 0.32180189;
  const q_ = (r, g, b) => r * 0.21147017 - g * 0.52261711 + b * 0.31114694;
  function delta(I1, I2, k, m, yOnly) {
    let r1 = I1[k], g1 = I1[k + 1], b1 = I1[k + 2], a1 = I1[k + 3];
    let r2 = I2[m], g2 = I2[m + 1], b2 = I2[m + 2], a2 = I2[m + 3];
    if (a1 === a2 && r1 === r2 && g1 === g2 && b1 === b2) return 0;
    if (a1 < 255) { a1 /= 255; r1 = blend(r1, a1); g1 = blend(g1, a1); b1 = blend(b1, a1); }
    if (a2 < 255) { a2 /= 255; r2 = blend(r2, a2); g2 = blend(g2, a2); b2 = blend(b2, a2); }
    const y1 = y_(r1, g1, b1), y2 = y_(r2, g2, b2), y = y1 - y2;
    if (yOnly) return y;
    const i = i_(r1, g1, b1) - i_(r2, g2, b2), q = q_(r1, g1, b1) - q_(r2, g2, b2);
    const d = 0.5053 * y * y + 0.299 * i * i + 0.1957 * q * q;
    return y1 > y2 ? -d : d;
  }
  function voisins(I, x1, y1) {
    const x0 = Math.max(x1 - 1, 0), y0 = Math.max(y1 - 1, 0), x2 = Math.min(x1 + 1, w - 1), y2 = Math.min(y1 + 1, h - 1);
    const p = (y1 * w + x1) * 4;
    let zeros = x1 === x0 || x1 === x2 || y1 === y0 || y1 === y2 ? 1 : 0;
    for (let x = x0; x <= x2; x++) for (let y = y0; y <= y2; y++) {
      if (x === x1 && y === y1) continue;
      const p2 = (y * w + x) * 4;
      if (I[p] === I[p2] && I[p + 1] === I[p2 + 1] && I[p + 2] === I[p2 + 2] && I[p + 3] === I[p2 + 3]) zeros++;
      if (zeros > 2) return true;
    }
    return false;
  }
  function antiCrenelage(I, x1, y1, I2) {
    const x0 = Math.max(x1 - 1, 0), y0 = Math.max(y1 - 1, 0), x2 = Math.min(x1 + 1, w - 1), y2 = Math.min(y1 + 1, h - 1);
    const p = (y1 * w + x1) * 4;
    let zeros = x1 === x0 || x1 === x2 || y1 === y0 || y1 === y2 ? 1 : 0;
    let min = 0, max = 0, minX, minY, maxX, maxY;
    for (let x = x0; x <= x2; x++) for (let y = y0; y <= y2; y++) {
      if (x === x1 && y === y1) continue;
      const d = delta(I, I, p, (y * w + x) * 4, true);
      if (d === 0) { zeros++; if (zeros > 2) return false; }
      else if (d < min) { min = d; minX = x; minY = y; }
      else if (d > max) { max = d; maxX = x; maxY = y; }
    }
    if (min === 0 || max === 0) return false;
    return (voisins(I, minX, minY) && voisins(I2, minX, minY)) || (voisins(I, maxX, maxY) && voisins(I2, maxX, maxY));
  }
  const masque = new Uint8Array(w * h);
  for (const [mx, my, mw, mh] of masques)
    for (let y = Math.max(0, my); y < Math.min(h, my + mh); y++)
      for (let x = Math.max(0, mx); x < Math.min(w, mx + mw); x++) masque[y * w + x] = 1;
  const maxDelta = 35215 * seuil * seuil;
  const D = avecDiff ? new Uint8ClampedArray(w * h * 4) : null;
  let ecarts = 0, crenelage = 0, masques_px = 0;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const p = (y * w + x) * 4;
    if (masque[y * w + x]) {
      masques_px++;
      if (D) { D[p] = 200; D[p + 1] = 215; D[p + 2] = 255; D[p + 3] = 255; }
      continue;
    }
    const d = delta(A, B, p, p, false);
    let couleur = null;
    if (Math.abs(d) > maxDelta) {
      if (antiCrenelage(A, x, y, B) || antiCrenelage(B, x, y, A)) { crenelage++; couleur = [255, 200, 0]; }
      else { ecarts++; couleur = [230, 0, 0]; }
    }
    if (D) {
      if (couleur) { D[p] = couleur[0]; D[p + 1] = couleur[1]; D[p + 2] = couleur[2]; }
      else { const g = 255 + (y_(A[p], A[p + 1], A[p + 2]) - 255) * 0.15; D[p] = D[p + 1] = D[p + 2] = g; }
      D[p + 3] = 255;
    }
  }
  let diff = null;
  if (D) {
    const c = document.createElement('canvas'); c.width = w; c.height = h;
    c.getContext('2d').putImageData(new ImageData(D, w, h), 0, 0);
    diff = c.toDataURL('image/png');
  }
  return {ecarts, crenelage, masques: masques_px, total: w * h, diff};
}
"""


@dataclass
class Ecart:
    ecarts: int  # pixels différents, hors anti-crénelage
    crenelage: int  # pixels différents classés anti-crénelage (non comptés)
    total: int
    masques: int = 0  # pixels exclus de la comparaison (zones masquées)

    @property
    def taux(self) -> float:
        return self.ecarts / self.total

    def __str__(self) -> str:
        return f"{self.ecarts} px ({100 * self.taux:.3f} %), anti-crénelage écarté : {self.crenelage} px"


def _uri(image: bytes | Path) -> str:
    octets = image.read_bytes() if isinstance(image, Path) else image
    return "data:image/png;base64," + base64.b64encode(octets).decode("ascii")


class Comparateur:
    """Un navigateur ouvert pour plusieurs comparaisons."""

    def __init__(self, seuil: float = 0.1) -> None:
        self.seuil = seuil

    def __enter__(self) -> "Comparateur":
        from playwright.sync_api import sync_playwright

        self._pw = sync_playwright().start()
        self._nav = self._pw.chromium.launch()
        self._onglet = self._nav.new_page()
        return self

    def __exit__(self, *exc) -> None:
        self._nav.close()
        self._pw.stop()

    def comparer(self, a: bytes | Path, b: bytes | Path, diff: Path | None = None,
                 masques: list[tuple[int, int, int, int]] = ()) -> Ecart:
        """Compte les pixels différents ; `masques` : rectangles (x, y, largeur, hauteur) exclus."""
        r = self._onglet.evaluate(SCRIPT, [_uri(a), _uri(b), self.seuil, diff is not None, [list(m) for m in masques]])
        if "erreur" in r:
            raise ValueError(r["erreur"])
        if diff is not None:
            diff.parent.mkdir(parents=True, exist_ok=True)
            diff.write_bytes(base64.b64decode(r["diff"].split(",", 1)[1]))
        return Ecart(r["ecarts"], r["crenelage"], r["total"], r["masques"])
