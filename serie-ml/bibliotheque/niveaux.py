"""Famille Lignes de niveau : ellipses emboîtées d'une vallée et chemin de descente.

Formes : carte (page, épisode 07), chemin (page, épisode 09), couverture (fond derrière le robot, épisodes 07
à 09), vignette (planches).
"""

from __future__ import annotations

import math

from bibliotheque._plan import Plan, axes
from bibliotheque._svg import GEIST, balise, cercle, ligne, marqueur, nombre_fr, points, raccourcir, svg, texte_svg
from calculs.descente_gradient import gradient_2d, iterations_2d, niveau_2d, niveau_selle, sgd_2d

# Planche de la bibliothèque : chemin dessiné à la main dans le canevas Bib-Motifs.
VIGNETTE_ELLIPSES = [(160, 72, 0.15), (125, 56, 0.25), (90, 40, 0.4), (55, 25, 0.6), (22, 10, 0.85)]
VIGNETTE_CHEMIN = [(40, 22), (120, 112), (165, 62), (200, 100), (228, 82), (242, 93), (250, 90)]


def _couverture(p, th) -> str:
    """Fond de couverture : ellipses autour du minimum, puis le chemin calculé par calculs/ (08) ; avec `fleches`,
    des flèches perpendiculaires aux ellipses, vers l'extérieur, et pas de chemin (07) ; avec `bruit` (et `lot`,
    `graine`), un chemin bruité qui zigzague (09)."""
    ac = th["accent"]
    cx, cy = p["centre"]
    rapport = p.get("rapport", 2.381)
    c = ["<defs>", marqueur("kc-step", ac), "</defs>", f'<g fill="none" stroke="{ac}" stroke-width="1.5">']
    for rx, opacite in zip(p["ellipses"], p["opacites"]):
        c.append(balise("ellipse", cx=float(cx), cy=float(cy), rx=float(rx), ry=float(round(rx / rapport)),
                        stroke_opacity=str(opacite)))
    c.append("</g>")
    if "fleches" in p:
        # [indice de l'ellipse, angle en degrés] : la flèche part du point de l'ellipse, le long de la normale.
        longueur = p.get("longueur", 70)
        for indice, angle in p["fleches"]:
            rx = p["ellipses"][indice]
            ry = round(rx / rapport)
            phi = math.radians(angle)
            x, y = cx + rx * math.cos(phi), cy + ry * math.sin(phi)
            nx, ny = math.cos(phi) / rx, math.sin(phi) / ry
            k = longueur / math.hypot(nx, ny)
            c.append(ligne(x, y, x + nx * k, y + ny * k, stroke=ac, stroke_width=2.5, marker_end="url(#kc-step)"))
            c.append(cercle(x, y, 4.5, fill=ac))
        return svg(1080, 780, c, None, "position: absolute; left: -80px; top: -60px; display: block")
    if "bruit" in p:
        # Chemin bruité (09) : une ligne qui zigzague, un point par pas, sans flèche.
        chemin = sgd_2d(p["depart"], p["eta"], p["courbures"], p["pas"], p["bruit"], p.get("lot", 1),
                        graine=p.get("graine", 0))
        pts = [(cx + x, cy + y) for x, y in chemin]
        c.append(balise("polyline", points=points(pts), fill="none", stroke=ac, stroke_width=2,
                        stroke_linejoin="round", stroke_opacity="0.85"))
        c.append(cercle(*pts[0], 8, fill=th["clair"], stroke=ac, stroke_width=3))
        c.append(f'<g fill="{ac}">' + "".join(cercle(*pt, 3.5) for pt in pts[1:]) + "</g>")
        return svg(1080, 780, c, None, "position: absolute; left: -80px; top: -60px; display: block")
    chemin = iterations_2d(p["depart"], p["eta"], p["courbures"], p["pas"])
    pts = [(cx + x, cy + y) for x, y in chemin]
    epaisseurs = [(2.5, None), (2, "0.85"), (1.5, "0.7")]
    for k, ((xa, ya), (xb, yb)) in enumerate(zip(pts, pts[1:])):
        largeur, opacite = epaisseurs[min(k, len(epaisseurs) - 1)]
        c.append(ligne(xa, ya, *raccourcir(xa, ya, xb, yb, 10), stroke=ac, stroke_width=largeur,
                       stroke_opacity=opacite, marker_end="url(#kc-step)"))
    c.append(cercle(*pts[0], 8, fill=th["clair"], stroke=ac, stroke_width=3))
    rayons = [5.5, 4.5, 3.5]
    for k, pt in enumerate(pts[1:]):
        c.append(cercle(*pt, rayons[min(k, len(rayons) - 1)], fill=ac))
    return svg(1080, 780, c, None, "position: absolute; left: -80px; top: -60px; display: block")


