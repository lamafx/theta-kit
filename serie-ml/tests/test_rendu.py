"""Jalon 2 : `serie rendre 08` produit des pages identiques aux images de tests/reference/.

Deux comparaisons par page, avec l'algorithme de pixelmatch (serie/comparaison.py), qui écarte
l'anti-crénelage :

1. Fidélité de la conversion : rendu contre le canevas d'origine rendu sur cette même machine
   (serie/etalon.py). Seule la conversion peut créer un écart. Seuil : MARGE.

2. Référence : rendu contre tests/reference/*.png. Ces images (sauf 08-Fin) viennent d'un autre ordinateur :
   même le canevas d'origine, rendu ici, s'en écarte (PLANCHER). Cause, vérifiée sur les images de
   différences : le lissage des glyphes (DirectWrite ici), dont pixelmatch n'écarte qu'une partie ; les
   écarts ne sont que des bords de lettres. Depuis la police de complément (∇ et U+202F dessinés par
   STIX Two Math), plus aucune ligne ne se décale : le plancher de la page Formule passe de 11 758 px à 3 438.
   Seuil (consigne B7) : l'écart mesuré + MARGE.

Mesures du 2026-10-20 (Windows 11, Chromium 1248 de Playwright 1.64), en pixels sur 1 458 000 :

| Page             | Canevas ici / référence | Rendu / canevas ici | Rendu / référence | Seuil |
| ---------------- | ----------------------: | ------------------: | ----------------: | ----: |
| Main             |                     622 |                  25 |               647 |   722 |
| 02-Ouverture     |                   2 780 |                   0 |             2 780 | 2 880 |
| 03-Mecanisme     |                   4 601 |                  36 |             4 638 | 4 701 |
| 04-Comparaison   |                   4 941 |                  25 |             4 966 | 5 041 |
| 05-Formule       |                   3 438 |                   0 |             3 438 | 3 538 |
| 06-Exemple       |                   3 685 |                   0 |             3 685 | 3 785 |
| 07-Piege         |                   3 369 |                   0 |             3 369 | 3 469 |
| 08-Fin           |                       0 |                   0 |                 0 |   100 |
| Image-Contexte   |              0 (A24)    |                   0 |                 0 |   100 |
| Image-Capture    |              0 (A24)    |                   0 |                 0 |   100 |
| Bilan-Couverture |                   1 024 |                   0 |             1 024 | 1 124 |
| Bilan-Sommaire   |                   9 975 |                   0 |             9 975 | 10 075 |
| Bib-Motifs       |                   3 573 |                   0 |             3 573 | 3 673 |
| Bib-Visuels      |                   9 149 |                   0 |             9 149 | 9 249 |

08-Fin : référence régénérée sur cette machine à partir du canevas modifié (encadré « Vérifiez-vous », B5 ;
phrase de transition sous le titre de l'épisode suivant, A15, 2026-10-25).

A29 (2026-10-25) : les lettres grecques de Geist et Geist Mono sont dessinées par STIX Two Text (police de
complément), dans le rendu comme dans le canevas rendu ici ; les références, faites sur un autre ordinateur, les
montrent dans une police du système. Plancher remesuré sur les 4 pages qui ont un θ hors formule : 02-Ouverture
2 938, 03-Mecanisme 4 759, 06-Exemple 6 740, 07-Piege 3 527. Sur 06-Exemple, la ligne d'en-tête du tableau
(« θ », « Pente 2θ », « Nouveau θ ») gagne 1 px de haut : tout ce qui suit descend de 1 px, d'où l'écart plus
grand. La fidélité au canevas ne change pas (0 à 36 px).
Les 25 à 36 px de Main, Mécanisme et Comparaison : les coordonnées calculées par calculs/ diffèrent d'au plus
0,1 px de celles arrondies à la main dans le canevas.

Image-Contexte et Image-Capture (A24, session de design n° 1, 2026-10-25) : canevas mis à jour avec l'image
d'essai de tests/fixtures/images/ et le crédit au format D5, références régénérées sur cette machine. Les masques
de la zone de l'image sont retirés ; plancher 0 (avant : 3 130 et 2 943 px, zone de l'image masquée). Les images
d'essai sont des mires (tests/fixtures/images/generer.py) : une image unie passait sans qu'on la voie ;
tests/test_images.py vérifie que la zone image des deux références a du relief.
"""

