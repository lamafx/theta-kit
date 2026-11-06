"""Images en cases (famille Grille) : un chiffre manuscrit réel, ses intensités et leur valeur.

Données : « Optical Recognition of Handwritten Digits », E. Alpaydin et C. Kaynak, UCI Machine Learning
Repository (1998), licence CC BY 4.0, https://doi.org/10.24432/C50P49. Copie du jeu de test distribuée
avec scikit-learn (`sklearn/datasets/data/digits.csv.gz`) : 1 797 images de 8 × 8 cases, chaque case vaut
de 0 à 16 (nombre de pixels allumés dans un bloc de 4 × 4 de l'image d'origine), puis le chiffre écrit.
"""

from __future__ import annotations

import gzip
from functools import cache
from pathlib import Path

FICHIER = Path(__file__).resolve().parent / "donnees" / "chiffres-uci.csv.gz"
MAXIMUM = 16


@cache
def _chiffres() -> list[tuple[list[list[int]], int]]:
    images = []
    with gzip.open(FICHIER, "rt", encoding="ascii") as f:
        for ligne in f:
            valeurs = [int(float(v)) for v in ligne.split(",")]
            images.append(([valeurs[8 * k:8 * k + 8] for k in range(8)], valeurs[64]))
    return images


def chiffre_manuscrit(indice: int) -> dict:
    """L'image nº `indice` du jeu : ses 8 × 8 valeurs (0 à 16), le chiffre écrit et l'intensité de 0 à 1."""
    images = _chiffres()
    if not 0 <= indice < len(images):
        raise ValueError(f"chiffre_manuscrit : indice {indice} hors du jeu (0 à {len(images) - 1})")
    valeurs, chiffre = images[indice]
    return {
        "valeurs": [list(r) for r in valeurs],
        "chiffre": chiffre,
        "intensites": [[v / MAXIMUM for v in r] for r in valeurs],
    }
