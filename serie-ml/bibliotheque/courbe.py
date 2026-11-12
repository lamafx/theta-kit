"""Famille Courbe : une fonction tracée, des points sur la courbe, des pentes, une courbe fantôme.

Chaque forme reprend la mise en page d'un canevas de `design/canevas-gabarits/` ; les valeurs
(θ, pentes, erreurs) viennent de calculs/ et les textes du contenu.

Formes : descente (ouverture), pentes (mécanisme), tangentes (la tangente seule et sa pente, sans pas ; épisode
06), comparaison (une case d'une comparaison),
plancher (piège), iterations (exemple chiffré), vignette (planches de la bibliothèque).

Autres courbes que la parabole (épisode 10 ; calculs.descente_gradient.FONCTIONS) : trace (une courbe nommée, ses
creux, une descente qui s'arrête dans un creux, une corde) ; couverture `vague` (courbe ondulée).
Couverture `tangentes` (épisode 06, A62) : la parabole et ses tangentes en plusieurs points.

Droites ŷ = a·x + b (épisode 04 ; calculs/droite.py, repère du plan de bibliotheque/_plan.py) : droite
(ouverture : la pente a et l'ordonnée à l'origine b, les deux réglages), pivot (a change, b fixe) et decalage
(b change, a fixe), avec leurs droites fantômes en gris de contexte.
"""

from __future__ import annotations

import math

from bibliotheque._svg import (
    GEIST, MONO, STIX, balise, cercle, esc, ligne, marqueur, n, nombre_fr, points, raccourcir, svg, texte_svg,
)
from bibliotheque._plan import axes, plan
from bibliotheque._planche import fond
from calculs import couvertures
from calculs.classification import echantillon_binaire, logistique, sigmoide
from calculs.descente_gradient import creux_f, erreur, iterations, iterations_f, pente, valeur_f
from calculs.droite import predire, segment


class Repere:
    """θ et J(θ) → pixels : origine (θ = 0, J = 0) et nombre de pixels par unité."""

    def __init__(self, origine, echelle, a: float = 1.0, c: float = 0.0):
        self.ox, self.oy = origine
        self.sx, self.sy = echelle
        self.a, self.c = a, c

    def x(self, theta: float) -> float:
        return self.ox + self.sx * theta

    def y(self, theta: float) -> float:
        return self.oy - self.sy * erreur(theta, self.a, self.c)

    def pt(self, theta: float) -> tuple[float, float]:
        return self.x(theta), self.y(theta)

    def pente_px(self, theta: float) -> float:
        """dy/dx en pixels de la tangente au point θ."""
        return -self.sy * pente(theta, self.a) / self.sx

    def parabole(self, t0: float, t1: float, **a) -> str:
        """La parabole entre t0 et t1, tracée exactement par une courbe de Bézier quadratique."""
        (x0, y0), (x1, y1) = self.pt(t0), self.pt(t1)
        # Point de contrôle : intersection des tangentes aux deux extrémités.
        p0, p1 = self.pente_px(t0), self.pente_px(t1)
        cx = (y1 - y0 + p0 * x0 - p1 * x1) / (p0 - p1)
        cy = y0 + p0 * (cx - x0)
        return balise("path", d=f"M{n(x0)} {n(y0)} Q{n(cx)} {n(cy)} {n(x1)} {n(y1)}", fill="none", **a)


def _repere(p) -> Repere:
    f = p.get("fonction", {})
    return Repere(p["origine"], p["echelle"], f.get("a", 1.0), f.get("c", 0.0))


def _textes(p) -> dict[str, str]:
    return p.get("textes", {})


# --- Formes -----------------------------------------------------------------------------

def _descente(p, th) -> str:
    """Ouverture : départ, gradient, premier pas, puis des pas de plus en plus courts."""
    r = _repere(p)
    t = _textes(p)
    larg, haut = p.get("cadre", [920, 420])
    gauche, droite = p.get("domaine", [-4, 4])
    axe = p["axe"]
    thetas = iterations(p["theta0"], p["eta"], p["pas"], r.a)
    (x0, y0), (x1, y1) = r.pt(thetas[0]), r.pt(thetas[1])
    pente0 = r.pente_px(thetas[0])
    ac, ob, gris = th["accent"], th["objet"], th["gris"]
    c = [
        "<defs>",
        marqueur("o-step", ac),
        marqueur("o-grad", gris),
        "</defs>",
        ligne(r.x(gauche), axe, r.x(droite), axe, stroke=th["filet"], stroke_width=2),
        r.parabole(gauche, droite, stroke=ob, stroke_width=3, stroke_linecap="round"),
        ligne(x0 - 60, y0 - 60 * pente0, x0 + 60, y0 + 60 * pente0,
              stroke=th["contexte"], stroke_width=1.5, stroke_dasharray="5 6"),
        ligne(x0, y0, x0 - 27, y0 - 27 * pente0, stroke=gris, stroke_width=2.5, marker_end="url(#o-grad)"),
        ligne(x0, y0, *raccourcir(x0, y0, x1, y1, 10), stroke=ac, stroke_width=3, marker_end="url(#o-step)"),
        balise("polyline", points=points(r.pt(v) for v in thetas[1:]), fill="none", stroke=ac,
               stroke_width=2, stroke_dasharray="1 7", stroke_linecap="round"),
        cercle(r.x(0), r.y(0), 7, fill="#FFFFFF", stroke=ob, stroke_width=2),
    ]
    rayons = [6.5, 5.5, 4.5, 4, 3.5]
    for k, v in enumerate(thetas[1:]):
        c.append(cercle(*r.pt(v), rayons[min(k, len(rayons) - 1)], fill=ac))
    c.append(cercle(x0, y0, 9, fill="#FFFFFF", stroke=ob, stroke_width=3))

    c.append(f'<g stroke="{ac}" stroke-width="5" stroke-linecap="round">')
    for a, b in zip(thetas, thetas[1:]):
        xa, xb = r.x(a), r.x(b)
        ecart = 4 if abs(xb - xa) >= 50 else 3.5
        c.append(ligne(_arrondi(xa + ecart), axe, _arrondi(xb - ecart), axe))
    c.append("</g>")
    c.append(ligne(r.x(0), axe - 10, r.x(0), axe + 10, stroke=ob, stroke_width=2))

    c.append(f'<g font-family="{STIX}" font-style="italic" font-size="24" fill="{ob}" text-anchor="middle">')
    for k in range(p.get("indices", 3)):
        c.append(f'<text x="{_arrondi(r.x(thetas[k]))}" y="{n(axe + 34)}">θ<tspan font-size="22" dy="5">{k}</tspan></text>')
    c.append(f'<text x="{n(r.x(0))}" y="{n(axe + 34)}">θ<tspan font-size="22" dy="-9">*</tspan></text>')
    c.append("</g>")
    c.append(texte_svg(t.get("axe", "paramètre θ"), x=float(r.x(droite)), y=float(axe + 32), text_anchor="end",
                       font_family=GEIST, font_size=22, fill=th["secondaire"]))
    c.append(
        f'<text x="{n(x0 + 19)}" y="{n(y0 - 42.8)}" font-family="{STIX}" font-size="24" fill="{th["secondaire"]}">'
        f'∇<tspan font-style="italic">J</tspan><tspan font-family="{GEIST}" font-size="22" dx="10">'
        f'{esc(t.get("gradient", ""))}</tspan></text>'
    )
    c.append(texte_svg(t.get("pas", ""), x=float(x0 + 85), y=float(y0 + 47.2), font_family=GEIST,
                       font_size=22, font_weight=500, fill=ac))
    c.append(texte_svg(t.get("courbe", ""), 26, x=640.0, y=150.0, font_family=GEIST, font_size=22,
                       fill=th["secondaire"]))
    c.append(texte_svg(t.get("minimum", ""), x=float(r.x(0)), y=float(r.y(0) - 36), text_anchor="middle",
                       font_family=GEIST, font_size=22, font_weight=500, fill=ob))
    return svg(larg, haut, c, p.get("description"), "display: block")


