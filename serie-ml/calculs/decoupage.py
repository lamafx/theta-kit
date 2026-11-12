"""Découpage d'un jeu de données (épisode 20) : entraînement, validation, test.

Sources : Google MLCC « Dividing the original dataset », scikit-learn train_test_split.
"""

from __future__ import annotations


def decouper(total: int, parts: list[float]) -> list[int]:
    """Effectifs entiers des parts (proportions de somme quelconque), dont la somme vaut `total` :
    arrondi par défaut, puis une unité de plus aux plus grands restes."""
    s = sum(parts)
    bruts = [total * p / s for p in parts]
    effectifs = [int(b) for b in bruts]
    for i in sorted(range(len(parts)), key=lambda i: bruts[i] - effectifs[i], reverse=True)[: total - sum(effectifs)]:
        effectifs[i] += 1
    return effectifs
