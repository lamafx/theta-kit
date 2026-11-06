"""Jalon 3 : chaque contrôle de `serie verifier` échoue sur son cas piégé (et laisse passer le cas sain).

Les cas sains partent de la fixture de l'épisode 08 (tests/fixtures/contenu-08.yaml).
"""

import dataclasses
import copy

import pytest

from serie.charte import Charte
from serie.depot import lire_yaml
from serie.diagnostics import Niveau
from serie.etalon import PLANCHES
from serie.mesures import mesurer_pages, vides_png
from serie.rendu import Moteur, charger_episode, charger_fiches, pages_html
from serie.schemas import Contenu, Sources
from serie.verification import (
    SEUIL_COUVERTURE_CLASSIQUE, SEUIL_REMPLISSAGE, VIDE_COUVERTURE_CLASSIQUE, VIDES_REFERENCES, charger_termes,
    compter_mots, controler_fin, controler_images,
    controler_interdits, controler_mesures, controler_mots, controler_nombres, controler_references,
    controler_rappel, controler_schema, controler_termes, controler_typographie_html, controler_visuels,
    verifier_episode,
)
from rendus import CONTENU_08, FIXTURES, REFERENCES

LIMITES = {"ouverture": 40, "contenu": 70}


def erreurs(diags):
    return [d for d in diags if d.niveau is Niveau.ERREUR]


def avertissements(diags):
    return [d for d in diags if d.niveau is Niveau.AVERTISSEMENT]


@pytest.fixture
def brut08():
    return lire_yaml(CONTENU_08)


@pytest.fixture(scope="module")
def fiches(depot):
    return charger_fiches(depot)


@pytest.fixture(scope="module")
def termes(depot):
    return charger_termes(depot)


def contenu(brut):
    return Contenu.model_validate(brut)


def zone_et_minimums(depot):
    c = Charte.charger(depot)
    f, t = c.format, c.tailles
    zone = {"gauche": f["marges_px"]["cotes"], "droite": f["largeur_px"] - f["marges_px"]["cotes"],
            "haut": f["marges_px"]["haut"], "bas": f["hauteur_px"] - f["marges_px"]["bas"]}
    return zone, t["texte_min"], t["credit"]


def mesurer(depot, htmls, tmp_path):
    zone, lecture, tout = zone_et_minimums(depot)
    return mesurer_pages(htmls, tmp_path, zone, lecture, tout)


# --- Schéma (C2) -----------------------------------------------------------------------------------

def test_schema_sain(brut08):
    c, diags = controler_schema(brut08)
    assert c is not None and diags == []


@pytest.mark.parametrize("piege", [
    lambda b: b["pages"][1].pop("visuel"),  # ouverture sans visuel
    lambda b: b["pages"][6].pop("visuel"),  # piège sans visuel
    lambda b: b["pages"][6].pop("encadre"),  # piège sans « Ce que ça veut dire »
    lambda b: b["pages"][6]["encadre"].update(titre="Autre chose"),
    lambda b: b["pages"][2].pop("visuel"),  # mécanisme sans visuel
])
def test_schema_visuel_obligatoire(brut08, piege):
    piege(brut08)
    c, diags = controler_schema(brut08)
    assert c is None and erreurs(diags)


def test_ouverture_et_piege_sans_visuel(brut08):
    """Cas piégé de C2 : une ouverture et un piège sans visuel, dans le même contenu."""
    brut08["pages"][1].pop("visuel")
    brut08["pages"][6].pop("visuel")
    _, diags = controler_schema(brut08)
    lieux = " ".join(d.message for d in diags)
    assert "pages.1.ouverture.visuel" in lieux and "pages.6.piege.visuel" in lieux


# --- Familles et paramètres -----------------------------------------------------------------------------

def test_visuels_sains(brut08):
    assert controler_visuels(contenu(brut08)) == []