def _pentes(p, th) -> str:
    """Mécanisme : la tangente et le pas η × pente en deux points de la courbe."""
    r = _repere(p)
    t = _textes(p)
    larg, haut = p.get("cadre", [920, 460])
    gauche, droite = p.get("domaine", [-4, 4])
    axe, eta = p["axe"], p["eta"]
    ac, ob = th["accent"], th["objet"]
    pts = p["points"]
    c = ["<defs>", marqueur("pm-step", ac, taille=7), "</defs>",
         ligne(r.x(gauche), axe, r.x(droite), axe, stroke=th["filet"], stroke_width=2),
         r.parabole(gauche, droite, stroke=ob, stroke_width=3, stroke_linecap="round")]
    for pt in pts:
        x, y = r.pt(pt["theta"])
        s = r.pente_px(pt["theta"])
        c.append(ligne(x - 75, y - 75 * s, x + 75, y + 75 * s, stroke=ac, stroke_width=2, stroke_dasharray="6 6"))
    c.append(cercle(r.x(0), r.y(0), 7, fill="#FFFFFF", stroke=ob, stroke_width=2))
    rayons = [9, 8]
    for k, pt in enumerate(pts):
        c.append(cercle(*r.pt(pt["theta"]), rayons[min(k, 1)], fill="#FFFFFF", stroke=ob, stroke_width=3))
    for pt in pts:
        x, y = r.pt(pt["theta"])
        c.append(ligne(x, y + 8, x, axe - 8, stroke=th["contexte"], stroke_width=1.5, stroke_dasharray="3 5"))
    fleches = []
    for pt in pts:
        x = r.x(pt["theta"])
        deplacement = -eta * pente(pt["theta"], r.a)
        fin = r.x(pt["theta"] + deplacement) - 6.5
        fleches.append((x, fin, deplacement))
        c.append(ligne(_arrondi(x), axe, _arrondi(fin), axe, stroke=ac, stroke_width=5, stroke_linecap="round",
                       marker_end="url(#pm-step)"))
    for pt in pts:
        x, y = r.pt(pt["theta"])
        dx, dy = pt.get("decalage", [85, 80])
        c.append(texte_svg(f'{t.get("pente", "pente")} {nombre_fr(pente(pt["theta"], r.a))}', x=float(_arrondi(x + dx)),
                           y=float(_arrondi(y + dy)), font_family=GEIST, font_size=22, font_weight=500, fill=ob))
    for x, fin, deplacement in fleches:
        centre = max((_arrondi(x) + _arrondi(fin)) / 2, _arrondi(x) + 14)
        c.append(texte_svg(f'{t.get("pas", "pas")} = {nombre_fr(abs(deplacement))}', x=float(centre),
                           y=float(axe + 34), text_anchor="middle", font_family=MONO, font_size=22,
                           font_weight=500, fill=ac))
    c.append(texte_svg(t.get("minimum", ""), x=float(r.x(0)), y=float(r.y(0) - 30), text_anchor="middle",
                       font_family=GEIST, font_size=22, font_weight=500, fill=ob))
    c.append(texte_svg(t.get("courbe", ""), 26, x=640.0, y=150.0, font_family=GEIST, font_size=22,
                       fill=th["secondaire"]))
    c.append(texte_svg(t.get("axe", "paramètre θ"), x=float(r.x(droite)), y=float(axe + 34), text_anchor="end",
                       font_family=GEIST, font_size=22, fill=th["secondaire"]))
    return svg(larg, haut, c, p.get("description"), "margin-top: 36px; display: block")


