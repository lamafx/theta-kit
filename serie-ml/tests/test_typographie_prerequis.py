"""Typographie 9.4 appliquée par le générateur, police de complément (B1), prérequis (B3), rôle Problème (B4)."""

import pytest

from serie import typographie
from serie.balisage import composer, texte
from serie.charte import Charte
from serie.prerequis import numeros_cites, prerequis, rappel_fixe
from serie.rendu import charger_fiches
from serie.schemas import PageFiche, ROLES_VERS_GABARITS, gabarit_page_fiche

FINE, INSECABLE = " ", " "


# --- Typographie 9.4 ------------------------------------------------------------------------

@pytest.mark.parametrize(
    "brut, attendu",
    [
        ("Pourquoi ?", f"Pourquoi{FINE}?"),
        ("Attention!", f"Attention{FINE}!"),
        ("a ; b", f"a{FINE}; b"),
        ("« exemple » :", f"«{INSECABLE}exemple{INSECABLE}»{INSECABLE}:"),
        ("η = 0.1", "η = 0,1"),
        ("10000 et 10 000", f"10{FINE}000 et 10{FINE}000"),
        ("en 1959", "en 1959"),  # une année n'est pas groupée
        ("-6", "−6"),
        ("mini-lots", "mini-lots"),
        ("η * la pente", "η × la pente"),
        ("l'erreur", "l’erreur"),
        ("A retenir", "À retenir"),
        ("Nº 08", f"Nº{INSECABLE}08"),
        ("8 à 10 heures, 9 %", f"8 à 10{INSECABLE}heures, 9{FINE}%"),
        ("https://exemple.org à 08:30", "https://exemple.org à 08:30"),
    ],
)
def test_regles_9_4(brut, attendu):
    assert typographie.texte(brut) == attendu
    assert typographie.texte(attendu) == attendu  # idempotente


def test_formules_et_symboles():
    assert typographie.math("J'(θ) = -2.5*θ") == "J′(θ) = −2,5×θ"
    assert composer("le pas vaut $η$ * la pente : $θ - 0.5$ ?") == f"le pas vaut $η$ × la pente{INSECABLE}: $θ − 0,5${FINE}?"
    assert str(texte("Qu'est-ce que le Machine Learning ?")) == f"Qu’est-ce que le Machine Learning{FINE}?"


# --- B1 : police de complément -----------------------------------------------------------------

def test_complement_declare_pour_chaque_famille_poids_style(depot):
    css = Charte.charger(depot).polices_css
    regles = [r for r in css.splitlines() if "stix-two-math" in r]
    attendues = {("Geist", p, "normal") for p in ("400", "500", "600", "700")} | {
        ("Geist Mono", p, "normal") for p in ("400", "500")} | {
        ("STIX Two Text", p, s) for p in ("400", "500") for s in ("normal", "italic")}
    trouvees = set()
    for r in regles:
        assert "unicode-range:U+2207, U+202F" in r
        famille = r.split("font-family:'")[1].split("'")[0]
        poids = r.split("font-weight:")[1].split(";")[0]
        style = r.split("font-style:")[1].split(";")[0]
        assert " " not in poids  # pas de plage de poids
        trouvees.add((famille, poids, style))
    assert trouvees == attendues
    assert css.rindex("stix-two-math") > css.rindex("geist-sans")  # déclarées après les autres


