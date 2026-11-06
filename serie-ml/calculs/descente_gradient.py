"""Descente de gradient sur une erreur quadratique J(θ) = a·θ² + c (épisode 08) ; gradient en deux réglages (07) ;
descente stochastique et mini-lots (09) ; courbes à plusieurs creux et selle (10)."""

from __future__ import annotations

import math
import random


def erreur(theta: float, a: float = 1.0, c: float = 0.0) -> float:
    return a * theta * theta + c


def pente(theta: float, a: float = 1.0) -> float:
    """Dérivée de J(θ) = a·θ² + c : 2aθ."""
    return 2 * a * theta


def iterations(theta0: float, eta: float, pas: int, a: float = 1.0) -> list[float]:
    """θ₀, θ₁, …, θ_pas avec θ ← θ − η·J'(θ)."""
    thetas = [theta0]
    for _ in range(pas):
        t = thetas[-1]
        thetas.append(t - eta * pente(t, a))
    return thetas


def tableau(theta0: float, eta: float, pas: int, a: float = 1.0) -> list[dict[str, float]]:
    """Une ligne par pas : θ, la pente, le pas η × pente, le nouveau θ, et l'erreur avant et après."""
    lignes = []
    t = theta0
    for k in range(1, pas + 1):
        p = pente(t, a)
        nouveau = t - eta * p
        lignes.append({
            "pas": k, "theta": t, "pente": p, "deplacement": eta * p, "nouveau": nouveau,
            "erreur": erreur(t, a), "erreur_apres": erreur(nouveau, a),
        })
        t = nouveau
    return lignes


def iterations_2d(depart: list[float], eta: float, courbures: list[float], pas: int) -> list[list[float]]:
    """Descente sur J(x, y) = a·x² + b·y², centrée en 0 : chaque coordonnée est multipliée par 1 − 2ηa."""
    points = [list(depart)]
    for _ in range(pas):
        x, y = points[-1]
        points.append([x - eta * 2 * courbures[0] * x, y - eta * 2 * courbures[1] * y])
    return points


def gradient_2d(point: list[float], courbures: list[float]) -> list[float]:
    """Gradient de J(a, b) = k_a·a² + k_b·b² en (a, b) : ∇J = (2·k_a·a, 2·k_b·b) (épisode 07)."""
    (a, b), (ka, kb) = point, courbures
    return [2 * ka * a, 2 * kb * b]


def gradient_tableau(points: list[list[float]], courbures: list[float]) -> list[dict[str, float]]:
    """Une ligne par point : a, b, J(a, b), puis les deux dérivées partielles ∂J/∂a et ∂J/∂b."""
    ka, kb = courbures
    lignes = []
    for a, b in points:
        da, db = gradient_2d([a, b], courbures)
        lignes.append({"a": a, "b": b, "cout": ka * a * a + kb * b * b, "da": da, "db": db})
    return lignes


def niveau_2d(cout: float, courbures: list[float]) -> list[float]:
    """Demi-axes de la ligne de niveau J(a, b) = cout : l'ellipse k_a·a² + k_b·b² = cout."""
    return [(cout / courbures[0]) ** 0.5, (cout / courbures[1]) ** 0.5]


def sgd_2d(depart: list[float], eta: float, courbures: list[float], pas: int, bruit: float = 0.0, lot: int = 1,
           decroissance: bool = False, graine: int = 0) -> list[list[float]]:
    """Descente stochastique sur J(a, b) = k_a·a² + k_b·b² (épisode 09) : au gradient exact s'ajoute un bruit tiré
    de moyenne 0 et d'écart-type `bruit` / √`lot` (un mini-lot de `lot` exemples divise l'écart-type par √lot,
    D2L 12.5) ; avec `decroissance`, le taux du pas t (compté de 0) vaut η / √(t + 1) (D2L 12.4)."""
    tirage = random.Random(graine)
    ecart = bruit / math.sqrt(lot)
    points = [list(depart)]
    for t in range(pas):
        a, b = points[-1]
        ga, gb = gradient_2d([a, b], courbures)
        taux = eta / math.sqrt(t + 1) if decroissance else eta
        points.append([a - taux * (ga + tirage.gauss(0, ecart)), b - taux * (gb + tirage.gauss(0, ecart))])
    return points


