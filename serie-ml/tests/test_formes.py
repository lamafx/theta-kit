"""Session de design n° 1 : formes de page des familles Grille, Courbe (droites) et Nuage, et leurs calculs.

La fidélité de chaque forme à son canevas est vérifiée par tests/test_rendu.py (planches Formes-*) ; ici,
les calculs et les règles de chaque forme.
"""

import re

import pytest

import bibliotheque
from calculs import calculer
from calculs.descente_gradient import niveau_selle
from calculs.grille import chiffre_manuscrit
from calculs.nuage import autour_d_un_polynome
from serie.charte import Charte
from serie.rendu import theme


@pytest.fixture(scope="module")
def clair(depot):
    return theme(Charte.charger(depot), "claire")


def textes(svg: str) -> list[str]:
    return [re.sub(r"<[^>]+>", "", t) for t in re.findall(r"<text[^>]*>(.*?)</text>", svg, re.S)]


# --- Grille -------------------------------------------------------------------------------

def test_chiffre_manuscrit_du_jeu_uci():
    zero = chiffre_manuscrit(0)
    assert zero["chiffre"] == 0 and len(zero["valeurs"]) == 8 and all(len(r) == 8 for r in zero["valeurs"])
    assert zero["valeurs"][0] == [0, 0, 5, 13, 9, 1, 0, 0]
    assert max(max(r) for r in zero["intensites"]) <= 1
    assert calculer("chiffre_manuscrit", indice=1)["chiffre"] == 1
    with pytest.raises(ValueError):
        chiffre_manuscrit(1797)


def test_pixels_ecrit_chaque_valeur(clair):
    svg = bibliotheque.rendre("grille", {"forme": "pixels", "chiffre": 0}, clair)
    nombres = [t for t in textes(svg) if t.isdigit()]
    assert nombres == [str(v) for r in chiffre_manuscrit(0)["valeurs"] for v in r]


def test_tableau_compte_les_colonnes(clair):
    params = {"forme": "tableau", "colonnes": ["a", "b"], "lignes": [[1, 2], [3]]}
    with pytest.raises(ValueError, match="1 valeurs pour 2 colonnes"):
        bibliotheque.rendre("grille", params, clair)


def test_ligne_valeurs_en_francais(clair):
    svg = bibliotheque.rendre("grille", {"forme": "ligne", "colonnes": ["x", "y"], "valeurs": [2.5, 10000]}, clair)
    assert "2,5" in textes(svg) and "10 000" in textes(svg)


# --- Courbe : droites ---------------------------------------------------------------------

def test_segment_coupe_la_droite_au_cadre():
    from calculs.droite import segment

    assert segment(0.6, 1.5, [0, 10], [0, 8.2]) == [[0, 1.5], [10, 7.5]]
    (x0, y0), (x1, y1) = segment(2, 0, [0, 10], [0, 8])
    assert (x0, y0, x1, y1) == (0, 0, 4, 8)
    with pytest.raises(ValueError):
        segment(0, 12, [0, 10], [0, 8])


def test_moindres_carres_retrouve_une_droite_exacte():
    from calculs.droite import ecarts, moindres_carres

    pts = [[x, 0.5 * x + 2] for x in range(5)]
    d = moindres_carres(pts)
    assert d == pytest.approx({"a": 0.5, "b": 2})
    assert ecarts(pts, d["a"], d["b"]) == pytest.approx([0] * 5)


@pytest.mark.parametrize("forme", ["droite", "pivot", "decalage"])
def test_droites_dans_le_repere(clair, forme):
    params = {"forme": forme, "origine": [40, 270], "echelle": [38, 30], "domaine": [0, 10], "plage": [0, 8],
              "a": 0.4, "b": 1, "fantomes": [3] if forme == "decalage" else [0.7]}
    if forme == "droite":
        params.pop("fantomes")
    svg = bibliotheque.rendre("courbe", params, clair)
    # La droite ŷ = 0,4·x + 1 va de (0, 1) à (10, 5) : pixels (40, 240) et (420, 120).
    assert 'x1="40" y1="240" x2="420" y2="120"' in svg


# --- Nuage --------------------------------------------------------------------------------

