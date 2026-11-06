"""Jalon 1 : les 62 fiches passent le schéma et l'import correspond à provenance.yaml."""

import copy
from pathlib import Path

import pytest
from pydantic import ValidationError

from serie.depot import lire_yaml
from serie.schemas import Calendrier, Fiche
from serie.validation import controler_fiche, valider_depot


@pytest.fixture(scope="module")
def rapport(depot):
    return valider_depot(depot)


def test_62_fiches_valides(rapport):
    assert rapport.fichiers_fiches == 62
    assert sorted(rapport.fiches) == list(range(1, 63))
    assert rapport.fiches_invalides == []
    assert rapport.erreurs == [], "\n".join(map(str, rapport.erreurs))


def test_nombres_de_provenance_retrouves(rapport):
    assert {c.cle for c in rapport.comparaisons} == {
        "fiches", "episodes_avec_references", "references_total", "cours", "sources_originales",
        "termes_glossaire", "gabarits_reference",
    }
    ecarts = [c for c in rapport.comparaisons if not c.ok]
    assert ecarts == []
    assert rapport.ok


def _refuse(donnees: dict) -> None:
    with pytest.raises(ValidationError):
        Fiche.model_validate(donnees)


def test_fiche_de_reference_valide(fiche_08):
    assert Fiche.model_validate(fiche_08).numero == 8


@pytest.mark.parametrize(
    "alteration",
    [
        lambda f: f.update(rubrique_inconnue="x"),
        lambda f: f["couverture"].update(famille="spirale"),
        lambda f: f["couverture"].update(famille="flux"),  # flux : pages intérieures seulement
        lambda f: f.update(format="moyen"),
        lambda f: f.update(titre=""),
        lambda f: f["pages"].pop(),  # plus de page Fin
        lambda f: f["pages"][2].update(page=9),  # numérotation cassée
        lambda f: f["pages"][2].pop("message"),
        lambda f: f["pages"][2].update(type="Anecdote"),
        lambda f: f["episode_suivant"].update(numero=10),
        lambda f: f.update(episode_suivant={"texte": "fin"}),  # réservé au dernier épisode
        lambda f: f.update(prerequis_explicites=[8]),
        lambda f: f.update(references={"cours": [], "sources_originales": []}),
        lambda f: f["references"]["cours"][0].update(url="pas une adresse"),
    ],
)
def test_fiche_alteree_refusee(fiche_08, alteration):
    fiche = copy.deepcopy(fiche_08)
    alteration(fiche)
    _refuse(fiche)


def test_nom_de_fichier_et_format_controles(depot, fiche_08):
    calendrier = Calendrier.model_validate(lire_yaml(depot.calendrier))
    formats = {"court": [4, 6], "long": [7, 9]}
    fiche = Fiche.model_validate(fiche_08)
    bon = Path("08-la-descente-de-gradient.yaml")
    assert controler_fiche(bon, fiche, formats, calendrier) == []

    assert controler_fiche(Path("08-autre-titre.yaml"), fiche, formats, calendrier)
    assert controler_fiche(bon, fiche, {"court": [4, 6], "long": [7, 7]}, calendrier)

    autre_saison = Fiche.model_validate({**fiche_08, "saison": 2})
    assert controler_fiche(bon, autre_saison, formats, calendrier)


def test_fin_de_serie_annonce_la_bonne_saison(rapport, depot):
    # A05 corrigée : la fiche 62 n'annonce plus « la saison 1 ».
    assert not [d for d in rapport.diagnostics if d.lieu.startswith("62-")]

    (chemin,) = depot.episodes.glob("62-*.yaml")
    brut = lire_yaml(chemin)
    brut["episode_suivant"]["texte"] = "fin de la saison 1, avec un post-bilan."
    calendrier = Calendrier.model_validate(lire_yaml(depot.calendrier))
    diags = controler_fiche(chemin, Fiche.model_validate(brut), {"court": [4, 6], "long": [7, 9]}, calendrier)
    assert [d.niveau.value for d in diags] == ["avertissement"]
