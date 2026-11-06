"""Jalon 4 : serie publier (dossier publier/NN/, texte du post) et dates du calendrier (9.7)."""

import dataclasses
import datetime as dt

import pytest
import yaml

from serie.calendrier import date_en_clair, dates_prevues, posts
from serie.charte import Charte
from serie.cli import main
from serie.depot import lire_yaml
from serie.publication import (
    HASHTAG_SERIE, HASHTAGS_FIXES, composer, composer_texte, controler_hashtags, controler_linkedin,
    mots_du_texte, premier_commentaire, prochain, publier_episode, titre_document,
)
from serie.rendu import charger_episode
from serie.schemas import Calendrier, LinkedIn
from rendus import CALENDRIER_ESSAI, CONTENU_08


@pytest.fixture(scope="module")
def ep08(depot):
    return charger_episode(depot, 8, CONTENU_08)


@pytest.fixture(scope="module")
def charte(depot):
    return Charte.charger(depot)


def _messages(diags):
    return " | ".join(d.message for d in diags)


# --- Texte du post ---------------------------------------------------------------------------

def test_texte_compose(ep08, charte):
    texte = composer_texte(ep08, charte, [])
    assert texte.startswith("Un modèle de Machine Learning n’apprend pas comme nous.\nIl descend une pente.\n\n")
    assert "Nº 08 · θ Théta, le Machine Learning, une notion à la fois. " in texte
    assert "Épisode suivant · Nº 09 : Descente stochastique et mini-lots." in texte
    # A34 : #ThetaML termine le post, après les hashtags fixes et celui du sujet.
    assert texte.endswith("#MachineLearning #IntelligenceArtificielle #DataScience #DeepLearning #ThetaML\n")
    assert "'" not in texte and 60 <= mots_du_texte(texte) <= 220
    assert controler_linkedin(ep08.contenu.linkedin, texte) == []


TEXTE_LIBRE = ("Le compteur de votre voiture affiche une dérivée.\n\n"
               "À 80 km/h, il ne dit ni où vous êtes ni où vous arriverez. Il dit à quel rythme votre position change, "
               "à cet instant. Pour un modèle, la dérivée du coût joue ce rôle, là où l'on se trouve : elle indique "
               "dans quel sens le coût évolue si le réglage bouge un peu.\n\n"
               "Petit défi : estimez de combien J monte si a passe à 3,01.")


def _avec(ep, li):
    return dataclasses.replace(ep, contenu=ep.contenu.model_copy(update={"linkedin": li}))


def test_texte_libre_sans_question_ni_promesse(ep08, charte):
    """A63 : structure libre, conclusion qui n'est pas une question, hashtag générique remplacé."""
    li = LinkedIn(texte=TEXTE_LIBRE, hashtag="#Derivee", generique="#Mathematiques")
    texte = composer_texte(_avec(ep08, li), charte, [])
    assert texte.startswith("Le compteur de votre voiture affiche une dérivée.\n\nÀ 80 km/h")
    assert "3,01.\n\nNº 08 · θ Théta" in texte
    assert texte.endswith("#MachineLearning #IntelligenceArtificielle #Mathematiques #Derivee #ThetaML\n")
    assert controler_linkedin(li, texte) == []


def test_texte_du_bilan(depot, charte):
    from serie.etat import charger_calendrier
    from serie.publication import composer_texte_bilan
    from serie.schemas import ContenuBilan

    bilan = ContenuBilan.model_validate({**lire_yaml(depot.racine / "tests" / "fixtures" / "bilan-1.yaml"),
                                         "linkedin": {"texte": TEXTE_LIBRE, "hashtag": "#Bilan"}})
    texte = composer_texte_bilan(bilan, charger_calendrier(depot), charte)
    assert "Saison 1 · θ Théta" in texte or "Saison 1 · θ" in texte
    assert "reprise le" in texte and texte.endswith("#Bilan #ThetaML\n")
    assert controler_linkedin(bilan.linkedin, texte) == []


def test_generique_par_defaut(ep08, charte):
    li = LinkedIn(texte=TEXTE_LIBRE, hashtag="#Derivee")
    assert composer_texte(_avec(ep08, li), charte, []).endswith(
        "#MachineLearning #IntelligenceArtificielle #DataScience #Derivee #ThetaML\n")