@pytest.mark.parametrize("piege, attendu", [
    (lambda b: b["pages"][1]["visuel"]["params"].update(couleur="rouge"), "paramètres non admis ['couleur']"),
    (lambda b: b["pages"][1]["visuel"]["params"].update(forme="spirale"), "forme « spirale » inconnue"),
    (lambda b: b["pages"][1]["visuel"].update(calcul="invente"), "calcul inconnu"),
    (lambda b: b["pages"][1]["visuel"].update(params={}), "vignette est réservée aux planches"),
    (lambda b: b["pages"][3]["cas"][0]["params"].update(epaisseur=4), "paramètres non admis ['epaisseur']"),
])
def test_visuels_pieges(brut08, piege, attendu):
    piege(brut08)
    diags = controler_visuels(contenu(brut08))
    assert any(attendu in d.message for d in erreurs(diags)), diags


# --- Mots par page ------------------------------------------------------------------------------------

def test_mots_sains(brut08):
    assert erreurs(controler_mots(contenu(brut08), LIMITES)) == []


def test_mots_trop_nombreux(brut08):
    brut08["pages"][2]["texte"] = " ".join(["mot"] * 80)
    diags = controler_mots(contenu(brut08), LIMITES)
    assert any("80 mots" in d.message or "mots (titre et texte)" in d.message for d in erreurs(diags))


def test_ouverture_limitee_a_40_mots(brut08):
    brut08["pages"][1]["texte"] = " ".join(["mot"] * 39)
    assert erreurs(controler_mots(contenu(brut08), LIMITES))


def test_question_de_30_mots_au_plus(brut08):
    brut08["pages"][-1]["verification"]["question"] = " ".join(["mot"] * 31) + " ?"
    assert any("Vérifiez-vous" in d.message for d in erreurs(controler_mots(contenu(brut08), LIMITES)))


def test_compter_mots():
    assert compter_mots("Le pas vaut $!η$ × la pente, d'eux-mêmes.") == 7


# --- Mots interdits, vouvoiement ------------------------------------------------------------------------

def test_interdits_sains(brut08):
    assert controler_interdits(contenu(brut08)) == []


def test_interdits_pieges(brut08):
    brut08["pages"][2]["texte"] = "Tu vas voir, c'est incroyable 🚀 : ton modèle apprend."
    messages = " ".join(d.message for d in erreurs(controler_interdits(contenu(brut08))))
    assert "superlatif « incroyable »" in messages and "emoji" in messages
    assert "tutoiement « Tu »" in messages and "tutoiement « ton »" in messages


# --- Termes ------------------------------------------------------------------------------------------

def test_termes_sains(brut08, termes):
    assert erreurs(controler_termes(contenu(brut08), 8, termes)) == []


def test_terme_technique_trop_tot(brut08, termes):
    """Cas piégé : « gradient » (épisode 07) dans un épisode 01."""
    brut08["pages"][2]["texte"] = "Le gradient indique la direction."
    diags = erreurs(controler_termes(contenu({**brut08, "episode": 1}), 1, termes))
    assert any("« gradient »" in d.message and "07" in d.message for d in diags)


def test_terme_annonce_admis(brut08, termes):
    """2026-10-26 : un terme cité dans la phrase qui donne le numéro de l'épisode qui l'introduit est annoncé."""
    brut08["pages"][2]["texte"] = "Non supervisé et par renforcement : Nº 03. Le non supervisé regroupe."
    diags = erreurs(controler_termes(contenu({**brut08, "episode": 1}), 1, termes))
    assert [d.message for d in diags if "non supervisé" in d.message] == []  # déjà annoncé dans ce champ
    brut08["pages"][2]["texte"] = "Le non supervisé regroupe des clients."
    diags = erreurs(controler_termes(contenu({**brut08, "episode": 1}), 1, termes))
    assert any("« non supervisé »" in d.message and "03" in d.message for d in diags)


def test_formes_derivees_et_ajoutees(brut08, termes):
    brut08["pages"][2]["texte"] = "Les jeux de données divergent et les mini-lots aussi."
    diags = erreurs(controler_termes(contenu({**brut08, "episode": 1}), 1, termes))
    trouves = " ".join(d.message for d in diags)
    assert "jeux de données" in trouves and "divergent" in trouves and "mini-lots" in trouves


def test_mot_courant_avertissement(brut08, termes):
    diags = controler_termes(contenu(brut08), 8, termes)  # « valeurs » (épisode 57) dans le canevas validé
    assert erreurs(diags) == [] and any("valeur" in d.message for d in avertissements(diags))


