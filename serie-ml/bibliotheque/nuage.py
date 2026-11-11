"""Famille Nuage de points : points, droite ou frontière, écarts, groupes.

Formes de page (920 px de large, ou une case de comparaison), avec les axes de la Courbe
(bibliotheque/_plan.py) ; chaque point vient d'un tirage reproductible de calculs/nuage.py, chaque droite
de calculs/droite.py :

- `points` : des exemples épars. `etiquettes` : vrai, chaque point a la couleur de sa classe ; faux, tous
  gris. `zone` : la zone couverte par les exemples, en gris de contexte ; `hors_zone` : un point hors de cette
  zone, en alerte (piège de l'épisode 01) ;
- `groupes` : 2 à 4 groupes, chacun dans une tache d'accent, son centre marqué ;
- `droite` : la droite des moindres carrés, en accent, et l'écart vertical de chaque point ; les points peuvent
  être de vraies ventes d'Ames (`source: ames`) ou suivre une relation courbe (`polynome`), la droite venir d'une
  descente (`descente`) ou être donnée (`w`, `b`), la droite des moindres carrés restant en `fantome` ;
- `frontiere` : deux classes de part et d'autre d'une droite (la médiatrice de leurs centres) ;
- `plan` : deux caractéristiques, un résultat (épisode 12, A67) : de vraies ventes d'Ames (surface, chambres,
  prix) en perspective cavalière, le plan des moindres carrés en accent et l'écart vertical de chaque point ;
- `panneaux` : les trois familles d'apprentissage côte à côte (ouverture de l'épisode 03) : le même nuage,
  coloré par étiquette puis tout gris, et une boucle Flux (agir, récompense, recommencer) ;
- `vignette`, `couverture` : planches de la bibliothèque, fond de couverture.

Paramètres du tirage : `centres`, `effectifs`, `dispersion`, `graine` (points, groupes, frontiere) ;
`n`, `tendance` ([a, b] de la droite d'où viennent les points), `bruit`, `abscisses`, `graine` (droite).
Textes : `x`, `y` (axes), `classes` (légende, une par classe), `zone`, `hors_zone`, `droite`, `ecart`,
`groupes` (un nom par groupe), `frontiere`.
"""

from __future__ import annotations

from bibliotheque._plan import axes, plan
from bibliotheque._planche import fond, vignette_ou_couverture
from bibliotheque._svg import GEIST, MONO, balise, cercle, ligne, points as liste_points, svg, texte_svg
from calculs import couvertures
from calculs.droite import ecarts, moindres_carres, predire, segment
from calculs.ames import (descente_droite, echantillon, echantillon_surface_chambres, moindres_carres_multiples,
                          points_surface_chambres_prix)
from calculs.nuage import autour_d_un_polynome, autour_d_une_droite, centres, distance_a_l_enveloppe, enveloppe, frontiere, groupes

POINTS = [(27.9, 125.3), (53.8, 114.1), (74.4, 119.5), (90.7, 120.2), (112.4, 110.6), (134.8, 89.9),
          (161.1, 111.3), (179.5, 81.5), (207.5, 101.9), (228.9, 73.2), (255.7, 50.9), (276.3, 54.3),
          (289.7, 43.3), (313.7, 63.9), (334.2, 48.2), (361.7, 31.3)]
DROITE = (20, 142, 380, 31)
ECARTS = [(74.4, 119.5, 125.2), (134.8, 89.9, 106.6), (207.5, 101.9, 84.2), (255.7, 50.9, 69.3), (313.7, 63.9, 51.5)]

CHASSE = 0.56  # largeur moyenne d'un caractère de Geist, en fraction de la taille
MARGE_ZONE = 24  # la zone couverte déborde des points extrêmes de 24 px


