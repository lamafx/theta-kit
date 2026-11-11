"""Ventes de maisons à Ames (Iowa, États-Unis), 2006 à 2010 : l'exemple suivi de la saison 1 (épisodes 02 et 04).

Données : D. De Cock, « Ames, Iowa: Alternative to the Boston Housing Data as an End of Semester Regression
Project », Journal of Statistics Education, 19(3), 2011, https://doi.org/10.1080/10691898.2011.11889627 ;
fichier http://jse.amstat.org/v19n3/decock/AmesHousing.txt (2 930 ventes), dont `donnees/ames-maisons.csv.gz`
garde six colonnes : Order, Gr Liv Area (pieds carrés habitables), Bedroom AbvGr, Neighborhood, SalePrice
(dollars), Yr Sold. Comme le recommande l'auteur, les maisons de plus de 4 000 pieds carrés sont écartées.
Surfaces en m², prix en FCFA (calculs/devises.py).
"""

from __future__ import annotations

import csv
import gzip
import random
from functools import cache
from pathlib import Path

from calculs.devises import COURS_USD_FCFA, dollars_en_fcfa
from calculs.droite import moindres_carres, predire

FICHIER = Path(__file__).resolve().parent / "donnees" / "ames-maisons.csv.gz"
PIED_CARRE_M2 = 0.09290304
SURFACE_MAX_PIEDS = 4000

# Noms complets des quartiers (DataDocumentation.txt, « Neighborhood »), pour ceux que montrent les épisodes.
QUARTIERS = {"NAmes": "North Ames", "CollgCr": "College Creek", "OldTown": "Old Town", "Edwards": "Edwards",
             "Somerst": "Somerset", "Gilbert": "Gilbert", "Sawyer": "Sawyer", "NridgHt": "Northridge Heights"}


@cache
def _ventes() -> list[dict]:
    with gzip.open(FICHIER, "rt", encoding="ascii") as f:
        return [{"ordre": int(r["Order"]), "pieds": int(r["Gr Liv Area"]), "chambres": int(r["Bedroom AbvGr"]),
                 "quartier": r["Neighborhood"], "prix": int(r["SalePrice"]), "annee": int(r["Yr Sold"])}
                for r in csv.DictReader(f) if int(r["Gr Liv Area"]) <= SURFACE_MAX_PIEDS]


def maisons(ordres: list[int]) -> list[dict]:
    """Les ventes nº `ordres` (colonne Order) : surface en m² arrondie, chambres, quartier, prix en FCFA au million,
    et le prix de la source (SalePrice, en dollars) dans `dollars`."""
    par_ordre = {v["ordre"]: v for v in _ventes()}
    choisies = [par_ordre[o] for o in ordres]
    prix = dollars_en_fcfa([v["prix"] for v in choisies])
    return [{"surface": round(v["pieds"] * PIED_CARRE_M2), "chambres": v["chambres"],
             "quartier": QUARTIERS.get(v["quartier"], v["quartier"]), "prix": p, "dollars": v["prix"],
             "annee": v["annee"]}
            for v, p in zip(choisies, prix)]


def prediction_surface(x: float, a: float, b: float) -> dict:
    """Prix prédit ŷ = a·x + b pour une surface x en centaines de m², et cette surface en m² (épisode 04)."""
    return {"prediction": predire(x, a, b), "m2": round(x * 100)}


def droite_prix_surface() -> dict:
    """Droite des moindres carrés du prix (millions de FCFA) selon la surface (centaines de m²), sur toutes les
    ventes gardées ; a et b arrondis à l'unité, comme sur les pages, et le nombre de ventes."""
    points = [[v["pieds"] * PIED_CARRE_M2 / 100, v["prix"] * COURS_USD_FCFA / 1e6] for v in _ventes()]
    d = moindres_carres(points)
    return {"a": round(d["a"]), "b": round(d["b"]), "n": len(points)}


def points_surface_prix() -> list[list[float]]:
    """Toutes les ventes gardées : [surface en centaines de m², prix en millions de FCFA]."""
    return [[v["pieds"] * PIED_CARRE_M2 / 100, v["prix"] * COURS_USD_FCFA / 1e6] for v in _ventes()]


def echantillon(n: int, graine: int) -> list[list[float]]:
    """n ventes tirées sans remise avec une graine fixe (même graine, mêmes ventes) : de vrais points à dessiner,
    [surface en centaines de m², prix en millions de FCFA], arrondis au millième."""
    choisies = random.Random(graine).sample(points_surface_prix(), n)
    return [[round(x, 3), round(y, 3)] for x, y in choisies]


