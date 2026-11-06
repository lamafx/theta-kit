"""Famille Grille : cases, intensités, fenêtre mise en évidence.

Formes de page (920 px de large), la grammaire de la vignette agrandie : des cases arrondies teintées
d'accent (l'intensité est l'opacité), une fenêtre au trait noir autour de ce qu'on regarde.

- `ligne` : un exemple = une ligne de tableau (ouverture de l'épisode 02). La ligne, valeurs lisibles, entre
  des lignes fantômes grises ; la dernière colonne, l'étiquette, en accent.
- `tableau` : lignes = exemples, colonnes = caractéristiques, dernière colonne = étiquette (mécanisme 02).
  Accolades au-dessus des caractéristiques et de l'étiquette ; une fenêtre autour d'une colonne ou d'une ligne.
- `pixels` : une image de 8 × 8 cases et les nombres que reçoit la machine (piège 02). Les intensités viennent
  d'un chiffre manuscrit réel (calculs/grille.py) ; une fenêtre suit la même rangée des deux côtés.
- `vignette`, `couverture` : planches de la bibliothèque, fond de couverture.

Paramètres :
- `colonnes` : noms des colonnes, de gauche à droite ; `etiquette` (vrai par défaut) : la dernière est l'étiquette ;
- `valeurs` (ligne) ou `lignes` (tableau) : les valeurs, nombres ou textes, recopiées de la fiche ;
- `fenetre` : `{colonne: k}` ou `{ligne: k}` (k compté à partir de 0), avec un `texte` facultatif ;
- `fantomes` (ligne) : nombre de lignes fantômes au-dessus et au-dessous (2 par défaut) ;
- `numeros` (tableau) : numéroter les exemples dans une colonne grise (vrai par défaut) ;
- `chiffre` (pixels) : numéro de l'image dans le jeu de chiffres manuscrits ;
- `textes` : étiquettes du dessin (voir chaque forme).
"""

from __future__ import annotations

from bibliotheque._planche import fond, vignette_ou_couverture
from bibliotheque._svg import GEIST, MONO, balise, esc, ligne, marqueur, nombre_fr, svg
from calculs import couvertures
from calculs.grille import chiffre_manuscrit

INTENSITES = [
    [0.2, 0.36, 0.27, 0.39, 0.41, 0.11, 0.09, 0.52],
    [0.21, 0.2, 0.6, 0.32, 0.51, 0.33, 0.41, 0.16],
    [0.41, 0.53, 0.35, 0.47, 0.43, 0.11, 0.47, 0.39],
    [0.24, 0.1, 0.53, 0.33, 0.45, 0.54, 0.45, 0.56],
    [0.29, 0.5, 0.31, 0.57, 0.54, 0.13, 0.15, 0.19],
]

# Teintes d'accent des cases de données (opacité) : caractéristique, étiquette.
TEINTE = 0.08
TEINTE_ETIQUETTE = 0.2
# Lignes fantômes : gris de contexte, de la plus proche à la plus lointaine de la ligne montrée.
FANTOMES = [0.5, 0.25, 0.12]
FENETRE = 2.5
CHASSE = 0.56  # largeur moyenne d'un caractère de Geist 500, en fraction de la taille


def _vignette(p, th) -> str:
    sombre = th["nom"] == "couverture"
    c = [f'<g fill="{th["accent"]}">']
    for i, rangee in enumerate(INTENSITES):
        c.append("".join(balise("rect", x=28 + 44 * j, y=12 + 30 * i, width=40, height=26, rx=4, fill_opacity=str(v))
                         for j, v in enumerate(rangee)))
    c.append("</g>")
    if sombre:
        c.append(balise("rect", x=113, y=39, width=134, height=92, rx=7, fill="none", stroke=th["clair"],
                        stroke_width=2))
        return svg(400, 148, c, p.get("description"), vue=(400, 170))
    c.append(balise("rect", x=113, y=39, width=134, height=92, rx=7, fill="none", stroke=th["objet"],
                    stroke_width=2.5))
    return svg(264, 112, c, p.get("description"), vue=(400, 170))


