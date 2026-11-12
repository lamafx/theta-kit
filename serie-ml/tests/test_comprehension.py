"""Note de compréhension (décision du 2026-11-12) : sous 8,5 pour le carrousel ou le post, rien n'est généré ni publié."""

import datetime as dt
import shutil
from pathlib import Path

import pytest
import yaml

from serie import linkedin as li
from serie.comprehension import CRITERES, SEUIL, chemin, evaluer, exiger
from serie.depot import Depot
from serie.reprise import ETAPES, enregistrer_etape

from aide_comprehension import noter

RACINE = Path(__file__).resolve().parents[1]
PREVU = dt.datetime(2026, 11, 10, 8, 30, tzinfo=dt.timezone.utc)


@pytest.fixture
def depot(tmp_path) -> Depot:
    for nom in ("etat.yaml", "calendrier.yaml"):
        shutil.copy(RACINE / nom, tmp_path / nom)
    shutil.copytree(RACINE / "publier" / "01", tmp_path / "publier" / "01")
    return Depot(tmp_path)


def test_seuil_et_etape():
    assert SEUIL == 8.5
    assert list(ETAPES).index("comprehension") == list(ETAPES).index("publication") - 1


def test_sans_note_rien_ne_passe(depot):
    res = evaluer(depot, 1)
    assert not res.suffisante and "non notée" in res.problemes[0]
    with pytest.raises(ValueError, match="non notée"):
        enregistrer_etape(depot, 1, "comprehension")
    with pytest.raises(ValueError, match="non notée"):
        enregistrer_etape(depot, 1, "publication")


def test_note_au_seuil_passe(depot):
    noter(depot, 1, 8.5)
    res = exiger(depot, 1)
    assert res.notes == {"carrousel": 8.5, "post": 8.5}


@pytest.mark.parametrize("partie", ["carrousel", "post"])
def test_une_seule_partie_sous_le_seuil_bloque(depot, partie):
    noter(depot, 1, 9.5, **{partie: 8.0})
    res = evaluer(depot, 1)
    assert not res.suffisante
    assert any("sous le seuil" in p and "8/10" in p for p in res.problemes)


def test_moyenne_des_criteres(depot):
    noter(depot, 1, 9)
    f = chemin(depot, 1)
    brut = yaml.safe_load(f.read_text(encoding="utf-8"))
    brut["carrousel"]["criteres"]["premier_abord"]["note"] = 6  # (6 + 5 × 9) / 6 = 8,5
    f.write_text(yaml.safe_dump(brut, allow_unicode=True), encoding="utf-8")
    assert evaluer(depot, 1).notes["carrousel"] == 8.5
    brut["carrousel"]["criteres"]["premier_abord"]["note"] = 5.5
    f.write_text(yaml.safe_dump(brut, allow_unicode=True), encoding="utf-8")
    assert not evaluer(depot, 1).suffisante


def test_critere_manquant_ou_sans_raison(depot):
    noter(depot, 1, 10)
    f = chemin(depot, 1)
    brut = yaml.safe_load(f.read_text(encoding="utf-8"))
    del brut["post"]["criteres"]["accroche"]
    brut["carrousel"]["criteres"]["concret"]["raison"] = ""
    brut["carrousel"]["criteres"]["inventé"] = {"note": 10, "raison": "x"}
    f.write_text(yaml.safe_dump(brut, allow_unicode=True), encoding="utf-8")
    res = evaluer(depot, 1)
    texte = " ; ".join(res.problemes)
    assert "post.accroche sans note" in texte and "carrousel.concret sans raison" in texte and "inconnus" in texte
    assert res.notes["post"] is None


def test_mauvais_numero(depot):
    noter(depot, 1, 10)
    f = chemin(depot, 1)
    f.write_text(f.read_text(encoding="utf-8").replace("episode: 1", "episode: 2"), encoding="utf-8")
    assert not evaluer(depot, 1).suffisante


def test_la_tournee_refuse_un_post_sous_le_seuil(depot, monkeypatch):
    monkeypatch.setattr(li, "etapes_a_refaire", lambda depot, numero: [])
    brut = yaml.safe_load(depot.etat.read_text(encoding="utf-8"))
    brut["episodes"]["01"]["statut"] = "relu"
    depot.etat.write_text(yaml.safe_dump(brut, allow_unicode=True, sort_keys=False), encoding="utf-8")
    noter(depot, 1, 9, post=7.5)
    envoi = li.preparer(depot, 1, PREVU + dt.timedelta(minutes=2))
    assert any("texte du post 7,5/10" in r for r in envoi.refus)
    noter(depot, 1, 9)
    assert li.preparer(depot, 1, PREVU + dt.timedelta(minutes=2)).refus == []


def test_criteres_de_l_agent_identiques_au_code():
    corps = (RACINE / ".claude" / "agents" / "lecteur-debutant.md").read_text(encoding="utf-8")
    for criteres in CRITERES.values():
        for cle in criteres:
            assert f"`{cle}`" in corps, cle
    assert "sortie/NN/comprehension.yaml" in corps
