"""Mesures des pages dans Chromium : débordement, tailles de police, glyphes, ponctuation seule, remplissage.

Chaque page est ouverte telle qu'elle sera photographiée (même HTML, mêmes polices locales), puis mesurée :

- **débordement** : un texte hors de la zone de texte de la page (marges de la charte), hors d'un cadre qui
  le rogne, un pied de page poussé hors de la page, un texte de visuel hors de son dessin ;
- **tailles** : texte de lecture (Geist, hors visuels) sous `texte_min`, ou tout texte sous `credit` ;
- **glyphes** : un caractère dessiné par une police du système au lieu des polices locales (CDP) ;
- **ponctuation seule** : une ligne de texte qui ne contient que de la ponctuation ;
- **remplissage** : la hauteur vide, en pixels de la capture, entre le dernier bloc et le filet du pied.
"""

from __future__ import annotations

import base64
from dataclasses import dataclass, field
from pathlib import Path

PONCTUATION = ";:!?.,…»)]–—"

SCRIPT_MESURES = r"""
([zone, minLecture, minTout, ponctuation]) => {
  const page = document.querySelector('.page');
  const pied = page.querySelector('.pied');
  const res = {debordements: [], tailles: [], orphelines: [], piedHaut: null, piedBas: null};
  const decor = el => el.closest('.scene, .scene-a, .robot-baguette, .robot-couverture');
  const extrait = t => t.replace(/\s+/g, ' ').trim().slice(0, 60);
  if (pied) { const r = pied.getBoundingClientRect(); res.piedHaut = r.top; res.piedBas = r.bottom; }

  // Ancêtres qui rognent leur contenu (overflow autre que visible), jusqu'à la page.
  const rogneurs = el => {
    const liste = [];
    for (let a = el.parentElement; a && a !== page; a = a.parentElement) {
      const s = getComputedStyle(a);
      if (s.overflowX !== 'visible' || s.overflowY !== 'visible') liste.push(a);
    }
    return liste;
  };

  const marcheur = document.createTreeWalker(page, NodeFilter.SHOW_TEXT);
  const vus = new Set();
  const lignes = new Map();  // bloc -> caractères dans l'ordre de lecture, avec leur hauteur
  let noeud;
  while ((noeud = marcheur.nextNode())) {
    const texte = noeud.textContent;
    if (!texte.trim()) continue;
    const el = noeud.parentElement;
    if (decor(el)) continue;
    const dansSvg = !!el.closest('svg');
    const style = getComputedStyle(el);
    if (style.visibility === 'hidden' || style.display === 'none') continue;
    const taille = parseFloat(style.fontSize);
    const lecture = !dansSvg && /^"?Geist"?(,|$)/.test(style.fontFamily.trim()) && !/Mono/.test(style.fontFamily);
    if (!vus.has(el)) {
      vus.add(el);
      if (taille < minTout || (lecture && taille < minLecture))
        res.tailles.push({texte: extrait(el.textContent), taille, minimum: lecture ? minLecture : minTout});
    }
    // Position de chaque caractère.
    const bloc = dansSvg ? el.closest('text') : (el.closest('p, li, h1, h2, td, th, figcaption, div, span.point, span.question') || el);
    if (!lignes.has(bloc)) lignes.set(bloc, []);
    const caracteres = lignes.get(bloc);
    const cadres = rogneurs(el).map(a => a.getBoundingClientRect());
    const svg = dansSvg ? el.closest('svg').getBoundingClientRect() : null;
    const range = document.createRange();
    let signale = false;
    for (let i = 0; i < texte.length; i++) {
      const c = texte[i];
      if (/\s/.test(c) && c !== ' ' && c !== ' ') continue;
      range.setStart(noeud, i); range.setEnd(noeud, i + 1);
      const r = range.getBoundingClientRect();
      if (r.width === 0 && r.height === 0) continue;
      caracteres.push({c, haut: r.top, bas: r.bottom});
      if (signale) continue;
      const hors = r.left < zone.gauche - 1 || r.right > zone.droite + 1 || r.top < zone.haut - 1 || r.bottom > zone.bas + 1;
      const rogne = cadres.some(k => r.left < k.left - 1 || r.right > k.right + 1 || r.top < k.top - 1 || r.bottom > k.bottom + 1);
      const horsSvg = svg && (r.left < svg.left - 1 || r.right > svg.right + 1 || r.top < svg.top - 1 || r.bottom > svg.bottom + 1);
      if (hors || rogne || horsSvg) {
        res.debordements.push({texte: extrait(texte), raison: hors ? 'hors de la zone de texte' : rogne ? 'rogné par son cadre' : 'hors de son visuel',
                               boite: [Math.round(r.left), Math.round(r.top), Math.round(r.right), Math.round(r.bottom)]});
        signale = true;
      }
    }
  }
  // Une formule ou un bloc sans retour à la ligne plus large que son cadre.
  for (const el of page.querySelectorAll('*')) {
    if (decor(el) || el.closest('svg')) continue;
    if (el.scrollWidth > el.clientWidth + 1 && getComputedStyle(el).overflowX !== 'visible' && el.clientWidth > 0)
      res.debordements.push({texte: extrait(el.textContent), raison: 'contenu plus large que son cadre', boite: null});
  }
  // Un visuel affiché à une autre taille que la sienne est déformé.
  for (const svg of page.querySelectorAll('svg[width][height]')) {
    if (decor(svg) || svg.parentElement.closest('svg')) continue;
    const r = svg.getBoundingClientRect(), w = parseFloat(svg.getAttribute('width')), h = parseFloat(svg.getAttribute('height'));
    if (Math.abs(r.width - w) > 1 || Math.abs(r.height - h) > 1)
      res.debordements.push({texte: svg.getAttribute('aria-label') || 'visuel', raison: `visuel déformé (${Math.round(r.width)} × ${Math.round(r.height)} au lieu de ${w} × ${h})`, boite: null});
  }
  if (pied && res.piedBas > zone.bas + 1)
    res.debordements.push({texte: 'pied de page', raison: `poussé hors de la page (bas à ${Math.round(res.piedBas)} px, limite ${zone.bas})`, boite: null});
  // Lignes faites seulement de ponctuation.
  // Découpe en lignes dans l'ordre de lecture : une nouvelle ligne commence quand le milieu d'un caractère
  // passe sous le bas de la ligne en cours (les symboles en STIX n'ont pas la même hauteur que le texte).
  for (const [bloc, caracteres] of lignes) {
    const decoupe = [];
    for (const k of caracteres) {
      const milieu = (k.haut + k.bas) / 2, l = decoupe[decoupe.length - 1];
      if (l && milieu <= l.bas && milieu >= l.haut) { l.texte += k.c; l.haut = Math.min(l.haut, k.haut); l.bas = Math.max(l.bas, k.bas); }
      else decoupe.push({texte: k.c, haut: k.haut, bas: k.bas});
    }
    if (decoupe.length < 2) continue;
    for (const l of decoupe) {
      const visible = l.texte.replace(/[  ]/g, '');
      if (visible && [...visible].every(c => ponctuation.includes(c)))
        res.orphelines.push({texte: extrait(bloc.textContent), ligne: l.texte, haut: Math.round(l.haut)});
    }
  }
  return res;
}
"""

