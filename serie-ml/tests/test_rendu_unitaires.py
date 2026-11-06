"""Jalon 2 : calculs, balisage, bibliothèque, contenus de référence et sorties de `serie rendre`."""

import re

import pytest
from pypdf import PdfReader

import bibliotheque
from calculs import calculer
from calculs.descente_gradient import iterations, iterations_2d, tableau
from serie import balisage
from serie.cli import main
from serie.charte import Charte
from serie.depot import lire_yaml
from serie.rendu import (
    ErreurRendu, Moteur, charger_episode, couvertures_html, episode_suivant, pages_html, rendre_episode, theme,
)
from serie.schemas import Contenu
from rendus import CONTENU_08, FIXTURES, pages_images_html


# --- Calculs ------------------------------------------------------------------------------

def test_iterations_de_la_page_exemple():
    # Fiche 08 : « J(θ) = θ², θ = 3, η = 0,1 : 3 → 2,4 → 1,92 → 1,536. L'erreur passe de 9 à 2,36. »
    thetas = iterations(3, 0.1, 3)
    assert [round(t, 3) for t in thetas] == [3, 2.4, 1.92, 1.536]
    lignes = tableau(3, 0.1, 3)
    assert round(lignes[0]["erreur"], 2) == 9 and round(lignes[-1]["erreur_apres"], 2) == 2.36


def test_chemin_de_couverture_converge():
    pts = iterations_2d([-504, -154], 0.1, [1.3, 7.79], 3)
    assert [round(540 + x) for x, _ in pts] == [36, 167, 264, 336]
    assert [round(300 + y) for _, y in pts] == [146, 386, 252, 327]


def test_calcul_inconnu_refuse():
    with pytest.raises(KeyError):
        calculer("invente")


# --- Balisage -----------------------------------------------------------------------------

def test_formule_du_panneau():
    html = str(balisage.formule("θ_{t+1} = θ_t [−η]∇J(θ_t)"))
    assert html == (
        "<i>θ</i><sub><i>t</i>+1</sub><span class=\"op\">=</span><i>θ</i><sub><i>t</i></sub>"
        "<span class=\"op accent\">−</span><i class=\"accent\">η</i><span class=\"nabla\">∇</span>"
        "<i>J</i>(<i>θ</i><sub><i>t</i></sub>)"
    )



def test_fraction():
    """`{1}/{n}` : numérateur au-dessus, dénominateur dessous ; Σ droit ; des accolades seules restent du texte."""
    assert str(balisage.formule("J = {1}/{n} Σ")) == (
        '<i>J</i><span class="op">=</span><span class="frac"><span class="num">1</span>'
        '<span class="den"><i>n</i></span></span><span class="grand">Σ</span>')
    assert '<span class="den">1+<i>e</i>' in str(balisage.formule("σ(z) = {1}/{1 + e⁻ᶻ}"))
    assert "frac" not in str(balisage.formule("x = {a}"))

def test_symboles():
    assert balisage.symbole("[η]").italique and balisage.symbole("[η]").accent
    moins = balisage.symbole("[−]")
    assert not moins.italique and moins.accent
    assert str(balisage.symbole("θ_t").html) == "<i>θ</i><sub><i>t</i></sub>"


def test_texte_sans_html_du_contenu():
    html = str(balisage.texte("<b>$!η$ et **gras**\nfin"))
    assert html == '&lt;b&gt;<span class="m it accent">η</span> et <strong>gras</strong><br>fin'
    assert str(balisage.texte("$η$ = 0,05", dans_stix=True)) == "<i>η</i> = 0,05"
    assert str(balisage.titre_point("Descente\nde gradient.")) == 'Descente<br>de gradient<span class="accent">.</span>'


# --- Bibliothèque ---------------------------------------------------------------------------

