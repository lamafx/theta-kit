"""Fond de couverture des familles (A11) et aiguillage vignette / couverture.

Le fond est un SVG de 1080 × 780 placé comme celui du canevas Main (−80, −60), derrière le robot.
Chaque famille y dessine son propre motif, calculé par calculs/couvertures.py : tout en accent, à des
opacités qui s'effacent vers le robot, un seul élément plus marqué.
"""

from __future__ import annotations

from bibliotheque._svg import svg

STYLE = "position: absolute; left: -80px; top: -60px; display: block"


def fond(contenu: list[str]) -> str:
    return svg(1080, 780, contenu, None, STYLE)


def vignette_ou_couverture(nom: str, vignette, couverture, params: dict, theme: dict) -> str:
    forme = params.get("forme", "vignette")
    if forme == "vignette":
        return vignette(params, theme)
    if forme == "couverture":
        return couverture(params, theme)
    raise ValueError(f"{nom} : forme « {forme} » inconnue (vignette, couverture)")
