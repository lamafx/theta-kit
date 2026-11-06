"""Robot de la couverture A (session de design n° 2, 2026-11-01) : buste en gros plan, un geste par épisode.

Portage de theta-maj-visuels/theta-maj/robot/robot.mjs. Le robot est dessiné dans son repère local
(600 × 660), motif du sujet à sa GAUCHE, bras actif à gauche à l'écran (épaule en 142, 392). Les 13 gestes et
les 5 placements sur la couverture 1080 × 1350 sont dans robot-gestes.json :

- `robot(geste, accent, ident, fondu, miroir, doigts)` : le robot dans son repère local, un `<g>` ;
- `placer_robot(geste, position, …)` : le même, placé sur la couverture (translation, échelle, miroir) ;
- `placement(position)` : la zone du motif et la place du titre pour cette position.

Le verbe d'un épisode donne le geste, le geste donne la position : le robot se met là où son bras atteint le
motif, ses yeux suivent son geste.
"""

from __future__ import annotations

import json
import math
from pathlib import Path

from bibliotheque._svg import n

_DONNEES = json.loads((Path(__file__).resolve().parent / "robot-gestes.json").read_text(encoding="utf-8"))
GESTES: dict = _DONNEES["gestes"]
PLACEMENTS: dict = _DONNEES["placements"]

C = {"contour": "#8F9BAA", "bras": "#E7ECF1", "fond": "#0A0F17", "blanc": "#F5F8FC", "clair": "#8DB8FF",
     "oeil": "#9CC6FF"}


def _defs(p: str, fondu: tuple[float, float] = (470, 630)) -> str:
    f0, f1 = fondu
    return f"""<defs>
<radialGradient id="{p}-shell" cx="38%" cy="28%" r="80%"><stop offset="0" stop-color="#FFFFFF"/><stop offset="0.55" stop-color="#E4E9EF"/><stop offset="1" stop-color="#97A3B2"/></radialGradient>
<linearGradient id="{p}-visor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1C2735"/><stop offset="1" stop-color="#04070B"/></linearGradient>
<linearGradient id="{p}-bronze" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F3D3A1"/><stop offset="0.5" stop-color="#C08A52"/><stop offset="1" stop-color="#7E532C"/></linearGradient>
<linearGradient id="{p}-metal" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#5F6974"/><stop offset="0.45" stop-color="#D9DFE6"/><stop offset="1" stop-color="#5A636E"/></linearGradient>
<radialGradient id="{p}-disc" cx="40%" cy="35%" r="70%"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#A3AEBB"/></radialGradient>
<filter id="{p}-glow" x="-80%" y="-120%" width="260%" height="340%"><feGaussianBlur stdDeviation="5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
<linearGradient id="{p}-fade" gradientUnits="userSpaceOnUse" x1="0" y1="{n(f0)}" x2="0" y2="{n(f1)}"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#000000"/></linearGradient>
<mask id="{p}-mask" maskUnits="userSpaceOnUse" x="-400" y="-200" width="1400" height="1100"><rect x="-400" y="-200" width="1400" height="1100" fill="url(#{p}-fade)"/></mask>
</defs>"""


def _epaule(p: str, x: float, y: float) -> str:
    return (f'<circle cx="{n(x)}" cy="{n(y)}" r="24" fill="url(#{p}-shell)"/>'
            f'<circle cx="{n(x)}" cy="{n(y)}" r="16" fill="none" stroke="url(#{p}-bronze)" stroke-width="5"/>')


def _corps(p: str, accent: str) -> str:
    return f"""<rect x="275" y="268" width="50" height="72" rx="8" fill="url(#{p}-metal)"/>
<ellipse cx="300" cy="338" rx="46" ry="8" fill="url(#{p}-bronze)"/>
<path d="M110 660 C110 420 160 345 230 337 L370 337 C440 345 490 420 490 660 Z" fill="url(#{p}-shell)"/>
<path d="M110 660 C110 420 160 345 230 337 L370 337 C440 345 490 420 490 660" fill="none" stroke="{C['clair']}" stroke-opacity="0.35" stroke-width="1.5"/>
<path d="M200 395 Q300 420 400 395" fill="none" stroke="#B7C1CD" stroke-width="2"/>
<circle cx="300" cy="448" r="20" fill="none" stroke="#B7C1CD" stroke-width="2"/>
<circle cx="300" cy="448" r="10" fill="{accent}" filter="url(#{p}-glow)"/>"""


