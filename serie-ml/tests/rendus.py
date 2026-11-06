"""Produit les 14 pages comparables aux images de tests/reference/.

- Main, 02 à 08 : `serie rendre 08` avec tests/fixtures/contenu-08.yaml (pages 1 à 8) ;
- Image-Contexte, Image-Capture : tests/fixtures/contenu-01-images.yaml (épisode 01, pages 3 et 4),
  avec les images d'essai de tests/fixtures/images/ ;
- Bilan-Couverture, Bilan-Sommaire : bilan de la saison 1 (tests/fixtures/bilan-1.yaml) ;
- Bib-Motifs, Bib-Visuels : planches de contrôle (tests/planches/) avec les vignettes de bibliotheque/ ;
- Formes-* : une planche par famille (tests/fixtures/formes.yaml), chaque forme de page à sa taille réelle.
"""

from __future__ import annotations

from collections import Counter
from pathlib import Path

from jinja2 import Environment, FileSystemLoader
from markupsafe import Markup
from pydantic import TypeAdapter

import bibliotheque
from serie.depot import Depot, lire_yaml
from serie.etalon import PLANCHES
from serie.rendu import (
    Episode, Moteur, charger_episode, charger_fiches, contexte_couverture, couvertures_html, page_html, pages_bilan_html,
    photographier, rendre_episode, theme,
)
from serie.schemas import Calendrier, ContenuBilan, PageContenu, Visuel

ICI = Path(__file__).resolve().parent
FIXTURES = ICI / "fixtures"
CONTENU_08 = FIXTURES / "contenu-08.yaml"

PAGES_08 = ["Main", "02-Ouverture", "03-Mecanisme", "04-Comparaison", "05-Formule", "06-Exemple", "07-Piege", "08-Fin"]
# Rendues ensemble, dans cet ordre (`rendre_references`).
AUTRES = ["Image-Contexte", "Image-Capture", "Bilan-Couverture", "Bilan-Sommaire", "Bilan-Fin", "Bib-Motifs",
          "Bib-Visuels", "Fin-Serie", "Couverture-Classique"]
REFERENCES = PAGES_08 + AUTRES
# Planches des formes de page (tests/fixtures/formes.yaml), une par famille.
FORMES = ["Formes-Grille", "Formes-Courbe", "Formes-Nuage", "Formes-Flux", "Formes-Niveaux"]
REFERENCES += FORMES + ["Couvertures"]
assert sorted(FORMES + ["Couvertures"]) == sorted(PLANCHES)
HAUTEUR_COUVERTURES = 4910  # 13 couvertures sur 7 rangées (A62)
CALENDRIER_ESSAI = FIXTURES / "calendrier-essai.yaml"  # figé : les références ne suivent pas le calendrier réel
# Date de lancement d'essai : la fin du bilan affiche la date de reprise (A35) ; calendrier.yaml n'en a pas.
LANCEMENT_ESSAI = "2026-11-03"

MOTIFS = [
    ("nuage", "Nuage de points", "points · droite ou frontière · écarts · groupes"),
    ("courbe", "Courbe", "fonction tracée · points sur la courbe · courbe fantôme"),
    ("reseau", "Réseau", "nœuds · liens · sens du flux · nœuds éteints"),
    ("barres", "Barres", "valeurs · une barre dominante · étiquette"),
    ("niveaux", "Lignes de niveau", "ellipses · forme de la vallée · chemin · bruit"),
    ("blocs", "Blocs", "découpage · proportions · empilement"),
    ("grille", "Grille", "cases · intensités · fenêtre mise en évidence"),
    ("arbre", "Arbre", "questions · branches · feuilles par classe"),
]
VISUELS = [
    ("courbe", "Courbe", "fonctions, coûts, tangentes, ROC"),
    ("nuage", "Nuage de points", "régression, frontières, groupes, embeddings"),
    ("niveaux", "Lignes de niveau", "gradient, optimiseurs, normalisation"),
    ("barres", "Barres", "probabilités, fréquences, distributions"),
    ("grille", "Grille", "matrices, confusion, attention, pixels"),
    ("reseau", "Réseau", "neurones, couches, attention entre mots"),
    ("arbre", "Arbre", "arbres, forêts, boosting"),
    ("blocs", "Blocs", "découpages, tokens, couches empilées"),
    ("flux", "Flux", "principes, étapes, boucles d’apprentissage"),
]


