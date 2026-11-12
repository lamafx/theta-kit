"""Famille Barres : valeurs, une barre dominante, étiquette.

Formes de page (session de design n° 4, épisode 19) :
- `barres` : des valeurs nommées (`etiquettes`, `valeurs`), la dominante en accent, les autres en gris de contexte,
  la valeur au-dessus de chaque barre (`format` : nombre ou pourcent) ;
- `probabilites` : des logits (`logits`, `etiquettes`) puis leurs probabilités par softmax (calculs.classification),
  côte à côte, la plus probable en accent ; les pourcentages affichés font 100 (calculs.decoupage.decouper).
Textes : `logits`, `probabilites`, `fleche`, `somme`, `titre`.
"""

from __future__ import annotations

from bibliotheque._planche import fond, vignette_ou_couverture
from bibliotheque._svg import GEIST, MONO, balise, esc, ligne, marqueur, nombre_fr, svg, texte_svg
from calculs import couvertures
from calculs.classification import softmax
from calculs.decoupage import decouper

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


def _colonnes(th, x0: float, largeur: float, base: float, haut_max: float, valeurs: list[float], etiquettes: list[str],
              textes_valeurs: list[str], dominante: int, maxi: float, mini: float = 0.0) -> list[str]:
    """Barres verticales dans [x0 ; x0 + largeur], ligne de base à `base` (valeur 0) ; une valeur négative descend
    sous la base. La valeur au bout de la barre, le nom dessous."""
    k = len(valeurs)
    pas = largeur / k
    lb = min(96.0, pas * 0.62)
    echelle = haut_max / max(maxi - min(mini, 0), 1e-9)
    c = [ligne(x0, base, x0 + largeur, base, stroke=th["filet"], stroke_width=2)]
    bas_noms = base + (-min(mini, 0)) * echelle
    for i, (v, nom, tv) in enumerate(zip(valeurs, etiquettes, textes_valeurs)):
        x = x0 + i * pas + (pas - lb) / 2
        h = abs(v) * echelle
        y = base - h if v >= 0 else base
        couleur = th["accent"] if i == dominante else th["contexte"]
        c.append(balise("rect", x=float(x), y=float(y), width=float(lb), height=float(max(h, 2)), rx=6, fill=couleur))
        ty = y - 12 if v >= 0 else y + h + 30
        c.append(texte_svg(tv, x=float(x + lb / 2), y=float(ty), text_anchor="middle", font_family=GEIST, font_size=22,
                           font_weight=600 if i == dominante else 500, fill=th["accent"] if i == dominante else th["objet"]))
        c.append(texte_svg(nom, x=float(x + lb / 2), y=float(bas_noms + 34), text_anchor="middle", font_family=GEIST,
                           font_size=22, fill=th["secondaire"]))
    return c


def _un_chiffre(v: float) -> str:
    """Toujours un chiffre après la virgule (2,0 et non 2), signe moins mathématique."""
    return ("−" if v < 0 else "") + f"{abs(v):.1f}".replace(".", ",")


def _texte_valeur(v: float, format_: str) -> str:
    return f"{round(v * 100)} %" if format_ == "pourcent" else _un_chiffre(v)


def _barres(p, th) -> str:
    """Des valeurs nommées ; la dominante (par défaut la plus grande) en accent."""
    larg, haut = p.get("cadre", [920, 400])
    valeurs, noms = p["valeurs"], p["etiquettes"]
    dominante = p.get("dominante", max(range(len(valeurs)), key=lambda i: valeurs[i]))
    format_ = p.get("format", "nombre")
    textes = ([f"{x} %" for x in decouper(100, valeurs)] if format_ == "pourcent" and abs(sum(valeurs) - 1) < 1e-6
              else [_texte_valeur(v, format_) for v in valeurs])
    t = p.get("textes", {})
    haut_titre = 44 if t.get("titre") else 0
    c = []
    if t.get("titre"):
        c.append(texte_svg(t["titre"], 26, x=0.0, y=26.0, font_family=GEIST, font_size=22, fill=th["secondaire"]))
    c += _colonnes(th, 0, larg, haut - 60, haut - 60 - haut_titre - 48, valeurs, noms, textes, dominante,
                   max(valeurs), min(valeurs))
    return svg(larg, haut, c, p.get("description"), "display: block")


def _probabilites(p, th) -> str:
    """Logits à gauche, softmax, probabilités à droite (même ordre des classes)."""
    larg, haut = p.get("cadre", [920, 420])
    logits, noms = p["logits"], p["etiquettes"]
    probas = softmax(logits)
    dominante = max(range(len(probas)), key=lambda i: probas[i])
    t = p.get("textes", {})
    panneau, fleche = (larg - 150) / 2, 150
    base = haut - 64
    c = ["<defs>", marqueur("pb-fleche", th["accent"], taille=7), "</defs>"]
    for x, cle in ((0, "logits"), (panneau + fleche, "probabilites")):
        if t.get(cle):
            c.append(texte_svg(t[cle], 26, x=float(x), y=26.0, font_family=GEIST, font_size=22, font_weight=500,
                               fill=th["objet"]))
    haut_max = base - 44 - 52
    mini = min(logits)
    base_g = base - (-min(mini, 0)) * haut_max / max(max(logits) - min(mini, 0), 1e-9) if mini < 0 else base
    c += _colonnes(th, 0, panneau, base_g, haut_max, logits, noms, [_un_chiffre(z) for z in logits], dominante,
                   max(logits), mini)
    c += _colonnes(th, panneau + fleche, panneau, base, haut_max, probas, noms, [f"{x} %" for x in decouper(100, probas)],
                   dominante, 1.0)
    ym = base - haut_max / 2
    c.append(ligne(panneau + 22, ym, panneau + fleche - 22, ym, stroke=th["accent"], stroke_width=3,
                   marker_end="url(#pb-fleche)"))
    if t.get("fleche"):
        c.append(texte_svg(t["fleche"], 26, x=float(panneau + fleche / 2), y=float(ym - 16), text_anchor="middle",
                           font_family=GEIST, font_size=22, font_weight=500, fill=th["accent"]))
    if t.get("somme"):
        c.append(texte_svg(t["somme"], 26, x=float(larg), y=26.0, text_anchor="end", font_family=GEIST, font_size=22,
                           fill=th["secondaire"]))
    return svg(larg, haut, c, p.get("description"), "display: block")


PARAMETRES = {"vignette": set(), "couverture": {"nombre", "dominante", "graine"},
              "barres": {"valeurs", "etiquettes", "dominante", "format", "cadre", "textes"},
              "probabilites": {"logits", "etiquettes", "cadre", "textes"}}

FORMES = {"barres": _barres, "probabilites": _probabilites}


def rendre(params: dict, theme: dict) -> str:
    forme = params.get("forme", "vignette")
    if forme in FORMES:
        return FORMES[forme](params, theme)
    return vignette_ou_couverture("barres", _vignette, _couverture, params, theme)