def _vignette(p, th) -> str:
    sombre = th["nom"] == "couverture"
    ac = th["accent"]
    if sombre:
        c = [ligne(*DROITE, stroke=ac, stroke_width=2, stroke_opacity="0.9"),
             f'<g stroke="{ac}" stroke-width="1.2" stroke-opacity="0.45" stroke-dasharray="3 3">']
    else:
        c = [ligne(*DROITE, stroke=ac, stroke_width=2.5),
             f'<g stroke="{ac}" stroke-width="1.5" stroke-opacity="0.6" stroke-dasharray="3 3">']
    c += [ligne(x, y1, x, y2) for x, y1, y2 in ECARTS] + ["</g>"]
    remplissage = f'fill="{ac}" fill-opacity="0.75"' if sombre else f'fill="{th["objet"]}"'
    c.append(f"<g {remplissage}>" + "".join(cercle(x, y, 4 if sombre else 4.5) for x, y in POINTS) + "</g>")
    if sombre:
        return svg(400, 148, c, p.get("description"), vue=(400, 170))
    return svg(264, 112, c, p.get("description"), vue=(400, 170))


def _couverture(p, th) -> str:
    """Fond de couverture. Sans `centres` : des exemples de part et d'autre du robot, la droite des moindres
    carrés qui les résume et leurs écarts en pointillés (2026-10-26, design/propositions/couverture-n01.html).
    Avec `centres` : des groupes de points, le centre de chacun marqué."""
    ac = th["accent"]
    if "plan" in p:
        return fond(_couverture_plan(p["plan"], ac))
    if "centres" not in p:
        pts = couvertures.nuage_droite(p.get("debut", [20, 640]), p.get("fin", [1060, 182]), p.get("pas", 25),
                                       p.get("bruit", 30), p.get("garde", 0.85), p.get("graine", 1))
        d = moindres_carres(pts)
        c = [ligne(20, predire(20, d["a"], d["b"]), 1060, predire(1060, d["a"], d["b"]), stroke=ac, stroke_width=2.5,
                   stroke_opacity=str(couvertures.MARQUE)),
             f'<g stroke="{ac}" stroke-width="1.5" stroke-opacity="0.5" stroke-dasharray="4 4">']
        c += [ligne(x, y, x, predire(x, d["a"], d["b"])) for x, y in pts if abs(y - predire(x, d["a"], d["b"])) > 2]
        c.append(f'</g><g fill="{ac}" fill-opacity="0.85">' + "".join(cercle(x, y, 7) for x, y in pts) + "</g>")
        return fond(c)
    pts = couvertures.nuage(p["centres"], p.get("effectifs", [130]), p.get("dispersion", 200), p.get("graine", 1))
    c = [cercle(x, y, 6, fill=ac, fill_opacity=f"{op:g}") for x, y, _, op in pts if op > 0]
    for x, y in centres(pts):
        c.append(cercle(x, y, 8, fill=th["carte"], stroke=th["clair"], stroke_width=2,
                        stroke_opacity=str(couvertures.MARQUE)))
    return fond(c)


def _couverture_plan(q: dict, ac: str) -> list[str]:
    """Fond de couverture du plan (épisode 12, A67) : un plan incliné maillé, son contour plus marqué, et un nuage
    de points de part et d'autre, chacun relié au plan par son écart (calculs.couvertures.plan_incline)."""
    m = couvertures.plan_incline(q["coin"], q["largeur"], q["fuite"], q["hauteur"], q.get("mailles", [8, 5]),
                                 q.get("n", 40), q.get("bruit", 60), q.get("graine", 12))

    def points(liste) -> list[str]:
        c = []
        for x, y, xp, yp, op, _ in liste:
            if abs(y - yp) > 9:
                c.append(ligne(x, y, xp, yp, stroke=ac, stroke_width=1.5, stroke_opacity=f"{op * 0.8:.2f}",
                               stroke_dasharray="4 4"))
            c.append(cercle(x, y, 7, fill=ac, fill_opacity=f"{min(0.85, op + 0.2):.2f}"))
        return c

    c = points([pt for pt in m["points"] if not pt[5]])
    c.append(balise("polygon", points=liste_points(m["contour"]), fill=ac, fill_opacity="0.07"))
    c += [ligne(x0, y0, x1, y1, stroke=ac, stroke_width=1.5, stroke_opacity=f"{op:g}")
          for x0, y0, x1, y1, op in m["lignes"]]
    c.append(balise("polygon", points=liste_points(m["contour"]), fill="none", stroke=ac, stroke_width=2.5,
                    stroke_opacity=str(couvertures.MARQUE), stroke_linejoin="round"))
    return c + points([pt for pt in m["points"] if pt[5]])