NUAGE = {"origine": [40, 384], "echelle": [84, 44], "domaine": [0, 10], "plage": [0, 8.4],
         "centres": [[3.4, 3.4]], "effectifs": [26], "dispersion": 0.85, "graine": 7}


def test_tirage_reproductible():
    from calculs.nuage import groupes

    a = groupes([[0, 0], [5, 5]], [3, 4], 1, graine=1)
    assert a == groupes([[0, 0], [5, 5]], [3, 4], 1, graine=1)
    assert [p[2] for p in a] == [0, 0, 0, 1, 1, 1, 1]
    assert a != groupes([[0, 0], [5, 5]], [3, 4], 1, graine=2)


def test_enveloppe_et_distance():
    from calculs.nuage import distance_a_l_enveloppe, enveloppe

    carre = enveloppe([[0, 0], [2, 0], [2, 2], [0, 2], [1, 1]])
    assert sorted(map(tuple, carre)) == [(0, 0), (0, 2), (2, 0), (2, 2)]
    assert distance_a_l_enveloppe([1, 1], carre) == 0
    assert distance_a_l_enveloppe([5, 2], carre) == pytest.approx(3)


def test_frontiere_mediatrice():
    from calculs.droite import predire
    from calculs.nuage import frontiere

    with pytest.raises(ValueError, match="verticale"):  # centres (0, 1) et (4, 1) : frontière x = 2
        frontiere([[0, 0, 0], [0, 2, 0], [4, 0, 1], [4, 2, 1]])
    f = frontiere([[0, 0, 0], [2, 4, 1]])  # centres (0, 0) et (2, 4), milieu (1, 2), pente −1/2
    assert f == pytest.approx({"a": -0.5, "b": 2.5}) and predire(1, **f) == pytest.approx(2)


def test_point_hors_zone_doit_etre_dehors(clair):
    svg = bibliotheque.rendre("nuage", {"forme": "points", **NUAGE, "zone": True, "hors_zone": [8.4, 6.6]}, clair)
    assert 'fill="#C2410C"' in svg and svg.count('fill="#C2410C"') == 1
    with pytest.raises(ValueError, match="touche la zone"):
        bibliotheque.rendre("nuage", {"forme": "points", **NUAGE, "zone": True, "hors_zone": [3.4, 3.4]}, clair)


def test_sans_etiquettes_tous_gris(clair):
    params = {"forme": "points", **NUAGE, "centres": [[2, 2], [7, 6]], "effectifs": [5, 5]}
    gris = bibliotheque.rendre("nuage", {**params, "etiquettes": False}, clair)
    couleurs = bibliotheque.rendre("nuage", params, clair)
    assert gris.count("<circle") == couleurs.count("<circle") == 10
    assert 'fill="#2D5BFF"' in couleurs and 'fill="#2D5BFF"' not in gris


def test_regression_par_moindres_carres(clair):
    from calculs.droite import moindres_carres
    from calculs.nuage import autour_d_une_droite

    pts = autour_d_une_droite(14, 0.55, 1.2, 0.7, [0.6, 9.4], 2)
    d = moindres_carres(pts)
    assert d["a"] == pytest.approx(0.55, abs=0.15)
    svg = bibliotheque.rendre("nuage", {"forme": "droite", **NUAGE, "n": 14, "tendance": [0.55, 1.2], "bruit": 0.7,
                                        "abscisses": [0.6, 9.4], "graine": 2}, clair)
    assert svg.count("<circle") == 14


# --- Fonds de couverture (A11) ------------------------------------------------------------

@pytest.fixture(scope="module")
def sombre(depot):
    return theme(Charte.charger(depot), "couverture")


def test_opacite_du_fond():
    from calculs import couvertures as cv

    valeurs = [cv.opacite(x, y) for x in range(0, 1081, 40) for y in range(0, 781, 40)]
    assert min(valeurs) >= 0 and max(valeurs) <= cv.MAXI
    assert cv.opacite(*cv.CENTRE_ROBOT) == cv.MINI  # sur le robot, le motif s'efface
    assert cv.opacite(900, 120) > cv.opacite(180, 120)  # le haut à droite plus que le haut à gauche
    assert all(cv.opacite(x, cv.BAS) == 0 for x in range(0, 1081, 60))  # rien sous la ligne du titre
    assert cv.opacite(900, 200, plein=True) == pytest.approx(cv.PLEIN * cv.opacite(900, 200), abs=0.01)