@pytest.mark.parametrize("famille", bibliotheque.FAMILLES)
@pytest.mark.parametrize("nom_theme", ["claire", "couverture"])
def test_chaque_famille_rend_un_svg(depot, famille, nom_theme):
    if famille == "flux" and nom_theme == "couverture":
        pytest.skip("flux : pages intérieures seulement")
    svg = bibliotheque.rendre(famille, {}, theme(Charte.charger(depot), nom_theme))
    assert svg.startswith("<svg ") and svg.endswith("</svg>")


def test_famille_ou_forme_inconnue(depot):
    th = theme(Charte.charger(depot), "claire")
    with pytest.raises(ValueError):
        bibliotheque.rendre("spirale", {}, th)
    with pytest.raises(ValueError):
        bibliotheque.rendre("courbe", {"forme": "libre"}, th)


def test_robots_aux_couleurs_de_la_charte(depot):
    charte = Charte.charger(depot)
    couverture = (depot.racine / "bibliotheque" / "robot-couverture.svg").read_text(encoding="utf-8")
    baguette = (depot.racine / "bibliotheque" / "robot-baguette.svg").read_text(encoding="utf-8")
    assert charte.couverture["accent"] in couverture
    assert charte.fin["accent"] in baguette and charte.fin["baguette"] in baguette
    for svg in (couverture, baguette):
        assert "{{" not in svg and svg.startswith('<svg xmlns="http://www.w3.org/2000/svg"')


def test_polices_locales_seulement(depot):
    css = Charte.charger(depot).polices_css
    assert "fonts.googleapis" not in css and "http" not in css.replace("file:///", "")
    assert {"Geist", "Geist Mono", "STIX Two Text"} <= set(re.findall(r"font-family:'([^']+)'", css))


# --- Contenus de test et page de fin ------------------------------------------------------------

def test_contenus_de_test_hors_de_contenu(depot):
    """B2 : les contenus de test sont dans tests/fixtures/, jamais dans contenu/ (contenu/08.yaml, produit le
    2026-11-01, n'est pas la fixture)."""
    assert Contenu.model_validate(lire_yaml(CONTENU_08)).episode == 8
    reel = depot.racine / "contenu" / "08.yaml"
    assert not reel.exists() or reel.read_text(encoding="utf-8") != CONTENU_08.read_text(encoding="utf-8")


def test_episode_suivant(depot):
    ep = charger_episode(depot, 8, CONTENU_08)
    assert episode_suivant(ep)["etiquette"] == "Épisode suivant · Nº 09"
    assert episode_suivant(ep)["titre"] == "Descente stochastique et mini-lots"
    fin_saison = charger_episode(depot, 19, Contenu.model_validate({**lire_yaml(CONTENU_08), "episode": 19}))
    assert episode_suivant(ep)["transition"] == "Calculer la pente sur toutes les données à chaque pas, ça coûte cher."
    # A22 : le dernier épisode d'une saison annonce le bilan, puis la saison suivante.
    assert episode_suivant(fin_saison)["etiquette"] == "Bilan, puis saison 2 · Nº 20"
    assert episode_suivant(fin_saison)["titre"] == "Entraînement, validation, test"
    assert episode_suivant(fin_saison)["transition"] == "Notre modèle prédit. Mais est-il bon ?"
    assert episode_suivant(ep)["saisons"] == []


def test_cloture_de_la_serie(depot):
    """A22 : le dernier épisode remplace « épisode suivant » par la clôture, avec les saisons de calendrier.yaml."""
    from rendus import page_fin_62_html

    fin = page_fin_62_html(Moteur(depot))
    assert "Fin de la série" in fin and "Merci de l’avoir suivie" in fin
    assert "Retrouvez le sommaire de chaque saison dans son post bilan." in fin
    assert "Épisode suivant" not in fin and "Suivez la série" not in fin
    assert fin.count('class="saison"') == 4 and "Nº 52 à 62" in fin