def _tete(p: str, inclinaison: float, regard: list[float]) -> str:
    ex, ey = 247 + regard[0], 179 + regard[1]
    return f"""<g transform="rotate({n(inclinaison)} 300 170)">
<path d="M190 160 C190 20 410 20 410 160" fill="none" stroke="#262E39" stroke-width="16" stroke-linecap="round"/>
<ellipse cx="300" cy="170" rx="120" ry="110" fill="url(#{p}-shell)"/>
<ellipse cx="300" cy="170" rx="120" ry="110" fill="none" stroke="{C['clair']}" stroke-opacity="0.4" stroke-width="1.5"/>
<rect x="214" y="132" width="172" height="102" rx="51" fill="url(#{p}-visor)"/>
<path d="M234 160 Q258 142 296 140" fill="none" stroke="#FFFFFF" stroke-opacity="0.18" stroke-width="5" stroke-linecap="round"/>
<g filter="url(#{p}-glow)"><rect x="{n(ex)}" y="{n(ey)}" width="34" height="14" rx="7" fill="{C['oeil']}"/><rect x="{n(ex + 72)}" y="{n(ey)}" width="34" height="14" rx="7" fill="{C['oeil']}"/></g>
<circle cx="178" cy="182" r="42" fill="url(#{p}-shell)"/><circle cx="178" cy="182" r="32" fill="none" stroke="url(#{p}-bronze)" stroke-width="7"/><circle cx="178" cy="182" r="25" fill="url(#{p}-disc)"/>
<circle cx="422" cy="182" r="42" fill="url(#{p}-shell)"/><circle cx="422" cy="182" r="32" fill="none" stroke="url(#{p}-bronze)" stroke-width="7"/><circle cx="422" cy="182" r="25" fill="url(#{p}-disc)"/>
</g>"""


def _trait(d: str, large: float, fin: float) -> str:
    return (f'<path d="{d}" fill="none" stroke="{C["contour"]}" stroke-width="{n(large)}" stroke-linecap="round" '
            f'stroke-linejoin="round"/>\n'
            f'<path d="{d}" fill="none" stroke="{C["bras"]}" stroke-width="{n(fin)}" stroke-linecap="round" '
            f'stroke-linejoin="round"/>')


def _bras(p: str, pts: list[list[float]]) -> str:
    d = "M" + " L".join(f"{n(x)} {n(y)}" for x, y in pts)
    ex, ey = pts[1]
    return _trait(d, 50, 42) + (f'<circle cx="{n(ex)}" cy="{n(ey)}" r="15" fill="none" stroke="url(#{p}-bronze)" '
                                f'stroke-width="5"/>')


def _doigt(x1: float, y1: float, x2: float, y2: float) -> str:
    return _trait(f"M{n(x1)} {n(y1)} L{n(x2)} {n(y2)}", 22, 15)


def _main(p: str, m: dict) -> str:
    t, x, y = m["type"], m["x"], m["y"]
    angle = m.get("angle", 0)
    poing = (f'<circle cx="{n(x)}" cy="{n(y)}" r="30" fill="url(#{p}-shell)" stroke="{C["contour"]}" '
             f'stroke-width="3"/>')
    rad = math.radians(angle)
    if t == "menton":
        return _doigt(x + 10, y - 12, x + 32, y - 34) + poing
    if t == "index":
        fx, fy = x + math.cos(rad) * 70, y + math.sin(rad) * 70
        return _doigt(x + math.cos(rad) * 14, y + math.sin(rad) * 14, fx, fy) + _doigt(x - 6, y - 20, x - 12, y - 40) + poing
    if t == "plat":
        lg = m.get("longueur", 120)
        return (f'<rect x="{n(x - lg / 2)}" y="{n(y - 22)}" width="{n(lg)}" height="44" rx="22" fill="url(#{p}-shell)" '
                f'stroke="{C["contour"]}" stroke-width="3" transform="rotate({n(angle)} {n(x)} {n(y)})"/>')
    if t == "pince":
        return _doigt(x - 16, y + 18, x - 20, y + 36) + _doigt(x + 12, y + 20, x + 10, y + 36) + poing
    if t == "paume":
        return (f'<g transform="rotate({n(angle)} {n(x)} {n(y)})">{_doigt(x + 18, y + 6, x + 34, y - 18)}'
                f'<rect x="{n(x - 23)}" y="{n(y - 48)}" width="46" height="96" rx="23" fill="url(#{p}-shell)" '
                f'stroke="{C["contour"]}" stroke-width="3"/></g>')
    if t == "ouverte":
        return (f'<rect x="{n(x - 48)}" y="{n(y - 16)}" width="96" height="32" rx="16" fill="url(#{p}-shell)" '
                f'stroke="{C["contour"]}" stroke-width="3"/>')
    if t == "doigts":
        k = max(1, min(5, m.get("doigts", 3)))
        ecarts = [0.0] if k == 1 else [-30 + 60 * i / (k - 1) for i in range(k)]
        s = ""
        for a in ecarts:
            r = math.radians(a - 90)
            s += _doigt(x + math.cos(r) * 18, y + math.sin(r) * 18, x + math.cos(r) * 62, y + math.sin(r) * 62)
        return s + poing
    return poing


