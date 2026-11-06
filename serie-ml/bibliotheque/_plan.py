"""Repère du plan (x, y) → pixels, partagé par les droites de la Courbe et les formes du Nuage.

Les axes reprennent ceux de la Courbe de l'épisode 08 : trait gris de filet, étiquettes Geist 16 en gris
secondaire au bout de l'axe.
"""

from __future__ import annotations

from bibliotheque._svg import GEIST, ligne, texte_svg


class Plan:
    """Origine : pixel de (0, 0) ; échelle : pixels par unité en x et en y (y vers le haut)."""

    def __init__(self, origine, echelle):
        self.ox, self.oy = origine
        self.sx, self.sy = echelle

    def x(self, x: float) -> float:
        return self.ox + self.sx * x

    def y(self, y: float) -> float:
        return self.oy - self.sy * y

    def pt(self, x: float, y: float) -> tuple[float, float]:
        return self.x(x), self.y(y)


def plan(p) -> Plan:
    return Plan(p["origine"], p["echelle"])


def axes(r: Plan, domaine, plage, th, textes: dict) -> list[str]:
    """Axe des x (à y = 0, ou en bas de la plage) et axe des y (à x = 0, ou à gauche du domaine)."""
    (x0, x1), (y0, y1) = domaine, plage
    ya = r.y(min(max(0, y0), y1))
    xa = r.x(min(max(0, x0), x1))
    c = [ligne(r.x(x0), ya, r.x(x1), ya, stroke=th["filet"], stroke_width=2),
         ligne(xa, r.y(y0), xa, r.y(y1), stroke=th["filet"], stroke_width=2)]
    if textes.get("x"):
        # 4 px de retrait : la dernière lettre en italique (« x ») déborde sinon du visuel en 26 px.
        c.append(texte_svg(textes["x"], 26, x=float(r.x(x1) - 4), y=float(ya + 32), text_anchor="end",
                           font_family=GEIST, font_size=22, fill=th["secondaire"]))
    if textes.get("y"):
        c.append(texte_svg(textes["y"], 26, x=float(xa + 14), y=float(r.y(y1) + 14), font_family=GEIST,
                           font_size=22, fill=th["secondaire"]))
    return c