def planches_html(moteur: Moteur) -> list[str]:
    env = Environment(loader=FileSystemLoader(ICI / "planches"), autoescape=True)
    polices = Markup(moteur.charte.polices_css)
    sombre, clair = theme(moteur.charte, "couverture"), theme(moteur.charte, "claire")
    comptes = Counter(f.couverture.famille for f in charger_fiches(moteur.depot).values())
    motifs = [{"svg": Markup(bibliotheque.rendre(f, {}, sombre)), "nom": nom, "parametres": params,
               "compte": f"{comptes[f]} épisodes"} for f, nom, params in MOTIFS]
    visuels = [{"svg": Markup(bibliotheque.rendre(f, {}, clair)), "nom": nom, "usages": usages}
               for f, nom, usages in VISUELS]
    return [
        env.get_template("bib-motifs.html.j2").render(polices=polices, co=moteur.charte.couverture,
                                                     bord_carte=moteur.charte.complements["bord_carte"], familles=motifs),
        env.get_template("bib-visuels.html.j2").render(polices=polices, cl=moteur.charte.claire, familles=visuels),
    ]


def planches_formes() -> list[dict]:
    """Les planches de tests/fixtures/formes.yaml : nom de la référence, hauteur, famille et formes."""
    return lire_yaml(FIXTURES / "formes.yaml")


def planche_formes_html(moteur: Moteur, planche: dict) -> str:
    env = Environment(loader=FileSystemLoader(ICI / "planches"), autoescape=True)
    clair = theme(moteur.charte, "claire")
    formes = []
    for f in planche["formes"]:
        if "cas" in f:
            formes.append({"legende": f["legende"], "cas": [
                Markup(bibliotheque.rendre(planche["famille"], {**f["params"], **cas}, clair)) for cas in f["cas"]]})
        else:
            formes.append({"legende": f["legende"], "svg": Markup(bibliotheque.rendre(planche["famille"], f["params"], clair))})
    return env.get_template("formes.html.j2").render(
        polices=Markup(moteur.charte.polices_css), cl=moteur.charte.claire, titre=planche["titre"],
        hauteur=planche["hauteur"], formes=formes)


def planche_couvertures_html(moteur: Moteur) -> str:
    """Les couvertures de tests/fixtures/couvertures.yaml, avec le gabarit de couverture, réduites côte à côte."""
    from types import SimpleNamespace

    fiches = charger_fiches(moteur.depot)
    couvertures = []
    for entree in lire_yaml(FIXTURES / "couvertures.yaml"):
        fiche = fiches[entree["episode"]]
        famille = fiche.couverture.famille
        contexte = contexte_couverture(moteur, fiche, Visuel(famille=famille, params=entree["params"]),
                                       fiche.titre.rstrip(" ?") + ".", entree.get("accroche", fiche.accroche))
        ep = SimpleNamespace(numero_affiche=f"Nº {fiche.numero:02d}", chapitre=fiche.chapitre.titre)
        page = moteur.page("couverture", "sombre page-couverture page-couverture-a", fiche.titre, ep=ep, p=None,
                           page={"numero": 1, "total": 1}, **contexte)
        corps = page.split("<body>", 1)[1].rsplit("</body>", 1)[0]
        couvertures.append({"page": Markup(corps), "legende": f"Nº {fiche.numero:02d} · {famille}"})
    env = Environment(loader=FileSystemLoader(ICI / "planches"), autoescape=True)
    return env.get_template("couvertures.html.j2").render(
        polices=Markup(moteur.charte.polices_css), style=Markup(moteur.style), co=moteur.charte.couverture,
        couvertures=couvertures, hauteur=HAUTEUR_COUVERTURES)


