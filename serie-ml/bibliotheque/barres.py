"""Famille Barres : valeurs, une barre dominante, étiquette."""

from __future__ import annotations

from bibliotheque._planche import fond, vignette_ou_couverture
from bibliotheque._svg import MONO, balise, esc, ligne, svg
from calculs import couvertures

BARRES = [(30, 115, 35), (70, 90, 60), (110, 105, 45), (150, 125, 25), (190, 100, 50),
          (270, 110, 40), (310, 120, 30), (350, 95, 55)]
DOMINANTE = (230, 30, 120)
ETIQUETTE = "0,62"


def _vignette(p, th) -> str:
    sombre = th["nom"] == "couverture"
    ac = th["accent"]
    if sombre:
        c = [ligne(20, 150, 380, 150, stroke=ac, stroke_opacity="0.25", stroke_width=1.5),
             f'<g fill="{ac}" fill-opacity="0.22">']
    else:
        c = [ligne(20, 150, 380, 150, stroke=th["filet"], stroke_width=2), f'<g fill="{th["contexte"]}">']
    c.append("".join(balise("rect", x=x, y=y, width=26, height=h, rx=3) for x, y, h in BARRES))
    c.append("</g>")
    x, y, h = DOMINANTE
    c.append(balise("rect", x=x, y=y, width=26, height=h, rx=3, fill=ac))
    if sombre:
        c.append(f'<text x="243" y="22" text-anchor="middle" font-family="{MONO}" font-size="13" '
                 f'fill="{th["clair"]}">{esc(ETIQUETTE)}</text>')
        return svg(400, 148, c, p.get("description"), vue=(400, 170))
    c.append(f'<text x="243" y="22" text-anchor="middle" font-family="{MONO}" font-size="15" font-weight="500" '
             f'fill="{th["objet"]}">{esc(ETIQUETTE)}</text>')
    return svg(264, 112, c, p.get("description"), vue=(400, 170))


def _couverture(p, th) -> str:
    """Fond de couverture : des barres sur toute la largeur ; marquée, la dominante."""
    ac = th["accent"]
    nombre, dominante = p.get("nombre", 16), p.get("dominante", 13)
    hauteurs = couvertures.barres(nombre, p.get("graine", 3), dominante)
    base, haut_max, pas = 640, 560, 1068 / nombre
    largeur = pas * 0.66
    c = [ligne(0, base + 1, 1080, base + 1, stroke=ac, stroke_opacity="0.12", stroke_width=1.5)]
    for k, h in enumerate(hauteurs):
        x, hb = 6 + k * pas + (pas - largeur) / 2, h * haut_max
        if k == dominante:
            c.append(balise("rect", x=float(x), y=float(base - hb), width=float(largeur), height=float(hb), rx=6,
                            fill=ac, fill_opacity="0.2", stroke=ac, stroke_width=2.5,
                            stroke_opacity=str(couvertures.MARQUE)))
        else:
            op = couvertures.opacite(x + largeur / 2, base - hb / 2, plein=True)
            c.append(balise("rect", x=float(x), y=float(base - hb), width=float(largeur), height=float(hb), rx=6,
                            fill=ac, fill_opacity=f"{op:g}"))
    return fond(c)


PARAMETRES = {"vignette": set(), "couverture": {"nombre", "dominante", "graine"}}

def rendre(params: dict, theme: dict) -> str:
    return vignette_ou_couverture("barres", _vignette, _couverture, params, theme)
