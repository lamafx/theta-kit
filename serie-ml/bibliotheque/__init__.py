"""Bibliothèque visuelle : 9 familles, chacune une fonction rendre(params, theme) -> svg.

Les formes reprennent les planches Bib-Motifs et Bib-Visuels et les pages du canevas.
Un besoin non couvert passe par une session de design ; il ne s'improvise pas ici.

Chaque module déclare `PARAMETRES` : pour chaque forme, les paramètres qu'elle lit. `serie verifier`
refuse une forme ou un paramètre absents de cette liste (un visuel ne s'improvise pas par ses paramètres).
"""

from __future__ import annotations

from importlib import import_module

FAMILLES = ("nuage", "courbe", "reseau", "barres", "niveaux", "blocs", "grille", "arbre", "flux")

# Paramètres admis par toutes les formes : le nom de la forme et le texte lu par les lecteurs d'écran.
COMMUNS = frozenset({"forme", "description"})


def rendre(famille: str, params: dict, theme: dict) -> str:
    if famille not in FAMILLES:
        raise ValueError(f"famille inconnue : {famille}")
    return import_module(f"bibliotheque.{famille}").rendre(params, theme)


def parametres(famille: str) -> dict[str, frozenset[str]]:
    """Formes de la famille et paramètres admis par chacune (en plus de COMMUNS)."""
    if famille not in FAMILLES:
        raise ValueError(f"famille inconnue : {famille}")
    return {forme: frozenset(cles) | COMMUNS for forme, cles in import_module(f"bibliotheque.{famille}").PARAMETRES.items()}
