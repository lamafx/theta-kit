"""Jalon 4 : reprise sûre (étapes, empreintes, écritures atomiques) et rendu incrémental."""

import shutil

import pytest
import yaml
from pypdf import PdfReader

from serie.cli import main
from serie.depot import Depot, lire_yaml
from serie.reprise import ETAPES, enregistrer_etape, etapes_a_refaire, lire_etat, mettre_a_jour, premiere_etape
from serie.rendu import rendre_episode

from aide_comprehension import noter
from rendus import CALENDRIER_ESSAI, CONTENU_08


@pytest.fixture
def copie(depot, tmp_path) -> Depot:
    """Dépôt réduit dans un dossier temporaire : etat.yaml y est écrit sans toucher au vrai."""
    shutil.copytree(depot.episodes, tmp_path / "banque" / "episodes")
    (tmp_path / "charte").mkdir()
    for nom in ("glossaire.yaml", "regles-redaction.md"):
        shutil.copy(depot.charte / nom, tmp_path / "charte" / nom)
    # L'épisode 08 sert d'épisode neuf : son entrée réelle (produit le 2026-11-01) est vidée dans la copie.
    etat = lire_yaml(depot.etat)
    etat["episodes"]["08"] = {**etat["episodes"]["62"], "statut": "a_faire", "etapes": {}}
    etat["bilans"][1]["statut"] = "a_faire"  # indépendant du vrai bilan, généré depuis le 2026-11-06
    (tmp_path / "etat.yaml").write_text(yaml.safe_dump(etat, allow_unicode=True, sort_keys=False), encoding="utf-8")
    shutil.copy(CALENDRIER_ESSAI, tmp_path / "calendrier.yaml")  # figé, sans date de lancement
    (tmp_path / "contenu").mkdir()
    shutil.copy(CONTENU_08, tmp_path / "contenu" / "08.yaml")
    copie = Depot(tmp_path)
    noter(copie, 8)  # au-dessus du seuil : les étapes comprehension et publication s'enregistrent
    return copie


# --- Étapes et empreintes -------------------------------------------------------------------

def test_episode_neuf_repart_de_la_lecture(copie):
    assert etapes_a_refaire(copie, 8) == [(e, "pas encore faite") for e in ETAPES]
    assert premiere_etape(copie, 8) == "lecture"


def test_etape_faite_puis_suivante(copie):
    ep = enregistrer_etape(copie, 8, "lecture")
    assert ep["statut"] == "a_faire" and len(ep["etapes"]["lecture"]["empreinte"]) == 64
    assert premiere_etape(copie, 8) == "sources"
    assert "lecture" not in dict(etapes_a_refaire(copie, 8))


def test_entree_modifiee_rend_l_etape_a_refaire(copie):
    enregistrer_etape(copie, 8, "contenu")
    assert "contenu" not in dict(etapes_a_refaire(copie, 8))
    chemin = copie.racine / "contenu" / "08.yaml"
    chemin.write_text(chemin.read_text(encoding="utf-8") + "\n# retouche\n", encoding="utf-8")
    assert dict(etapes_a_refaire(copie, 8))["contenu"] == "une entrée a changé"


def test_relancer_une_etape_donne_la_meme_empreinte(copie):
    premiere = enregistrer_etape(copie, 8, "rendu")["etapes"]["rendu"]["empreinte"]
    assert enregistrer_etape(copie, 8, "rendu")["etapes"]["rendu"]["empreinte"] == premiere


def test_etape_inconnue_refusee(copie):
    with pytest.raises(ValueError, match="étape inconnue"):
        enregistrer_etape(copie, 8, "dessin")


def test_publication_passe_a_genere_puis_relu_repasse_a_genere(copie):
    for etape in ETAPES:
        enregistrer_etape(copie, 8, etape)
    assert lire_etat(copie)["episodes"]["08"]["statut"] == "genere"
    assert premiere_etape(copie, 8) is None

    brut = lire_yaml(copie.etat)
    brut["episodes"]["08"]["statut"] = "relu"
    copie.etat.write_text(yaml.safe_dump(brut, allow_unicode=True, sort_keys=False), encoding="utf-8")
    # Seul le 08 compte : les épisodes relus du vrai état n'ont pas leurs entrées dans ce dépôt réduit.
    assert [l for l in mettre_a_jour(copie) if l.startswith("Nº 08")] == []  # rien n'a changé : reste relu

    chemin = copie.racine / "contenu" / "08.yaml"
    chemin.write_text(chemin.read_text(encoding="utf-8") + "\n# retouche\n", encoding="utf-8")
    (ligne,) = [l for l in mettre_a_jour(copie) if l.startswith("Nº 08")]
    assert ligne.startswith("Nº 08 : relu → généré") and "contenu" in ligne
    assert lire_etat(copie)["episodes"]["08"]["statut"] == "genere"


def test_etat_ecrit_atomiquement_cles_entre_guillemets(copie):
    enregistrer_etape(copie, 8, "lecture")
    texte = copie.etat.read_text(encoding="utf-8")
    assert "\n  '08':\n" in texte and "\n  '09':\n" in texte and "\n  '62':\n" in texte
    assert "\n  08:" not in texte
    assert not list(copie.racine.glob("*.partiel"))
    assert len(lire_etat(copie)["episodes"]) == 62
    assert lire_etat(copie)["bilans"].keys() == {1, 2, 3, 4}