def _couverture(p, th) -> str:
    """Fond de couverture : des cases d'intensités tirées ; marquée, la fenêtre autour d'une colonne."""
    cote, ecart = p.get("cote", 52), 8
    cases = couvertures.grille(cote, ecart, p.get("graine", 2))
    colonne = p.get("colonne", 14)
    debut, fin = p.get("rangees", [0, 6])
    c = [f'<g fill="{th["accent"]}">']
    c += [balise("rect", x=float(x), y=float(y), width=cote, height=cote, rx=6, fill_opacity=f"{op:g}")
          for x, y, _, op in cases if op >= 0.02]
    c.append("</g>")
    x = 6 + colonne * (cote + ecart)
    c.append(balise("rect", x=float(x - 5), y=float(6 + debut * (cote + ecart) - 5), width=float(cote + 10),
                    height=float((fin - debut + 1) * (cote + ecart) - ecart + 10), rx=10, fill="none",
                    stroke=th["clair"], stroke_width=2, stroke_opacity=str(couvertures.MARQUE)))
    return fond(c)


# --- Outils des formes de page ------------------------------------------------------------

def _valeur(v) -> tuple[str, str]:
    """Texte d'une case et sa police : les nombres en Geist Mono, les mots en Geist."""
    if isinstance(v, bool):
        raise ValueError(f"grille : valeur booléenne « {v} »")
    if isinstance(v, int):
        return str(v), MONO
    if isinstance(v, float):
        return nombre_fr(v), MONO
    return str(v), GEIST


def _colonnes(largeur: float, n: int, ecart: float, x0: float = 0.0) -> list[tuple[float, float]]:
    """(x, largeur) de n colonnes égales séparées de `ecart`, sur `largeur` px à partir de x0."""
    lc = (largeur - ecart * (n - 1)) / n
    return [(x0 + k * (lc + ecart), lc) for k in range(n)]


def _texte(x, y, contenu, taille, couleur, famille=GEIST, graisse=None, ancre="middle") -> str:
    poids = f' font-weight="{graisse}"' if graisse else ""
    return (f'<text x="{x:.1f}" y="{y:.1f}" text-anchor="{ancre}" font-family="{famille}" font-size="{taille}"'
            f'{poids} fill="{couleur}">{esc(contenu)}</text>')


def _legende_fenetre(x, y, contenu, th) -> list[str]:
    """Texte posé sur le bord haut d'une fenêtre, sur un fond qui interrompt le trait."""
    largeur = len(contenu) * 22 * CHASSE + 20
    return [balise("rect", x=float(x), y=float(y - 14), width=float(round(largeur)), height=28, fill=th["fond"]),
            _texte(x + 10, y + 6, contenu, 22, th["objet"], graisse=500, ancre="start")]


def _accolade(x1, x2, y, couleur) -> str:
    """Accolade droite ouverte vers le bas, de x1 à x2, au-dessus de cases."""
    return balise("path", d=f"M{x1:.1f} {y + 10:.1f} L{x1:.1f} {y:.1f} L{x2:.1f} {y:.1f} L{x2:.1f} {y + 10:.1f}",
                  fill="none", stroke=couleur, stroke_width=2)


def _verifier(colonnes, rangees) -> None:
    if not colonnes:
        raise ValueError("grille : au moins une colonne")
    for r in rangees:
        if len(r) != len(colonnes):
            raise ValueError(f"grille : {len(r)} valeurs pour {len(colonnes)} colonnes")


# --- Formes de page -----------------------------------------------------------------------