# --- Outils des formes de page ------------------------------------------------------------

def _textes(p) -> dict:
    return p.get("textes", {})


def _rayon(larg: float) -> float:
    return 6 if larg > 600 else 5


def _classe(x, y, k: int, rayon: float, th) -> str:
    """Un point de la classe k : noir plein, accent plein, puis anneaux noir et accent."""
    styles = [dict(fill=th["objet"]), dict(fill=th["accent"]),
              dict(fill="#FFFFFF", stroke=th["objet"], stroke_width=2),
              dict(fill="#FFFFFF", stroke=th["accent"], stroke_width=2)]
    style = styles[k % len(styles)]
    r = rayon - (1 if "stroke" in style else 0)
    return cercle(x, y, r, **style)


def _legende(noms: list[str], larg: float, th) -> list[str]:
    """Légende des classes sur une ligne, en haut à droite, au-dessus du repère."""
    c = []
    x = larg - 2
    for k in reversed(range(len(noms))):
        c.append(texte_svg(noms[k], x=float(x), y=float(17.5), text_anchor="end", font_family=GEIST, font_size=22,
                           fill=th["secondaire"]))
        x -= len(noms[k]) * 22 * CHASSE + 14
        c.append(_classe(x, 12, k, 6, th))
        x -= 28
    return c


def _tache(sommets_px, marge, couleur: str, opacite: str) -> str:
    """Polygone élargi de `marge` pixels : son trait, aussi large que deux marges, arrondit les coins.
    L'opacité s'applique au groupe, pour que le trait et le fond ne se superposent pas."""
    return (f'<g opacity="{opacite}">' + balise("polygon", points=liste_points(sommets_px), fill=couleur,
                                                 stroke=couleur, stroke_width=2 * marge, stroke_linejoin="round")
            + "</g>")


def _tirage(p) -> list[list[float]]:
    return groupes(p["centres"], p["effectifs"], p["dispersion"], p["graine"])


# --- Formes de page -----------------------------------------------------------------------

def _points(p, th) -> str:
    """Des exemples épars ; colorés par classe ou tous gris ; la zone qu'ils couvrent, un point hors zone."""
    r = plan(p)
    t = _textes(p)
    larg, haut = p.get("cadre", [920, 420])
    rayon = _rayon(larg)
    pts = _tirage(p)
    etiquettes = p.get("etiquettes", True)
    c = axes(r, p["domaine"], p["plage"], th, t)
    if p.get("zone"):
        bord = [r.pt(x, y) for x, y in enveloppe(pts)]
        c.append(_tache(bord, MARGE_ZONE, th["contexte"], "0.3"))
        if t.get("zone"):
            haut_zone = min(bord, key=lambda q: q[1])
            c.append(texte_svg(t["zone"], x=float(haut_zone[0]), y=float(haut_zone[1] - MARGE_ZONE - 12),
                               text_anchor="middle", font_family=GEIST, font_size=22, fill=th["secondaire"]))
    for x, y, g in pts:
        px, py = r.pt(x, y)
        c.append(_classe(px, py, int(g), rayon, th) if etiquettes else cercle(px, py, rayon, fill=th["gris"]))
    if "hors_zone" in p:
        bord = [list(r.pt(x, y)) for x, y in enveloppe(pts)]
        px, py = r.pt(*p["hors_zone"])
        if distance_a_l_enveloppe([px, py], bord) <= MARGE_ZONE + 2 * rayon:
            raise ValueError(f"nuage : le point hors zone {p['hors_zone']} touche la zone couverte par les exemples")
        c.append(cercle(px, py, rayon + 3, fill=th["alerte"], stroke="#FFFFFF", stroke_width=2))
        if t.get("hors_zone"):
            dx, dy = p.get("decalage", [18, 6])
            # Trop près du bord droit : l'étiquette passe à gauche du point (22 px depuis la session de design n° 2).
            gauche = px + dx + len(t["hors_zone"]) * 22 * CHASSE > larg - 4
            c.append(texte_svg(t["hors_zone"], x=float(px - dx if gauche else px + dx), y=float(py + dy),
                               text_anchor="end" if gauche else None, font_family=GEIST, font_size=22,
                               font_weight=500, fill=th["alerte"]))
    if etiquettes and t.get("classes"):
        c += _legende(t["classes"], larg, th)
    return svg(larg, haut, c, p.get("description"), "display: block")


