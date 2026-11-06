"""Nuages de points (famille Nuage) : exemples tirés au hasard avec une graine fixe, zone couverte par les
exemples, centres des groupes, frontière entre deux classes.

Les points sont des données d'illustration produites par un tirage reproductible (même graine, mêmes points),
jamais placées à l'œil ; la droite de régression vient de calculs/droite.py.
"""

from __future__ import annotations

import random

from calculs.droite import predire


def groupes(centres: list[list[float]], effectifs: list[int], dispersion: float | list[float], graine: int) -> list[list[float]]:
    """Points [x, y, groupe] tirés autour de chaque centre (loi normale, écart type `dispersion`)."""
    if len(effectifs) != len(centres):
        raise ValueError(f"groupes : {len(effectifs)} effectifs pour {len(centres)} centres")
    ecarts = dispersion if isinstance(dispersion, list) else [dispersion] * len(centres)
    tirage = random.Random(graine)
    points = []
    for g, ((cx, cy), n, s) in enumerate(zip(centres, effectifs, ecarts)):
        points += [[round(tirage.gauss(cx, s), 3), round(tirage.gauss(cy, s), 3), g] for _ in range(n)]
    return points


def autour_d_une_droite(n: int, a: float, b: float, bruit: float, domaine: list[float], graine: int) -> list[list[float]]:
    """n points [x, y] : x régulièrement espacés dans le domaine, y = a·x + b plus un bruit normal."""
    tirage = random.Random(graine)
    x0, x1 = domaine
    pas = (x1 - x0) / (n - 1)
    return [[round(x0 + k * pas, 3), round(predire(x0 + k * pas, a, b) + tirage.gauss(0, bruit), 3)] for k in range(n)]



def autour_d_un_polynome(n: int, coefficients: list[float], bruit: float, domaine: list[float],
                         graine: int) -> list[list[float]]:
    """n points [x, y] : x régulièrement espacés, y = c₀ + c₁·x + c₂·x² + … plus un bruit normal (une relation
    courbe, épisodes 11 et 14)."""
    tirage = random.Random(graine)
    x0, x1 = domaine
    pas = (x1 - x0) / (n - 1)
    pts = []
    for k in range(n):
        x = x0 + k * pas
        y = sum(c * x ** i for i, c in enumerate(coefficients))
        pts.append([round(x, 3), round(y + tirage.gauss(0, bruit), 3)])
    return pts

def enveloppe(points: list[list[float]]) -> list[list[float]]:
    """Enveloppe convexe des points (algorithme d'Andrew), dans le sens trigonométrique."""
    pts = sorted({(p[0], p[1]) for p in points})
    if len(pts) < 3:
        return [list(p) for p in pts]

    def tour(o, a, b):
        return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0])

    bas, haut = [], []
    for p in pts:
        while len(bas) >= 2 and tour(bas[-2], bas[-1], p) <= 0:
            bas.pop()
        bas.append(p)
    for p in reversed(pts):
        while len(haut) >= 2 and tour(haut[-2], haut[-1], p) <= 0:
            haut.pop()
        haut.append(p)
    return [list(p) for p in bas[:-1] + haut[:-1]]


def distance_a_l_enveloppe(point: list[float], polygone: list[list[float]]) -> float:
    """Distance du point au polygone convexe : 0 s'il est dedans (polygone dans un sens ou dans l'autre)."""
    x, y = point[0], point[1]
    tours = [(b[0] - a[0]) * (y - a[1]) - (b[1] - a[1]) * (x - a[0])
             for a, b in zip(polygone, polygone[1:] + polygone[:1])]
    dedans = all(t >= 0 for t in tours) or all(t <= 0 for t in tours)
    if dedans:
        return 0.0

    def au_segment(a, b):
        dx, dy = b[0] - a[0], b[1] - a[1]
        t = max(0.0, min(1.0, ((x - a[0]) * dx + (y - a[1]) * dy) / (dx * dx + dy * dy)))
        return ((x - a[0] - t * dx) ** 2 + (y - a[1] - t * dy) ** 2) ** 0.5

    return min(au_segment(a, b) for a, b in zip(polygone, polygone[1:] + polygone[:1]))


def centres(points: list[list[float]]) -> list[list[float]]:
    """Centre (moyenne) de chaque groupe, dans l'ordre des numéros de groupe."""
    numeros = sorted({int(p[2]) for p in points})
    resultat = []
    for g in numeros:
        membres = [p for p in points if int(p[2]) == g]
        resultat.append([sum(p[0] for p in membres) / len(membres), sum(p[1] for p in membres) / len(membres)])
    return resultat


def frontiere(points: list[list[float]]) -> dict[str, float]:
    """Frontière entre deux classes : la médiatrice de leurs centres, ŷ = a·x + b."""
    c = centres(points)
    if len(c) != 2:
        raise ValueError(f"frontière : deux classes attendues, {len(c)} trouvées")
    (x0, y0), (x1, y1) = c
    if y1 == y0:
        raise ValueError("frontière verticale : non prise en charge")
    mx, my = (x0 + x1) / 2, (y0 + y1) / 2
    a = -(x1 - x0) / (y1 - y0)
    return {"a": a, "b": my - a * mx}