def _ligne(p, th) -> str:
    """Un exemple = une ligne de tableau : la ligne montrée entre des lignes fantômes."""
    larg, haut = p.get("cadre", [920, 360])
    colonnes, valeurs = p["colonnes"], p["valeurs"]
    _verifier(colonnes, [valeurs])
    etiquette = p.get("etiquette", True)
    t = p.get("textes", {})
    nb_fantomes = p.get("fantomes", 2)
    ac, ob, ctx = th["accent"], th["objet"], th["contexte"]
    n = len(colonnes)
    cols = _colonnes(larg - 24, n, 12, 12)
    h_fantome, h_ligne, ecart = 40, 88, 10
    y_ligne = 44 + nb_fantomes * (h_fantome + ecart) + 12

    c = []
    for k, (x, lc) in enumerate(cols):
        est_etiquette = etiquette and k == n - 1
        c.append(_texte(x + lc / 2, 24, colonnes[k], 22, ac if est_etiquette else th["secondaire"],
                        graisse=500 if est_etiquette else None))
    for j in range(nb_fantomes):
        opacite = FANTOMES[min(nb_fantomes - 1 - j, len(FANTOMES) - 1)]
        for dessus, y in ((True, 44 + j * (h_fantome + ecart)),
                          (False, y_ligne + h_ligne + 22 + (nb_fantomes - 1 - j) * (h_fantome + ecart))):
            for k, (x, lc) in enumerate(cols):
                couleur, op = (ac, opacite * 0.4) if etiquette and k == n - 1 else (ctx, opacite)
                c.append(balise("rect", x=float(x), y=float(y), width=float(lc), height=h_fantome, rx=8,
                                fill=couleur, fill_opacity=f"{op:g}"))
    for k, (x, lc) in enumerate(cols):
        est_etiquette = etiquette and k == n - 1
        c.append(balise("rect", x=float(x), y=float(y_ligne), width=float(lc), height=h_ligne, rx=10, fill=ac,
                        fill_opacity=str(TEINTE_ETIQUETTE if est_etiquette else TEINTE)))
        contenu, police = _valeur(valeurs[k])
        c.append(_texte(x + lc / 2, y_ligne + h_ligne / 2 + 9, contenu, 26, ac if est_etiquette else ob,
                        famille=police, graisse=600 if est_etiquette else 500))
    c.append(balise("rect", x=1.25, y=float(y_ligne - 10), width=float(larg - 2.5), height=float(h_ligne + 20), rx=16,
                    fill="none", stroke=ob, stroke_width=FENETRE))
    if t.get("ligne"):
        c += _legende_fenetre(28, y_ligne - 10, t["ligne"], th)
    return svg(larg, haut, c, p.get("description"), "display: block")


def _tableau(p, th) -> str:
    """Lignes = exemples, colonnes = caractéristiques, dernière colonne = étiquette."""
    larg, haut = p.get("cadre", [920, 430])
    colonnes, rangees = p["colonnes"], p["lignes"]
    _verifier(colonnes, rangees)
    etiquette = p.get("etiquette", True)
    numeros = p.get("numeros", True)
    fenetre = p.get("fenetre") or {}
    t = p.get("textes", {})
    ac, ob, sec = th["accent"], th["objet"], th["secondaire"]
    n = len(colonnes)
    gauche = 100 if numeros else 6  # « exemple » en 22 px (88 avant la session de design n° 2)
    cols = _colonnes(larg - gauche - 6, n, 10, gauche)
    h_case, ecart = 52, 8
    y_entete, y0 = 82, 98
    y_fin = y0 + len(rangees) * (h_case + ecart) - ecart

    c = []
    # Accolades : caractéristiques, étiquette.
    nb_car = n - 1 if etiquette else n
    if nb_car and t.get("caracteristiques"):
        xa, xb = cols[0][0], cols[nb_car - 1][0] + cols[nb_car - 1][1]
        c.append(_accolade(xa, xb, 34, sec))
        c.append(_texte((xa + xb) / 2, 20, t["caracteristiques"], 22, sec))
    if etiquette and t.get("etiquette"):
        xa, lc = cols[-1]
        c.append(_accolade(xa, xa + lc, 34, ac))
        c.append(_texte(xa + lc / 2, 20, t["etiquette"], 22, ac, graisse=500))
    # En-tête et numéros.
    if numeros:
        c.append(_texte(gauche / 2 - 6, y_entete, t.get("exemples", "exemple"), 22, sec))
    for k, (x, lc) in enumerate(cols):
        est_etiquette = etiquette and k == n - 1
        c.append(_texte(x + lc / 2, y_entete, colonnes[k], 22, ac if est_etiquette else ob, graisse=500))
    for i, rangee in enumerate(rangees):
        y = y0 + i * (h_case + ecart)
        if numeros:
            c.append(_texte(gauche / 2 - 6, y + h_case / 2 + 6, str(i + 1), 22, sec, famille=MONO))
        for k, (x, lc) in enumerate(cols):
            est_etiquette = etiquette and k == n - 1
            c.append(balise("rect", x=float(x), y=float(y), width=float(lc), height=h_case, rx=8, fill=ac,
                            fill_opacity=str(TEINTE_ETIQUETTE if est_etiquette else TEINTE)))
            contenu, police = _valeur(rangee[k])
            c.append(_texte(x + lc / 2, y + h_case / 2 + 7, contenu, 22, ac if est_etiquette else ob,
                            famille=police, graisse=600 if est_etiquette else 500))
    # Fenêtre : une colonne (en-tête compris) ou une ligne.
    if "colonne" in fenetre:
        x, lc = cols[fenetre["colonne"]]
        c.append(balise("rect", x=float(x - 7), y=float(y_entete - 26), width=float(lc + 14),
                        height=float(y_fin + 8 - (y_entete - 26)), rx=13, fill="none", stroke=ob, stroke_width=FENETRE))
        if fenetre.get("texte"):
            c.append(_texte(x + lc / 2, y_fin + 36, fenetre["texte"], 22, ob, graisse=500))
    elif "ligne" in fenetre:
        y = y0 + fenetre["ligne"] * (h_case + ecart)
        x0 = cols[0][0]
        c.append(balise("rect", x=float(x0 - 7), y=float(y - 7), width=float(larg - 6 - x0 + 7 + 5.75),
                        height=float(h_case + 14), rx=13, fill="none", stroke=ob, stroke_width=FENETRE))
        if fenetre.get("texte"):
            c += _legende_fenetre(x0 + 14, y - 7, fenetre["texte"], th)
    return svg(larg, haut, c, p.get("description"), "display: block")