SCRIPT_VIDE = r"""
async ([src, piedHaut]) => {
  const i = new Image(); await new Promise(ok => { i.onload = ok; i.src = src; });
  const c = document.createElement('canvas'); c.width = i.width; c.height = i.height;
  const x = c.getContext('2d'); x.drawImage(i, 0, 0);
  const d = x.getImageData(0, 0, i.width, i.height).data, w = i.width;
  const filet = Math.round(piedHaut);
  const f = ((filet - 4) * w + 5) * 4, r0 = d[f], g0 = d[f + 1], b0 = d[f + 2];
  for (let Y = filet - 2; Y > 0; Y--) {
    for (let p = Y * w * 4, fin = p + w * 4; p < fin; p += 4)
      if (Math.abs(d[p] - r0) + Math.abs(d[p + 1] - g0) + Math.abs(d[p + 2] - b0) > 24) return filet - Y - 1;
  }
  return filet;
}
"""


# A24 : zone de chaque image réelle (`img.image-reelle`), dans son cadre et à l'écart des coins arrondis ;
# le surlignage et le badge d'une capture sont masqués, pour ne mesurer que l'image.
SCRIPT_ZONES_IMAGE = r"""
(retrait) => [...document.querySelectorAll('img.image-reelle')].map(i => {
  const cadre = i.parentElement;
  cadre.querySelectorAll('.surlignage, .badge').forEach(e => { e.style.visibility = 'hidden'; });
  const r = cadre.getBoundingClientRect();
  return {image: decodeURI(i.src).split('/').pop(), chargee: i.complete && i.naturalWidth > 0,
          x: Math.round(r.x + retrait), y: Math.round(r.y + retrait),
          largeur: Math.round(r.width - 2 * retrait), hauteur: Math.round(r.height - 2 * retrait)};
})
"""