def test_fin_du_bilan(depot):
    """A35 : la fin du bilan reprend le gabarit de fin, sans points ni « Vérifiez-vous »."""
    import datetime as dt

    from rendus import pages_bilan_essai
    from serie.rendu import charger_fiches, fin_du_bilan
    from serie.schemas import Calendrier

    fiches = charger_fiches(depot)
    from rendus import CALENDRIER_ESSAI

    sans_date = Calendrier.model_validate(lire_yaml(CALENDRIER_ESSAI))
    avec_date = sans_date.model_copy(update={"date_lancement": dt.date(2026, 11, 3)})
    reprise, suivant = fin_du_bilan(1, fiches, avec_date)
    assert reprise["titre"] == "Saison 2 : reprise le mardi 12 janvier."
    assert [l["numero"] for l in reprise["lignes"]] == ["05", "06", "07"]
    assert suivant["etiquette"] == "Saison 2 · Nº 20" and suivant["titre"] == "Entraînement, validation, test"
    assert fin_du_bilan(1, fiches, sans_date)[0]["titre"] == "Saison 2 : reprise prochainement."
    reprise, suivant = fin_du_bilan(4, fiches, avec_date)
    assert reprise["titre"] == "62 épisodes en 4 saisons." and len(reprise["lignes"]) == 4
    assert suivant["etiquette"] == "Fin de la série"
    fin = pages_bilan_essai(Moteur(depot))[2]
    assert "Vérifiez-vous" not in fin and "À retenir" not in fin and "3 / 3" in fin


def test_couverture_d_une_autre_famille_refusee(depot):
    brut = lire_yaml(CONTENU_08)
    brut["pages"][0]["visuel"]["famille"] = "nuage"
    with pytest.raises(ErreurRendu):
        pages_html(Moteur(depot), charger_episode(depot, 8, Contenu.model_validate(brut)))


def test_verifiez_vous_entre_retenir_et_suivant(depot):
    """B5 : l'encadré « Vérifiez-vous » suit les points à retenir et précède l'épisode suivant."""
    fin = pages_html(Moteur(depot), charger_episode(depot, 8, CONTENU_08))[-1]
    i_retenir, i_verif, i_suivant = (fin.index(t) for t in ("À retenir", "Vérifiez-vous", "Épisode suivant"))
    assert i_retenir < i_verif < i_suivant
    assert "Pourquoi les pas raccourcissent-ils près du minimum ?" in fin
    assert "Réponse : page 3" in fin


def test_verifiez_vous_renvoie_a_une_page_de_l_episode():
    brut = lire_yaml(CONTENU_08)
    brut["pages"][-1]["verification"]["page"] = 8  # la page de fin elle-même
    with pytest.raises(ValueError):
        Contenu.model_validate(brut)
    del brut["pages"][-1]["verification"]
    with pytest.raises(ValueError):
        Contenu.model_validate(brut)


# --- Images réelles : variantes sans image (B6) ------------------------------------------------

def _sans_image(depot):
    from pydantic import TypeAdapter
    from serie.rendu import Episode, charger_fiches, page_html
    from serie.schemas import Calendrier, PageContenu

    brut = lire_yaml(FIXTURES / "contenu-01-images.yaml")
    moteur = Moteur(depot, dossier_images=FIXTURES / "images")
    fiches = charger_fiches(depot)
    ep = Episode(fiches[1], None, fiches, Calendrier.model_validate(lire_yaml(depot.calendrier)))
    pages = []
    for k, p in enumerate(brut["pages"]):
        p = {**p, "image": {**p["image"], "fichier": None}}
        pages.append(page_html(moteur, ep, TypeAdapter(PageContenu).validate_python(p), 3 + k, 6))
    return pages


def test_jamais_de_cadre_a_deposer(depot):
    for html in pages_images_html(depot) + _sans_image(depot):
        assert "déposer" not in html.lower() and "attente" not in html


