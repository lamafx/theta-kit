"""serie etat : lecture de etat.yaml et affichage."""

import pytest
from pydantic import ValidationError

from serie.cli import main
from serie.depot import lire_yaml
from serie.etat import afficher_etat
from serie.schemas import Etat


def test_62_episodes_a_faire(depot):
    """62 épisodes, chacun avec un statut connu ; le total suit etat.yaml (la production avance)."""
    from collections import Counter

    from serie.depot import lire_yaml

    sortie = afficher_etat(depot)
    lignes_episodes = [l for l in sortie.splitlines() if l.startswith("  Nº ")]
    assert len(lignes_episodes) == 62
    libelles = {"a_faire": "à faire", "genere": "généré", "relu": "relu", "publie": "publié", "mesure": "mesuré"}
    assert all(l.endswith(tuple(libelles.values())) for l in lignes_episodes)
    compte = Counter(e["statut"] for e in lire_yaml(depot.etat)["episodes"].values())
    attendu = " · ".join(f"{compte[k]} {v}" for k, v in libelles.items())
    assert sum(compte.values()) == 62 and f"Total : {attendu}" in sortie
    bilans = Counter(e["statut"] for e in lire_yaml(depot.etat)["bilans"].values())
    assert sum(bilans.values()) == 4
    assert "Bilans : " + " · ".join(f"{bilans[k]} {v}" for k, v in libelles.items()) in sortie
    assert sortie.count("Bilan de la saison") == 4


def test_cles_normalisees(depot):
    brut = lire_yaml(depot.etat)
    brut["episodes"][8] = brut["episodes"].pop("08")  # 08 lu comme entier par un autre lecteur YAML
    assert "08" in Etat.model_validate(brut).episodes


def test_statut_inconnu_refuse(depot):
    brut = lire_yaml(depot.etat)
    brut["episodes"]["05"]["statut"] = "termine"
    with pytest.raises(ValidationError):
        Etat.model_validate(brut)


def test_episode_manquant_refuse(depot):
    brut = lire_yaml(depot.etat)
    del brut["episodes"]["62"]
    with pytest.raises(ValidationError):
        Etat.model_validate(brut)


def test_commandes(depot, capsys):
    assert main(["--racine", str(depot.racine), "etat"]) == 0
    assert "Saison 4" in capsys.readouterr().out
    assert main(["--racine", str(depot.racine), "valider"]) == 0
    assert "import conforme" in capsys.readouterr().out


def test_bilan_manquant_refuse(depot):
    brut = lire_yaml(depot.etat)
    del brut["bilans"][4]
    with pytest.raises(ValidationError):
        Etat.model_validate(brut)


def test_ancien_statut_bilan_refuse(depot):
    brut = lire_yaml(depot.etat)
    brut["episodes"]["05"]["statut"] = "bilan"  # renommé « mesure » (A03)
    with pytest.raises(ValidationError):
        Etat.model_validate(brut)