def _groupes(p, th) -> str:
    """Des groupes trouvés dans les données : une tache d'accent par groupe, son centre marqué."""
    r = plan(p)
    t = _textes(p)
    larg, haut = p.get("cadre", [920, 420])
    rayon = _rayon(larg)
    pts = _tirage(p)
    noms = t.get("groupes", [])
    c = axes(r, p["domaine"], p["plage"], th, t)
    for g, (cx, cy) in enumerate(centres(pts)):
        membres = [q for q in pts if int(q[2]) == g]
        bord = [r.pt(x, y) for x, y in enveloppe(membres)]
        c.append(_tache(bord, 20, th["accent"], "0.08"))
        if g < len(noms):
            haut_tache = min(q[1] for q in bord)
            c.append(texte_svg(noms[g], x=float(r.x(cx)), y=float(haut_tache - 32), text_anchor="middle",
                               font_family=GEIST, font_size=22, font_weight=500, fill=th["accent"]))
    for x, y, _ in pts:
        c.append(cercle(*r.pt(x, y), rayon, fill=th["objet"]))
    for cx, cy in centres(pts):
        px, py = r.pt(cx, cy)
        c.append(cercle(px, py, rayon + 3, fill="#FFFFFF", stroke=th["accent"], stroke_width=3))
    return svg(larg, haut, c, p.get("description"), "display: block")


def _points_droite(p) -> list[list[float]]:
    """Les points : vraies ventes d'Ames (`source: ames`, `n`, `graine`), tirage autour d'un polynôme
    (`polynome` [c₀, c₁, c₂…], relation courbe) ou autour d'une droite (`tendance` [a, b])."""
    if p.get("source") == "ames":
        return echantillon(p["n"], p["graine"])
    if "polynome" in p:
        return autour_d_un_polynome(p["n"], p["polynome"], p["bruit"], p["abscisses"], p["graine"])
    a0, b0 = p["tendance"]
    return autour_d_une_droite(p["n"], a0, b0, p["bruit"], p["abscisses"], p["graine"])


def _droite(p, th) -> str:
    """Régression : une droite et l'écart vertical de chaque point. La droite : celle des moindres carrés des points
    tracés ; ou `descente` {eta, iteration, depart}, la droite après `iteration` pas de descente sur toutes les
    ventes d'Ames (calculs.ames.descente_droite, épisode 11) ; ou `w` et `b` donnés. `fantome` : la droite des
    moindres carrés en gris de contexte, dessous (le but de la descente). `alerte` : la droite en alerte."""
    r = plan(p)
    t = _textes(p)
    larg, haut = p.get("cadre", [920, 420])
    rayon = _rayon(larg)
    pts = _points_droite(p)
    d = moindres_carres(pts)
    if "descente" in p:
        de = p["descente"]
        ligne_descente = descente_droite(de["eta"], [de["iteration"]], de.get("depart"))[0]
        a, b = ligne_descente["w"], ligne_descente["b"]
    elif "w" in p:
        a, b = p["w"], p["b"]
    else:
        a, b = d["a"], d["b"]
    ac = th["alerte"] if p.get("alerte") else th["accent"]
    c = axes(r, p["domaine"], p["plage"], th, t)
    if p.get("fantome"):
        (fa, fya), (fb, fyb) = segment(d["a"], d["b"], p["domaine"], p["plage"])
        c.append(ligne(*r.pt(fa, fya), *r.pt(fb, fyb), stroke=th["contexte"], stroke_width=3, stroke_linecap="round"))
    (xa, ya), (xb, yb) = segment(a, b, p["domaine"], p["plage"])
    if p.get("ecarts", True):
        c.append(f'<g stroke="{ac}" stroke-width="2" stroke-opacity="0.6" stroke-dasharray="4 4">')
        for x, y in pts:
            px, py = r.pt(x, y)
            yd = r.y(predire(x, a, b))
            if abs(py - yd) > rayon + 2:
                c.append(ligne(px, py + (rayon if yd > py else -rayon), px, yd))
        c.append("</g>")
    c.append(ligne(*r.pt(xa, ya), *r.pt(xb, yb), stroke=ac, stroke_width=3, stroke_linecap="round"))
    for x, y in pts:
        c.append(cercle(*r.pt(x, y), rayon, fill=th["objet"]))
    if t.get("droite"):
        dx, dy = p.get("decalage", [0, -16])
        c.append(texte_svg(t["droite"], 26, x=float(r.x(xb) + dx), y=float(r.y(yb) + dy), text_anchor="end",
                           font_family=GEIST, font_size=22, fill=ac))
    if t.get("ecart"):
        e = ecarts(pts, a, b)
        k = max(range(len(pts)), key=lambda i: abs(e[i]))
        x, y = pts[k]
        c.append(texte_svg(t["ecart"], x=float(r.x(x) + 14), y=float((r.y(y) + r.y(predire(x, a, b))) / 2 + 6),
                           font_family=GEIST, font_size=22, font_weight=500, fill=ac))
    return svg(larg, haut, c, p.get("description"), "display: block")


