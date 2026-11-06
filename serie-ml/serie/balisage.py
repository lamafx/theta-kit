"""Balisage des textes du contenu → HTML des gabarits.

Le contenu n'écrit jamais de HTML. Il dispose de quatre marques :

- `$θ$` : symbole mathématique dans une phrase (STIX Two Text, italique) ; `$!η$` le met en accent ;
- `**mots**` : mots en gras ;
- un saut de ligne : retour à la ligne imposé (titres) ;
- les formules (`panneau.formule`, symboles des lignes, étiquettes de cas) suivent la notation de
  `formule()` : `θ_{t+1} = θ_t [−η]∇J(θ_t)`, où `_` met en indice et `[…]` en accent ; `{1}/{n}` écrit une
  fraction, le numérateur au-dessus de la barre et le dénominateur dessous (`{1}/{1 + e⁻ᶻ}`).
"""

from __future__ import annotations

import html
import re
from dataclasses import dataclass

from markupsafe import Markup

from serie import typographie

GRECQUES = "αβγδεζηθικλμνξοπρστυφχψωΓΔΘΛΞΦΨΩ"
GRANDS = "ΣΠ"  # somme et produit : droits et agrandis, comme dans un texte de mathématiques
OPERATEURS = "=−+×←→≈≤≥<>"


def _echapper(texte: str) -> str:
    return html.escape(texte, quote=False)


# --- Formules ---------------------------------------------------------------------------

@dataclass
class Jeton:
    genre: str  # lettre, mot, chiffre, op, grand, nabla, indice, fraction, espace, autre
    texte: str = ""
    accent: bool = False
    contenu: list["Jeton"] | None = None  # l'indice, ou le numérateur d'une fraction
    denominateur: list["Jeton"] | None = None


def _analyser(notation: str, accent: bool = False) -> list[Jeton]:
    jetons: list[Jeton] = []
    i = 0
    while i < len(notation):
        c = notation[i]
        if c == "{" and (fraction := _fraction(notation, i)):
            numerateur, denominateur, i = fraction
            jetons.append(Jeton("fraction", accent=accent, contenu=_analyser(numerateur, accent),
                                denominateur=_analyser(denominateur, accent)))
        elif c == "[":
            fin = _fermante(notation, i, "[", "]")
            jetons.extend(_analyser(notation[i + 1:fin], accent=True))
            i = fin + 1
        elif c == "_":
            if notation[i + 1] == "{":
                fin = _fermante(notation, i + 1, "{", "}")
                interieur, i = notation[i + 2:fin], fin + 1
            else:
                interieur, i = notation[i + 1], i + 2
            jetons.append(Jeton("indice", accent=accent, contenu=_analyser(interieur, accent)))
        elif c.isalpha() and c.isascii():
            j = i
            while j < len(notation) and notation[j].isalpha() and notation[j].isascii():
                j += 1
            genre = "lettre" if j - i == 1 else "mot"
            jetons.append(Jeton(genre, notation[i:j], accent))
            i = j
        elif c in GRECQUES:
            jetons.append(Jeton("lettre", c, accent))
            i += 1
        elif c in GRANDS:
            jetons.append(Jeton("grand", c, accent))
            i += 1
        elif c.isdigit():
            j = i
            while j < len(notation) and (notation[j].isdigit() or notation[j] == ","):
                j += 1
            jetons.append(Jeton("chiffre", notation[i:j], accent))
            i = j
        elif c in OPERATEURS:
            jetons.append(Jeton("op", c, accent))
            i += 1
        elif c == "∇":
            jetons.append(Jeton("nabla", c, accent))
            i += 1
        elif c == " ":
            jetons.append(Jeton("espace", " ", accent))
            i += 1
        else:
            jetons.append(Jeton("autre", c, accent))
            i += 1
    return jetons


def _fraction(notation: str, debut: int) -> tuple[str, str, int] | None:
    """`{a}/{b}` à partir de `debut` : (a, b, position après la fraction), ou None si ce n'en est pas une."""
    fin_num = _fermante(notation, debut, "{", "}")
    if not notation.startswith("/{", fin_num + 1):
        return None
    fin_den = _fermante(notation, fin_num + 2, "{", "}")
    return notation[debut + 1:fin_num], notation[fin_num + 3:fin_den], fin_den + 1


def _fermante(texte: str, debut: int, ouvrante: str, fermante: str) -> int:
    profondeur = 0
    for k in range(debut, len(texte)):
        if texte[k] == ouvrante:
            profondeur += 1
        elif texte[k] == fermante:
            profondeur -= 1
            if profondeur == 0:
                return k
    raise ValueError(f"« {ouvrante} » sans « {fermante} » dans : {texte}")


def _classe(accent: bool, *autres: str) -> str:
    classes = [c for c in autres if c] + (["accent"] if accent else [])
    return f' class="{" ".join(classes)}"' if classes else ""