import pytest

from serie.comparaison import Comparateur
from serie.etalon import rendre_canevas
from rendus import PAGES_08, REFERENCES, rendre_references

# Marge ajoutée à chaque écart mesuré : 100 px sur 1 458 000 (0,007 %).
MARGE = 100

# Écart, hors anti-crénelage, entre le canevas d'origine rendu sur cette machine et la référence.
# Session de design n° 2 (2026-11-01) : les 21 canevas et références refaits sur cette machine à partir du rendu
# validé à l'œil (couverture A, tailles de lisibilité sur téléphone) ; le plancher est nul partout.
PLANCHER = {
    "Main": 0,  # 622 avant le style de couverture du 2026-10-26 : canevas et référence refaits ici
    "02-Ouverture": 0,  # 2780 avant A29
    "03-Mecanisme": 0,  # 4601 avant A29
    "04-Comparaison": 0,
    "05-Formule": 0,
    "06-Exemple": 0,  # 3685 avant A29
    "07-Piege": 0,  # 3369 avant A29
    "08-Fin": 0,
    "Image-Contexte": 0,  # 3130 avant A24 (zone de l'image masquée)
    "Image-Capture": 0,  # 2943 avant A24 (zone de l'image masquée)
    "Bilan-Couverture": 0,
    "Bilan-Sommaire": 0,
    "Bilan-Fin": 0,  # session de design n° 1 (A35) : canevas et référence faits ici
    "Fin-Serie": 0,  # session de design n° 1 (A22)
    "Bib-Motifs": 0,
    "Bib-Visuels": 0,
    # Session de design n° 1 : planches des formes de page, canevas et référence faits sur cette machine.
    "Formes-Grille": 0,
    "Formes-Courbe": 0,
    "Formes-Nuage": 0,
    "Formes-Flux": 0,
    "Formes-Niveaux": 0,  # session de design n° 2 (A56, épisode 07)
    "Couvertures": 0,
    "Couverture-Classique": 0,  # 2026-11-02 : couverture d'avant la couverture A, gardée au choix
}

@pytest.fixture(scope="module")
def mesures(depot, tmp_path_factory):
    dossier = tmp_path_factory.mktemp("rendus")
    rendus = rendre_references(depot, dossier)
    canevas = rendre_canevas(depot, REFERENCES, dossier / "canevas")
    resultats = {}
    with Comparateur() as c:
        for page in REFERENCES:
            ref = depot.references_png / f"{page}.png"
            resultats[page] = {
                "fidelite": c.comparer(rendus[page], canevas[page], dossier / "diff" / f"{page}-canevas.png"),
                "reference": c.comparer(rendus[page], ref, dossier / "diff" / f"{page}-reference.png"),
                "plancher": c.comparer(canevas[page], ref, None),
            }
    resultats["_dossier"] = dossier
    return resultats


def test_toutes_les_references_sont_couvertes(depot):
    assert sorted(p.stem for p in depot.references_png.glob("*.png")) == sorted(REFERENCES) == sorted(PLANCHER)


@pytest.mark.parametrize("page", REFERENCES)
def test_fidelite_au_canevas(mesures, page):
    e = mesures[page]["fidelite"]
    assert e.ecarts <= MARGE, f"{page} : {e} (images dans {mesures['_dossier']})"


@pytest.mark.parametrize("page", REFERENCES)
def test_identique_a_la_reference(mesures, page):
    e = mesures[page]["reference"]
    seuil = PLANCHER[page] + MARGE
    assert e.ecarts <= seuil, f"{page} : {e}, seuil {seuil} (images dans {mesures['_dossier']})"


@pytest.mark.parametrize("page", REFERENCES)
def test_plancher_de_la_machine(mesures, page):
    """Si ce test échoue seul, c'est l'environnement (navigateur, polices) qui a changé, pas le code."""
    e = mesures[page]["plancher"]
    assert e.ecarts <= PLANCHER[page] + MARGE, f"{page} : {e}, plancher mesuré {PLANCHER[page]}"


def test_episode_08_a_huit_pages():
    assert len(PAGES_08) == 8
