"""Images réelles (partie D) : classification, crédit, passage à la variante sans image. Aucun accès réseau."""

import datetime as dt
import re
import shutil

import pytest

from serie.depot import lire_yaml
from serie.images import (
    FicheImage, charger_image, classer, credit, ecrire_fiche, fiche_de, licence_avec_lien, taille_image,
)

FIXTURE_PHOTO = "tests/fixtures/images/essai-photo.png"


# --- Classification (D2) : une condition d'exemple par classe ------------------------------------------------

@pytest.mark.parametrize("licence, conditions, classe", [
    # libre
    ("Public domain", "This image is a work of the U.S. federal government and is in the public domain.", "libre"),
    ("CC0", "", "libre"),
    ("CC BY 4.0", "", "libre"),
    ("CC BY-SA 3.0", "", "libre"),
    ("", "These images may be freely used, modified and cropped, with credit to the laboratory.", "libre"),
    # à confirmer
    ("", "Courtesy of Lawrence Livermore National Laboratory", "a_confirmer"),
    ("", "May be used with credit.", "a_confirmer"),
    ("", "", "a_confirmer"),
    # exclue
    ("CC BY-NC 2.0", "", "exclue"),
    ("CC BY-ND 4.0", "", "exclue"),
    ("CC BY-NC-SA 4.0", "", "exclue"),
    ("", "© 2020 All rights reserved.", "exclue"),
    ("", "Getty Images", "exclue"),
    ("", "AI-generated illustration of a vintage computer room", "exclue"),
    ("", "Photo-illustration, digitally altered", "exclue"),
])
def test_classification(licence, conditions, classe):
    assert classer(licence, conditions)[0] == classe


def test_classification_explique_son_choix():
    assert classer("", "Courtesy of LLNL")[1] == "« Courtesy of… » sans licence écrite"
    assert "modification" in classer("", "May be used with credit.")[1]


# --- Crédit écrit par le code (D5) ------------------------------------------------------------------------------

def _fiche(**en_plus):
    base = dict(titre="t", auteur="NASA Langley Research Center", date="1957", page_source="https://exemple.org/p",
                url_fichier="https://exemple.org/f.jpg", source="Wikimedia Commons", classe="libre",
                licence="Domaine public", conditions="in the public domain", sha256="0" * 64, largeur=2400,
                hauteur=1800, telecharge_le=dt.date(2026, 10, 20))
    return FicheImage(**{**base, **en_plus})


def test_credit_photo():
    assert credit(_fiche()) == "Photo : NASA Langley Research Center · Domaine public · Wikimedia Commons"


def test_credit_sans_doublon_de_source():
    assert credit(_fiche(source="NASA Langley Research Center")) == "Photo : NASA Langley Research Center · Domaine public"


def test_credit_capture():
    assert credit(_fiche(genre="capture", auteur="Ladji Lama Kamagate")) == "Capture : Ladji Lama Kamagate"


def test_lien_de_licence_pour_cc_by():
    f = _fiche(licence="CC BY-SA 4.0", lien_licence="https://creativecommons.org/licenses/by-sa/4.0")
    assert licence_avec_lien(f) == "CC BY-SA 4.0 : https://creativecommons.org/licenses/by-sa/4.0"
    assert licence_avec_lien(_fiche()) is None  # domaine public : pas de lien à donner


# --- Image retenue ou variante sans image -----------------------------------------------------------------------

def test_image_sans_fiche_ou_exclue_jamais_affichee(depot, tmp_path):
    shutil.copy(depot.racine / FIXTURE_PHOTO, tmp_path / "a.png")
    assert charger_image(tmp_path, "a.png") is None  # pas de fiche .yaml
    ecrire_fiche(fiche_de(tmp_path / "a.png"), _fiche(classe="exclue"))
    assert charger_image(tmp_path, "a.png") is None
    ecrire_fiche(fiche_de(tmp_path / "a.png"), _fiche(classe="a_confirmer"))
    assert charger_image(tmp_path, "a.png") is not None


def test_rien_de_retenu_variante_sans_image(depot):
    """Aucune image retenue : la page Contexte passe à sa variante sans image (C4, D4)."""
    from pydantic import TypeAdapter

    from serie.rendu import Episode, Moteur, charger_fiches, page_html
    from serie.schemas import Calendrier, PageContenu

    brut = lire_yaml(depot.racine / "tests" / "fixtures" / "contenu-01-images.yaml")["pages"][0]
    brut["image"]["fichier"] = "candidats/01/inexistante.jpg"
    fiches = charger_fiches(depot)
    ep = Episode(fiches[1], None, fiches, Calendrier.model_validate(lire_yaml(depot.calendrier)))
    html = page_html(Moteur(depot), ep, TypeAdapter(PageContenu).validate_python(brut), 3, 6)
    assert "<img" not in html and 'class="a-la-place"' in html and "déposer" not in html