def test_calculs_des_fonds():
    from calculs import couvertures as cv

    assert max(cv.barres(16, 3, 13)) == 1 and cv.barres(16, 3, 13).index(1) == 13
    assert all(abs(sum(r) - 1) < 1e-3 for r in cv.blocs([70, 15, 15], 5, 4))
    a = cv.arbre([800, 56], 3, 36, 120, [1, 0, 1])
    assert len(a["noeuds"]) == 15 and len(a["liens"]) == 14 and len(a["chemin"]) == 4
    r = cv.reseau([3, 4, 2], [100, 500, 900], 20, 720, 1)
    assert len(r["liens"]) == 3 * 4 + 4 * 2 and [r["noeuds"][k][2] for k in r["chemin"]] == [0, 1, 2]
    for x0, y0, x1, y1, _ in cv.eventail([880, 190], [-60, 0, 30]):
        assert 0 <= min(x0, x1) and max(x0, x1) <= cv.LARGEUR and 0 <= min(y0, y1) and max(y0, y1) <= cv.HAUTEUR


@pytest.mark.parametrize("famille, graine", [("nuage", "graine"), ("grille", "graine"), ("courbe", "marquee"),
                                             ("barres", "graine"), ("blocs", "graine"), ("arbre", "chemin"),
                                             ("reseau", "graine")])
def test_fond_par_defaut_et_variante(sombre, famille, graine):
    """Chaque famille a un fond sans paramètre ; un paramètre distingue deux épisodes consécutifs."""
    defaut = bibliotheque.rendre(famille, {"forme": "couverture"}, sombre)
    assert 'width="1080" height="780"' in defaut and "left: -80px; top: -60px" in defaut
    autre = {"graine": 9, "marquee": 2, "chemin": [0, 1, 1, 0, 1]}[graine]
    assert bibliotheque.rendre(famille, {"forme": "couverture", graine: autre}, sombre) != defaut
    assert graine in bibliotheque.parametres(famille)["couverture"]


def test_panneaux_des_trois_familles(clair):
    """A39 : même nuage coloré puis gris, puis une boucle ; trois titres."""
    params = {"forme": "panneaux", "origine": [10, 280], "echelle": [26, 30], "domaine": [0, 10], "plage": [0, 8.4],
              "centres": [[2.6, 5.6], [6.8, 2.6]], "effectifs": [12, 12], "dispersion": 0.8, "graine": 3,
              "textes": {"titres": ["supervisé", "non supervisé", "renforcement"], "retour": "recommencer"}}
    svg = bibliotheque.rendre("nuage", params, clair)
    cercles = re.findall(r'<circle[^>]*fill="(#[0-9A-F]{6})"', svg)
    assert cercles.count("#8A919C") == 24 and cercles.count("#2D5BFF") == 12 and cercles.count("#0E1116") == 12
    assert [t for t in textes(svg) if t in ("supervisé", "non supervisé", "renforcement", "recommencer")] == [
        "recommencer", "supervisé", "non supervisé", "renforcement"]
    assert "Agir" in textes(svg) and "Récompense" in textes(svg)


# --- Lignes de niveau ---------------------------------------------------------------------

def test_gradient_en_deux_reglages():
    """A56 : J(a, b) = a² + 3b², ∇J = (2a, 6b) ; la ligne de niveau J = 4 a pour demi-axes 2 et 2/√3."""
    assert calculer("gradient_2d", point=[1, 1], courbures=[1, 3]) == [2, 6]
    lignes = calculer("gradient_tableau", points=[[2, -1], [0, 0]], courbures=[1, 3])
    assert lignes == [{"a": 2, "b": -1, "cout": 7, "da": 4, "db": -6}, {"a": 0, "b": 0, "cout": 0, "da": 0, "db": 0}]


