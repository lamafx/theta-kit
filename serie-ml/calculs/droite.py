"""Droite ŷ = a·x + b (épisode 04) : partagée par la famille Courbe (droite, pivot, décalage) et par la
régression de la famille Nuage (droite des moindres carrés et écarts verticaux)."""

from __future__ import annotations


def predire(x: float, a: float, b: float) -> float:
    """ŷ = a·x + b."""
    return a * x + b


def segment(a: float, b: float, domaine: list[float], plage: list[float]) -> list[list[float]]:
    """Les deux extrémités de la droite dans le rectangle domaine × plage (x de domaine[0] à domaine[1],
    y de plage[0] à plage[1]) ; une droite qui ne le traverse pas lève ValueError."""
    (x0, x1), (y0, y1) = domaine, plage
    if a == 0:
        if not y0 <= b <= y1:
            raise ValueError(f"droite ŷ = {b} hors de la plage {plage}")
        return [[x0, b], [x1, b]]
    xa, xb = sorted(((y0 - b) / a, (y1 - b) / a))
    debut, fin = max(x0, xa), min(x1, xb)
    if debut >= fin:
        raise ValueError(f"droite ŷ = {a}·x + {b} hors du cadre {domaine} × {plage}")
    return [[debut, predire(debut, a, b)], [fin, predire(fin, a, b)]]


def moindres_carres(points: list[list[float]]) -> dict[str, float]:
    """Pente a et ordonnée à l'origine b qui minimisent la somme des carrés des écarts verticaux."""
    n = len(points)
    if n < 2:
        raise ValueError("moindres carrés : au moins deux points")
    mx = sum(p[0] for p in points) / n
    my = sum(p[1] for p in points) / n
    sxx = sum((p[0] - mx) ** 2 for p in points)
    if sxx == 0:
        raise ValueError("moindres carrés : tous les points ont le même x")
    a = sum((p[0] - mx) * (p[1] - my) for p in points) / sxx
    return {"a": a, "b": my - a * mx}


def ecarts(points: list[list[float]], a: float, b: float) -> list[float]:
    """Écart vertical de chaque point à la droite : y − ŷ."""
    return [p[1] - predire(p[0], a, b) for p in points]