def _tangentes(p, th) -> str:
    """Mécanisme (épisode 06, session de design n° 2) : la courbe et sa tangente en un ou plusieurs points, la
    pente de chacune écrite à côté ; sans pas ni gradient. `triangle` (par point) : un pas de 1 sur la tangente et
    la montée qui vaut la pente."""
    r = _repere(p)
    t = _textes(p)
    larg, haut = p.get("cadre", [920, 440])
    gauche, droite = p.get("domaine", [-4, 4])
    axe = p["axe"]
    ac, ob = th["accent"], th["objet"]
    pts = p["points"]
    c = [ligne(r.x(gauche), axe, r.x(droite), axe, stroke=th["filet"], stroke_width=2),
         r.parabole(gauche, droite, stroke=ob, stroke_width=3, stroke_linecap="round")]
    for pt in pts:
        x, y = r.pt(pt["theta"])
        s = r.pente_px(pt["theta"])
        demi = max(pt.get("demi", 90), r.sx + 24) if pt.get("triangle") else pt.get("demi", 90)
        c.append(ligne(x - demi, y - demi * s, x + demi, y + demi * s, stroke=ac, stroke_width=2.5,
                       stroke_dasharray="7 6"))
        c.append(ligne(x, y + 10, x, axe - 8, stroke=th["contexte"], stroke_width=1.5, stroke_dasharray="3 5"))
        if pt.get("triangle"):
            x1, y1 = x + r.sx, y + s * r.sx
            c.append(ligne(x, y, x1, y, stroke=ob, stroke_width=1.5, stroke_dasharray="4 4"))
            c.append(ligne(x1, y, x1, y1, stroke=ac, stroke_width=3))
            c.append(texte_svg("1", x=float(x + r.sx / 2), y=float(y - 10 if s > 0 else y + 28), text_anchor="middle",
                               font_family=GEIST, font_size=22, fill=th["secondaire"]))
    c.append(cercle(r.x(0), r.y(0), 7, fill="#FFFFFF", stroke=ob, stroke_width=2))
    for pt in pts:
        c.append(cercle(*r.pt(pt["theta"]), 9, fill="#FFFFFF", stroke=ob, stroke_width=3))
        x, y = r.pt(pt["theta"])
        dx, dy = pt.get("decalage", [20, -24])
        c.append(texte_svg(f'{t.get("pente", "pente")} {nombre_fr(pente(pt["theta"], r.a))}', x=float(_arrondi(x + dx)),
                           y=float(_arrondi(y + dy)), font_family=GEIST, font_size=22, font_weight=500, fill=ac))
    c.append(texte_svg(t.get("minimum", ""), x=float(r.x(0)), y=float(r.y(0) - 26), text_anchor="middle",
                       font_family=GEIST, font_size=22, font_weight=500, fill=ob))
    c.append(texte_svg(t.get("courbe", ""), 26, x=float(p.get("x_courbe", 640)), y=60.0, font_family=GEIST,
                       font_size=22, fill=th["secondaire"]))
    c.append(texte_svg(t.get("axe", "paramètre θ"), x=float(r.x(droite) - 4), y=float(axe + 34), text_anchor="end",
                       font_family=GEIST, font_size=22, fill=th["secondaire"]))
    return svg(larg, haut, c, p.get("description"), "display: block")


def _trace(p, th) -> str:
    """Page (épisode 10, session de design n° 2) : la courbe `courbe` (ondulee, parabole, fond_plat) dans le repère du
    plan ; `creux` marque ses minimums locaux, le plus bas étiqueté `textes.minimum_global`, les autres
    `textes.minimum_local` ; `descentes` : départ, eta, pas (calculés par iterations_f), style accent ou objet,
    texte, ancre et decalage de l'étiquette ; `corde` [x1, x2] : le segment entre deux points de la courbe."""
    r = plan(p)
    t = _textes(p)
    nom = p["courbe"]
    larg, haut = p.get("cadre", [920, 450])
    (x0, x1), ac, ob = p["domaine"], th["accent"], th["objet"]
    # `position_x` : l'étiquette de l'axe des x posée ailleurs qu'au bout de l'axe (une courbe qui remonte l'y croise).
    t_axes = {k: v for k, v in t.items() if not (k == "x" and p.get("position_x"))}
    c = ["<defs>", marqueur("tr-pas", ac, taille=6), "</defs>"] + axes(r, p["domaine"], p["plage"], th, t_axes)
    if p.get("position_x") and t.get("x"):
        c.append(texte_svg(t["x"], 26, x=float(p["position_x"][0]), y=float(p["position_x"][1]), text_anchor="end",
                           font_family=GEIST, font_size=22, fill=th["secondaire"]))
    k = 240
    sous_courbe = len(c)  # les repères passent sous la courbe
    pts = [r.pt(x0 + (x1 - x0) * i / k, valeur_f(nom, x0 + (x1 - x0) * i / k)) for i in range(k + 1)]
    c.append(balise("polyline", points=points(pts), fill="none", stroke=ob, stroke_width=3, stroke_linejoin="round",
                    stroke_linecap="round"))
    etiquettes = []
    if p.get("corde"):
        a, b = p["corde"]
        (xa, ya), (xb, yb) = r.pt(a, valeur_f(nom, a)), r.pt(b, valeur_f(nom, b))
        c.append(ligne(xa, ya, xb, yb, stroke=ac, stroke_width=2.5, stroke_dasharray="8 6"))
        c += [cercle(xa, ya, 7, fill=ac), cercle(xb, yb, 7, fill=ac)]
        if t.get("corde"):
            dx, dy = p.get("decalage_corde", [0, -18])
            etiquettes.append(texte_svg(t["corde"], 26, x=float(round((xa + xb) / 2 + dx)), y=float(round((ya + yb) / 2 + dy)),
                                        text_anchor="middle", font_family=GEIST, font_size=22, font_weight=500, fill=ac))
    if p.get("creux"):
        creux = creux_f(nom, x0, x1)
        plus_bas = min(creux, key=lambda m: m[1]) if creux else None
        for m in creux:
            x, y = r.pt(*m)
            c.append(cercle(x, y, 7, fill="#FFFFFF", stroke=ob, stroke_width=2.5))
            texte = t.get("minimum_global" if m == plus_bas else "minimum_local", "")
            etiquettes.append(texte_svg(texte, x=float(round(x)), y=float(round(y + 40)), text_anchor="middle",
                                        font_family=GEIST, font_size=22, font_weight=500, fill=ob))
    for d in p.get("descentes", []):
        couleur = ac if d.get("style", "accent") == "accent" else ob
        thetas = iterations_f(nom, d["depart"], d["eta"], d["pas"])
        etapes = [r.pt(x, valeur_f(nom, x)) for x in thetas]
        for (xa, ya), (xb, yb) in zip(etapes, etapes[1:]):
            if math.hypot(xb - xa, yb - ya) > 18:
                c.append(ligne(xa, ya, *raccourcir(xa, ya, xb, yb, 9), stroke=couleur, stroke_width=2,
                               marker_end="url(#tr-pas)"))
        c.append(f'<g fill="{couleur}">' + "".join(cercle(x, y, 4.5) for x, y in etapes[1:]) + "</g>")
        c.append(cercle(*etapes[0], 9, fill="#FFFFFF", stroke=couleur, stroke_width=3))
        if d.get("texte"):
            xe, ye = etapes[min(d.get("ancre", 0), len(etapes) - 1)]
            dx, dy = d.get("decalage", [16, -16])
            etiquettes.append(texte_svg(d["texte"], 26, x=float(round(xe + dx)), y=float(round(ye + dy)),
                                        font_family=GEIST, font_size=22, font_weight=500, fill=couleur))
    # Session de design n° 4 : `reperes` (droites horizontales en tirets, comme les asymptotes 0 et 1 de la
    # sigmoïde) et `points` (valeurs marquées sur la courbe, avec leur étiquette).
    for rp in p.get("reperes", []):
        y = r.y(rp["y"])
        c.insert(sous_courbe, ligne(r.x(x0), y, r.x(x1), y, stroke=th["contexte"], stroke_width=1.5,
                                    stroke_dasharray="6 6"))
        sous_courbe += 1
        if rp.get("texte"):
            gauche = rp.get("cote", "droite") == "gauche"
            etiquettes.append(texte_svg(rp["texte"], 26, x=float(round(r.x(x0) + 8 if gauche else r.x(x1) - 8)),
                                        y=float(round(y - 10)), text_anchor="start" if gauche else "end",
                                        font_family=GEIST, font_size=22, fill=th["secondaire"]))
    for pt in p.get("points", []):
        x, y = r.pt(pt["x"], valeur_f(nom, pt["x"]))
        couleur = ac if pt.get("style", "accent") == "accent" else ob
        c.append(cercle(x, y, 8, fill=couleur, stroke="#FFFFFF", stroke_width=2.5))
        if pt.get("texte"):
            dx, dy = pt.get("decalage", [16, -16])
            etiquettes.append(texte_svg(pt["texte"], 26, x=float(round(x + dx)), y=float(round(y + dy)),
                                        text_anchor=pt.get("ancre", "start"), font_family=GEIST, font_size=22,
                                        font_weight=500, fill=couleur))
    if t.get("courbe"):
        xc, yc = p.get("position_courbe", [larg - 40, 40])
        etiquettes.append(texte_svg(t["courbe"], 26, x=float(xc), y=float(yc), text_anchor="end", font_family=GEIST,
                                    font_size=22, fill=th["secondaire"]))
    return svg(larg, haut, c + etiquettes, p.get("description"), "display: block")


