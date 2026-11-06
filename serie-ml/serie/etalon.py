"""Étalonnage : les canevas d'origine rendus sur cette machine, avec les polices locales.

Comparer un rendu au canevas rendu ici mesure la fidélité de la conversion, sans le bruit propre
à l'ordinateur qui a produit tests/reference/ (lissage des polices, police de secours du ∇).
Comparer le canevas rendu ici à tests/reference/ mesure ce bruit : c'est le plancher du seuil.
"""

from __future__ import annotations

import json
import re
from pathlib import Path

from serie.charte import Charte
from serie.depot import Depot

# Page de référence → canevas
CANEVAS = {
    "Main": "Main.dc.html",
    "02-Ouverture": "02-Ouverture.dc.html",
    "03-Mecanisme": "03-Mecanisme.dc.html",
    "04-Comparaison": "04-Comparaison.dc.html",
    "05-Formule": "05-Formule.dc.html",
    "06-Exemple": "06-Exemple.dc.html",
    "07-Piege": "07-Piege.dc.html",
    "08-Fin": "08-Fin.dc.html",
    "Image-Contexte": "Image-Contexte.dc.html",
    "Image-Capture": "Image-Capture.dc.html",
    "Bib-Motifs": "Bib-Motifs.dc.html",
    "Bib-Visuels": "Bib-Visuels.dc.html",
    "Bilan-Couverture": "Bilan-Couverture.dc.html",
    "Bilan-Sommaire": "Bilan-Sommaire.dc.html",
    "Bilan-Fin": "Bilan-Fin.dc.html",
    "Fin-Serie": "Fin-Serie.dc.html",
    "Formes-Grille": "Formes-Grille.dc.html",
    "Formes-Courbe": "Formes-Courbe.dc.html",
    "Formes-Nuage": "Formes-Nuage.dc.html",
    "Formes-Flux": "Formes-Flux.dc.html",
    "Formes-Niveaux": "Formes-Niveaux.dc.html",
    "Couvertures": "Couvertures.dc.html",
    "Couverture-Classique": "Couverture-Classique.dc.html",
}

# Planches de la bibliothèque faites en session de design : ce ne sont pas des pages ni des gabarits.
PLANCHES = ("Formes-Grille", "Formes-Courbe", "Formes-Nuage", "Formes-Flux", "Formes-Niveaux", "Couvertures")
# Références ajoutées en session de design : absentes du document de conception (provenance.yaml, 14 gabarits).
AJOUTEES = PLANCHES + ("Bilan-Fin", "Fin-Serie", "Couverture-Classique")
HAUTEUR = 1350


def hauteur_page(html: str) -> int:
    """Hauteur de la page : celle du premier bloc de 1080 px de large (les planches de formes sont plus hautes)."""
    m = re.search(r"width: 1080px; height: (\d+)px", html)
    return int(m.group(1)) if m else HAUTEUR


def _reglages(source: str) -> dict[str, str]:
    """Valeurs par défaut des réglages du canevas ({{accent}}, {{alert}}, {{c.*}})."""
    valeurs: dict[str, str] = {}
    m = re.search(r"data-props='([^']*)'", source)
    if m:
        for cle, prop in json.loads(m.group(1)).items():
            if not cle.startswith("$") and isinstance(prop, dict) and "default" in prop:
                valeurs[cle] = prop["default"]
    m = re.search(r"\?\s*\{([^}]*)\}", source)  # thème clair du canevas de fin
    if m:
        for cle, val in re.findall(r"(\w+):\s*'([^']*)'", m.group(1)):
            valeurs[f"c.{cle}"] = val
    return valeurs


def html_canevas(depot: Depot, nom: str) -> str:
    source = (depot.racine / "design" / "canevas-gabarits" / nom).read_text(encoding="utf-8")
    corps = source.split("<x-dc>", 1)[1].split("</x-dc>", 1)[0]
    corps = re.sub(r"<helmet>.*?</helmet>", "", corps, flags=re.S)
    for cle, val in _reglages(source).items():
        corps = corps.replace("{{" + cle + "}}", val)
    # Images des canevas (A24) : chemins relatifs au dossier des canevas, rendus en URL de fichier.
    dossier = depot.racine / "design" / "canevas-gabarits"
    corps = re.sub(r'src="(?!data:|https?:|file:)([^"]+)"', lambda m: f'src="{(dossier / m.group(1)).resolve().as_uri()}"',
                   corps)
    if "{{" in corps:
        raise ValueError(f"{nom} : réglage non résolu {re.findall(r'{{[^}]*}}', corps)[:3]}")
    polices = Charte.charger(depot).polices_css
    return (f'<!doctype html><html lang="fr"><head><meta charset="utf-8"><style>{polices}\n'
            f"body{{margin:0}}</style></head><body>{corps}</body></html>")


def rendre_canevas(depot: Depot, pages: list[str], dossier: Path) -> dict[str, Path]:
    from serie.rendu import photographier

    pngs: dict[str, Path] = {}
    htmls = {p: html_canevas(depot, CANEVAS[p]) for p in pages}
    for hauteur in sorted({hauteur_page(h) for h in htmls.values()}):
        groupe = [p for p in pages if hauteur_page(htmls[p]) == hauteur]
        prefixe = "canevas" if hauteur == HAUTEUR else f"canevas-{hauteur}"
        resultat = photographier([htmls[p] for p in groupe], dossier, prefixe, hauteur=hauteur)
        pngs.update(zip(groupe, resultat.pngs))
    return pngs
