"""Fonds de couverture (A11) : la géométrie du motif de chaque famille, en pixels du fond (1080 × 780).

Le fond est placé derrière le robot, dont le centre est en CENTRE_ROBOT. Le motif occupe le haut et le côté
droit et s'efface vers le robot : l'opacité de chaque élément dépend de sa place (`opacite`), de 0,08 à 0,6
comme les lignes de niveau de l'épisode 08 ; un seul élément est plus marqué. Tout est calculé ici ;
la graine et les autres paramètres distinguent deux épisodes consécutifs de la même famille.
"""

from __future__ import annotations

import math
import random
from contextlib import contextmanager

LARGEUR, HAUTEUR = 1080, 780
CENTRE_ROBOT = (540, 340)
MINI, MAXI = 0.08, 0.6
MARQUE = 0.9
PLEIN = 0.4  # une surface pleine pèse plus qu'un trait : son opacité est réduite d'autant
BAS = 740  # le motif s'éteint avant le titre de la couverture

# Couverture A (session de design n° 2) : le robot n'est plus au centre du fond. Le motif est montré à sa taille,
# centré dans la zone que le bras du robot atteint ; il n'a plus à s'effacer vers le centre (`en_zone`).
_ZONE = False
DEMI_ZONE = 420  # rayon, en pixels du fond, au-delà duquel le motif s'atténue en mode zone


@contextmanager
def en_zone():
    """Fond calculé pour la zone du motif de la couverture A : opacité la plus forte au centre du fond, qui
    décroît vers les bords de la zone ; aucun élément retiré pour laisser la place au robot."""
    global _ZONE
    avant, _ZONE = _ZONE, True
    try:
        yield
    finally:
        _ZONE = avant


def opacite(x: float, y: float, plein: bool = False) -> float:
    """Faible sur le robot et aux bords, plus forte dans une couronne autour de lui, à droite et en haut ;
    nulle sous BAS. `plein` : pour une surface pleine plutôt qu'un trait ou un point. En mode zone (`en_zone`),
    la plus forte au centre du fond et décroissante vers les bords."""
    if _ZONE:
        d = math.hypot(x - LARGEUR / 2, (y - HAUTEUR / 2) * 1.3)
        valeur = MINI + (MAXI - MINI) * max(0.0, 1 - max(0.0, d - 120) / DEMI_ZONE)
        return round(valeur * (PLEIN if plein else 1), 2)
    cx, cy = CENTRE_ROBOT
    d = math.hypot(x - cx, (y - cy) * 1.15)
    if d <= 230:
        montee = 0.0
    elif d <= 420:
        montee = (d - 230) / 190
    else:
        montee = max(0.0, 1 - (d - 420) / 520)
    cote = 1.0 if x >= cx else 0.55 + 0.45 * max(0.0, 1 - (cx - x) / 300) ** 2
    haut = 1.0 if y <= cy else max(0.0, 1 - (y - cy) / (BAS - cy))
    valeur = (MINI + (MAXI - MINI) * montee * cote) * haut
    return round(valeur * (PLEIN if plein else 1), 2)


# --- Nuage ----------------------------------------------------------------------------------

def nuage(centres: list[list[float]], effectifs: list[int], dispersion: float, graine: int) -> list[list[float]]:
    """Points [x, y, groupe, opacité] tirés autour des centres ; ceux qui sortent du fond sont écartés."""
    from calculs.nuage import groupes

    return [[x, y, g, opacite(x, y)] for x, y, g in groupes(centres, effectifs, dispersion, graine)
            if 0 <= x <= LARGEUR and 0 <= y <= HAUTEUR]


def nuage_droite(debut: list[float], fin: list[float], pas: float, bruit: float, garde: float, graine: int,
                 exclus: tuple[float, float] = (310, 850)) -> list[list[float]]:
    """Exemples autour d'une droite (couverture du 2026-10-26, design/propositions/couverture-n01.html) : un x
    tous les `pas` pixels de debut à fin, gardé avec la probabilité `garde`, et un y sur la droite qui joint
    debut et fin plus un bruit normal d'écart type `bruit`. Aucun point derrière le robot (x dans `exclus`)."""
    tirage = random.Random(graine)
    pente = (fin[1] - debut[1]) / (fin[0] - debut[0])
    points = []
    x = debut[0] + pas
    while x < fin[0]:
        if (_ZONE or not exclus[0] < x < exclus[1]) and tirage.random() < garde:
            points.append([x, round(debut[1] + pente * (x - debut[0]) + tirage.gauss(0, bruit), 1)])
        x += pas
    return points