def test_taille_lue_dans_l_en_tete(depot):
    assert taille_image((depot.racine / FIXTURE_PHOTO).read_bytes()) == (1200, 678)


# --- Zone image vide ou uniforme (A24) ---------------------------------------------------------------------

def _png_uni(chemin, largeur=1200, hauteur=678, gris=150):
    """Un PNG d'une seule couleur, écrit sans dépendance (zlib) : l'image qu'une page ne doit jamais montrer."""
    import struct
    import zlib

    def bloc(t, d):
        return struct.pack(">I", len(d)) + t + d + struct.pack(">I", zlib.crc32(t + d) & 0xFFFFFFFF)

    brut = b"".join(b"\x00" + bytes([gris]) * (largeur * 3) for _ in range(hauteur))
    chemin.write_bytes(b"\x89PNG\r\n\x1a\n" + bloc(b"IHDR", struct.pack(">IIBBBBB", largeur, hauteur, 8, 2, 0, 0, 0))
                       + bloc(b"IDAT", zlib.compress(brut)) + bloc(b"IEND", b""))
    return chemin


ZONE = {"gauche": 80, "droite": 1000, "haut": 72, "bas": 1294}


def _remplacer_image(nom: str, cible):
    """Fonction qui remplace, dans le HTML d'une page, l'image d'essai `nom` par le fichier `cible`."""
    return lambda h: re.sub(rf'src="file:[^"]*{nom}"', f'src="{cible.resolve().as_uri()}"', h)


def _mesures_images(depot, tmp_path, remplacer=None):
    from rendus import pages_images_html
    from serie.mesures import mesurer_pages
    from serie.verification import controler_mesures

    htmls = pages_images_html(depot)
    if remplacer:
        htmls = [remplacer(h) for h in htmls]
    mesures = mesurer_pages(htmls, tmp_path / "mesures", ZONE, 20, 14, premiere=3)
    return mesures, [d.message for d in controler_mesures(mesures) if "image" in d.message]


def test_zone_image_des_fixtures_a_du_relief(depot, tmp_path):
    from serie.verification import SEUIL_IMAGE_UNIFORME

    mesures, erreurs = _mesures_images(depot, tmp_path)
    assert erreurs == []
    zones = [z for m in mesures for z in m.images]
    assert [z["image"] for z in zones] == ["essai-photo.png", "essai-capture.png"]
    assert all(z["chargee"] and z["ecart_type"] > 4 * SEUIL_IMAGE_UNIFORME for z in zones)


def test_zone_image_uniforme_refusee(depot, tmp_path):
    """Une image unie (même sous le surlignage et le badge d'une capture) est une erreur bloquante."""
    _, erreurs = _mesures_images(depot, tmp_path, _remplacer_image(r"essai-(photo|capture)\.png", _png_uni(tmp_path / "uni.png")))
    assert len(erreurs) == 2 and all("zone image vide ou uniforme" in e for e in erreurs)


def test_image_absente_refusee(depot, tmp_path):
    from rendus import pages_images_html
    from serie.rendu import ErreurRendu, photographier

    remplacer = _remplacer_image(r"essai-photo\.png", tmp_path / "absente.png")
    _, erreurs = _mesures_images(depot, tmp_path, remplacer)
    assert erreurs == ["image non chargée : absente.png"]

    with pytest.raises(ErreurRendu, match="images non chargées"):
        photographier([remplacer(pages_images_html(depot)[0])], tmp_path / "rendu")


# Zones image des références : la photo entière ; la capture sous son surlignage (figé dans l'image).
ZONES_REFERENCES = {
    "Image-Contexte": {"x": 104, "y": 554, "largeur": 874, "hauteur": 474},
    "Image-Capture": {"x": 105, "y": 740, "largeur": 872, "hauteur": 202},
}


@pytest.mark.parametrize("page", sorted(ZONES_REFERENCES))
def test_references_montrent_une_image(depot, page):
    from serie.mesures import ecarts_types_png
    from serie.verification import SEUIL_IMAGE_UNIFORME

    (ecart,) = ecarts_types_png(depot.references_png / f"{page}.png", [ZONES_REFERENCES[page]])
    assert ecart > SEUIL_IMAGE_UNIFORME, f"{page} : zone image uniforme (écart type {ecart})"


def test_badge_dans_le_cadre_de_la_capture(depot):
    """A24 : le badge est dans le cadre d'accent ; une seule position (`annotation.haut`), ils ne se séparent pas."""
    from rendus import pages_images_html

    capture = pages_images_html(depot)[1]
    cadre = re.search(r'<div class="surlignage" style="top: (\d+)px; height: (\d+)px">\s*<span class="badge">([^<]+)</span>\s*</div>',
                      capture)
    assert cadre and cadre.groups() == ("128", "64", "Classé seul, sans règle écrite")
    assert capture.count('class="badge"') == 1
