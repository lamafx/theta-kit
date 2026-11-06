"""Schéma de contenu/NN.yaml : seules les familles de la bibliothèque et les champs prévus passent."""

import copy

import pytest
from pydantic import ValidationError

from serie.schemas import Contenu, PageFiche, gabarit_page_fiche


def test_contenu_valide(contenu_valide):
    contenu = Contenu.model_validate(contenu_valide)
    assert [p.type for p in contenu.pages][:2] == ["couverture", "ouverture"]


@pytest.mark.parametrize(
    "alteration",
    [
        lambda c: c["pages"][1]["visuel"].update(famille="spirale"),  # visuel improvisé
        lambda c: c["pages"][1].update(svg="<svg/>"),  # pas de dessin libre
        lambda c: c["pages"][1].update(type="anecdote"),
        lambda c: c["pages"][-1]["points"].pop(),  # la fin a 3 points
        lambda c: c["pages"].pop(),  # plus de page de fin
        lambda c: c["pages"].insert(3, {"type": "fin", "points": ["a", "b", "c"]}),
        lambda c: c["pages"][2]["cas"].pop() and c["pages"][2]["cas"].pop(),  # 1 seul cas
        lambda c: c["pages"][3].update(lignes=[]),
        lambda c: c["pages"][3]["panneau"].update(phrase="une phrase"),  # formule et phrase
        lambda c: c["pages"][3]["lignes"][0].pop("symbole"),  # rôle Formule : un symbole par ligne
        lambda c: c["pages"][2].pop("role"),  # pas d'étiquette
        lambda c: c["pages"][2].update(role="Anecdote"),
        lambda c: c["pages"][2].update(role="Problème"),  # rôle sans gabarit décidé (A10)
        lambda c: c["pages"][4].update(role="Repère"),  # Repère se rend avec mecanisme
        lambda c: c["pages"][1].update(role="Mécanisme"),  # pas d'étiquette sur l'ouverture
        lambda c: c["pages"][4]["tableau"].pop("calcul"),  # chiffres sans fonction de calcul
        lambda c: c.update(episode=63),
        lambda c: c["pages"].extend([c["pages"][2]] * 4),  # plus de 9 pages
    ],
)
def test_contenu_altere_refuse(contenu_valide, alteration):
    contenu = copy.deepcopy(contenu_valide)
    alteration(contenu)
    with pytest.raises(ValidationError):
        Contenu.model_validate(contenu)


def _page_formule(role, panneau, lignes):
    return {"type": "formule", "role": role, "titre": "t", "texte": "t", "panneau": panneau, "lignes": lignes}


def test_definition_et_remedes_rendus_par_formule(contenu_valide):
    for role in ("Définition", "Remèdes"):
        c = copy.deepcopy(contenu_valide)
        c["pages"][3] = _page_formule(role, {"phrase": "une phrase définie"}, [{"sens": "un"}, {"sens": "deux"}])
        Contenu.model_validate(c)

        c["pages"][3] = _page_formule(role, {"formule": "x = 1"}, [{"sens": "un"}])
        with pytest.raises(ValidationError):
            Contenu.model_validate(c)


@pytest.mark.parametrize(
    "type_fiche, image, gabarit",
    [
        ("Repère", None, "mecanisme"),
        ("Lien", None, "mecanisme"),
        ("Lecture", None, "mecanisme"),
        ("Définition", None, "formule"),
        ("Remèdes", None, "formule"),
        ("Diagnostic", None, "comparaison"),
        ("Évaluation", None, "exemple"),
        ("Exemple chiffré", None, "exemple"),
        ("Exemple", None, "mecanisme"),
        ("Exemple", "capture d'écran", "capture"),
        ("Contexte", "photo", "contexte"),
        ("Problème", None, "mecanisme"),  # A10 résolue : Problème → mécanisme
    ],
)
def test_rattachement_des_pages_de_fiche(type_fiche, image, gabarit):
    page = PageFiche(page=3, type=type_fiche, message="m", image_reelle=image)
    assert gabarit_page_fiche(page) == gabarit
