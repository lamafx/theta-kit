"""Famille Blocs : découpage, proportions, empilement.

Forme de page (session de design n° 4, épisode 20) : `decoupage`, un jeu de données en parts proportionnelles
(`parts` : [{texte, part}], `total` : nombre d'exemples ; effectifs entiers par calculs.decoupage.decouper) ;
couleurs dans l'ordre gris de contexte, objet, accent ; `mise_en_avant` : la part encadrée ; `fuite`
{de, vers, part, texte} : des exemples d'une part copiés dans une autre, en alerte (fuite de données).
Textes : `exemples` (sous la barre, « {total} maisons au total » : {total} devient l'effectif total), `fuite`.
"""

from __future__ import annotations

from bibliotheque._planche import fond, vignette_ou_couverture
from bibliotheque._svg import GEIST, MONO, balise, esc, marqueur, svg, texte_svg
from calculs import couvertures
from calculs.decoupage import decouper

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


def _milliers(n: int) -> str:
    return f"{n:,}".replace(",", "\u202f")


def _decoupage(p, th) -> str:
    larg, haut = p.get("cadre", [920, 300 if "fuite" not in p else 420])
    parts = p["parts"]
    effectifs = decouper(p["total"], [x["part"] for x in parts])
    couleurs = [th["contexte"], th["objet"], th["accent"]]
    encre = [th["objet"], "#FFFFFF", "#FFFFFF"]
    t = p.get("textes", {})
    ecart, y0, hb = 8, 56, 104
    place = larg - ecart * (len(parts) - 1)
    total = sum(x["part"] for x in parts)
    c = ["<defs>", marqueur("bl-fuite", th["alerte"], taille=7), "</defs>"]
    x, boites = 0.0, []
    for i, (part, n) in enumerate(zip(parts, effectifs)):
        lb = place * part["part"] / total
        boites.append((x, lb))
        k = i % 3
        attrs = {"stroke": th["accent"], "stroke_width": 4} if p.get("mise_en_avant") == i else {}
        c.append(balise("rect", x=float(x), y=float(y0), width=float(lb), height=hb, rx=12, fill=couleurs[k], **attrs))
        c.append(texte_svg(part["texte"], x=float(x + lb / 2), y=float(y0 - 18), text_anchor="middle", font_family=GEIST,
                           font_size=22, font_weight=500, fill=th["accent"] if k == 2 else th["objet"]))
        c.append(texte_svg(f"{round(100 * part['part'] / total)} %", x=float(x + lb / 2), y=float(y0 + hb / 2 + 10),
                           text_anchor="middle", font_family=GEIST, font_size=28, font_weight=600, fill=encre[k]))
        c.append(texte_svg(_milliers(n), x=float(x + lb / 2), y=float(y0 + hb + 36), text_anchor="middle",
                           font_family=GEIST, font_size=22, fill=th["secondaire"]))
        x += lb + ecart
    if t.get("exemples"):  # l'unité une fois, à gauche, sous les effectifs : « 2 925 maisons au total »
        c.append(texte_svg(t["exemples"].replace("{total}", _milliers(p["total"])), x=0.0, y=float(y0 + hb + 72),
                           font_family=GEIST, font_size=22, fill=th["secondaire"]))
    if "fuite" in p:
        f = p["fuite"]
        (xd, ld), (xv, lv) = boites[f["de"]], boites[f["vers"]]
        lf = max(18.0, place * f.get("part", 0.02))
        xf = xv + lv - lf - 10
        c.append(balise("rect", x=float(xf), y=float(y0 + 10), width=float(lf), height=hb - 20, rx=6, fill=th["alerte"]))
        yb = y0 + hb + 92
        xs, xe = xd + ld / 2, xf + lf / 2
        c.append(f'<path d="M{xs:.1f} {y0 + hb + 50:.1f} C {xs:.1f} {yb + 40:.1f}, {xe:.1f} {yb + 40:.1f}, {xe:.1f} '
                 f'{y0 + hb + 8:.1f}" fill="none" stroke="{th["alerte"]}" stroke-width="3" stroke-dasharray="8 6" '
                 f'marker-end="url(#bl-fuite)"></path>')
        if f.get("texte") or t.get("fuite"):
            c.append(texte_svg(f.get("texte") or t["fuite"], x=float(larg), y=float(yb + 62), text_anchor="end",
                               font_family=GEIST, font_size=22, font_weight=500, fill=th["alerte"]))
    return svg(larg, haut, c, p.get("description"), "display: block")


PARAMETRES = {"vignette": set(), "couverture": {"proportions", "rangees", "marquee", "graine"},
              "decoupage": {"parts", "total", "mise_en_avant", "fuite", "cadre", "textes"}}

FORMES = {"decoupage": _decoupage}


def rendre(params: dict, theme: dict) -> str:
    forme = params.get("forme", "vignette")
    if forme in FORMES:
        return FORMES[forme](params, theme)
    return vignette_ou_couverture("blocs", _vignette, _couverture, params, theme)