def _ellipses(r: Plan, p, th) -> list[str]:
    """Lignes de niveau J(a, b) = c pour chaque c de `niveaux`, en gris de contexte. Courbures de même signe : des
    ellipses autour du minimum ; de signes opposés (point selle, épisode 10) : des hyperboles, et pour c = 0 les deux
    droites qui se croisent au point selle, coupées au domaine et à la plage (calculs : niveau_selle)."""
    ka, kb = p["courbures"]
    c = [f'<g fill="none" stroke="{th["contexte"]}" stroke-width="2">']
    if ka > 0 and kb > 0:
        for cout in p["niveaux"]:
            da, db = niveau_2d(cout, p["courbures"])
            c.append(balise("ellipse", cx=float(r.x(0)), cy=float(r.y(0)), rx=float(da * r.sx), ry=float(db * r.sy)))
        return c + ["</g>"]
    for cout in p["niveaux"]:
        for branche in niveau_selle(cout, p["courbures"], p["domaine"], p["plage"]):
            c.append(balise("polyline", points=points([r.pt(a, b) for a, b in branche])))
    return c + ["</g>"]


def _carte(p, th) -> str:
    """Mécanisme (épisode 07, session de design n° 2) : lignes de niveau de J(a, b) = k_a·a² + k_b·b² et, en
    quelques points, la flèche ∇J calculée, à une échelle commune (`longueur` : pixels par unité de ∇J).
    Une seule `echelle` pour a et b : sans elle, les flèches ne seraient plus perpendiculaires aux niveaux.
    Par point : `decalage` de l'étiquette, `valeurs` (∇J = (…, …) écrit), `angle_droit` (petit carré)."""
    larg, haut = p.get("cadre", [920, 450])
    r = Plan(p["origine"], (p["echelle"], p["echelle"]))
    courbures = p["courbures"]
    t = p.get("textes", {})
    ac, ob = th["accent"], th["objet"]
    c = ["<defs>", marqueur("nv-grad", ac), "</defs>"]
    c += axes(r, p["domaine"], p["plage"], th, t)
    c += _ellipses(r, p, th)
    longueur = p.get("longueur", 20)
    etiquettes = []
    for pt in p["points"]:
        a, b = pt["point"]
        ga, gb = gradient_2d([a, b], courbures)
        x, y = r.pt(a, b)
        if ga or gb:
            ux, uy = ga / math.hypot(ga, gb), -gb / math.hypot(ga, gb)
            x1, y1 = x + ga * longueur, y - gb * longueur
            c.append(ligne(x, y, *raccourcir(x, y, x1, y1, 7), stroke=ac, stroke_width=3,
                           marker_end="url(#nv-grad)"))
            if pt.get("angle_droit"):
                s = 16
                coins = [(x + uy * s, y - ux * s), (x + uy * s + ux * s, y - ux * s + uy * s), (x + ux * s, y + uy * s)]
                c.append(balise("polyline", points=points(coins), fill="none", stroke=ob, stroke_width=1.5))
                c.append(ligne(x - uy * 60, y + ux * 60, x + uy * 60, y - ux * 60, stroke=ob, stroke_width=1.5,
                               stroke_dasharray="5 5"))
        else:
            continue  # au fond de la vallée, ∇J = (0 ; 0) : pas de flèche, `textes.minimum` le dit
        texte = t.get("gradient", "∇J")
        if pt.get("valeurs"):
            texte += f" = ({nombre_fr(ga)} ; {nombre_fr(gb)})"
        dx, dy = pt.get("decalage", [12, -12])
        etiquettes.append(texte_svg(texte, 26, x=float(round(x1 + dx)), y=float(round(y1 + dy)),
                                    font_family=GEIST, font_size=22, font_weight=500, fill=ac))
    for pt in p["points"]:
        c.append(cercle(*r.pt(*pt["point"]), 8, fill="#FFFFFF", stroke=ob, stroke_width=3))
    if t.get("minimum"):
        c.append(texte_svg(t["minimum"], x=float(r.x(0)), y=float(r.y(0) + 36), text_anchor="middle",
                           font_family=GEIST, font_size=22, font_weight=500, fill=ob))
    c += etiquettes
    return svg(larg, haut, c, p.get("description"), "display: block")