def test_contexte_sans_image_frise_agrandie(depot):
    contexte = _sans_image(depot)[0]
    assert "<img" not in contexte and 'class="frise"' in contexte and 'class="a-la-place"' in contexte
    assert "Publication de l’étude dans l’IBM Journal" in contexte


def test_capture_sans_image_schema_flux(depot):
    capture = _sans_image(depot)[1]
    assert '<img' not in capture and 'class="schema"' in capture and "<svg" in capture
    assert '<span class="credit">Schéma</span>' in capture
    assert "Mails déjà" in capture and "Non-spam" in capture


def test_image_retenue_et_credit_ecrit_par_le_code(depot):
    contexte, capture = pages_images_html(depot)
    assert 'src="file:///' in contexte and "essai-photo.png" in contexte
    assert "Photo : Image d’essai · Domaine public · tests" in contexte
    assert "Capture : Ladji Lama Kamagate" in capture


# --- serie rendre ----------------------------------------------------------------------------

def test_rendre_produit_png_et_pdf(depot, tmp_path):
    r = rendre_episode(depot, 8, tmp_path, CONTENU_08)
    assert [p.name for p in r.pngs] == [f"page-{k:02d}.png" for k in range(1, 9)]
    assert r.pdf.name == "08-la-descente-de-gradient.pdf"
    pdf = PdfReader(r.pdf)
    assert len(pdf.pages) == 8
    largeur, hauteur = float(pdf.pages[0].mediabox.width), float(pdf.pages[0].mediabox.height)
    assert largeur == pytest.approx(810, abs=1) and hauteur == pytest.approx(1012.5, abs=1)  # 1080 × 1350 px à 96 ppp


def test_rendre_sans_contenu(depot, capsys):
    assert main(["--racine", str(depot.racine), "rendre", "62"]) == 1  # 09 et suivants : produits depuis le 2026-11-01
    assert "contenu/62.yaml" in capsys.readouterr().err


def test_signe_final_du_grand_titre_en_accent():
    assert str(balisage.titre_point("Descente\nde gradient.")).endswith('<span class="accent">.</span>')
    assert str(balisage.titre_point("Qu'est-ce que le\nMachine Learning ?")).endswith(
        '<span class="accent"> ?</span>')


def test_titre_propre_a_la_couverture(depot):
    """2026-10-26 : la couverture peut couper son titre autrement que l'ouverture (épisode 01)."""
    brut = lire_yaml(CONTENU_08)
    brut["pages"][0]["titre"] = "La descente\nde gradient."
    couverture = pages_html(Moteur(depot), charger_episode(depot, 8, Contenu.model_validate(brut)))[0]
    assert "La descente" in couverture and 'class="titre-couverture-a' in couverture


def test_deux_couvertures_au_choix(depot):
    """2026-11-02 : couverture A et couverture classique rendues pour chaque épisode ; `couverture: classique` dans le
    contenu la met en page 1 ; la classique prend `visuel_classique` (motif pleine largeur) s'il est donné."""
    moteur = Moteur(depot)
    brut = lire_yaml(CONTENU_08)
    variantes = couvertures_html(moteur, charger_episode(depot, 8, Contenu.model_validate(brut)))
    assert list(variantes) == ["a", "classique"]
    assert 'class="titre-couverture-a' in variantes["a"] and "titre-couverture-ep" in variantes["classique"]
    assert 'cx="540" cy="300" rx="660"' in variantes["classique"].replace(".0", "")
    assert pages_html(moteur, charger_episode(depot, 8, Contenu.model_validate(brut)))[0] == variantes["a"]
    brut["couverture"] = "classique"
    assert pages_html(moteur, charger_episode(depot, 8, Contenu.model_validate(brut)))[0] == variantes["classique"]
    del brut["pages"][0]["visuel_classique"]
    sans = couvertures_html(moteur, charger_episode(depot, 8, Contenu.model_validate(brut)))["classique"]
    assert 'cx="540" cy="400" rx="280"' in sans.replace(".0", "")