# --- Rappel et prérequis --------------------------------------------------------------------------------

def test_rappel_sain(brut08, fiches):
    assert controler_rappel(contenu(brut08), 8, fiches) == []


def test_rappel_cite_un_non_prerequis(brut08, fiches):
    brut08["pages"][1]["rappel"] = "On sait mesurer l'erreur (Nº 05) et la suite (Nº 09)."
    diags = controler_rappel(contenu(brut08), 8, fiches)
    assert any("Nº 09" in d.message for d in erreurs(diags))
    assert any("Nº 06" in d.message for d in avertissements(diags))


def test_rappel_fixe_de_l_episode_01(brut08, fiches):
    brut08["pages"][1]["rappel"] = "On sait tout."
    assert erreurs(controler_rappel(contenu({**brut08, "episode": 1}), 1, fiches))
    brut08["pages"][1].pop("rappel")
    assert controler_rappel(contenu({**brut08, "episode": 1}), 1, fiches) == []


# --- Typographie (C1) -------------------------------------------------------------------------------------

def test_typographie_html_saine(depot):
    htmls = pages_html(Moteur(depot), charger_episode(depot, 8, CONTENU_08))
    assert controler_typographie_html(htmls) == []


def test_titre_non_compose_detecte():
    """Cas piégé : « Qu'est-ce que le Machine Learning ? » écrit avec une espace normale."""
    html = "<html><body><h2>Qu'est-ce que le Machine Learning ?</h2><span>Nº 01</span><p>Pourquoi?</p></body></html>"
    messages = " ".join(d.message for d in controler_typographie_html([html]))
    assert "apostrophe droite" in messages
    assert "espace ordinaire avant « ? »" in messages
    assert "espace ordinaire après « Nº »" in messages
    assert "espace fine manquante avant « ? »" in messages


def test_generateur_sans_typographie_detecte(depot, monkeypatch, brut08):
    """Si le générateur oubliait la typographie, le contrôle du HTML final le verrait."""
    from serie import typographie

    monkeypatch.setattr(typographie, "texte", lambda s: s)
    monkeypatch.setattr(typographie, "math", lambda s: s)
    brut08["pages"][1]["titre"] = "Qu'est-ce que le Machine Learning ?"
    htmls = pages_html(Moteur(depot), charger_episode(depot, 8, contenu(brut08)))
    assert erreurs(controler_typographie_html(htmls))


def test_ponctuation_seule_sur_une_ligne(depot, tmp_path):
    moteur = Moteur(depot)
    def page(titre):
        return moteur.page("mecanisme", "page-mecanisme", "essai", ep={"numero_affiche": "Nº 01", "chapitre": "Les bases"},
                           page={"numero": 3, "total": 6}, visuel="",
                           p={"role": "Mécanisme", "titre": titre, "texte": "Trois lignes.", "encadres": []})
    html_brut = page("x").replace('<h2 class="titre-page">x</h2>',
                                  '<h2 class="titre-page" style="width:min-content">Qu’est-ce que le Machine Learning ?</h2>')
    html_compose = html_brut.replace("Learning ?", "Learning ?")
    brut, compose = mesurer(depot, [html_brut, html_compose], tmp_path)
    assert any(o["ligne"].strip() == "?" for o in brut.orphelines)
    assert compose.orphelines == []


# --- Débordement, tailles, glyphes, remplissage (Chromium) ---------------------------------------------------