def plan_incline(coin: list[float], largeur: list[float], fuite: list[float], hauteur: float, mailles: list[int],
                 n: int, bruit: float, graine: int) -> dict:
    """Plan incliné vu en perspective cavalière, au-dessus d'un nuage de points (épisode 12, A67).

    Le plan est le parallélogramme de sommet `coin` et de côtés `largeur` (bord avant) et `fuite` (bord qui
    s'enfonce), montés de `hauteur` pixels du bord gauche au bord droit, comme un prix qui monte avec la surface.
    `mailles` [colonnes, rangées] : lignes de maillage ; `n` points tirés sur le plan puis écartés verticalement
    d'un bruit normal d'écart type `bruit`, chacun relié au plan par son écart. Renvoie le contour, les lignes du
    maillage [x0, y0, x1, y1, opacité] et les points [x, y, x du pied, y du pied, opacité, dessus]."""

    def sur_plan(u: float, v: float) -> tuple[float, float]:
        return (coin[0] + u * largeur[0] + v * fuite[0], coin[1] + u * largeur[1] + v * fuite[1] - u * hauteur)

    contour = [list(sur_plan(u, v)) for u, v in ((0, 0), (1, 0), (1, 1), (0, 1))]
    lignes = []
    colonnes, rangees = mailles
    for k in range(colonnes + 1):
        (x0, y0), (x1, y1) = sur_plan(k / colonnes, 0), sur_plan(k / colonnes, 1)
        lignes.append([x0, y0, x1, y1, opacite((x0 + x1) / 2, (y0 + y1) / 2)])
    for k in range(rangees + 1):
        (x0, y0), (x1, y1) = sur_plan(0, k / rangees), sur_plan(1, k / rangees)
        lignes.append([x0, y0, x1, y1, opacite((x0 + x1) / 2, (y0 + y1) / 2)])
    tirage = random.Random(graine)
    points = []
    for _ in range(n):
        xp, yp = sur_plan(tirage.random(), tirage.random())
        ecart = tirage.gauss(0, bruit)
        x, y = xp, yp - ecart
        if 0 <= y <= HAUTEUR:
            points.append([round(x, 1), round(y, 1), round(xp, 1), round(yp, 1), opacite(x, y), ecart > 0])
    return {"contour": [[round(x, 1), round(y, 1)] for x, y in contour],
            "lignes": [[round(v, 1) for v in li[:4]] + [li[4]] for li in lignes], "points": points}


# --- Grille ---------------------------------------------------------------------------------

