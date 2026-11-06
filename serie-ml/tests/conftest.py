from pathlib import Path

import pytest

from serie.depot import Depot, lire_yaml

RACINE = Path(__file__).resolve().parents[1]
DONNEES = Path(__file__).resolve().parent / "fixtures"


@pytest.fixture(scope="session")
def depot() -> Depot:
    return Depot(RACINE)


@pytest.fixture
def fiche_08(depot: Depot) -> dict:
    (chemin,) = depot.episodes.glob("08-*.yaml")
    return lire_yaml(chemin)


@pytest.fixture
def contenu_valide() -> dict:
    return lire_yaml(DONNEES / "contenu-valide.yaml")