def calendrier_essai(depot: Depot) -> Calendrier:
    return Calendrier.model_validate({**lire_yaml(CALENDRIER_ESSAI), "date_lancement": LANCEMENT_ESSAI})


def pages_bilan_essai(moteur: Moteur) -> list[str]:
    """Les 3 pages du bilan de la saison 1 (tests/fixtures/bilan-1.yaml), avec la date de lancement d'essai."""
    bilan = ContenuBilan.model_validate(lire_yaml(FIXTURES / "bilan-1.yaml"))
    return pages_bilan_html(moteur, bilan, calendrier_essai(moteur.depot))


def page_fin_62_html(moteur: Moteur) -> str:
    """La page de fin de l'épisode 62 (tests/fixtures/fin-62.yaml) : le bloc de clôture de la série (A22)."""
    brut = lire_yaml(FIXTURES / "fin-62.yaml")
    fiches = charger_fiches(moteur.depot)
    ep = Episode(fiches[brut["episode"]], None, fiches, Calendrier.model_validate(lire_yaml(CALENDRIER_ESSAI)))
    return page_html(moteur, ep, TypeAdapter(PageContenu).validate_python(brut["pages"][0]), brut["premiere_page"],
                     brut["total"])


def couverture_classique_html(moteur: Moteur) -> str:
    """La couverture classique (d'avant la couverture A) de la fixture 08 : la variante gardée au choix (2026-11-02)."""
    return couvertures_html(moteur, charger_episode(moteur.depot, 8, CONTENU_08))["classique"]


def pages_images_html(depot: Depot) -> list[str]:
    """Les pages Image-Contexte et Image-Capture de la fixture, avec les images d'essai."""
    brut = lire_yaml(FIXTURES / "contenu-01-images.yaml")
    moteur = Moteur(depot, dossier_images=FIXTURES / "images")
    fiches = charger_fiches(depot)
    ep = Episode(fiches[brut["episode"]], None, fiches, Calendrier.model_validate(lire_yaml(CALENDRIER_ESSAI)))
    adaptateur = TypeAdapter(PageContenu)
    return [page_html(moteur, ep, adaptateur.validate_python(p), brut["premiere_page"] + k, brut["total"])
            for k, p in enumerate(brut["pages"])]


def rendre_references(depot: Depot, dossier: Path) -> dict[str, Path]:
    """Rend les pages et planches et renvoie, pour chaque image de référence, le PNG correspondant."""
    pngs: dict[str, Path] = {}
    episode_08 = rendre_episode(depot, 8, dossier / "08", CONTENU_08)
    pngs.update(zip(PAGES_08, episode_08.pngs))

    moteur = Moteur(depot)
    autres = (pages_images_html(depot) + pages_bilan_essai(moteur) + planches_html(moteur) + [page_fin_62_html(moteur)]
              + [couverture_classique_html(moteur)])
    resultat = photographier(autres, dossier / "autres", "page")
    pngs.update(zip(AUTRES, resultat.pngs, strict=True))
    for planche in planches_formes():
        resultat = photographier([planche_formes_html(moteur, planche)], dossier / "formes", planche["nom"],
                                 hauteur=planche["hauteur"])
        pngs[planche["nom"]] = resultat.pngs[0]
    assert sorted(p["nom"] for p in planches_formes()) == sorted(FORMES)
    resultat = photographier([planche_couvertures_html(moteur)], dossier / "couvertures", "couvertures",
                             hauteur=HAUTEUR_COUVERTURES)
    pngs["Couvertures"] = resultat.pngs[0]
    return pngs