def _frontiere(p, th) -> str:
    """Classification : deux classes de part et d'autre d'une frontière droite."""
    r = plan(p)
    t = _textes(p)
    larg, haut = p.get("cadre", [920, 420])
    rayon = _rayon(larg)
    pts = _tirage(p)
    f = frontiere(pts)
    c = axes(r, p["domaine"], p["plage"], th, t)
    (xa, ya), (xb, yb) = segment(f["a"], f["b"], p["domaine"], p["plage"])
    c.append(ligne(*r.pt(xa, ya), *r.pt(xb, yb), stroke=th["objet"], stroke_width=2.5, stroke_dasharray="8 7",
                   stroke_linecap="round"))
    for x, y, g in pts:
        c.append(_classe(*r.pt(x, y), int(g), rayon, th))
    if t.get("frontiere"):  # à gauche du bout haut de la frontière
        dx, dy = p.get("decalage", [-30, 2])
        x, y = r.pt(xb, yb) if yb > ya else r.pt(xa, ya)
        c.append(texte_svg(t["frontiere"], x=float(x + dx), y=float(y + dy), text_anchor="end", font_family=GEIST,
                           font_size=22, font_weight=500, fill=th["objet"]))
    if t.get("classes"):
        c += _legende(t["classes"], larg, th)
    return svg(larg, haut, c, p.get("description"), "display: block")


