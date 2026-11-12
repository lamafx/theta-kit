"""Régression polynomiale (épisode 14) : le polynôme de degré d des moindres carrés.

x², x³, … deviennent de nouvelles caractéristiques et la régression reste linéaire en ses coefficients
(D2L 3.6, scikit-learn PolynomialFeatures). Le calcul se fait sur x ramené dans [−1 ; 1], par une décomposition QR
(Householder) : avec les équations normales, le degré 15 serait faussé par les arrondis.
"""

from __future__ import annotations

import math


def _qr_resoudre(a: list[list[float]], y: list[float]) -> list[float]:
    """Solution des moindres carrés de a·c ≈ y (a : n lignes, m colonnes, n ≥ m)."""
    n, m = len(a), len(a[0])
    a = [ligne[:] for ligne in a]
    y = y[:]
    for k in range(m):
        norme = math.sqrt(sum(a[i][k] ** 2 for i in range(k, n)))
        if norme == 0:
            continue
        alpha = -norme if a[k][k] >= 0 else norme
        v = [0.0] * n
        v[k] = a[k][k] - alpha
        for i in range(k + 1, n):
            v[i] = a[i][k]
        vv = sum(x * x for x in v[k:])
        if vv == 0:
            continue
        for j in range(k, m):
            s = sum(v[i] * a[i][j] for i in range(k, n)) * 2 / vv
            for i in range(k, n):
                a[i][j] -= s * v[i]
        s = sum(v[i] * y[i] for i in range(k, n)) * 2 / vv
        for i in range(k, n):
            y[i] -= s * v[i]
    c = [0.0] * m
    for k in range(m - 1, -1, -1):
        c[k] = (y[k] - sum(a[k][j] * c[j] for j in range(k + 1, m))) / a[k][k]
    return c


def ajuster(points: list[list[float]], degre: int) -> dict:
    """Le polynôme de degré `degre` des moindres carrés ; il faut au moins degre + 1 points."""
    if len(points) <= degre:
        raise ValueError(f"degré {degre} : au moins {degre + 1} points attendus, {len(points)} donnés")
    xs = [p[0] for p in points]
    centre, demi = (max(xs) + min(xs)) / 2, (max(xs) - min(xs)) / 2 or 1.0
    a = [[((x - centre) / demi) ** k for k in range(degre + 1)] for x in xs]
    coefficients = _qr_resoudre(a, [p[1] for p in points])
    return {"degre": degre, "centre": centre, "demi": demi, "coefficients": coefficients}


def evaluer(modele: dict, x: float) -> float:
    u = (x - modele["centre"]) / modele["demi"]
    return sum(c * u ** k for k, c in enumerate(modele["coefficients"]))


def erreur_quadratique(points: list[list[float]], modele: dict) -> float:
    """Erreur quadratique moyenne sur ces points."""
    return sum((evaluer(modele, x) - y) ** 2 for x, y in points) / len(points)