def test_nabla_et_espace_fine_dessines_par_le_complement(depot, tmp_path):
    """∇ et U+202F : toujours STIX Two Math (police chargée), jamais une police du système."""
    from playwright.sync_api import sync_playwright

    css = Charte.charger(depot).polices_css
    cas, corps = [], ""
    for famille in ("Geist", "Geist Mono", "STIX Two Text"):
        for poids in (400, 500, 600):
            for style in ("normal", "italic"):
                for car in ("∇", " "):
                    corps += (f"<span id='c{len(cas)}' style=\"font-family:'{famille}';font-weight:{poids};"
                              f"font-style:{style}\">{car}</span>")
                    cas.append((famille, poids, style, f"U+{ord(car):04X}"))
    page = tmp_path / "polices.html"
    page.write_text(f"<!doctype html><meta charset=utf-8><style>{css}</style><body>{corps}", encoding="utf-8")
    with sync_playwright() as pw:
        navigateur = pw.chromium.launch()
        onglet = navigateur.new_page()
        onglet.goto(page.as_uri())
        onglet.evaluate("document.fonts.ready.then(() => true)")
        cdp = onglet.context.new_cdp_session(onglet)
        cdp.send("DOM.enable")
        cdp.send("CSS.enable")
        racine = cdp.send("DOM.getDocument")["root"]["nodeId"]
        for k, c in enumerate(cas):
            noeud = cdp.send("DOM.querySelector", {"nodeId": racine, "selector": f"#c{k}"})["nodeId"]
            polices = cdp.send("CSS.getPlatformFontsForNode", {"nodeId": noeud})["fonts"]
            assert [(f["familyName"], f["isCustomFont"]) for f in polices] == [("STIX Two Math", True)], c
        navigateur.close()


def test_lettres_grecques_dessinees_par_le_complement(depot, tmp_path):
    """A29 : θ, η, Σ en Geist et Geist Mono sont dessinés par STIX Two Text (chargée), jamais par le système."""
    from playwright.sync_api import sync_playwright

    css = Charte.charger(depot).polices_css
    assert css.count("stix-two-text-greek-400-normal") == 1 + 6  # règle d’origine + Geist (4 poids) et Geist Mono (2)
    cas, corps = [], ""
    for famille in ("Geist", "Geist Mono"):
        for poids in (400, 500, 600):
            for car in "θηΣ":
                corps += f"<span id='g{len(cas)}' style=\"font-family:'{famille}';font-weight:{poids}\">{car}</span>"
                cas.append((famille, poids, car))
    page = tmp_path / "grecques.html"
    page.write_text(f"<!doctype html><meta charset=utf-8><style>{css}</style><body>{corps}", encoding="utf-8")
    with sync_playwright() as pw:
        navigateur = pw.chromium.launch()
        onglet = navigateur.new_page()
        onglet.goto(page.as_uri())
        onglet.evaluate("document.fonts.ready.then(() => true)")
        cdp = onglet.context.new_cdp_session(onglet)
        cdp.send("DOM.enable")
        cdp.send("CSS.enable")
        racine = cdp.send("DOM.getDocument")["root"]["nodeId"]
        for k, c in enumerate(cas):
            noeud = cdp.send("DOM.querySelector", {"nodeId": racine, "selector": f"#g{k}"})["nodeId"]
            polices = cdp.send("CSS.getPlatformFontsForNode", {"nodeId": noeud})["fonts"]
            assert [(f["familyName"], f["isCustomFont"]) for f in polices] == [("STIX Two Text", True)], c
        navigateur.close()


# --- B3 : prérequis et ligne de rappel ------------------------------------------------------------

@pytest.fixture(scope="module")
def fiches(depot):
    return charger_fiches(depot)


def test_prerequis_de_l_episode_08(fiches):
    assert prerequis(8, fiches) == [5, 6, 7]


def test_prerequis_explicites_ajoutes(fiches):
    fiche = next(f for f in fiches.values() if f.prerequis_explicites)
    assert set(fiche.prerequis_explicites) <= set(prerequis(fiche.numero, fiches))


def test_rappels_fixes(fiches):
    assert rappel_fixe(1, fiches) == "Épisode 1 · Saison 1"
    assert rappel_fixe(5, fiches) == "Nouveau chapitre · Apprendre de ses erreurs"  # 05 ouvre le chapitre 2
    assert rappel_fixe(8, fiches) is None  # l'agent cite 05, 06 et 07
    assert numeros_cites("On sait mesurer l'erreur (Nº 05) et lire une pente (Nº 06 et 07).") == [5, 6, 7]


# --- B4 : rôle Problème -------------------------------------------------------------------------

def test_role_probleme_rendu_par_mecanisme():
    assert ROLES_VERS_GABARITS["Problème"] == ("mecanisme",)
    assert gabarit_page_fiche(PageFiche(page=3, type="Problème", message="m")) == "mecanisme"