@pytest.mark.parametrize("champs", [
    {},  # ni texte ni ancienne forme
    {"accroche": "a", "intuition": "b"},  # ancienne forme incomplète
    {"texte": "t", "question": "q ?"},  # les deux formes
])
def test_une_seule_forme_de_bloc(champs):
    with pytest.raises(ValueError):
        LinkedIn(hashtag="#Derivee", **champs)


def test_lien_de_licence_dans_le_texte(ep08, charte):
    texte = composer_texte(ep08, charte, ["CC BY-SA 4.0 : https://creativecommons.org/licenses/by-sa/4.0/"])
    assert "Licence de l’image : CC BY-SA 4.0 : https://creativecommons.org/licenses/by-sa/4.0/" in texte


def test_adresses_non_composees():
    assert composer("Voir https://arxiv.org/abs/1609.04747 ; η = 0.1") == \
        "Voir https://arxiv.org/abs/1609.04747 ; η = 0,1"


@pytest.mark.parametrize("champ, valeur, attendu", [
    ("accroche", "Une ligne.\nDeux lignes.\nTrois lignes.\nQuatre lignes.", "3 lignes au plus"),
    ("promesse", "Dans le carrousel : la règle $θ ← θ − η∇J$.", "formule en balisage"),
    ("promesse", "Tout est sur https://exemple.org.", "lien externe"),
    ("promesse", "Un pas — puis un autre.", "tiret long"),
    ("intuition", "Tu vas voir. C'est incroyable 🚀.", "tutoiement"),
    ("intuition", "Tu vas voir. C'est incroyable 🚀.", "superlatif"),
    ("intuition", "Tu vas voir. C'est incroyable 🚀.", "emoji"),
    ("hashtag", "#MachineLearning", "déjà un hashtag fixe"),
    ("hashtag", "#DataScience", "déjà un hashtag fixe"),  # le générique par défaut
    ("generique", "#ThetaML", "generique : #ThetaML est déjà un hashtag fixe"),
])
def test_linkedin_pieges(ep08, champ, valeur, attendu):
    li = ep08.contenu.linkedin.model_copy(update={champ: valeur})
    assert attendu in _messages(controler_linkedin(li, None))


def test_texte_trop_court_et_bloc_absent(ep08, charte):
    court = LinkedIn(texte="Un bol. Une pente.", hashtag="#Derivee")
    message = _messages(controler_linkedin(court, composer_texte(_avec(ep08, court), charte, [])))
    assert "mots, attendu 60 à 220" in message
    assert "bloc « linkedin » absent" in _messages(controler_linkedin(None, None))


def test_hashtag_du_sujet_valide():
    with pytest.raises(ValueError):
        LinkedIn(accroche="a", intuition="b", promesse="c", question="d ?", hashtag="Deep Learning")


def test_signature_selon_l_episode_suivant(depot, ep08):
    """A22 : la signature reprend mot pour mot l'étiquette et le titre de la page de fin (une seule source)."""
    from serie.rendu import episode_suivant

    fiches = ep08.fiches
    assert prochain(ep08) == "Épisode suivant · Nº 09 : Descente stochastique et mini-lots."
    fin_saison = dataclasses.replace(ep08, fiche=fiches[19])
    assert prochain(fin_saison) == "Bilan, puis saison 2 · Nº 20 : Entraînement, validation, test."
    for ep in (ep08, fin_saison, dataclasses.replace(ep08, fiche=fiches[62])):
        bloc = episode_suivant(ep)
        assert prochain(ep).startswith(bloc["etiquette"]) and bloc["titre"] in prochain(ep)
    assert prochain(dataclasses.replace(ep08, fiche=fiches[62])) == "Fin de la série : Merci de l'avoir suivie."


def test_titre_et_premier_commentaire(ep08):
    assert titre_document(ep08.fiche) == "Nº 08 · La descente de gradient"
    commentaire = premier_commentaire(ep08.fiche, [])
    assert commentaire.startswith("Références de l’épisode Nº 08 :\n")
    assert "- D2L 12.3 : https://d2l.ai/chapter_optimization/gd.html" in commentaire
    assert "https://arxiv.org/abs/1609.04747" in commentaire
    assert len(commentaire.splitlines()) == 1 + ep08.fiche.references.nombre