def _logistique(p, th) -> str:
    """Page (épisode 17, session de design n° 4) : des exemples de classe 0 (en bas, gris de contexte) et de
    classe 1 (en haut, objet), tirés par calculs.classification.echantillon_binaire (`source` : n, w, b, domaine,
    graine) ; la sigmoïde ajustée par maximum de vraisemblance (calculs.classification.logistique) en accent ;
    avec `seuil`, la probabilité 0,5 en tirets et l'abscisse où elle est atteinte. Textes : x, y, courbe, seuil,
    zero, un (étiquettes des deux rangées)."""
    r = plan(p)
    t = _textes(p)
    larg, haut = p.get("cadre", [920, 440])
    (x0, x1), ac, ob = p["domaine"], th["accent"], th["objet"]
    src = p["source"]
    pts = echantillon_binaire(src["n"], src["w"], src["b"], src.get("domaine", p["domaine"]), src["graine"])
    m = logistique(pts)
    c = axes(r, p["domaine"], p["plage"], th, t)
    etiquettes = []
    if p.get("seuil"):
        y = r.y(0.5)
        c.append(ligne(r.x(x0), y, r.x(x1), y, stroke=th["contexte"], stroke_width=1.5, stroke_dasharray="6 6"))
        xs = r.x(m["seuil"])
        c.append(ligne(xs, r.y(0), xs, r.y(1), stroke=ac, stroke_width=2, stroke_dasharray="6 6"))
        if t.get("seuil"):
            etiquettes.append(texte_svg(t["seuil"], 26, x=float(round(xs - 14)), y=float(round(y - 14)),
                                        text_anchor="end", font_family=GEIST, font_size=22, font_weight=500, fill=ac))
    k = 200
    courbe = [r.pt(x0 + (x1 - x0) * i / k, sigmoide(m["w"] * (x0 + (x1 - x0) * i / k) + m["b"])) for i in range(k + 1)]
    c.append(balise("polyline", points=points(courbe), fill="none", stroke=ac, stroke_width=3.5,
                    stroke_linejoin="round", stroke_linecap="round"))
    c.append(f'<g fill="{th["contexte"]}">' + "".join(cercle(*r.pt(x, y), 8) for x, y in pts if y == 0) + "</g>")
    c.append(f'<g fill="{ob}">' + "".join(cercle(*r.pt(x, y), 8) for x, y in pts if y == 1) + "</g>")
    for cle, y in (("zero", 0), ("un", 1)):
        if t.get(cle):
            etiquettes.append(texte_svg(t[cle], 26, x=float(round(r.x(x0) - 14)), y=float(round(r.y(y) + 8)),
                                        text_anchor="end", font_family=GEIST, font_size=22, fill=th["secondaire"]))
    if t.get("courbe"):
        xc, yc = p.get("position_courbe", [larg - 40, 40])
        etiquettes.append(texte_svg(t["courbe"], 26, x=float(xc), y=float(yc), text_anchor="end", font_family=GEIST,
                                    font_size=22, font_weight=500, fill=ac))
    return svg(larg, haut, c + etiquettes, p.get("description"), "display: block")