def _accessoire(p: str, a: dict, accent: str, miroir: bool) -> str:
    t = a["type"]
    if t == "question":
        contre = f' transform="translate({n(2 * a["x"])} 0) scale(-1 1)"' if miroir else ""
        return (f'<text x="{n(a["x"])}" y="{n(a["y"])}" font-family="Geist, sans-serif" font-weight="600" '
                f'font-size="{n(a["taille"])}" fill="{accent}" fill-opacity="{a.get("opacite", 1):g}" '
                f'text-anchor="middle"{contre}>{a.get("texte", "?")}</text>')
    if t == "point":
        return f'<circle cx="{n(a["x"])}" cy="{n(a["y"])}" r="11" fill="{C["fond"]}" stroke="{C["clair"]}" stroke-width="3"/>'
    if t == "loupe":
        dx, dy = a["cx"] - a["x"], a["cy"] - a["y"]
        d = math.hypot(dx, dy)
        bx, by = a["cx"] - dx / d * a["r"], a["cy"] - dy / d * a["r"]
        cx, cy, r = a["cx"], a["cy"], a["r"]
        return (f'<path d="M{n(a["x"])} {n(a["y"])} L{n(bx)} {n(by)}" stroke="#262E39" stroke-width="18" '
                f'stroke-linecap="round"/>\n'
                f'<circle cx="{n(cx)}" cy="{n(cy)}" r="{n(r)}" fill="{accent}" fill-opacity="0.16" '
                f'stroke="url(#{p}-bronze)" stroke-width="10"/>\n'
                f'<path d="M{n(cx - r * 0.5)} {n(cy - r * 0.2)} Q{n(cx - r * 0.4)} {n(cy - r * 0.55)} '
                f'{n(cx - r * 0.05)} {n(cy - r * 0.6)}" fill="none" stroke="#FFFFFF" stroke-opacity="0.5" '
                f'stroke-width="5" stroke-linecap="round"/>')
    if t == "bouton":
        x, y, r = a["x"], a["y"], a["r"]
        return (f'<circle cx="{n(x)}" cy="{n(y)}" r="{n(r)}" fill="#1E2938" stroke="{C["clair"]}" stroke-width="3"/>\n'
                f'<line x1="{n(x)}" y1="{n(y)}" x2="{n(x - r * 0.6)}" y2="{n(y - r * 0.6)}" stroke="{accent}" '
                f'stroke-width="6" stroke-linecap="round"/>\n'
                f'<g stroke="{C["clair"]}" stroke-opacity="0.6" stroke-width="3" stroke-linecap="round">'
                f'<line x1="{n(x - r - 12)}" y1="{n(y)}" x2="{n(x - r - 22)}" y2="{n(y)}"/>'
                f'<line x1="{n(x)}" y1="{n(y - r - 12)}" x2="{n(x)}" y2="{n(y - r - 22)}"/>'
                f'<line x1="{n(x - r * 0.8 - 8)}" y1="{n(y - r * 0.8 - 8)}" x2="{n(x - r * 0.8 - 16)}" '
                f'y2="{n(y - r * 0.8 - 16)}"/></g>')
    if t == "crayon":
        ang = math.degrees(math.atan2(a["y2"] - a["y1"], a["x2"] - a["x1"]))
        lg = math.hypot(a["x2"] - a["x1"], a["y2"] - a["y1"])
        return (f'<g transform="translate({n(a["x1"])} {n(a["y1"])}) rotate({n(ang)})">'
                f'<rect x="0" y="-11" width="{n(lg - 26)}" height="22" rx="6" fill="{C["blanc"]}" '
                f'stroke="{C["contour"]}" stroke-width="2"/>'
                f'<path d="M{n(lg - 26)} -11 L{n(lg)} 0 L{n(lg - 26)} 11 Z" fill="{accent}"/></g>')
    if t == "objet":
        col = C["blanc"] if a.get("couleur") == "blanc" else accent
        x, y = a["x"], a["y"]
        if a.get("forme") == "cercle":
            return f'<circle cx="{n(x)}" cy="{n(y)}" r="26" fill="{col}"/>'
        if a.get("forme") == "carre":
            return f'<rect x="{n(x - 24)}" y="{n(y - 24)}" width="48" height="48" rx="8" fill="{col}"/>'
        return (f'<rect x="{n(x - 70)}" y="{n(y - 36)}" width="140" height="72" rx="14" fill="{col}"/>'
                f'<path d="M{n(x - 70)} {n(y - 8)} H{n(x + 70)}" stroke="{C["fond"]}" stroke-opacity="0.25" '
                f'stroke-width="3"/>')
    if t == "ondes":
        x, y = a["x"], a["y"]
        arcs = "".join(f'<path d="M{n(x - r * 0.5)} {n(y - r)} A{r} {r} 0 0 1 {n(x - r * 0.5)} {n(y + r)}" '
                       f'stroke-opacity="{1 - i * 0.28:g}"/>' for i, r in enumerate((30, 56, 82)))
        return f'<g fill="none" stroke="{accent}" stroke-width="5" stroke-linecap="round">{arcs}</g>'
    return ""