def _html(jetons: list[Jeton], mode: str, niveau: int = 0) -> str:
    """mode « bloc » : panneau (opérateurs espacés, espaces ignorés) ; « ligne » : espaces gardés."""
    morceaux = []
    for k, j in enumerate(jetons):
        t = _echapper(j.texte)
        if j.genre == "lettre":
            morceaux.append(f"<i{_classe(j.accent)}>{t}</i>")
        elif j.genre == "indice":
            morceaux.append(f"<sub>{_html(j.contenu or [], mode, niveau + 1)}</sub>")
        elif j.genre == "grand":
            morceaux.append(f"<span{_classe(j.accent, 'grand')}>{t}</span>")
        elif j.genre == "fraction":
            morceaux.append(f'<span class="frac"><span class="num">{_html(j.contenu or [], mode, niveau + 1)}</span>'
                            f'<span class="den">{_html(j.denominateur or [], mode, niveau + 1)}</span></span>')
        elif j.genre == "espace":
            if mode == "ligne":
                morceaux.append(" ")
        elif j.genre == "op" and mode == "bloc" and niveau == 0:
            morceaux.append(f"<span{_classe(j.accent, 'op')}>{t}</span>")
        elif j.genre == "nabla" and mode == "bloc" and niveau == 0 and k > 0:
            morceaux.append(f"<span{_classe(j.accent, 'nabla')}>{t}</span>")
        elif j.accent:
            morceaux.append(f'<span class="accent">{t}</span>')
        else:
            morceaux.append(t)
    return "".join(morceaux)


def formule(notation: str, mode: str = "bloc") -> Markup:
    return Markup(_html(_analyser(typographie.math(notation)), mode))


@dataclass
class Symbole:
    """Un symbole de la colonne de gauche d'une page formule."""

    html: Markup
    italique: bool
    accent: bool


def symbole(notation: str) -> Symbole:
    jetons = [j for j in _analyser(typographie.math(notation)) if j.genre != "espace"]
    if len(jetons) == 1 and jetons[0].genre != "indice":
        j = jetons[0]
        return Symbole(Markup(_echapper(j.texte)), j.genre == "lettre", j.accent)
    return Symbole(Markup(_html(jetons, "ligne")), False, False)


# --- Textes -----------------------------------------------------------------------------

_MARQUES = re.compile(r"\$(!?)(.+?)\$|\*\*(.+?)\*\*|\n")
_MATH = re.compile(r"\$(!?)(.+?)\$")
_RESERVE = ""  # tient la place d'un symbole pendant la typographie du texte qui l'entoure


def composer(source: str) -> str:
    """Typographie 9.4 sur un texte balisé : la phrase comme texte, chaque `$…$` comme notation."""
    maths = [f"${m.group(1)}{typographie.math(m.group(2))}$" for m in _MATH.finditer(source)]
    compose = typographie.texte(_MATH.sub(_RESERVE, source))
    morceaux = iter(maths)
    return re.sub(_RESERVE, lambda _: next(morceaux), compose)


def texte(source: str, dans_stix: bool = False) -> Markup:
    """Texte courant : `$x$`, `$!x$`, `**gras**` et sauts de ligne.

    Dans une phrase, un symbole d'une lettre devient un span STIX italique (comme les canevas) ;
    dans un élément déjà en STIX (étiquette de cas), il devient <i>.
    """
    source = composer(source)
    morceaux = []
    pos = 0
    for m in _MARQUES.finditer(source):
        morceaux.append(_echapper(source[pos:m.start()]))
        if m.group(0) == "\n":
            morceaux.append("<br>")
        elif m.group(3) is not None:
            morceaux.append(f"<strong>{_echapper(m.group(3))}</strong>")
        else:
            accent, notation = bool(m.group(1)), m.group(2)
            if dans_stix:
                interieur = _html(_analyser(notation, accent), "ligne")
                morceaux.append(interieur)
            else:
                jetons = _analyser(notation)
                if len(jetons) == 1 and jetons[0].genre == "lettre":
                    morceaux.append(f"<span{_classe(accent, 'm', 'it')}>{_echapper(notation)}</span>")
                else:
                    morceaux.append(f"<span{_classe(accent, 'm')}>{_html(jetons, 'ligne')}</span>")
        pos = m.end()
    morceaux.append(_echapper(source[pos:]))
    return Markup("".join(morceaux))


def titre_point(source: str) -> Markup:
    """Grand titre : le signe final (. ? !) prend la couleur d'accent, comme sur les canevas ; l'espace fine
    qui précède « ? » et « ! » est colorée avec lui."""
    if source.endswith("."):
        return Markup(f'{texte(source[:-1])}<span class="accent">.</span>')
    if source.endswith(("?", "!")):
        signe = source[-1]
        return Markup(f'{texte(source[:-1].rstrip())}<span class="accent">{typographie.FINE}{signe}</span>')
    return texte(source)