def _comparaison(p, th) -> str:
    """Une case de comparaison : même courbe, même départ, seul η change."""
    r = _repere(p)
    larg, haut = p.get("cadre", [280, 220])
    gauche, droite = p["domaine"]
    couleur = th["alerte"] if p.get("alerte") else th["accent"]
    ob = th["objet"]
    thetas = iterations(p["theta0"], p["eta"], p["pas"], r.a)
    xmin = r.x(0)
    c = [r.parabole(gauche, droite, stroke=ob, stroke_width=2.5),
         cercle(xmin, r.y(0), 5, fill="#FFFFFF", stroke=ob, stroke_width=2),
         balise("polyline", points=points(r.pt(v) for v in thetas), fill="none", stroke=couleur, stroke_width=2),
         f'<g fill="{couleur}">']
    for v in thetas[1:]:
        d = abs(r.x(v) - xmin)
        if d < 4:  # confondu avec le minimum
            continue
        c.append(cercle(*r.pt(v), 3.5 if d < 8 else 4))
    c.append("</g>")
    c.append(cercle(*r.pt(thetas[0]), 6.5, fill="#FFFFFF", stroke=ob, stroke_width=2.5))
    return svg(larg, haut, c, p.get("description"))


def _plancher(p, th) -> str:
    """Piège : au minimum, la pente est nulle mais l'erreur reste au-dessus de zéro."""
    r = _repere(p)
    t = _textes(p)
    larg, haut = p.get("cadre", [920, 440])
    gauche, droite = p.get("domaine", [-4, 4])
    al, ob = th["alerte"], th["objet"]
    zero = r.oy
    xm, ym = r.pt(0)
    c = [
        ligne(40, zero, 880, zero, stroke=ob, stroke_width=1.5, stroke_dasharray="4 6"),
        texte_svg(t.get("zero", ""), x=40.0, y=float(zero - 12), font_family=GEIST, font_size=22, fill=th["secondaire"]),
        r.parabole(gauche, droite, stroke=ob, stroke_width=3, stroke_linecap="round"),
        ligne(xm - 130, ym, xm + 130, ym, stroke=al, stroke_width=2.5, stroke_dasharray="7 6"),
        texte_svg(t.get("pente", ""), x=float(xm + 144), y=float(ym + 6), font_family=GEIST, font_size=22,
                  font_weight=500, fill=al),
        ligne(xm, ym + 12, xm, zero - 8, stroke=al, stroke_width=3),
        ligne(xm - 12, zero - 8, xm + 12, zero - 8, stroke=al, stroke_width=3),
        ligne(xm - 12, ym + 12, xm + 12, ym + 12, stroke=al, stroke_width=3),
        texte_svg(t.get("ecart", ""), x=float(xm + 24), y=float((ym + 12 + zero - 8) / 2 + 7), font_family=GEIST,
                  font_size=22, font_weight=600, fill=al),
        cercle(xm, ym, 8, fill="#FFFFFF", stroke=ob, stroke_width=3),
        texte_svg(t.get("courbe", ""), 26, x=700.0, y=110.0, font_family=GEIST, font_size=22, fill=th["secondaire"]),
        texte_svg(t.get("axe", "paramètre θ"), x=880.0, y=float(zero + 32), text_anchor="end", font_family=GEIST,
                  font_size=22, fill=th["secondaire"]),
    ]
    return svg(larg, haut, c, p.get("description"), "margin-top: 40px; display: block")


def _iterations(p, th) -> str:
    """Exemple chiffré : la courbe échantillonnée et les θ successifs, avec leur erreur."""
    r = _repere(p)
    t = _textes(p)
    larg, haut = p.get("cadre", [920, 360])
    ac, ob = th["accent"], th["objet"]
    de, a, pas_ech = p["echantillons"]
    nb = round((a - de) / pas_ech)
    courbe = [r.pt(de + k * pas_ech) for k in range(nb + 1)]
    thetas = iterations(p["theta0"], p["eta"], p["pas"], r.a)
    axe = r.oy
    c = [
        ligne(80, axe, 860, axe, stroke=th["filet"], stroke_width=2),
        balise("polyline", points=points(courbe), fill="none", stroke=ob, stroke_width=3,
               stroke_linejoin="round", stroke_linecap="round"),
        balise("polyline", points=points(r.pt(v) for v in thetas), fill="none", stroke=ac, stroke_width=2),
        cercle(r.x(0), axe, 6, fill="#FFFFFF", stroke=ob, stroke_width=2),
    ]
    rayons = [6, 5.5, 5]
    for k, v in enumerate(thetas[1:]):
        c.append(cercle(*r.pt(v), rayons[min(k, 2)], fill=ac))
    c.append(cercle(*r.pt(thetas[0]), 8, fill="#FFFFFF", stroke=ob, stroke_width=3))
    c.append(f'<g font-family="{MONO}" font-size="22" font-weight="500" fill="{th["secondaire"]}">')
    decalages = p.get("decalages", [])
    for k, v in enumerate(thetas):
        x, y = r.pt(v)
        dx, dy = decalages[k] if k < len(decalages) else (20, 4)
        valeur = nombre_fr(erreur(v, r.a, r.c))
        etiquette = f'{t.get("erreur", "J")} = {valeur}' if k == 0 else valeur
        c.append(f'<text x="{n(x + dx)}" y="{n(y + dy)}">{esc(etiquette)}</text>')
    c.append("</g>")
    c.append(texte_svg(t.get("origine", "θ = 0"), x=float(r.x(0)), y=float(axe + 30), text_anchor="middle",
                       font_family=GEIST, font_size=22, fill=th["secondaire"]))
    c.append(texte_svg(t.get("axe", "paramètre θ"), x=860.0, y=float(axe + 30), text_anchor="end",
                       font_family=GEIST, font_size=22, fill=th["secondaire"]))
    return svg(larg, haut, c, p.get("description"), "margin-top: 32px; display: block")