def pas_par_epoque(n: int, lot: int) -> int:
    """Nombre de pas pour voir une fois chacun des n exemples, par lots de `lot` (le dernier lot peut être incomplet)."""
    return math.ceil(n / lot)


def pas_par_epoque_tableau(n: int, lots: list[int]) -> list[dict[str, int]]:
    """Une ligne par taille de lot : exemples, lot, pas par époque."""
    return [{"exemples": n, "lot": lot, "pas": pas_par_epoque(n, lot)} for lot in lots]


# --- Courbes autres que la parabole (épisode 10) -----------------------------------------------------------

def _ondulee(x: float) -> float:
    return x * math.cos(math.pi * x)


def _pente_ondulee(x: float) -> float:
    return math.cos(math.pi * x) - math.pi * x * math.sin(math.pi * x)


# Nom → (fonction, pente). ondulee : f(x) = x·cos(πx), deux creux sur [−1 ; 2] (D2L 12.1) ; parabole : x² ;
# fond_plat : max(|x| − 1, 0), convexe et plate au fond (D2L 12.2).
FONCTIONS = {
    "ondulee": (_ondulee, _pente_ondulee),
    "parabole": (lambda x: x * x, lambda x: 2 * x),
    "fond_plat": (lambda x: max(abs(x) - 1, 0.0), lambda x: 0.0 if abs(x) <= 1 else math.copysign(1.0, x)),
}


def valeur_f(courbe: str, x: float) -> float:
    return FONCTIONS[courbe][0](x)


def iterations_f(courbe: str, theta0: float, eta: float, pas: int) -> list[float]:
    """θ₀, θ₁, …, θ_pas avec θ ← θ − η·f'(θ), sur la fonction `courbe`."""
    pente_f = FONCTIONS[courbe][1]
    thetas = [theta0]
    for _ in range(pas):
        thetas.append(thetas[-1] - eta * pente_f(thetas[-1]))
    return thetas


def creux_f(courbe: str, debut: float, fin: float, finesse: int = 3000) -> list[tuple[float, float]]:
    """Minimums locaux (x, f(x)) strictement à l'intérieur de [debut ; fin] : changement de signe de la pente,
    de − à +, affiné par dichotomie."""
    pente_f = FONCTIONS[courbe][1]
    pas = (fin - debut) / finesse
    creux = []
    for k in range(1, finesse - 1):
        a, b = debut + k * pas, debut + (k + 1) * pas
        if pente_f(a) < 0 <= pente_f(b):
            for _ in range(60):
                m = (a + b) / 2
                a, b = (m, b) if pente_f(m) < 0 else (a, m)
            x = (a + b) / 2
            creux.append((x, valeur_f(courbe, x)))
    return creux


def niveau_selle(cout: float, courbures: list[float], domaine: list[float], plage: list[float],
                 finesse: int = 120) -> list[list[tuple[float, float]]]:
    """Ligne de niveau k_a·a² + k_b·b² = cout quand k_a et k_b sont de signes opposés (point selle en (0, 0),
    D2L 12.1 : x² − y²) : deux branches d'hyperbole (deux droites pour cout = 0), points (a, b) gardés dans le
    domaine (a) et la plage (b). Paramétrée par la variable dont le terme a le signe opposé à cout."""
    ka, kb = courbures
    (a0, a1), (b0, b1) = domaine, plage
    par_b = (cout >= 0) == (ka > 0)
    debut, fin = (b0, b1) if par_b else (a0, a1)
    branches = []
    for signe in (1, -1):
        branche = []
        for i in range(finesse + 1):
            u = debut + (fin - debut) * i / finesse
            reste = (cout - kb * u * u) / ka if par_b else (cout - ka * u * u) / kb
            if reste < 0:
                continue
            v = signe * math.sqrt(reste)
            a, b = (v, u) if par_b else (u, v)
            if a0 <= a <= a1 and b0 <= b <= b1:
                branche.append((a, b))
        if len(branche) > 1:
            branches.append(branche)
    return branches