def test_carte_fleches_perpendiculaires(clair):
    """La flèche ∇J part du point, perpendiculaire à l'ellipse qui y passe (même échelle en a et b)."""
    params = {"forme": "carte", "origine": [460, 225], "echelle": 100, "domaine": [-3.4, 3.4], "plage": [-2, 2],
              "courbures": [1, 3], "niveaux": [4], "longueur": 12,
              "points": [{"point": [1, 1], "valeurs": True}, {"point": [0, 0]}], "textes": {"minimum": "creux"}}
    svg = bibliotheque.rendre("niveaux", params, clair)
    x1, y1, x2, y2 = map(float, re.search(r'<line x1="([\d.]+)" y1="([\d.]+)" x2="([\d.]+)" y2="([\d.]+)" '
                                          r'stroke="#2D5BFF"', svg).groups())
    assert (x1, y1) == (560, 125)
    # Tangente à a² + 3b² = 4 en (1, 1), en pixels (b vers le haut) : (3, 1) ; produit scalaire nul.
    assert abs((x2 - x1) * 3 + (y2 - y1) * 1) < 1e-6
    assert "∇J = (2 ; 6)" in textes(svg) and "creux" in textes(svg) and textes(svg).count("∇J") == 0


def test_descente_stochastique():
    """A59 : sans bruit, le chemin de 08 ; un mini-lot de 16 divise l'écart dû au bruit par 4 ; pas par époque."""
    sans_bruit = calculer("sgd_2d", depart=[-3, 1.5], eta=0.1, courbures=[1, 3], pas=5)
    assert sum(sans_bruit, []) == pytest.approx(sum(calculer(
        "descente_gradient_2d", depart=[-3, 1.5], eta=0.1, courbures=[1, 3], pas=5), []))
    exact = calculer("sgd_2d", depart=[-3, 1.5], eta=0.1, courbures=[1, 3], pas=1)[1]
    un = calculer("sgd_2d", depart=[-3, 1.5], eta=0.1, courbures=[1, 3], pas=1, bruit=4, graine=2)[1]
    lot = calculer("sgd_2d", depart=[-3, 1.5], eta=0.1, courbures=[1, 3], pas=1, bruit=4, lot=16, graine=2)[1]
    assert lot[0] - exact[0] == pytest.approx((un[0] - exact[0]) / 4)
    assert calculer("pas_par_epoque_tableau", n=1500, lots=[1500, 100, 1]) == [
        {"exemples": 1500, "lot": 1500, "pas": 1}, {"exemples": 1500, "lot": 100, "pas": 15},
        {"exemples": 1500, "lot": 1, "pas": 1500}]
    assert calculer("pas_par_epoque", n=1000, lot=64) == 16


def test_chemin_un_trace_par_chemin(clair):
    params = {"forme": "chemin", "origine": [220, 150], "echelle": 55, "domaine": [-3.8, 3.8], "plage": [-2.6, 2.6],
              "courbures": [1, 3], "niveaux": [1, 4], "alerte": True,
              "chemins": [{"depart": [-3, 1.5], "eta": 0.15, "pas": 10, "bruit": 4, "graine": 7, "texte": "η fixe"},
                          {"depart": [3, 1.5], "eta": 0.1, "pas": 6, "style": "objet"}]}
    svg = bibliotheque.rendre("niveaux", params, clair)
    assert svg.count("<polyline") == 2 and svg.count("<ellipse") == 2
    assert 'stroke="#0E1116"' in svg and textes(svg) == ["η fixe"]
    assert re.search(r'<polyline[^>]*stroke="(#[0-9A-F]{6})"', svg).group(1) != "#2D5BFF"  # alerte


# --- Plusieurs creux et point selle (A60, épisode 10) ------------------------------------------------------

def test_creux_de_la_courbe_ondulee():
    """D2L 12.1 : f(x) = x·cos(πx) sur [−1 ; 2] a un minimum local vers −0,27 et le minimum global vers 1,09."""
    (xl, fl), (xg, fg) = calculer("creux_f", courbe="ondulee", debut=-1, fin=2)
    assert (round(xl, 2), round(fl, 2), round(xg, 2), round(fg, 2)) == (-0.27, -0.18, 1.09, -1.05)
    assert round(calculer("iterations_f", courbe="ondulee", theta0=-0.9, eta=0.05, pas=40)[-1], 2) == -0.27
    assert round(calculer("iterations_f", courbe="ondulee", theta0=0.4, eta=0.05, pas=40)[-1], 2) == 1.09