def _vignette(p, th) -> str:
    """Planches de la bibliothèque : une courbe en U et des pas vers le minimum."""
    ac = th["accent"]
    pts = [(78, 68), (122, 105), (158, 125), (182, 133)]
    if th["nom"] == "couverture":
        c = [ligne(20, 150, 380, 150, stroke=ac, stroke_opacity="0.25", stroke_width=1.5),
             balise("path", d="M30 140 C150 140 150 30 370 30", fill="none", stroke=ac, stroke_opacity="0.3",
                    stroke_width=2),
             balise("path", d="M30 20 Q200 260 370 20", fill="none", stroke=ac, stroke_width=2.5),
             f'<g fill="{ac}">' + "".join(cercle(x, y, rr) for (x, y), rr in zip(pts, [4.5, 4, 3.5, 3])) + "</g>",
             cercle(200, 140, 5, fill=th["carte"], stroke=th["clair"], stroke_width=2)]
        return svg(400, 148, c, p.get("description"), vue=(400, 170))
    c = [ligne(20, 150, 380, 150, stroke=th["filet"], stroke_width=2),
         balise("path", d="M30 20 Q200 260 370 20", fill="none", stroke=th["objet"], stroke_width=3),
         balise("polyline", points=points(pts), fill="none", stroke=ac, stroke_width=2.5),
         f'<g fill="{ac}">' + "".join(cercle(x, y, rr) for (x, y), rr in zip(pts[1:], [5, 4.5, 4])) + "</g>",
         cercle(78, 68, 7, fill="#FFFFFF", stroke=th["objet"], stroke_width=3),
         cercle(200, 140, 6, fill="#FFFFFF", stroke=th["objet"], stroke_width=2)]
    return svg(264, 112, c, p.get("description"), vue=(400, 170))


# --- Droites ŷ = a·x + b (épisode 04) -------------------------------------------------------

def _trait(r, a, b, p, **attributs) -> str:
    (xa, ya), (xb, yb) = segment(a, b, p["domaine"], p["plage"])
    return ligne(*r.pt(xa, ya), *r.pt(xb, yb), **attributs)


def _droite(p, th) -> str:
    """Ouverture : la droite, sa pente a (un pas de 1 en x, a en y) et son ordonnée à l'origine b."""
    r = plan(p)
    t = _textes(p)
    larg, haut = p.get("cadre", [920, 420])
    a, b = p["a"], p["b"]
    ac, ob, sec = th["accent"], th["objet"], th["secondaire"]
    c = axes(r, p["domaine"], p["plage"], th, t)
    c.append(_trait(r, a, b, p, stroke=ob, stroke_width=3, stroke_linecap="round"))
    if "x" in p:  # une entrée x et la prédiction ŷ lue sur la droite
        xv = p["x"]
        px, py = r.pt(xv, predire(xv, a, b))
        x_axe, y_axe = r.x(max(0, p["domaine"][0])), r.y(max(0, p["plage"][0]))
        c.append(ligne(px, y_axe, px, py + 9, stroke=th["contexte"], stroke_width=1.5, stroke_dasharray="4 5"))
        c.append(ligne(px - 9, py, x_axe, py, stroke=th["contexte"], stroke_width=1.5, stroke_dasharray="4 5"))
        c.append(cercle(px, py, 8, fill="#FFFFFF", stroke=ob, stroke_width=3))
        if t.get("entree"):
            c.append(texte_svg(t["entree"], 24, x=float(px), y=float(y_axe + 32), text_anchor="middle",
                               font_family=GEIST, font_size=22, fill=ob))
        if t.get("sortie"):
            c.append(texte_svg(t["sortie"], 24, x=float(x_axe - 14), y=float(py + 8), text_anchor="end",
                               font_family=GEIST, font_size=22, fill=ob))
    if "triangle" in p:  # la pente : un pas de 1 en x, la droite monte de a
        xt = p["triangle"]
        (x0, y0), (x1, y1) = r.pt(xt, predire(xt, a, b)), r.pt(xt + 1, predire(xt + 1, a, b))
        c.append(ligne(x0, y0, x1, y0, stroke=sec, stroke_width=2, stroke_dasharray="5 5"))
        c.append(ligne(x1, y0, x1, y1, stroke=ac, stroke_width=4, stroke_linecap="round"))
        c.append(texte_svg(t.get("un", "1"), x=float((x0 + x1) / 2), y=float(y0 + (26 if a >= 0 else -12)),
                           text_anchor="middle", font_family=GEIST, font_size=22, fill=sec))
        if t.get("a"):
            c.append(texte_svg(t["a"], 26, x=float(x1 + 16), y=float((y0 + y1) / 2 + 8), font_family=GEIST,
                               font_size=22, font_weight=500, fill=ac))
    xb, yb = r.pt(0, b)
    c.append(cercle(xb, yb, 7.5, fill=ac))
    if t.get("b"):
        c.append(texte_svg(t["b"], 26, x=float(xb + 18), y=float(yb + 30), font_family=GEIST, font_size=22,
                           font_weight=500, fill=ac))
    if t.get("droite"):
        dx, dy = p.get("decalage", [0, 0])
        _, (xe, ye) = segment(a, b, p["domaine"], p["plage"])
        x, y = r.pt(xe, ye)
        c.append(texte_svg(t["droite"], 26, x=float(x + dx), y=float(y + dy), text_anchor="end", font_family=GEIST,
                           font_size=22, fill=sec))
    return svg(larg, haut, c, p.get("description"), "display: block")


def _arc(cx, cy, rayon, angle0, angle1) -> str:
    """Arc de cercle de angle0 à angle1 (radians, sens de l'écran), raccourci pour la pointe de flèche."""
    sens = 1 if angle1 > angle0 else -1
    fin = angle1 - sens * 7 / rayon
    x0, y0 = cx + rayon * math.cos(angle0), cy + rayon * math.sin(angle0)
    x1, y1 = cx + rayon * math.cos(fin), cy + rayon * math.sin(fin)
    return f"M{n(x0)} {n(y0)} A{n(rayon)} {n(rayon)} 0 0 {1 if sens > 0 else 0} {n(x1)} {n(y1)}"