def descente_droite(eta: float, iterations: list[int], depart: list[float] | None = None) -> list[dict]:
    """Descente de gradient de la MSE de ŷ = w·x + b sur toutes les ventes gardées (épisode 11, MLCC « Gradient
    descent ») : w ← w − η·(2/n) Σ (ŷᵢ − yᵢ)·xᵢ et b ← b − η·(2/n) Σ (ŷᵢ − yᵢ). Pour chaque itération demandée
    (0 : le départ) : w et b au dixième, et le coût J arrondi à l'unité (millions de FCFA au carré)."""
    pts = points_surface_prix()
    n = len(pts)
    sx = sum(x for x, _ in pts) / n
    sy = sum(y for _, y in pts) / n
    sxx = sum(x * x for x, _ in pts) / n
    sxy = sum(x * y for x, y in pts) / n
    syy = sum(y * y for _, y in pts) / n
    w, b = depart or [0.0, 0.0]
    lignes = []
    for k in range(max(iterations) + 1):
        if k in iterations:
            cout = w * w * sxx + b * b + syy + 2 * w * b * sx - 2 * w * sxy - 2 * b * sy
            lignes.append({"iteration": k, "w": round(w, 1), "b": round(b, 1), "cout": round(cout)})
        dw = 2 * (w * sxx + b * sx - sxy)
        db = 2 * (w * sx + b - sy)
        w, b = w - eta * dw, b - eta * db
    return lignes


def points_surface_chambres_prix() -> list[list[float]]:
    """Toutes les ventes gardées : [surface en centaines de m², chambres (Bedroom AbvGr), prix en millions de FCFA]
    (épisode 12)."""
    return [[v["pieds"] * PIED_CARRE_M2 / 100, v["chambres"], v["prix"] * COURS_USD_FCFA / 1e6] for v in _ventes()]


def _resoudre(a: list[list[float]], b: list[float]) -> list[float]:
    """Système linéaire carré, par élimination de Gauss avec pivot partiel."""
    n = len(b)
    m = [ligne[:] + [v] for ligne, v in zip(a, b)]
    for k in range(n):
        p = max(range(k, n), key=lambda i: abs(m[i][k]))
        m[k], m[p] = m[p], m[k]
        for i in range(k + 1, n):
            f = m[i][k] / m[k][k]
            m[i] = [x - f * y for x, y in zip(m[i], m[k])]
    x = [0.0] * n
    for k in reversed(range(n)):
        x[k] = (m[k][n] - sum(m[k][j] * x[j] for j in range(k + 1, n))) / m[k][k]
    return x


def moindres_carres_multiples(points: list[list[float]]) -> dict:
    """Plan des moindres carrés ŷ = w₁·x₁ + w₂·x₂ + b de points [x₁, x₂, y] (équations normales, SKL « Ordinary
    Least Squares » : minimise la somme des carrés des écarts) : w₁, w₂, b non arrondis."""
    lignes = [[x1, x2, 1.0] for x1, x2, _ in points]
    ys = [y for _, _, y in points]
    ata = [[sum(l[i] * l[j] for l in lignes) for j in range(3)] for i in range(3)]
    aty = [sum(l[i] * y for l, y in zip(lignes, ys)) for i in range(3)]
    w1, w2, b = _resoudre(ata, aty)
    return {"w1": w1, "w2": w2, "b": b}


def plan_prix_surface_chambres() -> dict:
    """Plan des moindres carrés du prix (millions de FCFA) selon la surface (centaines de m²) et le nombre de
    chambres, sur toutes les ventes gardées (épisode 12) ; poids et biais au dixième, et le nombre de ventes."""
    pts = points_surface_chambres_prix()
    p = moindres_carres_multiples(pts)
    return {"w1": round(p["w1"], 1), "w2": round(p["w2"], 1), "b": round(p["b"], 1), "n": len(pts)}


def echantillon_surface_chambres(n: int, graine: int) -> list[list[float]]:
    """n ventes tirées sans remise avec une graine fixe : [surface en centaines de m², chambres, prix en millions
    de FCFA], surface et prix arrondis au millième."""
    choisies = random.Random(graine).sample(points_surface_chambres_prix(), n)
    return [[round(x1, 3), x2, round(y, 3)] for x1, x2, y in choisies]
