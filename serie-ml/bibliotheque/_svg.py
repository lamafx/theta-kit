"""Outils communs aux familles : nombres, textes et marqueurs SVG."""

from __future__ import annotations

import html
import math
import re

GEIST = "Geist, sans-serif"
MONO = "Geist Mono, monospace"
STIX = "STIX Two Text, serif"


def n(x: float) -> str:
    """Coordonnée au dixième, sans zéro inutile."""
    r = round(x + 0.0, 1)
    return str(int(r)) if r == int(r) else f"{r:.1f}"


def nombre_fr(x: float, decimales: int = 2) -> str:
    """0.24 → « 0,24 », −6 → « −6 » (signe moins mathématique)."""
    t = f"{abs(x):.{decimales}f}".rstrip("0").rstrip(".")
    return ("−" if x < 0 and t != "0" else "") + t.replace(".", ",")


def esc(t: str) -> str:
    """Texte affiché dans un visuel : typographie 9.4, puis échappement."""
    from serie.typographie import texte

    return html.escape(texte(t), quote=False)


def attrs(**a) -> str:
    morceaux = []
    for k, v in a.items():
        if v is None:
            continue
        morceaux.append(f'{k.rstrip("_").replace("_", "-")}="{n(v) if isinstance(v, float) else v}"')
    return " ".join(morceaux)


def balise(nom: str, **a) -> str:
    return f"<{nom} {attrs(**a)}></{nom}>"


def ligne(x1, y1, x2, y2, **a) -> str:
    return balise("line", x1=float(x1), y1=float(y1), x2=float(x2), y2=float(y2), **a)


def cercle(cx, cy, r, **a) -> str:
    return balise("circle", cx=float(cx), cy=float(cy), r=float(r), **a)


def points(pts) -> str:
    return " ".join(f"{n(x)},{n(y)}" for x, y in pts)


def texte_svg(source: str, taille_math: float | None = None, **a) -> str:
    """Texte d'un visuel ; `$J(θ)$` devient un tspan STIX italique (taille `taille_math`)."""
    from serie.balisage import composer

    source = composer(source)
    morceaux = []
    pos = 0
    for m in re.finditer(r"\$(.+?)\$", source):
        morceaux.append(html.escape(source[pos:m.start()], quote=False))
        taille = f' font-size="{n(float(taille_math))}"' if taille_math else ""
        morceaux.append(f'<tspan font-family="{STIX}" font-style="italic"{taille}>'
                        f'{html.escape(m.group(1), quote=False)}</tspan>')
        pos = m.end()
    morceaux.append(html.escape(source[pos:], quote=False))
    return f"<text {attrs(**a)}>{''.join(morceaux)}</text>"


def marqueur(ident: str, couleur: str, ref_x: float = 7, taille: float = 8) -> str:
    return (
        f'<marker id="{ident}" viewBox="0 0 10 10" refX="{n(ref_x)}" refY="5" markerWidth="{n(taille)}" '
        f'markerHeight="{n(taille)}" orient="auto"><path d="M0 0L10 5L0 10z" fill="{couleur}"></path></marker>'
    )


def raccourcir(x1, y1, x2, y2, d) -> tuple[float, float]:
    """Point situé à d pixels avant (x2, y2) sur le segment."""
    lg = math.hypot(x2 - x1, y2 - y1)
    return x2 - (x2 - x1) * d / lg, y2 - (y2 - y1) * d / lg


def svg(largeur, hauteur, contenu: list[str], etiquette: str | None = None, style: str = "display: block",
        vue: tuple[float, float] | None = None) -> str:
    vw, vh = vue or (largeur, hauteur)
    role = f'role="img" aria-label="{html.escape(etiquette)}"' if etiquette else 'aria-hidden="true"'
    return (
        f'<svg viewBox="0 0 {n(vw)} {n(vh)}" width="{n(largeur)}" height="{n(hauteur)}" {role} style="{style}">\n'
        + "\n".join(contenu) + "\n</svg>"
    )
