"""Classification (épisodes 16 à 19) : sigmoïde, régression logistique, entropie croisée, softmax.

Sources : D2L 4.1 (softmax, entropie croisée), Google MLCC « Logistic regression » (sigmoïde, log loss),
scikit-learn (LogisticRegression). Les valeurs affichées dans un épisode viennent de ces fonctions.
"""

from __future__ import annotations

import math
import random


def sigmoide(z: float) -> float:
    """σ(z) = 1 / (1 + e⁻ᶻ), écrite pour ne jamais déborder."""
    if z >= 0:
        return 1 / (1 + math.exp(-z))
    e = math.exp(z)
    return e / (1 + e)


def pente_sigmoide(z: float) -> float:
    s = sigmoide(z)
    return s * (1 - s)


def log_perte(p: float) -> float:
    """Coût d'entropie croisée quand la vraie classe est 1 : −ln(p) (ln, logarithme naturel)."""
    return -math.log(max(p, 1e-12))


def entropie_croisee(y: int, p: float) -> float:
    """−[y·ln(p) + (1 − y)·ln(1 − p)]."""
    return log_perte(p) if y == 1 else log_perte(1 - p)


def softmax(logits: list[float]) -> list[float]:
    """eᶻᵏ / Σ eᶻʲ, décalée par le maximum (même résultat, sans débordement)."""
    m = max(logits)
    e = [math.exp(z - m) for z in logits]
    s = sum(e)
    return [x / s for x in e]


def echantillon_binaire(n: int, w: float, b: float, domaine: list[float], graine: int) -> list[list[float]]:
    """n points [x, y] : x régulièrement espacés, y = 1 avec la probabilité σ(w·x + b), sinon 0 (tirage reproductible)."""
    tirage = random.Random(graine)
    x0, x1 = domaine
    pas = (x1 - x0) / (n - 1)
    return [[round(x0 + k * pas, 3), 1 if tirage.random() < sigmoide(w * (x0 + k * pas) + b) else 0] for k in range(n)]


def logistique(points: list[list[float]], iterations: int = 50) -> dict[str, float]:
    """Régression logistique à une variable (maximum de vraisemblance, méthode de Newton) : w, b et le seuil
    x où p = 0,5 (−b / w). Une petite pénalité (1e-6) garde la solution finie si les classes sont séparées."""
    w = b = 0.0
    for _ in range(iterations):
        gw = gb = hww = hwb = hbb = 0.0
        for x, y in points:
            p = sigmoide(w * x + b)
            gw += (p - y) * x
            gb += p - y
            v = p * (1 - p)
            hww += v * x * x
            hwb += v * x
            hbb += v
        gw += 1e-6 * w
        hww += 1e-6
        hbb += 1e-6
        det = hww * hbb - hwb * hwb
        if det <= 0:
            break
        dw = (hbb * gw - hwb * gb) / det
        db = (hww * gb - hwb * gw) / det
        w, b = w - dw, b - db
        if abs(dw) < 1e-12 and abs(db) < 1e-12:
            break
    return {"w": w, "b": b, "seuil": -b / w if w else float("nan")}