# Écart type de la luminance (0 à 255) dans un rectangle d'une image PNG.
SCRIPT_ECART_TYPE = r"""
async ([src, z]) => {
  const i = new Image(); await new Promise(ok => { i.onload = ok; i.src = src; });
  const c = document.createElement('canvas'); c.width = i.width; c.height = i.height;
  const x = c.getContext('2d'); x.drawImage(i, 0, 0);
  const d = x.getImageData(z.x, z.y, z.largeur, z.hauteur).data;
  let n = 0, s = 0, s2 = 0;
  for (let p = 0; p < d.length; p += 4) {
    const y = 0.299 * d[p] + 0.587 * d[p + 1] + 0.114 * d[p + 2];
    n++; s += y; s2 += y * y;
  }
  const m = s / n;
  return Math.round(Math.sqrt(Math.max(0, s2 / n - m * m)) * 100) / 100;
}
"""
RETRAIT_IMAGE = 24  # au-delà du rayon des coins (20 px)


@dataclass
class MesurePage:
    numero: int
    debordements: list[dict] = field(default_factory=list)
    tailles: list[dict] = field(default_factory=list)
    orphelines: list[dict] = field(default_factory=list)
    glyphes: list[dict] = field(default_factory=list)  # textes dessinés par une police du système
    vide: int | None = None  # hauteur vide au-dessus du pied, en pixels
    images: list[dict] = field(default_factory=list)  # zones des images réelles : chargée, écart type (A24)


def mesurer_pages(htmls: list[str], dossier: Path, zone: dict, min_lecture: int, min_tout: int,
                  premiere: int = 1) -> list[MesurePage]:
    """Ouvre chaque page dans Chromium et la mesure. Les HTML sont écrits dans `dossier`."""
    from playwright.sync_api import sync_playwright

    dossier.mkdir(parents=True, exist_ok=True)
    mesures = []
    with sync_playwright() as pw:
        navigateur = pw.chromium.launch()
        try:
            onglet = navigateur.new_page(viewport={"width": 1080, "height": 1350}, device_scale_factor=1)
            cdp = onglet.context.new_cdp_session(onglet)
            for k, html in enumerate(htmls, start=premiere):
                source = dossier / f"mesure-{k:02d}.html"
                source.write_text(html, encoding="utf-8", newline="\n")
                onglet.goto(source.as_uri())
                onglet.evaluate("document.fonts.ready.then(() => true)")
                r = onglet.evaluate(SCRIPT_MESURES, [zone, min_lecture, min_tout, PONCTUATION])
                m = MesurePage(k, r["debordements"], r["tailles"], r["orphelines"])
                m.glyphes = _glyphes_systeme(cdp)
                if r["piedHaut"] is not None:
                    capture = onglet.screenshot(clip={"x": 0, "y": 0, "width": 1080, "height": 1350})
                    uri = "data:image/png;base64," + base64.b64encode(capture).decode("ascii")
                    m.vide = onglet.evaluate(SCRIPT_VIDE, [uri, r["piedHaut"]])
                m.images = mesurer_images(onglet)
                mesures.append(m)
        finally:
            navigateur.close()
    return mesures


