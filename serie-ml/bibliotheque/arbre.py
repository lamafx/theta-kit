"""Famille Arbre : profondeur, branche suivie, classes des feuilles."""

from __future__ import annotations

from bibliotheque._planche import fond, vignette_ou_couverture
from bibliotheque._svg import balise, cercle, ligne, points, svg
from calculs import couvertures

BRANCHES = [[((200, 24), (120, 74)), ((200, 24), (280, 74))],
            [((120, 74), (70, 128)), ((120, 74), (170, 128)), ((280, 74), (230, 128)), ((280, 74), (330, 128))]]
CHEMIN = [(200, 24), (280, 74), (330, 128)]
NOEUDS = [(200, 24), (120, 74), (280, 74)]


def _vignette(p, th) -> str:
    sombre = th["nom"] == "couverture"
    ac = th["accent"]
    trait = (f'stroke="{ac}" stroke-width="1.5" stroke-opacity="0.5"' if sombre
             else f'stroke="{th["contexte"]}" stroke-width="2"')
    c = [f"<g {trait}>"] + ["".join(ligne(*a, *b) for a, b in niveau) for niveau in BRANCHES] + ["</g>"]
    c.append(balise("polyline", points=points(CHEMIN), fill="none", stroke=ac, stroke_width=2.5 if sombre else 3))
    noeud = (f'fill="{th["carte"]}" stroke="{ac}" stroke-width="2"' if sombre
             else f'fill="#FFFFFF" stroke="{th["objet"]}" stroke-width="2.5"')
    c.append(f"<g {noeud}>" + "".join(cercle(x, y, 10) for x, y in NOEUDS) + "</g>")
    classe = ac if sombre else th["objet"]
    c.append(
        balise("rect", x=52, y=120, width=36, height=22, rx=6, fill=classe)
        + balise("rect", x=152, y=120, width=36, height=22, rx=6, fill="none", stroke=classe, stroke_width=2)
        + balise("rect", x=212, y=120, width=36, height=22, rx=6, fill="none", stroke=classe, stroke_width=2)
        + balise("rect", x=312, y=120, width=36, height=22, rx=6, fill=ac)
    )
    if sombre:
        return svg(400, 148, c, p.get("description"), vue=(400, 170))
    return svg(264, 112, c, p.get("description"), vue=(400, 170))


def _couverture(p, th) -> str:
    """Fond de couverture : un arbre binaire qui descend du haut à droite ; marquée, une branche suivie."""
    ac = th["accent"]
    a = couvertures.arbre(p.get("racine", [800, 56]), p.get("profondeur", 5), p.get("ecart", 36), p.get("etage", 124),
                          p.get("chemin", [1, 0, 1, 1, 0]))
    noeuds, suivi = a["noeuds"], a["chemin"]
    liens_suivis = set(zip(suivi, suivi[1:]))
    c = [f'<g stroke="{ac}" stroke-width="1.5">']
    for i, j in a["liens"]:
        if (i, j) not in liens_suivis:
            (x0, y0), (x1, y1) = noeuds[i][:2], noeuds[j][:2]
            c.append(ligne(x0, y0, x1, y1, stroke_opacity=f"{couvertures.opacite((x0 + x1) / 2, (y0 + y1) / 2):g}"))
    c.append("</g>")
    for k, (x, y, _, _) in enumerate(noeuds):
        if k not in suivi:
            c.append(cercle(x, y, 5, fill=ac, fill_opacity=f"{couvertures.opacite(x, y):g}"))
    c.append(balise("polyline", points=points(noeuds[k][:2] for k in suivi), fill="none", stroke=ac, stroke_width=2.5,
                    stroke_opacity=str(couvertures.MARQUE), stroke_linejoin="round"))
    for k in suivi[1:]:
        c.append(cercle(*noeuds[k][:2], 6, fill=ac, fill_opacity=str(couvertures.MARQUE)))
    c.append(cercle(*noeuds[suivi[0]][:2], 9, fill=th["carte"], stroke=th["clair"], stroke_width=2.5))
    return fond(c)


PARAMETRES = {"vignette": set(), "couverture": {"racine", "profondeur", "ecart", "etage", "chemin"}}

def rendre(params: dict, theme: dict) -> str:
    return vignette_ou_couverture("arbre", _vignette, _couverture, params, theme)
