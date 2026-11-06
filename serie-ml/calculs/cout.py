"""Fonction de coût J (épisode 05) : l'erreur quadratique moyenne d'une droite ŷ = a·x + b sur les ventes d'Ames.

Mêmes unités que l'épisode 04 (calculs/ames.py) : x en centaines de m², prix en millions de FCFA ; J est donc
en millions de FCFA au carré. J = (1/n) Σ (ŷᵢ − yᵢ)².
"""

from __future__ import annotations

from calculs.ames import COURS_USD_FCFA, PIED_CARRE_M2, _ventes, maisons
from calculs.droite import predire


def _points() -> list[tuple[float, float]]:
    return [(v["pieds"] * PIED_CARRE_M2 / 100, v["prix"] * COURS_USD_FCFA / 1e6) for v in _ventes()]


def erreurs_maisons(ordres: list[int], a: float, b: float) -> list[dict]:
    """Pour chaque maison (calculs.ames.maisons) : surface, prix et prédiction arrondis au million de FCFA,
    erreur ŷ − y et son carré, calculés sur ces valeurs arrondies, comme les lit le lecteur."""
    lignes = []
    for m in maisons(ordres):
        prix = round(m["prix"] / 1e6)
        prediction = round(predire(m["surface"] / 100, a, b))
        lignes.append({"surface": m["surface"], "quartier": m["quartier"], "prix": prix, "prediction": prediction,
                       "erreur": prediction - prix, "carre": (prediction - prix) ** 2})
    return lignes


def cout_maisons(ordres: list[int], a: float, b: float) -> float:
    """J sur les seules maisons `ordres`, à partir des erreurs arrondies de erreurs_maisons."""
    lignes = erreurs_maisons(ordres, a, b)
    return sum(l["carre"] for l in lignes) / len(lignes)


def cout_ames(a: float, b: float) -> int:
    """J de la droite ŷ = a·x + b sur toutes les ventes gardées, arrondi à l'unité."""
    pts = _points()
    return round(sum((predire(x, a, b) - y) ** 2 for x, y in pts) / len(pts))


def cout_selon_a(b: float, unite: float) -> dict:
    """J en fonction de a, b fixé : une parabole J(a) = s·(a − a*)² + J*, exacte car J est du second degré en a.

    Pour la forme Courbe (Repère θ ↦ A·θ² + C), avec θ = (a − a*) / unite : renvoie A = s·unite² et C = J*
    (arrondis au dixième), et le creux a* arrondi à l'unité."""
    pts = _points()
    n = len(pts)
    s = sum(x * x for x, _ in pts) / n
    a_creux = sum(x * (y - b) for x, y in pts) / n / s
    j_creux = sum((predire(x, a_creux, b) - y) ** 2 for x, y in pts) / n
    return {"a": round(s * unite * unite, 1), "c": round(j_creux, 1), "creux": round(a_creux)}
