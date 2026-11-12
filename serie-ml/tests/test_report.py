"""serie reporter (A10) et suppression d'un post : la date d'un seul post bouge, entre ses voisins ; un post supprimé
revient à « relu ». Tout se passe dans une copie du dépôt."""

import datetime as dt
import shutil
from pathlib import Path

import pytest
import yaml

from serie import linkedin as li
from serie.calendrier import dates_prevues
from serie.depot import Depot
from serie.etat import charger_calendrier
from serie.report import lire_quand, reporter
from serie.reprise import enregistrer_etape, etapes_a_refaire

from aide_comprehension import noter

RACINE = Path(__file__).resolve().parents[1]
UTC = dt.timezone.utc
AVANT_LANCEMENT = dt.datetime(2026, 11, 1, tzinfo=UTC)


@pytest.fixture
def depot(tmp_path) -> Depot:
    for nom in ("etat.yaml", "calendrier.yaml"):
        shutil.copy(RACINE / nom, tmp_path / nom)
    for n in ("05", "06"):
        shutil.copytree(RACINE / "publier" / n, tmp_path / "publier" / n)
    copie = Depot(tmp_path)
    for n in (5, 6):
        noter(copie, n)  # l'étape publication exige la note de compréhension
    return copie


def statut(depot: Depot, cle: str, valeur: str) -> None:
    brut = yaml.safe_load(depot.etat.read_text(encoding="utf-8"))
    brut["episodes"][cle]["statut"] = valeur
    depot.etat.write_text(yaml.safe_dump(brut, allow_unicode=True, sort_keys=False), encoding="utf-8")


def test_reporter_un_seul_post(depot):
    avant = dates_prevues(charger_calendrier(depot))
    ancienne, nouvelle = reporter(depot, "5", lire_quand("2026-11-25 08:30"), AVANT_LANCEMENT)
    assert ancienne == dt.datetime(2026, 11, 24, 8, 30) and nouvelle == dt.datetime(2026, 11, 25, 8, 30)
    apres = dates_prevues(charger_calendrier(depot))
    assert apres[("episode", 5)] == nouvelle
    assert {k: v for k, v in apres.items() if k != ("episode", 5)} == {k: v for k, v in avant.items() if k != ("episode", 5)}
    assert (depot.racine / "publier" / "05" / "date.txt").read_text(encoding="utf-8").startswith("mercredi 25 novembre 2026, 8 h 30")
    texte = depot.calendrier.read_text(encoding="utf-8")
    assert "reports:\n  '05': '2026-11-25 08:30'" in texte and "# Décision de l'utilisateur" in texte  # commentaires gardés


def test_retour_a_la_date_du_calendrier_efface_le_report(depot):
    reporter(depot, "05", lire_quand("2026-11-25 08:30"), AVANT_LANCEMENT)
    reporter(depot, "05", lire_quand("2026-11-24 08:30"), AVANT_LANCEMENT)
    assert "reports:" not in depot.calendrier.read_text(encoding="utf-8")
    assert charger_calendrier(depot).reports == {}


@pytest.mark.parametrize("quand, motif", [
    ("2026-11-19 08:00", "précédent"),  # avant le Nº 04 (19 novembre, 8 h 30)
    ("2026-11-26 08:30", "suivant"),  # en même temps que le Nº 06
    ("2026-10-01 08:30", "futur"),
])
def test_ordre_et_futur(depot, quand, motif):
    maintenant = dt.datetime(2026, 11, 2, tzinfo=UTC) if motif != "futur" else AVANT_LANCEMENT
    with pytest.raises(ValueError, match=motif):
        reporter(depot, "05", lire_quand(quand), maintenant)


def test_post_publie_ne_bouge_plus(depot):
    statut(depot, "05", "publie")
    with pytest.raises(ValueError, match="déjà publié"):
        reporter(depot, "05", lire_quand("2026-11-25 08:30"), AVANT_LANCEMENT)


def test_etape_publication_reste_a_jour(depot, monkeypatch):
    for etape in ("publication",):
        enregistrer_etape(depot, 5, etape)
    assert not [e for e, _ in etapes_a_refaire(depot, 5) if e == "publication"]
    reporter(depot, "05", lire_quand("2026-11-25 10:00"), AVANT_LANCEMENT)
    assert not [e for e, _ in etapes_a_refaire(depot, 5) if e == "publication"]


def test_lire_quand():
    assert lire_quand("2026-11-25T8:05") == dt.datetime(2026, 11, 25, 8, 5)
    with pytest.raises(ValueError):
        lire_quand("25/11/2026")


class FauxClient:
    def __init__(self):
        self.supprimes = []

    def supprimer_post(self, post):
        self.supprimes.append(post)


def test_supprimer_un_post(depot):
    statut(depot, "05", "publie")
    trace = depot.racine / "publier" / "linkedin" / "05.yaml"
    trace.parent.mkdir(parents=True, exist_ok=True)
    trace.write_text("post: urn:li:share:42\nlien: https://www.linkedin.com/feed/update/urn:li:share:42/\n", encoding="utf-8")
    client = FauxClient()
    li.supprimer(depot, "5", client, dt.datetime(2026, 11, 24, 10, tzinfo=UTC))
    assert client.supprimes == ["urn:li:share:42"]
    assert not trace.exists()
    (archive,) = (depot.racine / "publier" / "linkedin" / "supprimes").glob("05-*.yaml")
    assert "supprime_le" in yaml.safe_load(archive.read_text(encoding="utf-8"))
    e = yaml.safe_load(depot.etat.read_text(encoding="utf-8"))["episodes"]["05"]
    assert e["statut"] == "relu" and e["publie_le"] is None


def test_supprimer_sans_post(depot):
    with pytest.raises(li.ErreurLinkedIn, match="aucun post"):
        li.supprimer(depot, "06", FauxClient(), dt.datetime(2026, 11, 24, tzinfo=UTC))