def _pixels(p, th) -> str:
    """Une image de 8 × 8 cases, puis les nombres que reçoit la machine."""
    larg, haut = p.get("cadre", [920, 440])
    image = chiffre_manuscrit(p["chiffre"])
    valeurs, intensites = image["valeurs"], image["intensites"]
    fenetre = p.get("fenetre") or {}
    t = p.get("textes", {})
    ac, ob, sec = th["accent"], th["objet"], th["secondaire"]
    nb = len(valeurs)
    case, ecart, y0 = 44, 5, 4
    cote = nb * case + (nb - 1) * ecart
    gauche, droite = 8.0, larg - 8 - cote

    c = ["<defs>", marqueur("gx-fleche", ob), "</defs>"]
    for i in range(nb):
        for j in range(nb):
            x, y = j * (case + ecart), y0 + i * (case + ecart)
            v = intensites[i][j]
            c.append(balise("rect", x=float(gauche + x), y=float(y), width=case, height=case, rx=6, fill=ac,
                            fill_opacity=f"{max(v, 0.05):.2f}"))
            c.append(balise("rect", x=float(droite + x), y=float(y), width=case, height=case, rx=6, fill=ac,
                            fill_opacity=f"{0.04 + 0.22 * v:.2f}"))
            nul = valeurs[i][j] == 0
            c.append(_texte(droite + x + case / 2, y + case / 2 + 6, str(valeurs[i][j]), 22, sec if nul else ob,
                            famille=MONO, graisse=None if nul else 600))
    milieu = y0 + cote / 2
    c.append(ligne(gauche + cote + 30, milieu, droite - 30, milieu, stroke=ob, stroke_width=2.5,
                   marker_end="url(#gx-fleche)"))
    if t.get("fleche"):
        c.append(_texte(larg / 2, milieu - 18, t["fleche"], 22, sec))
    if "ligne" in fenetre:
        y = y0 + fenetre["ligne"] * (case + ecart)
        for x in (gauche, droite):
            c.append(balise("rect", x=float(x - 5), y=float(y - 5), width=float(cote + 10), height=float(case + 10),
                            rx=10, fill="none", stroke=ob, stroke_width=FENETRE))
    y_texte = y0 + cote + 38
    if t.get("image"):
        c.append(_texte(gauche + cote / 2, y_texte, t["image"], 22, sec))
    if t.get("nombres"):
        c.append(_texte(droite + cote / 2, y_texte, t["nombres"], 22, sec))
    return svg(larg, haut, c, p.get("description"), "display: block")


FORMES = {"ligne": _ligne, "tableau": _tableau, "pixels": _pixels}

PARAMETRES = {
    "vignette": set(),
    "couverture": {"cote", "graine", "colonne", "rangees"},
    "ligne": {"colonnes", "valeurs", "etiquette", "fantomes", "textes", "cadre"},
    "tableau": {"colonnes", "lignes", "etiquette", "numeros", "fenetre", "textes", "cadre"},
    "pixels": {"chiffre", "fenetre", "textes", "cadre"},
}


def rendre(params: dict, theme: dict) -> str:
    forme = params.get("forme", "vignette")
    if forme in FORMES:
        return FORMES[forme](params, theme)
    if forme in ("vignette", "couverture"):
        return vignette_ou_couverture("grille", _vignette, _couverture, params, theme)
    raise ValueError(f"grille : forme « {forme} » inconnue ({', '.join([*FORMES, 'vignette', 'couverture'])})")
