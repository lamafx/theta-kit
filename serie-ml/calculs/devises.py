"""Conversion des prix en francs CFA (épisode 02) : les montants publiés sont en FCFA, unité de la Côte d'Ivoire.

Cours : BCEAO, « Cours de référence des principales devises contre Franc CFA », cours des devises du mardi
27 octobre 2026 : 1 dollar US = 588,3000 FCFA,
https://www.bceao.int/fr/cours/cours-de-reference-des-principales-devises-contre-franc-cfa (extrait dans sources/02/).
"""

from __future__ import annotations

COURS_USD_FCFA = 588.3
DATE_COURS = "2026-10-27"


def dollars_en_fcfa(montants: list[float], arrondi: int = 1_000_000) -> list[int]:
    """Chaque montant en dollars US converti en FCFA au cours BCEAO du 27 octobre 2026, arrondi à `arrondi` FCFA."""
    return [int(round(m * COURS_USD_FCFA / arrondi)) * arrondi for m in montants]