# --- Calendrier ------------------------------------------------------------------------------

@pytest.fixture
def calendrier(depot) -> Calendrier:
    brut = lire_yaml(CALENDRIER_ESSAI)  # rythme A32 figé : le calendrier réel change avec les décisions
    brut["date_lancement"] = dt.date(2026, 11, 3)  # un mardi
    return Calendrier.model_validate(brut)


def test_dates_de_la_saison_1(calendrier):
    dates = dates_prevues(calendrier)
    assert len(dates) == 62 + 4
    assert dates[("episode", 1)] == dt.datetime(2026, 11, 3, 8, 30)
    assert dates[("episode", 3)] == dt.datetime(2026, 11, 7, 10, 0)  # samedi, semaine impaire
    assert dates[("episode", 4)] == dt.datetime(2026, 11, 10, 8, 30)  # semaine paire : mardi, jeudi
    assert dates[("episode", 6)] == dt.datetime(2026, 11, 17, 8, 30)
    # 20 posts sur 8 semaines (4 à 3 posts, 4 à 2) : le bilan tombe le jeudi de la 8e semaine.
    assert dates[("bilan", 1)] == dt.datetime(2026, 12, 24, 8, 30)
    # 2 semaines de pause, puis la saison 2 reprend sur une semaine impaire.
    assert dates[("episode", 20)] == dt.datetime(2027, 1, 12, 8, 30)
    assert dates[("episode", 22)] == dt.datetime(2027, 1, 16, 10, 0)
    ordre = [p for saison in posts(calendrier) for p in saison]
    assert [dates[p] for p in ordre] == sorted(dates.values())


def test_lancement_un_mercredi(calendrier):
    dates = dates_prevues(calendrier.model_copy(update={"date_lancement": dt.date(2026, 11, 4)}))
    assert dates[("episode", 1)] == dt.datetime(2026, 11, 5, 8, 30)
    assert dates[("episode", 2)] == dt.datetime(2026, 11, 7, 10, 0)


def test_sans_date_de_lancement(depot):
    assert dates_prevues(Calendrier.model_validate(lire_yaml(CALENDRIER_ESSAI))) == {}


def test_date_en_clair():
    assert date_en_clair(dt.datetime(2026, 11, 3, 8, 30), "Africa/Abidjan") == \
        "mardi 3 novembre 2026, 8 h 30 (Africa/Abidjan)"
    assert date_en_clair(dt.datetime(2026, 11, 7, 10, 0), "Africa/Abidjan") == "samedi 7 novembre 2026, 10 h (Africa/Abidjan)"


# --- serie publier ---------------------------------------------------------------------------

def test_publier_ecrit_le_dossier(depot, tmp_path):
    pub = publier_episode(depot, 8, CONTENU_08, tmp_path / "publier", tmp_path / "sortie")
    reel = Calendrier.model_validate(lire_yaml(depot.calendrier))
    sans_date = reel.date_lancement is None
    assert [d.lieu for d in pub.diagnostics] == (["calendrier"] if sans_date else [])
    noms = sorted(p.relative_to(pub.dossier).as_posix() for p in pub.dossier.rglob("*") if p.is_file())
    assert noms == ["08-la-descente-de-gradient.pdf", *[f"apercus/page-{k:02d}.png" for k in range(1, 9)],
                    "couvertures/a.png", "couvertures/classique.png", "date.txt", "premier-commentaire.txt", "texte.txt", "titre.txt"]
    assert (pub.dossier / "titre.txt").read_text(encoding="utf-8") == "Nº 08 · La descente de gradient\n"
    date = (pub.dossier / "date.txt").read_text(encoding="utf-8")
    assert date.startswith("à fixer") if sans_date else date.startswith(date_en_clair(dates_prevues(reel)[("episode", 8)], reel.fuseau))


