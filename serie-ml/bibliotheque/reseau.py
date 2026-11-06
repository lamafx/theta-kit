"""Famille Réseau : nœuds par couche, liens, sens du flux, nœuds éteints."""

from __future__ import annotations

from bibliotheque._planche import fond, vignette_ou_couverture
from bibliotheque._svg import balise, cercle, ligne, points, svg
from calculs import couvertures

COUCHES = [[(70, 45), (70, 85), (70, 125)], [(200, 30), (200, 70), (200, 110), (200, 150)], [(330, 65), (330, 105)]]
# Liens groupés par nœud de départ, dans l'ordre du canevas.
LIENS = [
    [((70, 45), (200, 30)), ((70, 45), (200, 70)), ((70, 45), (200, 110)), ((70, 45), (200, 150))],
    [((70, 85), (200, 30)), ((70, 85), (200, 110)), ((70, 85), (200, 150))],
    [((70, 125), (200, 30)), ((70, 125), (200, 70)), ((70, 125), (200, 110)), ((70, 125), (200, 150))],
    [((200, 30), (330, 65)), ((200, 30), (330, 105)), ((200, 70), (330, 105)), ((200, 110), (330, 65)),
     ((200, 150), (330, 65)), ((200, 150), (330, 105))],
]
CHEMIN = [(70, 85), (200, 70), (330, 65)]


def _vignette(p, th) -> str:
    sombre = th["nom"] == "couverture"
    ac = th["accent"]
    trait = (f'stroke="{ac}" stroke-opacity="0.18" stroke-width="1.2"' if sombre
             else f'stroke="{th["contexte"]}" stroke-width="1.5"')
    c = [f"<g {trait}>"] + ["".join(ligne(*a, *b) for a, b in groupe) for groupe in LIENS] + ["</g>"]
    c.append(balise("polyline", points=points(CHEMIN), fill="none", stroke=ac, stroke_width=2.5 if sombre else 3))
    noeud = (f'fill="{th["carte"]}" stroke="{ac}" stroke-width="2"' if sombre
             else f'fill="#FFFFFF" stroke="{th["objet"]}" stroke-width="2.5"')
    c += [f"<g {noeud}>"] + ["".join(cercle(x, y, 10) for x, y in couche) for couche in COUCHES] + ["</g>"]
    c.append(cercle(330, 65, 5, fill=ac))
    if sombre:
        return svg(400, 148, c, p.get("description"), vue=(400, 170))
    return svg(264, 112, c, p.get("description"), vue=(400, 170))


def _couverture(p, th) -> str:
    """Fond de couverture : des couches de neurones reliées ; marqué, un chemin d'une couche à l'autre."""
    ac = th["accent"]
    r = couvertures.reseau(p.get("couches", [4, 6, 7, 7, 6, 4]), p.get("abscisses", [50, 240, 430, 650, 840, 1030]),
                           20, 720, p.get("graine", 6))
    noeuds, chemin = r["noeuds"], r["chemin"]
    suivis = set(zip(chemin, chemin[1:]))
    c = [f'<g stroke="{ac}" stroke-width="1">']
    for i, j in r["liens"]:
        if (i, j) not in suivis:
            (x0, y0), (x1, y1) = noeuds[i][:2], noeuds[j][:2]
            op = 0.5 * couvertures.opacite((x0 + x1) / 2, (y0 + y1) / 2)
            if op >= 0.03:
                c.append(ligne(x0, y0, x1, y1, stroke_opacity=f"{op:.2f}"))
    c.append("</g>")
    c.append(balise("polyline", points=points(noeuds[k][:2] for k in chemin), fill="none", stroke=ac,
                    stroke_width=2.5, stroke_opacity=str(couvertures.MARQUE), stroke_linejoin="round"))
    for k, (x, y, _) in enumerate(noeuds):
        if k in chemin:
            c.append(cercle(x, y, 8, fill=ac, fill_opacity=str(couvertures.MARQUE)))
        else:
            c.append(cercle(x, y, 7, fill=th["fond"], stroke=ac, stroke_width=1.5,
                            stroke_opacity=f"{couvertures.opacite(x, y):g}"))
    return fond(c)


PARAMETRES = {"vignette": set(), "couverture": {"couches", "abscisses", "graine"}}

def rendre(params: dict, theme: dict) -> str:
    return vignette_ou_couverture("reseau", _vignette, _couverture, params, theme)