def _pivot(p, th) -> str:
    """La pente a change, b reste fixe : la droite tourne autour du point (0, b)."""
    r = plan(p)
    t = _textes(p)
    larg, haut = p.get("cadre", [440, 300])
    a, b = p["a"], p["b"]
    ac, ob = th["accent"], th["objet"]
    c = ["<defs>", marqueur("dp-arc", ac, taille=7), "</defs>"] + axes(r, p["domaine"], p["plage"], th, t)
    for af in p.get("fantomes", []):
        c.append(_trait(r, af, b, p, stroke=th["contexte"], stroke_width=2.5, stroke_linecap="round"))
    c.append(_trait(r, a, b, p, stroke=ac, stroke_width=3, stroke_linecap="round"))
    cx, cy = r.pt(0, b)
    if p.get("fantomes"):
        rayon = p.get("rayon", 160)
        a0 = math.atan2(-p["fantomes"][-1] * r.sy, r.sx)
        a1 = math.atan2(-a * r.sy, r.sx)
        c.append(balise("path", d=_arc(cx, cy, rayon, a0, a1), fill="none", stroke=ac, stroke_width=2.5,
                        marker_end="url(#dp-arc)"))
        if t.get("a"):  # dans l'angle entre les deux droites, après l'arc
            milieu = (a0 + a1) / 2
            c.append(texte_svg(t["a"], 24, x=float(cx + (rayon + 12) * math.cos(milieu)),
                               y=float(cy + (rayon + 12) * math.sin(milieu) + 7), font_family=GEIST, font_size=22,
                               font_weight=500, fill=ac))
    c.append(cercle(cx, cy, 7, fill="#FFFFFF", stroke=ob, stroke_width=2.5))
    if t.get("b"):
        c.append(texte_svg(t["b"], 26, x=float(cx + 16), y=float(cy + 28), font_family=GEIST, font_size=22, fill=ob))
    return svg(larg, haut, c, p.get("description"))


def _decalage(p, th) -> str:
    """b change, la pente a reste fixe : la droite monte ou descend sans tourner."""
    r = plan(p)
    t = _textes(p)
    larg, haut = p.get("cadre", [440, 300])
    a, b = p["a"], p["b"]
    ac = th["accent"]
    c = ["<defs>", marqueur("dd-fleche", ac, taille=7), "</defs>"] + axes(r, p["domaine"], p["plage"], th, t)
    for bf in p.get("fantomes", []):
        c.append(_trait(r, a, bf, p, stroke=th["contexte"], stroke_width=2.5, stroke_linecap="round"))
    c.append(_trait(r, a, b, p, stroke=ac, stroke_width=3, stroke_linecap="round"))
    if p.get("fantomes"):
        bf = p["fantomes"][-1]
        fleches = p.get("fleches", [0])
        for xf in fleches:
            x, y0 = r.pt(xf, predire(xf, a, bf))
            y1 = r.y(predire(xf, a, b))
            sens = 1 if y1 > y0 else -1
            c.append(ligne(x, y0 + sens * 5, x, y1 - sens * 9, stroke=ac, stroke_width=3, marker_end="url(#dd-fleche)"))
        if t.get("b"):
            ym = (r.y(predire(fleches[0], a, bf)) + r.y(predire(fleches[0], a, b))) / 2
            c.append(texte_svg(t["b"], 24, x=float(r.x(fleches[0]) + 16), y=float(ym + 8), font_family=GEIST,
                               font_size=22, font_weight=500, fill=ac))
    return svg(larg, haut, c, p.get("description"))


def _couverture(p, th) -> str:
    """Fond de couverture : un éventail de droites qui pivotent autour d'un point ; marquée, l'une d'elles. Avec
    `vague` (épisode 10) : une courbe à plusieurs creux et une descente arrêtée dans un creux local. Avec
    `tangentes` (épisode 06, A62) : la courbe en U et ses tangentes."""
    ac = th["accent"]
    if "vague" in p:
        return _vague(p["vague"], th)
    if "tangentes" in p:
        return _couverture_tangentes(p["tangentes"], th)
    pivot = p.get("pivot", [880, 190])
    angles = p.get("angles", [-80, -62, -47, -34, -22, -11, 0, 11, 23])
    marquee = p.get("marquee", 4)
    c = [f'<g stroke="{ac}" stroke-width="1.5" stroke-linecap="round">']
    droites = couvertures.eventail(pivot, angles)
    for k, (x0, y0, x1, y1, op) in enumerate(droites):
        if k != marquee:
            c.append(ligne(x0, y0, x1, y1, stroke_opacity=f"{op:g}"))
    c.append("</g>")
    x0, y0, x1, y1, _ = droites[marquee]
    c.append(ligne(x0, y0, x1, y1, stroke=ac, stroke_width=2.5, stroke_opacity=str(couvertures.MARQUE),
                   stroke_linecap="round"))
    c.append(cercle(*pivot, 8, fill=th["carte"], stroke=th["clair"], stroke_width=2.5))
    return fond(c)