def _plan(p, th) -> str:
    """Régression à deux caractéristiques (épisode 12, A67) : de vraies ventes d'Ames (`source: ames`, `n`,
    `graine`) en perspective cavalière, surface en largeur, chambres en profondeur (axe à droite, où le plan est haut), prix en hauteur ; le plan
    ŷ = w₁·x₁ + w₂·x₂ + b des moindres carrés sur toutes les ventes (calculs.ames), ou `w1`, `w2`, `b` donnés ;
    l'écart vertical de chaque point au plan. Repère : `origine` (pixel du coin avant gauche du sol), `echelle`
    [pixels par unité de surface, par unité de prix], `fuite` (pixels par chambre, vers le fond). Les points sous
    le plan sont dessinés avant lui, voilés par sa teinte ; ceux au-dessus, après."""
    t = _textes(p)
    larg, haut = p.get("cadre", [920, 460])
    (x1a, x1b), (x2a, x2b), (ya, yb) = p["domaine"], p["chambres"], p["plage"]
    ox, oy = p["origine"]
    sx, sy = p["echelle"]
    fx, fy = p["fuite"]

    def pt(x1: float, x2: float, y: float) -> tuple[float, float]:
        return ox + sx * (x1 - x1a) + fx * (x2 - x2a), oy - sy * (y - ya) + fy * (x2 - x2a)

    if "w1" in p:
        w1, w2, b = p["w1"], p["w2"], p["b"]
    else:
        m = moindres_carres_multiples(points_surface_chambres_prix())
        w1, w2, b = m["w1"], m["w2"], m["b"]

    def predire2(x1: float, x2: float) -> float:
        return w1 * x1 + w2 * x2 + b

    pts = [q for q in echantillon_surface_chambres(p["n"], p["graine"])
           if x1a <= q[0] <= x1b and x2a <= q[1] <= x2b and ya <= q[2] <= yb]
    rayon = 6
    ac = th["accent"]
    sol = [pt(x1a, x2a, ya), pt(x1b, x2a, ya), pt(x1b, x2b, ya), pt(x1a, x2b, ya)]
    c = [balise("polygon", points=liste_points(sol), fill=th["filet"], fill_opacity="0.35", stroke=th["filet"],
                stroke_width=1.5)]
    # Au sol, une ligne par nombre de chambres : les rangées où se posent les maisons.
    for k in range(int(x2a) + 1, int(x2b)):
        c.append(ligne(*pt(x1a, k, ya), *pt(x1b, k, ya), stroke=th["filet"], stroke_width=1.5))
    c += [ligne(*pt(x1a, x2a, ya), *pt(x1b, x2a, ya), stroke=th["contexte"], stroke_width=2),
          ligne(*pt(x1b, x2a, ya), *pt(x1b, x2b, ya), stroke=th["contexte"], stroke_width=2),
          ligne(*pt(x1a, x2a, ya), *pt(x1a, x2a, yb), stroke=th["contexte"], stroke_width=2)]

    def points(liste) -> list[str]:
        d = []
        for x1, x2, y in liste:
            px, py = pt(x1, x2, y)
            yd = pt(x1, x2, predire2(x1, x2))[1]
            if p.get("ecarts", True) and abs(py - yd) > rayon + 2:
                d.append(ligne(px, py + (rayon if yd > py else -rayon), px, yd, stroke=ac, stroke_width=2,
                               stroke_opacity="0.6", stroke_dasharray="4 4"))
            d.append(cercle(px, py, rayon, fill=th["objet"]))
        return d

    c += points([q for q in pts if q[2] < predire2(q[0], q[1])])
    coins = [pt(x1, x2, predire2(x1, x2)) for x1, x2 in ((x1a, x2a), (x1b, x2a), (x1b, x2b), (x1a, x2b))]
    c.append(balise("polygon", points=liste_points(coins), fill=ac, fill_opacity="0.12", stroke=ac, stroke_width=3,
                    stroke_linejoin="round"))
    for k in range(int(x2a) + 1, int(x2b)):
        c.append(ligne(*pt(x1a, k, predire2(x1a, k)), *pt(x1b, k, predire2(x1b, k)), stroke=ac, stroke_width=1.5,
                       stroke_opacity="0.5"))
    c += points([q for q in pts if q[2] >= predire2(q[0], q[1])])
    if t.get("x"):
        x, y = pt(x1b, x2a, ya)
        c.append(texte_svg(t["x"], x=float(x - 4), y=float(y + 32), text_anchor="end", font_family=GEIST,
                           font_size=22, fill=th["secondaire"]))
    if t.get("profondeur"):
        x, y = pt(x1b, x2b, ya)
        c.append(texte_svg(t["profondeur"], x=float(x + 14), y=float(y + 6), font_family=GEIST, font_size=22,
                           fill=th["secondaire"]))
    if t.get("y"):
        x, y = pt(x1a, x2a, yb)
        c.append(texte_svg(t["y"], x=float(x + 14), y=float(y + 14), font_family=GEIST, font_size=22,
                           fill=th["secondaire"]))
    if t.get("plan"):
        dx, dy = p.get("decalage", [0, -16])
        x, y = coins[2]
        c.append(texte_svg(t["plan"], 26, x=float(x + dx), y=float(y + dy), text_anchor="end", font_family=GEIST,
                           font_size=22, fill=ac))
    return svg(larg, haut, c, p.get("description"), "display: block")