def grille(cote: float, ecart: float, graine: int) -> list[list[float]]:
    """Cases [x, y, colonne, opacité] qui couvrent le fond ; l'intensité tirée module l'opacité du lieu."""
    tirage = random.Random(graine)
    pas = cote + ecart
    cases = []
    for i in range(int(HAUTEUR // pas) + 1):
        for j in range(int(LARGEUR // pas) + 1):
            x, y = 6 + j * pas, 6 + i * pas
            intensite = 0.35 + 0.65 * tirage.random()
            cases.append([x, y, j, round(opacite(x + cote / 2, y + cote / 2, plein=True) * intensite, 2)])
    return cases


# --- Courbe ---------------------------------------------------------------------------------

def eventail(pivot: list[float], angles: list[float]) -> list[list[float]]:
    """Droites [x0, y0, x1, y1, opacité] qui passent par le pivot, une par angle (degrés), coupées au fond."""
    px, py = pivot
    droites = []
    for angle in angles:
        dx, dy = math.cos(math.radians(angle)), -math.sin(math.radians(angle))
        bornes = []
        for t in (-4000, 4000):
            bornes.append((px + t * dx, py + t * dy))
        (x0, y0), (x1, y1) = _couper(bornes[0], bornes[1])
        # Opacité : celle du bout de la droite le plus éloigné du robot.
        droites.append([x0, y0, x1, y1, max(opacite(x0, y0), opacite(x1, y1), opacite((x0 + px) / 2, (y0 + py) / 2),
                                            opacite((x1 + px) / 2, (y1 + py) / 2))])
    return droites


def _couper(a, b):
    """Segment ab coupé au rectangle du fond (Liang-Barsky)."""
    (x0, y0), (x1, y1) = a, b
    dx, dy = x1 - x0, y1 - y0
    t0, t1 = 0.0, 1.0
    for p, q in ((-dx, x0), (dx, LARGEUR - x0), (-dy, y0), (dy, HAUTEUR - y0)):
        if p == 0:
            continue
        r = q / p
        if p < 0:
            t0 = max(t0, r)
        else:
            t1 = min(t1, r)
    return (x0 + t0 * dx, y0 + t0 * dy), (x0 + t1 * dx, y0 + t1 * dy)


# --- Barres ---------------------------------------------------------------------------------

def barres(nombre: int, graine: int, dominante: int) -> list[float]:
    """Hauteurs relatives (0 à 1) de `nombre` barres : une loi softmax de scores tirés, la barre `dominante`
    recevant le plus grand score."""
    tirage = random.Random(graine)
    scores = sorted((tirage.gauss(0, 1) for _ in range(nombre)), reverse=True)
    autres = scores[1:]
    tirage.shuffle(autres)
    ordre = autres[:dominante] + [scores[0]] + autres[dominante:]
    exp = [math.exp(1.4 * s) for s in ordre]
    maximum = max(exp)
    return [round(e / maximum, 4) for e in exp]


# --- Blocs ----------------------------------------------------------------------------------

def blocs(proportions: list[float], rangees: int, graine: int) -> list[list[float]]:
    """Rangées de blocs : la première suit `proportions` ; les suivantes, des découpages tirés autour.
    Chaque rangée est une liste de parts (somme 1)."""
    tirage = random.Random(graine)
    total = sum(proportions)
    base = [p / total for p in proportions]
    lignes = [base]
    for _ in range(rangees - 1):
        parts = [max(0.04, p * (0.6 + 0.8 * tirage.random())) for p in base]
        s = sum(parts)
        lignes.append([round(p / s, 4) for p in parts])
    return lignes


# --- Arbre ----------------------------------------------------------------------------------

def arbre(racine: list[float], profondeur: int, ecart: float, etage: float, chemin: list[int]) -> dict:
    """Arbre binaire complet : nœuds [x, y, niveau, rang], liens [i, j] (indices des nœuds), et les indices
    des nœuds du chemin suivi (0 : à gauche, 1 : à droite, à chaque niveau)."""
    rx, ry = racine
    noeuds, liens, index = [], [], {}
    for niveau in range(profondeur + 1):
        nombre = 2 ** niveau
        largeur = ecart * (2 ** profondeur) / nombre
        for rang in range(nombre):
            x = rx + (rang - (nombre - 1) / 2) * largeur
            index[(niveau, rang)] = len(noeuds)
            noeuds.append([round(x, 1), ry + niveau * etage, niveau, rang])
            if niveau:
                liens.append([index[(niveau - 1, rang // 2)], index[(niveau, rang)]])
    suivi, rang = [index[(0, 0)]], 0
    for niveau, choix in enumerate(chemin[:profondeur], start=1):
        rang = 2 * rang + choix
        suivi.append(index[(niveau, rang)])
    return {"noeuds": noeuds, "liens": liens, "chemin": suivi}


# --- Réseau ---------------------------------------------------------------------------------

def reseau(couches: list[int], abscisses: list[float], haut: float, bas: float, graine: int) -> dict:
    """Nœuds [x, y, couche] répartis sur chaque couche, liens entre couches voisines, et un chemin tiré
    (un nœud par couche)."""
    if len(couches) != len(abscisses):
        raise ValueError(f"réseau : {len(couches)} couches pour {len(abscisses)} abscisses")
    noeuds, liens, par_couche = [], [], []
    for k, (nombre, x) in enumerate(zip(couches, abscisses)):
        pas = (bas - haut) / (nombre + 1)
        indices = []
        for i in range(nombre):
            indices.append(len(noeuds))
            noeuds.append([x, round(haut + (i + 1) * pas, 1), k])
        par_couche.append(indices)
    for avant, apres in zip(par_couche, par_couche[1:]):
        liens += [[i, j] for i in avant for j in apres]
    tirage = random.Random(graine)
    chemin = [tirage.choice(c) for c in par_couche]
    return {"noeuds": noeuds, "liens": liens, "chemin": chemin}
