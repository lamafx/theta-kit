"""Famille Blocs : découpage, proportions, empilement."""

from __future__ import annotations

from bibliotheque._planche import fond, vignette_ou_couverture
from bibliotheque._svg import MONO, balise, esc, svg
from calculs import couvertures

# (x, largeur, centre du texte, mot)
MOTS = [(30, 40, 50, "Le"), (76, 58, 105, "chat"), (140, 54, 167, "dort"), (200, 44, 222, "sur"),
        (250, 36, 268, "le"), (292, 78, 331, "canapé")]


def _vignette(p, th) -> str:
    sombre = th["nom"] == "couverture"
    ac = th["accent"]
    if sombre:
        c = [balise("rect", x=30, y=30, width=236, height=28, rx=6, fill=ac, fill_opacity="0.45"),
             balise("rect", x=270, y=30, width=48, height=28, rx=6, fill=ac, fill_opacity="0.75"),
             balise("rect", x=322, y=30, width=48, height=28, rx=6, fill=ac),
             f'<g fill="none" stroke="{ac}" stroke-width="1.5" stroke-opacity="0.7">',
             "".join(balise("rect", x=x, y=100, width=w, height=34, rx=6) for x, w, _, _ in MOTS), "</g>",
             f'<g font-family="{MONO}" font-size="13" fill="{th['texte_bloc_sombre']}" text-anchor="middle">']
    else:
        c = [balise("rect", x=30, y=30, width=236, height=28, rx=6, fill=th["contexte"]),
             balise("rect", x=270, y=30, width=48, height=28, rx=6, fill=th["objet"]),
             balise("rect", x=322, y=30, width=48, height=28, rx=6, fill=ac),
             f'<g fill="none" stroke="{th["objet"]}" stroke-width="1.5">',
             "".join(balise("rect", x=x, y=100, width=w, height=34, rx=6) for x, w, _, _ in MOTS[:-1]),
             balise("rect", x=292, y=100, width=78, height=34, rx=6, stroke=ac, stroke_width=2.5), "</g>",
             f'<g font-family="{MONO}" font-size="14" fill="{th["objet"]}" text-anchor="middle">']
    c.append("".join(f'<text x="{tx}" y="122">{esc(m)}</text>' for _, _, tx, m in MOTS) + "</g>")
    if sombre:
        return svg(400, 148, c, p.get("description"), vue=(400, 170))
    return svg(264, 112, c, p.get("description"), vue=(400, 170))


def _couverture(p, th) -> str:
    """Fond de couverture : des rangées de blocs proportionnels ; marquée, une rangée."""
    ac = th["accent"]
    rangees = couvertures.blocs(p.get("proportions", [70, 15, 15]), p.get("rangees", 11), p.get("graine", 4))
    marquee = p.get("marquee", 1)
    hauteur, ecart, x0, largeur = 40, 18, 6, 1068
    c = []
    for i, parts in enumerate(rangees):
        y, x = 60 + i * (hauteur + ecart), x0
        place = largeur - 8 * (len(parts) - 1)
        for part in parts:
            lb = part * place
            if i == marquee:
                c.append(balise("rect", x=float(x), y=float(y), width=float(lb), height=hauteur, rx=8, fill=ac,
                                fill_opacity="0.16", stroke=ac, stroke_width=2,
                                stroke_opacity=str(couvertures.MARQUE)))
            else:
                op = 0.75 * couvertures.opacite(x + lb / 2, y + hauteur / 2, plein=True)
                c.append(balise("rect", x=float(x), y=float(y), width=float(lb), height=hauteur, rx=8, fill=ac,
                                fill_opacity=f"{op:.2f}"))
            x += lb + 8
    return fond(c)


PARAMETRES = {"vignette": set(), "couverture": {"proportions", "rangees", "marquee", "graine"}}

def rendre(params: dict, theme: dict) -> str:
    return vignette_ou_couverture("blocs", _vignette, _couverture, params, theme)