@pytest.fixture(scope="module")
def mesures_pieges(depot, tmp_path_factory):
    """Pages pièges de 11.7 : titre long, formule longue, tableau dense, accents, petite police, glyphe absent,
    page vide ; et la page saine correspondante."""
    brut = lire_yaml(CONTENU_08)
    moteur = Moteur(depot)
    pages = pages_html(moteur, charger_episode(depot, 8, Contenu.model_validate(brut)))
    titre_long = copy.deepcopy(brut)
    titre_long["pages"][2]["titre"] = "Un titre beaucoup trop long qui occupe la page entière " * 4
    formule = copy.deepcopy(brut)
    formule["pages"][4]["panneau"]["formule"] = "θ_{t+1} = θ_t [−η]∇J(θ_t) + λ θ_t + μ θ_{t−1} + ν θ_{t−2} + ξ θ_{t−3}"
    tableau = copy.deepcopy(brut)
    tableau["pages"][5]["tableau"]["params"]["pas"] = 14  # tableau dense : 14 lignes
    accents = copy.deepcopy(brut)
    accents["pages"][2]["texte"] = "À l'École, Ève et Œdipe étudient : ça, où, très, île, cœur, Ç, É, È, Ê, Ë, Ï, Ô, Ù, Û, Ü."
    glyphe = copy.deepcopy(brut)
    glyphe["pages"][2]["texte"] = "Un pas ✓ réussi."
    grec = copy.deepcopy(brut)
    grec["pages"][2]["texte"] = "Le pas vaut η × la pente."
    def html(b, k):
        return pages_html(moteur, charger_episode(depot, 8, Contenu.model_validate(b)))[k]
    petite = pages[2].replace("</style>", ".page .texte{font-size:12px}</style>")
    vide = moteur.page("mecanisme", "page-mecanisme", "essai", ep={"numero_affiche": "Nº 08", "chapitre": "Apprendre"},
                       page={"numero": 3, "total": 8}, visuel="",
                       p={"role": "Mécanisme", "titre": "Un titre seul.", "encadres": [],
                          "texte": "Une première ligne de texte assez longue pour remplir la largeur de la page. "
                                   "Une deuxième ligne tout aussi longue que la première, pour la suite. Une troisième."})
    htmls = {"saine": pages[2], "titre long": html(titre_long, 2), "formule longue": html(formule, 4),
             "tableau dense": html(tableau, 5), "accents": html(accents, 2), "petite police": petite,
             "glyphe absent": html(glyphe, 2), "grec hors formule": html(grec, 2), "page vide": vide}
    mesures = mesurer_pages(list(htmls.values()), tmp_path_factory.mktemp("pieges"), *zone_et_minimums(depot))
    return dict(zip(htmls, mesures))


def test_page_saine(mesures_pieges):
    diags = controler_mesures([mesures_pieges["saine"]])
    assert diags == []  # « paramètre θ » : dessiné par la police de complément (A29)


@pytest.mark.parametrize("cas, attendu", [
    ("titre long", "débordement"),
    ("formule longue", "débordement"),
    ("tableau dense", "débordement"),
    ("petite police", "police de 12 px"),
    ("glyphe absent", "police du système"),
    ("page vide", "page trop vide"),
])
def test_pages_pieges(mesures_pieges, cas, attendu):
    diags = erreurs(controler_mesures([mesures_pieges[cas]]))
    assert any(attendu in d.message for d in diags), (cas, diags)


def test_accents_dessines_par_les_polices_locales(mesures_pieges):
    m = mesures_pieges["accents"]
    assert erreurs(controler_mesures([m])) == []
    assert m.glyphes == []


def test_lettre_grecque_hors_formule_dessinee_par_le_complement(mesures_pieges):
    """A29 : θ et η hors formule sont dessinés par STIX Two Text, police locale ; aucun diagnostic."""
    assert mesures_pieges["grec hors formule"].glyphes == []
    assert controler_mesures([mesures_pieges["grec hors formule"]]) == []


def test_lettre_grecque_par_une_police_du_systeme_bloque(mesures_pieges):
    m = dataclasses.replace(mesures_pieges["saine"], glyphes=[{"texte": "paramètre θ", "polices": ["Arial"]}])
    (d,) = controler_mesures([m])
    assert d in erreurs([d]) and "police du système (Arial)" in d.message