def _panneaux(p, th) -> str:
    """Les trois familles d'apprentissage côte à côte (ouverture de l'épisode 03, A39) : le même nuage coloré par
    étiquette, puis tout gris, puis une boucle de la famille Flux (agir, récompense, recommencer)."""
    from bibliotheque.flux import HAUTEUR_BOITE, _boite, _marqueur

    t = _textes(p)
    larg, haut = p.get("cadre", [920, 340])
    ecart = 40
    lp = (larg - 2 * ecart) / 3
    hp = haut - 44
    r = plan(p)
    pts = _tirage(p)
    c = [f"<defs>{_marqueur('np-objet', th['objet'])}{_marqueur('np-accent', th['accent'])}</defs>"]
    for k, etiquettes in enumerate((True, False)):
        c.append(f'<g transform="translate({k * (lp + ecart):g} 0)">')
        c += axes(r, p["domaine"], p["plage"], th, {})
        for x, y, g in pts:
            px, py = r.pt(x, y)
            c.append(_classe(px, py, int(g), 5, th) if etiquettes else cercle(px, py, 5, fill=th["gris"]))
        c.append("</g>")
    # Boucle : agir, puis la récompense ; le retour en accent recommence.
    agir, recompense = t.get("etapes", ["Agir", "Récompense"])
    x0, lb = 2 * (lp + ecart) + 20, lp - 64
    yh, yb = 28.0, hp - 28 - HAUTEUR_BOITE
    couleurs = {"trait": th["objet"], "encre": th["objet"], "accent": th["accent"], "fond": th["fond"]}
    c += _boite(x0, yh, lb, agir, couleurs) + _boite(x0, yb, lb, recompense, couleurs)
    xm = x0 + lb / 4  # la flèche noire à gauche, l'étiquette du retour à droite, contre la boucle
    c.append(ligne(xm, yh + HAUTEUR_BOITE + 6, xm, yb - 10, stroke=th["objet"], stroke_width=2.5,
                   marker_end="url(#np-objet)"))
    xd, ya, yr = x0 + lb, yh + HAUTEUR_BOITE / 2, yb + HAUTEUR_BOITE / 2
    c.append(balise("path", d=f"M{xd + 4:g} {yr:g} L{xd + 30:g} {yr:g} L{xd + 30:g} {ya:g} L{xd + 10:g} {ya:g}",
                    fill="none", stroke=th["accent"], stroke_width=3, marker_end="url(#np-accent)"))
    if t.get("retour"):
        c.append(texte_svg(t["retour"], x=float(xd + 16), y=float((yh + HAUTEUR_BOITE + yb) / 2 + 7),
                           text_anchor="end", font_family=GEIST, font_size=22, fill=th["accent"]))
    for k, titre in enumerate(t.get("titres", [])[:3]):
        c.append(texte_svg(titre, x=float(k * (lp + ecart) + lp / 2), y=float(haut - 12), text_anchor="middle",
                           font_family=GEIST, font_size=22, font_weight=500, fill=th["objet"]))
    return svg(larg, haut, c, p.get("description"), "display: block")


FORMES = {"points": _points, "groupes": _groupes, "droite": _droite, "frontiere": _frontiere, "panneaux": _panneaux,
          "plan": _plan}

_PLAN = {"origine", "echelle", "domaine", "plage", "cadre", "textes"}
_TIRAGE = {"centres", "effectifs", "dispersion", "graine"}
PARAMETRES = {
    "vignette": set(),
    "couverture": {"centres", "effectifs", "dispersion", "graine", "debut", "fin", "pas", "bruit", "garde", "plan"},
    "points": _PLAN | _TIRAGE | {"etiquettes", "zone", "hors_zone", "decalage"},
    "groupes": _PLAN | _TIRAGE,
    "droite": _PLAN | {"n", "tendance", "bruit", "abscisses", "graine", "ecarts", "decalage", "source", "polynome",
                       "descente", "w", "b", "fantome", "alerte"},
    "frontiere": _PLAN | _TIRAGE | {"decalage"},
    "panneaux": _PLAN | _TIRAGE,
    "plan": {"domaine", "chambres", "plage", "origine", "echelle", "fuite", "cadre", "textes", "source", "n", "graine",
             "w1", "w2", "b", "ecarts", "decalage"},
}


def rendre(params: dict, theme: dict) -> str:
    forme = params.get("forme", "vignette")
    if forme in FORMES:
        return FORMES[forme](params, theme)
    if forme in ("vignette", "couverture"):
        return vignette_ou_couverture("nuage", _vignette, _couverture, params, theme)
    raise ValueError(f"nuage : forme « {forme} » inconnue ({', '.join([*FORMES, 'vignette', 'couverture'])})")