def mesurer_images(onglet) -> list[dict]:
    """Chaque image réelle de la page ouverte : son nom, si elle s'est chargée, et l'écart type de la luminance
    dans sa zone, sur la page telle qu'elle est rendue (0 : zone uniforme ou vide)."""
    onglet.evaluate("Promise.all([...document.images].map(i => i.decode().catch(() => null)))")
    zones = onglet.evaluate(SCRIPT_ZONES_IMAGE, RETRAIT_IMAGE)
    if zones:
        capture = onglet.screenshot(clip={"x": 0, "y": 0, "width": 1080, "height": 1350})
        uri = "data:image/png;base64," + base64.b64encode(capture).decode("ascii")
        for z in zones:
            z["ecart_type"] = onglet.evaluate(SCRIPT_ECART_TYPE, [uri, z])
    return zones


def ecarts_types_png(chemin: Path, zones: list[dict]) -> list[float]:
    """Écart type de la luminance dans chaque zone {x, y, largeur, hauteur} d'une image PNG."""
    from playwright.sync_api import sync_playwright

    uri = "data:image/png;base64," + base64.b64encode(chemin.read_bytes()).decode("ascii")
    with sync_playwright() as pw:
        navigateur = pw.chromium.launch()
        try:
            onglet = navigateur.new_page()
            return [onglet.evaluate(SCRIPT_ECART_TYPE, [uri, z]) for z in zones]
        finally:
            navigateur.close()


def _glyphes_systeme(cdp) -> list[dict]:
    """Éléments dont un caractère est dessiné par une police du système (CSS.getPlatformFontsForNode)."""
    cdp.send("DOM.enable")
    cdp.send("CSS.enable")
    racine = cdp.send("DOM.getDocument", {"depth": -1})["root"]
    fautifs = []

    def parcourir(n):
        enfants = n.get("children", [])
        if n.get("nodeName") in ("STYLE", "SCRIPT", "TITLE", "HEAD"):
            return
        if any(e.get("nodeType") == 3 and e.get("nodeValue", "").strip() for e in enfants):
            polices = cdp.send("CSS.getPlatformFontsForNode", {"nodeId": n["nodeId"]})["fonts"]
            systeme = [f["familyName"] for f in polices if not f["isCustomFont"]]
            if systeme:
                texte = "".join(e.get("nodeValue", "") for e in enfants if e.get("nodeType") == 3)
                fautifs.append({"texte": " ".join(texte.split())[:60], "polices": systeme})
        for e in enfants:
            parcourir(e)

    parcourir(racine)
    return fautifs


def vides_png(images: list[tuple[Path, int]]) -> list[int]:
    """Hauteur vide au-dessus du filet du pied (ligne `filet`) de chaque image PNG de page."""
    from playwright.sync_api import sync_playwright

    with sync_playwright() as pw:
        navigateur = pw.chromium.launch()
        try:
            onglet = navigateur.new_page()
            return [onglet.evaluate(SCRIPT_VIDE, ["data:image/png;base64," + base64.b64encode(c.read_bytes()).decode("ascii"), f])
                    for c, f in images]
        finally:
            navigateur.close()


def vide_png(chemin: Path, filet: int) -> int:
    return vides_png([(chemin, filet)])[0]