def test_seuil_de_remplissage_mesure_sur_les_references(depot):
    """C3 : seuil = plus grand vide des pages de référence + 10 % ; chiffres dans serie/verification.py.

    Les planches de la bibliothèque (serie/etalon.py, PLANCHES) ne sont pas des pages : hors de la mesure."""
    assert sorted(VIDES_REFERENCES) == sorted(set(REFERENCES) - set(PLANCHES) - {"Couverture-Classique"})
    # La couverture classique a son seuil propre (page 1, quand le contenu la retient).
    assert vides_png([(depot.references_png / "Couverture-Classique.png", 1243)]) == [VIDE_COUVERTURE_CLASSIQUE]
    assert SEUIL_COUVERTURE_CLASSIQUE == 269
    filets = {"Bib-Visuels": 1131, "Bib-Motifs": 1248}  # pages : filet du pied en 1243 (session de design n° 2)
    noms = sorted(VIDES_REFERENCES)
    mesures = vides_png([(depot.references_png / f"{nom}.png", filets.get(nom, 1243)) for nom in noms])
    assert dict(zip(noms, mesures)) == VIDES_REFERENCES
    assert max(VIDES_REFERENCES.values()) == 212 and SEUIL_REMPLISSAGE == 233


# --- Nombres --------------------------------------------------------------------------------------------

SOURCES_08 = Sources.model_validate({"episode": 8, "extraits": [
    {"id": "essai", "reference": "https://developers.google.com/machine-learning/crash-course/linear-regression/hyperparameters",
     "lu_sur": "tests", "lu_le": "2026-10-20", "extrait": "Extrait d'essai (fixture) : entre 0.001 et 0.1.",
     "appuie": "fixture de test"}]})


def test_nombres_sains(brut08, fiches, depot):
    diags = controler_nombres(contenu(brut08), fiches[8], SOURCES_08, Moteur(depot))
    assert erreurs(diags) == []


def test_nombre_sans_calcul(brut08, fiches, depot):
    """Cas piégé : un résultat écrit à la main au lieu d'être calculé."""
    brut08["pages"][5]["conclusion"] = "L'erreur passe de 9 à 2,5 en trois pas."
    diags = erreurs(controler_nombres(contenu(brut08), fiches[8], SOURCES_08, Moteur(depot)))
    assert [d.message for d in diags] == ["conclusion : le nombre « 2,5 » ne vient d'aucun calcul, paramètre ni extrait de source"]


def test_nombre_sans_source(brut08, fiches, depot):
    diags = erreurs(controler_nombres(contenu(brut08), fiches[8], None, Moteur(depot)))
    assert [d.message for d in diags] == ["encadré : le nombre « 0,001 » ne vient d'aucun calcul, paramètre ni extrait de source"]


# --- Références -------------------------------------------------------------------------------------------

def _sources_completes(fiche, ids):
    from serie.verification import urls_fiche

    extraits = [{"id": i, "reference": urls_fiche(fiche)[0], "lu_sur": "tests", "lu_le": "2026-10-20",
                 "extrait": "x", "appuie": "x"} for i in ids]
    extraits += [{"id": f"ref-{k}", "reference": u, "lu_sur": "tests", "lu_le": "2026-10-20", "extrait": "x",
                  "appuie": "x"} for k, u in enumerate(urls_fiche(fiche)[1:])]
    return Sources.model_validate({"episode": fiche.numero, "extraits": extraits})


def _avec_sources(brut, ident="a"):
    for p in brut["pages"][1:-1]:
        p["sources"] = [ident]
    return brut


def test_references_saines(brut08, fiches):
    assert controler_references(contenu(_avec_sources(brut08)), fiches[8], _sources_completes(fiches[8], ["a"])) == []


def test_references_pieges(brut08, fiches):
    _avec_sources(brut08)
    brut08["pages"][2]["sources"] = []  # page sans source
    brut08["pages"][3]["sources"] = ["inconnu"]  # extrait absent
    sources = _sources_completes(fiches[8], ["a"])
    sources = sources.model_copy(update={"extraits": sources.extraits[:-1]})  # une référence sans extrait
    messages = " ".join(d.message for d in erreurs(controler_references(contenu(brut08), fiches[8], sources)))
    assert "aucun extrait de source cité" in messages and "« inconnu » absent" in messages and "aucun extrait" in messages


def test_reference_illisible_bloque(brut08, fiches):
    from serie.verification import urls_fiche

    sources = Sources.model_validate({**_sources_completes(fiches[8], ["a"]).model_dump(),
                                      "illisibles": [{"reference": urls_fiche(fiches[8])[0], "raison": "page introuvable"}]})
    messages = [d.message for d in erreurs(controler_references(contenu(_avec_sources(brut08)), fiches[8], sources))]
    assert any("épisode bloqué" in m for m in messages)


