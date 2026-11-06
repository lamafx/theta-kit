"""Chaque canevas, chaque gabarit et chaque forme de visuel a son image de référence dans tests/reference/.

Règle de la session de design (BRIEF-SESSION-DESIGN.md, section 0) : comme pour 08-Fin, un gabarit ou une forme
produits pendant la session n'est commité qu'avec son image de référence, et la suite au vert. Ces tests
échouent tant qu'il manque une référence ; les manques connus sont listés dans EN_ATTENTE, avec l'ambiguïté qui
les couvre, et doivent en sortir dès que la référence existe.
"""

import pytest

import bibliotheque
from serie.schemas import FAMILLES_COUVERTURE
from serie.etalon import CANEVAS
from serie.rendu import Moteur, charger_episode, pages_html
from rendus import (
    CONTENU_08, REFERENCES, couverture_classique_html, page_fin_62_html, pages_bilan_essai, pages_images_html,
    planche_couvertures_html, planche_formes_html,
    planches_formes, planches_html,
)

# Formes rendues aujourd'hui sans image de référence, en attente de la session de design.
EN_ATTENTE: dict[tuple[str, str], str] = {}


@pytest.fixture(scope="module")
def utilises(depot):
    """Gabarits et formes employés par les pages qui produisent les images de référence (HTML seul)."""
    gabarits, formes = set(), set()
    page, rendre = Moteur.page, bibliotheque.rendre

    def page_espion(self, gabarit, *args, **kwargs):
        gabarits.add(gabarit)
        return page(self, gabarit, *args, **kwargs)

    def rendre_espion(famille, params, theme):
        formes.add((famille, params.get("forme", "vignette")))
        return rendre(famille, params, theme)

    Moteur.page, bibliotheque.rendre = page_espion, rendre_espion
    try:
        moteur = Moteur(depot)
        pages_html(moteur, charger_episode(depot, 8, CONTENU_08))
        pages_images_html(depot)
        pages_bilan_essai(moteur)
        page_fin_62_html(moteur)
        couverture_classique_html(moteur)
        planches_html(moteur)
        for planche in planches_formes():
            planche_formes_html(moteur, planche)
        planche_couvertures_html(moteur)
    finally:
        Moteur.page, bibliotheque.rendre = page, rendre
    return gabarits, formes


def test_chaque_canevas_a_sa_reference(depot):
    canevas = {p.name.removesuffix(".dc.html") for p in (depot.racine / "design" / "canevas-gabarits").glob("*.dc.html")}
    references = {p.stem for p in depot.references_png.glob("*.png")}
    assert canevas == references == set(CANEVAS) == set(REFERENCES)


def test_chaque_gabarit_a_sa_reference(depot, utilises):
    gabarits, _ = utilises
    fichiers = {p.name.removesuffix(".html.j2") for p in (depot.racine / "gabarits").glob("*.html.j2")
                if not p.name.startswith("_")}
    assert fichiers - gabarits == set(), "gabarit sans image de référence"
    assert gabarits <= fichiers


def test_chaque_forme_a_sa_reference(utilises):
    _, formes = utilises
    declarees = {(f, forme) for f in bibliotheque.FAMILLES for forme in bibliotheque.parametres(f)}
    sans_reference = declarees - formes - set(EN_ATTENTE)
    assert sans_reference == set(), f"forme sans image de référence : {sorted(sans_reference)}"
    deja_couvertes = set(EN_ATTENTE) & formes
    assert deja_couvertes == set(), f"retirer de EN_ATTENTE (référence faite) : {sorted(deja_couvertes)}"
    a_creer = set(EN_ATTENTE) - declarees
    assert a_creer <= {(f, "couverture") for f in FAMILLES_COUVERTURE}, f"EN_ATTENTE nomme une forme inconnue : {a_creer}"


def test_chaque_famille_de_couverture_a_son_fond(utilises):
    """Les 8 familles de couverture ont un fond rendu dans une référence (A11 : planche Couvertures)."""
    _, formes = utilises
    sans_fond = {f for f in FAMILLES_COUVERTURE if (f, "couverture") not in formes}
    assert sans_fond == set()