def test_publier_refuse_un_texte_fautif(depot, tmp_path, capsys):
    brut = lire_yaml(CONTENU_08)
    brut["linkedin"]["question"] = "Tout est sur https://exemple.org."
    fautif = tmp_path / "contenu-08.yaml"
    fautif.write_text(yaml.safe_dump(brut, allow_unicode=True, sort_keys=False), encoding="utf-8")
    sortie = tmp_path / "publier"
    assert main(["--racine", str(depot.racine), "publier", "8", "--contenu", str(fautif),
                 "--sortie", str(sortie), "--rendu", str(tmp_path / "sortie")]) == 1
    assert "lien externe" in capsys.readouterr().err
    assert not sortie.exists() and not (tmp_path / "sortie").exists()



# --- A34 : hashtag de série ------------------------------------------------------------------------------

def test_hashtag_de_serie_dans_la_charte(charte):
    assert charte.donnees["serie"]["hashtag"] == HASHTAG_SERIE == "#ThetaML"


@pytest.mark.parametrize("fin, attendu", [
    ("#MachineLearning #IntelligenceArtificielle #DataScience #DeepLearning", "#ThetaML absent"),
    ("#MachineLearning #IntelligenceArtificielle #DataScience #DeepLearning #thetaml", "écrit « #thetaml »"),
    ("#MachineLearning #IntelligenceArtificielle #DataScience #DeepLearning #ThetaMl", "écrit « #ThetaMl »"),
])
def test_post_sans_hashtag_de_serie(fin, attendu):
    (d,) = controler_hashtags(f"Un texte.\n\n{fin}\n", "texte LinkedIn")
    assert attendu in d.message and d.niveau.name == "ERREUR"


FIXES = "#MachineLearning #IntelligenceArtificielle #DataScience"


@pytest.mark.parametrize("fin, attendu", [
    (f"{FIXES} #DeepLearning #ThetaML", None),
    (f"{FIXES} #ThetaML", None),  # sans hashtag de sujet : 4, dans la limite
    (f"{FIXES} #DeepLearning #Optimisation #ThetaML", "6 hashtags, attendu 4 à 5"),
    (f"{FIXES} #ThetaML #DeepLearning", "doit être le dernier hashtag"),
    (f"{FIXES} #ThetaML #ThetaML", "une seule fois"),
    ("#ThetaML", "1 hashtags, attendu 4 à 5"),
])
def test_cinq_hashtags_au_plus_theta_ml_en_dernier(fin, attendu):
    diags = controler_hashtags(f"Un texte.\n\n{fin}\n", "texte LinkedIn")
    assert [attendu in d.message for d in diags] == ([] if attendu is None else [True])


def test_hashtag_dans_le_corps_du_post(ep08, charte):
    li = ep08.contenu.linkedin.model_copy(update={"promesse": ep08.contenu.linkedin.promesse + " #IA"})
    ep = dataclasses.replace(ep08, contenu=ep08.contenu.model_copy(update={"linkedin": li}))
    messages = _messages(controler_linkedin(li, composer_texte(ep, charte, [])))
    assert "hashtag « #IA » dans le texte" in messages and "6 hashtags" in messages


def test_hashtag_du_sujet_ne_peut_pas_etre_celui_de_la_serie(ep08):
    li = ep08.contenu.linkedin.model_copy(update={"hashtag": "#thetaML"})
    assert "déjà un hashtag fixe" in _messages(controler_linkedin(li, None))


def test_serie_valider_controle_les_posts_prepares(tmp_path):
    from serie.depot import Depot
    from serie.validation import controler_posts

    for nn, fin in (("08", "#DeepLearning #ThetaML"), ("09", "#DeepLearning #IA"), ("10", "#DeepLearning #THETAML"),
                    ("11", "#DeepLearning #IA #Optimisation #ThetaML")):
        (tmp_path / "publier" / nn).mkdir(parents=True)
        (tmp_path / "publier" / nn / "texte.txt").write_text(f"Texte.\n\n#MachineLearning #DataScience {fin}\n",
                                                             encoding="utf-8")
    diags = controler_posts(Depot(tmp_path))
    assert [(d.lieu, d.niveau.name) for d in diags] == [("publier/09/texte.txt", "ERREUR"),
                                                         ("publier/10/texte.txt", "ERREUR"),
                                                         ("publier/11/texte.txt", "ERREUR")]
    assert "absent" in diags[0].message and "#THETAML" in diags[1].message and "6 hashtags" in diags[2].message