def test_sans_dossier_de_sources(brut08, fiches):
    assert erreurs(controler_references(contenu(brut08), fiches[8], None))


# --- Images (C4) ------------------------------------------------------------------------------------------

def _contenu_01(depot, fichier, capture="essai-capture.png"):
    """Un contenu 01 minimal dont les pages 3 et 4 annoncent les images de la fiche (les autres pages viennent
    de la fixture 08)."""
    brut = lire_yaml(CONTENU_08)
    images = copy.deepcopy(lire_yaml(FIXTURES / "contenu-01-images.yaml")["pages"])
    images[0]["image"]["fichier"] = fichier
    images[1]["image"]["fichier"] = capture
    pages = [brut["pages"][0], {**brut["pages"][1], "rappel": None}, *images, brut["pages"][-1]]
    return Contenu.model_validate({"episode": 1, "pages": pages})


def test_image_retenue(depot, fiches):
    moteur = Moteur(depot, dossier_images=FIXTURES / "images")
    diags, manquantes, _ = controler_images(_contenu_01(depot, "essai-photo.png"), fiches[1], moteur)
    assert diags == [] and manquantes == []


def test_image_annoncee_sans_image_retenue(depot, fiches):
    """Cas piégé de C4 : variante sans image, et le rapport le signale."""
    moteur = Moteur(depot, dossier_images=FIXTURES / "images")
    c = _contenu_01(depot, None)
    diags, manquantes, _ = controler_images(c, fiches[1], moteur)
    assert any("variante sans image" in d.message for d in avertissements(diags))
    assert manquantes and "Salle de l'IBM 704" in manquantes[0]
    from serie.rendu import page_html

    html = page_html(moteur, charger_episode(depot, 1, c), c.pages[2], 3, len(c.pages))
    assert 'class="a-la-place"' in html and "<img" not in html


def test_image_de_la_fiche_ignoree(depot, fiches):
    """La fiche 01 demande deux images réelles ; un contenu sans page contexte ni capture est refusé."""
    brut = lire_yaml(CONTENU_08)
    brut["pages"][1]["rappel"] = None
    diags, _, _ = controler_images(Contenu.model_validate({**brut, "episode": 1}), fiches[1], Moteur(depot))
    assert len(erreurs(diags)) == 2


def test_rapport_signale_l_image_manquante(depot, tmp_path):
    brut = _contenu_01(depot, None).model_dump(exclude_none=True)
    brut["pages"][0]["visuel"] = {"famille": "nuage", "params": {"forme": "couverture"}}
    v = verifier_episode(depot, 1, Contenu.model_validate(brut), dossier_images=FIXTURES / "images", mesurer=False)
    rapport = v.rapport()
    assert "## Images manquantes (variante sans image)" in rapport and "IBM 704" in rapport


# --- Page de fin ----------------------------------------------------------------------------------------------

def test_fin_sans_mot_nouveau(brut08, fiches):
    brut08["pages"][-1]["points"][0] = "On avance dans l'autre sens."
    assert avertissements(controler_fin(contenu(brut08), fiches[8])) == []


def test_fin_avec_mot_nouveau(brut08, fiches):
    brut08["pages"][-1]["points"][0] = "Le momentum accélère la descente."
    assert any("moment" in d.message for d in avertissements(controler_fin(contenu(brut08), fiches[8])))


# --- serie verifier : de bout en bout ----------------------------------------------------------------------------

# Vide au-dessus du pied, pages 1 à 8 : couverture A et tailles de la session de design n° 2 (2026-11-01).
MESURES_08 = [59, 202, 48, 28, 152, 88, 101, 6]


