"""Prérequis d'un épisode et ligne de rappel de l'ouverture.

Règle (charte/regles-banque.md, « Comment l'ordre est construit ») : chaque épisode a pour prérequis
implicites tous les épisodes qui le précèdent dans son chapitre ; la fiche n'indique que ceux qui
viennent d'autres chapitres (`prerequis_explicites`).

Ligne de rappel (decisions-automatisation.md, 9.3) : elle cite les numéros des prérequis. Deux cas
sont fixés par le code : l'épisode 01 (« Épisode 1 · Saison 1 ») et le premier épisode d'un chapitre
sans prérequis (« Nouveau chapitre · <titre du chapitre> »).
"""

from __future__ import annotations

import re

from serie.schemas import Fiche


def prerequis(numero: int, fiches: dict[int, Fiche]) -> list[int]:
    """Épisodes précédents du même chapitre, plus les prérequis explicites, triés."""
    fiche = fiches[numero]
    meme_chapitre = {n for n, f in fiches.items() if n < numero and f.chapitre.numero == fiche.chapitre.numero}
    return sorted(meme_chapitre | set(fiche.prerequis_explicites))


def rappel_fixe(numero: int, fiches: dict[int, Fiche]) -> str | None:
    """Le rappel imposé par 9.3, ou None si l'agent l'écrit (il cite alors les prérequis)."""
    fiche = fiches[numero]
    if numero == 1:
        return f"Épisode 1 · Saison {fiche.saison}"
    if not prerequis(numero, fiches):
        return f"Nouveau chapitre · {fiche.chapitre.titre}"
    return None


def numeros_cites(rappel: str) -> list[int]:
    """Numéros d'épisodes cités par un rappel : « (Nº 05) et lire une pente (Nº 06 et 07) » → [5, 6, 7]."""
    numeros = []
    for groupe in re.findall(r"N[º°]\s*([\d\s,et]+)", rappel):
        numeros += [int(x) for x in re.findall(r"\d+", groupe)]
    return numeros