def _chemin(p, th) -> str:
    """Comparaison et mécanisme (épisode 09, session de design n° 2) : lignes de niveau de J(a, b) et un ou plusieurs
    chemins calculés par `sgd_2d` (bruit 0 : la descente exacte de 08). Par chemin : `depart`, `eta`, `pas`, `bruit`,
    `lot`, `decroissance`, `graine`, `style` (accent, objet ou contexte), `texte` et son `decalage` depuis le point
    numéro `ancre` du chemin (0 : le départ).
    Le départ est un rond blanc, le minimum une croix, par-dessus les chemins ; `textes` x, y (axes, facultatifs) et minimum."""
    larg, haut = p.get("cadre", [920, 450])
    r = Plan(p["origine"], (p["echelle"], p["echelle"]))
    t = p.get("textes", {})
    ob = th["objet"]
    couleurs = {"accent": th["alerte"] if p.get("alerte") else th["accent"], "objet": ob, "contexte": th["secondaire"]}
    c = axes(r, p["domaine"], p["plage"], th, t) if t.get("x") or t.get("y") else []
    c += _ellipses(r, p, th)
    x0, y0 = r.x(0), r.y(0)
    etiquettes = []
    for ch in p["chemins"]:
        couleur = couleurs[ch.get("style", "accent")]
        pts = [r.pt(a, b) for a, b in sgd_2d(ch["depart"], ch["eta"], p["courbures"], ch["pas"], ch.get("bruit", 0),
                                              ch.get("lot", 1), ch.get("decroissance", False), ch.get("graine", 0))]
        c.append(balise("polyline", points=points(pts), fill="none", stroke=couleur, stroke_width=2.5,
                        stroke_linejoin="round", stroke_linecap="round"))
        c.append(f'<g fill="{couleur}">' + "".join(cercle(*pt, 3.5) for pt in pts[1:]) + "</g>")
        c.append(cercle(*pts[0], 8, fill="#FFFFFF", stroke=couleur, stroke_width=3))
        if ch.get("texte"):
            dx, dy = ch.get("decalage", [14, -14])
            xe, ye = pts[min(ch.get("ancre", 0), len(pts) - 1)]
            etiquettes.append(texte_svg(ch["texte"], 26, x=float(round(xe + dx)), y=float(round(ye + dy)),
                                        font_family=GEIST, font_size=22, font_weight=500, fill=couleur))
    c.append(f'<path d="M{x0 - 9} {y0 - 9}L{x0 + 9} {y0 + 9}M{x0 - 9} {y0 + 9}L{x0 + 9} {y0 - 9}" stroke="{ob}" '
             'stroke-width="3" stroke-linecap="round"></path>')
    if t.get("minimum"):
        etiquettes.append(texte_svg(t["minimum"], x=float(x0), y=float(y0 + 36), text_anchor="middle",
                                    font_family=GEIST, font_size=22, font_weight=500, fill=ob))
    return svg(larg, haut, c + etiquettes, p.get("description"), "display: block")


def _vignette(p, th) -> str:
    sombre = th["nom"] == "couverture"
    ac = th["accent"]
    trait = ac if sombre else th["objet"]
    c = [f'<g fill="none" stroke="{trait}" stroke-width="{1.3 if sombre else 1.5}">']
    for rx, ry, op in VIGNETTE_ELLIPSES:
        c.append(balise("ellipse", cx=250.0, cy=90.0, rx=float(rx), ry=float(ry), stroke_opacity=str(op)))
    c.append("</g>")
    c.append(balise("polyline", points=points(VIGNETTE_CHEMIN), fill="none", stroke=ac,
                    stroke_width=2 if sombre else 2.5, stroke_linejoin="round"))
    rayons = [4, 3.5, 3.5, 3] if sombre else [4.5, 4, 4, 3.5]
    c.append(f'<g fill="{ac}">' + "".join(cercle(x, y, r) for (x, y), r in zip(VIGNETTE_CHEMIN[1:5], rayons)) + "</g>")
    if sombre:
        c.append(cercle(40, 22, 5.5, fill=th["clair"]))
        return svg(400, 148, c, p.get("description"), vue=(400, 170))
    c.append(cercle(40, 22, 6.5, fill="#FFFFFF", stroke=th["objet"], stroke_width=2.5))
    return svg(264, 112, c, p.get("description"), vue=(400, 170))


FORMES = {"carte": _carte, "chemin": _chemin, "couverture": _couverture, "vignette": _vignette}


PARAMETRES = {
    "carte": {"origine", "echelle", "domaine", "plage", "cadre", "courbures", "niveaux", "points", "longueur", "textes"},
    "chemin": {"origine", "echelle", "domaine", "plage", "cadre", "courbures", "niveaux", "chemins", "textes", "alerte"},
    "couverture": {"centre", "ellipses", "opacites", "depart", "eta", "courbures", "pas", "rapport", "fleches",
                   "longueur", "bruit", "lot", "graine"},
    "vignette": set(),
}

def rendre(params: dict, theme: dict) -> str:
    forme = params.get("forme", "vignette")
    if forme not in FORMES:
        raise ValueError(f"niveaux : forme « {forme} » inconnue ({', '.join(FORMES)})")
    return FORMES[forme](params, theme)