def test_verifier_fixture_08(depot, tmp_path):
    """Sans extraits, seules deux erreurs restent : pas d'extraits, et « 0,001 » sans extrait. Dossier de sources vide :
    le vrai sources/08/ existe depuis la production de l'épisode 08 (2026-11-01) et ne vaut pas pour la fixture."""
    v = verifier_episode(depot, 8, CONTENU_08, sources=tmp_path)
    assert sorted(d.message for d in v.erreurs) == [
        "encadré : le nombre « 0,001 » ne vient d'aucun calcul, paramètre ni extrait de source",
        "sources/08/extraits.yaml absent : aucune affirmation n'est rattachée",
    ]
    # Page 6 : 134 px (135 avant A29, le θ du tableau est dessiné par STIX Two Text). Page 1 : 248 px avec le style
    # de couverture du 2026-10-26 (131 avant).
    assert [m.vide for m in v.mesures] == MESURES_08  # session de design n° 2 : tailles relevées


def test_date_historique_sans_extrait(brut08, fiches, depot):
    """A30 : une année ne vient que d'un extrait de source ; la fiche ne suffit pas."""
    brut = copy.deepcopy(brut08)
    brut["pages"][2]["texte"] += " L'idée date de 1847."
    c = contenu(brut)
    messages = [d.message for d in controler_nombres(c, fiches[8], None, Moteur(depot))]
    assert "texte : la date « 1847 » ne vient d'aucun extrait de source" in messages
    sources = Sources.model_validate({"episode": 8, "extraits": [
        {"id": "cauchy", "reference": fiches[8].references.cours[0].url, "lu_sur": "tests", "lu_le": "2026-10-25",
         "extrait": "Cauchy proposa la méthode en 1847.", "appuie": "date"}]})
    assert not any("1847" in d.message for d in controler_nombres(c, fiches[8], sources, Moteur(depot)))


# --- Contrôles des nouvelles formes (production des épisodes 02 à 04, 2026-10-26) --------------------------

def test_comparaison_a_formes_differentes_par_cas():
    """Épisode 04 : un cas « pivot » et un cas « decalage », chacun contrôlé avec sa propre forme."""
    from serie.verification import controler_visuels

    brut = {"episode": 4, "pages": [
        {"type": "couverture"},
        {"type": "ouverture", "titre": "T", "texte": "t", "visuel": {"famille": "flux", "params": {"forme": "page"}}},
        {"type": "comparaison", "role": "Comparaison", "titre": "T", "texte": "t",
         "visuel": {"famille": "courbe", "params": {"forme": "pivot", "origine": [40, 270], "echelle": [38, 30],
                                                    "domaine": [0, 10], "plage": [0, 8.4]}},
         "cas": [{"etiquette": "a", "titre": "t", "texte": "t", "params": {"forme": "pivot", "a": 0.2, "b": 2}},
                 {"etiquette": "b", "titre": "t", "texte": "t",
                  "params": {"forme": "decalage", "a": 0.4, "b": 1, "fleches": [2]}}]},
        {"type": "fin", "points": ["a", "b", "c"], "verification": {"question": "q ?", "page": 2}}]}
    assert controler_visuels(Contenu.model_validate(brut)) == []
    brut["pages"][2]["cas"][0]["params"]["fleches"] = [2]  # un paramètre de decalage dans un cas pivot
    assert any("forme pivot" in d.message and "fleches" in d.message for d in controler_visuels(Contenu.model_validate(brut)))


def test_textes_d_un_tableau_grille():
    from serie.verification import textes_visuel
    from serie.schemas import Visuel

    v = Visuel(famille="grille", params={"forme": "tableau", "colonnes": ["chambres", "prix"],
                                         "lignes": [[3, 345000], [2, "inconnu"]], "fenetre": {"colonne": 0, "texte": "une colonne"}})
    assert textes_visuel(v) == ["chambres", "prix", "une colonne", "inconnu"]


def test_nombre_groupe_par_milliers():
    """« 1 030 » (espace simple ou fine) se lit d'un bloc et n'est pas une date ; « 1959 » en est une."""
    from serie.verification import ANNEE, nombre_justifie, nombres
    assert nombres("J = 1 030, puis 3\u202f433 ; 99,9\u202f % en 1959") == ["1\u202f030", "3\u202f433", "99,9", "1959"]
    assert not ANNEE.fullmatch("1\u202f030") and nombre_justifie("1\u202f030", [1030.0])