def _vague(v, th) -> str:
    """Courbe de fond (`courbe` : une courbe nommée de calculs.descente_gradient, ondulée par défaut ; repère
    `origine`, `echelle` en pixels du fond, `domaine`) ; la descente (depart, eta, pas) en points, le départ cerclé ;
    `epaisseur` du trait (3,5 par défaut : plus pour un geste dont la zone est petite) ; opacité du fond
    (calculs.couvertures.opacite)."""
    ac = th["accent"]
    nom = v.get("courbe", "ondulee")
    (ox, oy), (sx, sy), (x0, x1) = v["origine"], v["echelle"], v["domaine"]
    def px(x):
        return ox + sx * x, oy - sy * valeur_f(nom, x)
    k = 160
    pts = [px(x0 + (x1 - x0) * i / k) for i in range(k + 1)]
    epaisseur = v.get("epaisseur", 3.5)
    c = [f'<g stroke="{ac}" stroke-width="{epaisseur:g}" stroke-linecap="round" fill="none">']
    for (xa, ya), (xb, yb) in zip(pts, pts[1:]):
        opacite = max(couvertures.opacite((xa + xb) / 2, (ya + yb) / 2), 0.35)
        c.append(ligne(xa, ya, xb, yb, stroke_opacity=f"{opacite:g}"))
    c.append("</g>")
    # Session de design n° 4 : `binaires` (épisode 17) : des exemples posés sur les droites 0 et 1 de la courbe
    # en S, tirés autour de son centre ; `marque` : un point cerclé sur la courbe, sans descente.
    if "binaires" in v:
        b = v["binaires"]
        for x, y in echantillon_binaire(b.get("n", 26), b.get("w", 2.2), b.get("b", 0.0), [x0, x1], b.get("graine", 5)):
            xp, yp = ox + sx * x, oy - sy * y
            c.append(cercle(xp, yp, 6 * epaisseur / 3.5, fill=ac,
                            fill_opacity=f"{max(couvertures.opacite(xp, yp), 0.3):g}"))
    if "depart" in v:
        etapes = [px(x) for x in iterations_f(nom, v["depart"], v["eta"], v["pas"])]
        for x, y in etapes[1:]:
            c.append(cercle(x, y, 5, fill=ac, fill_opacity=f"{max(couvertures.opacite(x, y), 0.5):g}"))
        c.append(cercle(*etapes[0], 9, fill=th["carte"], stroke=th["clair"], stroke_width=2.5))
    elif "marque" in v:
        c.append(cercle(*px(v["marque"]), 9 * epaisseur / 3.5, fill=th["carte"], stroke=th["clair"],
                        stroke_width=2.5 * epaisseur / 3.5))
    return fond(c)


def _couverture_tangentes(t, th) -> str:
    """La parabole J(θ) = θ² de fond (repère `origine`, `echelle` en pixels du fond, `domaine`) et ses tangentes
    en tirets aux `points` (par défaut −2, 0, 3 : elle descend, elle est plate au creux, elle monte, comme la page
    Mécanisme de 06) ; marquée et cerclée, celle du point `marque`. Opacité du fond (calculs.couvertures.opacite)."""
    ac = th["accent"]
    r = Repere(t["origine"], t["echelle"])
    gauche, droite = t["domaine"]
    pts_tangentes = t.get("points", [-2, 0, 3])
    marque = t.get("marque", pts_tangentes[-1])
    longueur = t.get("longueur", 280)  # longueur de chaque tangente, en pixels, quelle que soit sa pente
    k = 120
    pts = [r.pt(gauche + (droite - gauche) * i / k) for i in range(k + 1)]
    c = [f'<g stroke="{ac}" stroke-width="3.5" stroke-linecap="round" fill="none">']
    for (xa, ya), (xb, yb) in zip(pts, pts[1:]):
        opacite = max(couvertures.opacite((xa + xb) / 2, (ya + yb) / 2), 0.35)
        c.append(ligne(xa, ya, xb, yb, stroke_opacity=f"{opacite:g}"))
    c.append("</g>")
    for theta in pts_tangentes:
        x, y = r.pt(theta)
        s = r.pente_px(theta)
        dx = longueur / 2 / math.hypot(1, s)
        marquee = theta == marque
        opacite = couvertures.MARQUE if marquee else max(couvertures.opacite(x, y), 0.45)
        c.append(ligne(x - dx, y - dx * s, x + dx, y + dx * s, stroke=ac, stroke_width=3 if marquee else 2,
                       stroke_opacity=f"{opacite:g}", stroke_dasharray="10 8", stroke_linecap="round"))
    for theta in pts_tangentes:
        if theta != marque:
            x, y = r.pt(theta)
            c.append(cercle(x, y, 6, fill=ac, fill_opacity=f"{max(couvertures.opacite(x, y), 0.5):g}"))
    c.append(cercle(*r.pt(marque), 9, fill=th["carte"], stroke=th["clair"], stroke_width=2.5))
    return fond(c)


def _arrondi(x: float) -> int:
    """Arrondi au pixel, demi vers le haut (comme les canevas)."""
    return int(x + 0.5) if x >= 0 else -int(-x + 0.5)


FORMES = {
    "descente": _descente,
    "pentes": _pentes,
    "tangentes": _tangentes,
    "trace": _trace,
    "logistique": _logistique,
    "comparaison": _comparaison,
    "plancher": _plancher,
    "iterations": _iterations,
    "droite": _droite,
    "pivot": _pivot,
    "decalage": _decalage,
    "couverture": _couverture,
    "vignette": _vignette,
}


# Paramètres lus par chaque forme (contrôlés par serie verifier).
_REPERE = {"origine", "echelle", "fonction", "domaine", "cadre"}
_PLAN = {"origine", "echelle", "domaine", "plage", "cadre"}
PARAMETRES = {
    "descente": _REPERE | {"axe", "theta0", "eta", "pas", "indices", "textes"},
    "pentes": _REPERE | {"axe", "eta", "points", "textes"},
    "tangentes": _REPERE | {"axe", "points", "textes", "x_courbe"},
    "trace": _PLAN | {"courbe", "creux", "descentes", "corde", "decalage_corde", "position_courbe", "position_x",
                       "reperes", "points", "textes"},
    "logistique": _PLAN | {"source", "seuil", "position_courbe", "textes"},
    "comparaison": _REPERE | {"theta0", "eta", "pas", "alerte"},
    "plancher": _REPERE | {"textes"},
    "iterations": _REPERE | {"echantillons", "theta0", "eta", "pas", "decalages", "textes"},
    "droite": _PLAN | {"a", "b", "x", "triangle", "decalage", "textes"},
    "pivot": _PLAN | {"a", "b", "fantomes", "rayon", "textes"},
    "decalage": _PLAN | {"a", "b", "fantomes", "fleches", "textes"},
    "couverture": {"pivot", "angles", "marquee", "vague", "tangentes"},
    "vignette": set(),
}

def rendre(params: dict, theme: dict) -> str:
    forme = params.get("forme", "vignette")
    if forme not in FORMES:
        raise ValueError(f"courbe : forme « {forme} » inconnue ({', '.join(FORMES)})")
    return FORMES[forme](params, theme)