def test_trace_marque_les_creux(clair):
    params = {"forme": "trace", "courbe": "ondulee", "origine": [300, 250], "echelle": [200, 96], "domaine": [-1, 2],
              "plage": [-1.3, 2], "creux": True, "descentes": [{"depart": -0.9, "eta": 0.05, "pas": 30}],
              "textes": {"minimum_local": "minimum local", "minimum_global": "minimum global"}}
    assert [x for x in textes(bibliotheque.rendre("courbe", params, clair)) if "minimum" in x] == [
        "minimum local", "minimum global"]


def test_lignes_de_niveau_en_selle(clair):
    """J = a² − b² : pour c = 1, deux branches a = ±√(1 + b²) ; pour c = 0, les deux diagonales."""
    branches = niveau_selle(
        1, [1, -1], [-3, 3], [-1, 1], finesse=4)
    assert [[(round(a, 3), b) for a, b in br] for br in branches] == [
        [(1.414, -1.0), (1.118, -0.5), (1.0, 0.0), (1.118, 0.5), (1.414, 1.0)],
        [(-1.414, -1.0), (-1.118, -0.5), (-1.0, 0.0), (-1.118, 0.5), (-1.414, 1.0)]]
    params = {"forme": "chemin", "origine": [460, 225], "echelle": 130, "domaine": [-2.4, 2.4], "plage": [-1.65, 1.65],
              "courbures": [1, -1], "niveaux": [-1, 0, 1], "chemins": [{"depart": [-2.2, 0], "eta": 0.1, "pas": 20}]}
    svg = bibliotheque.rendre("niveaux", params, clair)
    assert svg.count("<ellipse") == 0 and svg.count("<polyline") == 7  # 3 niveaux × 2 branches, plus le chemin
    # Parti sur l'axe b = 0, le chemin y reste : il cale au point selle.
    assert all(b == 0 for _, b in calculer("sgd_2d", depart=[-2.2, 0], eta=0.1, courbures=[1, -1], pas=20))


# --- Régression linéaire sur les ventes d'Ames (A61, épisode 11) ---------------------------------------------

def test_descente_sur_la_droite_d_ames():
    """Départ (0 ; 0), η = 0,2 : la descente approche la droite des moindres carrés (74 ; 4) de l'épisode 04."""
    lignes = calculer("descente_droite", eta=0.2, iterations=[0, 10, 100, 1000])
    assert [(l["iteration"], l["w"], l["b"], l["cout"]) for l in lignes] == [
        (0, 0.0, 0.0, 13400), (10, 57.5, 27.9, 1085), (100, 72.2, 6.1, 1030), (1000, 73.6, 4.0, 1030)]
    assert calculer("echantillon_ames", n=5, graine=11) == calculer("echantillon_ames", n=5, graine=11)


def test_droite_imposee_et_relation_courbe(clair):
    commun = {"forme": "droite", "source": "ames", "n": 40, "graine": 11, "origine": [16, 206], "echelle": [94, 0.54],
              "domaine": [0, 2.75], "plage": [0, 370], "cadre": [280, 220], "ecarts": False, "fantome": True}
    depart = bibliotheque.rendre("nuage", {**commun, "descente": {"eta": 0.2, "iteration": 0}, "alerte": True}, clair)
    assert depart.count("<circle") == 40 and 'stroke="#C3C7CE"' in depart  # 40 ventes et la droite fantôme
    assert re.search(r'<line x1="16" y1="206"[^>]*stroke="(#[0-9A-F]{6})"', depart).group(1) not in ("#2D5BFF", "#C3C7CE")
    pts = autour_d_un_polynome(5, [1, 0, 1], 0, [0, 4], 1)  # y = 1 + x², sans bruit
    assert pts == [[0.0, 1.0], [1.0, 2.0], [2.0, 5.0], [3.0, 10.0], [4.0, 17.0]]