def robot(geste: str = "visiere", accent: str = "#4C8DFF", ident: str = "r", fondu=True, miroir: bool = False,
          doigts: int | None = None, label: str | None = None) -> str:
    """Le robot dans son repère local (600 × 660), motif à gauche."""
    g = GESTES.get(geste)
    if g is None:
        raise ValueError(f"geste inconnu : {geste}")
    p = ident
    actif_gauche = any(b["points"][0][0] == 142 for b in g["bras"])
    actif_droite = any(b["points"][0][0] == 458 for b in g["bras"])
    s = _defs(p, tuple(fondu) if isinstance(fondu, (list, tuple)) else (470, 630))
    masque = f' mask="url(#{p}-mask)"' if fondu else ""
    s += (f"<g{masque}>{_corps(p, accent)}{'' if actif_gauche else _epaule(p, 142, 392)}"
          f"{'' if actif_droite else _epaule(p, 458, 392)}</g>")
    s += _tete(p, g.get("inclinaison", 0), g.get("regard", [0, 0]))
    for b in g["bras"]:
        s += _bras(p, b["points"])
    for b in g["bras"]:
        m = {**b["main"], "doigts": doigts} if doigts and b["main"]["type"] == "doigts" else b["main"]
        s += _main(p, m)
    for a in g.get("accessoires", []):
        s += _accessoire(p, a, accent, miroir)
    for b in g["bras"]:
        s += _epaule(p, *b["points"][0])
    d = g["description"]
    aria = label or f"Le robot de la série, {d[0].lower()}{d[1:]}"
    return f'<g role="img" aria-label="{aria.replace(chr(34), "&quot;")}">{s}</g>'


def placement(position: str) -> dict:
    pl = PLACEMENTS.get(position)
    if pl is None:
        raise ValueError(f"position inconnue : {position}")
    return pl


def placer_robot(geste: str, position: str | None = None, accent: str = "#4C8DFF", ident: str = "r",
                 fondu: bool = True, doigts: int | None = None, label: str | None = None) -> str:
    """Le robot placé sur une couverture 1080 × 1350, selon la position du geste ou une position imposée."""
    g = GESTES.get(geste)
    if g is None:
        raise ValueError(f"geste inconnu : {geste}")
    pl = placement(position or g["position"])
    tx, ty = pl["translate"]
    sx = -pl["scale"] if pl["miroir"] else pl["scale"]
    f = pl.get("fondu", True) if fondu else False
    return (f'<g transform="translate({n(tx)} {n(ty)}) scale({sx:g} {pl["scale"]:g})">'
            f'{robot(geste, accent, ident, f, pl["miroir"], doigts, label)}</g>')