def test_commandes_etape_et_reprendre(copie, capsys):
    racine = ["--racine", str(copie.racine)]
    assert main([*racine, "reprendre", "8"]) == 0
    assert capsys.readouterr().out.startswith("lecture : pas encore faite")
    assert main([*racine, "etape", "8", "lecture"]) == 0
    assert "étape « lecture » enregistrée ; statut a_faire" in capsys.readouterr().out
    assert main([*racine, "reprendre", "8"]) == 0
    assert capsys.readouterr().out.startswith("sources : pas encore faite")
    assert main([*racine, "etat", "--maj"]) == 0


# --- Rendu incrémental ----------------------------------------------------------------------

def test_rendu_incremental(depot, tmp_path):
    sortie = tmp_path / "08"
    premier = rendre_episode(depot, 8, sortie, CONTENU_08)
    assert premier.rephotographiees == list(range(1, 9))
    assert (sortie / "planche.png").exists() and (sortie / "empreintes.yaml").exists()
    dates = {p.name: p.stat().st_mtime_ns for p in premier.pngs}

    assert rendre_episode(depot, 8, sortie, CONTENU_08).rephotographiees == []

    contenu = lire_yaml(CONTENU_08)
    contenu["pages"][2]["texte"] = contenu["pages"][2]["texte"].replace("avance vite", "avance à grands pas")
    retouche = tmp_path / "contenu-08-retouche.yaml"
    retouche.write_text(yaml.safe_dump(contenu, allow_unicode=True, sort_keys=False), encoding="utf-8")
    troisieme = rendre_episode(depot, 8, sortie, retouche)
    assert troisieme.rephotographiees == [3]
    assert {p.name for p in troisieme.pngs if p.stat().st_mtime_ns != dates[p.name]} == {"page-03.png"}
    assert len(PdfReader(troisieme.pdf).pages) == 8

    (sortie / "page-05.png").unlink()  # page effacée à la main : refaite
    assert rendre_episode(depot, 8, sortie, retouche).rephotographiees == [5]
    assert rendre_episode(depot, 8, sortie, retouche, incremental=False).rephotographiees == list(range(1, 9))


# --- Statuts posés par l'utilisateur (9.6) --------------------------------------------------------------

def test_statuts_dans_l_ordre(copie, capsys):
    racine = ["--racine", str(copie.racine)]
    assert main([*racine, "statut", "8", "relu"]) == 1  # encore « à faire »
    assert "a_faire → relu refusé" in capsys.readouterr().err
    for etape in ETAPES:
        enregistrer_etape(copie, 8, etape)
    assert main([*racine, "statut", "8", "relu"]) == 0
    assert main([*racine, "statut", "8", "publie"]) == 1  # date obligatoire
    assert "date de publication est obligatoire" in capsys.readouterr().err
    assert main([*racine, "statut", "08", "publie", "--le", "2026-11-03"]) == 0
    assert main([*racine, "statut", "8", "mesure"]) == 0
    ep = lire_etat(copie)["episodes"]["08"]
    assert ep["statut"] == "mesure" and str(ep["publie_le"]) == "2026-11-03"


def test_bilan_genere_puis_relu(copie):
    from serie.reprise import changer_statut

    assert changer_statut(copie, "bilan-1", "genere")["statut"] == "genere"
    assert changer_statut(copie, "bilan-1", "relu")["statut"] == "relu"
    with pytest.raises(ValueError, match="refusé"):
        changer_statut(copie, "62", "genere")  # un épisode passe à « généré » par l'étape publication


def test_prochaine_publication(copie):
    import datetime as dt

    from serie.etat import prochaine_publication
    from serie.schemas import Calendrier, Etat

    calendrier = Calendrier.model_validate({**lire_yaml(copie.calendrier), "date_lancement": "2026-11-03"})
    brut = lire_yaml(copie.etat)
    brut["episodes"]["01"]["statut"] = "a_faire"  # indépendant de l'avancement réel de la production
    etat = Etat.model_validate(brut)
    (ligne,) = prochaine_publication(etat, calendrier, dt.datetime(2026, 11, 1))
    assert ligne == "Prochaine publication : Nº 01, mardi 3 novembre 2026, 8 h 30 (Africa/Abidjan) ; statut à faire"
    assert prochaine_publication(etat, Calendrier.model_validate(lire_yaml(copie.calendrier))) == []


def test_empreinte_independante_des_fins_de_ligne(tmp_path):
    """Un fichier en CRLF (Windows) et le même en LF (GitHub Actions) ont la même empreinte (2026-11-08)."""
    from serie.reprise import contenu_normalise
    (tmp_path / "a.yaml").write_bytes(b"cle: 1\r\nautre: 2\r\n")
    (tmp_path / "b.yaml").write_bytes(b"cle: 1\nautre: 2\n")
    (tmp_path / "c.png").write_bytes(b"\x89PNG\0\r\n")
    assert contenu_normalise(tmp_path / "a.yaml") == contenu_normalise(tmp_path / "b.yaml")
    assert contenu_normalise(tmp_path / "c.png") == b"\x89PNG\0\r\n"
